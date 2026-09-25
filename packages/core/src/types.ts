// Core Type Definitions and Error Classes for Resumora

/** Identifies one workspace. Every persisted record is namespaced by all three segments. */
export interface IdentityContext {
  readonly tenantId: string;
  readonly userId: string;
  readonly workspaceId: string;
}

export type StorageOperation =
  | { readonly type: 'set'; readonly key: string; readonly value: Uint8Array }
  | { readonly type: 'delete'; readonly key: string };

/**
 * The contract every storage backend implements. Values are opaque bytes; the runtime owns
 * serialization. `listKeys` and `clear` without a prefix cover the whole store.
 */
export interface StorageAdapter {
  get(key: string): Promise<Uint8Array | null>;
  set(key: string, value: Uint8Array): Promise<void>;
  delete(key: string): Promise<void>;
  listKeys(prefix?: string): Promise<string[]>;
  batch(operations: readonly StorageOperation[]): Promise<void>;
  clear(prefix?: string): Promise<void>;
}

export type IntentStatus = 'pending';

export interface Intent {
  readonly id: string;
  readonly sequence: number;
  readonly workspaceId: string;
  readonly action: string;
  readonly payload: unknown;
  readonly timestamp: number;
  readonly status: IntentStatus;
}

export type CheckpointMetadata = Readonly<Record<string, unknown>> & {
  readonly clientTimestamp: number;
};

export interface Checkpoint<TState = unknown> {
  readonly id: string;
  readonly workspaceId: string;
  readonly sequence: number;
  readonly state: TState;
  readonly metadata: CheckpointMetadata;
  readonly checksum: string;
}

/**
 * What `Workspace.restoreLatestCheckpoint()` recovers. `checkpoint` and `state` are null when
 * intents were recorded before any checkpoint; the caller replays `unappliedIntents` either way.
 */
export interface RestoreResult {
  readonly checkpoint: Checkpoint | null;
  readonly state: unknown;
  readonly unappliedIntents: Intent[];
}

export type WorkspaceState = 'active' | 'locked' | 'purged';

export interface WorkspacePolicy {
  readonly maxAgeMs: number;
  readonly autoCheckpointFrequency: number;
  readonly onLogout: 'lock';
}

export interface UnlockCredential {
  readonly isValid: boolean;
}

export interface RuntimeConfig {
  readonly storage: StorageAdapter;
  readonly policy?: Partial<WorkspacePolicy>;
}

export class ResumoraError extends Error {
  readonly code: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ResumoraError';
    this.code = code || 'RESUMORA_GENERIC_ERROR';
  }
}

export class WorkspaceLockedError extends ResumoraError {
  constructor(workspaceId: string) {
    super(
      `Workspace '${workspaceId}' is locked. Authentication required to access persisted state.`,
      'WORKSPACE_LOCKED',
    );
    this.name = 'WorkspaceLockedError';
  }
}

export class WorkspacePurgedError extends ResumoraError {
  constructor(workspaceId: string) {
    super(`Workspace '${workspaceId}' has been purged and cannot be accessed.`, 'WORKSPACE_PURGED');
    this.name = 'WorkspacePurgedError';
  }
}

export class ChecksumMismatchError extends ResumoraError {
  constructor(checkpointId: string) {
    super(
      `Checksum verification failed for checkpoint '${checkpointId}'. Stored state may be corrupted.`,
      'CHECKSUM_MISMATCH',
    );
    this.name = 'ChecksumMismatchError';
  }
}

export class InvalidIdentityError extends ResumoraError {
  readonly field: keyof IdentityContext;

  constructor(field: keyof IdentityContext) {
    // The rejected value is deliberately left out: it is caller-supplied and may end up in logs.
    super(
      `Invalid ${field}: must be 1-128 characters of A-Z, a-z, 0-9, '.', '_', '@', '+' or '-'.`,
      'INVALID_IDENTITY',
    );
    this.name = 'InvalidIdentityError';
    this.field = field;
  }
}

export class StorageError extends ResumoraError {
  readonly originalError: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
    this.originalError = originalError;
  }
}
