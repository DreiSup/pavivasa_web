/** Muestra cuadrada de modelo o color. Sin foto real, trama; con obra, el nombre. */
export default function MuestraAcabado({
  nombre,
  tipo,
  activo,
  conTipo,
}: {
  nombre: string
  tipo: 'modelo' | 'color'
  /** Muestra seleccionada: borde 2 px pigmento. */
  activo?: boolean
  /** Muestra el rótulo "Modelo" / "Color" encima del nombre. */
  conTipo?: boolean
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div
        role="img"
        aria-label={`Muestra pendiente: ${tipo} ${nombre}`}
        className={`aspect-square bg-fondo-alt bg-trama ${activo ? 'border-2 border-pigmento' : 'border border-tinta/[.2]'}`}
      />
      {conTipo ? <span className="font-mono text-d-10 uppercase text-tinta-media">{tipo}</span> : null}
      {tipo === 'modelo' ? (
        <span className="text-d-12">{nombre}</span>
      ) : (
        <span className="text-d-12 text-tinta-media">{nombre}</span>
      )}
    </div>
  )
}
