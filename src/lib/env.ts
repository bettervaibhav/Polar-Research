import { z } from 'zod';

const envSchema = z.object({
  APP_MODE: z.enum(['demo', 'live']).default('demo'),
  AI_PROVIDER: z.enum(['demo', 'gemini', 'openai']).default('demo'),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().default('file:./polar_sense.db'),
  PORT: z.string().default('3000'),
});

export const env = envSchema.parse({
  APP_MODE: process.env.APP_MODE || 'demo',
  AI_PROVIDER: process.env.AI_PROVIDER || 'demo',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL || 'file:./polar_sense.db',
  PORT: process.env.PORT || '3000',
});
