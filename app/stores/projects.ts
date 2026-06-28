import { defineStore } from 'pinia';
import type { Project } from '@/types';
import { resolveSuccessMessage } from '@/config/status';
import { useTasksStore } from '@/stores/tasks';
import { assertValidProjectPayload } from '@/utils/validators';

export const useProjectsStore = defineStore('projects', () => {
    /* ----------------------------------------------------------
        STATES
        ---------------------------------------------------------- */
    const projects = ref<Project[]>([]);
    const selectedProjectId = ref<string | null>(null);
    const status = useStatus('projects');

    const selectedProject = computed(() => {
        if (!selectedProjectId.value) return null;
        return projects.value.find(p => p.id === selectedProjectId.value) || null;
    });

    const planningProjects = computed(() =>
        projects.value.filter(p => p.status === 'planning')
    );

    const activeProjects = computed(() =>
        projects.value.filter(p => p.status === 'active')
    );

    const completedProjects = computed(() =>
        projects.value.filter(p => p.status === 'completed')
    );

    /* ----------------------------------------------------------
        GETTERS
        ---------------------------------------------------------- */
    const projectStats = computed(() => ({
        total: projects.value.length,
        planning: planningProjects.value.length,
        active: activeProjects.value.length,
        completed: completedProjects.value.length,
        onHold: projects.value.filter(p => p.status === 'on-hold').length
    }));

    /* ----------------------------------------------------------
        ACTIONS
        ---------------------------------------------------------- */
    const fetchProjects = async () => {
        const data = await status.run(
            () => $fetch<Project[]>('/api/projects'),
            { errorKey: 'project.fetch' }
        );
        if (data) projects.value = data;
    };

    const fetchProject = async (id: string) => {
        const data = await status.run(
            () => $fetch<Project>(`/api/projects/${id}`),
            { errorKey: 'project.fetchOne' }
        );
        if (data) {
            const index = projects.value.findIndex(p => p.id === id);
            if (index !== -1) {
                projects.value[index] = data;
            } else {
                projects.value.push(data);
            }
            selectedProjectId.value = id;
        }
        return data;
    };

    const createProject = async (payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!payload.name?.trim() || !payload.description?.trim() || !payload.status) {
            status.setError('projects:create', 'Missing required fields: name, description, status');
            return null;
        }

        const newProject = await status.run(
            () => $fetch<Project>('/api/projects', {
                method: 'POST',
                body: {
                    name: payload.name.trim(),
                    description: payload.description.trim(),
                    status: payload.status,
                    dueDate: payload.dueDate || '',
                    progress: payload.progress ?? 0,
                    assignees: payload.assignees || [],
                    ownerId: payload.ownerId || 'user-1'
                }
            }),
            {
                successMessage: resolveSuccessMessage('project.create'),
                errorKey: 'project.create'
            }
        );

        if (newProject) projects.value.push(newProject);
        return newProject;
    };

    const updateProject = async (id: string, payload: Partial<Project>) => {
        assertValidProjectPayload(payload);

        const cleanPayload = {
            ...(payload.name !== undefined && { name: payload.name.trim() }),
            ...(payload.description !== undefined && { description: payload.description.trim() }),
            ...(payload.status !== undefined && { status: payload.status }),
            ...(payload.dueDate !== undefined && { dueDate: payload.dueDate }),
            ...(payload.assignees !== undefined && { assignees: payload.assignees })
        };

        return status.run(async () => {
            const updatedProject = await $fetch<Project>(`/api/projects/${id}`, {
                method: 'PUT',
                body: cleanPayload
            });

            const index = projects.value.findIndex(p => p.id === id);
            if (index !== -1) projects.value[index] = updatedProject;

            if (payload.assignees) {
                const taskStore = useTasksStore();
                const validUserIds = updatedProject.assignees.map(u => u.id);
                await taskStore.unassignRemovedUsers(id, validUserIds);
            }

            return updatedProject;
        }, {
            successMessage: resolveSuccessMessage('project.update'),
            errorKey: 'project.update'
        });
    };

    const deleteProject = async (id: string): Promise<boolean> => {
        const result = await status.run(
            () => $fetch(`/api/projects/${id}`, { method: 'DELETE' }).then(() => true as const),
            {
                successMessage: resolveSuccessMessage('project.delete'),
                errorKey: 'project.delete'
            }
        );

        if (result) {
            projects.value = projects.value.filter(p => p.id !== id);
            if (selectedProjectId.value === id) {
                selectedProjectId.value = null;
            }
        }

        return !!result;
    };

    const selectProject = (id: string | null) => {
        selectedProjectId.value = id;
    };

    const getProjectAssignees = (projectId: string) => {
        const project = projects.value.find(p => p.id === projectId);
        return project?.assignees ?? [];
    };

    const reset = () => {
        projects.value = [];
        selectedProjectId.value = null;
        status.clearKey('projects');
    };

    return {
        projects,
        selectedProjectId,
        selectedProject,
        planningProjects,
        activeProjects,
        completedProjects,
        projectStats,

        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        selectProject,
        getProjectAssignees,
        reset,

        isLoading: status.isLoading,
        error: status.error
    };
});
