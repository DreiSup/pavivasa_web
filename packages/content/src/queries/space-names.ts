import { spaceNames } from '../data/space-names.ts'
import { pickLocalized } from './resolve.ts'
import type { Locale } from './resolve.ts'

/**
 * The quote form's dropdown options (`spaces` names plus "other"), in
 * order. Its own module, separate from `home.ts` — confirmed empirically
 * while building phase 2 (see the phase report): a bundler that includes
 * this function because a client component needs it will also include
 * whatever OTHER top-level data import lives in the same file, even if
 * that data is only used by a different, unrelated, unused-in-that-bundle
 * function. Putting `getSpaceNames` in a file whose only data import is
 * the small, standalone `data/space-names.ts` is what actually keeps
 * `home.ts`'s hero/FAQ/showcase text out of a bundle that only needs this.
 */
export function getSpaceNames(locale: Locale): string[] {
  const out: string[] = []
  for (const space of spaceNames) {
    const name = pickLocalized(space.name, locale)
    if (name !== undefined) out.push(name)
  }
  return out
}
