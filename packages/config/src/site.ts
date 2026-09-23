import { publicEnv } from './env.ts'

export type Locale = 'es' | 'en' | 'fr' | 'de'

export const defaultLocale: Locale = 'es'
export const supportedLocales: readonly Locale[] = ['es', 'en', 'fr', 'de']
/** Locales with pages actually generated and linked today (§6/§14 of the architecture doc). */
export const publishedLocales: readonly Locale[] = ['es']

// NOTE: no production throw when NEXT_PUBLIC_SITE_URL is unset (§9 of the
// architecture doc asks for one) — left out for phase 2 pending the user's
// decision; see the phase report's "questions".
export const site = {
  url: (publicEnv.NEXT_PUBLIC_SITE_URL ?? 'https://pavivasa.com').replace(/\/+$/, ''),
}
