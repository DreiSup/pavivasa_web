import Link from 'next/link'
import type { Proyecto } from '@/lib/tipos'
import { TECNICA_CORTA } from '@/lib/tipos'
import BloquePosicion from './BloquePosicion'
import DatoPendiente from '../datos/DatoPendiente'

/** Línea "IMPRESO · DÉNIA · [2017]" común a tarjetas y fichas. */
export function EtiquetaProyecto({ proyecto, pequena }: { proyecto: Proyecto; pequena?: boolean }) {
  return (
    <span className={`font-mono uppercase text-tinta-media ${pequena ? 'text-d-10' : 'text-d-12'}`}>
      {TECNICA_CORTA[proyecto.servicio]} · {proyecto.municipio} ·{' '}
      <DatoPendiente pequeno={pequena}>{proyecto.anioFoto ?? 'año'}</DatoPendiente>
    </span>
  )
}

/** Tarjeta de obra: foto 4:3, etiqueta técnica, titular, tipo de espacio. */
export default function TarjetaProyecto({
  proyecto,
  tamano = 'medio',
  conFicha,
}: {
  proyecto: Proyecto
  /** grande: rejilla de 3 en escritorio · medio: rejilla de 4 · pequeno: rejilla de 2 en móvil. */
  tamano?: 'grande' | 'medio' | 'pequeno'
  /** Añade la línea de ejecución (home, obras destacadas). */
  conFicha?: boolean
}) {
  const titulo =
    tamano === 'grande' ? 'text-26' : tamano === 'medio' ? 'text-20' : 'text-16'
  const ficha = [proyecto.ficha.hormigon, proyecto.ficha.espesor, proyecto.ficha.arido && `árido ${proyecto.ficha.arido}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link
      href={`/proyectos/${proyecto.slug}/`}
      className={`group flex flex-col no-underline text-tinta ${tamano === 'pequeno' ? 'gap-2' : 'gap-3'}`}
    >
      <BloquePosicion
        imagen={proyecto.imagenes[0]}
        compacto
        sinAviso={tamano === 'pequeno'}
        aviso="Pendiente · 2400 px"
        className="aspect-[4/3]"
      />
      <EtiquetaProyecto proyecto={proyecto} pequena={tamano === 'pequeno'} />
      <span
        className={`font-display font-bold leading-[1.15] ${titulo} transition-colors duration-cabecera group-hover:text-pigmento`}
      >
        {proyecto.titulo}
      </span>
      {tamano !== 'pequeno' ? (
        <span className={`text-tinta-media ${tamano === 'grande' ? 'text-16' : 'text-14'}`}>{proyecto.tipo}</span>
      ) : null}
      {conFicha && ficha ? <span className="font-mono text-d-12 uppercase text-tinta">{ficha}</span> : null}
    </Link>
  )
}
