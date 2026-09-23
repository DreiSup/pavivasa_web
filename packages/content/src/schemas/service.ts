import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { Question } from './faq.ts'

/** One of the 7 techniques (printed concrete, polished…). The public route `/[service]/` never changes: only the code identifier moved to English. */
export type ServiceId =
  | 'hormigon-impreso'
  | 'hormigon-pulido'
  | 'hormigon-lavado'
  | 'microcemento'
  | 'autonivelantes'
  | 'pavimentos-de-caucho'
  | 'alicatados'

export type ExecutionSpecSheet = {
  title: Localized<string>
  text: Localized<string>
  columns: Localized<string>[]
  rows: {
    parameter: Localized<string>
    /** One value per column, in the same order; `null` where that column's obra didn't report this parameter. */
    values: (Localized<string> | null)[]
  }[]
}

export type ExecutionSpecList = {
  title: Localized<string>
  text: Localized<string>
  lines: { label: Localized<string>; value: Localized<string> }[]
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
  intro: Localized<string>
  introMobile: Localized<string>
  heroImage: ImageContent
  about: { title: Localized<string>; paragraphs: Localized<string>[] }
  applications: Localized<string>[]
  advantages: Localized<string>[]
  models: Localized<string>[]
  colors: Localized<string>[]
  specSheet?: ExecutionSpecSheet
  /** Alternative to specSheet when there's no comparative table (lavado, microcemento…). */
  specList?: ExecutionSpecList
  faq: Question[]
  cta: Localized<string>
  /** Whether this is one of the 3 techniques promoted as the site's flagship offer. */
  flagship: boolean
}
