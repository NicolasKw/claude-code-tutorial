'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { registrationSchema } from '@/lib/validations';

export type RegistrationResult =
  | { success: true; sessionId: string; userId: string }
  | { success: false; errors: Record<string, string[]> };

export async function registerUser(
  _prevState: RegistrationResult | null,
  formData: FormData
): Promise<RegistrationResult> {
  const raw = {
    name: formData.get('name'),
    linkedinUrl: formData.get('linkedinUrl'),
    email: formData.get('email'),
  };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const sessionId = crypto.randomUUID();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.linkedinUrl, parsed.data.linkedinUrl))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ sessionId, name: parsed.data.name, email: parsed.data.email })
      .where(eq(users.linkedinUrl, parsed.data.linkedinUrl));

    return { success: true, sessionId, userId: existing.id };
  }

  const [inserted] = await db.insert(users).values({
    name: parsed.data.name,
    linkedinUrl: parsed.data.linkedinUrl,
    email: parsed.data.email,
    sessionId,
  }).returning({ id: users.id });

  return { success: true, sessionId, userId: inserted.id };
}
