'use server';

import { db } from '@/db';
import { progress, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { TutorialProgress } from '@/lib/types/tutorial';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';

export async function saveProgress(
  sessionId: string,
  data: TutorialProgress
): Promise<{ success: boolean }> {
  // Look up user by sessionId
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.sessionId, sessionId))
    .limit(1);

  if (!user) {
    return { success: false };
  }

  // Set completedAt exactly once when all levels are complete
  if (
    data.completedLevels.length >= TOTAL_LEVELS &&
    !data.completedAt
  ) {
    data = { ...data, completedAt: new Date().toISOString() };
  }

  // Upsert progress
  await db
    .insert(progress)
    .values({
      userId: user.id,
      data,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: progress.userId,
      set: { data, updatedAt: new Date() },
    });

  return { success: true };
}
