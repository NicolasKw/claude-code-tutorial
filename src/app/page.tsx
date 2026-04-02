import { RegistrationForm } from '@/components/RegistrationForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Claude Code Mastery
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Aprende los 7 niveles de Claude Code construyendo tu propio bot de gestion personal
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Completalo en menos de 1 hora
          </p>
        </div>
        <RegistrationForm />
      </div>
    </main>
  );
}
