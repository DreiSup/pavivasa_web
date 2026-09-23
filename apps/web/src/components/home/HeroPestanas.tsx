'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import Boton from '@/components/ui/Boton'
import type { ResolvedHomeContent } from '@site/content'

export default function HeroPestanas({ pestanas }: { pestanas: ResolvedHomeContent['heroTabs'] }) {
  const [activa, setActiva] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const tabActual = pestanas[activa]

  // Manejador de teclado para ARIA tabs
  const manejarTeclado = (e: React.KeyboardEvent<HTMLButtonElement>, indice: number) => {
    let nuevoIndice: number | null = null

    if (e.key === 'ArrowLeft') {
      nuevoIndice = indice === 0 ? pestanas.length - 1 : indice - 1
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      nuevoIndice = indice === pestanas.length - 1 ? 0 : indice + 1
      e.preventDefault()
    } else if (e.key === 'Home') {
      nuevoIndice = 0
      e.preventDefault()
    } else if (e.key === 'End') {
      nuevoIndice = pestanas.length - 1
      e.preventDefault()
    }

    if (nuevoIndice !== null) {
      setActiva(nuevoIndice)
      tabsRef.current[nuevoIndice]?.focus()
    }
  }

  return (
    <section className="relative overflow-hidden flex flex-col justify-end min-h-[clamp(480px,64vw,620px)] text-sobre-tinta">
      {/* Imagen del tab activo */}
      {tabActual.image?.src ? (
        <Image
          src={tabActual.image.src}
          alt={tabActual.image.alt ?? ''}
          fill
          className="absolute inset-0 object-cover"
          sizes="100vw"
          priority={activa === 0}
        />
      ) : null}

      {/* Gradiente oscuro */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(33,29,24,.9)_0%,rgba(33,29,24,.62)_45%,rgba(33,29,24,.22)_100%)] z-[1]" />

      {/* Contenido */}
      <div className="relative z-[2] max-w-[1280px] mx-auto w-full px-[20px] pb-0 md:pt-[72px] md:pb-4">
        <div className="flex flex-col gap-[10px] md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-[10px] md:gap-3">
            <span className="font-mono text-14 md:text-d-14 uppercase font-bold tracking-[0.1em] text-sobre-tinta">
              {tabActual.eyebrow}
            </span>
            <span className="font-mono text-12 tracking-[0.08em] text-sobre-tinta/65">Expertos en pavimentos de hormigón</span>
          </div>

          <h1 className="font-display font-extrabold text-46 md:text-64 leading-[0.98] md:leading-[0.95] text-balance max-w-[16ch] md:max-w-none">
            {tabActual.title}
          </h1>

          <p className="text-16 md:text-20 text-sobre-tinta/92 leading-[1.4] max-w-[52ch]">{tabActual.subtitle}</p>

          <div className="flex flex-col md:flex-row gap-[10px] md:gap-3 mb-2 md:mb-0">
            <Boton variante="primario" tamaño="lg" href="#formulario" sobreOscuro>
              Pedir presupuesto
            </Boton>
            <Boton variante="contorno" tamaño="lg" href="/proyectos/" sobreOscuro>
              Ver proyectos
            </Boton>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-[2] flex border-t border-sobre-tinta/20 max-w-[1280px] mx-auto w-full px-[20px]" role="tablist">
        {pestanas.map((tab, i) => (
          <button
            key={i}
            ref={(el) => {
              if (el) tabsRef.current[i] = el
            }}
            onClick={() => setActiva(i)}
            onKeyDown={(e) => manejarTeclado(e, i)}
            role="tab"
            id={`tab-${i}`}
            aria-selected={activa === i}
            aria-controls={`panel-${i}`}
            tabIndex={activa === i ? 0 : -1}
            className={`flex-1 min-h-[44px] py-3 md:py-[14px] px-2 md:px-2 font-sans font-bold text-14 uppercase tracking-[0.02em] transition-colors duration-cabecera text-center md:text-left ${
              activa === i
                ? 'border-t-2 border-pigmento text-sobre-tinta'
                : 'border-t-2 border-transparent text-sobre-tinta/65 hover:text-sobre-tinta'
            }`}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>
    </section>
  )
}
