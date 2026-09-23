import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { Question } from './faq.ts'

export type Space = { name: Localized<string>; image: ImageContent }

export type HomeContent = {
  hero: ImageContent
  /** "¿Qué quieres pavimentar?" — same order as the quote form's dropdown. */
  spaces: Space[]
  /** Appended to `spaces` names to build the quote form's dropdown (`NOMBRES_ESPACIOS`). */
  otherSpaceLabel: Localized<string>
  faq: Question[]
  /** Models with real project photos (home showcase). */
  printedModels: Localized<string>[]
  /** Colors with real project photos (home showcase). */
  projectColors: Localized<string>[]
}
