import Link from 'next/link'
import { getServices } from '@site/content'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Seccion from '@/components/ui/Seccion'

export default function SeccionServicios() {
  const servicios = getServices('es')

  return (
    <Seccion id="servicios" className="bg-fondo-alt" interior="flex flex-col gap-5 md:gap-10">
      <div className="flex flex-col gap-3 md:gap-4">
        <AntetituloSeccion>Lo que hacemos</AntetituloSeccion>
        <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">Servicios</h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {servicios.map((servicio) => (
          <Link
            key={servicio.id}
            href={`/${servicio.slug}/`}
            className={`flex flex-col h-full gap-4 p-6 no-underline text-tinta transition-colors duration-cabecera group ${
              servicio.flagship
                ? 'bg-fondo border-2 border-tinta hover:bg-pigmento hover:text-sobre-tinta'
                : 'bg-fondo border border-tinta/[.25] hover:border-pigmento hover:text-pigmento'
            }`}
          >
            <div className="font-display font-bold text-20 leading-[1.2] group-hover:inherit">
              {servicio.name}
            </div>
            <p className="text-14 text-tinta-media leading-[1.5] flex-1 group-hover:text-inherit">
              {servicio.summary}
            </p>
            <span className="text-14 font-bold self-start mt-auto group-hover:inherit">
              Ver servicio →
            </span>
          </Link>
        ))}
      </div>
    </Seccion>
  )
}
