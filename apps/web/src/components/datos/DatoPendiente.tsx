import type { ReactNode } from 'react'

/**
 * Dato sin confirmar por el cliente (horario, WhatsApp, m², año…). Se pinta
 * entre corchetes, en mono, versalitas y atenuado. Nunca se maquilla.
 * Al llegar el dato real, se sustituye la llamada por el valor literal.
 */
export default function DatoPendiente({
  children,
  sobreOscuro,
  pequeno,
  className = '',
}: {
  children: ReactNode
  /** Sobre fondo tinta: hereda el color y solo baja la opacidad. */
  sobreOscuro?: boolean
  /** 10 px, el suelo de la mono (etiquetas y barras compactas). */
  pequeno?: boolean
  className?: string
}) {
  return (
    <span
      className={`font-mono uppercase tracking-[0.06em] ${pequeno ? 'text-d-10' : 'text-d-12'} ${
        sobreOscuro ? 'opacity-60' : 'text-tinta-media opacity-70'
      } ${className}`}
    >
      [{children}]
    </span>
  )
}
