import { DEFAULT_ROUTES } from '../routes.ts'
import type { RoutePrefixes } from '../routes.ts'

export type ArticleInput = {
  siteUrl: string
  slug: string
  title: string
  excerpt: string
  dateIso: string
  /** The local-business node's `@id` — see `businessJsonLdId`. */
  businessId: string
  /** BCP-47-ish language tag for `inLanguage`. Defaults to `'es'` — this site only publishes Spanish today. */
  locale?: string
  /** Article route prefix — defaults to `DEFAULT_ROUTES.articles` (`/blog/`) when omitted. */
  routes?: Partial<Pick<RoutePrefixes, 'articles'>>
}

export function buildArticleJsonLd(input: ArticleInput) {
  const articlesRoute = input.routes?.articles ?? DEFAULT_ROUTES.articles
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.siteUrl}${articlesRoute}${input.slug}/#articulo`,
    headline: input.title,
    description: input.excerpt,
    datePublished: input.dateIso,
    inLanguage: input.locale ?? 'es',
    publisher: { '@id': input.businessId },
    mainEntityOfPage: `${input.siteUrl}${articlesRoute}${input.slug}/`,
  }
}
