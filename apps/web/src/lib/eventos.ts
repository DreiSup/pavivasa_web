/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish API and same call semantics as before this migration, now
 * delegating to `@site/tracking`'s `trackEvent` — see its `events.ts` for
 * the `Window.gtag`/`Window.fbq` ambient typing (no component here calls
 * `window.gtag`/`window.fbq` directly any more; the one that used to,
 * `Consentimiento.tsx`, now calls `@site/tracking`'s own
 * `denyConsentUpdate`/script builders instead).
 */
import { trackEvent } from '@site/tracking'
import { sitio } from './config'

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
  trackEvent(nombre, {
    params: opciones?.params,
    metaStandardEvent: opciones?.metaEstandar,
    metaEventId: opciones?.metaEventId,
    adsConversion:
      opciones?.conversionAds && sitio.googleAdsId && sitio.googleAdsLeadLabel
        ? { id: sitio.googleAdsId, label: sitio.googleAdsLeadLabel }
        : undefined,
  })
}
