/**
 * Public route prefixes for the two content collections that get a listing
 * page plus one detail page per item (projects, articles) — this site's
 * values since before the migration. `buildSitemapEntries` and
 * `buildArticleJsonLd` take these through an optional `routes` field and
 * fall back to `DEFAULT_ROUTES` when it's omitted, so a caller that doesn't
 * pass one (`apps/web/src/app/sitemap.ts`, frozen for this migration) keeps
 * building the exact same URLs. A different client passes its own `routes`
 * instead of forking these builders.
 */
export type RoutePrefixes = {
  /** Leading and trailing slash, e.g. `/proyectos/`. */
  projects: string
  /** Leading and trailing slash, e.g. `/blog/`. */
  articles: string
}

export const DEFAULT_ROUTES: RoutePrefixes = {
  projects: '/proyectos/',
  articles: '/blog/',
}
