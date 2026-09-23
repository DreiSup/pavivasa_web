import { articles } from '../data/articles.ts'
import { projects } from '../data/projects.ts'
import type { ArticleBlock } from '../schemas/article.ts'
import type { ServiceId } from '../schemas/service.ts'
import { pickLocalized, pickLocalizedList, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; id: string; text: string }
  | { type: 'orderedList'; items: { title: string; text: string }[] }
  /** `slug` is omitted (not `undefined`) when the referenced project has no slug for `locale` — see `resolveImage`'s comment on why omission, not `undefined`. */
  | { type: 'projectCallout'; slug?: string; title: string; lines: string[] }
  | { type: 'pending'; text: string }

export type ResolvedArticle = {
  slug: string
  title: string
  excerpt: string
  service: ServiceId
  date: string
  dateIso: string
  image: ResolvedImage
  body: ResolvedArticleBlock[]
  closing: string
}

function resolveBlock(block: ArticleBlock, locale: Locale): ResolvedArticleBlock | undefined {
  switch (block.type) {
    case 'paragraph': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'paragraph', text } : undefined
    }
    case 'heading': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'heading', id: block.id, text } : undefined
    }
    case 'orderedList': {
      const items = block.items
        .map((item) => {
          const title = pickLocalized(item.title, locale)
          const text = pickLocalized(item.text, locale)
          return title !== undefined && text !== undefined ? { title, text } : undefined
        })
        .filter((item): item is { title: string; text: string } => item !== undefined)
      return items.length > 0 ? { type: 'orderedList', items } : undefined
    }
    case 'projectCallout': {
      const title = pickLocalized(block.title, locale)
      if (title === undefined) return undefined
      const lines = pickLocalizedList(block.lines, locale)
      // `block.slug` is always the referenced project's `es` slug (a lookup
      // key, checked against `projects` by `scripts/validate.ts`) — resolve
      // it to that same project's slug for `locale`, which may not exist.
      const project = projects.find((p) => p.slug.es === block.slug)
      const slug = project ? pickLocalized(project.slug, locale) : undefined
      return { type: 'projectCallout', ...(slug !== undefined ? { slug } : {}), title, lines }
    }
    case 'pending': {
      const text = pickLocalized(block.text, locale)
      return text !== undefined ? { type: 'pending', text } : undefined
    }
  }
}

function resolveArticle(article: (typeof articles)[number], locale: Locale): ResolvedArticle | undefined {
  const slug = pickLocalized(article.slug, locale)
  const title = pickLocalized(article.title, locale)
  if (slug === undefined || title === undefined) return undefined

  const body = article.body
    .map((block) => resolveBlock(block, locale))
    .filter((block): block is ResolvedArticleBlock => block !== undefined)

  return {
    slug,
    title,
    excerpt: pickLocalized(article.excerpt, locale) ?? '',
    service: article.service,
    date: pickLocalized(article.date, locale) ?? '',
    dateIso: article.dateIso,
    image: resolveImage(article.image, locale),
    body,
    closing: pickLocalized(article.closing, locale) ?? '',
  }
}

/** All articles, resolved for `locale`, in `data/articles.ts` order (newest-first is a display concern, not enforced here). */
export function getArticles(locale: Locale): ResolvedArticle[] {
  const out: ResolvedArticle[] = []
  for (const article of articles) {
    const resolved = resolveArticle(article, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getArticle(slug: string, locale: Locale): ResolvedArticle | undefined {
  return getArticles(locale).find((a) => a.slug === slug)
}
