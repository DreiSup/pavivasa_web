import { nap, sitio } from './config'
import type { Articulo, ServicioId } from './tipos'

/**
 * Identificador estable del negocio. Un solo nodo con todos sus datos (en el
 * layout raíz, presente por tanto en las 31 rutas) y el resto de bloques lo
 * referencian con `{'@id': …}` en vez de repetir la entidad entera. Así el
 * grafo consolida 31 menciones de una entidad, no 31 copias de ella.
 */
export const ID_NEGOCIO = `${sitio.url}/#negocio`

/**
 * Cobertura que sostienen las obras documentadas. `claims.provincias` declara
 * seis provincias y en `content/proyectos.json` solo hay obra en Valencia y
 * Alicante: en el texto visible se publica como «cobertura declarada · por
 * confirmar», pero en los datos estructurados solo va lo respaldado.
 * Sin `geo`: no tenemos coordenadas reales.
 */
const PROVINCIAS_CON_OBRA = ['Valencia', 'Alicante']

const areaServida = () => PROVINCIAS_CON_OBRA.map((p) => ({ '@type': 'AdministrativeArea', name: p }))

export function schemaNegocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': ID_NEGOCIO,
    name: nap.nombre,
    url: sitio.url,
    email: nap.email,
    telephone: nap.telefonoHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: nap.direccion,
      addressLocality: nap.municipio,
      postalCode: nap.codigoPostal,
      addressRegion: nap.provincia,
      addressCountry: nap.pais,
    },
    areaServed: areaServida(),
    sameAs: nap.redes.map((r) => r.href),
  }
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string, descripcion: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${sitio.url}${ruta}#servicio`,
    serviceType: nombre,
    description: descripcion,
    provider: { '@id': ID_NEGOCIO },
    areaServed: areaServida(),
    url: `${sitio.url}${ruta}`,
  }
}

/** Solo con respuestas reales. Sin respuesta, no hay FAQPage. */
export function schemaFAQ(preguntas: { pregunta: string; respuesta?: string }[]) {
  const conRespuesta = preguntas.filter((p): p is { pregunta: string; respuesta: string } => Boolean(p.respuesta))
  if (conRespuesta.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: conRespuesta.map((p) => ({
      '@type': 'Question',
      name: p.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
    })),
  }
}

export function schemaArticulo(articulo: Articulo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${sitio.url}/blog/${articulo.slug}/#articulo`,
    headline: articulo.titulo,
    description: articulo.entradilla,
    datePublished: articulo.fechaIso,
    inLanguage: 'es',
    publisher: { '@id': ID_NEGOCIO },
    mainEntityOfPage: `${sitio.url}/blog/${articulo.slug}/`,
  }
}

export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  /**
   * `item` es obligatorio en todo ListItem salvo en el último. Un nivel
   * intermedio sin ruta (el rótulo «Servicios», que no tiene página propia) no
   * puede publicarse: se descarta ANTES del map, para que las `position`
   * salgan correlativas 1, 2, 3 y no 1, 3.
   */
  const publicables = items.filter((item, i) => Boolean(item.ruta) || i === items.length - 1)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: publicables.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nombre,
      ...(item.ruta ? { item: `${sitio.url}${item.ruta}` } : {}),
    })),
  }
}

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
