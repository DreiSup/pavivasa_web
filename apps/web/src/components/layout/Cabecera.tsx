'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { nap } from '@/lib/config'
import MenuMovil from './MenuMovil'
import { Logo } from './Logo'

/** Navegación principal: Empresa · Servicios · Proyectos · Contacto */
const navegacion = [
  { href: '/empresa/', texto: 'Empresa' },
  { href: '/#servicios', texto: 'Servicios' },
  { href: '/proyectos/', texto: 'Proyectos' },
  { href: '/presupuesto/', texto: 'Contacto' },
]

/**
 * Cabecera: logo, nav (Empresa · Servicios · Proyectos · Contacto),
 * teléfono y botón "Presupuesto". Se compacta al hacer scroll (72 → 56 px).
 * En móvil: logo, botón "Presupuesto" y menú (60 px).
 */
export default function Cabecera() {
  const pathname = usePathname()
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

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
  }, [pathname])

  function cerrarMenu() {
    setMenuAbierto(false)
    burgerRef.current?.focus()
  }

  const enlaceNav = 'inline-flex items-center min-h-tactil font-sans text-14 font-semibold no-underline border-b-2 transition-colors duration-cabecera hover:text-pigmento motion-reduce:transition-none'

  return (
    <header
      className={`sticky top-0 z-30 bg-fondo border-b border-tinta/[.14] transition-[height] duration-cabecera ease-out flex flex-col h-cabecera-movil ${
        conScroll ? 'md:h-cabecera-scroll' : 'md:h-cabecera'
      }`}
    >
      <div className="flex items-center justify-between w-full h-cabecera-movil md:h-auto px-5 shrink-0 motion-reduce:transition-none">
        <Link href="/" className="no-underline text-tinta shrink-0" aria-label={`${nap.nombre}, inicio`}>
          <Logo tamano="grande" />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7 list-none m-0 p-0 whitespace-nowrap">
            {navegacion.map((enlace) => {
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

        <div className="hidden md:flex items-center gap-7 justify-self-end shrink-0">
          <a href={nap.telefonoHref} className="font-sans text-14 font-bold text-tinta no-underline hover:text-pigmento">
            {nap.telefono}
          </a>
        </div>

        <Link
          href="/presupuesto/"
          className="h-11 px-[22px] bg-pigmento hover:bg-pigmento-hover text-sobre-tinta text-14 font-bold uppercase tracking-[.03em] inline-flex items-center no-underline whitespace-nowrap motion-reduce:transition-none shrink-0"
        >
          Presupuesto
        </Link>

        <button
          ref={burgerRef}
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          onClick={() => setMenuAbierto((v) => !v)}
          className="inline-flex flex-col justify-center gap-[5px] w-11 h-11 bg-transparent border border-tinta/30 cursor-pointer md:hidden shrink-0"
        >
          <span className="block w-5 h-[2px] bg-tinta" />
          <span className="block w-5 h-[2px] bg-tinta" />
        </button>
      </div>

      <MenuMovil id="menu-movil" isOpen={menuAbierto} onCerrar={cerrarMenu} />
    </header>
  )
}
