import { publicEnv } from './env.ts'

export type Locale = 'es' | 'en' | 'fr' | 'de'

export const defaultLocale: Locale = 'es'
export const supportedLocales: readonly Locale[] = ['es', 'en', 'fr', 'de']
/** Locales with pages actually generated and linked today (§6/§14 of the architecture doc). */
export const publishedLocales: readonly Locale[] = ['es']

// NOTE: falls back to the hardcoded default below when NEXT_PUBLIC_SITE_URL
// is unset, rather than the production throw §9 of the architecture doc
// asks for. `scripts/check-env.ts` (`check-env`, `apps/web`'s `prebuild`)
// WARNS loudly instead when that happens in a Vercel production deploy —
// pending the user's decision on failing outright; see that script's
// comment for the one-line switch.
export const site = {
  url: (publicEnv.NEXT_PUBLIC_SITE_URL ?? 'https://pavivasa.com').replace(/\/+$/, ''),
}
