import type { Metadata } from 'next'
import Link from 'next/link'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Migas from '@/components/layout/Migas'
import { proyectos } from '@/lib/datos'
import { NOMBRE_SERVICIO } from '@/lib/tipos'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Obra ejecutada.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  return (
    <>
      <Migas items={[{ nombre: 'Proyectos' }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <AntetituloSeccion>Proyectos</AntetituloSeccion>
          <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
            Obra ejecutada
          </h1>
        </div>

        {proyectos.length === 0 ? (
          <p className="text-16 text-tinta-media m-0">
            Sin proyectos todavía. Añádelos en <code>content/proyectos.json</code>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <Link key={p.slug} href={`/proyectos/${p.slug}/`} className="flex flex-col gap-2 bg-fondo-alt p-5 no-underline">
                <h2 className="font-display font-bold fs-h3 text-20 text-tinta m-0">{p.titulo}</h2>
                <span className="font-mono text-d-11 text-acero">{NOMBRE_SERVICIO[p.servicio]}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
