'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TOTAL_LEVELS, DISPLAY_LEVELS } from '@/lib/types/tutorial';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

interface TutorialHeaderProps {
  level: number;
  currentLevel: number;
  completedLevels?: number[];
}

export function TutorialHeader({ level, currentLevel, completedLevels = [] }: TutorialHeaderProps) {
  const progressValue = Math.round((currentLevel / TOTAL_LEVELS) * 100);
  const { lang } = useLanguage();
  const t = UI[lang];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(248,246,255,0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(147,51,234,0.1)', boxShadow: '0 1px 0 rgba(147,51,234,0.05)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image
          src="/zalesmachine-logo.png"
          alt="ZalesMachine"
          height={26}
          width={196}
          style={{ objectFit: 'contain', objectPosition: 'left' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {level > 0 && (
            <Link
              href={`/tutorial/${level - 1}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: 'rgba(26,15,46,0.45)', background: 'rgba(26,15,46,0.04)', border: '1px solid rgba(26,15,46,0.1)', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(26,15,46,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(26,15,46,0.7)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(26,15,46,0.04)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(26,15,46,0.45)'; }}
            >
              {t.prev}
            </Link>
          )}
          <span style={{ fontSize: '12px', color: 'rgba(26,15,46,0.35)', fontWeight: 500 }}>{t.levelLabel}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
              const isCompleted = completedLevels.includes(i);
              const isCurrent = i === currentLevel;
              const dot = (
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? 'linear-gradient(135deg, #9333EA, #3B82F6)'
                      : isCurrent
                      ? 'rgba(147,51,234,0.3)'
                      : 'rgba(26,15,46,0.1)',
                    boxShadow: isCompleted ? '0 0 5px rgba(147,51,234,0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    cursor: isCompleted ? 'pointer' : 'default',
                  }}
                />
              );
              return isCompleted ? (
                <Link key={i} href={`/tutorial/${i}`} title={`${t.goToLevel} ${i + 1}`} style={{ display: 'flex', borderRadius: '50%' }}>
                  {dot}
                </Link>
              ) : (
                <div key={i}>{dot}</div>
              );
            })}
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(26,15,46,0.35)', fontWeight: 500 }}>{Math.max(0, currentLevel - 1)}/{DISPLAY_LEVELS}</span>
          {level < currentLevel && (
            <Link
              href={`/tutorial/${level + 1}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: '#7C3AED', background: 'rgba(147,51,234,0.08)', border: '1px solid rgba(147,51,234,0.18)', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(147,51,234,0.14)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(147,51,234,0.08)'; }}
            >
              {t.next}
            </Link>
          )}
          <LanguageToggle />
        </div>
      </div>

      {/* Gradient progress bar */}
      <div style={{ height: '2px', background: 'rgba(147,51,234,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progressValue}%`, background: 'linear-gradient(90deg, #9333EA, #6366F1, #3B82F6)', boxShadow: '0 0 6px rgba(147,51,234,0.5)', transition: 'width 0.5s ease' }} />
      </div>
    </header>
  );
}
