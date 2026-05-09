import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTeam, deleteTeam, getTeamById, getTeams } from './api';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useTeamDetail(teamId: number | null) {
  return useQuery({
    queryKey: ['teams', teamId, 'detail'],
    queryFn: () => getTeamById(teamId as number),
    enabled: typeof teamId === 'number' && teamId > 0,
  });
}
