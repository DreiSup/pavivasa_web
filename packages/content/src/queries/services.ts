import { services } from '../data/services.ts'
import { serviceCatalog } from '../data/service-catalog.ts'
import type { Service, ServiceId } from '../schemas/service.ts'
import { pickLocalized, pickLocalizedList, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage, ResolvedQuestion } from './resolve.ts'
import { resolveQuestions } from './resolve.ts'

export type ResolvedService = {
  id: ServiceId
  slug: string
  number: string
  name: string
  shortName: string
  summary: string
  description: string
  intro: string
  introMobile: string
  heroImage: ResolvedImage
  about: { title: string; paragraphs: string[] }
  applications: string[]
  advantages: string[]
  models: string[]
  colors: string[]
  specSheet?: {
    title: string
    text: string
    columns: string[]
    rows: { parameter: string; values: (string | null)[] }[]
  }
  specList?: { title: string; text: string; lines: { label: string; value: string }[] }
  faq: ResolvedQuestion[]
  cta: string
  flagship: boolean
}

function resolveService(rawService: (typeof services)[number], locale: Locale): ResolvedService | undefined {
  // Widen like `resolveProject`: individual literals only carry the optional keys they set.
  const service: Service = rawService
  const name = pickLocalized(service.name, locale)
  const slug = pickLocalized(service.slug, locale)
  if (name === undefined || slug === undefined) return undefined // no translation at all: not publishable in this locale

  return {
    id: service.id,
    slug,
    number: service.number,
    name,
    shortName: pickLocalized(service.shortName, locale) ?? name,
    summary: pickLocalized(service.summary, locale) ?? '',
    description: pickLocalized(service.description, locale) ?? '',
    intro: pickLocalized(service.intro, locale) ?? '',
    introMobile: pickLocalized(service.introMobile, locale) ?? '',
    heroImage: resolveImage(service.heroImage, locale),
    about: {
      title: pickLocalized(service.about.title, locale) ?? '',
      paragraphs: pickLocalizedList(service.about.paragraphs, locale),
    },
    applications: pickLocalizedList(service.applications, locale),
    advantages: pickLocalizedList(service.advantages, locale),
    models: pickLocalizedList(service.models, locale),
    colors: pickLocalizedList(service.colors, locale),
    ...(service.specSheet
      ? {
          specSheet: {
            title: pickLocalized(service.specSheet.title, locale) ?? '',
            text: pickLocalized(service.specSheet.text, locale) ?? '',
            columns: pickLocalizedList(service.specSheet.columns, locale),
            rows: service.specSheet.rows.map((row) => ({
              parameter: pickLocalized(row.parameter, locale) ?? '',
              values: row.values.map((value) => (value ? (pickLocalized(value, locale) ?? null) : null)),
            })),
          },
        }
      : {}),
    ...(service.specList
      ? {
          specList: {
            title: pickLocalized(service.specList.title, locale) ?? '',
            text: pickLocalized(service.specList.text, locale) ?? '',
            lines: service.specList.lines.map((line) => ({
              label: pickLocalized(line.label, locale) ?? '',
              value: pickLocalized(line.value, locale) ?? '',
            })),
          },
        }
      : {}),
    faq: resolveQuestions(service.faq, locale),
    cta: pickLocalized(service.cta, locale) ?? '',
    flagship: service.flagship,
  }
}

/** All 7 services, in menu order, resolved for `locale`. Services without a translation for `locale` are dropped (never a silent Spanish fallback). */
export function getServices(locale: Locale): ResolvedService[] {
  const out: ResolvedService[] = []
  for (const service of services) {
    const resolved = resolveService(service, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getService(id: ServiceId, locale: Locale): ResolvedService | undefined {
  const service = services.find((s) => s.id === id)
  return service ? resolveService(service, locale) : undefined
}

export type ResolvedServiceCatalogEntry = { id: ServiceId; slug: string; shortName: string; name: string; flagship: boolean }

/** Light per-service lookup (id, slug, short/long name, flagship) — deliberately without the heavy content, for client-reachable code (menus, filters). See `data/service-catalog.ts`. */
export function getServiceCatalog(locale: Locale): ResolvedServiceCatalogEntry[] {
  const out: ResolvedServiceCatalogEntry[] = []
  for (const entry of serviceCatalog) {
    const slug = pickLocalized(entry.slug, locale)
    const name = pickLocalized(entry.name, locale)
    if (slug === undefined || name === undefined) continue
    out.push({ id: entry.id, slug, name, shortName: pickLocalized(entry.shortName, locale) ?? name, flagship: entry.flagship })
  }
  return out
}

/** `{ id -> slug }` for every service with a translation in `locale`. */
export function getServiceSlugMap(locale: Locale): Record<string, string> {
  const map: Record<string, string> = {}
  for (const entry of getServiceCatalog(locale)) map[entry.id] = entry.slug
  return map
}
