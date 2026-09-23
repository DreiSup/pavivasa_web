import type { Localized } from './localized.ts'
import type { ImageContent } from './image.ts'
import type { ServiceId } from './service.ts'

/** Execution data (concrete, thickness, aggregate…). Every field optional: what the site doesn't give isn't invented. Values stay Localized like the rest of the copy even though they're technical ("HM20", "10 cm") — see the content README's Localized rule. */
export type ExecutionSpecs = {
  concrete?: Localized<string>
  thickness?: Localized<string>
  aggregate?: Localized<string>
  mesh?: Localized<string>
  fiber?: Localized<string>
  colorDosage?: Localized<string>
  expansionJoints?: Localized<string>
  finish?: Localized<string>
}

export type Project = {
  /** Public URL segment (`/proyectos/<slug>/`, external contract: the value, not the route folder, translates later). */
  slug: Localized<string>
  /** Short headline: model and color. */
  title: Localized<string>
  /** Long headline for the project page. */
  longTitle: Localized<string>
  service: ServiceId
  /** Town — proper noun: plain. */
  town: string
  /** Province — proper noun: plain. */
  province: 'Alicante' | 'Valencia'
  /** Urbanización/district, when the site names one — proper noun: plain. */
  district?: string
  /** Kind of space ("Vivienda en urbanización", "Nave industrial"). */
  spaceType: Localized<string>
  model?: Localized<string>
  color?: Localized<string>
  surfaceArea?: number
  /** Year inferred from the photo's date: always rendered as pending data. */
  photoYear?: number
  executionSpecs: ExecutionSpecs
  brief: Localized<string>[]
  execution: Localized<string>[]
  images: ImageContent[]
  featured: boolean
}
