import { home } from '../data/home.ts'
import { pickLocalized, pickLocalizedList, resolveImage, resolveQuestions } from './resolve.ts'
import type { Locale, ResolvedImage, ResolvedQuestion } from './resolve.ts'

export type ResolvedHomeContent = {
  hero: ResolvedImage
  heroTabs: {
    serviceId: 'hormigon-impreso' | 'hormigon-pulido' | 'microcemento'
    tabLabel: string
    eyebrow: string
    title: string
    subtitle: string
    image?: ResolvedImage
  }[]
  spaces: { name: string; image: ResolvedImage }[]
  faq: ResolvedQuestion[]
  printedModels: string[]
  projectColors: string[]
}

/**
 * Deliberately its own module, apart from `space-names.ts` — see that
 * file's comment. This file's only top-level data import is
 * `data/home.ts`; nothing that needs only `getSpaceNames` should ever
 * import from here, or that import edge alone pulls this whole module (and
 * `data/home.ts`) into the bundle regardless of whether `getHome` itself
 * ends up called.
 */
export function getHome(locale: Locale): ResolvedHomeContent {
  const heroTabs: ResolvedHomeContent['heroTabs'] = []
  for (const tab of home.heroTabs) {
    const tabLabel = pickLocalized(tab.tabLabel, locale)
    const eyebrow = pickLocalized(tab.eyebrow, locale)
    const title = pickLocalized(tab.title, locale)
    const subtitle = pickLocalized(tab.subtitle, locale)
    if (tabLabel === undefined || eyebrow === undefined || title === undefined || subtitle === undefined) continue
    heroTabs.push({
      serviceId: tab.serviceId,
      tabLabel,
      eyebrow,
      title,
      subtitle,
      ...(tab.image ? { image: resolveImage(tab.image, locale) } : {}),
    })
  }

  const spaces = home.spaces.map((space) => ({
    name: pickLocalized(space.name, locale) ?? '',
    image: resolveImage(space.image, locale),
  }))

  return {
    hero: resolveImage(home.hero, locale),
    heroTabs,
    spaces,
    faq: resolveQuestions(home.faq, locale),
    printedModels: pickLocalizedList(home.printedModels, locale),
    projectColors: pickLocalizedList(home.projectColors, locale),
  }
}
