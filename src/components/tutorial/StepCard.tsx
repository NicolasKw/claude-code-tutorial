'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepCardProps {
  stepIndex: number;
  isCompleted: boolean;
  isFinalStep: boolean;
  onComplete: () => void;
  onLevelComplete?: () => void;
  children: React.ReactNode;
}

export function StepCard({
  isCompleted,
  isFinalStep,
  onComplete,
  onLevelComplete,
  children,
}: StepCardProps) {
  function handleClick() {
    onComplete();
    if (isFinalStep) {
      onLevelComplete?.();
    }
  }

  return (
    <div className="space-y-4">
      <div>{children}</div>
      {isCompleted ? (
        <Button
          className="w-full max-w-xs mx-auto h-11 border-[#D9ADFF] text-[#D9ADFF] pointer-events-none flex items-center gap-2"
          variant="outline"
        >
          <Check size={16} />
          Listo, ya lo hice
        </Button>
      ) : (
        <Button
          className="w-full max-w-xs mx-auto h-11 bg-[#D9ADFF] text-[#171717] font-semibold hover:opacity-80 active:scale-[0.97]"
          onClick={handleClick}
        >
          Listo, ya lo hice
        </Button>
      )}
    </div>
  );
}
