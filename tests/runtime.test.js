// Comprehensive Integration & Unit Test Suite for Resumora Core Starter
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  ContinuityRuntime,
  WorkspaceLockedError,
  ChecksumMismatchError,
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
});
