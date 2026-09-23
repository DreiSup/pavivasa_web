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
  const borde = activo ? 'border-2 border-pigmento' : 'border border-tinta/[.2]'

  if (imagen?.src) {
    return (
      <figure className={`relative overflow-hidden bg-fondo-alt ${borde} ${className}`}>
        <Image src={imagen.src} alt={imagen.alt ?? texto ?? ''} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority={prioridad} />
      </figure>
    )
  }

  const etiquetaCompleta = compacto && texto ? texto : aviso
  return (
    <figure
      role="img"
      aria-label={texto ? `Foto pendiente: ${texto}` : 'Foto pendiente'}
      className={`relative flex items-center justify-center bg-fondo-alt bg-trama ${borde} ${className}`}
    >
      {!sinAviso ? (
        <span className="font-mono text-[11px] leading-[1.6] tracking-[0.06em] uppercase text-center text-tinta-media px-5">
          {etiquetaCompleta}
        </span>
      ) : null}
    </figure>
  )
}
