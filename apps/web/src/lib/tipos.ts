/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish types and same values as before this migration. Types are
 * kept literally as they were so the frontend type-checks unchanged; the
 * five small lookup constants below are now derived from
 * `@site/content`'s light service catalog (never from the full `services`
 * content — see `packages/content/src/data/service-catalog.ts`'s comment on
 * why: several `'use client'` components import this module just for these
 * constants).
 */
import { getServiceCatalog } from '@site/content'

export type ServicioId =
  | 'hormigon-impreso'
  | 'hormigon-pulido'
  | 'hormigon-lavado'
  | 'microcemento'
  | 'autonivelantes'
  | 'pavimentos-de-caucho'
  | 'alicatados'

const catalogo = getServiceCatalog('es')

/** Nombre corto, para etiquetas y filtros (siempre en mono, versalitas). */
export const TECNICA_CORTA: Record<ServicioId, string> = Object.fromEntries(
  catalogo.map((c) => [c.id, c.shortName]),
) as Record<ServicioId, string>

export const NOMBRE_SERVICIO: Record<ServicioId, string> = Object.fromEntries(
  catalogo.map((c) => [c.id, c.name]),
) as Record<ServicioId, string>

export const RUTA_SERVICIO: Record<ServicioId, string> = Object.fromEntries(
  catalogo.map((c) => [c.id, `/${c.slug}/`]),
) as Record<ServicioId, string>

/** Orden del menú actual de pavivasa.com. Los tres primeros son el punto fuerte declarado. */
export const ORDEN_SERVICIOS: ServicioId[] = catalogo.map((c) => c.id) as ServicioId[]

export const SERVICIOS_FUERTES: ServicioId[] = catalogo.filter((c) => c.flagship).map((c) => c.id) as ServicioId[]

/** Foto que aún no existe: solo la etiqueta de qué va ahí. */
export type Imagen = {
  /** Qué foto va en ese hueco, para pedírsela al cliente. */
  etiqueta: string
  /** Cuando llegue el original: ruta en /public. Hasta entonces, BloquePosicion. */
  src?: string
  alt?: string
}

/** Ficha de ejecución. Cada campo es opcional: lo que la web no da, no se inventa. */
export type FichaEjecucion = {
  hormigon?: string
  espesor?: string
  arido?: string
  mallazo?: string
  fibra?: string
  dosificacionColor?: string
  juntas?: string
  acabado?: string
}

export type Proyecto = {
  slug: string
  /** Titular corto: modelo y color ("Piedra inglesa, gris mate y crema"). */
  titulo: string
  /** Titular largo de la ficha. */
  tituloLargo: string
  servicio: ServicioId
  municipio: string
  provincia: 'Alicante' | 'Valencia'
  /** Urbanización o zona, si la web la nombra. */
  zona?: string
  /** Tipo de espacio ("Vivienda en urbanización", "Nave industrial"). */
  tipo: string
  modelo?: string
  color?: string
  superficie?: number
  /** Año deducido de la fecha de la foto: siempre se muestra como DatoPendiente. */
  anioFoto?: number
  ficha: FichaEjecucion
  encargo: string[]
  ejecucion: string[]
  imagenes: Imagen[]
  destacado: boolean
}

export type BloqueArticulo =
  | { tipo: 'p'; texto: string }
  | { tipo: 'h2'; id: string; texto: string }
  | { tipo: 'ol'; items: { titulo: string; texto: string }[] }
  | { tipo: 'obra'; slug: string; titulo: string; lineas: string[] }
  | { tipo: 'pendiente'; texto: string }

export type Articulo = {
  slug: string
  titulo: string
  entradilla: string
  servicio: ServicioId
  /** Mes y año de publicación en la web actual. */
  fecha: string
  fechaIso: string
  imagen: Imagen
  cuerpo: BloqueArticulo[]
  /** Texto del cierre con CTA. */
  cierre: string
}

export type Pregunta = { pregunta: string; respuesta?: string }

export type Servicio = {
  id: ServicioId
  numero: string
  nombre: string
  nombreCorto: string
  /** Frase de la tarjeta de la home. */
  resumen: string
  /** Descripción para <meta>. */
  descripcion: string
  /** Entradilla del hero. */
  intro: string
  introMovil: string
  imagenHero: Imagen
  queEs: { titulo: string; parrafos: string[] }
  aplicaciones: string[]
  ventajas: string[]
  modelos: string[]
  colores: string[]
  fichaTecnica?: {
    titulo: string
    texto: string
    columnas: string[]
    filas: { parametro: string; valores: (string | null)[] }[]
  }
  /** Lista de especificación cuando no hay tabla comparativa (lavado, microcemento…). */
  especificacion?: { titulo: string; texto: string; lineas: { etiqueta: string; valor: string }[] }
  faq: Pregunta[]
  cta: string
}
