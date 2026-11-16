import { serviceAreas } from '../data/service-areas.ts'
import type { ServiceArea } from '../schemas/service-area.ts'
import type { ServiceId } from '../schemas/service.ts'
import { pickLocalized, pickLocalizedList, resolveImage } from './resolve.ts'
import type { Locale, ResolvedImage } from './resolve.ts'

export type ResolvedServiceArea = {
  slug: string
  town: string
  province: 'Alicante' | 'Valencia'
  region: string
  /** Project ids (`Project.slug.es`), not locale-resolved. */
  projects: string[]
  services: ServiceId[]
  heading: string
  description: string
  lead: string
  body: string[]
  confirmedPhoto?: ResolvedImage
  /** `true` only with an owner-confirmed photo of a job in this town — see `schemas/service-area.ts`. */
  indexable: boolean
}

/** `undefined` when the area has no translation for `locale` (no silent Spanish fallback). */
function resolveServiceArea(rawArea: (typeof serviceAreas)[number], locale: Locale): ResolvedServiceArea | undefined {
  // Widen to the general shape: `as const` literals only carry the keys they set.
  const area: ServiceArea = rawArea
  const slug = pickLocalized(area.slug, locale)
  const heading = pickLocalized(area.heading, locale)
  const description = pickLocalized(area.description, locale)
  const lead = pickLocalized(area.lead, locale)
  if (slug === undefined || heading === undefined || description === undefined || lead === undefined) return undefined
  const confirmedPhoto = area.confirmedPhoto ? resolveImage(area.confirmedPhoto, locale) : undefined
  return {
    slug,
    town: area.town,
    province: area.province,
    region: area.region,
    projects: [...area.projects],
    services: [...area.services],
    heading,
    description,
    lead,
    body: pickLocalizedList(area.body, locale),
    ...(confirmedPhoto ? { confirmedPhoto } : {}),
    indexable: confirmedPhoto?.src !== undefined,
  }
}

/** All service areas, resolved for `locale`, in `data/service-areas.ts` order. */
export function getServiceAreas(locale: Locale): ResolvedServiceArea[] {
  const out: ResolvedServiceArea[] = []
  for (const area of serviceAreas) {
    const resolved = resolveServiceArea(area, locale)
    if (resolved) out.push(resolved)
  }
  return out
}

export function getServiceArea(slug: string, locale: Locale): ResolvedServiceArea | undefined {
  return getServiceAreas(locale).find((a) => a.slug === slug)
}
