import { env } from 'cloudflare:workers';
import { type } from 'arktype';

export const envType = type({
  PUBLIC_ENVIRONMENT: "'development' | 'staging' | 'production'",
  SECRET: 'string',
});

export function getEnv() {
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('PUBLIC_')),
  ) as PublicEnv;
}
export type Env = typeof envType.infer;

export type PublicEnv = {
  [K in keyof Env as K extends `PUBLIC_${string}` ? K : never]: Env[K];
};

export function init() {
  const parsed = envType(env);

  if (parsed instanceof type.errors) {
    console.error('❌ Invalid environment variables:', parsed.summary);

    throw new Error(`Invalid environment variables: ${parsed.summary}`);
  }
}

export type PUBLIC_ENV = ReturnType<typeof getEnv>;
