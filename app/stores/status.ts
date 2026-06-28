import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { StatusKey, LoadingEntry, ErrorEntry, SuccessEntry } from '@/types/status';

export const useStatusStore = defineStore('status', () => {
    /* ----------------------------------------------------------
        STATES
        ---------------------------------------------------------- */
    const loading = ref<Record<string, LoadingEntry>>({});
    const errors = ref<Record<string, ErrorEntry>>({});
    const successes = ref<Record<string, SuccessEntry>>({});

    /* ----------------------------------------------------------
        GETTERS
        ---------------------------------------------------------- */
    const isAnyLoading = computed(() => Object.keys(loading.value).length > 0);

    const errorList = computed<ErrorEntry[]>(() =>
        Object.values(errors.value).sort((a, b) => b.timestamp - a.timestamp)
    );

    const successList = computed<SuccessEntry[]>(() =>
        Object.values(successes.value).sort((a, b) => b.timestamp - a.timestamp)
    );

    const latestError = computed<ErrorEntry | null>(() =>
        errorList.value[0] ?? null
    );

    const latestSuccess = computed<SuccessEntry | null>(() =>
        successList.value[0] ?? null
    );

    /* ----------------------------------------------------------
        ACTIONS
        ---------------------------------------------------------- */
    const startLoading = (key: StatusKey, abortController?: AbortController) => {
        loading.value[key] = { key, abortController, startedAt: Date.now() };
        clearError(key);
        clearSuccess(key);
    };

    function stopLoading(key: StatusKey) {
        Reflect.deleteProperty(loading.value, key);
    }

    const cancelLoading = (key: StatusKey) => {
        loading.value[key]?.abortController?.abort();
        stopLoading(key);
    };

    const isLoading = (key: StatusKey): boolean => {
        return key in loading.value;
    };

    const getError = (key: StatusKey): ErrorEntry | null => {
        return errors.value[key] ?? null;
    };

    const getSuccess = (key: StatusKey): SuccessEntry | null => {
        return successes.value[key] ?? null;
    };

    const setError = (key: StatusKey, message: string, cause?: unknown) => {
        stopLoading(key);
        errors.value[key] = { key, message, cause, timestamp: Date.now() };
    };

    const clearError = (key: StatusKey) => {
        Reflect.deleteProperty(errors.value, key);
    };

    const clearAllErrors = () => {
        errors.value = {};
    };

    const setSuccess = (key: StatusKey, message: string, autoClearMs = 3000) => {
        stopLoading(key);
        successes.value[key] = { key, message, timestamp: Date.now() };

        if (autoClearMs > 0) {
            setTimeout(() => clearSuccess(key), autoClearMs);
        }
    };

    const clearSuccess = (key: StatusKey) => {
        Reflect.deleteProperty(successes.value, key);
    };

    const clearKey = (key: StatusKey) => {
        cancelLoading(key);
        Reflect.deleteProperty(errors.value, key);
        Reflect.deleteProperty(successes.value, key);
    };

    const clearAll = () => {
        loading.value = {};
        errors.value = {};
        successes.value = {};
    };

    return {
        loading,
        errors,
        successes,

        isAnyLoading,
        errorList,
        successList,
        latestError,
        latestSuccess,

        startLoading,
        stopLoading,
        cancelLoading,
        isLoading,
        getError,
        getSuccess,
        setError,
        clearError,
        clearAllErrors,
        setSuccess,
        clearSuccess,
        clearKey,
        clearAll
    };
});
