import { getTaskById, updateTask, deleteTask } from '#data/tasks';
import type { Task } from '~/types';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Task ID is required'
        });
    }

    try {
        if (event.node.req.method === 'GET') {
            const task = getTaskById(id);
            if (!task) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Task not found'
                });
            }
            return task;
        }

        if (event.node.req.method === 'PUT') {
            const body = await readBody<Partial<Task>>(event);
            const updated = updateTask(id, body);

            if (!updated) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Task not found'
                });
            }
            return updated;
        }

        if (event.node.req.method === 'DELETE') {
            const success = deleteTask(id);

            if (!success) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Task not found'
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
        console.error(`${event.node.req.method} /api/tasks/${id} error:`, error);
        throw error;
    }
});
