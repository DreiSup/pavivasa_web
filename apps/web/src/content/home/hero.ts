/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish shape and same values as before this migration, now built
 * from `@site/content`'s `getHome('es')`. Deliberately its own module, split
 * out of `space-names.ts` — see `../home/index.ts`'s comment.
 */
import { getHome } from '@site/content'
import type { Imagen, Pregunta } from '@/lib/tipos'

function imagen(img: { label: string; src?: string; alt?: string }): Imagen {
  return {
    etiqueta: img.label,
    ...(img.src !== undefined ? { src: img.src } : {}),
    ...(img.alt !== undefined ? { alt: img.alt } : {}),
  }
}

const home = getHome('es')

/** Foto de apertura de la home: contorno de piscina en impreso, acabado madera. */
export const HERO_HOME: Imagen = imagen(home.hero)

/** Seis espacios de "¿Qué quieres pavimentar?". Mismo orden que el desplegable del formulario. */
export const ESPACIOS: readonly { nombre: string; imagen: Imagen }[] = home.spaces.map((s) => ({
  nombre: s.name,
  imagen: imagen(s.image),
}))

/** Preguntas de la home. Las respuestas las redacta Gabriel: hasta entonces, DatoPendiente. */
export const FAQ_HOME: Pregunta[] = home.faq.map((q) => ({
  pregunta: q.question,
  ...(q.answer !== undefined ? { respuesta: q.answer } : {}),
}))

/** Modelos y colores con obra hecha (muestrario de la home). */
export const MODELOS_IMPRESO = home.printedModels
export const COLORES_OBRA = home.projectColors
