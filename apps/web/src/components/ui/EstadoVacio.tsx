import EnlaceEtiqueta from './EnlaceEtiqueta'

/** "Sin resultados" de la rejilla de proyectos. Borde discontinuo, sin dramatismo. */
export default function EstadoVacio({
  titulo,
  texto = 'Prueba con otra técnica o municipio, o pídenos presupuesto para tu zona.',
  accion = 'Quitar filtros',
  onAccion,
}: {
  titulo: string
  texto?: string
  accion?: string
  onAccion?: () => void
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-3 p-6 border border-dashed border-tinta/20"
    >
      <p className="font-sans font-semibold text-16">{titulo}</p>
      <p className="text-14 text-tinta-media">{texto}</p>
      {onAccion ? <EnlaceEtiqueta onClick={onAccion}>{accion}</EnlaceEtiqueta> : null}
    </div>
  )
}
