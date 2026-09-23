import Link from 'next/link'
import type { ReactNode } from 'react'

/** Enlace con subrayado de 2 px; en hover pasa a pigmento. El "→" va en el texto. */
export default function EnlaceEtiqueta({
  href,
  children,
  pequeno,
  sobreOscuro,
  className = '',
  onClick,
}: {
  href?: string
  children: ReactNode
  pequeno?: boolean
  sobreOscuro?: boolean
  className?: string
  onClick?: () => void
}) {
  const clases = `inline-block self-start font-sans font-bold text-14 uppercase tracking-[0.04em] no-underline border-b-2 pb-[2px] transition-colors duration-cabecera ${
    sobreOscuro
      ? 'text-sobre-tinta border-sobre-tinta hover:text-fondo-alt hover:border-fondo-alt'
      : 'text-acero border-acero hover:text-pigmento hover:border-pigmento'
  } ${className}`

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={`${clases} bg-transparent p-0 pb-[2px] cursor-pointer`}>
        {children}
      </button>
    )
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} className={clases} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={clases} onClick={onClick}>
      {children}
    </Link>
  )
}
