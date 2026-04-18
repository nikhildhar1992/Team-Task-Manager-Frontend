import { createContext } from 'react';
import type { AuthSession } from '../../types/auth';

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  applySession: (session: AuthSession) => void;
  logout: (message?: string) => void;
  notice: string | null;
  clearNotice: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
