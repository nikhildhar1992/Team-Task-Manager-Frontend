export interface Team {
  id: number;
  name: string;
  createdAt?: string;
}

export interface TeamDetail {
  id: number;
  name: string;
  createdAt?: string;
}

export interface CreateTeamInput {
  name: string;
}
