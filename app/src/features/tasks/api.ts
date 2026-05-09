import { httpClient } from '../../lib/httpClient';
import type { CreateTaskInput, Task, TaskListResult, UpdateTaskInput } from '../../types/task';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiMessageResponse {
  success: true;
  message: string;
}

export async function getTasks(teamId: number): Promise<TaskListResult> {
  const response = await httpClient.get<ApiSuccessResponse<TaskListResult>>(`/teams/${teamId}/tasks`);
  return response.data.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { teamId, ...body } = input;
  const response = await httpClient.post<ApiSuccessResponse<Task>>(`/teams/${teamId}/tasks`, body);
  return response.data.data;
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const { teamId, taskId, ...body } = input;
  const response = await httpClient.patch<ApiSuccessResponse<Task>>(`/teams/${teamId}/tasks/${taskId}`, body);
  return response.data.data;
}

export async function deleteTask(teamId: number, taskId: number): Promise<string> {
  const response = await httpClient.delete<ApiMessageResponse>(`/teams/${teamId}/tasks/${taskId}`);
  return response.data.message;
}
