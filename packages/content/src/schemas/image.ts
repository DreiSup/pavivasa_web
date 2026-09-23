import type { Localized } from './localized.ts'

/**
 * A photo that may not exist yet: `label` says what should go there (to ask
 * the client for it); until the real photo arrives, `src`/`alt` stay
 * `undefined` and the UI paints a `<BloquePosicion>` placeholder instead.
 */
export type ImageContent = {
  label: Localized<string>
  src?: string
  alt?: Localized<string>
}
