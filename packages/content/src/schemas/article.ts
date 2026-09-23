import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { ServiceId } from './service.ts'

export type ParagraphBlock = { type: 'paragraph'; text: Localized<string> }
/** `id` is the anchor slug (e.g. "que-es") — plain, not translated. */
export type HeadingBlock = { type: 'heading'; id: string; text: Localized<string> }
export type OrderedListBlock = { type: 'orderedList'; items: { title: Localized<string>; text: Localized<string> }[] }
/** References a real project by its (`es`) slug — plain, a lookup key, checked by scripts/validate.ts. */
export type ProjectCalloutBlock = { type: 'projectCallout'; slug: string; title: Localized<string>; lines: Localized<string>[] }
/** Content not written yet (e.g. a source article still in another language). Never invented — see the README. */
export type PendingBlock = { type: 'pending'; text: Localized<string> }

export type ArticleBlock = ParagraphBlock | HeadingBlock | OrderedListBlock | ProjectCalloutBlock | PendingBlock

export type Article = {
  /** Public URL segment (`/blog/<slug>/`). */
  slug: Localized<string>
  title: Localized<string>
  excerpt: Localized<string>
  service: ServiceId
  /** Display date as published on the current site ("Junio 2024") — plain, like `dateIso`. */
  date: string
  dateIso: string
  image: ImageContent
  body: ArticleBlock[]
  /** Closing text with the CTA. */
  closing: Localized<string>
}
