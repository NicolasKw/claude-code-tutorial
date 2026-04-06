'use client';

import Image from 'next/image';
import { RegistrationForm } from '@/components/RegistrationForm';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

const TRUST_COLORS = ['#9333EA', '#3B82F6', '#16A34A'];

export default function Home() {
  const { lang } = useLanguage();
  const t = UI[lang];

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* ── Orbs ── */}
      <div className="orb-1" style={{ position: 'absolute', top: '-200px', right: '-200px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle at center, #A855F7 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.12, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div className="orb-2" style={{ position: 'absolute', bottom: '-200px', left: '-200px', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 65%)', filter: 'blur(90px)', opacity: 0.1, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div className="orb-3" style={{ position: 'absolute', top: '45%', left: '35%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle at center, #818CF8 0%, transparent 65%)', filter: 'blur(110px)', opacity: 0.07, mixBlendMode: 'multiply', pointerEvents: 'none' }} />

      {/* ── Language toggle ── */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
        <LanguageToggle />
      </div>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Logo */}
        <Image src="/claude-code-mastery/zalesmachine isologo.png" alt="ZalesMachine" width={80} height={80} style={{ objectFit: 'contain', marginBottom: '24px' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px', background: 'rgba(147,51,234,0.08)', border: '1px solid rgba(147,51,234,0.2)', color: '#7C3AED' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 5px #16A34A' }} />
          {t.badge}
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.1, textAlign: 'center', marginBottom: '14px', letterSpacing: '-0.03em', color: '#1A0F2E' }}>
          Claude Code{' '}
          <span style={{ background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Mastery
          </span>
        </h1>

        <p style={{ textAlign: 'center', fontSize: '15px', lineHeight: 1.65, color: 'rgba(26,15,46,0.55)', marginBottom: '8px', maxWidth: '360px' }}>
          {t.tagline}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(26,15,46,0.35)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>⏱</span> {t.duration}
        </p>

        {/* Card */}
        <div style={{ width: '100%', borderRadius: '24px', padding: '32px', background: 'white', border: '1px solid rgba(147,51,234,0.12)', boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 24px 48px rgba(147,51,234,0.08), 0 0 0 1px rgba(255,255,255,0.8) inset' }}>
          <RegistrationForm />
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {t.trust.map((label, i) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(26,15,46,0.4)' }}>
              <span style={{ color: TRUST_COLORS[i], fontSize: '13px' }}>✓</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
