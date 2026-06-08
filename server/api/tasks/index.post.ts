import { createTask } from '#data/tasks';
import type { Task } from '~/types';

export default defineEventHandler(async (event) => {
    try {
        const body
            = await readBody<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>(event);

        // validate
        if (!body.projectId || !body.title || !body.status) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required fields'
            });
        }

        const task = createTask(body);
        setResponseStatus(event, 201);
        return task;
    } catch (error: any) {
        console.error('POST /api/tasks error:', error);
        throw error;
    }
});
