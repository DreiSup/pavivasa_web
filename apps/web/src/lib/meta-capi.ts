/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish API as before this migration, now delegating to
 * `@site/tracking/server`'s `sendMetaConversionEvent` (hashing, +34 prefix
 * rule, `_fbc` fallback and the CAPI request itself all live there now).
 * Server-only — see `@site/tracking/server`'s own comment.
 */
import { sendMetaConversionEvent } from '@site/tracking/server'
import { sitio } from './config'

type EventoCAPI = {
  eventoId: string
  telefono: string
  email?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
  /** Used only when `fbc` is absent, to rebuild it — see `app/presupuesto/actions.ts`. */
  fbclid?: string
  atribucionTs?: string
}

/**
 * Manda el evento Lead a Meta Conversions API, deduplicado con el Pixel del
 * navegador vía el mismo event_id. Sin credenciales, no hace nada y no falla.
 *
 * El gate de consentimiento real vive en la llamada (`app/presupuesto/actions.ts`
 * solo llama a esta función con consentimiento de marketing concedido); aquí se
 * pasa `consentGranted: true` en consecuencia.
 */
export async function enviarEventoCAPI(evento: EventoCAPI) {
  await sendMetaConversionEvent({
    eventId: evento.eventoId,
    phone: evento.telefono,
    email: evento.email,
    ip: evento.ip,
    userAgent: evento.userAgent,
    url: evento.url,
    fbp: evento.fbp,
    fbc: evento.fbc,
    fbclid: evento.fbclid,
    fbclidTimestamp: evento.atribucionTs,
    pixelId: sitio.metaPixelId,
    consentGranted: true,
  })
}
