export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  order: number; // for drag and drop
  assigneeId?: string;
  dueDate?: string;
  estimatedTime?: number; // in minutes
  timeTracked: number; // total accumulated seconds
  timerStartedAt?: string; // ISO string — set when timer is running
  createdAt: string;
  updatedAt: string;
}
