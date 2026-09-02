import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Migas from '@/components/layout/Migas'
import DatoPendiente from '@/components/datos/DatoPendiente'
import { proyectoPorSlug, proyectos } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

/** Patrón de ruta generada desde content/. Todo SSG. */
export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) return {}
  return {
    title: proyecto.titulo,
    description: `${proyecto.titulo}. ${NOMBRE_SERVICIO[proyecto.servicio]}.`,
    alternates: { canonical: `/proyectos/${proyecto.slug}/` },
  }
}

export default async function FichaProyecto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) notFound()

  return (
    <>
      <Migas items={[{ nombre: 'Proyectos', href: '/proyectos/' }, { nombre: proyecto.titulo }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14 flex flex-col gap-6">
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
          {proyecto.titulo}
        </h1>
        <p className="font-mono text-d-12 text-acero m-0">
          {NOMBRE_SERVICIO[proyecto.servicio]}
          {' · '}
          {proyecto.municipio ?? <DatoPendiente>municipio</DatoPendiente>}
          {' · '}
          {proyecto.anio ?? <DatoPendiente>año</DatoPendiente>}
        </p>
      </section>
    </>
  )
}
