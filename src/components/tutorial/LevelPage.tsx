'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { TutorialHeader } from '@/components/tutorial/TutorialHeader';
import { StepCard } from '@/components/tutorial/StepCard';
import { AchievementOverlay } from '@/components/tutorial/AchievementOverlay';
import { LockedLevel } from '@/components/tutorial/LockedLevel';

interface LevelPageProps {
  level: number;
}

const PLACEHOLDER_STEPS = [
  { title: 'Paso 1', content: 'Contenido del paso 1 (se agrega en Fase 3)' },
  { title: 'Paso 2', content: 'Contenido del paso 2 (se agrega en Fase 3)' },
  { title: 'Paso 3', content: 'Contenido del paso 3 (se agrega en Fase 3)' },
];

export function LevelPage({ level }: LevelPageProps) {
  const router = useRouter();
  const { progress, completeStep, completeLevel, isLevelLocked, isStepCompleted } =
    useProgress();
  const [showOverlay, setShowOverlay] = useState(false);

  const steps = PLACEHOLDER_STEPS;

  // Determine which steps are visible: up to and including the first uncompleted step
  function isStepVisible(stepIndex: number): boolean {
    // Completed steps are always visible
    if (isStepCompleted(level, stepIndex)) return true;
    // First uncompleted step is visible
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepCompleted(level, i)) return false;
    }
    return true;
  }

  if (isLevelLocked(level)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <TutorialHeader currentLevel={progress.currentLevel} />
        <LockedLevel level={level} currentLevel={progress.currentLevel} />
      </div>
    );
  }

  return (
    <div>
      <TutorialHeader currentLevel={progress.currentLevel} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {steps.map((step, stepIndex) => {
            if (!isStepVisible(stepIndex)) return null;
            return (
              <StepCard
                key={stepIndex}
                stepIndex={stepIndex}
                isCompleted={isStepCompleted(level, stepIndex)}
                isFinalStep={stepIndex === steps.length - 1}
                onComplete={() => completeStep(level, stepIndex)}
                onLevelComplete={() => {
                  completeLevel(level);
                  setShowOverlay(true);
                }}
              >
                <p className="font-semibold text-base">{step.title}</p>
                <p className="text-base text-[#171717]">{step.content}</p>
              </StepCard>
            );
          })}
        </div>
      </div>
      <AchievementOverlay
        show={showOverlay}
        level={level}
        onNavigate={() => router.push(`/tutorial/${level + 1}`)}
      />
    </div>
  );
}
