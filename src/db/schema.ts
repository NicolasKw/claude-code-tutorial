import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
  email: text('email'),
  sessionId: uuid('session_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
