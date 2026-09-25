// Storage Key Formatting & Byte Serialization Helpers
import { InvalidIdentityError, type IdentityContext } from './types.js';

// Identity segments are joined with '::' to build storage keys, so a segment containing ':'
// could forge another tenant's namespace. An allowlist keeps keys unambiguous.
const IDENTITY_SEGMENT = /^[A-Za-z0-9._@+-]{1,128}$/;
const IDENTITY_FIELDS = [
  'tenantId',
  'userId',
  'workspaceId',
] as const satisfies readonly (keyof IdentityContext)[];

// Validates at runtime as well as by type: JavaScript callers bypass the type system.
export function assertValidIdentity(context: unknown): asserts context is IdentityContext {
  for (const field of IDENTITY_FIELDS) {
    const value =
      typeof context === 'object' && context !== null
        ? (context as Partial<Record<keyof IdentityContext, unknown>>)[field]
        : undefined;
    if (typeof value !== 'string' || !IDENTITY_SEGMENT.test(value)) {
      throw new InvalidIdentityError(field);
    }
  }
}

export function buildStorageKey(
  context: IdentityContext,
  recordType: string,
  recordId: string,
): string {
  assertValidIdentity(context);
  const { tenantId, userId, workspaceId } = context;
  return `resumora::${tenantId}::${userId}::${workspaceId}::${recordType}::${recordId}`;
}

export function buildPrefix(context: IdentityContext, recordType?: string): string {
  assertValidIdentity(context);
  const { tenantId, userId, workspaceId } = context;
  if (recordType) {
    return `resumora::${tenantId}::${userId}::${workspaceId}::${recordType}::`;
  }
  return `resumora::${tenantId}::${userId}::${workspaceId}::`;
}

export function serializePayload(payload: unknown): Uint8Array {
  const json = JSON.stringify(payload);
  return new TextEncoder().encode(json);
}

export function deserializePayload(bytes: Uint8Array | null): unknown {
  if (!bytes) return null;
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

// Simple deterministic hash for checksum validation
export function computeChecksum(state: unknown): string {
  const json = JSON.stringify(state);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}
