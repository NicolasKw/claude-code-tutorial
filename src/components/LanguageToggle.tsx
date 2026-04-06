'use client';

import { useLanguage } from '@/lib/i18n/context';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        cursor: 'pointer',
        background: 'rgba(147,51,234,0.08)',
        border: '1px solid rgba(147,51,234,0.18)',
        color: '#7C3AED',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(147,51,234,0.14)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(147,51,234,0.08)'; }}
    >
      <span style={{ fontSize: '13px', lineHeight: 1 }}>🌐</span>
      <span>{lang === 'es' ? 'ES' : 'EN'}</span>
      <span style={{ opacity: 0.5, fontSize: '10px', marginLeft: '1px' }}>▾</span>
    </button>
  );
}
