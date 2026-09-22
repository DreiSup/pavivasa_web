import type { MetadataRoute } from 'next'
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
  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...ORDEN_SERVICIOS.map((id) => ({ url: `${sitio.url}${RUTA_SERVICIO[id]}` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
    ...articulos
      .filter((a) => !SIN_INDEXAR.includes(a.slug))
      .map((a) => ({ url: `${sitio.url}/blog/${a.slug}/`, lastModified: a.fechaIso })),
  ]
}
