import { getProjectById, updateProject, deleteProject } from '#data/projects';
import type { Project } from '~/types';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
        });
    }

    try {
    // GET /api/projects/:id
        if (event.node.req.method === 'GET') {
            const project = getProjectById(id);
            if (!project) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Project not found'
                });
            }
            return project;
        }

        // PUT /api/projects/:id
        if (event.node.req.method === 'PUT') {
            const body = await readBody<Partial<Project>>(event);

            if (body.name !== undefined && !body.name.trim()) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Project name cannot be empty'
                });
            }

            if (body.description !== undefined && !body.description.trim()) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Description cannot be empty'
                });
            }

            const cleanBody = {
                ...(body.name !== undefined && { name: body.name.trim() }),
                ...(body.description !== undefined && {
                    description: body.description.trim()
                }),
                ...(body.status !== undefined && { status: body.status }),
                ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
                ...(body.assignees !== undefined && { assignees: body.assignees })
            };

            const updated = updateProject(id, cleanBody);

            if (!updated) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Project not found'
                });
            }

            return updated;
        }

        // DELETE /api/projects/:id
        if (event.node.req.method === 'DELETE') {
            const success = deleteProject(id);

            if (!success) {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Project not found'
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
        console.error(`${event.node.req.method} /api/projects/${id} error:`, error);
        throw error;
    }
});
