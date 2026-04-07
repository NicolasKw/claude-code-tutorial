'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TutorialProgress,
  PROGRESS_KEY,
  DEFAULT_PROGRESS,
} from '@/lib/types/tutorial';
import {
  isLevelLocked as pureIsLevelLocked,
  isStepCompleted as pureIsStepCompleted,
  completeStep as pureCompleteStep,
  completeLevel as pureCompleteLevel,
} from '@/lib/progress';
import { saveProgress } from '@/app/actions/progress';
import { getSessionId } from '@/lib/session';

export function useProgress() {
  const [progress, setProgress] = useState<TutorialProgress>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {
        // Invalid JSON — fall back to default
      }
    }
    setHydrated(true);
  }, []);

  // Persist whenever progress changes, but only after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    const sessionId = getSessionId();
    const hasProgress =
      progress.completedLevels.length > 0 ||
      Object.keys(progress.completedSteps).length > 0;
    if (sessionId && hasProgress) {
      saveProgress(sessionId, progress).catch(() => {});
    }
  }, [progress, hydrated]);

  const completeStep = useCallback(
    (level: number, step: number) => {
      setProgress((prev) => pureCompleteStep(prev, level, step));
    },
    []
  );

  const completeLevel = useCallback(
    (level: number) => {
      setProgress((prev) => pureCompleteLevel(prev, level));
    },
    []
  );

  const isLevelLocked = useCallback(
    (level: number) => pureIsLevelLocked(progress, level),
    [progress]
  );

  const isStepCompleted = useCallback(
    (level: number, step: number) => pureIsStepCompleted(progress, level, step),
    [progress]
  );

  return {
    progress,
    completeStep,
    completeLevel,
    isLevelLocked,
    isStepCompleted,
  };
}
