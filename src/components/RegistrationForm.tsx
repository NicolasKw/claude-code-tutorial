'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, type RegistrationResult } from '@/app/actions';
import { setSessionId, setUserId } from '@/lib/session';
import { useLanguage } from '@/lib/i18n/context';
import { UI } from '@/lib/i18n/ui';

const inputStyle = {
  background: '#F8F6FF',
  border: '1.5px solid rgba(147,51,234,0.15)',
  color: '#1A0F2E',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  fontSize: '15px',
  transition: 'border-color 0.2s, box-shadow 0.2s',
} as React.CSSProperties;

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState<RegistrationResult | null, FormData>(registerUser, null);
  const router = useRouter();
  const { lang } = useLanguage();
  const t = UI[lang];

  useEffect(() => {
    if (state?.success) {
      setSessionId(state.sessionId);
      setUserId(state.userId);
      router.push('/tutorial/0');
    }
  }, [state, router]);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(26,15,46,0.7)' }}>
          {t.nameLabel}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          style={inputStyle}
          placeholder={t.namePlaceholder}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.name && (
          <p style={{ marginTop: '4px', fontSize: '13px', color: '#DC2626' }}>{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="linkedinUrl" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(26,15,46,0.7)' }}>
          {t.linkedinLabel}
        </label>
        <input
          type="text"
          id="linkedinUrl"
          name="linkedinUrl"
          required
          style={inputStyle}
          placeholder={t.linkedinPlaceholder}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.linkedinUrl && (
          <p style={{ marginTop: '4px', fontSize: '13px', color: '#DC2626' }}>{state.errors.linkedinUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'rgba(26,15,46,0.7)' }}>
          {t.emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          style={inputStyle}
          placeholder={t.emailPlaceholder}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.5)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.08)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(147,51,234,0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.email && (
          <p style={{ marginTop: '4px', fontSize: '13px', color: '#DC2626' }}>{state.errors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{ width: '100%', padding: '13px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.6 : 1, background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #3B82F6 100%)', color: 'white', boxShadow: '0 4px 16px rgba(147,51,234,0.3)', transition: 'opacity 0.15s, box-shadow 0.15s', marginTop: '4px' }}
        onMouseEnter={(e) => { if (!pending) { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(147,51,234,0.4)'; } }}
        onMouseLeave={(e) => { if (!pending) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(147,51,234,0.3)'; } }}
      >
        {pending ? t.submitting : t.submitBtn}
      </button>
    </form>
  );
}
