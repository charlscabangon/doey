import type { User } from './user';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    assignees: User[];
    ownerId: string;
};
