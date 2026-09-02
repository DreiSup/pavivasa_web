import type { Metadata } from 'next'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Boton from '@/components/ui/Boton'
import DatoPendiente from '@/components/datos/DatoPendiente'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Descripción de la home pendiente.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <section className="px-[18px] md:px-lat-desktop py-14 md:py-24 flex flex-col gap-6">
        <AntetituloSeccion>{nap.nombre}</AntetituloSeccion>
        <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0 max-w-[16ch]">
          Titular principal <DatoPendiente>pendiente</DatoPendiente>
        </h1>
        <p className="text-16 md:text-20 text-tinta-media m-0 max-w-[52ch]">
          Subtítulo de la home. Sustituir por el copy real del documento maestro.
        </p>
        <div className="flex flex-wrap gap-3">
          <Boton variante="primario" href="/presupuesto/">
            Pedir presupuesto
          </Boton>
          <Boton variante="contorno" href="/proyectos/">
            Ver proyectos
          </Boton>
        </div>
      </section>

      <section className="bg-fondo-alt px-[18px] md:px-lat-desktop py-14 md:py-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            <AntetituloSeccion>Presupuesto</AntetituloSeccion>
            <h2 className="font-display font-bold fs-h2 text-34 md:text-46 m-0">Cuéntanos qué necesitas</h2>
          </div>
          <FormularioPresupuesto variante="corto" />
        </div>
      </section>
    </>
  )
}
