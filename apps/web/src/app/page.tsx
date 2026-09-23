import type { Metadata } from 'next'
import { getHome } from '@site/content'
import { nap } from '@/lib/config'
import HeroPestanas from '@/components/home/HeroPestanas'
import BarraConfianza from '@/components/layout/BarraConfianza'
import SeccionEspacios from '@/components/home/SeccionEspacios'
import SeccionServicios from '@/components/home/SeccionServicios'
import SeccionObras from '@/components/home/SeccionObras'
import SeccionCatalogo from '@/components/home/SeccionCatalogo'
import BandaGarantia from '@/components/home/BandaGarantia'
import SeccionPreguntas from '@/components/home/SeccionPreguntas'
import SeccionFormularioHome from '@/components/home/SeccionFormularioHome'

export const metadata: Metadata = {
  title: `${nap.nombre} · Hormigón impreso y pulido en Valencia y Alicante`,
  description:
    'Ejecutamos y conservamos toda clase de pavimentos, recubrimientos y estructuras de hormigón. Más de 15 años de oficio para particulares, empresas y profesionales del sector.',
  alternates: { canonical: '/' },
}

export default function Home() {
  const home = getHome('es')

  return (
    <>
      {/* 1. Hero con pestañas */}
      <HeroPestanas pestanas={home.heroTabs} />

      {/* 2. Barra de confianza */}
      <BarraConfianza />

      {/* 3. ¿Qué quieres pavimentar? */}
      <SeccionEspacios />

      {/* 4. Servicios */}
      <SeccionServicios />

      {/* 5. Obras destacadas */}
      <SeccionObras />

      {/* 6. Catálogo (Modelos y colores) */}
      <SeccionCatalogo />

      {/* 7. Banda de garantía */}
      <BandaGarantia />

      {/* 8. Preguntas frecuentes */}
      <SeccionPreguntas />

      {/* 9. Formulario presupuesto */}
      <SeccionFormularioHome />
    </>
  )
}
