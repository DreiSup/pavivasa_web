/**
 * Meta Conversions API. Import only from `"@site/tracking/server"`, and
 * only from server-only code (Server Actions, route handlers) — this reads
 * `@site/config/server`'s secrets. Never from the main `"@site/tracking"`
 * entry and never from a module a `'use client'` component imports.
 */
import { createHash } from 'node:crypto'
import { serverEnv } from '@site/config/server'

function hash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

/**
 * Meta matches phone numbers in E.164 without the `+` (34 + 9 digits for
 * Spain). A 9-digit national number hashed as-is matches nobody.
 */
function normalizeSpainPhone(value: string): string {
  const digits = value.replace(/\D/g, '').replace(/^00/, '')
  return digits.length === 9 ? `34${digits}` : digits
}

/**
 * Fallback for `_fbc` when there's no cookie (Pixel blocked, third-party
 * cookies restricted...): rebuilds the same format from the click id
 * captured on landing. Meta's format: `fb.<subdomain>.<timestamp_ms>.<fbclid>`.
 */
export function buildFbcFallback(clickId: string, timestampMs: string): string | undefined {
  if (!clickId) return undefined
  const timestamp = /^\d+$/.test(timestampMs) ? timestampMs : Date.now().toString()
  return `fb.1.${timestamp}.${clickId}`
}

export type ConversionEvent = {
  eventId: string
  phone: string
  email?: string
  ip: string
  userAgent: string
  url: string
  fbp?: string
  fbc?: string
  /** Used only when `fbc` is absent — see `buildFbcFallback`. */
  fbclid?: string
  fbclidTimestamp?: string
  /** The Meta Pixel id (public, `NEXT_PUBLIC_*`) — not a secret, so it's a param, not read from `serverEnv`. */
  pixelId?: string
  /** Consent gate: no-op unless true. Defense in depth — the primary gate stays at the call site. */
  consentGranted: boolean
}

/**
 * Sends the `Lead` event to Meta CAPI, deduplicated with the browser Pixel
 * via the shared `event_id`. Without credentials, consent or a pixel id, it
 * does nothing and never throws.
 */
export async function sendMetaConversionEvent(event: ConversionEvent): Promise<void> {
  if (!event.consentGranted) return

  const pixelId = event.pixelId
  const token = serverEnv.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {
    ph: [hash(normalizeSpainPhone(event.phone))],
    client_ip_address: event.ip,
    client_user_agent: event.userAgent,
  }
  if (event.email) userData.em = [hash(event.email)]
  if (event.fbp) userData.fbp = event.fbp
  const fbc = event.fbc ?? buildFbcFallback(event.fbclid ?? '', event.fbclidTimestamp ?? '')
  if (fbc) userData.fbc = fbc

  try {
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: event.eventId,
            action_source: 'website',
            event_source_url: event.url,
            user_data: userData,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    // Never blocks the lead delivery on a Meta failure.
  }
}
