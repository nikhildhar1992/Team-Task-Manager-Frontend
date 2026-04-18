import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTeam, getCurrentTeam, getTeamMembers, inviteMember } from './api';
import type { PaginationParams } from '../../types/api';

export function useCurrentTeam() {
  return useQuery({
    queryKey: ['team', 'current'],
    queryFn: getCurrentTeam,
  });
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', 'members'] });
    },
  });
}

export function useTeamMembers(params: PaginationParams, enabled = true) {
  return useQuery({
    queryKey: ['team', 'members', params],
    queryFn: () => getTeamMembers(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}
