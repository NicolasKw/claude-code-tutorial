'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';

interface TutorialHeaderProps {
  currentLevel: number;
}

export function TutorialHeader({ currentLevel }: TutorialHeaderProps) {
  const progressValue = (currentLevel / TOTAL_LEVELS) * 100;

  return (
    <header className="sticky top-0 z-50 bg-[#171717] h-14 flex flex-col justify-center">
      <div className="flex items-center justify-between px-4">
        <span className="text-white text-sm font-semibold">ZalesMachine</span>
        <Badge variant="secondary" className="text-xs">
          Nivel {currentLevel} de {TOTAL_LEVELS}
        </Badge>
      </div>
      <Progress
        value={progressValue}
        className="h-2 rounded-none"
        aria-label="Progreso del tutorial"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </header>
  );
}
