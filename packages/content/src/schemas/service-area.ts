import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { ServiceId } from './service.ts'

/**
 * A `/zonas/<slug>/` page: one town where Pavivasa has documented jobs.
 *
 * Anti-doorway rules (Google's "doorway abuse" spam policy) — a town only
 * gets an area when it has **at least two documented jobs** in
 * `data/projects.ts`, and every visible text field is written by hand from
 * those jobs' own data (model, colour, execution specs, the district the
 * old site names). If you delete the town name from a paragraph and it
 * still reads true for another town, it is filler: rewrite it.
 */
export type ServiceArea = {
  /** Public URL segment under `/zonas/`. */
  slug: Localized<string>
  /** Town — proper noun: plain. Must equal `Project.town` of every project listed below. */
  town: string
  /** Province — proper noun: plain. */
  province: 'Alicante' | 'Valencia'
  /** Comarca (`Marina Alta`…) — verifiable geography, proper noun: plain. */
  region: string
  /**
   * Project ids (`Project.slug.es`) in this town, in display order. Every
   * one must exist and have `town === this.town`; `content:validate`
   * checks it.
   */
  projects: string[]
  /**
   * Techniques actually executed here, most jobs first. Must be exactly the
   * set of the listed projects' `service` (validated): the H1/title can only
   * name a technique done in this town.
   */
  services: ServiceId[]
  /** `<title>` and H1, e.g. «Hormigón impreso en Calpe» — the technique done there plus the town. */
  heading: Localized<string>
  /** Meta description, hand-written from this town's jobs. */
  description: Localized<string>
  /** One-sentence lead under the H1. */
  lead: Localized<string>
  /** Area-specific paragraphs. Never shared between two areas. */
  body: Localized<string>[]
  /**
   * A photo the owner has **confirmed** was taken at one of this town's
   * jobs. Absent → the page is published `noindex, follow` and left out of
   * the sitemap: an area page without a real photo of the place is the
   * doorway pattern. Do NOT fill it with a project's current `images[0]`
   * unless the owner has confirmed that photo's town — see
   * `data/service-areas.ts` for why that matters here.
   */
  confirmedPhoto?: ImageContent
}
