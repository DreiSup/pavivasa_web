'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { nap } from '@/lib/config'
import { NOMBRE_SERVICIO, RUTA_SERVICIO } from '@/lib/tipos'
import Boton from '../ui/Boton'
import { Logo } from './Logo'

const principales = ['hormigon-impreso', 'hormigon-pulido', 'hormigon-lavado', 'microcemento'] as const
const secundarios = [
  { id: 'autonivelantes', texto: 'Autonivelantes' },
  { id: 'pavimentos-de-caucho', texto: 'Caucho' },
  { id: 'alicatados', texto: 'Alicatados' },
] as const

/** Panel a pantalla completa sobre fondo tinta. Foco atrapado, Escape cierra. */
export default function MenuMovil({ onCerrar }: { onCerrar: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focables = panelRef.current.querySelectorAll<HTMLElement>('a, button')
      if (focables.length === 0) return
      const primero = focables[0]
      const ultimo = focables[focables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onCerrar])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-40 bg-tinta text-sobre-tinta flex flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between h-cabecera-movil pl-lat-movil pr-2 border-b border-sobre-tinta/[.16] shrink-0">
        <Logo tamano="pequeno" />
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="inline-flex items-center justify-center w-11 h-11 bg-transparent border-0 text-sobre-tinta cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <nav aria-label="Menú móvil" className="flex flex-col px-lat-movil pt-6">
        <span className="font-mono text-d-10 tracking-[0.12em] uppercase text-sobre-tinta/60 mb-3">Servicios</span>
        {principales.map((id) => (
          <Link
            key={id}
            href={RUTA_SERVICIO[id]}
            onClick={onCerrar}
            className="font-display font-bold text-26 leading-[1.15] py-[9px] text-sobre-tinta no-underline"
          >
            {id === 'microcemento' ? 'Microcemento' : NOMBRE_SERVICIO[id]}
          </Link>
        ))}
        <div className="flex flex-wrap gap-x-5 gap-y-1 pt-2 pb-5 text-16">
          {secundarios.map((s) => (
            <Link key={s.id} href={RUTA_SERVICIO[s.id]} onClick={onCerrar} className="py-[6px] text-sobre-tinta/70 no-underline">
              {s.texto}
            </Link>
          ))}
        </div>
        <div className="flex flex-col border-t border-sobre-tinta/[.16] pt-4">
          {[
            { href: '/proyectos/', texto: 'Proyectos' },
            { href: '/empresa/', texto: 'Empresa' },
            { href: '/blog/', texto: 'Blog' },
          ].map((e) => (
            <Link key={e.href} href={e.href} onClick={onCerrar} className="text-20 font-semibold py-[10px] text-sobre-tinta no-underline">
              {e.texto}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto p-lat-movil flex flex-col gap-3">
        <Boton variante="primario" href="/presupuesto/" anchoCompleto onClick={onCerrar}>
          Pedir presupuesto
        </Boton>
        <Boton variante="contorno" sobreOscuro href={nap.telefonoHref} anchoCompleto>
          Llamar · {nap.telefono}
        </Boton>
      </div>
    </div>
  )
}
