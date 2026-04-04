export const SESSION_KEY = 'sessionId';
export const USER_ID_KEY = 'userId';

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(sessionId: string): void {
  localStorage.setItem(SESSION_KEY, sessionId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}
