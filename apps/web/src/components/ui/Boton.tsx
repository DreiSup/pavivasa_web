import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'contorno' | 'tinta'
type Tamaño = 'normal' | 'lg'

type Comun = {
  variante?: Variante
  tamaño?: Tamaño
  sobreOscuro?: boolean
  anchoCompleto?: boolean
  /** Estado "enviando": fondo pigmento-hover, spinner y sin doble clic. */
  cargando?: boolean
  children: ReactNode
  className?: string
}

/** 48 px de alto (52 si tamaño="lg"), sin radio, foco 2 px acero desplazado (regla global). */
const base =
  'inline-flex items-center justify-center gap-3 px-7 font-sans font-bold text-14 uppercase tracking-[0.04em] no-underline transition-colors duration-cabecera'

function clasesVariante(variante: Variante, sobreOscuro?: boolean) {
  if (variante === 'primario') {
    return 'bg-pigmento text-sobre-tinta hover:bg-pigmento-hover active:bg-pigmento-hover'
  }
  if (variante === 'tinta') {
    return sobreOscuro
      ? 'bg-sobre-tinta text-tinta hover:bg-fondo-alt'
      : 'bg-tinta text-sobre-tinta hover:bg-acero'
  }
  return sobreOscuro
    ? 'bg-transparent text-sobre-tinta border-2 border-sobre-tinta hover:bg-sobre-tinta hover:text-tinta active:bg-sobre-tinta active:text-tinta'
    : 'bg-transparent text-tinta border-2 border-tinta hover:border-pigmento hover:text-pigmento active:bg-tinta active:text-sobre-tinta'
}

function clasesTamaño(tamaño?: Tamaño) {
  return tamaño === 'lg' ? 'min-h-[52px]' : 'min-h-boton'
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: boolean }

/** Un solo botón para todo el sitio. Con `href` es un enlace; sin él, un <button>. */
export default function Boton(props: ComoBoton | ComoEnlace) {
  const { variante = 'primario', tamaño, sobreOscuro, anchoCompleto, cargando, children, className = '', ...resto } = props
  const clases = `${base} ${clasesTamaño(tamaño)} ${clasesVariante(variante, sobreOscuro)} ${anchoCompleto ? 'w-full' : ''} ${
    resto.disabled && !cargando ? '!bg-tinta/14 !text-tinta-media !border-tinta/14 !cursor-not-allowed' : ''
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
