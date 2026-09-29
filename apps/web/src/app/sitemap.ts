import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@site/seo'
import { sitio } from '@/lib/config'
import { ARTICULOS_SIN_INDEXAR, articulos, proyectos } from '@/lib/datos'
import { ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'

/** Generado, nunca manual. Añadir aquí cada ruta estática nueva. */
const rutasEstaticas = ['/', '/proyectos/', '/empresa/', '/presupuesto/', '/blog/']

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({
    siteUrl: sitio.url,
    staticRoutes: rutasEstaticas,
    serviceRoutes: ORDEN_SERVICIOS.map((id) => RUTA_SERVICIO[id]),
    projectSlugs: proyectos.map((p) => p.slug),
    articles: articulos.map((a) => ({ slug: a.slug, dateIso: a.fechaIso })),
    noindexSlugs: ARTICULOS_SIN_INDEXAR,
  })
}
