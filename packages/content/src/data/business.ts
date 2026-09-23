import type { Business } from '../schemas/business.ts'

/**
 * Single NAP (name, address, phone) source for the whole site. Defaults are
 * what pavivasa.com publishes (Sept. 2026); `@site/config`'s public env
 * overrides `phone`/`whatsapp`/`address` at read time — see
 * `queries/business.ts`'s `resolveBusiness`. `email` is never overridden by
 * env: it's always the publicly-published address (the lead-form
 * destination, `EMAIL_DESTINO`, is a separate server-only concern read in
 * `apps/web/src/app/presupuesto/actions.ts`). What the site doesn't give
 * (schedule) stays `undefined` and is rendered as pending data.
 *
 * Deliberately does NOT include `claims` (years of experience, warranty,
 * declared provinces…) — see `data/claims.ts`'s comment for why: this
 * object is read (via `resolveBusiness()`) by the legacy adapter
 * `apps/web/src/lib/config/nap.ts` to build `nap`, which several `'use client'`
 * components import. A plain JS object literal can't be partially
 * evaluated: if `claims` lived on this same object, its text would be
 * constructed — and bundled — every time anything here is used, even by
 * code that only reads `.town` or `.phone`. Keeping `claims` as its own
 * independent top-level export lets a bundle that only needs `nap` (no
 * `'claims'` import anywhere in its module graph) drop that text entirely.
 */
export const business = {
  name: 'Pavivasa',
  manager: 'Gabriel',
  email: 'gabriel.pavivasa@gmail.com',
  phone: '627 66 31 46',
  address: 'Calle Blasco Ibáñez, 16',
  town: 'Sollana',
  postalCode: '46430',
  province: 'Valencia',
  country: 'ES',
  socials: [
    { platform: 'Facebook', href: 'https://facebook.com/GabrielPavivasa' },
    { platform: 'Instagram', href: 'https://instagram.com/gabrielpavivasa.es' },
    { platform: 'X', href: 'https://x.com/GabrielPavivasa' },
  ],
  whatsappMessage: { es: 'Hola, quiero presupuesto para ' },
} satisfies Business
