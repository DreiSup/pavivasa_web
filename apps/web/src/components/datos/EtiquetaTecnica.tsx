import type { ReactNode } from 'react'

/** Bloque oscuro monoespaciado con los datos de una obra (o los claims de la empresa). */
export default function EtiquetaTecnica({
  titulo,
  lineas,
  pie,
  compacto,
  className = '',
}: {
  titulo: string
  /** Cada línea ya viene compuesta ("Hormigón · HM20"). Las atenuadas van como nodo. */
  lineas: ReactNode[]
  /** Enlace o nota al final. */
  pie?: ReactNode
  /** Padding reducido para móvil y columnas. */
  compacto?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex flex-col bg-tinta text-sobre-tinta font-mono text-d-12 uppercase leading-[2] p-5 ${className}`}
    >
      <span className="text-d-10 text-sobre-tinta/60 mb-[6px]">{titulo}</span>
      {lineas.map((linea, i) => (
        <span key={i}>{linea}</span>
      ))}
      {pie ? <span className="mt-[6px]">{pie}</span> : null}
    </div>
  )
}
