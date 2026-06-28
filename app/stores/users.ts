import { defineStore } from 'pinia';
import type { User } from '@/types';
import { resolveSuccessMessage } from '@/config/status';

export const useUsersStore = defineStore('users', () => {
    /* ----------------------------------------------------------
        STATES
        ---------------------------------------------------------- */
    const users = ref<User[]>([]);
    const status = useStatus('users');

    /* ----------------------------------------------------------
        GETTERS
        ---------------------------------------------------------- */
    const userMap = computed(() => {
        const map: Record<string, User> = {};
        users.value.forEach((user) => {
            map[user.id] = user;
        });
        return map;
    });

    /* ----------------------------------------------------------
        ACTIONS
        ---------------------------------------------------------- */
    const fetchUsers = async () => {
        const data = await status.run(
            () => $fetch<User[]>('/api/users'),
            { errorKey: 'user.fetch' }
        );
        if (data) users.value = data;
    };

    const fetchUser = (id: string) => {
        return users.value.find(u => u.id === id) || null;
    };

    const createUser = async (payload: Omit<User, 'id'>) => {
        const newUser = await status.run(
            () => $fetch<User>('/api/users', {
                method: 'POST',
                body: payload
            }),
            {
                successMessage: resolveSuccessMessage('user.create'),
                errorKey: 'user.create'
            }
        );
        if (newUser) users.value.push(newUser);
        return newUser;
    };

    const updateUser = async (id: string, payload: Partial<User>) => {
        const updatedUser = await status.run(
            () => $fetch<User>(`/api/users/${id}`, {
                method: 'PUT',
                body: payload
            }),
            {
                successMessage: resolveSuccessMessage('user.update'),
                errorKey: 'user.update'
            }
        );
        if (updatedUser) {
            const index = users.value.findIndex(u => u.id === id);
            if (index !== -1) users.value[index] = updatedUser;
        }
        return updatedUser;
    };

    const deleteUser = async (id: string) => {
        const result = await status.run(
            () => {
                return $fetch(`/api/users/${id}`, { method: 'DELETE' }).then(() => true as const);
            },
            {
                successMessage: resolveSuccessMessage('user.delete'),
                errorKey: 'user.delete'
            }
        );
        if (result) {
            users.value = users.value.filter(u => u.id !== id);
        }
        return !!result;
    };

    const reset = () => {
        users.value = [];
        status.clearKey('users');
    };

    return {
        users,
        userMap,

        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,
        reset,

        isLoading: status.isLoading,
        error: status.error
    };
});
