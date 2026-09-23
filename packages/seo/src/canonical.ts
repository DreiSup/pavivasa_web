/**
 * Canonical/alternates helpers for a future locale rollout (§14 of
 * `arquitectura-plantilla-monorepo.md`). Not wired into any page yet — this
 * site only publishes `es` today, at the bare route with no locale segment,
 * so `buildCanonical(siteUrl, route, 'es')` must keep equalling
 * `${siteUrl}${route}` for the default locale.
 */
export function buildCanonical(siteUrl: string, route: string, locale: string, defaultLocale = 'es'): string {
  return locale === defaultLocale ? `${siteUrl}${route}` : `${siteUrl}/${locale}${route}`
}

export function buildAlternates(
  siteUrl: string,
  route: string,
  locales: readonly string[],
  defaultLocale = 'es',
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const locale of locales) out[locale] = buildCanonical(siteUrl, route, locale, defaultLocale)
  return out
}
