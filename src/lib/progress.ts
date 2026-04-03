import type { TutorialProgress } from './types/tutorial';

export function isLevelLocked(progress: TutorialProgress, level: number): boolean {
  return level > progress.currentLevel;
}

export function isStepCompleted(
  progress: TutorialProgress,
  level: number,
  step: number
): boolean {
  return progress.completedSteps[level]?.includes(step) ?? false;
}

export function completeStep(
  progress: TutorialProgress,
  level: number,
  step: number
): TutorialProgress {
  const existing = progress.completedSteps[level] ?? [];
  const deduped = Array.from(new Set([...existing, step]));
  return {
    ...progress,
    completedSteps: {
      ...progress.completedSteps,
      [level]: deduped,
    },
  };
}

export function completeLevel(
  progress: TutorialProgress,
  level: number
): TutorialProgress {
  const deduped = Array.from(new Set([...progress.completedLevels, level]));
  const nextLevel = Math.max(progress.currentLevel, level + 1);
  return {
    ...progress,
    completedLevels: deduped,
    currentLevel: nextLevel,
  };
}
