import { claims } from '../data/claims.ts'
import { pickLocalized } from '../schemas/localized.ts'
import type { Locale } from '../schemas/localized.ts'

export type ResolvedClaims = {
  yearsExperience: string
  warranty: string
  repeatCustomers: string
  declaredProvinces: string[]
}

/**
 * Verifiable claims, resolved for `locale`. Its own module, separate from
 * `business.ts` — confirmed empirically while building phase 2 (see the
 * phase report): keeping `getClaims` in the same file as `getBusiness`
 * meant importing `getBusiness`/`resolveBusiness` (needed for `nap`, which
 * several `'use client'` components read) also pulled in `data/claims.ts`'s
 * text, even though nothing in the client bundle ever calls `getClaims`.
 */
export function getClaims(locale: Locale): ResolvedClaims {
  return {
    yearsExperience: pickLocalized(claims.yearsExperience, locale) ?? '',
    warranty: pickLocalized(claims.warranty, locale) ?? '',
    repeatCustomers: pickLocalized(claims.repeatCustomers, locale) ?? '',
    declaredProvinces: claims.declaredProvinces,
  }
}
