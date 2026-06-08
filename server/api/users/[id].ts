import { getUserById, updateUser, deleteUser } from '#data/users';
import type { User } from '~/types';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required'
        });
    }

    try {
        if (event.node.req.method === 'GET') {
            const user = getUserById(id);
            if (!user) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found'
                });
            }
            return user;
        }

        if (event.node.req.method === 'PUT') {
            const body = await readBody<Partial<User>>(event);
            const updated = updateUser(id, body);

            if (!updated) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found'
                });
            }
            return updated;
        }

        if (event.node.req.method === 'DELETE') {
            const success = deleteUser(id);

            if (!success) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'User not found'
                });
            }

            setResponseStatus(event, 204);
            return null;
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Method not allowed'
        });
    } catch (error: any) {
        console.error(`${event.node.req.method} /api/users/${id} error:`, error);
        throw error;
    }
});
