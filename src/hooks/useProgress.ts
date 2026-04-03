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
  }, []);

  const persist = useCallback((next: TutorialProgress) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    const sessionId = getSessionId();
    if (sessionId) {
      saveProgress(sessionId, next).catch(() => {});
    }
  }, []);

  const completeStep = useCallback(
    (level: number, step: number) => {
      setProgress((prev) => {
        const next = pureCompleteStep(prev, level, step);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const completeLevel = useCallback(
    (level: number) => {
      setProgress((prev) => {
        const next = pureCompleteLevel(prev, level);
        persist(next);
        return next;
      });
    },
    [persist]
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
