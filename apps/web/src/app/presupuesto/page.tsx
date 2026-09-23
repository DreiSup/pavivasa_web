import type { Metadata } from 'next'
import { Suspense } from 'react'
import Migas from '@/components/layout/Migas'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import DatoPendiente from '@/components/datos/DatoPendiente'
import EtiquetaTecnica from '@/components/datos/EtiquetaTecnica'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'
import FormularioConEspacio from './FormularioConEspacio'
import { claims, nap } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Pide presupuesto sin compromiso',
  description: `Cuéntanos qué quieres pavimentar y te llamamos. O llama al ${nap.telefono}.`,
  alternates: { canonical: '/presupuesto/' },
}

export default function Presupuesto() {
  return (
    <>
      <Migas items={[{ nombre: 'Presupuesto' }]} />
      <section className="px-lat-movil md:px-lat-desktop pt-6 pb-6 md:pt-10 md:pb-24">
        <div className="max-w-contenido mx-auto grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 md:gap-20 items-start">
          <div className="flex flex-col gap-4 md:gap-10">
            <div className="flex flex-col gap-4 md:gap-5">
              <AntetituloSeccion>
                <span className="md:hidden">Sin compromiso</span>
                <span className="hidden md:inline">Presupuesto sin compromiso</span>
              </AntetituloSeccion>
              <h1 className="font-display font-extrabold text-46 md:text-64 leading-[0.98] text-balance">
                <span className="md:hidden">Cuéntanos qué quieres pavimentar.</span>
                <span className="hidden md:inline">Cuéntanos qué quieres pavimentar y te llamamos.</span>
              </h1>
              <a
                href={nap.telefonoHref}
                className="md:hidden flex justify-between items-center px-5 py-4 bg-tinta text-sobre-tinta no-underline"
              >
                <span className="text-14">¿Prefieres hablar?</span>
                <span className="font-mono text-16 font-medium">{nap.telefono}</span>
              </a>
            </div>
            <Suspense fallback={<FormularioPresupuesto variante="completo" />}>
              <FormularioConEspacio />
            </Suspense>
          </div>

          <aside className="hidden md:flex flex-col gap-3 sticky top-[calc(var(--cabecera-actual)+24px)]">
            <a href={nap.telefonoHref} className="flex flex-col gap-2 p-6 bg-tinta text-sobre-tinta no-underline">
              <span className="font-mono text-d-10 tracking-[0.14em] uppercase text-sobre-tinta/60">Si prefieres hablar</span>
              <span className="font-display font-bold text-34 leading-none">{nap.telefono}</span>
              <span className="text-14 text-sobre-tinta/70">
                {nap.gestor} · {nap.nombre}
              </span>
            </a>
            <div className="flex flex-col gap-2 p-6 border border-tinta">
              <span className="font-mono text-d-10 tracking-[0.14em] uppercase text-tinta-media">WhatsApp</span>
              <span className="text-16 font-semibold">Escríbenos una foto del espacio</span>
              {nap.whatsappHref ? (
                <a href={nap.whatsappHref} className="font-mono text-d-12 text-tinta">
                  {nap.whatsapp}
                </a>
              ) : (
                <DatoPendiente>pendiente · número por confirmar</DatoPendiente>
              )}
            </div>
            <EtiquetaTecnica
              titulo="Con qué cuentas"
              lineas={[
                claims.anios,
                '10 años de garantía · con mantenimiento',
                claims.repiten,
                <span key="prov" className="opacity-70">
                  {claims.provincias.length} provincias · [por confirmar]
                </span>,
              ]}
            />
            <address className="not-italic px-6 py-5 text-14 text-tinta-media">
              {nap.direccionCompleta}
              <br />
              <a href={`mailto:${nap.email}`} className="text-tinta-media">
                {nap.email}
              </a>
            </address>
          </aside>

          <div className="md:hidden flex flex-col gap-6">
            <EtiquetaTecnica
              compacto
              titulo="Con qué cuentas"
              lineas={[
                claims.anios,
                '10 años de garantía',
                'Más del 30 % repiten',
                nap.whatsappHref ? (
                  <a key="wa" href={nap.whatsappHref} className="text-tinta">
                    WhatsApp
                  </a>
                ) : (
                  <span key="wa" className="opacity-70">
                    WhatsApp · [pendiente]
                  </span>
                ),
              ]}
            />
          </div>
        </div>
      </section>
    </>
  )
}
