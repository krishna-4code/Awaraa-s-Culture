import { z } from 'zod';

const envSchema = z.object({
  // Server-side
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Client-side
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_COMMERCE_PROVIDER: z.enum(['mock', 'shopify', 'medusa', 'supabase-sanity']).default('mock'),
  NEXT_PUBLIC_INSTAGRAM_USERNAME: z.string().default('awaraas_culture'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
