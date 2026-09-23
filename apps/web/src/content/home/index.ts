/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * `@/content/home` used to be a single file (`content/home.ts`); it's now
 * this directory, so the same import specifier keeps resolving (Node/TS/
 * webpack resolution treats `@/content/home` and `@/content/home/index.ts`
 * identically) while `HERO_HOME`/`ESPACIOS`/`FAQ_HOME`/`MODELOS_IMPRESO`/
 * `COLORES_OBRA` (`hero.ts`, server-only consumers) and `NOMBRES_ESPACIOS`
 * (`space-names.ts`, also read by a `'use client'` component) live in
 * separate files.
 *
 * Why the split: webpack reliably excludes an entire module nothing
 * imports from, but does NOT reliably eliminate an individual unused
 * export (or the function call producing it) from a module that DOES have
 * a used export — confirmed empirically while building this phase (see the
 * phase report). Keeping them as one file with two exports, one client-
 * reachable and one not, shipped the whole home page's copy (hero alt text,
 * FAQ, showcase colors) into `FormularioPresupuesto`'s client bundle. As
 * two physically separate modules, the client bundle's import graph never
 * reaches `hero.ts` at all, so whole-module elimination — which does work
 * reliably — removes it.
 */
export { HERO_HOME, ESPACIOS, FAQ_HOME, MODELOS_IMPRESO, COLORES_OBRA } from './hero.ts'
export { NOMBRES_ESPACIOS } from './space-names.ts'
