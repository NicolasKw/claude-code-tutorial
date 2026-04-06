'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface LockedLevelProps {
  level: number;
  currentLevel: number;
}

export function LockedLevel({ level, currentLevel }: LockedLevelProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = UI[lang];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '24px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: 'rgba(147,51,234,0.08)', border: '1.5px solid rgba(147,51,234,0.18)' }}>
        <Lock size={22} style={{ color: '#7C3AED' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1A0F2E', marginBottom: '8px' }}>{t.lockedTitle}</h2>
      <p style={{ fontSize: '14px', color: 'rgba(26,15,46,0.45)', marginBottom: '28px' }}>
        {t.completeFirstPrefix} {level} {t.completeFirstSuffix}
      </p>
      <button onClick={() => router.push(`/tutorial/${currentLevel}`)} style={{ padding: '10px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: 'rgba(147,51,234,0.08)', border: '1.5px solid rgba(147,51,234,0.2)', color: '#7C3AED', transition: 'opacity 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        {t.goBackPrefix} {currentLevel + 1}
      </button>
    </div>
  );
}
