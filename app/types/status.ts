export type StatusKey = string;

// Holds the key, an optional AbortController, and startedAt timestamp.
export interface LoadingEntry {
    key: StatusKey;
    abortController?: AbortController;
    startedAt: number;
}

// Holds the key, the resolved user-facing message, the raw cause (original error object for Sentry/debugging), and a timestamp.
export interface ErrorEntry {
    key: StatusKey;
    message: string;
    cause?: unknown;
    timestamp: number;
}

//  Holds the key, message, and timestamp.
export interface SuccessEntry {
    key: StatusKey;
    message: string;
    timestamp: number;
}

// The options object passed to run().
export interface RunOptions {
    key?: StatusKey;
    successMessage?: string;
    errorKey?: string;
    errorMessage?: string;
    autoClearSuccess?: number;
    rethrow?: boolean;
    minLoadingMs?: number;
}

export type NotificationKind = 'error' | 'success' | 'info' | 'warning';

export interface Notification {
    id: string;
    kind: NotificationKind;
    message: string;
    durationMs?: number;
}

// The interface for lifecycle callbacks configured in the plugin
export interface StatusHooks {
    onLoadingStart?: (key: StatusKey) => void;
    onLoadingEnd?: (key: StatusKey) => void;
    onError?: (entry: ErrorEntry) => void;
    onSuccess?: (entry: SuccessEntry) => void;
}
