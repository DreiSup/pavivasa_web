import type { Localized } from './localized.ts'

/** A question that may not have a public answer yet (`answer` stays `undefined`: rendered as pending, never invented). */
export type Question = {
  question: Localized<string>
  answer?: Localized<string>
}
