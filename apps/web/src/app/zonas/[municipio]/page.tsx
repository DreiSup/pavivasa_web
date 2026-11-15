import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import EnlaceEtiqueta from '@/components/ui/EnlaceEtiqueta'
import Seccion, { CabeceraSeccion } from '@/components/ui/Seccion'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import TarjetaProyecto from '@/components/contenido/TarjetaProyecto'
import LlamadaFinal from '@/components/secciones/LlamadaFinal'
import { JsonLd } from '@/lib/schema'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'
import { plural } from '@/lib/texto'
import {
  indexableServiceAreas,
  projectsOf,
  serviceAreaBySlug,
  serviceAreaJsonLd,
  serviceAreaRoute,
  serviceAreas,
} from '@/lib/service-areas'

/*
 * `/zonas/<municipio>/` — 2026-11-15, encargo SEO del dueño. Criterio en
 * `docs/seo-zonas.md`. Lo que distingue una zona de «la plantilla con el
 * nombre cambiado» sale todo del dato (`packages/content/src/data/service-areas.ts`):
 * title/H1 con la técnica hecha allí, entradilla, cuerpo y description
 * propios, y sus obras. Sin FAQ: un bloque idéntico en cada zona es la huella
 * de una doorway.
 *
 * Sin foto confirmada de una obra del municipio la página se publica igual
 * (la enlazan sus obras) pero `noindex, follow`, fuera del sitemap y sin
 * enlace desde las otras zonas ni desde el servicio.
 */
export function generateStaticParams() {
  return serviceAreas.map((a) => ({ municipio: a.slug }))
}

// Full param set is known at build time: unknown slugs 404 immediately.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ municipio: string }> }): Promise<Metadata> {
  const { municipio } = await params
  const zona = serviceAreaBySlug(municipio)
  if (!zona) return {}
  return {
    title: zona.heading,
    description: zona.description,
    alternates: { canonical: serviceAreaRoute(zona) },
    ...(zona.indexable ? {} : { robots: { index: false, follow: true } }),
  }
}

export default async function PaginaZona({ params }: { params: Promise<{ municipio: string }> }) {
  const { municipio } = await params
  const zona = serviceAreaBySlug(municipio)
  if (!zona) notFound()

  const obras = projectsOf(zona)
  const otrasZonas = indexableServiceAreas.filter((z) => z.slug !== zona.slug)

  return (
    <>
      <JsonLd data={serviceAreaJsonLd(zona)} />
      <Migas items={[{ nombre: 'Proyectos', href: '/proyectos/' }, { nombre: zona.heading, corto: zona.town }]} />

      {/* Hero: solo una foto confirmada del municipio; si no, el hueco honesto. */}
      <section className="px-lat-movil md:px-lat-desktop pt-6 pb-8 md:pt-10 md:pb-[72px]">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 md:items-end">
          <div className="flex flex-col gap-4 md:gap-6">
            <AntetituloSeccion>
              {zona.region} · {zona.province} · {obras.length} {plural(obras.length, 'obra', 'obras')}
            </AntetituloSeccion>
            <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95] text-balance">{zona.heading}</h1>
            <p className="text-16 md:text-20 text-tinta-media">{zona.lead}</p>
          </div>
          <BloquePosicion
            imagen={
              zona.confirmedPhoto
                ? { etiqueta: zona.confirmedPhoto.label, src: zona.confirmedPhoto.src, alt: zona.confirmedPhoto.alt }
                : undefined
            }
            etiqueta={`Foto de obra en ${zona.town}`}
            aviso={`Foto de obra en ${zona.town} · pendiente`}
            className="aspect-[4/3] -mx-lat-movil md:mx-0 !border-x-0 md:!border-x"
            prioridad
          />
        </div>
      </section>

      <Seccion espacio="corto" className="bg-fondo-alt" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 md:gap-16">
        <CabeceraSeccion titulo={`Qué hemos hecho en ${zona.town}`} />
        <div className="flex flex-col gap-4 text-16 md:text-20 leading-[1.6] md:max-w-lectura">
          {zona.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </Seccion>

      <Seccion espacio="corto" interior="flex flex-col gap-6 md:gap-8">
        <CabeceraSeccion titulo={`Obras en ${zona.town}`} />
        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {obras.map((o) => (
            <li key={o.slug}>
              <TarjetaProyecto proyecto={o} tamano="grande" conFicha />
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion espacio="corto" className="bg-fondo-alt" interior="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6 md:gap-16">
        <CabeceraSeccion titulo={zona.services.length > 1 ? 'Las técnicas' : 'La técnica'} />
        <div className="flex flex-col gap-6">
          <ul className="list-none m-0 p-0 flex flex-col gap-4">
            {zona.services.map((s) => (
              <li key={s}>
                <EnlaceEtiqueta href={RUTA_SERVICIO[s]}>Sobre el {NOMBRE_SERVICIO[s].toLowerCase()} →</EnlaceEtiqueta>
              </li>
            ))}
          </ul>
          {otrasZonas.length ? (
            <nav aria-labelledby="otras-zonas" className="flex flex-col gap-3 border-t border-tinta pt-4">
              <span id="otras-zonas" className="font-mono text-d-10 tracking-[0.12em] uppercase text-tinta-media">
                Otras zonas con obra documentada
              </span>
              <ul className="list-none m-0 p-0 flex flex-wrap gap-x-6 gap-y-2">
                {otrasZonas.map((z) => (
                  <li key={z.slug}>
                    <Link href={serviceAreaRoute(z)} className="min-h-tactil inline-flex items-center text-16 font-semibold text-tinta hover:text-pigmento">
                      {z.heading}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Seccion>

      <LlamadaFinal titulo={`¿Quieres algo parecido en ${zona.town}?`} />
    </>
  )
}
