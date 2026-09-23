import Image from 'next/image'

/** Aspect ratio real del lockup completo (pavivasa-logo*.png): 1200x605. */
const ANCHO_BASE = 1200
const ALTO_BASE = 605

/**
 * Tamaño intrínseco pedido a next/image por `tamano` — solo controla qué
 * variante de resolución sirve el optimizador; el tamaño visible lo fija la
 * clase de altura (`h-*`) que pase cada sitio de uso, con `w-auto` para
 * mantener la proporción sin salto de layout (CLS).
 */
const INTRINSECO = {
  grande: { width: 240, height: Math.round((240 * ALTO_BASE) / ANCHO_BASE) },
  pequeno: { width: 160, height: Math.round((160 * ALTO_BASE) / ANCHO_BASE) },
} as const

const RUTA_LOGO = {
  oscuro: '/brand/pavivasa-logo.png',
  claro: '/brand/pavivasa-logo-claro.png',
} as const

/** Logotipo Pavivasa (lockup completo: símbolo + PAVIVASA + PAVIMENTOS DE HORMIGÓN). */
export function Logo({
  tono = 'oscuro',
  tamano = 'grande',
  eager = false,
  className = '',
}: {
  /** 'oscuro': tinta sobre fondo claro (cabecera). 'claro': para fondo tinta (menú móvil, pie). */
  tono?: 'oscuro' | 'claro'
  tamano?: 'grande' | 'pequeno'
  /** Solo la cabecera (siempre visible, sin scroll) la carga eager; el resto, lazy por defecto. */
  eager?: boolean
  className?: string
}) {
  const { width, height } = INTRINSECO[tamano]

  return (
    <Image
      src={RUTA_LOGO[tono]}
      alt="Pavivasa · Pavimentos de hormigón"
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      className={`w-auto ${className}`}
    />
  )
}
