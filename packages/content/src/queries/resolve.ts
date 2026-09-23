import { pickLocalized, pickLocalizedList } from '../schemas/localized.ts'
import type { Locale } from '../schemas/localized.ts'
import type { ImageContent } from '../schemas/image.ts'
import type { Question } from '../schemas/faq.ts'

export { pickLocalized, pickLocalizedList }
export type { Locale }

export type ResolvedImage = { label: string; src?: string; alt?: string }
export type ResolvedQuestion = { question: string; answer?: string }

/**
 * Builds the resolved image, omitting `src`/`alt` entirely when the source
 * data doesn't have them — not setting them to `undefined`. The two look the
 * same in plain JS, but they aren't the same object shape once this crosses
 * an RSC boundary (a client component's props are serialized through
 * React's flight protocol, which encodes an explicit `undefined` value
 * rather than just omitting the key) or gets `JSON.stringify`'d for
 * comparison. Every "optional field" resolver in this package follows the
 * same rule — see `resolveQuestions` below and `queries/projects.ts` /
 * `queries/services.ts`.
 */
export function resolveImage(image: ImageContent, locale: Locale): ResolvedImage {
  const alt = pickLocalized(image.alt, locale)
  return {
    label: pickLocalized(image.label, locale) ?? '',
    ...(image.src !== undefined ? { src: image.src } : {}),
    ...(alt !== undefined ? { alt } : {}),
  }
}

export function resolveQuestions(questions: readonly Question[], locale: Locale): ResolvedQuestion[] {
  const out: ResolvedQuestion[] = []
  for (const q of questions) {
    const question = pickLocalized(q.question, locale)
    if (question === undefined) continue // no translation at all for this locale: drop it, never fall back to Spanish
    const answer = pickLocalized(q.answer, locale)
    out.push(answer !== undefined ? { question, answer } : { question })
  }
  return out
}
