/** Antetítulo de sección: mono en versalitas con una línea de 20 px delante. */
export default function AntetituloSeccion({
  children,
  sobreOscuro,
  sinLinea,
  className = '',
}: {
  children: React.ReactNode
  sobreOscuro?: boolean
  /** Sin la línea de 20 px (en fondos oscuros y en fichas). */
  sinLinea?: boolean
  className?: string
}) {
  const conLinea = !sinLinea && !sobreOscuro
  return (
    <p
      className={`inline-flex items-center gap-[10px] font-mono text-d-12 tracking-[0.12em] uppercase ${
        sobreOscuro ? 'text-sobre-tinta/60' : 'text-acero'
      } ${className}`}
    >
      {conLinea ? <span aria-hidden="true" className="block w-5 h-[2px] bg-acero shrink-0" /> : null}
      <span>{children}</span>
    </p>
  )
}
