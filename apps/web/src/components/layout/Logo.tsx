import { nap } from '@/lib/config'

/** Wordmark PAVIVASA: Big Shoulders Display 800 26px */
export function Logo({
  tamano = 'grande',
  className = '',
}: {
  tamano?: 'grande' | 'medio' | 'pequeno'
  className?: string
}) {
  return (
    <span className={`font-display font-extrabold text-26 leading-none uppercase block ${className}`}>{nap.nombre}</span>
  )
}
