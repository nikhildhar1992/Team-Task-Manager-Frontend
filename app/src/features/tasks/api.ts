import { httpClient } from '../../lib/httpClient';
import type { PaginatedResponse } from '../../types/api';
import type {
  AssignTaskInput,
  CreateTaskInput,
  Task,
  TaskListParams,
  UpdateTaskStatusInput,
} from '../../types/task';

export async function getTasks(params: TaskListParams): Promise<PaginatedResponse<Task>> {
  const response = await httpClient.get<PaginatedResponse<Task>>('/tasks', { params });
  return response.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await httpClient.post<Task>('/tasks', input);
  return response.data;
}

export async function assignTask(input: AssignTaskInput): Promise<Task> {
  const response = await httpClient.patch<Task>(`/tasks/${input.taskId}/assign`, {
    assigneeId: input.assigneeId,
  });
  return response.data;
}

export async function updateTaskStatus(input: UpdateTaskStatusInput): Promise<Task> {
  const response = await httpClient.patch<Task>(`/tasks/${input.taskId}/status`, {
    status: input.status,
  });
  return response.data;
}
