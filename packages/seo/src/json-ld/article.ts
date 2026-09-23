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
}

export function buildArticleJsonLd(input: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.siteUrl}/blog/${input.slug}/#articulo`,
    headline: input.title,
    description: input.excerpt,
    datePublished: input.dateIso,
    inLanguage: input.locale ?? 'es',
    publisher: { '@id': input.businessId },
    mainEntityOfPage: `${input.siteUrl}/blog/${input.slug}/`,
  }
}
