import type { Localized } from '../schemas/localized.ts'

/**
 * Deliberately duplicates `spaces[].name` and `otherSpaceLabel` out of
 * `home.ts` as their own tiny, standalone array — same pattern as, and same
 * reason as, `service-catalog.ts`.
 *
 * `apps/web/src/content/home.ts`'s `NOMBRES_ESPACIOS` export (the quote
 * form's dropdown options) is read by `FormularioPresupuesto.tsx`, a
 * `'use client'` component, and by the server action
 * `app/presupuesto/actions.ts`. `home.ts`'s full `home` object also carries
 * the hero image, FAQ and showcase colors/models — none of which the quote
 * form needs. A plain object literal can't be partially evaluated: if
 * `spaceNames` were derived from the shared `home` object (`home.spaces.map(...)`),
 * building it would require constructing the *entire* `home` literal first,
 * shipping the hero/FAQ/showcase text into the form's client bundle for
 * nothing.
 *
 * `scripts/validate.ts` checks these names, in order, match
 * `home.spaces[].name` and `home.otherSpaceLabel` exactly, so this can't
 * silently drift from the canonical list.
 */
export const spaceNames: { name: Localized<string> }[] = [
  { name: { es: 'Entrada de garaje' } },
  { name: { es: 'Porche o terraza' } },
  { name: { es: 'Contorno de piscina' } },
  { name: { es: 'Interior de vivienda' } },
  { name: { es: 'Patio o jardín' } },
  { name: { es: 'Nave, parking o local' } },
  { name: { es: 'Otro' } },
]
