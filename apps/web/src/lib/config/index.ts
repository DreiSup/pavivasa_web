/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * `@/lib/config` used to be a single file (`lib/config.ts`); it's now this
 * directory (the same import specifier keeps resolving), split so that
 * `nap`/`sitio` (read by several `'use client'` components AND by the
 * server action `app/presupuesto/actions.ts`) and `claims` (read only by
 * server components) live in separate modules. See `nap.ts` and
 * `claims.ts`, and `content/home/index.ts`'s comment for why this split is
 * needed at all (confirmed empirically while building phase 2).
 */
export { nap, sitio } from './nap.ts'
export { claims } from './claims.ts'
