import { Archivo, Instrument_Sans, Martian_Mono } from 'next/font/google'

/** Tres familias: display, texto y datos. Cambiar aquí; los componentes usan las variables CSS. */
export const display = Archivo({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-display',
})

export const texto = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sans',
})

export const mono = Martian_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
})
