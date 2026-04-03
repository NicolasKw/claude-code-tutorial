'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LockedLevelProps {
  level: number;
  currentLevel: number;
}

export function LockedLevel({ level, currentLevel }: LockedLevelProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <Lock size={24} aria-hidden="true" className="text-[#171717]" />
      <h2 className="text-xl font-semibold leading-[1.2] text-[#171717]">
        Este nivel está bloqueado
      </h2>
      <p className="text-base text-[#171717]">
        Completá el Nivel {level - 1} para desbloquearlo.
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
