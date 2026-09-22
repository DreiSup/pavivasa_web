'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { sitio } from '@/lib/config'
import { CONSENT_STORAGE_KEY, readConsentStatus } from '@/lib/consent-status'

/**
 * Banner RGPD. Nada de analítica ni publicidad se carga antes de aceptar.
 * Con consentimiento carga gtag (GA4 + Google Ads sobre el mismo script) y Meta Pixel,
 * cada uno solo si su ID está en las variables de entorno.
 *
 * `estado` (consentimiento persistido) y `bannerOpen` (visibilidad del banner) se
 * gestionan por separado: reabrir el banner desde "Configurar cookies" (Pie.tsx)
 * no debe desmontar los <Script> ya cargados en la página.
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
    const previous = readConsentStatus() // read before overwriting, needed for the withdrawal check below
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, valor)
    } catch {
      // Sin almacenamiento: la decisión vale para esta visita.
    }
    setEstado(valor)
    setBannerOpen(false)

    if (valor === 'rechazado' && previous === 'aceptado') {
      // Real withdrawal: gtag.js/fbevents.js are already loaded in this tab and
      // can't be "un-injected", so tell them to stop and reload to drop everything else.
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      })
      window.fbq?.('consent', 'revoke')
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
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
              gtag('js', new Date());
              ${configs.map((id) => `gtag('config', '${id}');`).join('\n')}`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
        </>
      ) : null}

      {estado === 'aceptado' && sitio.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${sitio.metaPixelId}');
            fbq('track', 'PageView');`}
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
