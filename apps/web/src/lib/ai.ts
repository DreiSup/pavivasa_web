import { claims, nap, sitio } from './config'
import { articulosIndexables, proyectos, servicioPorId, serviciosOrdenados } from './datos'
import type { BloqueArticulo, Proyecto, Servicio, ServicioId } from './tipos'
import { NOMBRE_SERVICIO, ORDEN_SERVICIOS, RUTA_SERVICIO } from './tipos'

/**
 * Versión en Markdown del sitio para modelos de lenguaje (/llms.txt y /ai/*).
 * Todo sale de `content/` y `lib/config.ts`: aquí no hay copy propio. Lo que el
 * cliente aún no ha confirmado se marca como pendiente y lo que falta (respuestas
 * de FAQ, artículo sin cuerpo) se omite en vez de inventarse.
 */

const PENDIENTE = '[pendiente de confirmar]'

/** Ficheros publicados bajo /ai/. Un solo sitio para añadir o quitar uno. */
export const ARCHIVOS_AI = {
  empresa: '/ai/empresa.md',
  servicios: '/ai/servicios.md',
  proyectos: '/ai/proyectos.md',
  articulos: '/ai/articulos.md',
} as const

export const rutaAiServicio = (id: ServicioId) => `/ai/servicios/${id}.md`

const abs = (ruta: string) => `${sitio.url}${ruta}`
const lista = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

const NOMBRE_SITIO = `${nap.nombre} — pavimentos de hormigón en Valencia y Alicante`
const RESUMEN =
  'Pavivasa ejecuta y conserva pavimentos, recubrimientos y estructuras de hormigón: hormigón impreso, pulido y lavado, microcemento decorativo, autonivelantes, pavimentos de caucho y alicatados. Oficina en Sollana (Valencia).'

export function llmsTxt(): string {
  return `# ${NOMBRE_SITIO}

> ${RESUMEN}

Datos verificados en la web: ${claims.anios.toLowerCase()}, ${claims.garantia.toLowerCase()}, ${claims.repiten.toLowerCase()}. Contacto: ${nap.telefonoInternacional}, ${nap.email}.

## Empresa

- [Empresa](${abs('/empresa/')}): quiénes somos, valores y zona de trabajo
- [Empresa en Markdown](${abs(ARCHIVOS_AI.empresa)}): datos de contacto, claims y cobertura

## Servicios

${serviciosOrdenados()
  .map((s) => `- [${s.nombre}](${abs(rutaAiServicio(s.id))}): ${s.descripcion}`)
  .join('\n')}
- [Todos los servicios en un solo fichero](${abs(ARCHIVOS_AI.servicios)})

## Proyectos

- [Proyectos](${abs('/proyectos/')}): ${proyectos.length} obras documentadas
- [Proyectos en Markdown](${abs(ARCHIVOS_AI.proyectos)}): ficha de cada obra

## Blog

${articulosIndexables()
  .map((a) => `- [${a.titulo}](${abs(`/blog/${a.slug}/`)}): ${a.entradilla}`)
  .join('\n')}
- [Artículos en Markdown](${abs(ARCHIVOS_AI.articulos)})

## Optional

- [Pedir presupuesto](${abs('/presupuesto/')})
- [Texto completo de todos los ficheros](${abs('/llms-full.txt')})
`
}

export function aiEmpresa(): string {
  const conObra = Array.from(new Set(proyectos.map((p) => p.provincia)))
  return `# ${nap.nombre}: datos de la empresa

${RESUMEN}

## Contacto

- Teléfono y WhatsApp: ${nap.telefonoInternacional}
- Email: ${nap.email}
- Dirección: ${nap.direccionCompleta}
- Contacto: ${nap.gestor}
- Horario: ${PENDIENTE}
- Web: ${sitio.url}/
- Redes: ${nap.redes.map((r) => `[${r.nombre}](${r.href})`).join(' · ')}

## Datos que publica la web

${lista([claims.anios, claims.garantia, claims.repiten])}

## Zona de trabajo

- Provincias con obra documentada en la web: ${conObra.join(' y ')}.
- Cobertura declarada en ${abs('/empresa/')}: ${claims.provincias.join(', ')} ${PENDIENTE}.
- Municipios con obra: ${Array.from(new Set(proyectos.map((p) => p.municipio))).join(', ')}.

## Enlaces

- [Empresa](${abs('/empresa/')})
- [Pedir presupuesto](${abs('/presupuesto/')})
`
}

function ficha(s: Servicio): string {
  const partes: string[] = []
  if (s.fichaTecnica) {
    const t = s.fichaTecnica
    partes.push(`## ${t.titulo}\n\n${t.texto}`)
    partes.push(
      t.filas
        .map((f) => {
          const celdas = f.valores
            .map((v, i) => (v ? `${t.columnas[i]}: ${v}` : null))
            .filter(Boolean)
            .join(' · ')
          return `- ${f.parametro}: ${celdas}`
        })
        .join('\n'),
    )
  }
  if (s.especificacion) {
    const e = s.especificacion
    partes.push(`## ${e.titulo}\n\n${e.texto}\n\n${lista(e.lineas.map((l) => `${l.etiqueta}: ${l.valor}`))}`)
  }
  return partes.join('\n\n')
}

function obrasDe(id: ServicioId): string {
  const obras = proyectos.filter((p) => p.servicio === id)
  if (obras.length === 0) return ''
  return `## Obras de este servicio\n\n${obras
    .map((p) => `- [${p.titulo} · ${p.municipio}](${abs(`/proyectos/${p.slug}/`)})`)
    .join('\n')}`
}

export function aiServicio(id: ServicioId, nivel = 1): string {
  const s = servicioPorId(id)
  if (!s) return ''
  const h = '#'.repeat(nivel)
  const respondidas = s.faq.filter((f) => f.respuesta)
  const bloques = [
    `${h} ${s.nombre}\n\n${s.intro}\n\nPágina: ${abs(RUTA_SERVICIO[id])}`,
    `${'#'.repeat(nivel + 1)} ${s.queEs.titulo}\n\n${s.queEs.parrafos.join('\n\n')}`,
    s.aplicaciones.length ? `${'#'.repeat(nivel + 1)} Aplicaciones\n\n${lista(s.aplicaciones)}` : '',
    s.ventajas.length ? `${'#'.repeat(nivel + 1)} Ventajas\n\n${lista(s.ventajas)}` : '',
    s.modelos.length ? `${'#'.repeat(nivel + 1)} Modelos\n\n${lista(s.modelos)}` : '',
    s.colores.length ? `${'#'.repeat(nivel + 1)} Colores\n\n${lista(s.colores)}` : '',
    ficha(s),
    respondidas.length
      ? `${'#'.repeat(nivel + 1)} Preguntas frecuentes\n\n${respondidas.map((f) => `**${f.pregunta}**\n${f.respuesta}`).join('\n\n')}`
      : '',
    obrasDe(id),
  ]
  return bloques.filter(Boolean).join('\n\n') + '\n'
}

export function aiServicios(): string {
  return `# Servicios de ${nap.nombre}\n\n${ORDEN_SERVICIOS.map((id) => aiServicio(id, 2)).join('\n')}`
}

function fichaObra(p: Proyecto): string {
  const f = p.ficha
  const lineas = [
    ['Hormigón', f.hormigon],
    ['Espesor', f.espesor],
    ['Árido', f.arido],
    ['Mallazo', f.mallazo],
    ['Fibra', f.fibra],
    ['Dosificación de color', f.dosificacionColor],
    ['Juntas', f.juntas],
    ['Acabado', f.acabado],
  ].filter((l): l is [string, string] => Boolean(l[1]))
  return lineas.length ? `\n\nFicha de ejecución:\n${lista(lineas.map(([k, v]) => `${k}: ${v}`))}` : ''
}

export function aiProyectos(): string {
  const cuerpo = proyectos
    .map((p) => {
      const datos = [
        `Servicio: ${NOMBRE_SERVICIO[p.servicio]}`,
        `Lugar: ${p.municipio} (${p.provincia})${p.zona ? `, ${p.zona}` : ''}`,
        `Tipo de espacio: ${p.tipo}`,
        p.modelo ? `Modelo: ${p.modelo}` : '',
        p.color ? `Color: ${p.color}` : '',
        p.superficie ? `Superficie: ${p.superficie} m²` : '',
      ].filter(Boolean)
      return `## ${p.tituloLargo}

${lista(datos)}
- Página: ${abs(`/proyectos/${p.slug}/`)}

${p.encargo.join('\n\n')}

${p.ejecucion.join('\n\n')}${fichaObra(p)}`
    })
    .join('\n\n')
  return `# Proyectos de ${nap.nombre}\n\n${proyectos.length} obras documentadas en Valencia y Alicante.\n\n${cuerpo}\n`
}

function bloque(b: BloqueArticulo): string {
  switch (b.tipo) {
    case 'p':
      return b.texto
    case 'h2':
      return `### ${b.texto}`
    case 'ol':
      return b.items.map((it, i) => `${i + 1}. **${it.titulo}** ${it.texto}`).join('\n')
    case 'obra':
      return `**${b.titulo}**\n${lista(b.lineas)}\n${abs(`/proyectos/${b.slug}/`)}`
    default:
      return ''
  }
}

export function aiArticulos(): string {
  const cuerpo = articulosIndexables()
    .map(
      (a) =>
        `## ${a.titulo}\n\n${a.fecha} · ${abs(`/blog/${a.slug}/`)}\n\n${a.entradilla}\n\n${a.cuerpo.map(bloque).filter(Boolean).join('\n\n')}\n\n${a.cierre}`,
    )
    .join('\n\n')
  return `# Blog de ${nap.nombre}\n\n${cuerpo}\n`
}

/** Todo el contenido en un solo fichero, para modelos que prefieren una única lectura. */
export function llmsFullTxt(): string {
  return [llmsTxt(), aiEmpresa(), aiServicios(), aiProyectos(), aiArticulos()].join('\n---\n\n')
}
