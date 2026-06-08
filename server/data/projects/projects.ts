import type { Project } from '@/types';

export const projectsData: Project[] = [
    {
        id: 'proj-1',
        name: 'Website Redesign',
        description: 'Modernize our marketing website',
        status: 'completed',
        dueDate: '2025-03-15',
        createdAt: new Date('2025-01-01').toISOString(),
        updatedAt: new Date('2025-02-10').toISOString(),
        assignees: [],
        ownerId: 'user-1'
    },
    {
        id: 'proj-2',
        name: 'Mobile App MVP',
        description: 'Build MVP for iOS and Android',
        status: 'planning',
        dueDate: '2025-04-30',
        createdAt: new Date('2025-01-15').toISOString(),
        updatedAt: new Date('2025-02-08').toISOString(),
        assignees: [],
        ownerId: 'user-2'
    },
    {
        id: 'proj-3',
        name: 'API Documentation',
        description: 'Complete API reference and guides',
        status: 'active',
        dueDate: '2025-03-01',
        createdAt: new Date('2024-12-01').toISOString(),
        updatedAt: new Date('2025-02-05').toISOString(),
        assignees: [],
        ownerId: 'user-1'
    },
    {
        id: 'proj-4',
        name: 'Marketing Campaign',
        description: 'Launch Q2 digital marketing campaign',
        status: 'on-hold',
        dueDate: '2025-05-20',
        createdAt: new Date('2025-02-01').toISOString(),
        updatedAt: new Date('2025-02-12').toISOString(),
        assignees: [],
        ownerId: 'user-3'
    },
    {
        id: 'proj-5',
        name: 'Internal Dashboard',
        description: 'Build analytics dashboard for internal teams',
        status: 'planning',
        dueDate: '2025-04-10',
        createdAt: new Date('2025-01-10').toISOString(),
        updatedAt: new Date('2025-02-14').toISOString(),
        assignees: [],
        ownerId: 'user-4'
    },
    {
        id: 'proj-6',
        name: 'Performance Optimization',
        description: 'Improve application speed and Lighthouse scores',
        status: 'active',
        dueDate: '2025-06-01',
        createdAt: new Date('2025-02-05').toISOString(),
        updatedAt: new Date('2025-02-15').toISOString(),
        assignees: [],
        ownerId: 'user-5'
    },
    {
        id: 'proj-7',
        name: 'Customer Feedback System',
        description: 'Implement feedback and rating module',
        status: 'completed',
        dueDate: '2025-05-05',
        createdAt: new Date('2025-01-25').toISOString(),
        updatedAt: new Date('2025-02-16').toISOString(),
        assignees: [],
        ownerId: 'user-6'
    }
];
