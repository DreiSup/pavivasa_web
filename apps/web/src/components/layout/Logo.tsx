import { nap } from '@/lib/config'

/** Wordmark tipográfico hasta recibir el logo vectorial. */
export function Logo({
  tamano = 'grande',
  className = '',
}: {
  tamano?: 'grande' | 'medio' | 'pequeno'
  className?: string
}) {
  const clase = tamano === 'grande' ? 'text-26' : 'text-20'
  return (
    <span className={`font-display font-extrabold ${clase} leading-none uppercase block ${className}`}>{nap.nombre}</span>
  )
}
