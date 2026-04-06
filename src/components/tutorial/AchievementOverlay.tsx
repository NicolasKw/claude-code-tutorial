'use client';

import React from 'react';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface AchievementOverlayProps {
  show: boolean;
  level: number;
  summary?: string;
  onNavigate: () => void;
}

export function AchievementOverlay({ show, level, summary, onNavigate }: AchievementOverlayProps) {
  const { lang } = useLanguage();
  const t = UI[lang];

  if (!show) return null;
  const isFinalLevel = level >= TOTAL_LEVELS - 1;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(26,15,46,0.4)', backdropFilter: 'blur(8px)' }}>
      <div role="dialog" aria-modal="true" style={{ position: 'relative', width: '100%', maxWidth: '400px', borderRadius: '28px', padding: '40px 36px', textAlign: 'center', background: 'white', border: '1.5px solid rgba(147,51,234,0.15)', boxShadow: '0 24px 60px rgba(147,51,234,0.12), 0 8px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px', lineHeight: 1 }}>
          {isFinalLevel ? '🏆' : '⚡'}
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', background: isFinalLevel ? 'linear-gradient(135deg, #9333EA, #3B82F6)' : 'linear-gradient(135deg, #16A34A, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {isFinalLevel ? t.finalLevel : `${t.levelUpPrefix} ${level + 1}${t.levelUpSuffix}`}
        </h2>
        {summary && (
          <>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,15,46,0.3)', marginBottom: '6px' }}>{t.masteredLabel}</p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(26,15,46,0.6)', marginBottom: '28px' }}>{summary}</p>
          </>
        )}
        <button onClick={onNavigate} style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', background: isFinalLevel ? 'linear-gradient(135deg, #9333EA, #6366F1, #3B82F6)' : 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #06B6D4 100%)', color: 'white', boxShadow: isFinalLevel ? '0 4px 16px rgba(147,51,234,0.35)' : '0 6px 20px rgba(147,51,234,0.35), 0 2px 8px rgba(6,182,212,0.2)', transition: 'opacity 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {isFinalLevel ? t.seeCertificate : `${t.nextLevelPrefix} ${level + 2}${t.nextLevelSuffix}`}
        </button>
      </div>
    </div>
  );
}
