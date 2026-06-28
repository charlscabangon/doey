export const MESSAGES = {
    error: {
        default: 'Something went wrong. Please try again.',

        http: {
            400: 'Bad request. Please check your input.',
            401: 'You are not logged in. Please sign in to continue.',
            403: 'You do not have permission to do that.',
            404: 'The requested resource was not found.',
            408: 'The request timed out. Please try again.',
            409: 'A conflict occurred. The resource may already exist.',
            422: 'Validation failed. Please review your input.',
            429: 'Too many requests. Please slow down and try again.',
            500: 'A server error occurred. Please try again later.',
            502: 'Service temporarily unavailable. Please try again shortly.',
            503: 'The service is down for maintenance. Check back soon.'
        },

        network: {
            offline: 'You appear to be offline. Check your connection.',
            timeout: 'The request took too long. Please try again.',
            aborted: 'The request was cancelled.'
        },

        project: {
            fetch: 'Could not load projects.',
            fetchOne: 'Could not load the project.',
            create: 'Could not create the project.',
            update: 'Could not update the project.',
            delete: 'Could not delete the project.'
        },

        task: {
            fetch: 'Could not load tasks.',
            fetchOne: 'Could not load the task.',
            create: 'Could not create the task.',
            update: 'Could not update the task.',
            delete: 'Could not delete the task.',
            assign: 'Could not assign the user to this task.',
            reorder: 'Could not update task order.'
        },

        user: {
            fetch: 'Could not load users.',
            create: 'Could not create the user.',
            update: 'Could not update the user.',
            delete: 'Could not delete the user.'
        }
    },

    success: {
        project: {
            create: 'Project created successfully.',
            update: 'Project updated successfully.',
            delete: 'Project deleted.'
        },

        task: {
            create: 'Task created successfully.',
            update: 'Task updated successfully.',
            delete: 'Task deleted.',
            assign: 'User assigned to task.'
        },

        user: {
            create: 'User created successfully.',
            update: 'User updated successfully.',
            delete: 'User deleted.'
        }
    }
} as const;

/* ----------------------------------------------------------
    TYPE HELPERS
    ---------------------------------------------------------- */
type DotPaths<T, P extends string = ''>
    = T extends Record<string, unknown>
        ? {
                [K in keyof T]: K extends string
                    ? T[K] extends Record<string, unknown>
                        ? DotPaths<T[K], `${P}${K}.`>
                        : `${P}${K}`
                    : never;
            }[keyof T]
        : never;

export type ErrorMessageKey = DotPaths<(typeof MESSAGES)['error']>;
export type SuccessMessageKey = DotPaths<(typeof MESSAGES)['success']>;

/* ----------------------------------------------------------
    RESOLVERS
    ---------------------------------------------------------- */
export function resolveErrorMessage(
    keyOrError: ErrorMessageKey | Error | unknown,
    fallbackKey?: ErrorMessageKey
): string {
    if (typeof keyOrError === 'string') {
        return resolveDotPath(MESSAGES.error, keyOrError) ?? MESSAGES.error.default;
    }

    if (isHttpError(keyOrError)) {
        const status = (keyOrError as any).response?.status as keyof typeof MESSAGES.error.http;
        const statusMsg = MESSAGES.error.http[status];
        if (statusMsg) return statusMsg;
    }

    if (keyOrError instanceof Error && keyOrError.name === 'AbortError') {
        return MESSAGES.error.network.aborted;
    }

    if (keyOrError instanceof Error && isUserFacingMessage(keyOrError.message)) {
        return keyOrError.message;
    }

    if (fallbackKey) {
        const msg = resolveDotPath(MESSAGES.error, fallbackKey);
        if (msg) return msg;
    }

    return MESSAGES.error.default;
}

export function resolveSuccessMessage(key: SuccessMessageKey): string {
    return resolveDotPath(MESSAGES.success, key) ?? '';
}

function resolveDotPath(obj: Record<string, any>, path: string): string | undefined {
    const result = path.split('.').reduce((acc, key) => acc?.[key], obj);
    return typeof result === 'string' ? result : undefined;
}

function isHttpError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'response' in err;
}

function isUserFacingMessage(msg: string): boolean {
    return (
        msg.length > 10
        && /^[A-Z]/.test(msg)
        && !msg.startsWith('fetch')
        && !msg.includes('NetworkError')
        && !msg.includes('Failed to fetch')
    );
}
