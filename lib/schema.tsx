import { claims, nap, sitio } from './config'
import type { Articulo, ServicioId } from './tipos'

export function schemaNegocioLocal() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
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
    areaServed: claims.provincias.map((p) => ({ '@type': 'AdministrativeArea', name: p })),
    sameAs: nap.redes.map((r) => r.href),
  }
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string, descripcion: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: nombre,
    description: descripcion,
    provider: { '@type': 'HomeAndConstructionBusiness', name: nap.nombre, url: sitio.url },
    areaServed: claims.provincias.map((p) => ({ '@type': 'AdministrativeArea', name: p })),
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
    headline: articulo.titulo,
    description: articulo.entradilla,
    datePublished: articulo.fechaIso,
    inLanguage: 'es',
    publisher: { '@type': 'Organization', name: nap.nombre, url: sitio.url },
    mainEntityOfPage: `${sitio.url}/blog/${articulo.slug}/`,
  }
}

export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
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
