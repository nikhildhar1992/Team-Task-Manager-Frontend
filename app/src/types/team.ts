export type TeamRole = 'Admin' | 'Member';

export interface Team {
  id: string;
  name: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
}

export interface InviteMemberInput {
  name: string;
  email: string;
  role: TeamRole;
}
