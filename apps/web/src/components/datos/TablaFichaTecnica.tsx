import DatoPendiente from './DatoPendiente'

type Fila = { parametro: string; valores: (string | null)[] }

/**
 * Tabla comparativa de ejecución sobre fondo tinta. Los huecos son DatoPendiente.
 * En móvil se convierte en la lista de la primera columna más una nota con el resto.
 */
export default function TablaFichaTecnica({ columnas, filas }: { columnas: string[]; filas: Fila[] }) {
  const principal = filas.filter((f) => f.valores[0])
  const notas = columnas.slice(1).map((col, i) => {
    const valores = filas
      .map((f) => f.valores[i + 1])
      .filter((v): v is string => Boolean(v))
      .slice(0, 4)
    return valores.length ? `${col.split(' · ')[0]}: ${valores.join(' · ')}.` : null
  })

  return (
    <>
      {/* Móvil: lista de la primera obra */}
      <div className="flex flex-col gap-4 md:hidden">
        <span className="font-mono text-d-10 tracking-[0.14em] uppercase text-sobre-tinta/60">{columnas[0]}</span>
        <dl className="m-0 flex flex-col font-mono text-d-12 uppercase">
          {principal.map((f, i) => (
            <div
              key={f.parametro}
              className={`flex justify-between gap-4 py-3 ${
                i < principal.length - 1 ? 'border-b border-sobre-tinta/[.16]' : ''
              }`}
            >
              <dt className="text-sobre-tinta/60">{f.parametro}</dt>
              <dd className="m-0 text-right">{f.valores[0]}</dd>
            </div>
          ))}
        </dl>
        {notas.some(Boolean) ? (
          <p className="font-sans text-14 text-sobre-tinta/70 normal-case">{notas.filter(Boolean).join(' ')}</p>
        ) : null}
      </div>

      {/* Escritorio: tabla completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-16">
          <thead>
            <tr className="border-b border-sobre-tinta/40">
              <th
                scope="col"
                className="text-left py-3 pr-4 font-mono text-d-10 tracking-[0.12em] uppercase font-medium text-sobre-tinta/60"
              >
                Parámetro
              </th>
              {columnas.map((c) => (
                <th
                  scope="col"
                  key={c}
                  className="text-left py-3 px-4 font-mono text-d-10 tracking-[0.12em] uppercase font-medium text-sobre-tinta/60"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-d-12 uppercase">
            {filas.map((f, i) => (
              <tr key={f.parametro} className={i < filas.length - 1 ? 'border-b border-sobre-tinta/[.16]' : ''}>
                <th scope="row" className="text-left font-normal font-sans text-16 normal-case tracking-normal py-[14px] pr-4 text-sobre-tinta/70">
                  {f.parametro}
                </th>
                {f.valores.map((v, j) => (
                  <td key={j} className="py-[14px] px-4 align-top">
                    {v ?? <DatoPendiente sobreOscuro>pendiente</DatoPendiente>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
