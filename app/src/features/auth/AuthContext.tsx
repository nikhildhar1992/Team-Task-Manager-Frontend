import { type PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { SESSION_EXPIRED_EVENT } from '../../lib/httpClient';
import {
  clearSession as clearStoredSession,
  consumeAuthNotice,
  getSession,
  setAuthNotice,
  setSession as setStoredSession,
} from '../../lib/session';
import type { AuthSession } from '../../types/auth';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  applySession: (session: AuthSession) => void;
  logout: (message?: string) => void;
  notice: string | null;
  clearNotice: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => getSession());
  const [notice, setNotice] = useState<string | null>(() => consumeAuthNotice());

  const applySession = useCallback((nextSession: AuthSession) => {
    setStoredSession(nextSession);
    setSession(nextSession);
    setNotice(null);
  }, []);

  const logout = useCallback((message?: string) => {
    clearStoredSession();
    setSession(null);
    if (message) {
      setAuthNotice(message);
      setNotice(message);
    }
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      logout('Your session expired. Please log in again.');
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      applySession,
      logout,
      notice,
      clearNotice: () => setNotice(null),
    }),
    [session, applySession, logout, notice],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
