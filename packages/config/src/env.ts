/**
 * Public env: values baked into client bundles by Next.js's build-time
 * replacement of the literal `process.env.NEXT_PUBLIC_X` member expression.
 * That replacement only fires on the exact literal form below — never read
 * these dynamically (`process.env[name]`), it would stay `undefined` on the
 * client forever. See `env.schema.ts` for why this file itself imports no
 * zod runtime.
 *
 * Empty/whitespace-only values are treated as unset, matching an env var
 * that's simply absent (e.g. unset in Vercel's dashboard or `.env.example`).
 */
import type { PublicEnv } from './env.schema.ts'

function clean(value: string | undefined): string | undefined {
  return value?.trim() || undefined
}

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SITE_URL: clean(process.env.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_TELEFONO: clean(process.env.NEXT_PUBLIC_TELEFONO),
  NEXT_PUBLIC_WHATSAPP: clean(process.env.NEXT_PUBLIC_WHATSAPP),
  NEXT_PUBLIC_DIRECCION: clean(process.env.NEXT_PUBLIC_DIRECCION),
  NEXT_PUBLIC_GA_ID: clean(process.env.NEXT_PUBLIC_GA_ID),
  NEXT_PUBLIC_GOOGLE_ADS_ID: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
  NEXT_PUBLIC_META_PIXEL_ID: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
}

export type { PublicEnv }
