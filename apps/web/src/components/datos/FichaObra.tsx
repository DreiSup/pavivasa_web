import type { ReactNode } from 'react'

export type FilaFicha = {
  etiqueta: string
  valor: ReactNode
  /** Dato de obra (espesor, hormigón, árido…): en mono y versalitas. */
  mono?: boolean
}

/** Barra lateral con filas etiqueta / valor. En escritorio va fija junto al texto. */
export default function FichaObra({
  titulo,
  filas,
  pie,
  compacto,
  className = '',
}: {
  titulo?: string
  filas: FilaFicha[]
  /** CTA al final de la ficha. */
  pie?: ReactNode
  /** Versión móvil: columnas más estrechas, texto a 14. */
  compacto?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col border border-tinta/20 ${className}`}>
      {titulo ? (
        <div className="px-5 py-4 bg-tinta text-sobre-tinta font-mono text-d-10 uppercase">
          {titulo}
        </div>
      ) : null}
      <dl className="m-0 flex flex-col text-14">
        {filas.map((fila, i) => (
          <div
            key={fila.etiqueta}
            className={`grid grid-cols-[120px_1fr] px-4 py-3 ${
              i < filas.length - 1 || pie ? 'border-b border-tinta/[.14]' : ''
            }`}
          >
            <dt className="text-tinta-media">{fila.etiqueta}</dt>
            <dd className={`m-0 ${fila.mono ? 'font-mono text-d-12 uppercase' : 'font-semibold'}`}>{fila.valor}</dd>
          </div>
        ))}
      </dl>
      {pie ? <div className="flex flex-col gap-2 p-5 border-t border-tinta/20">{pie}</div> : null}
    </div>
  )
}
