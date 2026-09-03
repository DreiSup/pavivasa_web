import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'contorno' | 'tinta'

type Comun = {
  variante?: Variante
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  /** Estado "enviando": fondo pigmento-hover, spinner y sin doble clic. */
  cargando?: boolean
  children: ReactNode
  className?: string
}

/** 48 px de alto, sin radio, foco 2 px acero desplazado (regla global). */
const base =
  'inline-flex items-center justify-center gap-3 min-h-boton px-6 font-sans font-semibold text-16 no-underline transition-colors duration-cabecera'

function clasesVariante(variante: Variante, sobreOscuro?: boolean) {
  if (variante === 'primario') {
    return 'btn-primario bg-pigmento text-sobre-tinta hover:bg-pigmento-hover'
  }
  if (variante === 'tinta') {
    return sobreOscuro
      ? 'bg-sobre-tinta text-tinta hover:bg-fondo-alt'
      : 'bg-tinta text-sobre-tinta hover:bg-acero'
  }
  return sobreOscuro
    ? 'bg-transparent text-sobre-tinta border border-sobre-tinta hover:bg-sobre-tinta hover:text-tinta'
    : 'bg-transparent text-tinta border border-tinta hover:bg-tinta hover:text-sobre-tinta'
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean }

/** Un solo botón para todo el sitio. Con `href` es un enlace; sin él, un <button>. */
export default function Boton(props: ComoBoton | ComoEnlace) {
  const { variante = 'primario', sobreOscuro, anchoCompleto, cargando, children, className = '', ...resto } = props
  const clases = `${base} ${clasesVariante(variante, sobreOscuro)} ${anchoCompleto ? 'w-full' : ''} ${
    resto.disabled && !cargando ? '!bg-fondo-alt !text-tinta-media !border-fondo-alt !cursor-not-allowed' : ''
  } ${cargando ? '!bg-pigmento-hover !text-sobre-tinta !border-pigmento-hover cursor-wait' : ''} ${className}`

  const contenido = cargando ? (
    <>
      <span
        aria-hidden="true"
        className="girar block w-[14px] h-[14px] border-2 border-sobre-tinta/40 border-t-sobre-tinta"
      />
      Enviando…
    </>
  ) : (
    children
  )

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    const externo = /^(https?:|tel:|mailto:)/.test(href)
    if (externo) {
      return (
        <a href={href} className={clases} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {contenido}
        </a>
      )
    }
    return (
      <Link href={href} className={clases} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {contenido}
      </Link>
    )
  }

  return (
    <button
      className={clases}
      aria-busy={cargando || undefined}
      {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}
      disabled={resto.disabled || cargando}
    >
      {contenido}
    </button>
  )
}
