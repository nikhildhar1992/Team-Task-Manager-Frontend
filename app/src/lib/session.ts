import type { AuthSession } from '../types/auth';

const SESSION_STORAGE_KEY = 'ttm.auth.session';
const NOTICE_STORAGE_KEY = 'ttm.auth.notice';

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function setAuthNotice(message: string): void {
  localStorage.setItem(NOTICE_STORAGE_KEY, message);
}

export function consumeAuthNotice(): string | null {
  const value = localStorage.getItem(NOTICE_STORAGE_KEY);
  if (value) {
    localStorage.removeItem(NOTICE_STORAGE_KEY);
  }
  return value;
}
