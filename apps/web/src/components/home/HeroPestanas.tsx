'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Boton from '@/components/ui/Boton'
import type { ResolvedHomeContent } from '@site/content'

/** Duración del fundido entre fotos. Igual que `duration-fundido` en tailwind.config.ts. */
const FUNDIDO_MS = 1200

/**
 * Hero con pestañas y carrusel automático. Cada foto hace un zoom lento (`animate-zoom-lento-*`,
 * 7 s); cuando esa animación termina, pasa a la siguiente con un fundido. El cambio lo dispara
 * el final de la animación CSS y no un temporizador de JS: así el zoom y el cambio van siempre
 * a la vez, y el botón de pausa (`animation-play-state`) congela las dos cosas sin que se
 * descuadren. Con `prefers-reduced-motion` no hay zoom ni cambio automático ni botón.
 */
export default function HeroPestanas({ pestanas }: { pestanas: ResolvedHomeContent['heroTabs'] }) {
  const [activa, setActiva] = useState(0)
  /** Fotos que acaban de salir: siguen opacas y con su zoom bajo la nueva hasta que esta termina de entrar. */
  const [saliendo, setSaliendo] = useState<number[]>([])
  /** Veces que se ha activado cada foto. Su paridad elige `zoom-lento-a` o `-b`: cambiar de nombre reinicia el zoom. */
  const [ciclos, setCiclos] = useState<number[]>(() => pestanas.map(() => 0))
  const [pausado, setPausado] = useState(false)
  const activaRef = useRef(0)
  const salidas = useRef<Record<number, number>>({})
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const automatico = pestanas.length > 1

  useEffect(() => {
    const temporizadores = salidas.current
    return () => Object.values(temporizadores).forEach((t) => window.clearTimeout(t))
  }, [])

  function irA(nuevo: number) {
    const previa = activaRef.current
    if (nuevo === previa) return
    activaRef.current = nuevo
    setActiva(nuevo)
    setCiclos((c) => c.map((v, k) => (k === nuevo ? v + 1 : v)))
    setSaliendo((s) => [...s.filter((i) => i !== nuevo && i !== previa), previa])
    // Un temporizador por foto: si vuelve a salir antes de que acabe el anterior, se sustituye.
    window.clearTimeout(salidas.current[nuevo])
    window.clearTimeout(salidas.current[previa])
    salidas.current[previa] = window.setTimeout(
      () => setSaliendo((s) => s.filter((i) => i !== previa)),
      FUNDIDO_MS,
    )
  }

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
      irA(nuevoIndice)
      tabsRef.current[nuevoIndice]?.focus()
    }
  }

  return (
    <section className="relative overflow-hidden flex flex-col justify-end min-h-[clamp(480px,64vw,620px)] text-sobre-tinta">
      {/* Fotos apiladas. La nueva entra con fundido por encima de la anterior, que sigue opaca debajo
          hasta que acaba de salir: así no hay ningún instante en que se transparente el fondo. */}
      <div className="absolute inset-0 z-0 isolate overflow-clip">
        {pestanas.map((tab, i) => {
          if (!tab.image?.src) return null
          const esActiva = activa === i
          const visible = esActiva || saliendo.includes(i)
          return (
            <div
              key={i}
              aria-hidden={!esActiva}
              onAnimationEnd={(e) => {
                if (!automatico || e.target !== e.currentTarget || i !== activaRef.current) return
                irA((i + 1) % pestanas.length)
              }}
              className={`absolute inset-0 transition-opacity duration-fundido ease-in-out ${
                visible ? 'opacity-100' : 'opacity-0'
              } ${esActiva ? 'z-10' : 'z-0'} ${
                visible
                  ? `${ciclos[i] % 2 === 0 ? 'animate-zoom-lento-a' : 'animate-zoom-lento-b'} motion-reduce:animate-none will-change-transform`
                  : ''
              } ${pausado ? '[animation-play-state:paused]' : ''}`}
            >
              <Image
                src={tab.image.src}
                alt={esActiva ? (tab.image.alt ?? '') : ''}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          )
        })}
      </div>

      {/* Gradiente oscuro */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(33,29,24,.9)_0%,rgba(33,29,24,.62)_45%,rgba(33,29,24,.22)_100%)] z-[1]" />

      {/* Pausa del cambio automático, arriba a la derecha: en la fila de pestañas no cabe en móvil estrecho */}
      {automatico ? (
        <div className="absolute inset-x-0 top-4 md:top-6 z-[3] pointer-events-none">
          <div className="max-w-[1280px] mx-auto w-full px-[20px] flex justify-end">
            <button
              type="button"
              onClick={() => setPausado((p) => !p)}
              aria-label={
                pausado ? 'Reanudar el cambio automático de imágenes' : 'Pausar el cambio automático de imágenes'
              }
              className="pointer-events-auto inline-flex items-center justify-center w-11 h-11 bg-tinta/70 border border-sobre-tinta/40 text-sobre-tinta transition-colors duration-cabecera hover:bg-sobre-tinta hover:text-tinta focus-visible:outline-sobre-tinta motion-reduce:hidden"
            >
              {pausado ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                  <path d="M3 1.5v13l11-6.5z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                  <path d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* Contenido */}
      <div
        role="tabpanel"
        id="hero-panel"
        aria-labelledby={`tab-${activa}`}
        className="relative z-[2] max-w-[1280px] mx-auto w-full px-[20px] pb-0 md:pt-[72px] md:pb-4"
      >
        <div className="flex flex-col gap-[10px] md:gap-4 mb-4 md:mb-6">
          {/* Los tres textos van apilados en la misma celda: la altura es la del más largo y no hay
              salto de layout al cambiar de foto. Solo el activo es visible y lleva el <h1>. */}
          <div className="grid">
            {pestanas.map((tab, i) => {
              const activo = i === activa
              const Titulo = activo ? 'h1' : 'p'
              return (
                <div
                  key={i}
                  aria-hidden={!activo}
                  className={`col-start-1 row-start-1 flex flex-col gap-[10px] md:gap-4 ${activo ? '' : 'invisible'}`}
                >
                  <div className="flex items-center gap-[10px] md:gap-3">
                    <span className="font-mono text-14 md:text-d-14 uppercase font-bold tracking-[0.1em] text-sobre-tinta">
                      {tab.eyebrow}
                    </span>
                    <span className="font-mono text-12 tracking-[0.08em] text-sobre-tinta/65">
                      Expertos en pavimentos de hormigón
                    </span>
                  </div>

                  <Titulo className="font-display font-extrabold text-46 md:text-64 leading-[0.98] md:leading-[0.95] text-balance max-w-[16ch]">
                    {tab.title}
                  </Titulo>

                  <p className="text-16 md:text-20 text-sobre-tinta/92 leading-[1.4] max-w-[52ch]">{tab.subtitle}</p>
                </div>
              )
            })}
          </div>

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
      <div
        role="tablist"
        aria-label="Tipo de pavimento"
        className="relative z-[2] flex border-t border-sobre-tinta/20 max-w-[1280px] mx-auto w-full px-[20px]"
      >
        {pestanas.map((tab, i) => (
          <button
            key={i}
            ref={(el) => {
              if (el) tabsRef.current[i] = el
            }}
            onClick={() => irA(i)}
            onKeyDown={(e) => manejarTeclado(e, i)}
            role="tab"
            id={`tab-${i}`}
            aria-selected={activa === i}
            aria-controls="hero-panel"
            tabIndex={activa === i ? 0 : -1}
            className={`flex-1 min-h-[44px] py-3 md:py-[14px] px-1 md:px-2 font-sans font-bold text-14 uppercase tracking-[0.02em] transition-colors duration-cabecera text-center md:text-left ${
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
