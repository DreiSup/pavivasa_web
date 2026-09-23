import type { Metadata, Viewport } from 'next'
import { nap, sitio } from '@/lib/config'
import { JsonLd, schemaNegocioLocal } from '@/lib/schema'
import Cabecera from '@/components/layout/Cabecera'
import Pie from '@/components/layout/Pie'
import BarraMovil from '@/components/layout/BarraMovil'
import Consentimiento from '@/components/layout/Consentimiento'
import EventosGlobales from '@/components/layout/EventosGlobales'
import { display, texto, mono } from './fuentes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${nap.nombre} · Pavimentos de hormigón impreso y pulido`,
    template: `%s | ${nap.nombre}`,
  },
  description:
    'Pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia y Alicante. Más de 15 años de oficio y 10 años de garantía con mantenimiento.',
  alternates: { canonical: '/' },
  /**
   * Open Graph declarado una sola vez, aquí. Ninguna página declara el suyo: en
   * Next, `openGraph` no se fusiona campo a campo, se sustituye entero, así que
   * un `openGraph` parcial en una página tiraría la imagen de este bloque.
   *
   * Tres campos se omiten a propósito:
   * - `title` y `description`: Next los hereda del title/description ya
   *   resueltos de cada ruta. Fijarlos aquí publicaría el mismo og:title de la
   *   portada en las 31 URLs.
   * - `images`: la aporta el fichero `app/opengraph-image.jpg` (1200×630, foto
   *   de obra real) por convención de fichero, que además emite og:image:width,
   *   og:image:height y og:image:type. Declarar `images` aquí la anularía.
   */
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: nap.nombre,
    // './' se resuelve contra el pathname de cada ruta y sobre metadataBase:
    // og:url propio en cada página, sin ninguna URL escrita a mano.
    url: './',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F3EFE7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${texto.variable} ${mono.variable}`}>
      <body className="font-sans text-tinta bg-fondo min-h-dvh flex flex-col">
        <JsonLd data={schemaNegocioLocal()} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-fondo focus:px-4 focus:py-2 focus:border focus:border-tinta"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1 flex flex-col">
          {children}
        </main>
        <Pie />
        <BarraMovil />
        <Consentimiento />
        <EventosGlobales />
      </body>
    </html>
  )
}
