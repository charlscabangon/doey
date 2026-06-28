import { defineStore } from 'pinia';
import type { Task } from '@/types';
import { resolveSuccessMessage } from '@/config/status';
import { validateTaskAssignee } from '@/utils/validators';

export const useTasksStore = defineStore('tasks', () => {
    /* ----------------------------------------------------------
        STATES
        ---------------------------------------------------------- */
    const tasks = ref<Task[]>([]);
    const selectedTaskId = ref<string | null>(null);
    const filterStatus = ref<Task['status'] | 'all'>('all');
    const filterProjectId = ref<string | null>(null);
    const status = useStatus('tasks');

    /* ----------------------------------------------------------
        GETTERS
        ---------------------------------------------------------- */
    const selectedTask = computed(() => {
        if (!selectedTaskId.value) return null;
        return tasks.value.find(t => t.id === selectedTaskId.value) || null;
    });

    const filteredTasks = computed(() => {
        let result = tasks.value;
        if (filterProjectId.value) {
            result = result.filter(t => t.projectId === filterProjectId.value);
        }
        if (filterStatus.value !== 'all') {
            result = result.filter(t => t.status === filterStatus.value);
        }
        return result;
    });

    const tasksByStatus = computed(() => {
        const grouped: Record<Task['status'], Task[]> = {
            'todo': [],
            'in-progress': [],
            'done': []
        };
        tasks.value.forEach((task) => {
            grouped[task.status].push(task);
        });
        Object.keys(grouped).forEach((s) => {
            grouped[s as Task['status']].sort((a, b) => a.order - b.order);
        });
        return grouped;
    });

    const tasksByProject = computed(() => {
        const grouped: Record<string, Task[]> = {};
        tasks.value.forEach((task) => {
            if (!grouped[task.projectId]) grouped[task.projectId] = [];
            grouped[task.projectId].push(task);
        });
        return grouped;
    });

    const taskStats = computed(() => ({
        total: tasks.value.length,
        todo: tasksByStatus.value.todo.length,
        inProgress: tasksByStatus.value['in-progress'].length,
        done: tasksByStatus.value.done.length
    }));

    /* ----------------------------------------------------------
        ACTIONS
        ---------------------------------------------------------- */
    const fetchTasks = async (projectId?: string) => {
        const data = await status.run(
            () => {
                const url = projectId ? `/api/tasks?projectId=${projectId}` : '/api/tasks';
                return $fetch<Task[]>(url);
            },
            { errorKey: 'task.fetch' }
        );
        if (data) tasks.value = data;
    };

    const fetchTask = async (id: string) => {
        const data = await status.run(
            () => $fetch<Task>(`/api/tasks/${id}`),
            { errorKey: 'task.fetchOne' }
        );
        if (data) {
            const index = tasks.value.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks.value[index] = data;
            } else {
                tasks.value.push(data);
            }
            selectedTaskId.value = id;
        }
        return data;
    };

    const createTask = async (payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        validateTaskAssignee(payload.projectId, payload.assigneeId);

        const newTask = await status.run(
            () => $fetch<Task>('/api/tasks', {
                method: 'POST',
                body: payload
            }),
            {
                successMessage: resolveSuccessMessage('task.create'),
                errorKey: 'task.create'
            }
        );
        if (newTask) tasks.value.push(newTask);
        return newTask;
    };

    const updateTask = async (id: string, payload: Partial<Task>, options?: { successMessage?: string }) => {
        if (payload.assigneeId !== undefined) {
            const existing = tasks.value.find(t => t.id === id);
            if (existing) validateTaskAssignee(existing.projectId, payload.assigneeId);
        }

        return status.run(async () => {
            const updatedTask = await $fetch<Task>(`/api/tasks/${id}`, {
                method: 'PUT',
                body: payload
            });

            const index = tasks.value.findIndex(t => t.id === id);
            if (index !== -1) tasks.value[index] = updatedTask;

            return updatedTask;
        }, {
            successMessage: options?.successMessage,
            errorKey: 'task.update'
        });
    };

    const deleteTask = async (id: string) => {
        const result = await status.run(
            () => $fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(() => true as const),
            {
                successMessage: resolveSuccessMessage('task.delete'),
                errorKey: 'task.delete'
            }
        );

        if (result) {
            tasks.value = tasks.value.filter(t => t.id !== id);
            if (selectedTaskId.value === id) selectedTaskId.value = null;
        }

        return !!result;
    };

    const updateTaskStatus = async (id: string, status: Task['status']) =>
        updateTask(id, { status });

    const updateTaskOrder = async (id: string, order: number) =>
        updateTask(id, { order });

    const assignTask = async (taskId: string, userId: string) =>
        updateTask(taskId, { assigneeId: userId }, { successMessage: resolveSuccessMessage('task.assign') });

    const addTimeTracking = async (taskId: string, minutes: number) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task) return null;

        return updateTask(taskId, { timeTracked: (task.timeTracked || 0) + minutes });
    };

    const selectTask = (id: string | null) => {
        selectedTaskId.value = id;
    };
    const setFilterStatus = (s: Task['status'] | 'all') => {
        filterStatus.value = s;
    };
    const setFilterProject = (projectId: string | null) => {
        filterProjectId.value = projectId;
    };

    const unassignRemovedUsers = async (projectId: string, validUserIds: string[]) => {
        const validSet = new Set(validUserIds);
        const affected = tasks.value.filter(
            t => t.projectId === projectId && t.assigneeId && !validSet.has(t.assigneeId)
        );
        if (affected.length === 0) return;

        await Promise.allSettled(
            affected.map(t =>
                $fetch(`/api/tasks/${t.id}`, {
                    method: 'PUT',
                    body: { assigneeId: undefined }
                }).then(() => {
                    t.assigneeId = undefined;
                })
            )
        );
    };

    const moveTaskOptimistic = (taskId: string, toStatus: Task['status'], newIndex: number) => {
        const taskIndex = tasks.value.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const [task] = tasks.value.splice(taskIndex, 1);
        const fromStatus = task.status;
        task.status = toStatus;

        const destTasks = tasks.value
            .filter(t => t.status === toStatus)
            .sort((a, b) => a.order - b.order);

        const clampedIndex = Math.min(newIndex, destTasks.length);
        task.order = clampedIndex;

        for (let i = clampedIndex; i < destTasks.length; i++) {
            destTasks[i].order = i + 1;
        }

        if (fromStatus !== toStatus) {
            const srcTasks = tasks.value
                .filter(t => t.status === fromStatus)
                .sort((a, b) => a.order - b.order);
            for (let i = 0; i < srcTasks.length; i++) {
                srcTasks[i].order = i;
            }
        }

        tasks.value.push(task);
    };

    const reset = () => {
        tasks.value = [];
        selectedTaskId.value = null;
        filterStatus.value = 'all';
        filterProjectId.value = null;
        status.clearKey('tasks');
    };

    return {
        tasks,
        selectedTaskId,
        filterStatus,
        filterProjectId,
        selectedTask,
        filteredTasks,
        tasksByStatus,
        tasksByProject,
        taskStats,

        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        updateTaskOrder,
        assignTask,
        addTimeTracking,
        selectTask,
        setFilterStatus,
        setFilterProject,
        unassignRemovedUsers,
        moveTaskOptimistic,
        reset,

        isLoading: status.isLoading,
        error: status.error
    };
});
