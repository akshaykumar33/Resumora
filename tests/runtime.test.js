// Comprehensive Integration & Unit Test Suite for Resumora Core Starter
import { describe, test } from 'vitest';
import assert from 'node:assert/strict';

import {
  ContinuityRuntime,
  WorkspaceLockedError,
  ChecksumMismatchError,
  InvalidIdentityError,
  buildStorageKey,
  buildPrefix,
} from '../packages/core/src/index.js';
import { MemoryStorageAdapter } from '../packages/storage-memory/src/index.js';

describe('Resumora Core Starter: Complete Recovery Loop', () => {
  test('1. Architecture: Application -> Core Runtime -> Workspace -> Intent -> Checkpoint -> Memory Adapter', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    const context = {
      tenantId: 'enterprise_alpha',
      userId: 'user_analyst_1',
      workspaceId: 'form_25_step_onboarding',
    };

    // Open workspace
    const workspace = await runtime.openWorkspace(context);
    assert.equal(workspace.state, 'active');

    // Record sequential intents
    const intent1 = await workspace.recordIntent('INPUT_CHANGE', {
      field: 'legalName',
      value: 'Acme Global Corp',
    });
    const intent2 = await workspace.recordIntent('SELECT_STEP', { step: 2 });
    assert.equal(intent1.sequence, 1);
    assert.equal(intent2.sequence, 2);

    // Verify intents recorded in storage
    const keys = await storage.listKeys(
      'resumora::enterprise_alpha::user_analyst_1::form_25_step_onboarding::intent::',
    );
    assert.equal(keys.length, 2);

    // Save milestone checkpoint
    const checkpoint = await workspace.saveCheckpoint(
      { legalName: 'Acme Global Corp', step: 2, completedSections: ['basic-info'] },
      { step: 2, totalSteps: 25, route: '/onboarding/step-2' },
    );
    assert.ok(checkpoint.checksum);
    assert.equal(checkpoint.sequence, 2);

    // Intentionally simulate application interruption / restart
    // Create new runtime instance sharing the same storage
    const restoredRuntime = new ContinuityRuntime({ storage });
    const restoredWorkspace = await restoredRuntime.openWorkspace(context);

    // Restore state
    const recovery = await restoredWorkspace.restoreLatestCheckpoint();
    assert.ok(recovery);
    assert.equal(recovery.state.legalName, 'Acme Global Corp');
    assert.equal(recovery.state.step, 2);
    assert.equal(recovery.unappliedIntents.length, 0);
  });

  test('2. Security Invariant: Persistence != Authorization (Lock / Reauth / Unlock)', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    const context = {
      tenantId: 'fintech_bank',
      userId: 'advisor_44',
      workspaceId: 'loan_app_777',
    };

    const workspace = await runtime.openWorkspace(context);
    await workspace.recordIntent('SET_AMOUNT', { amount: 500000 });
    await workspace.saveCheckpoint({ amount: 500000, status: 'review' });

    // User logs out or token expires -> Lock workspace
    workspace.lock();
    assert.equal(workspace.state, 'locked');

    // Attempting to record intent or read state while locked MUST throw WorkspaceLockedError
    await assert.rejects(
      async () => await workspace.recordIntent('SET_AMOUNT', { amount: 600000 }),
      WorkspaceLockedError,
    );

    await assert.rejects(
      async () => await workspace.restoreLatestCheckpoint(),
      WorkspaceLockedError,
    );

    // Valid reauthentication unlocks workspace
    const unlocked = workspace.unlock({ isValid: true, token: 'fresh_jwt' });
    assert.equal(unlocked, true);
    assert.equal(workspace.state, 'active');

    // Access restored
    const recovery = await workspace.restoreLatestCheckpoint();
    assert.equal(recovery.state.amount, 500000);
  });

  test('3. Multi-Tenant Isolation Invariant: Strict namespace separation', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    const tenantA = { tenantId: 'tenant_A', userId: 'user_1', workspaceId: 'doc_shared' };
    const tenantB = { tenantId: 'tenant_B', userId: 'user_1', workspaceId: 'doc_shared' };

    const wsA = await runtime.openWorkspace(tenantA);
    const wsB = await runtime.openWorkspace(tenantB);

    await wsA.saveCheckpoint({ secret: 'CONFIDENTIAL_TENANT_A' });
    await wsB.saveCheckpoint({ secret: 'CONFIDENTIAL_TENANT_B' });

    const recoveryA = await wsA.restoreLatestCheckpoint();
    const recoveryB = await wsB.restoreLatestCheckpoint();

    assert.equal(recoveryA.state.secret, 'CONFIDENTIAL_TENANT_A');
    assert.equal(recoveryB.state.secret, 'CONFIDENTIAL_TENANT_B');

    // Verify key isolation
    const keysA = await storage.listKeys('resumora::tenant_A::');
    const keysB = await storage.listKeys('resumora::tenant_B::');
    assert.ok(keysA.length > 0);
    assert.ok(keysB.length > 0);
    assert.ok(keysA.every((k) => k.includes('tenant_A') && !k.includes('tenant_B')));
  });

  test('4. Purge Policy: Complete deletion on revocation', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    const context = { tenantId: 'org_x', userId: 'user_x', workspaceId: 'ws_temp' };
    const ws = await runtime.openWorkspace(context);

    await ws.recordIntent('ACTION_1', {});
    await ws.saveCheckpoint({ data: 'to_be_purged' });

    // Execute purge
    await ws.purge();
    assert.equal(ws.state, 'purged');

    // Storage keys must be completely gone
    const remainingKeys = await storage.listKeys('resumora::org_x::user_x::ws_temp::');
    assert.equal(remainingKeys.length, 0);
  });

  test('5. Checksum Tamper Detection: Detects corrupted state', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    const context = { tenantId: 'org_sec', userId: 'user_sec', workspaceId: 'ws_tamper' };
    const ws = await runtime.openWorkspace(context);

    await ws.saveCheckpoint({ score: 100 });

    // Simulate malicious external modification to stored bytes
    const key = 'resumora::org_sec::user_sec::ws_tamper::checkpoint::latest';
    const rawBytes = await storage.get(key);
    const parsed = JSON.parse(new TextDecoder().decode(rawBytes));
    parsed.state.score = 999999; // Tampered without updating checksum
    await storage.set(key, new TextEncoder().encode(JSON.stringify(parsed)));

    // Recovery must detect tamper and throw ChecksumMismatchError
    await assert.rejects(async () => await ws.restoreLatestCheckpoint(), ChecksumMismatchError);
  });

  test('6. Fault Simulation: Handles storage write failures gracefully', async () => {
    const faultyStorage = new MemoryStorageAdapter({ faultOnWrite: true });
    const runtime = new ContinuityRuntime({ storage: faultyStorage });

    const context = { tenantId: 't', userId: 'u', workspaceId: 'w' };
    const ws = await runtime.openWorkspace(context);

    await assert.rejects(
      async () => await ws.recordIntent('WILL_FAIL', {}),
      /Simulated storage write fault/,
    );
  });

  test('7. Multi-Tenant Isolation Invariant: IDs containing the key separator cannot reach another tenant', async () => {
    const storage = new MemoryStorageAdapter();
    const runtime = new ContinuityRuntime({ storage });

    // Before validation, tenant "acme::alice" / user "w1" / workspace "x" produced the same
    // storage keys as tenant "acme" / user "alice" / workspace "w1::x".
    const forged = { tenantId: 'acme::alice', userId: 'w1', workspaceId: 'x' };
    const legitimate = { tenantId: 'acme', userId: 'alice', workspaceId: 'w1::x' };

    await assert.rejects(runtime.openWorkspace(legitimate), InvalidIdentityError);
    await assert.rejects(runtime.openWorkspace(forged), InvalidIdentityError);
    assert.deepEqual(await storage.listKeys(), []);
  });

  test('8. Identity Validation: every identity segment is checked against an allowlist', async () => {
    const runtime = new ContinuityRuntime({ storage: new MemoryStorageAdapter() });
    const base = { tenantId: 'tenant_A', userId: 'user_1', workspaceId: 'doc_1' };

    const invalid = ['a::b', 'a:', ':a', '', ' ', 'a b', 'a\nb', 'ünï', 'x'.repeat(129), 42, null];
    for (const field of ['tenantId', 'userId', 'workspaceId']) {
      await assert.rejects(
        runtime.openWorkspace({ ...base, [field]: undefined }),
        InvalidIdentityError,
      );
      for (const value of invalid) {
        const context = { ...base, [field]: value };
        await assert.rejects(runtime.openWorkspace(context), InvalidIdentityError);
        assert.throws(() => runtime.getWorkspace(context), InvalidIdentityError);
        assert.throws(() => buildStorageKey(context, 'intent', '1'), InvalidIdentityError);
        assert.throws(() => buildPrefix(context), InvalidIdentityError);
      }
    }

    const valid = [
      '3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b',
      'user+tag@example.com',
      'tenant-1.eu',
      'ORG_X',
      'x'.repeat(128),
    ];
    for (const value of valid) {
      const ws = await runtime.openWorkspace({ ...base, workspaceId: value });
      assert.equal(ws.state, 'active');
    }
  });

  test('9. Identity Validation: the error does not echo the rejected value', async () => {
    const runtime = new ContinuityRuntime({ storage: new MemoryStorageAdapter() });
    const context = { tenantId: 'tenant::<script>', userId: 'u', workspaceId: 'w' };

    await assert.rejects(runtime.openWorkspace(context), (error) => {
      assert.ok(error instanceof InvalidIdentityError);
      assert.equal(error.code, 'INVALID_IDENTITY');
      assert.match(error.message, /tenantId/);
      assert.doesNotMatch(error.message, /<script>/);
      return true;
    });
  });

  test('10. Recovery Loop: intents recorded before any checkpoint survive a restart', async () => {
    const storage = new MemoryStorageAdapter();
    const context = { tenantId: 'org_new', userId: 'user_new', workspaceId: 'draft_1' };

    const ws = await new ContinuityRuntime({ storage }).openWorkspace(context);
    await ws.recordIntent('INPUT_CHANGE', { field: 'title', value: 'Roof inspection' });
    await ws.recordIntent('INPUT_CHANGE', { field: 'floors', value: 3 });

    // Simulate a restart before the first checkpoint was ever written
    const restored = await new ContinuityRuntime({ storage }).openWorkspace(context);
    const recovery = await restored.restoreLatestCheckpoint();

    assert.ok(recovery, 'recorded work must not be reported as nothing to restore');
    assert.equal(recovery.checkpoint, null);
    assert.equal(recovery.state, null);
    assert.deepEqual(
      recovery.unappliedIntents.map((intent) => [intent.sequence, intent.payload.field]),
      [
        [1, 'title'],
        [2, 'floors'],
      ],
    );

    // The recovered journal continues from the restored sequence
    const next = await restored.recordIntent('SELECT_STEP', { step: 2 });
    assert.equal(next.sequence, 3);
  });

  test('11. Recovery Loop: a workspace with no recorded work has nothing to restore', async () => {
    const runtime = new ContinuityRuntime({ storage: new MemoryStorageAdapter() });
    const ws = await runtime.openWorkspace({ tenantId: 't', userId: 'u', workspaceId: 'empty' });

    assert.equal(await ws.restoreLatestCheckpoint(), null);
  });
});
