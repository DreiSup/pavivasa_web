/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish shape and same values as before this migration, now built
 * from `@site/content`'s `getServices('es')`.
 */
import { getServices } from '@site/content'
import type { Imagen, Pregunta, Servicio, ServicioId } from '@/lib/tipos'

function imagen(img: { label: string; src?: string; alt?: string }): Imagen {
  return {
    etiqueta: img.label,
    ...(img.src !== undefined ? { src: img.src } : {}),
    ...(img.alt !== undefined ? { alt: img.alt } : {}),
  }
}

function preguntas(faq: { question: string; answer?: string }[]): Pregunta[] {
  return faq.map((q) => ({
    pregunta: q.question,
    ...(q.answer !== undefined ? { respuesta: q.answer } : {}),
  }))
}

export const servicios: Record<ServicioId, Servicio> = Object.fromEntries(
  getServices('es').map((s) => {
    const servicio: Servicio = {
      id: s.id,
      numero: s.number,
      nombre: s.name,
      nombreCorto: s.shortName,
      resumen: s.summary,
      descripcion: s.description,
      intro: s.intro,
      introMovil: s.introMobile,
      imagenHero: imagen(s.heroImage),
      queEs: { titulo: s.about.title, parrafos: s.about.paragraphs },
      aplicaciones: s.applications,
      ventajas: s.advantages,
      modelos: s.models,
      colores: s.colors,
      ...(s.specSheet
        ? {
            fichaTecnica: {
              titulo: s.specSheet.title,
              texto: s.specSheet.text,
              columnas: s.specSheet.columns,
              filas: s.specSheet.rows.map((row) => ({ parametro: row.parameter, valores: row.values })),
            },
          }
        : {}),
      ...(s.specList
        ? {
            especificacion: {
              titulo: s.specList.title,
              texto: s.specList.text,
              lineas: s.specList.lines.map((line) => ({ etiqueta: line.label, valor: line.value })),
            },
          }
        : {}),
      faq: preguntas(s.faq),
      cta: s.cta,
    }
    return [s.id, servicio]
  }),
) as Record<ServicioId, Servicio>
