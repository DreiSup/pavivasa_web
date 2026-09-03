import { Big_Shoulders, Barlow, Overpass_Mono } from 'next/font/google'

/**
 * Tres familias de obra, no de software:
 * - Big Shoulders (titulares): condensada, de cartel industrial. Google Fonts ha
 *   fundido "Big Shoulders Display" en esta variable con eje óptico (opsz): a los
 *   tamaños de titular se sirve el corte Display.
 * - Barlow (texto): heredera de la DIN de señalización.
 * - Overpass Mono (datos de obra): derivada de la Highway Gothic de carretera.
 * Los componentes usan las variables CSS; cambiar aquí si cambia la familia.
 */
export const display = Big_Shoulders({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-display',
  // next/font aún no tiene métricas de esta familia para calcular el fallback.
  adjustFontFallback: false,
  fallback: ['Impact', 'Arial Narrow', 'sans-serif'],
})

export const texto = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = Overpass_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})
