import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { TutorialProgress } from '@/lib/types/tutorial';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
  email: text('email'),
  sessionId: uuid('session_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id).unique(),
  data: jsonb('data').notNull().$type<TutorialProgress>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
