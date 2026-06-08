import { getTasks } from '#data/tasks';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const projectId = query.projectId as string | undefined;

        const tasks = getTasks(projectId);

        // network latency (100ms delay)
        await new Promise(resolve => setTimeout(resolve, 100));

        return tasks;
    } catch (error) {
        console.error('GET /api/tasks error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch tasks'
        });
    }
});
