/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Its own module, separate from `nap.ts` — see `./index.ts`'s comment.
 * `app/presupuesto/actions.ts` (a `'use server'` file, imported by the
 * `'use client'` component `FormularioPresupuesto`) reads only `nap`/`sitio`
 * from `@/lib/config`; keeping `claims` in a file with zero references to
 * `nap.ts` is what keeps this text out of that bundle — see the phase
 * report for how this was confirmed (co-locating them, even as two
 * independent function calls in one file, still leaked).
 */
import { getClaims } from '@site/content'

const claimsData = getClaims('es')

export const claims = {
  anios: claimsData.yearsExperience,
  garantia: claimsData.warranty,
  repiten: claimsData.repeatCustomers,
  provincias: claimsData.declaredProvinces,
}
