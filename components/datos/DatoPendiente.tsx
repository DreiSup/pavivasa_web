import type { ReactNode } from 'react'

/**
 * Dato sin confirmar por el cliente. Se pinta entre corchetes con subrayado
 * punteado. Al llegar el dato real, se sustituye la llamada por el valor literal
 * y el tratamiento visual desaparece solo.
 */
export default function DatoPendiente({ children }: { children: ReactNode }) {
  return <span className="pendiente">[{children}]</span>
}
