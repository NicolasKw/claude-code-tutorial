'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, type RegistrationResult } from '@/app/actions';
import { setSessionId, setUserId } from '@/lib/session';

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(217,173,255,0.2)',
  color: 'white',
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

  useEffect(() => {
    if (state?.success) {
      setSessionId(state.sessionId);
      setUserId(state.userId);
      router.push('/tutorial/0');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          style={inputStyle}
          placeholder="Tu nombre completo"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.55)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,173,255,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.name && (
          <p className="mt-1 text-sm" style={{ color: '#f87171' }}>{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Perfil de LinkedIn *
        </label>
        <input
          type="text"
          id="linkedinUrl"
          name="linkedinUrl"
          required
          style={inputStyle}
          placeholder="linkedin.com/in/tu-perfil"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.55)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,173,255,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.linkedinUrl && (
          <p className="mt-1 text-sm" style={{ color: '#f87171' }}>{state.errors.linkedinUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Email <span style={{ color: 'rgba(255,255,255,0.35)' }}>(opcional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          style={inputStyle}
          placeholder="tu@email.com"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.55)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,173,255,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217,173,255,0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {state && !state.success && state.errors?.email && (
          <p className="mt-1 text-sm" style={{ color: '#f87171' }}>{state.errors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full font-semibold py-3 rounded-xl mt-2 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #D9ADFF 0%, #70B5FF 100%)',
          color: '#0C0A14',
          fontSize: '15px',
          opacity: pending ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => { if (!pending) e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={(e) => { if (!pending) e.currentTarget.style.opacity = '1'; }}
      >
        {pending ? 'Registrando...' : 'Comenzar Tutorial →'}
      </button>
    </form>
  );
}
