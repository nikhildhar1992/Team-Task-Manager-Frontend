import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignTask, createTask, getTasks, updateTaskStatus } from './api';
import type { TaskListParams } from '../../types/task';

export function useTasks(params: TaskListParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useAssignTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
