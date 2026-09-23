import type { ReactNode } from 'react'

/**
 * Dato sin confirmar por el cliente (horario, WhatsApp, m², año…). Se pinta
 * entre corchetes, en cursiva y atenuado. Hereda el font de su contexto.
 * Al llegar el dato real, se sustituye la llamada por el valor literal.
 */
export default function DatoPendiente({
  children,
  sobreOscuro,
  pequeno,
  className = '',
}: {
  children: ReactNode
  /** Sobre fondo tinta: hereda el color y baja opacidad a 75%. */
  sobreOscuro?: boolean
  /** 10 px, el suelo de la mono (etiquetas y barras compactas). */
  pequeno?: boolean
  className?: string
}) {
  return (
    <span
      className={`italic ${pequeno ? 'text-d-10' : ''} ${
        sobreOscuro ? 'opacity-75' : 'text-tinta-media opacity-70'
      } ${className}`}
    >
      [{children}]
    </span>
  )
}
