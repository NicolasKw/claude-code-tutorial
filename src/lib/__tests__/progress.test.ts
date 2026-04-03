import { describe, it } from 'vitest';

describe('isLevelLocked', () => {
  it.todo('returns false for level 0 (always unlocked)');
  it.todo('returns false when level equals currentLevel');
  it.todo('returns true when level > currentLevel');
  it.todo('returns false when level < currentLevel');
});

describe('isStepCompleted', () => {
  it.todo('returns true when step is in completedSteps for the level');
  it.todo('returns false when step is not in completedSteps');
  it.todo('returns false when level has no completedSteps entry');
});

describe('completeStep', () => {
  it.todo('adds step to completedSteps for the given level');
  it.todo('does not duplicate if step already completed');
  it.todo('returns a new object (no mutation)');
});

describe('completeLevel', () => {
  it.todo('adds level to completedLevels');
  it.todo('advances currentLevel to level + 1');
  it.todo('does not duplicate if level already in completedLevels');
  it.todo('returns a new object (no mutation)');
});
