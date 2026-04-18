import { httpClient } from '../../lib/httpClient';
import type { AuthSession, LoginInput, SignupInput } from '../../types/auth';

export async function loginRequest(input: LoginInput): Promise<AuthSession> {
  const response = await httpClient.post<AuthSession>('/auth/login', input);
  return response.data;
}

export async function signupRequest(input: SignupInput): Promise<AuthSession> {
  const response = await httpClient.post<AuthSession>('/auth/signup', input);
  return response.data;
}
