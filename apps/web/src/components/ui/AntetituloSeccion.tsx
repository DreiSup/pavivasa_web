/** Antetítulo de sección: mono en versalitas. Por defecto sin línea; agregar conLinea para mostrarla. */
export default function AntetituloSeccion({
  children,
  sobreOscuro,
  sinLinea,
  conLinea,
  className = '',
}: {
  children: React.ReactNode
  sobreOscuro?: boolean
  /** No-op: mantenido por compatibilidad hacia atrás. */
  sinLinea?: boolean
  /** Mostrar la línea de 20 px delante. */
  conLinea?: boolean
  className?: string
}) {
  const mostrarLinea = conLinea
  return (
    <p
      className={`inline-flex items-center gap-[10px] font-mono text-d-12 font-bold tracking-[0.12em] uppercase mb-2.5 ${
        sobreOscuro ? 'text-sobre-tinta/60' : 'text-acero'
      } ${className}`}
    >
      {mostrarLinea ? <span aria-hidden="true" className="block w-5 h-[2px] bg-acero shrink-0" /> : null}
      <span>{children}</span>
    </p>
  )
}
