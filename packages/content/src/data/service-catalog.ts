import type { Localized } from '../schemas/localized.ts'
import type { ServiceId } from '../schemas/service.ts'

export type ServiceCatalogEntry = {
  id: ServiceId
  slug: Localized<string>
  shortName: Localized<string>
  name: Localized<string>
  flagship: boolean
}

/**
 * Deliberately duplicates `id`/`slug`/`shortName`/`name`/`flagship` out of
 * `services.ts` as their own tiny, standalone array — instead of deriving
 * them at runtime from `services` (`services.map(...)`).
 *
 * Why: `apps/web/src/lib/tipos.ts` (the legacy adapter) is imported from
 * several `'use client'` components (`Cabecera`, `MenuMovil`,
 * `FiltrosProyectos`…) purely for these five bits per service — not for the
 * full service content (descriptions, FAQ, spec sheets). If the adapter
 * derived them from the full `services` array, that whole array — all the
 * Spanish prose for all 7 services — would have to be evaluated to build
 * the derived value, and would ship in the client bundle, growing First
 * Load JS for no reason (see `arquitectura-plantilla-monorepo.md` §10 and
 * `CLAUDE.md`'s 100 KB budget).
 *
 * `scripts/validate.ts` checks this stays in sync with `services.ts` on
 * every `content:validate` run, so the duplication can't silently drift.
 */
export const serviceCatalog: ServiceCatalogEntry[] = [
  { id: 'hormigon-impreso', slug: { es: 'hormigon-impreso' }, shortName: { es: 'Impreso' }, name: { es: 'Hormigón impreso' }, flagship: true },
  { id: 'hormigon-pulido', slug: { es: 'hormigon-pulido' }, shortName: { es: 'Pulido' }, name: { es: 'Hormigón pulido' }, flagship: true },
  { id: 'hormigon-lavado', slug: { es: 'hormigon-lavado' }, shortName: { es: 'Lavado' }, name: { es: 'Hormigón lavado' }, flagship: false },
  { id: 'microcemento', slug: { es: 'microcemento' }, shortName: { es: 'Microcemento' }, name: { es: 'Microcemento decorativo' }, flagship: true },
  { id: 'autonivelantes', slug: { es: 'autonivelantes' }, shortName: { es: 'Autonivelantes' }, name: { es: 'Autonivelantes' }, flagship: false },
  { id: 'pavimentos-de-caucho', slug: { es: 'pavimentos-de-caucho' }, shortName: { es: 'Caucho' }, name: { es: 'Pavimentos de caucho' }, flagship: false },
  { id: 'alicatados', slug: { es: 'alicatados' }, shortName: { es: 'Alicatados' }, name: { es: 'Alicatados' }, flagship: false },
]
