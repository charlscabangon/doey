import { getUsers } from '#data/users';

export default defineEventHandler(async (event) => {
    try {
        const users = getUsers();
        await new Promise(resolve => setTimeout(resolve, 100));
        return users;
    } catch (error) {
        console.error('GET /api/users error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch users'
        });
    }
});
