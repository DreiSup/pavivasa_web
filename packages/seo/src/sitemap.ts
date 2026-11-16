import { DEFAULT_ROUTES } from './routes.ts'
import type { RoutePrefixes } from './routes.ts'

export type SitemapEntry = { url: string; lastModified?: string }

export type SitemapInput = {
  siteUrl: string
  /** Routes with no per-item listing (home, section index pages...), including leading/trailing slash. */
  staticRoutes: readonly string[]
  /** Service routes, already in the site's own menu order. */
  serviceRoutes: readonly string[]
  projectSlugs: readonly string[]
  articles: readonly { slug: string; dateIso: string }[]
  /** Indexable `/zonas/` slugs only (a `noindex` area never goes in the sitemap). Optional: omitted = none. */
  serviceAreaSlugs?: readonly string[]
  /** Slugs (of any kind) to leave out of the sitemap even though the page itself stays published. */
  noindexSlugs: readonly string[]
  /** Project/article route prefixes — defaults to `DEFAULT_ROUTES` (this site's own paths) when omitted. */
  routes?: Partial<RoutePrefixes>
}

/** Static routes, then services, then projects, then service areas, then articles minus `noindexSlugs` — this site's order since before the migration, with areas added in 2026-11. */
export function buildSitemapEntries(input: SitemapInput): SitemapEntry[] {
  const projectsRoute = input.routes?.projects ?? DEFAULT_ROUTES.projects
  const articlesRoute = input.routes?.articles ?? DEFAULT_ROUTES.articles
  const serviceAreasRoute = input.routes?.serviceAreas ?? DEFAULT_ROUTES.serviceAreas
  return [
    ...input.staticRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.serviceRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.projectSlugs.map((slug) => ({ url: `${input.siteUrl}${projectsRoute}${slug}/` })),
    ...(input.serviceAreaSlugs ?? []).map((slug) => ({ url: `${input.siteUrl}${serviceAreasRoute}${slug}/` })),
    ...input.articles
      .filter((article) => !input.noindexSlugs.includes(article.slug))
      .map((article) => ({ url: `${input.siteUrl}${articlesRoute}${article.slug}/`, lastModified: article.dateIso })),
  ]
}
