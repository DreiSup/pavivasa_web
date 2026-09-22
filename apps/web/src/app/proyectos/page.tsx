import type { Metadata } from 'next'
import { Suspense } from 'react'
import FiltrosProyectos from '@/components/secciones/FiltrosProyectos'
import { municipiosConObra, proyectos } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Obras de hormigón impreso, pulido, lavado y microcemento en Alicante y Valencia, con técnica, modelo, color y ficha de ejecución.',
  alternates: { canonical: '/proyectos/' },
}

export default function Proyectos() {
  const municipios = municipiosConObra().length

  return (
    <>
      <section className="px-lat-movil md:px-lat-desktop pt-8 pb-6 md:pt-14 md:pb-10">
        <div className="max-w-contenido mx-auto flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-16">
          <h1 className="font-display font-extrabold text-46 md:text-88 leading-[0.98] md:leading-[0.95]">Proyectos</h1>
          <p className="text-16 md:text-20 text-tinta-media md:max-w-[520px]">
            {proyectos.length} obras<span className="hidden md:inline"> documentadas</span> en {municipios} municipios de Alicante y Valencia.
            <span className="hidden md:inline"> Con técnica, modelo, color y, cuando lo tenemos, la ficha de ejecución.</span>
          </p>
        </div>
      </section>
      <Suspense>
        <FiltrosProyectos proyectos={proyectos} />
      </Suspense>
    </>
  )
}
