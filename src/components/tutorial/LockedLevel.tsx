'use client';

import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LockedLevelProps {
  level: number;
  currentLevel: number;
}

export function LockedLevel({ level: _level, currentLevel }: LockedLevelProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <Lock size={24} className="mx-auto mb-4 text-gray-400" aria-hidden="true" />
      <h2 className="text-xl font-semibold mb-2">Este nivel está bloqueado</h2>
      <p className="text-gray-400 mb-6">
        Completá el Nivel {currentLevel} para desbloquearlo.
      </p>
      <Button
        variant="outline"
        onClick={() => router.push(`/tutorial/${currentLevel}`)}
      >
        Volver al Nivel {currentLevel}
      </Button>
    </div>
  );
}
