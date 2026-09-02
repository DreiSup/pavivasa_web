/**
 * Modelo de contenido. Aquí se define el catálogo de la empresa: qué servicios
 * ofrece y qué datos tiene cada obra. Ampliar según el negocio de Pavivasa.
 */

export type ServicioId = 'servicio-a' | 'servicio-b'

export type Imagen = {
  src: string
  alt: string
}

export type Proyecto = {
  slug: string
  titulo: string
  municipio: string | null
  servicio: ServicioId
  superficie?: number | null
  anio?: number | null
  imagenes: Imagen[]
  destacado: boolean
}

export const NOMBRE_SERVICIO: Record<ServicioId, string> = {
  'servicio-a': 'Servicio A',
  'servicio-b': 'Servicio B',
}

export const RUTA_SERVICIO: Record<ServicioId, string> = {
  'servicio-a': '/servicio-a/',
  'servicio-b': '/servicio-b/',
}
