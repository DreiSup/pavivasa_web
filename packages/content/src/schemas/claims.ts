import type { Localized } from './localized.ts'

/**
 * Deliberately its own top-level module, independent from `business.ts` —
 * see `data/claims.ts`'s comment for why: claims are only ever read
 * server-side, and must not travel along with `Business` into a client
 * bundle that only needs NAP fields.
 */
export type Claims = {
  yearsExperience: Localized<string>
  warranty: Localized<string>
  repeatCustomers: Localized<string>
  /** Provinces claimed as coverage in the copy; only some have real project photos (see lib/schema.tsx's areaServed). Plain: proper nouns. */
  declaredProvinces: string[]
}
