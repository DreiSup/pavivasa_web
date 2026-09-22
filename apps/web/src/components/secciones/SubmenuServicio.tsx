'use client'

import { useSeccionActiva } from '../ui/useSeccionActiva'

export type Ancla = { id: string; texto: string; textoMovil?: string }

/** Anclas fijas de la página de servicio. Va pegado bajo la cabecera al hacer scroll. */
export default function SubmenuServicio({ anclas }: { anclas: Ancla[] }) {
  const activa = useSeccionActiva(anclas.map((a) => a.id))

  return (
    <nav
      aria-label="Secciones del servicio"
      className="sticky z-20 top-[var(--cabecera-actual)] bg-fondo border-t border-tinta border-b border-b-tinta/[.12] px-lat-movil md:px-lat-desktop overflow-x-auto"
    >
      <ul className="max-w-contenido mx-auto flex items-center gap-5 md:gap-8 h-[var(--submenu)] list-none m-0 p-0 whitespace-nowrap">
        {anclas.map((a) => {
          const esActiva = activa === a.id
          return (
            <li key={a.id} className="h-full">
              <a
                href={`#${a.id}`}
                aria-current={esActiva ? 'location' : undefined}
                className={`flex items-center h-full font-sans text-14 font-semibold no-underline border-b-2 transition-colors duration-cabecera ${
                  esActiva ? 'text-tinta border-pigmento' : 'text-tinta-media border-transparent hover:text-tinta'
                }`}
              >
                {a.textoMovil ? (
                  <>
                    <span className="md:hidden">{a.textoMovil}</span>
                    <span className="hidden md:inline">{a.texto}</span>
                  </>
                ) : (
                  a.texto
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
