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

        auth: {
            login: 'Invalid email or password.',
            logout: 'Could not log you out. Please try again.',
            register: 'Could not create your account. Please try again.',
            refreshToken: 'Your session expired. Please sign in again.',
            forgotPassword: 'Could not send the reset email. Please try again.',
            resetPassword: 'Could not reset your password. The link may have expired.',
            verifyEmail: 'Email verification failed. The link may be invalid or expired.',
            unauthorized: 'You must be logged in to do that.'
        },

        user: {
            fetch: 'Could not load user data.',
            update: 'Could not update your profile.',
            updateAvatar: 'Could not upload your photo.',
            delete: 'Could not delete your account.',
            changePassword: 'Could not change your password.'
        },

        posts: {
            fetch: 'Could not load posts.',
            fetchOne: 'Could not load the post.',
            create: 'Could not create the post.',
            update: 'Could not update the post.',
            delete: 'Could not delete the post.'
        },

        form: {
            required: 'Please fill in all required fields.',
            invalidEmail: 'Please enter a valid email address.',
            passwordMatch: 'Passwords do not match.',
            fileTooLarge: 'The file is too large. Maximum size is 5MB.',
            invalidFormat: 'The file format is not supported.'
        },

        network: {
            offline: 'You appear to be offline. Check your connection.',
            timeout: 'The request took too long. Please try again.',
            aborted: 'The request was cancelled.'
        }
    },

    success: {
        auth: {
            login: 'Welcome back!',
            logout: 'You have been signed out.',
            register: 'Account created! Welcome aboard.',
            forgotPassword: 'Reset email sent. Check your inbox.',
            resetPassword: 'Password reset successfully.',
            verifyEmail: 'Email verified successfully.'
        },

        user: {
            update: 'Profile updated successfully.',
            updateAvatar: 'Photo uploaded successfully.',
            delete: 'Account deleted.',
            changePassword: 'Password changed successfully.'
        },

        posts: {
            create: 'Post created successfully.',
            update: 'Post updated successfully.',
            delete: 'Post deleted.'
        }
    }
    // add new domains as needed
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
