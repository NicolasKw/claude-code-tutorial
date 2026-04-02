'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { registrationSchema } from '@/lib/validations';

export type RegistrationResult =
  | { success: true; sessionId: string }
  | { success: false; errors: Record<string, string[]> };

export async function registerUser(
  _prevState: RegistrationResult | null,
  formData: FormData
): Promise<RegistrationResult> {
  const raw = {
    name: formData.get('name'),
    linkedinUrl: formData.get('linkedinUrl'),
    email: formData.get('email') || undefined,
  };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const sessionId = crypto.randomUUID();

  await db.insert(users).values({
    name: parsed.data.name,
    linkedinUrl: parsed.data.linkedinUrl,
    email: parsed.data.email ?? null,
    sessionId,
  });

  return { success: true, sessionId };
}
