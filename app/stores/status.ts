import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type StatusKey = string;

export interface StatusMessage {
    message: string;
    details?: string;
    timestamp: number;
};

export const useStatusStore = defineStore('status', () => {
    // states
    const loadingKeys = ref<Set<StatusKey>>(new Set());
    const errors = ref<Map<StatusKey, StatusMessage>>(new Map());
    const successes = ref<Map<StatusKey, StatusMessage>>(new Map());

    // getters
    const isAnyLoading = computed(() => loadingKeys.value.size > 0);
    const loadingList = computed(() => [...loadingKeys.value]);
    const errorList = computed(() =>
        [...errors.value.entries()].map(([key, val]) => ({ key, ...val })));
    const successList = computed(() =>
        [...successes.value.entries()].map(([key, val]) => ({ key, ...val })));
    const latestError = computed(() =>
        errorList.value.sort((a, b) => b.timestamp - a.timestamp)[0] ?? null
    );
    const latestSuccess = computed(() =>
        successList.value.sort((a, b) => b.timestamp - a.timestamp)[0] ?? null
    );

    // actions
    function startLoading(key: StatusKey) {
    // trigger reactivity: replace the Set reference
        const next = new Set(loadingKeys.value);
        next.add(key);
        loadingKeys.value = next;
        // clear previous error/success for this key when retrying
        clearError(key);
    }

    function stopLoading(key: StatusKey) {
        const next = new Set(loadingKeys.value);
        next.delete(key);
        loadingKeys.value = next;
    }

    function isLoading(key: StatusKey) {
        return loadingKeys.value.has(key);
    }

    function setError(key: StatusKey, message: string, details?: string) {
        stopLoading(key);
        const next = new Map(errors.value);
        next.set(key, { message, details, timestamp: Date.now() });
        errors.value = next;
    }

    function clearError(key: StatusKey) {
        if (!errors.value.has(key)) return;
        const next = new Map(errors.value);
        next.delete(key);
        errors.value = next;
    }

    function clearAllErrors() {
        errors.value = new Map();
    }

    function setSuccess(key: StatusKey, message: string, autoClearMs = 3000) {
        stopLoading(key);
        const next = new Map(successes.value);
        next.set(key, { message, timestamp: Date.now() });
        successes.value = next;

        if (autoClearMs > 0) {
            setTimeout(() => clearSuccess(key), autoClearMs);
        }
    }

    function clearSuccess(key: StatusKey) {
        if (!successes.value.has(key)) return;
        const next = new Map(successes.value);
        next.delete(key);
        successes.value = next;
    }

    function clearAll() {
        loadingKeys.value = new Set();
        errors.value = new Map();
        successes.value = new Map();
    }

    return {
        isAnyLoading,
        loadingList,
        errorList,
        successList,
        latestError,
        latestSuccess,

        isLoading,
        startLoading,
        stopLoading,
        setError,
        clearError,
        clearAllErrors,
        setSuccess,
        clearSuccess,
        clearAll
    };
});
