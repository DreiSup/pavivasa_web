import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Comun = {
  /** Estado activo: el único uso del pigmento aparte del CTA primario. */
  activo?: boolean
  /** Técnica sin obra documentada: se ve, pero atenuada. */
  sinObra?: boolean
  /** Variante mono en versalitas (categorías del blog, municipios). Activo en tinta, no en pigmento. */
  mono?: boolean
  children: ReactNode
  className?: string
}

type ComoBoton = Comun & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ComoEnlace = Comun & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

function clases({ activo, sinObra, mono, className = '' }: Comun) {
  const base = `inline-flex items-center gap-[10px] min-h-tactil px-4 border no-underline transition-colors duration-cabecera ${
    mono ? 'font-mono text-d-12 uppercase' : 'font-sans text-14 font-semibold'
  }`
  if (sinObra) return `${base} border-fondo-alt text-tinta-media cursor-default ${className}`
  if (activo) {
    return `${base} ${
      mono ? 'bg-tinta border-tinta text-sobre-tinta' : 'bg-pigmento border-pigmento text-sobre-tinta'
    } ${className}`
  }
  return `${base} border-tinta text-tinta hover:bg-tinta hover:text-sobre-tinta ${className}`
}

/** Chip de filtro (44 px). Con `href` es un enlace; sin él, un <button>. */
export default function Chip(props: ComoBoton | ComoEnlace) {
  const { activo, sinObra, mono, children, className, ...resto } = props
  const c = clases({ activo, sinObra, mono, children, className })

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = resto as ComoEnlace
    return (
      <Link href={href} className={c} aria-current={activo ? 'page' : undefined} {...anchorRest}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      className={c}
      aria-pressed={activo}
      disabled={sinObra}
      {...(resto as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
