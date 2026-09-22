import proyectosJson from '@/content/proyectos.json'
import { servicios } from '@/content/servicios'
import { articulos } from '@/content/articulos'
import type { Articulo, Proyecto, Servicio, ServicioId } from './tipos'
import { ORDEN_SERVICIOS } from './tipos'

/** Toda lectura de contenido pasa por aquí. Las páginas nunca importan JSON directamente. */
export const proyectos = proyectosJson as Proyecto[]

export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug)
}

export function proyectosPorServicio(servicio: ServicioId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.servicio === servicio && p.slug !== excluir)
}

export function proyectosDestacados(): Proyecto[] {
  return proyectos.filter((p) => p.destacado)
}

/** Obras de la misma técnica, para "Obras similares". Si no llega a `n`, completa con otras. */
export function proyectosSimilares(proyecto: Proyecto, n = 3): Proyecto[] {
  const mismas = proyectosPorServicio(proyecto.servicio, proyecto.slug)
  if (mismas.length >= n) return mismas.slice(0, n)
  const otras = proyectos.filter((p) => p.servicio !== proyecto.servicio && p.slug !== proyecto.slug)
  return [...mismas, ...otras].slice(0, n)
}

export function municipiosConObra(): string[] {
  return Array.from(new Set(proyectos.map((p) => p.municipio)))
}

export function serviciosOrdenados(): Servicio[] {
  return ORDEN_SERVICIOS.map((id) => servicios[id])
}

export function servicioPorId(id: string): Servicio | undefined {
  return (servicios as Record<string, Servicio>)[id]
}

export { articulos }

export function articuloPorSlug(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug)
}
