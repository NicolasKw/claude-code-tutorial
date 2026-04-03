'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { TutorialHeader } from '@/components/tutorial/TutorialHeader';
import { StepCard } from '@/components/tutorial/StepCard';
import { AchievementOverlay } from '@/components/tutorial/AchievementOverlay';
import { LockedLevel } from '@/components/tutorial/LockedLevel';
import { getLevelContent } from '@/lib/content/levels';
import { ErrorCallout } from '@/components/tutorial/ErrorCallout';
import { CodeBlock } from '@/components/tutorial/CodeBlock';

interface LevelPageProps {
  level: number;
}

export function LevelPage({ level }: LevelPageProps) {
  const router = useRouter();
  const { progress, completeStep, completeLevel, isLevelLocked, isStepCompleted } =
    useProgress();
  const [showOverlay, setShowOverlay] = useState(false);

  const levelData = getLevelContent(level);
  const steps = levelData?.steps ?? [];

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
        {levelData && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-[#171717]">{levelData.title}</h1>
            <p className="text-base text-[#171717]/70 mt-1">{levelData.subtitle}</p>
          </div>
        )}
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
                <p className="text-base text-[#171717] leading-relaxed">{step.explanation}</p>
                {step.codeBlock && (
                  <CodeBlock code={step.codeBlock.code} language={step.codeBlock.language} />
                )}
                {step.errorCallouts.map((callout, i) => (
                  <ErrorCallout key={i} {...callout} />
                ))}
              </StepCard>
            );
          })}
        </div>
      </div>
      <AchievementOverlay
        show={showOverlay}
        level={level}
        summary={levelData?.summary}
        onNavigate={() => router.push(`/tutorial/${level + 1}`)}
      />
    </div>
  );
}
