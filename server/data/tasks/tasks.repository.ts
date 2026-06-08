import { tasksData } from './tasks';
import type { Task } from '@/types';

export function getTasks(projectId?: string): Task[] {
    let result = tasksData;
    if (projectId) {
        result = result.filter(t => t.projectId === projectId);
    }
    return cloneData(result).sort((a, b) => a.order - b.order);
}

export function getTaskById(id: string): Task | null {
    const task = tasksData.find(t => t.id === id);
    return task ? cloneData(task) : null;
}

export function createTask(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Task {
    const now = new Date().toISOString();
    const task: Task = {
        ...data,
        id: generateId('task'),
        createdAt: now,
        updatedAt: now
    };
    tasksData.push(task);
    return cloneData(task);
}

export function updateTask(id: string, data: Partial<Task>): Task | null {
    const index = tasksData.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updated = {
        ...tasksData[index],
        ...data,
        id: tasksData[index].id,
        createdAt: tasksData[index].createdAt,
        updatedAt: new Date().toISOString()
    };

    // explicitly clear timerStartedAt if set to undefined in payload
    if ('timerStartedAt' in data && data.timerStartedAt === undefined) {
        delete updated.timerStartedAt;
    }

    tasksData[index] = updated;
    return cloneData(tasksData[index]);
}

export function deleteTask(id: string): boolean {
    const index = tasksData.findIndex(t => t.id === id);
    if (index === -1) return false;

    tasksData.splice(index, 1);
    return true;
}
