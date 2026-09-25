// Core Type Definitions and Error Classes for Resumora

export class ResumoraError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ResumoraError';
    this.code = code || 'RESUMORA_GENERIC_ERROR';
  }
}

export class WorkspaceLockedError extends ResumoraError {
  constructor(workspaceId) {
    super(
      `Workspace '${workspaceId}' is locked. Authentication required to access persisted state.`,
      'WORKSPACE_LOCKED',
    );
    this.name = 'WorkspaceLockedError';
  }
}

export class WorkspacePurgedError extends ResumoraError {
  constructor(workspaceId) {
    super(`Workspace '${workspaceId}' has been purged and cannot be accessed.`, 'WORKSPACE_PURGED');
    this.name = 'WorkspacePurgedError';
  }
}

export class ChecksumMismatchError extends ResumoraError {
  constructor(checkpointId) {
    super(
      `Checksum verification failed for checkpoint '${checkpointId}'. Stored state may be corrupted.`,
      'CHECKSUM_MISMATCH',
    );
    this.name = 'ChecksumMismatchError';
  }
}

export class InvalidIdentityError extends ResumoraError {
  constructor(field) {
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
  constructor(message, originalError) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
    this.originalError = originalError;
  }
}
