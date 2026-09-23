/**
 * `@site/seo` — JSON-LD builders, sitemap/robots builders and canonical/
 * alternates helpers. No React, no Next (§3 of
 * `arquitectura-plantilla-monorepo.md`) — everything here takes plain data
 * in and returns plain objects/strings. Explicit named re-exports, not
 * `export * from`, matching `@site/content`'s barrel (see its README).
 */
export { businessJsonLdId, buildLocalBusinessJsonLd } from './json-ld/business.ts'
export type { LocalBusinessInput } from './json-ld/business.ts'

export { buildServiceJsonLd } from './json-ld/service.ts'
export type { ServiceInput } from './json-ld/service.ts'

export { buildFaqJsonLd } from './json-ld/faq.ts'
export type { FaqQuestion } from './json-ld/faq.ts'

export { buildArticleJsonLd } from './json-ld/article.ts'
export type { ArticleInput } from './json-ld/article.ts'

export { buildBreadcrumbsJsonLd } from './json-ld/breadcrumbs.ts'
export type { BreadcrumbItem } from './json-ld/breadcrumbs.ts'

export { deriveAreaServed } from './json-ld/area-served.ts'

export { buildSitemapEntries } from './sitemap.ts'
export type { SitemapEntry, SitemapInput } from './sitemap.ts'

export { buildRobots } from './robots.ts'
export type { RobotsRules } from './robots.ts'

export { buildCanonical, buildAlternates } from './canonical.ts'

export { DEFAULT_ROUTES } from './routes.ts'
export type { RoutePrefixes } from './routes.ts'
