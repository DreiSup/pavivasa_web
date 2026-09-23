export type SitemapEntry = { url: string; lastModified?: string }

export type SitemapInput = {
  siteUrl: string
  /** Routes with no per-item listing (home, section index pages...), including leading/trailing slash. */
  staticRoutes: readonly string[]
  /** Service routes, already in the site's own menu order. */
  serviceRoutes: readonly string[]
  projectSlugs: readonly string[]
  articles: readonly { slug: string; dateIso: string }[]
  /** Slugs (of any kind) to leave out of the sitemap even though the page itself stays published. */
  noindexSlugs: readonly string[]
}

/** Static routes, then services, then projects, then articles minus `noindexSlugs` — this site's order since before the migration. */
export function buildSitemapEntries(input: SitemapInput): SitemapEntry[] {
  return [
    ...input.staticRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.serviceRoutes.map((route) => ({ url: `${input.siteUrl}${route}` })),
    ...input.projectSlugs.map((slug) => ({ url: `${input.siteUrl}/proyectos/${slug}/` })),
    ...input.articles
      .filter((article) => !input.noindexSlugs.includes(article.slug))
      .map((article) => ({ url: `${input.siteUrl}/blog/${article.slug}/`, lastModified: article.dateIso })),
  ]
}
