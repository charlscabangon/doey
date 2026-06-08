import { projectsData } from './projects';
import { tasksData } from '../tasks';
import type { Project } from '@/types';

export function getProjects(): Project[] {
    return cloneData(projectsData);
}

export function getProjectById(id: string): Project | null {
    const project = projectsData.find(p => p.id === id);

    return project ? cloneData(project) : null;
}

export function createProject(
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Project {
    const now = new Date().toISOString();
    const project: Project = {
        ...data,
        id: generateId('proj'),
        createdAt: now,
        updatedAt: now
    };
    projectsData.push(project);

    return cloneData(project);
}

export function updateProject(
    id: string,
    data: Partial<Project>
): Project | null {
    const index = projectsData.findIndex(p => p.id === id);
    if (index === -1) return null;

    projectsData[index] = {
        ...projectsData[index],
        ...data,
        id: projectsData[index].id, // unchanged
        createdAt: projectsData[index].createdAt, // unchanged
        updatedAt: new Date().toISOString()
    };

    return cloneData(projectsData[index]);
}

export function deleteProject(id: string): boolean {
    const index = projectsData.findIndex(p => p.id === id);
    if (index === -1) return false;

    projectsData.splice(index, 1);
    // also delete associated tasks
    tasksData.splice(0, tasksData.length, ...tasksData.filter(t => t.projectId !== id));

    return true;
}
