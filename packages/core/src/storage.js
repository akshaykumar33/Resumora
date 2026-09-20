// Storage Key Formatting & Byte Serialization Helpers
import { StorageError } from './types.js';

export function buildStorageKey(context, recordType, recordId) {
  const { tenantId, userId, workspaceId } = context;
  if (!tenantId || !userId || !workspaceId) {
    throw new StorageError(
      'Tenant ID, User ID, and Workspace ID are all strictly required to generate a storage key.',
    );
  }
  return `resumora::${tenantId}::${userId}::${workspaceId}::${recordType}::${recordId}`;
}

export function buildPrefix(context, recordType) {
  const { tenantId, userId, workspaceId } = context;
  if (recordType) {
    return `resumora::${tenantId}::${userId}::${workspaceId}::${recordType}::`;
  }
  return `resumora::${tenantId}::${userId}::${workspaceId}::`;
}

export function serializePayload(payload) {
  const json = JSON.stringify(payload);
  return new TextEncoder().encode(json);
}

export function deserializePayload(bytes) {
  if (!bytes) return null;
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

// Simple deterministic hash for checksum validation
export function computeChecksum(state) {
  const json = JSON.stringify(state);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ('00000000' + (hash >>> 0).toString(16)).slice(-8);
}
