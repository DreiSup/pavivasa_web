import Image from 'next/image'
import { getHome } from '@site/content'
import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import BloquePosicion from '@/components/contenido/BloquePosicion'
import Seccion from '@/components/ui/Seccion'

export default function SeccionEspacios() {
  const { spaces } = getHome('es')

  return (
    <Seccion interior="flex flex-col gap-6 md:gap-10">
      <div className="flex flex-col gap-3 md:gap-4">
        <AntetituloSeccion>¿Por dónde empezamos?</AntetituloSeccion>
        <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">¿Qué quieres pavimentar?</h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {spaces.map((space) => (
          <a
            key={space.name}
            href="#formulario"
            className="relative block aspect-[4/3] overflow-hidden group no-underline"
          >
            {space.image.src ? (
              <Image
                src={space.image.src}
                alt={space.image.alt ?? ''}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-fondo-alt bg-trama flex items-center justify-center">
                <span className="font-mono text-[11px] leading-[1.6] tracking-[0.06em] uppercase text-center text-tinta-media px-5">
                  {space.image.label}
                </span>
              </div>
            )}

            {/* Gradiente inferior */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,29,24,0)_45%,rgba(33,29,24,.85)_100%)]" />

            {/* Nombre */}
            <span className="absolute left-4 right-4 bottom-[14px] text-sobre-tinta font-bold text-16 md:text-16 group-hover:text-pigmento transition-colors duration-cabecera">
              {space.name}
            </span>
          </a>
        ))}
      </div>
    </Seccion>
  )
}
