/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish shape and same values as before this migration, now built
 * from `@site/content`'s `getArticles('es')`.
 */
import { getArticles } from '@site/content'
import type { ResolvedArticleBlock } from '@site/content'
import type { Articulo, BloqueArticulo, Imagen } from '@/lib/tipos'

function imagen(img: { label: string; src?: string; alt?: string }): Imagen {
  return {
    etiqueta: img.label,
    ...(img.src !== undefined ? { src: img.src } : {}),
    ...(img.alt !== undefined ? { alt: img.alt } : {}),
  }
}

/**
 * `undefined` only for a `projectCallout` whose project has no `es` slug —
 * never happens today (`es` is `Localized<T>`'s mandatory locale for a
 * project that exists at all, and `scripts/validate.ts` checks every
 * `projectCallout` references one that does), but `block.slug` is typed
 * optional to also carry other locales, where it can be. Dropped rather
 * than rendered without a link.
 */
function bloque(block: ResolvedArticleBlock): BloqueArticulo | undefined {
  switch (block.type) {
    case 'paragraph':
      return { tipo: 'p', texto: block.text }
    case 'heading':
      return { tipo: 'h2', id: block.id, texto: block.text }
    case 'orderedList':
      return { tipo: 'ol', items: block.items.map((item) => ({ titulo: item.title, texto: item.text })) }
    case 'projectCallout':
      return block.slug !== undefined ? { tipo: 'obra', slug: block.slug, titulo: block.title, lineas: block.lines } : undefined
    case 'pending':
      return { tipo: 'pendiente', texto: block.text }
  }
}

export const articulos: Articulo[] = getArticles('es').map((a) => ({
  slug: a.slug,
  titulo: a.title,
  entradilla: a.excerpt,
  servicio: a.service,
  fecha: a.date,
  fechaIso: a.dateIso,
  imagen: imagen(a.image),
  cuerpo: a.body.map(bloque).filter((b): b is BloqueArticulo => b !== undefined),
  cierre: a.closing,
}))
