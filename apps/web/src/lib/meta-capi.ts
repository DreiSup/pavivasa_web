import { createHash } from 'crypto'

import { sitio } from './config'

function hash(valor: string) {
  return createHash('sha256').update(valor.trim().toLowerCase()).digest('hex')
}

/**
 * Meta empareja el teléfono en formato E.164 sin el `+` (34 + 9 cifras en España).
 * El formulario guarda solo las 9 cifras nacionales: hashearlas tal cual da un hash
 * que no coincide con ningún usuario, así que el emparejamiento sería del 0 %.
 */
function normalizarTelefono(valor: string) {
  const digitos = valor.replace(/\D/g, '').replace(/^00/, '')
  return digitos.length === 9 ? `34${digitos}` : digitos
}

type EventoCAPI = {
  eventoId: string
  telefono: string
  email?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
}

/**
 * Manda el evento Lead a Meta Conversions API, deduplicado con el Pixel del
 * navegador vía el mismo event_id. Sin credenciales, no hace nada y no falla.
 */
export async function enviarEventoCAPI(evento: EventoCAPI) {
  // Reuses lib/config.ts's already-cleaned value (empty/whitespace treated as
  // unset) instead of reading process.env directly again. This module is
  // server-only, so a dynamic vs. literal env read makes no difference here —
  // it's just one source of truth for the pixel id.
  const pixelId = sitio.metaPixelId
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim() || undefined
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    ph: [hash(normalizarTelefono(evento.telefono))],
    client_ip_address: evento.ip,
    client_user_agent: evento.userAgent,
  }
  if (evento.email) userData.em = [hash(evento.email)]
  if (evento.fbp) userData.fbp = evento.fbp
  if (evento.fbc) userData.fbc = evento.fbc

  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: evento.eventoId,
            action_source: 'website',
            event_source_url: evento.url,
            user_data: userData,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // No bloquea el envío del presupuesto por un fallo de Meta.
  }
}
