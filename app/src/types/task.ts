export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSortBy = 'created_at' | 'priority';
export type TaskSortOrder = 'asc' | 'desc';

export interface Task {
  id: number;
  teamId: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: number | null;
  deadline?: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  teamId: number;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: number;
  deadline?: string;
}

export interface TaskListParams {
  teamId: number;
  limit?: number;
  cursor?: string;
  status?: TaskStatus;
  assignedTo?: number;
  search?: string;
  sortBy?: TaskSortBy;
  sortOrder?: TaskSortOrder;
}

export interface TaskPageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface TaskListResult {
  items: Task[];
  pageInfo: TaskPageInfo;
}

export interface UpdateTaskInput {
  teamId: number;
  taskId: number;
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: number | null;
  deadline?: string | null;
}
