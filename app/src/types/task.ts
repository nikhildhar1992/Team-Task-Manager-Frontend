import type { PaginationParams } from './api';

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  createdAt?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assigneeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export interface TaskListParams extends PaginationParams {
  status?: TaskStatus;
}

export interface AssignTaskInput {
  taskId: string;
  assigneeId?: string;
}

export interface UpdateTaskStatusInput {
  taskId: string;
  status: TaskStatus;
}
