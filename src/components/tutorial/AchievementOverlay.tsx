'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';

interface AchievementOverlayProps {
  show: boolean;
  level: number;
  summary?: string;
  onNavigate: () => void;
}

export function AchievementOverlay({
  show,
  level,
  summary,
  onNavigate,
}: AchievementOverlayProps) {
  if (!show) return null;

  // Level is 0-indexed; the final level is TOTAL_LEVELS - 1 (i.e., 6)
  const isFinalLevel = level >= TOTAL_LEVELS - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <Card
        className="max-w-sm w-full mx-4 bg-[#E9FFB9]"
        role="dialog"
        aria-modal="true"
      >
        <CardHeader>
          <h2 className="text-[28px] font-semibold leading-[1.1] text-[#171717]">
            Nivel {level} completado
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-semibold text-[#171717] mt-4">Qué lograste</p>
          <p className="text-base text-[#171717] leading-relaxed mt-2">
            {summary || 'Placeholder — el contenido se agrega en la Fase 3.'}
          </p>
          <Button
            className={`h-11 w-full mt-6 font-semibold text-[#171717] ${
              isFinalLevel
                ? 'bg-[#D9ADFF] hover:opacity-80'
                : 'bg-[#70B5FF] hover:opacity-80'
            }`}
            onClick={onNavigate}
          >
            {isFinalLevel ? 'Ver mi certificado' : `Ir al Nivel ${level + 1}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
