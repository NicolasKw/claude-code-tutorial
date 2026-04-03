'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_PROGRESS,
  PROGRESS_KEY,
  type TutorialProgress,
} from '@/lib/types/tutorial';
import {
  completeStep as libCompleteStep,
  completeLevel as libCompleteLevel,
  isLevelLocked as libIsLevelLocked,
  isStepCompleted as libIsStepCompleted,
} from '@/lib/progress';
import { saveProgress } from '@/app/actions/progress';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('session_id') ?? '';
}

function loadFromStorage(): TutorialProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return JSON.parse(raw) as TutorialProgress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveToStorage(progress: TutorialProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function useProgress(): {
  progress: TutorialProgress;
  completeStep: (level: number, step: number) => void;
  completeLevel: (level: number) => void;
  isLevelLocked: (level: number) => boolean;
  isStepCompleted: (level: number, step: number) => boolean;
} {
  const [progress, setProgress] = useState<TutorialProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    setProgress(loadFromStorage());
  }, []);

  const completeStep = useCallback((level: number, step: number) => {
    setProgress((prev) => {
      const next = libCompleteStep(prev, level, step);
      saveToStorage(next);
      return next;
    });
  }, []);

  const completeLevel = useCallback((level: number) => {
    setProgress((prev) => {
      const next = libCompleteLevel(prev, level);
      saveToStorage(next);
      const sessionId = getSessionId();
      if (sessionId) {
        saveProgress(sessionId, next).catch(() => {
          // Silently fail — progress is already in localStorage
        });
      }
      return next;
    });
  }, []);

  const isLevelLocked = useCallback(
    (level: number) => libIsLevelLocked(progress, level),
    [progress]
  );

  const isStepCompleted = useCallback(
    (level: number, step: number) => libIsStepCompleted(progress, level, step),
    [progress]
  );

  return { progress, completeStep, completeLevel, isLevelLocked, isStepCompleted };
}
