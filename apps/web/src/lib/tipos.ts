/**
 * Modelo de contenido. Aquí se define el catálogo de la empresa: qué servicios
 * ofrece y qué datos tiene cada obra. Todo el contenido real vive en `content/`.
 */

export type ServicioId =
  | 'hormigon-impreso'
  | 'hormigon-pulido'
  | 'hormigon-lavado'
  | 'microcemento'
  | 'autonivelantes'
  | 'pavimentos-de-caucho'
  | 'alicatados'

/** Nombre corto, para etiquetas y filtros (siempre en mono, versalitas). */
export const TECNICA_CORTA: Record<ServicioId, string> = {
  'hormigon-impreso': 'Impreso',
  'hormigon-pulido': 'Pulido',
  'hormigon-lavado': 'Lavado',
  microcemento: 'Microcemento',
  autonivelantes: 'Autonivelantes',
  'pavimentos-de-caucho': 'Caucho',
  alicatados: 'Alicatados',
}

export const NOMBRE_SERVICIO: Record<ServicioId, string> = {
  'hormigon-impreso': 'Hormigón impreso',
  'hormigon-pulido': 'Hormigón pulido',
  'hormigon-lavado': 'Hormigón lavado',
  microcemento: 'Microcemento decorativo',
  autonivelantes: 'Autonivelantes',
  'pavimentos-de-caucho': 'Pavimentos de caucho',
  alicatados: 'Alicatados',
}

export const RUTA_SERVICIO: Record<ServicioId, string> = {
  'hormigon-impreso': '/hormigon-impreso/',
  'hormigon-pulido': '/hormigon-pulido/',
  'hormigon-lavado': '/hormigon-lavado/',
  microcemento: '/microcemento/',
  autonivelantes: '/autonivelantes/',
  'pavimentos-de-caucho': '/pavimentos-de-caucho/',
  alicatados: '/alicatados/',
}

/** Orden del menú actual de pavivasa.com. Los tres primeros son el punto fuerte declarado. */
export const ORDEN_SERVICIOS: ServicioId[] = [
  'hormigon-impreso',
  'hormigon-pulido',
  'hormigon-lavado',
  'microcemento',
  'autonivelantes',
  'pavimentos-de-caucho',
  'alicatados',
]

export const SERVICIOS_FUERTES: ServicioId[] = ['hormigon-impreso', 'hormigon-pulido', 'microcemento']

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
