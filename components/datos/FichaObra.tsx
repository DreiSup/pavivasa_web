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
    <div className={`flex flex-col border border-tinta ${className}`}>
      {titulo ? (
        <div className="px-5 py-4 bg-tinta text-sobre-tinta font-mono text-d-10 tracking-[0.14em] uppercase">
          {titulo}
        </div>
      ) : null}
      <dl className="m-0 flex flex-col">
        {filas.map((fila, i) => (
          <div
            key={fila.etiqueta}
            className={`grid ${
              compacto ? 'grid-cols-[100px_1fr] px-4 py-[10px] text-14' : 'grid-cols-[120px_1fr] px-5 py-3 text-16'
            } ${i < filas.length - 1 || pie ? 'border-b border-tinta/[.12]' : ''}`}
          >
            <dt className="font-mono text-d-10 uppercase text-tinta-media pt-[3px]">{fila.etiqueta}</dt>
            <dd className={`m-0 ${fila.mono ? 'font-mono text-d-12 uppercase' : ''}`}>{fila.valor}</dd>
          </div>
        ))}
      </dl>
      {pie ? <div className="flex flex-col gap-2 p-5 border-t border-tinta">{pie}</div> : null}
    </div>
  )
}
