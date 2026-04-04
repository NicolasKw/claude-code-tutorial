import { db } from '@/db';
import { users, progress } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserForCertificate(userId: string) {
  const [result] = await db
    .select({
      name: users.name,
      linkedinUrl: users.linkedinUrl,
      createdAt: users.createdAt,
      progressData: progress.data,
      progressUpdatedAt: progress.updatedAt,
    })
    .from(users)
    .leftJoin(progress, eq(progress.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1);

  return result ?? null;
}
