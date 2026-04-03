import { describe, it } from 'vitest';

describe('useProgress', () => {
  it.todo('initializes with DEFAULT_PROGRESS when localStorage is empty');
  it.todo('reads existing progress from localStorage on mount');
  it.todo('completeStep updates localStorage with new step');
  it.todo('completeLevel advances currentLevel and updates localStorage');
  it.todo('completeLevel calls saveProgress server action with sessionId');
  it.todo('isLevelLocked returns true for levels beyond currentLevel');
  it.todo('isStepCompleted returns true for completed steps');
});
