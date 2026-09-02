import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { articulos, proyectos } from '@/lib/datos'
import { ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'

/** Generado, nunca manual. Añadir aquí cada ruta estática nueva. */
const rutasEstaticas = ['/', '/proyectos/', '/empresa/', '/presupuesto/', '/blog/']

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...ORDEN_SERVICIOS.map((id) => ({ url: `${sitio.url}${RUTA_SERVICIO[id]}` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
    ...articulos.map((a) => ({ url: `${sitio.url}/blog/${a.slug}/`, lastModified: a.fechaIso })),
  ]
}
