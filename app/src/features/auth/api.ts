import { httpClient } from '../../lib/httpClient';
import type { AuthSession, LoginInput, SignupInput } from '../../types/auth';

interface BackendUser {
  id: string | number;
  name: string;
  email: string;
}

interface BackendAuthData {
  user: BackendUser;
  accessToken?: string;
  token?: string;
}

interface WrappedAuthResponse {
  success?: boolean;
  data?: BackendAuthData;
}

function normalizeAuthSession(payload: unknown): AuthSession {
  const directSession = payload as AuthSession;
  if (directSession?.token && directSession?.user) {
    return {
      token: directSession.token,
      user: {
        id: String(directSession.user.id),
        name: directSession.user.name,
        email: directSession.user.email,
      },
    };
  }

  const wrapped = payload as WrappedAuthResponse;
  const token = wrapped?.data?.accessToken ?? wrapped?.data?.token;
  const user = wrapped?.data?.user;

  if (!token || !user) {
    throw new Error('Invalid authentication response from server.');
  }

  return {
    token,
    user: {
      id: String(user.id),
      name: user.name,
      email: user.email,
    },
  };
}

export async function loginRequest(input: LoginInput): Promise<AuthSession> {
  const response = await httpClient.post('/auth/login', input);
  return normalizeAuthSession(response.data);
}

export async function signupRequest(input: SignupInput): Promise<AuthSession> {
  const response = await httpClient.post('/auth/register', input);
  return normalizeAuthSession(response.data);
}
