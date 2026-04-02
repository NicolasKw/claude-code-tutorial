import { describe, it, expect, beforeEach } from 'vitest';
import { getSessionId, setSessionId, clearSession, SESSION_KEY } from '../session';

describe('session helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getSessionId() returns null when localStorage is empty', () => {
    expect(getSessionId()).toBeNull();
  });

  it('setSessionId stores value and getSessionId returns it', () => {
    setSessionId('abc-123');
    expect(getSessionId()).toBe('abc-123');
  });

  it('clearSession removes the stored sessionId', () => {
    setSessionId('abc-123');
    clearSession();
    expect(getSessionId()).toBeNull();
  });

  it('SESSION_KEY constant equals "sessionId"', () => {
    expect(SESSION_KEY).toBe('sessionId');
  });
});
