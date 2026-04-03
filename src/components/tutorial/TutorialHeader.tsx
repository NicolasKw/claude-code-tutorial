'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TutorialHeaderProps {
  currentLevel: number;
}

export function TutorialHeader({ currentLevel }: TutorialHeaderProps) {
  const progressValue = Math.round((currentLevel / 7) * 100);

  return (
    <header className="sticky top-0 z-50 bg-[#171717]">
      <div className="h-14 flex items-center justify-between px-4">
        <span className="text-white text-sm font-semibold">ZalesMachine</span>
        <Badge variant="secondary">Nivel {currentLevel} de 7</Badge>
      </div>
      <Progress
        value={progressValue}
        aria-label="Progreso del tutorial"
        className="h-2 w-full [&>div]:bg-brand-primary"
      />
    </header>
  );
}
