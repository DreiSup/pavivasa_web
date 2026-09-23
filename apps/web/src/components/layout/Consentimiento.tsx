'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { buildConsentBootstrapScript, buildMetaPixelScript, denyConsentUpdate } from '@site/tracking'
import { sitio } from '@/lib/config'
import { readConsentStatus, writeConsentStatus } from '@/lib/consent-status'
import {
  clearAttributionCookie,
  deleteTrackerCookies,
  hasAttributionCookie,
  promoteFirstTouchCookie,
} from '@/lib/attribution'

/**
 * Banner RGPD. Nada de analítica ni publicidad se carga antes de aceptar.
 * Con consentimiento carga gtag (GA4 + Google Ads sobre el mismo script) y Meta Pixel,
 * cada uno solo si su ID está en las variables de entorno.
 *
 * `estado` (persisted consent) and `bannerOpen` (banner visibility) are managed
 * separately: reopening the banner from "Configurar cookies" (Pie.tsx) must not
 * unmount the <Script> tags already loaded on the page.
 */
export default function Consentimiento() {
  const [estado, setEstado] = useState<'cargando' | 'pendiente' | 'aceptado' | 'rechazado'>('cargando')
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    const guardado = readConsentStatus()
    setEstado(guardado ?? 'pendiente')
    if (!guardado) setBannerOpen(true)
  }, [])

  // Delegated listener so Pie.tsx (Server Component) only needs a data attribute.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if ((event.target as HTMLElement).closest('[data-cookie-settings]')) setBannerOpen(true)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  function decidir(valor: 'aceptado' | 'rechazado') {
    // Whether THIS TAB's gtag/fbq are actually live right now — from React state, not
    // storage: storage can already hold a different value (another tab withdrew, or
    // this tab's own `setItem` never landed) while these scripts keep running granted.
    const wasAccepted = estado === 'aceptado'
    writeConsentStatus(valor)
    setEstado(valor)
    setBannerOpen(false)

    if (valor === 'aceptado') {
      promoteFirstTouchCookie()
      return
    }

    // Any rejection drops the first-touch cookie if one exists, even when this tab's
    // own state was never 'aceptado' (e.g. it was set by another tab, or by a
    // previous session, and this tab only just loaded the banner).
    if (hasAttributionCookie()) clearAttributionCookie()

    if (wasAccepted) {
      // Real withdrawal: gtag.js/fbevents.js are already loaded in this tab and
      // can't be "un-injected", so tell them to stop, drop the cookies they already
      // wrote, and reload to drop everything else.
      denyConsentUpdate()
      deleteTrackerCookies()
      window.location.reload()
    }
  }

  const gtagId = sitio.gaId ?? sitio.googleAdsId
  const configs = [sitio.gaId, sitio.googleAdsId].filter(Boolean) as string[]

  const boton =
    'inline-flex items-center justify-center min-h-tactil px-[18px] font-sans text-14 font-semibold no-underline cursor-pointer transition-colors duration-cabecera'

  return (
    <>
      {estado === 'aceptado' && gtagId ? (
        <>
          {/* Stub (consent default/update + gtag('js'/'config')) must run before the external
              gtag/js library loads, so it appears first here. */}
          <Script id="gtag-init" strategy="afterInteractive">
            {buildConsentBootstrapScript(configs)}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
        </>
      ) : null}

      {estado === 'aceptado' && sitio.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {buildMetaPixelScript(sitio.metaPixelId)}
        </Script>
      ) : null}

      {bannerOpen ? (
        <section
          aria-label="Aviso de cookies"
          className="fixed z-[25] left-0 right-0 bottom-barra-movil md:left-lat-desktop md:right-auto md:bottom-6 md:w-[640px] bg-tinta text-sobre-tinta px-lat-movil py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6"
        >
          <p className="text-14 text-sobre-tinta">
            Usamos cookies propias para que la web funcione y, si aceptas, cookies de medición y publicidad de
            Google y Meta.{' '}
            <Link href="/politica-de-cookies/" className="text-sobre-tinta">
              Política de cookies
            </Link>
          </p>
          <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">
            <button
              type="button"
              onClick={() => decidir('rechazado')}
              className={`${boton} bg-transparent border border-sobre-tinta text-sobre-tinta hover:bg-sobre-tinta hover:text-tinta`}
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => decidir('aceptado')}
              className={`${boton} bg-sobre-tinta border border-sobre-tinta text-tinta hover:bg-fondo-alt`}
            >
              Aceptar
            </button>
          </div>
        </section>
      ) : null}
    </>
  )
}
