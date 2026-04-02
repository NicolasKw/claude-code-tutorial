'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, type RegistrationResult } from '@/app/actions';
import { setSessionId } from '@/lib/session';

export function RegistrationForm() {
  const [state, formAction, pending] = useActionState<RegistrationResult | null, FormData>(registerUser, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setSessionId(state.sessionId);
      router.push('/tutorial/1');
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Tu nombre completo"
        />
        {state && !state.success && state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
          Perfil de LinkedIn *
        </label>
        <input
          type="text"
          id="linkedinUrl"
          name="linkedinUrl"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="linkedin.com/in/tu-perfil"
        />
        {state && !state.success && state.errors?.linkedinUrl && (
          <p className="mt-1 text-sm text-red-600">{state.errors.linkedinUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email (opcional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="tu@email.com"
        />
        {state && !state.success && state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Registrando...' : 'Comenzar Tutorial'}
      </button>
    </form>
  );
}
