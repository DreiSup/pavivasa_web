import { sitio } from './config'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

type OpcionesEvento = {
  params?: Record<string, unknown>
  /** Nombre de evento estándar de Meta (Lead, Contact...). Sin esto, se manda como trackCustom. */
  metaEstandar?: string
  /** Para deduplicar con Meta CAPI en el mismo evento (event_id compartido). */
  metaEventId?: string
  /** Si es true, además dispara la conversión de Google Ads configurada en .env. */
  conversionAds?: boolean
}

/**
 * Único punto de salida de eventos hacia GA4, Google Ads y Meta Pixel.
 * No-op seguro si el script no cargó (sin consentimiento o sin ID).
 */
export function registrarEvento(nombre: string, opciones?: OpcionesEvento) {
  if (typeof window === 'undefined') return

  window.gtag?.('event', nombre, opciones?.params)

  if (opciones?.conversionAds && sitio.googleAdsId && sitio.googleAdsLeadLabel) {
    window.gtag?.('event', 'conversion', {
      send_to: `${sitio.googleAdsId}/${sitio.googleAdsLeadLabel}`,
    })
  }

  const evento = opciones?.metaEstandar ?? nombre
  const metodo = opciones?.metaEstandar ? 'track' : 'trackCustom'
  if (opciones?.metaEventId) {
    window.fbq?.(metodo, evento, opciones?.params ?? {}, { eventID: opciones.metaEventId })
  } else {
    window.fbq?.(metodo, evento, opciones?.params)
  }
}
