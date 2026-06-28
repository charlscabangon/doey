import type { Project } from '@/types';
import { useProjectsStore } from '@/stores/projects';

export function assertValidProjectPayload(payload: Partial<Project>): void {
    if (payload.name !== undefined && !payload.name.trim()) {
        throw new Error('Project name cannot be empty');
    }
    if (payload.description !== undefined && !payload.description.trim()) {
        throw new Error('Description cannot be empty');
    }
}

export function validateTaskAssignee(projectId: string, assigneeId?: string): void {
    if (!assigneeId) return;
    const projectStore = useProjectsStore();
    const isEligible = projectStore
        .getProjectAssignees(projectId)
        .some(u => u.id === assigneeId);
    if (!isEligible) throw new Error('Assignee is not a member of this project.');
}
