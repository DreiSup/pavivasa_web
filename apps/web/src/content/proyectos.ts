/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish shape and same values as `content/proyectos.json` before this
 * migration (moved from JSON to TS since it now derives from
 * `@site/content`'s `getProjects('es')`).
 */
import { getProjects } from '@site/content'
import type { FichaEjecucion, Imagen, Proyecto } from '@/lib/tipos'

function imagen(img: { label: string; src?: string; alt?: string }): Imagen {
  return {
    etiqueta: img.label,
    ...(img.src !== undefined ? { src: img.src } : {}),
    ...(img.alt !== undefined ? { alt: img.alt } : {}),
  }
}

function ficha(specs: {
  concrete?: string
  thickness?: string
  aggregate?: string
  mesh?: string
  fiber?: string
  colorDosage?: string
  expansionJoints?: string
  finish?: string
}): FichaEjecucion {
  return {
    ...(specs.concrete !== undefined ? { hormigon: specs.concrete } : {}),
    ...(specs.thickness !== undefined ? { espesor: specs.thickness } : {}),
    ...(specs.aggregate !== undefined ? { arido: specs.aggregate } : {}),
    ...(specs.mesh !== undefined ? { mallazo: specs.mesh } : {}),
    ...(specs.fiber !== undefined ? { fibra: specs.fiber } : {}),
    ...(specs.colorDosage !== undefined ? { dosificacionColor: specs.colorDosage } : {}),
    ...(specs.expansionJoints !== undefined ? { juntas: specs.expansionJoints } : {}),
    ...(specs.finish !== undefined ? { acabado: specs.finish } : {}),
  }
}

const proyectos: Proyecto[] = getProjects('es').map((p) => ({
  slug: p.slug,
  titulo: p.title,
  tituloLargo: p.longTitle,
  servicio: p.service,
  municipio: p.town,
  provincia: p.province,
  ...(p.district !== undefined ? { zona: p.district } : {}),
  tipo: p.spaceType,
  ...(p.model !== undefined ? { modelo: p.model } : {}),
  ...(p.color !== undefined ? { color: p.color } : {}),
  ...(p.surfaceArea !== undefined ? { superficie: p.surfaceArea } : {}),
  ...(p.photoYear !== undefined ? { anioFoto: p.photoYear } : {}),
  ficha: ficha(p.executionSpecs),
  encargo: p.brief,
  ejecucion: p.execution,
  imagenes: p.images.map(imagen),
  destacado: p.featured,
}))

export default proyectos
