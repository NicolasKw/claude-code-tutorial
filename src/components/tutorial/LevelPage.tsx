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
import { SetupBlock } from '@/components/tutorial/SetupBlock';
import { getUserId } from '@/lib/session';
import { TOTAL_LEVELS, DISPLAY_LEVELS } from '@/lib/types/tutorial';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface LevelPageProps {
  level: number;
}

function AuroraBackground() {
  return (
    <>
      <div className="orb-1" style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle at center, #A855F7 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.1, mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb-2" style={{ position: 'fixed', bottom: '-200px', left: '-150px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 65%)', filter: 'blur(90px)', opacity: 0.08, mixBlendMode: 'multiply', pointerEvents: 'none', zIndex: 0 }} />
    </>
  );
}

export function LevelPage({ level }: LevelPageProps) {
  const router = useRouter();
  const { progress, completeStep, completeLevel, isLevelLocked, isStepCompleted } = useProgress();
  const [showOverlay, setShowOverlay] = useState(false);
  const { lang } = useLanguage();
  const t = UI[lang];

  const levelData = getLevelContent(level, lang);
  const steps = levelData?.steps ?? [];

  function isStepVisible(stepIndex: number): boolean {
    if (isStepCompleted(level, stepIndex)) return true;
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepCompleted(level, i)) return false;
    }
    return true;
  }

  if (isLevelLocked(level)) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <AuroraBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <TutorialHeader level={level} currentLevel={progress.currentLevel} completedLevels={progress.completedLevels} />
          <LockedLevel level={level} currentLevel={progress.currentLevel} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AuroraBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <TutorialHeader level={level} currentLevel={progress.currentLevel} completedLevels={progress.completedLevels} />
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 20px 80px' }}>

          {levelData && (
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px', background: 'rgba(147,51,234,0.08)', border: '1px solid rgba(147,51,234,0.18)', color: '#7C3AED' }}>
                {t.levelOfPrefix} {level} {t.levelOfSeparator} {DISPLAY_LEVELS}
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '8px', color: '#1A0F2E' }}>
                {levelData.title}
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(26,15,46,0.5)', lineHeight: 1.65 }}>
                {levelData.subtitle}
              </p>
              {levelData.sourceUrl && (
                <a
                  href={levelData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '12px', color: 'rgba(124,58,237,0.7)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {t.officialDocs}
                </a>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {steps.map((step, stepIndex) => {
              if (!isStepVisible(stepIndex)) return null;
              return (
                <StepCard
                  key={stepIndex}
                  stepIndex={stepIndex}
                  isCompleted={isStepCompleted(level, stepIndex)}
                  isFinalStep={stepIndex === steps.length - 1}
                  onComplete={() => completeStep(level, stepIndex)}
                  onLevelComplete={() => { completeLevel(level); setShowOverlay(true); }}
                >
                  <p style={{ fontWeight: 700, fontSize: '15px', color: '#1A0F2E', marginBottom: '4px' }}>{step.title}</p>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(26,15,46,0.6)' }}>{step.explanation}</p>
                  {step.setupBlock && <SetupBlock {...step.setupBlock} />}
                  {step.codeBlock && <CodeBlock code={step.codeBlock.code} language={step.codeBlock.language} />}
                  {step.errorCallouts.map((callout, i) => <ErrorCallout key={i} {...callout} />)}
                </StepCard>
              );
            })}
          </div>
        </div>
      </div>

      <AchievementOverlay
        show={showOverlay}
        level={level}
        summary={levelData?.summary}
        onNavigate={() => {
          if (level >= TOTAL_LEVELS - 1) {
            const userId = getUserId();
            router.push(userId ? `/certificate/${userId}` : '/');
          } else {
            router.push(`/tutorial/${level + 1}`);
          }
        }}
      />
    </div>
  );
}
