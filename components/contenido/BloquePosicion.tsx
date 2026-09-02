import Image from 'next/image'
import type { Imagen } from '@/lib/tipos'

/**
 * Sustituye a toda foto que aún no existe: rectángulo con trama diagonal, la
 * etiqueta de qué foto va ahí y el aviso "Pendiente · original a 2400 px".
 * Cuando llega el original (`imagen.src`), pinta la foto y desaparece la trama.
 */
export default function BloquePosicion({
  imagen,
  etiqueta,
  aviso = 'Pendiente · original a 2400 px',
  compacto,
  sinAviso,
  activo,
  prioridad,
  className = '',
}: {
  imagen?: Imagen
  /** Atajo cuando no hay objeto Imagen. */
  etiqueta?: string
  aviso?: string
  /** Etiquetas más pegadas al borde (tarjetas y miniaturas). */
  compacto?: boolean
  sinAviso?: boolean
  /** Miniatura seleccionada: borde 2 px pigmento. */
  activo?: boolean
  prioridad?: boolean
  /** Ratio y bordes: p. ej. "aspect-[4/3]". */
  className?: string
}) {
  const texto = imagen?.etiqueta ?? etiqueta
  const borde = activo ? 'border-2 border-pigmento' : 'border border-tinta/[.12]'

  if (imagen?.src) {
    return (
      <figure className={`relative overflow-hidden bg-fondo-alt ${borde} ${className}`}>
        <Image src={imagen.src} alt={imagen.alt ?? texto ?? ''} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={prioridad} />
      </figure>
    )
  }

  const pos = compacto ? 'left-[10px]' : 'left-4'
  return (
    <figure
      role="img"
      aria-label={texto ? `Foto pendiente: ${texto}` : 'Foto pendiente'}
      className={`relative bg-fondo-alt bg-trama ${borde} ${className}`}
    >
      {texto && !compacto ? (
        <span className="absolute left-4 top-[14px] font-mono text-d-10 uppercase text-tinta-media">{texto}</span>
      ) : null}
      {!sinAviso ? (
        <span
          className={`absolute ${pos} ${
            compacto ? 'bottom-2' : 'bottom-[14px]'
          } font-mono text-d-10 uppercase text-tinta bg-sobre-tinta px-[6px] py-[3px]`}
        >
          {compacto && texto ? texto : aviso}
        </span>
      ) : null}
    </figure>
  )
}
