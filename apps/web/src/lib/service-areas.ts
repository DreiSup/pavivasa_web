/**
 * Read API for the `/zonas/<town>/` pages (2026-11-15). New code, so English
 * identifiers (CLAUDE.md) — but it hands the pages the same Spanish
 * `Proyecto` shape every existing component already takes, through the
 * `proyectos` legacy adapter, instead of a second project type.
 *
 * Server-only: imported by `app/zonas/**`, `app/proyectos/[slug]/page.tsx`
 * and `app/sitemap.ts`, never by a `'use client'` component.
 */
import { buildServiceAreaJsonLd } from '@site/seo'
import { getServiceAreas } from '@site/content'
import type { ResolvedServiceArea } from '@site/content'
import { sitio } from './config'
import { proyectoPorSlug } from './datos'
import { ID_NEGOCIO } from './schema'
import type { Proyecto, ServicioId } from './tipos'

export type ServiceArea = ResolvedServiceArea

export const SERVICE_AREAS_ROUTE = '/zonas/'

export const serviceAreas: ServiceArea[] = getServiceAreas('es')

/** Areas that can be indexed (owner-confirmed photo). The only ones that go to the sitemap or get linked from service pages and other areas. */
export const indexableServiceAreas: ServiceArea[] = serviceAreas.filter((a) => a.indexable)

export function serviceAreaRoute(area: ServiceArea): string {
  return `${SERVICE_AREAS_ROUTE}${area.slug}/`
}

export function serviceAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug)
}

/** The area a project's town belongs to, if that town has one (validated: an area lists every project in its town). */
export function serviceAreaForProject(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.projects.includes(slug))
}

/** Indexable areas where `service` has been done — for a "Dónde lo hemos hecho" block on a service page. */
export function indexableServiceAreasFor(service: ServicioId): ServiceArea[] {
  return indexableServiceAreas.filter((a) => a.services.includes(service))
}

export function projectsOf(area: ServiceArea): Proyecto[] {
  return area.projects.map((id) => proyectoPorSlug(id)).filter((p): p is Proyecto => p !== undefined)
}

export function serviceAreaJsonLd(area: ServiceArea) {
  return buildServiceAreaJsonLd({
    siteUrl: sitio.url,
    route: serviceAreaRoute(area),
    name: area.heading.slice(0, area.heading.lastIndexOf(` en ${area.town}`)) || area.heading,
    description: area.description,
    businessId: ID_NEGOCIO,
    town: area.town,
    province: `Provincia de ${area.province}`,
  })
}
