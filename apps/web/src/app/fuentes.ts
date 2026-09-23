import { Big_Shoulders, Work_Sans, Space_Mono } from 'next/font/google'

/**
 * Tres familias de obra, no de software:
 * - Big Shoulders Display (titulares): condensada, de cartel industrial. Google Fonts ha
 *   fundido "Big Shoulders Display" en esta variable con eje óptico (opsz): a los
 *   tamaños de titular se sirve el corte Display.
 * - Work Sans (texto): humanista, geométrica y accesible.
 * - Space Mono (datos de obra): monoespaciada, en versalitas; suelo 10 px.
 * Los componentes usan las variables CSS; cambiar aquí si cambia la familia.
 */
export const display = Big_Shoulders({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-display',
})

export const texto = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
})
