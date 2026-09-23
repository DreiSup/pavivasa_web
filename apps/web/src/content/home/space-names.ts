/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Its own module, separate from `hero.ts` — see `./index.ts`'s comment.
 * `FormularioPresupuesto.tsx` ('use client') and
 * `app/presupuesto/actions.ts` import only this constant from
 * `@/content/home`; keeping it in a file with zero references to
 * `getHome()`/`hero.ts` means the bundler never has to decide whether an
 * unused call is safe to drop — there simply isn't one here.
 */
import { getSpaceNames } from '@site/content'

export const NOMBRES_ESPACIOS = getSpaceNames('es')
