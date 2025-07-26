
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Define enums for PostgreSQL
export const languageEnum = pgEnum('language', ['english', 'hindi', 'tamil', 'telugu', 'bengali', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi']);
export const genderEnum = pgEnum('gender', ['boy', 'girl', 'unisex']);

// Baby names table
export const babyNamesTable = pgTable('baby_names', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  meaning: text('meaning').notNull(),
  origin: text('origin').notNull(),
  gender: genderEnum('gender').notNull(),
  language: languageEnum('language').notNull(),
  pronunciation: text('pronunciation'), // Nullable by default
  popularity_rank: integer('popularity_rank'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Parenting quotes table
export const parentingQuotesTable = pgTable('parenting_quotes', {
  id: serial('id').primaryKey(),
  quote: text('quote').notNull(),
  author: text('author'), // Nullable by default
  category: text('category'), // Nullable by default
  language: languageEnum('language').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// App configuration table
export const appConfigTable = pgTable('app_config', {
  id: serial('id').primaryKey(),
  config_key: text('config_key').notNull(),
  config_value: text('config_value').notNull(),
  description: text('description'), // Nullable by default
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type BabyName = typeof babyNamesTable.$inferSelect;
export type NewBabyName = typeof babyNamesTable.$inferInsert;

export type ParentingQuote = typeof parentingQuotesTable.$inferSelect;
export type NewParentingQuote = typeof parentingQuotesTable.$inferInsert;

export type AppConfig = typeof appConfigTable.$inferSelect;
export type NewAppConfig = typeof appConfigTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  babyNames: babyNamesTable,
  parentingQuotes: parentingQuotesTable,
  appConfig: appConfigTable
};
