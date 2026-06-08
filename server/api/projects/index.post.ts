import { createProject } from '#data/projects';
import type { Project } from '~/types';

export default defineEventHandler(async (event) => {
    try {
        const body
            = await readBody<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>(event);

        // validate
        if (!body.name?.trim() || !body.description?.trim() || !body.status) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required fields: name, description, status'
            });
        }

        const project = createProject({
            name: body.name.trim(),
            description: body.description.trim(),
            status: body.status,
            dueDate: body.dueDate || '',
            assignees: body.assignees || [],
            ownerId: body.ownerId || 'user-1'
        });

        setResponseStatus(event, 201);
        return project;
    } catch (error: any) {
        console.error('POST /api/projects error:', error);
        throw error;
    }
});
