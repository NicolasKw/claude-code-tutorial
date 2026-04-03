import { describe, it, expect } from 'vitest';
import {
  isLevelLocked,
  isStepCompleted,
  completeStep,
  completeLevel,
} from '../progress';
import { DEFAULT_PROGRESS, TutorialProgress } from '../types/tutorial';

describe('isLevelLocked', () => {
  it('returns false for level 0 (always unlocked)', () => {
    expect(isLevelLocked(DEFAULT_PROGRESS, 0)).toBe(false);
  });

  it('returns false for level equal to currentLevel', () => {
    const progress: TutorialProgress = { ...DEFAULT_PROGRESS, currentLevel: 3 };
    expect(isLevelLocked(progress, 3)).toBe(false);
  });

  it('returns true for level greater than currentLevel', () => {
    const progress: TutorialProgress = { ...DEFAULT_PROGRESS, currentLevel: 3 };
    expect(isLevelLocked(progress, 4)).toBe(true);
  });

  it('returns false for level less than currentLevel', () => {
    const progress: TutorialProgress = { ...DEFAULT_PROGRESS, currentLevel: 3 };
    expect(isLevelLocked(progress, 2)).toBe(false);
  });
});

describe('isStepCompleted', () => {
  it('returns false when no steps completed for level', () => {
    expect(isStepCompleted(DEFAULT_PROGRESS, 1, 0)).toBe(false);
  });

  it('returns true when step is in completedSteps for that level', () => {
    const progress: TutorialProgress = {
      ...DEFAULT_PROGRESS,
      completedSteps: { 1: [0, 2] },
    };
    expect(isStepCompleted(progress, 1, 0)).toBe(true);
    expect(isStepCompleted(progress, 1, 2)).toBe(true);
  });

  it('returns false for a step not in completedSteps', () => {
    const progress: TutorialProgress = {
      ...DEFAULT_PROGRESS,
      completedSteps: { 1: [0] },
    };
    expect(isStepCompleted(progress, 1, 1)).toBe(false);
  });
});

describe('completeStep', () => {
  it('adds step to completedSteps for the given level', () => {
    const result = completeStep(DEFAULT_PROGRESS, 1, 2);
    expect(result.completedSteps[1]).toContain(2);
  });

  it('does not duplicate if step already completed', () => {
    const progress: TutorialProgress = {
      ...DEFAULT_PROGRESS,
      completedSteps: { 1: [2] },
    };
    const result = completeStep(progress, 1, 2);
    expect(result.completedSteps[1].filter((s) => s === 2).length).toBe(1);
  });

  it('preserves other levels completedSteps', () => {
    const progress: TutorialProgress = {
      ...DEFAULT_PROGRESS,
      completedSteps: { 0: [0, 1] },
    };
    const result = completeStep(progress, 1, 2);
    expect(result.completedSteps[0]).toEqual([0, 1]);
    expect(result.completedSteps[1]).toContain(2);
  });

  it('does not mutate the original progress', () => {
    const progress = { ...DEFAULT_PROGRESS };
    completeStep(progress, 1, 2);
    expect(progress.completedSteps[1]).toBeUndefined();
  });
});

describe('completeLevel', () => {
  it('adds level to completedLevels', () => {
    const result = completeLevel(DEFAULT_PROGRESS, 2);
    expect(result.completedLevels).toContain(2);
  });

  it('advances currentLevel to level + 1', () => {
    const result = completeLevel(DEFAULT_PROGRESS, 2);
    expect(result.currentLevel).toBe(3);
  });

  it('does not reduce currentLevel if already higher', () => {
    const progress: TutorialProgress = { ...DEFAULT_PROGRESS, currentLevel: 5 };
    const result = completeLevel(progress, 2);
    expect(result.currentLevel).toBe(5);
  });

  it('advances to level + 1 for last level (6)', () => {
    const result = completeLevel(DEFAULT_PROGRESS, 6);
    expect(result.currentLevel).toBe(7);
  });

  it('does not duplicate completed levels', () => {
    const progress: TutorialProgress = {
      ...DEFAULT_PROGRESS,
      completedLevels: [2],
    };
    const result = completeLevel(progress, 2);
    expect(result.completedLevels.filter((l) => l === 2).length).toBe(1);
  });

  it('does not mutate the original progress', () => {
    const progress = { ...DEFAULT_PROGRESS };
    completeLevel(progress, 2);
    expect(progress.completedLevels).toEqual([]);
  });
});
