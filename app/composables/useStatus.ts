import { computed } from 'vue';
import { useStatusStore } from '@/stores/status';
import {
    resolveErrorMessage,
    resolveSuccessMessage,
    type ErrorMessageKey,
    type SuccessMessageKey
} from '@/config/status';
import type { StatusKey, RunOptions, ErrorEntry, SuccessEntry } from '@/types/status';

export function useStatus(scopedKey?: StatusKey) {
    const store = useStatusStore();

    /* ----------------------------------------------------------
        SCOPED STATES
        ---------------------------------------------------------- */
    const isLoading = computed<boolean>(() =>
        scopedKey ? store.isLoading(scopedKey) : store.isAnyLoading
    );

    const error = computed<ErrorEntry | null>(() =>
        scopedKey ? store.getError(scopedKey) : store.latestError
    );

    const success = computed<SuccessEntry | null>(() =>
        scopedKey ? store.getSuccess(scopedKey) : store.latestSuccess
    );

    /* ----------------------------------------------------------
        GLOBAL STATES
        ---------------------------------------------------------- */
    const isAnyLoading = computed(() => store.isAnyLoading);
    const allErrors = computed(() => store.errors);
    const allSuccesses = computed(() => store.successes);

    /* ----------------------------------------------------------
        CORE
        ---------------------------------------------------------- */
    const run = async <T>(
        fn: (signal?: AbortSignal) => Promise<T>,
        options: RunOptions = {}
    ): Promise<T | null> => {
        const opKey = options.key ?? scopedKey ?? 'global';
        const minMs = options.minLoadingMs ?? 0;
        const ac = new AbortController();
        const startTime = Date.now();

        store.startLoading(opKey, ac);

        try {
            const result = await fn(ac.signal);

            if (minMs > 0) {
                const elapsed = Date.now() - startTime;
                if (elapsed < minMs) await sleep(minMs - elapsed);
            }

            if (options.successMessage) {
                store.setSuccess(opKey, options.successMessage, options.autoClearSuccess);
            } else {
                store.stopLoading(opKey);
            }

            return result;
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') {
                store.stopLoading(opKey);
                return null;
            }

            const message
                = options.errorMessage
                    ?? resolveErrorMessage(err, options.errorKey as ErrorMessageKey | undefined);

            store.setError(opKey, message, err);

            if (options.rethrow) throw err;
            return null;
        }
    };

    /* ----------------------------------------------------------
        TYPED MESSAGE HELPERS
        ---------------------------------------------------------- */
    const setSuccessFromKey = (msgKey: SuccessMessageKey, key?: StatusKey, autoClearMs?: number) => {
        store.setSuccess(key ?? scopedKey ?? 'global', resolveSuccessMessage(msgKey), autoClearMs);
    };

    const setErrorFromKey = (msgKey: ErrorMessageKey, key?: StatusKey) => {
        store.setError(key ?? scopedKey ?? 'global', resolveErrorMessage(msgKey));
    };

    /* ----------------------------------------------------------
        MANUAL CONTROL
        ---------------------------------------------------------- */
    const k = (override?: StatusKey) => override ?? scopedKey ?? 'global';

    return {
        isLoading,
        error,
        success,

        isAnyLoading,
        allErrors,
        allSuccesses,

        run,

        setSuccessFromKey,
        setErrorFromKey,

        // manual control (escape hatch)
        startLoading: (key?: StatusKey) => store.startLoading(k(key)),
        stopLoading: (key?: StatusKey) => store.stopLoading(k(key)),
        cancelLoading: (key?: StatusKey) => store.cancelLoading(k(key)),
        setError: (message: string, key?: StatusKey, cause?: unknown) =>
            store.setError(k(key), message, cause),
        clearError: (key?: StatusKey) => store.clearError(k(key)),
        setSuccess: (message: string, key?: StatusKey, ms?: number) =>
            store.setSuccess(k(key), message, ms),
        clearSuccess: (key?: StatusKey) => store.clearSuccess(k(key)),
        clearKey: (key?: StatusKey) => store.clearKey(k(key)),
        clearAll: store.clearAll,
        clearAllErrors: store.clearAllErrors
    };
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
