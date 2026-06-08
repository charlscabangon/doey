import type { Task } from '@/types';

export const tasksData: Task[] = [
    {
        id: 'task-1',
        projectId: 'proj-1',
        title: 'Wireframes',
        status: 'done',
        priority: 'high',
        order: 0,
        assigneeId: 'user-2',
        timeTracked: 14400,
        estimatedTime: 18000,
        createdAt: new Date('2025-01-05').toISOString(),
        updatedAt: new Date('2025-02-01').toISOString()
    },
    {
        id: 'task-2',
        projectId: 'proj-1',
        title: 'UI Design',
        status: 'in-progress',
        priority: 'high',
        order: 1,
        assigneeId: 'user-1',
        timeTracked: 7200,
        estimatedTime: 20000,
        createdAt: new Date('2025-01-10').toISOString(),
        updatedAt: new Date('2025-02-10').toISOString()
    },
    {
        id: 'task-3',
        projectId: 'proj-1',
        title: 'Component Refactor',
        status: 'todo',
        priority: 'medium',
        order: 2,
        timeTracked: 0,
        createdAt: new Date('2025-02-01').toISOString(),
        updatedAt: new Date('2025-02-10').toISOString()
    },
    {
        id: 'task-4',
        projectId: 'proj-1',
        title: 'SEO Optimization',
        status: 'todo',
        priority: 'low',
        order: 3,
        timeTracked: 0,
        createdAt: new Date('2025-02-01').toISOString(),
        updatedAt: new Date('2025-02-10').toISOString()
    },
    {
        id: 'task-5',
        projectId: 'proj-1',
        title: 'Deployment',
        status: 'todo',
        priority: 'high',
        order: 4,
        timeTracked: 0,
        createdAt: new Date('2025-02-01').toISOString(),
        updatedAt: new Date('2025-02-10').toISOString()
    },

    {
        id: 'task-6',
        projectId: 'proj-2',
        title: 'Requirements Gathering',
        status: 'in-progress',
        priority: 'high',
        order: 0,
        assigneeId: 'user-3',
        timeTracked: 5400,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'task-7',
        projectId: 'proj-2',
        title: 'UI Prototype',
        status: 'todo',
        priority: 'medium',
        order: 1,
        timeTracked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'task-8',
        projectId: 'proj-2',
        title: 'Auth Integration',
        status: 'todo',
        priority: 'high',
        order: 2,
        timeTracked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'task-9',
        projectId: 'proj-2',
        title: 'Push Notifications',
        status: 'todo',
        priority: 'low',
        order: 3,
        timeTracked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'task-10',
        projectId: 'proj-2',
        title: 'App Store Prep',
        status: 'todo',
        priority: 'medium',
        order: 4,
        timeTracked: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
