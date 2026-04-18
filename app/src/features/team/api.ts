import { httpClient } from '../../lib/httpClient';
import type { PaginatedResponse, PaginationParams } from '../../types/api';
import type { CreateTeamInput, InviteMemberInput, Team, TeamMember } from '../../types/team';

export async function getCurrentTeam(): Promise<Team | null> {
  try {
    const response = await httpClient.get<Team>('/teams/current');
    return response.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'response' in error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status == 404) {
        return null;
      }
    }
    throw error;
  }
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await httpClient.post<Team>('/teams', input);
  return response.data;
}

export async function inviteMember(input: InviteMemberInput): Promise<void> {
  await httpClient.post('/teams/current/invite', input);
}

export async function getTeamMembers(params: PaginationParams): Promise<PaginatedResponse<TeamMember>> {
  const response = await httpClient.get<PaginatedResponse<TeamMember>>('/teams/current/members', {
    params,
  });
  return response.data;
}
