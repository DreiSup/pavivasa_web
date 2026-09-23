/**
 * Single exit point towards GA4, Google Ads and the Meta Pixel. Safe no-op
 * if the underlying script never loaded (no consent, or no id configured).
 * Same call semantics as this app's old `registrarEvento` — see
 * `apps/web/src/lib/eventos.ts` for the adapter that resolves
 * `adsConversion` from this app's own config before calling in.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export type TrackEventOptions = {
  params?: Record<string, unknown>
  /** Meta standard event name (Lead, Contact...). Without it, sent as trackCustom. */
  metaStandardEvent?: string
  /** Shared with Meta CAPI's event_id for dedup on the same event. */
  metaEventId?: string
  /** Resolved Google Ads conversion target. Callers only pass this when both
   *  the conversion id and label are actually configured — this module has
   *  no opinion on where those come from. */
  adsConversion?: { id: string; label: string }
}

export function trackEvent(name: string, options?: TrackEventOptions): void {
  if (typeof window === 'undefined') return

  window.gtag?.('event', name, options?.params)

  if (options?.adsConversion) {
    window.gtag?.('event', 'conversion', {
      send_to: `${options.adsConversion.id}/${options.adsConversion.label}`,
    })
  }

  const event = options?.metaStandardEvent ?? name
  const method = options?.metaStandardEvent ? 'track' : 'trackCustom'
  if (options?.metaEventId) {
    window.fbq?.(method, event, options?.params ?? {}, { eventID: options.metaEventId })
  } else {
    window.fbq?.(method, event, options?.params)
  }
}
