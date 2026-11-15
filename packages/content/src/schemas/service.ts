import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { Question } from './faq.ts'

/** One of the techniques (printed concrete, polished…). The public route `/[service]/` never changes: only the code identifier moved to English. */
export type ServiceId =
  | 'hormigon-impreso'
  | 'hormigon-pulido'
  | 'hormigon-lavado'
  | 'microcemento'
  | 'autonivelantes'
  | 'pavimentos-de-caucho'
  | 'alicatados'

export type SpecSheet = {
  title: Localized<string>
  text: Localized<string>
  columns: Localized<string>[]
  rows: {
    parameter: Localized<string>
    /** One value per column, in the same order; `null` where that column's obra didn't report this parameter. */
    values: (Localized<string> | null)[]
  }[]
}

export type SpecList = {
  title: Localized<string>
  text: Localized<string>
  lines: { label: Localized<string>; value: Localized<string> }[]
}

/**
 * Visitor-facing text with two inline markups, nothing else:
 *   - `[visible text](/internal/path/)` → an internal link. Internal only: the
 *     path must start and end with `/` (`trailingSlash: true`);
 *     `content:validate` checks it points to a page this content produces.
 *   - `{{what is missing}}` → a datum only the owner can give, rendered as
 *     `<DatoPendiente>` (bracketed, dimmed). Never filled with a guess.
 */
export type RichText = string

/** One H3 block of a service guide: a heading and one or more paragraphs. */
export type ServiceGuideBlock = {
  title: Localized<string>
  paragraphs: Localized<RichText>[]
}

/**
 * The "how it is / how it's done" band of a service page (SEO pass of
 * 2026-11-15): the text that answers the page's main search intent, with
 * internal links to the real projects and neighbouring services. Optional:
 * a service without enough real content simply doesn't render the band.
 */
export type ServiceGuide = {
  /** Short mono label above the H2; also the band's label in the in-page submenu. */
  kicker: Localized<string>
  /** The band's H2. */
  title: Localized<string>
  /** Lead paragraph: the direct answer, first. */
  intro: Localized<RichText>
  blocks: ServiceGuideBlock[]
}

export type Service = {
  /** Internal identifier / record key — plain, not translated. */
  id: ServiceId
  /** Public URL segment. Only `es` is real today; the folder name in `apps/web/src/app/[servicio]/` never changes regardless of this value (external contract). */
  slug: Localized<string>
  /** Display ordinal ('01'..'07') — plain, not translated. */
  number: string
  name: Localized<string>
  shortName: Localized<string>
  /** Home card blurb. */
  summary: Localized<string>
  /** <meta description>. */
  description: Localized<string>
  /** <title> without the brand suffix (the layout's template adds it). Falls back to `name`. Search query first, useful variant after. */
  seoTitle?: Localized<string>
  /** Second, smaller line of the H1 ("en Valencia y Alicante"): the H1 reads `name` + this. */
  headingPlace?: Localized<string>
  intro: Localized<string>
  introMobile: Localized<string>
  heroImage: ImageContent
  about: { title: Localized<string>; paragraphs: Localized<string>[] }
  applications: Localized<string>[]
  advantages: Localized<string>[]
  models: Localized<string>[]
  colors: Localized<string>[]
  specSheet?: SpecSheet
  /** Alternative to specSheet when there's no comparative table (lavado, microcemento…). */
  specList?: SpecList
  guide?: ServiceGuide
  faq: Question[]
  cta: Localized<string>
  /** Whether this is one of the 3 techniques promoted as the site's flagship offer. */
  flagship: boolean
}
