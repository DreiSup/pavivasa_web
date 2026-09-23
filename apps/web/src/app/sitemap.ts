import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@site/seo'
import { sitio } from '@/lib/config'
import { articulos, proyectos } from '@/lib/datos'
import { ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'

/** Generado, nunca manual. Añadir aquí cada ruta estática nueva. */
const rutasEstaticas = ['/', '/proyectos/', '/empresa/', '/presupuesto/', '/blog/']

/**
 * Artículos publicados pero sin cuerpo redactado: la página sigue en pie por
 * los enlaces entrantes, pero no se propone a indexación. El `noindex` que la
 * acompaña va por X-Robots-Tag en `next.config.ts`. Sacar de aquí en cuanto
 * haya texto.
 */
const SIN_INDEXAR = ['hormigon-desactivado-piedra-vista']

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({
    siteUrl: sitio.url,
    staticRoutes: rutasEstaticas,
    serviceRoutes: ORDEN_SERVICIOS.map((id) => RUTA_SERVICIO[id]),
    projectSlugs: proyectos.map((p) => p.slug),
    articles: articulos.map((a) => ({ slug: a.slug, dateIso: a.fechaIso })),
    noindexSlugs: SIN_INDEXAR,
  })
}
