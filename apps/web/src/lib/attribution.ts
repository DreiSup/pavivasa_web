/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Same Spanish API, same cookie/session-storage keys as before this
 * migration ('pv-attribution' / 'pv-attribution-session'), now delegating to
 * `@site/tracking`'s `createAttributionTracker` + `createTrackerCookieCleanup`.
 * See `components/layout/Consentimiento.tsx` (grant/withdrawal) and
 * `components/layout/EventosGlobales.tsx` (landing capture).
 */
import { createAttributionTracker, createTrackerCookieCleanup } from '@site/tracking'
import { readConsentStatus } from './consent-status'

// Click identifiers: GDPR-sensitive, only ever sent to the server with marketing
// consent (see FormularioPresupuesto.tsx and the defensive drop in actions.ts).
export const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const

// Campaign metadata: not personally identifying, may be sent regardless of consent.
export const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export const ATTRIBUTION_PARAMS = [...CLICK_ID_PARAMS, ...UTM_PARAMS] as const

const tracker = createAttributionTracker({
  cookieName: 'pv-attribution',
  sessionKey: 'pv-attribution-session',
  clickIdParams: CLICK_ID_PARAMS,
  utmParams: UTM_PARAMS,
  isConsentGranted: () => readConsentStatus() === 'aceptado',
})

export const captureLandingParams = tracker.captureLandingParams
export const promoteFirstTouchCookie = tracker.promoteFirstTouchCookie
export const hasAttributionCookie = tracker.hasAttributionCookie
export const clearAttributionCookie = tracker.clearAttributionCookie
export const getAttributionForSubmit = tracker.getForSubmit

export const deleteTrackerCookies = createTrackerCookieCleanup()
