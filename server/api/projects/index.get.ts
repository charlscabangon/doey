import { getProjects } from '#data/projects';

export default defineEventHandler(async () => {
    try {
        const projects = getProjects();

        // network latency (100ms delay)
        await new Promise(resolve => setTimeout(resolve, 100));

        return projects;
    } catch (error) {
        console.error('GET /api/projects error:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch projects'
        });
    }
});
