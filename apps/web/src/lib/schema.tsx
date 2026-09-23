/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish function names and same JSON-LD shapes/values as before this
 * migration, now built via `@site/seo`'s builders (the `#negocio` @id is
 * kept exactly) from `@site/content`/`./config` facts. The `JsonLd` React
 * component stays here, unchanged — it's the one bit of actual React in
 * this module. Server-only consumers (`app/layout.tsx`, `[servicio]/page.tsx`,
 * `blog/[slug]/page.tsx`, `components/layout/Migas.tsx`): safe to read
 * `@site/content`'s claims/projects here without any client-bundle risk.
 */
import {
  businessJsonLdId,
  buildLocalBusinessJsonLd,
  buildServiceJsonLd,
  buildFaqJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbsJsonLd,
  deriveAreaServed,
} from '@site/seo'
import { getClaims, getProjects } from '@site/content'
import { nap, sitio } from './config'
import type { Articulo, ServicioId } from './tipos'

/**
 * Identificador estable del negocio. Un solo nodo con todos sus datos (en el
 * layout raíz, presente por tanto en las 31 rutas) y el resto de bloques lo
 * referencian con `{'@id': …}` en vez de repetir la entidad entera. Así el
 * grafo consolida 31 menciones de una entidad, no 31 copias de ella.
 */
export const ID_NEGOCIO = businessJsonLdId(sitio.url)

/**
 * Cobertura que sostienen las obras documentadas: solo las provincias con
 * proyectos reales (`@site/content`'s `getProjects`), ordenadas por la lista
 * declarada en `claims.declaredProvinces` — ver `deriveAreaServed`. En
 * `content/proyectos.json` solo hay obra en Valencia y Alicante: en el texto
 * visible se publica como «cobertura declarada · por confirmar», pero en los
 * datos estructurados solo va lo respaldado. Sin `geo`: no tenemos
 * coordenadas reales.
 */
function areaServida() {
  const provinciasProyectos = getProjects('es').map((p) => p.province)
  return deriveAreaServed(provinciasProyectos, getClaims('es').declaredProvinces)
}

export function schemaNegocioLocal() {
  return buildLocalBusinessJsonLd({
    siteUrl: sitio.url,
    name: nap.nombre,
    email: nap.email,
    phoneHref: nap.telefonoHref,
    address: {
      streetAddress: nap.direccion,
      town: nap.municipio,
      postalCode: nap.codigoPostal,
      province: nap.provincia,
      country: nap.pais,
    },
    areaServed: areaServida(),
    sameAs: nap.redes.map((r) => r.href),
  })
}

export function schemaServicio(servicio: ServicioId, nombre: string, ruta: string, descripcion: string) {
  return buildServiceJsonLd({
    siteUrl: sitio.url,
    route: ruta,
    name: nombre,
    description: descripcion,
    businessId: ID_NEGOCIO,
    areaServed: areaServida(),
  })
}

/** Solo con respuestas reales. Sin respuesta, no hay FAQPage. */
export function schemaFAQ(preguntas: { pregunta: string; respuesta?: string }[]) {
  return buildFaqJsonLd(preguntas.map((p) => ({ question: p.pregunta, answer: p.respuesta })))
}

export function schemaArticulo(articulo: Articulo) {
  return buildArticleJsonLd({
    siteUrl: sitio.url,
    slug: articulo.slug,
    title: articulo.titulo,
    excerpt: articulo.entradilla,
    dateIso: articulo.fechaIso,
    businessId: ID_NEGOCIO,
  })
}

export function schemaMigas(items: { nombre: string; ruta?: string }[]) {
  return buildBreadcrumbsJsonLd(
    sitio.url,
    items.map((item) => ({ name: item.nombre, route: item.ruta })),
  )
}

export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
