import proyectosJson from '@/content/proyectos.json'
import type { Proyecto, ServicioId } from './tipos'

/** Toda lectura de contenido pasa por aquí. Las páginas nunca importan JSON directamente. */
export const proyectos = proyectosJson as unknown as Proyecto[]

export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug)
}

export function proyectosPorServicio(servicio: ServicioId, excluir?: string): Proyecto[] {
  return proyectos.filter((p) => p.servicio === servicio && p.slug !== excluir)
}

export function proyectosDestacados(): Proyecto[] {
  return proyectos.filter((p) => p.destacado)
}
