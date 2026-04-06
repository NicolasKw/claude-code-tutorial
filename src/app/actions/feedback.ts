'use server';

import { db } from '@/db';
import { feedback, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const feedbackSchema = z.object({
  type: z.enum(['feedback', 'bug']),
  message: z.string().min(5).max(1000),
  page: z.string(),
  sessionId: z.string().uuid().optional(),
});

export type FeedbackResult =
  | { success: true }
  | { success: false; error: string };

export async function submitFeedback(
  data: z.infer<typeof feedbackSchema>
): Promise<FeedbackResult> {
  const parsed = feedbackSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  let userId: string | null = null;

  if (parsed.data.sessionId) {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.sessionId, parsed.data.sessionId))
      .limit(1);
    if (user) userId = user.id;
  }

  await db.insert(feedback).values({
    type: parsed.data.type,
    message: parsed.data.message,
    page: parsed.data.page,
    userId: userId ?? undefined,
  });

  return { success: true };
}
