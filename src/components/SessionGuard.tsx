'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionId } from '@/lib/session';

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      router.replace('/');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
