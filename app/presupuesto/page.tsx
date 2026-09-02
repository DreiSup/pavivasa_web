import type { Metadata } from 'next'
import Boton from '@/components/ui/Boton'
import Migas from '@/components/layout/Migas'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import { nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Pide presupuesto sin compromiso',
  description: 'Cuéntanos qué necesitas y te llamamos.',
  alternates: { canonical: '/presupuesto/' },
}

export default function Presupuesto() {
  return (
    <>
      <Migas items={[{ nombre: 'Presupuesto' }]} />
      <section className="px-[18px] md:px-lat-desktop py-9 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col gap-6 md:sticky md:top-[100px] md:self-start">
            <h1 className="font-display font-extrabold fs-hero text-46 md:text-64 leading-[1.05] m-0">
              Pide presupuesto
            </h1>
            <p className="text-16 md:text-20 text-tinta-media m-0">Cuéntanos qué necesitas y te llamamos.</p>
            <div className="flex flex-col gap-3">
              <Boton variante="tinta" href={nap.telefonoHref ?? '#'}>
                Llamar al {nap.telefono ?? nap.telefonoMostrado}
              </Boton>
              <Boton variante="contorno" href={nap.whatsappHref ?? '#'}>
                WhatsApp
              </Boton>
            </div>
          </div>
          <FormularioPresupuesto variante="completo" />
        </div>
      </section>
    </>
  )
}
