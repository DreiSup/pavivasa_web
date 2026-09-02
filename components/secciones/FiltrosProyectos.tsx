'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Proyecto, ServicioId } from '@/lib/tipos'
import { ORDEN_SERVICIOS, TECNICA_CORTA } from '@/lib/tipos'
import Chip from '../ui/Chip'
import Boton from '../ui/Boton'
import EstadoVacio from '../ui/EstadoVacio'
import TarjetaProyecto from '../contenido/TarjetaProyecto'

type Filtros = { tecnica?: ServicioId; municipio?: string; anio?: string }

const claseSelect =
  'selector-chip appearance-none inline-flex items-center min-h-tactil pl-4 pr-9 border border-tinta bg-fondo font-sans text-14 font-semibold text-tinta cursor-pointer hover:bg-tinta hover:text-sobre-tinta'

function Rotulo({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono text-d-10 tracking-[0.12em] uppercase text-tinta-media ${className}`}>{children}</span>
}

/**
 * Índice de obras con filtros por técnica, municipio y año, en la URL (?tecnica=&municipio=&anio=).
 * Escritorio: fila de chips fija. Móvil: botón "Filtrar" que abre una hoja inferior.
 */
export default function FiltrosProyectos({ proyectos }: { proyectos: Proyecto[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [hojaAbierta, setHojaAbierta] = useState(false)
  const hojaRef = useRef<HTMLDivElement>(null)

  const filtros: Filtros = {
    tecnica: (params.get('tecnica') as ServicioId | null) ?? undefined,
    municipio: params.get('municipio') ?? undefined,
    anio: params.get('anio') ?? undefined,
  }

  const aplicar = useCallback(
    (nuevos: Filtros) => {
      const p = new URLSearchParams()
      if (nuevos.tecnica) p.set('tecnica', nuevos.tecnica)
      if (nuevos.municipio) p.set('municipio', nuevos.municipio)
      if (nuevos.anio) p.set('anio', nuevos.anio)
      const q = p.toString()
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
    },
    [router, pathname],
  )

  const cuentaTecnica = useMemo(() => {
    const m = new Map<ServicioId, number>()
    proyectos.forEach((p) => m.set(p.servicio, (m.get(p.servicio) ?? 0) + 1))
    return m
  }, [proyectos])

  const municipios = useMemo(() => Array.from(new Set(proyectos.map((p) => p.municipio))), [proyectos])
  const anios = useMemo(
    () =>
      Array.from(new Set(proyectos.map((p) => p.anioFoto).filter((a): a is number => Boolean(a)))).sort((a, b) => a - b),
    [proyectos],
  )

  const filtrados = proyectos.filter(
    (p) =>
      (!filtros.tecnica || p.servicio === filtros.tecnica) &&
      (!filtros.municipio || p.municipio === filtros.municipio) &&
      (!filtros.anio || String(p.anioFoto) === filtros.anio),
  )
  const activos = [filtros.tecnica, filtros.municipio, filtros.anio].filter(Boolean).length
  const cuenta = `${filtrados.length} ${filtrados.length === 1 ? 'obra' : 'obras'}`

  useEffect(() => {
    if (!hojaAbierta) return
    document.body.style.overflow = 'hidden'
    hojaRef.current?.querySelector<HTMLElement>('button')?.focus()
    const onTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHojaAbierta(false)
    }
    document.addEventListener('keydown', onTecla)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onTecla)
    }
  }, [hojaAbierta])

  const tituloVacio = filtros.tecnica
    ? `Sin obras de ${TECNICA_CORTA[filtros.tecnica].toLowerCase()}${filtros.municipio ? ` en ${filtros.municipio}` : ''}`
    : 'Sin obras con esos filtros'

  /** En la barra de escritorio solo las técnicas con obra; en la hoja móvil, todas (las sin obra, atenuadas). */
  const chipsTecnica = (conSinObra: boolean) => (
    <>
      <Chip activo={!filtros.tecnica} onClick={() => aplicar({ ...filtros, tecnica: undefined })}>
        Todas · {proyectos.length}
      </Chip>
      {ORDEN_SERVICIOS.map((id) => {
        const n = cuentaTecnica.get(id) ?? 0
        if (n === 0 && !conSinObra) return null
        return (
          <Chip
            key={id}
            activo={filtros.tecnica === id}
            sinObra={n === 0}
            onClick={() => aplicar({ ...filtros, tecnica: id })}
          >
            {TECNICA_CORTA[id]} · {n === 0 ? 'sin obra' : n}
          </Chip>
        )
      })}
    </>
  )

  return (
    <>
      {/* Escritorio: barra fija de chips */}
      <div className="hidden md:block sticky top-[var(--cabecera-actual)] z-20 bg-fondo border-t border-tinta border-b border-b-tinta/[.12] px-lat-desktop">
        <div className="max-w-contenido mx-auto flex flex-wrap items-center gap-2 py-4">
          <Rotulo className="mr-2">Técnica</Rotulo>
          {chipsTecnica(false)}
          <span aria-hidden="true" className="w-px h-7 bg-tinta/20 mx-3" />
          <Rotulo className="mr-2">Municipio</Rotulo>
          <label className="contents">
            <span className="sr-only">Municipio</span>
            <select
              value={filtros.municipio ?? ''}
              onChange={(e) => aplicar({ ...filtros, municipio: e.target.value || undefined })}
              className={claseSelect}
            >
              <option value="">Todos</option>
              {municipios.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <Rotulo className="ml-4 mr-2">Año</Rotulo>
          <label className="contents">
            <span className="sr-only">Año de la foto</span>
            <select
              value={filtros.anio ?? ''}
              onChange={(e) => aplicar({ ...filtros, anio: e.target.value || undefined })}
              className={claseSelect}
            >
              <option value="">{anios.length ? `${anios[0]}–${anios[anios.length - 1]}` : 'Todos'}</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <span className="ml-auto font-mono text-d-12 uppercase text-tinta-media" aria-live="polite">
            {cuenta}
          </span>
        </div>
      </div>

      {/* Móvil: botón Filtrar */}
      <div className="md:hidden flex justify-between items-center px-lat-movil py-3 border-t border-tinta border-b border-b-tinta/[.12]">
        <Chip activo={activos > 0} onClick={() => setHojaAbierta(true)} aria-haspopup="dialog" aria-expanded={hojaAbierta}>
          Filtrar{activos > 0 ? ` · ${activos}` : ''}
          <span aria-hidden="true" className="font-mono text-d-12 normal-case tracking-normal">
            ≡
          </span>
        </Chip>
        <span className="font-mono text-d-12 uppercase text-tinta-media" aria-live="polite">
          {cuenta}
        </span>
      </div>

      {hojaAbierta ? (
        <div className="md:hidden fixed inset-0 z-40 bg-tinta/50 flex flex-col justify-end pt-10" onClick={() => setHojaAbierta(false)}>
          <div
            ref={hojaRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filtrar obras"
            onClick={(e) => e.stopPropagation()}
            className="bg-fondo px-lat-movil pt-5 pb-6 flex flex-col gap-5 max-h-full overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-26">Filtrar</span>
              <button
                type="button"
                aria-label="Cerrar filtros"
                onClick={() => setHojaAbierta(false)}
                className="w-11 h-11 bg-transparent border-0 text-26 leading-none cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Rotulo>Técnica</Rotulo>
              <div className="flex flex-wrap gap-2">{chipsTecnica(true)}</div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Rotulo>Municipio</Rotulo>
              <div className="flex flex-wrap gap-2">
                <Chip activo={!filtros.municipio} onClick={() => aplicar({ ...filtros, municipio: undefined })}>
                  Todos
                </Chip>
                {municipios.map((m) => (
                  <Chip key={m} activo={filtros.municipio === m} onClick={() => aplicar({ ...filtros, municipio: m })}>
                    {m}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Rotulo>Año</Rotulo>
              <div className="flex flex-wrap gap-2">
                <Chip activo={!filtros.anio} onClick={() => aplicar({ ...filtros, anio: undefined })}>
                  Todos
                </Chip>
                {anios.map((a) => (
                  <Chip key={a} activo={filtros.anio === String(a)} onClick={() => aplicar({ ...filtros, anio: String(a) })}>
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Boton variante="contorno" type="button" onClick={() => aplicar({})}>
                Quitar filtros
              </Boton>
              <Boton variante="tinta" type="button" onClick={() => setHojaAbierta(false)}>
                Ver {cuenta}
              </Boton>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rejilla */}
      <section aria-label="Obras" className="px-lat-movil md:px-lat-desktop pt-6 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-contenido mx-auto">
          {filtrados.length === 0 ? (
            <div className="md:max-w-[640px]">
              <EstadoVacio titulo={tituloVacio} onAccion={() => aplicar({})} />
            </div>
          ) : (
            <ul className="list-none m-0 p-0 flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10">
              {filtrados.map((p) => (
                <li key={p.slug}>
                  <TarjetaProyecto proyecto={p} tamano="grande" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
