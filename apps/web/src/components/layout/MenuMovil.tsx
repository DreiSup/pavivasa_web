'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface Enlace {
  href: string
  texto: string
}

/** Panel bajo la cabecera: panel no-modal de navegación móvil. Escape cierra. */
export default function MenuMovil({
  id,
  isOpen,
  onCerrar,
  navegacion,
}: {
  id: string
  isOpen: boolean
  onCerrar: () => void
  navegacion: Enlace[]
}) {
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onCerrar])

  return (
    <nav
      id={id}
      aria-label="Menú móvil"
      className={`md:hidden flex flex-col border-t border-tinta/[.14] ${isOpen ? 'flex' : 'hidden'}`}
    >
      {navegacion.map((enlace) => (
        <Link
          key={enlace.href}
          href={enlace.href}
          onClick={onCerrar}
          className="py-[14px] px-5 font-sans text-16 font-semibold text-tinta no-underline border-b border-tinta/10 hover:bg-fondo-alt"
        >
          {enlace.texto}
        </Link>
      ))}
    </nav>
  )
}
