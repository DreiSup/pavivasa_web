'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { nap } from '@/lib/config'
import { NOMBRE_SERVICIO, ORDEN_SERVICIOS, RUTA_SERVICIO } from '@/lib/tipos'
import Boton from '../ui/Boton'
import MenuMovil from './MenuMovil'
import { Logo } from './Logo'

/** Navegación principal. Un solo sitio para cambiarla: aquí. */
export const enlaces = [
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/empresa/', texto: 'Empresa' },
  { href: '/blog/', texto: 'Blog' },
]

export const enlacesServicios = ORDEN_SERVICIOS.map((id, i) => ({
  href: RUTA_SERVICIO[id],
  texto: NOMBRE_SERVICIO[id],
  numero: String(i + 1).padStart(2, '0'),
}))

/**
 * Cabecera: logo, Servicios (desplegable con los 7), Proyectos, Empresa, Blog,
 * teléfono y "Pedir presupuesto". Se compacta al hacer scroll (72 → 56 px).
 * En móvil: logo, teléfono y botón de menú (60 px).
 */
export default function Cabecera() {
  const pathname = usePathname()
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [serviciosAbierto, setServiciosAbierto] = useState(false)
  const serviciosRef = useRef<HTMLLIElement>(null)
  const cierreRef = useRef<number>(undefined)

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const movil = window.matchMedia('(max-width: 767px)').matches
    document.documentElement.style.setProperty('--cabecera-actual', movil ? '60px' : conScroll ? '56px' : '72px')
  }, [conScroll])

  useEffect(() => {
    setMenuAbierto(false)
    setServiciosAbierto(false)
  }, [pathname])

  useEffect(() => {
    if (!serviciosAbierto) return
    function onDocumento(e: MouseEvent | FocusEvent) {
      if (!serviciosRef.current?.contains(e.target as Node)) setServiciosAbierto(false)
    }
    function onTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') setServiciosAbierto(false)
    }
    document.addEventListener('mousedown', onDocumento)
    document.addEventListener('focusin', onDocumento)
    document.addEventListener('keydown', onTecla)
    return () => {
      document.removeEventListener('mousedown', onDocumento)
      document.removeEventListener('focusin', onDocumento)
      document.removeEventListener('keydown', onTecla)
    }
  }, [serviciosAbierto])

  function abrirServicios() {
    window.clearTimeout(cierreRef.current)
    setServiciosAbierto(true)
  }
  function cerrarServiciosConRetardo() {
    cierreRef.current = window.setTimeout(() => setServiciosAbierto(false), 120)
  }

  const enServicio = enlacesServicios.some((s) => pathname === s.href)
  const enlaceNav = 'inline-flex items-center min-h-tactil font-sans text-16 font-semibold no-underline border-b-2 transition-colors duration-cabecera hover:text-pigmento'

  return (
    <header
      className={`sticky top-0 z-30 bg-fondo border-b border-tinta/[.12] transition-[height] duration-cabecera ease-out flex items-center h-cabecera-movil ${
        conScroll ? 'md:h-cabecera-scroll' : 'md:h-cabecera'
      } px-2 pl-lat-movil md:px-lat-desktop`}
    >
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center w-full max-w-contenido mx-auto">
        <Link href="/" className="no-underline text-tinta justify-self-start" aria-label={`${nap.nombre}, inicio`}>
          <Logo tamano={conScroll ? 'medio' : 'grande'} className="hidden md:block" />
          <Logo tamano="pequeno" className="md:hidden" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-9 list-none m-0 p-0">
            <li
              ref={serviciosRef}
              className="relative"
              onMouseEnter={abrirServicios}
              onMouseLeave={cerrarServiciosConRetardo}
            >
              <button
                type="button"
                aria-expanded={serviciosAbierto}
                aria-controls="menu-servicios"
                onClick={() => setServiciosAbierto((v) => !v)}
                className={`${enlaceNav} gap-2 bg-transparent p-0 cursor-pointer ${
                  enServicio ? 'border-pigmento' : 'border-transparent'
                }`}
              >
                Servicios
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={serviciosAbierto ? 'rotate-180' : ''}>
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <ul
                id="menu-servicios"
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[300px] list-none m-0 p-2 bg-fondo border border-tinta flex-col ${
                  serviciosAbierto ? 'flex' : 'hidden'
                }`}
              >
                {enlacesServicios.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      aria-current={pathname === s.href ? 'page' : undefined}
                      className={`flex items-center gap-3 min-h-tactil px-3 no-underline text-16 hover:bg-fondo-alt ${
                        pathname === s.href ? 'font-semibold text-pigmento' : 'font-medium text-tinta'
                      }`}
                    >
                      <span className="font-mono text-d-10 text-tinta-media">{s.numero}</span>
                      {s.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {enlaces.map((enlace) => {
              const activo = pathname?.startsWith(enlace.href)
              return (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    aria-current={activo ? 'page' : undefined}
                    className={`${enlaceNav} text-tinta ${activo ? 'border-pigmento' : 'border-transparent'}`}
                  >
                    {enlace.texto}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-7 justify-self-end">
          <a href={nap.telefonoHref} className="font-mono text-d-14 font-medium text-tinta no-underline hover:text-pigmento">
            {nap.telefono}
          </a>
          <Boton
            variante="tinta"
            href="/presupuesto/"
            className={conScroll ? '!min-h-[36px] !px-[14px] !text-14' : '!min-h-tactil !px-5'}
          >
            Pedir presupuesto
          </Boton>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <a
            href={nap.telefonoHref}
            className="inline-flex items-center min-h-tactil px-3 font-mono text-d-12 font-medium text-tinta no-underline"
          >
            {nap.telefono}
          </a>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
            className="inline-flex flex-col justify-center gap-[5px] w-11 h-11 px-[11px] bg-transparent border-0 cursor-pointer"
          >
            <span className="block h-[2px] bg-tinta" />
            <span className="block h-[2px] bg-tinta" />
            <span className="block h-[2px] bg-tinta" />
          </button>
        </div>
      </div>

      {menuAbierto ? <MenuMovil onCerrar={() => setMenuAbierto(false)} /> : null}
    </header>
  )
}
