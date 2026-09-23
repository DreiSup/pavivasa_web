import { home } from '../data/home.ts'
import { pickLocalized, pickLocalizedList, resolveImage, resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedImage, ResolvedQuestion } from './resolve.ts'

export type ResolvedHomeContent = {
  hero: ResolvedImage
  spaces: { name: string; image: ResolvedImage }[]
  /** `spaces` names plus the "other" option, in that order — the quote form's dropdown. */
  spaceNames: string[]
  faq: ResolvedQuestion[]
  printedModels: string[]
  projectColors: string[]
}

export function getHome(locale: Locale): ResolvedHomeContent {
  const spaces = home.spaces.map((space) => ({
    name: pickLocalized(space.name, locale) ?? '',
    image: resolveImage(space.image, locale),
  }))
  const otherLabel = pickLocalized(home.otherSpaceLabel, locale) ?? ''

  return {
    hero: resolveImage(home.hero, locale),
    spaces,
    spaceNames: [...spaces.map((s) => s.name), otherLabel],
    faq: resolveQuestions(home.faq, locale),
    printedModels: pickLocalizedList(home.printedModels, locale),
    projectColors: pickLocalizedList(home.projectColors, locale),
  }
}
