import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '../useProgress';
import { DEFAULT_PROGRESS, PROGRESS_KEY } from '@/lib/types/tutorial';

vi.mock('@/app/actions/progress', () => ({
  saveProgress: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/session', () => ({
  getSessionId: vi.fn().mockReturnValue('test-session-id'),
}));

import { saveProgress } from '@/app/actions/progress';
import { getSessionId } from '@/lib/session';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('useProgress', () => {
  it('initializes with DEFAULT_PROGRESS when localStorage is empty', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress).toEqual(DEFAULT_PROGRESS);
  });

  it('reads existing progress from localStorage on mount', () => {
    const stored = { currentLevel: 2, completedLevels: [0, 1], completedSteps: { 0: [0], 1: [0] } };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored));
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress).toEqual(stored);
  });

  it('completeStep updates localStorage with new step', () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.completeStep(0, 2);
    });
    const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(stored.completedSteps[0]).toContain(2);
  });

  it('completeLevel advances currentLevel and updates localStorage', () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.completeLevel(0);
    });
    const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(stored.currentLevel).toBe(1);
  });

  it('completeLevel calls saveProgress server action with sessionId', async () => {
    const { result } = renderHook(() => useProgress());
    await act(async () => {
      result.current.completeLevel(0);
    });
    expect(getSessionId).toHaveBeenCalled();
    expect(saveProgress).toHaveBeenCalledWith(
      'test-session-id',
      expect.objectContaining({ currentLevel: 1 })
    );
  });

  it('isLevelLocked returns true for levels beyond currentLevel', () => {
    const { result } = renderHook(() => useProgress());
    // currentLevel starts at 0, so level 1 is locked
    expect(result.current.isLevelLocked(1)).toBe(true);
    expect(result.current.isLevelLocked(0)).toBe(false);
  });

  it('isStepCompleted returns true for completed steps', () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.completeStep(0, 1);
    });
    expect(result.current.isStepCompleted(0, 1)).toBe(true);
    expect(result.current.isStepCompleted(0, 2)).toBe(false);
  });
});
