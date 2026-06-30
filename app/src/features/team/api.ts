import { httpClient } from '../../lib/httpClient';
import type { CreateTeamInput, Team, TeamDetail } from '../../types/team';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiMessageResponse {
  success: true;
  message: string;
}

export async function getTeams(): Promise<Team[]> {
  const response = await httpClient.get<ApiSuccessResponse<Team[]>>('/teams');
  return response.data.data;
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const response = await httpClient.post<ApiSuccessResponse<Team>>('/teams', {
    name: input.name,
  });
  return response.data.data;
}

export async function getTeamById(teamId: number): Promise<TeamDetail> {
  const response = await httpClient.get<ApiSuccessResponse<TeamDetail>>(`/teams/${teamId}`);
  return response.data.data;
}

export async function deleteTeam(teamId: number): Promise<string> {
  const response = await httpClient.delete<ApiMessageResponse>(`/teams/${teamId}`);
  return response.data.message;
}
