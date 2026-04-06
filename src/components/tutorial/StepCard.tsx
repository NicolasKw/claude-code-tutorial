'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface StepCardProps {
  stepIndex: number;
  isCompleted: boolean;
  isFinalStep: boolean;
  onComplete: () => void;
  onLevelComplete?: () => void;
  children: React.ReactNode;
}

export function StepCard({ stepIndex, isCompleted, isFinalStep, onComplete, onLevelComplete, children }: StepCardProps) {
  const { lang } = useLanguage();
  const t = UI[lang];

  function handleClick() {
    onComplete();
    if (isFinalStep) onLevelComplete?.();
  }

  const completedBtn = (
    <button disabled style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', color: '#16A34A', cursor: 'default', width: 'auto' }}>
      <Check size={13} />
      {t.markDone}
    </button>
  );

  const activeBtn = (
    <button
      onClick={handleClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #3B82F6 100%)', color: 'white', cursor: 'pointer', width: 'auto', boxShadow: '0 4px 14px rgba(147,51,234,0.3)', transition: 'opacity 0.15s, box-shadow 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(147,51,234,0.45)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(147,51,234,0.3)'; }}
    >
      {t.markDone}
    </button>
  );

  return (
    <div style={{
      borderRadius: '18px',
      padding: '24px',
      background: 'white',
      border: isCompleted ? '1.5px solid rgba(22,163,74,0.2)' : '1.5px solid rgba(147,51,234,0.1)',
      boxShadow: isCompleted
        ? '0 2px 12px rgba(22,163,74,0.06)'
        : '0 2px 12px rgba(147,51,234,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Step badge */}
        <div style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          marginTop: '1px',
          background: isCompleted ? 'rgba(22,163,74,0.1)' : 'rgba(147,51,234,0.1)',
          color: isCompleted ? '#16A34A' : '#7C3AED',
          border: isCompleted ? '1.5px solid rgba(22,163,74,0.25)' : '1.5px solid rgba(147,51,234,0.2)',
        }}>
          {isCompleted ? <Check size={13} /> : stepIndex + 1}
        </div>

        {/* Content + button */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
          {isCompleted ? completedBtn : activeBtn}
        </div>
      </div>
    </div>
  );
}
