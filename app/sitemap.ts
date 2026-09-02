import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'
import { proyectos } from '@/lib/datos'

/** Generado, nunca manual. Añadir aquí cada ruta estática nueva. */
const rutasEstaticas = [
  '/',
  '/proyectos/',
  '/presupuesto/',
  '/aviso-legal/',
  '/politica-de-privacidad/',
  '/politica-de-cookies/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...rutasEstaticas.map((ruta) => ({ url: `${sitio.url}${ruta}` })),
    ...proyectos.map((p) => ({ url: `${sitio.url}/proyectos/${p.slug}/` })),
  ]
}
