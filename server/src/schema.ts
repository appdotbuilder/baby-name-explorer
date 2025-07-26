
import { z } from 'zod';

// Language enum for supported languages
export const languageEnum = z.enum(['english', 'hindi', 'tamil', 'telugu', 'bengali', 'marathi', 'gujarati', 'kannada', 'malayalam', 'punjabi']);
export type Language = z.infer<typeof languageEnum>;

// Gender enum for baby names
export const genderEnum = z.enum(['boy', 'girl', 'unisex']);
export type Gender = z.infer<typeof genderEnum>;

// Baby name schema
export const babyNameSchema = z.object({
  id: z.number(),
  name: z.string(),
  meaning: z.string(),
  origin: z.string(),
  gender: genderEnum,
  language: languageEnum,
  pronunciation: z.string().nullable(),
  popularity_rank: z.number().int().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BabyName = z.infer<typeof babyNameSchema>;

// Input schema for creating baby names
export const createBabyNameInputSchema = z.object({
  name: z.string().min(1),
  meaning: z.string().min(1),
  origin: z.string().min(1),
  gender: genderEnum,
  language: languageEnum,
  pronunciation: z.string().nullable(),
  popularity_rank: z.number().int().nullable()
});

export type CreateBabyNameInput = z.infer<typeof createBabyNameInputSchema>;

// Input schema for updating baby names
export const updateBabyNameInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  meaning: z.string().min(1).optional(),
  origin: z.string().min(1).optional(),
  gender: genderEnum.optional(),
  language: languageEnum.optional(),
  pronunciation: z.string().nullable().optional(),
  popularity_rank: z.number().int().nullable().optional()
});

export type UpdateBabyNameInput = z.infer<typeof updateBabyNameInputSchema>;

// Parenting quote schema
export const parentingQuoteSchema = z.object({
  id: z.number(),
  quote: z.string(),
  author: z.string().nullable(),
  category: z.string().nullable(),
  language: languageEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ParentingQuote = z.infer<typeof parentingQuoteSchema>;

// Input schema for creating parenting quotes
export const createParentingQuoteInputSchema = z.object({
  quote: z.string().min(1),
  author: z.string().nullable(),
  category: z.string().nullable(),
  language: languageEnum,
  is_active: z.boolean().default(true)
});

export type CreateParentingQuoteInput = z.infer<typeof createParentingQuoteInputSchema>;

// Input schema for updating parenting quotes
export const updateParentingQuoteInputSchema = z.object({
  id: z.number(),
  quote: z.string().min(1).optional(),
  author: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  language: languageEnum.optional(),
  is_active: z.boolean().optional()
});

export type UpdateParentingQuoteInput = z.infer<typeof updateParentingQuoteInputSchema>;

// App configuration schema
export const appConfigSchema = z.object({
  id: z.number(),
  config_key: z.string(),
  config_value: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AppConfig = z.infer<typeof appConfigSchema>;

// Input schema for creating app config
export const createAppConfigInputSchema = z.object({
  config_key: z.string().min(1),
  config_value: z.string().min(1),
  description: z.string().nullable(),
  is_active: z.boolean().default(true)
});

export type CreateAppConfigInput = z.infer<typeof createAppConfigInputSchema>;

// Input schema for updating app config
export const updateAppConfigInputSchema = z.object({
  id: z.number(),
  config_key: z.string().min(1).optional(),
  config_value: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateAppConfigInput = z.infer<typeof updateAppConfigInputSchema>;

// Query schemas for filtering
export const getBabyNamesQuerySchema = z.object({
  language: languageEnum.optional(),
  gender: genderEnum.optional(),
  origin: z.string().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0)
});

export type GetBabyNamesQuery = z.infer<typeof getBabyNamesQuerySchema>;

export const getParentingQuotesQuerySchema = z.object({
  language: languageEnum.optional(),
  category: z.string().optional(),
  is_active: z.boolean().default(true),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type GetParentingQuotesQuery = z.infer<typeof getParentingQuotesQuerySchema>;
