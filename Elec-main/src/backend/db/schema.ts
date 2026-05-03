import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from "drizzle-orm";

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  hashedPassword: text('hashed_password').notNull(),
  displayName: text('display_name').notNull(),
  country: text('country').default('US'),
  stateDistrict: text('state_district'),
  ageGroup: text('age_group'),
  learningGoal: text('learning_goal'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

export const quizScores = sqliteTable('quiz_scores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  topicId: text('topic_id').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  bestScore: integer('best_score').notNull(),
  attempts: integer('attempts').default(1),
  lastPlayed: integer('last_played', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').default('New Conversation'),
  messages: text('messages', { mode: 'json' }).$type<any[]>().default([]),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
});

export const guideProgress = sqliteTable('guide_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id),
  stepId: integer('step_id').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  checklistState: text('checklist_state', { mode: 'json' }).$type<Record<string, boolean>>().default({}),
  completedAt: integer('completed_at', { mode: 'timestamp' })
});
