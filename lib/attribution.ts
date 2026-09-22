// Paid-attribution capture (gclid/gbraid/wbraid/fbclid/utm_*). Session-scoped by
// default (no consent needed); promoted to a 90-day first-touch cookie only once
// the visitor has granted marketing consent. See components/layout/Consentimiento.tsx
// (grant/withdrawal) and components/layout/EventosGlobales.tsx (landing capture).
import { readConsentStatus } from './consent-status'

const SESSION_KEY = 'pv-attribution-session'
const COOKIE_NAME = 'pv-attribution'
const COOKIE_MAX_AGE_DAYS = 90
const MAX_VALUE_LENGTH = 200 // matches the server-side cap in app/presupuesto/actions.ts

export const ATTRIBUTION_PARAMS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

type AttributionData = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>> & { ts?: string }

/**
 * Called once on landing (EventosGlobales, mount effect). Reads
 * `window.location.search` directly rather than `useSearchParams()`: that hook
 * would force dynamic rendering on every page that mounts EventosGlobales
 * (the whole site, via the root layout) without a <Suspense> boundary.
 */
export function captureLandingParams() {
  const params = new URLSearchParams(window.location.search)
  const captured: AttributionData = {}
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key)
    if (value) captured[key] = value.slice(0, MAX_VALUE_LENGTH)
  }
  if (Object.keys(captured).length === 0) return
  captured.ts = String(Date.now())
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(captured))
  } catch {
    // No storage available: attribution simply won't be attached to this session.
  }
  // Returning visitor who already granted marketing consent in a previous session:
  // promote immediately, don't wait for another click on the banner.
  if (readConsentStatus() === 'aceptado') promoteFirstTouchCookie()
}

function readSession(): AttributionData | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readCookie(): AttributionData | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
    return match ? JSON.parse(decodeURIComponent(match[1])) : null
  } catch {
    return null
  }
}

/**
 * On marketing consent grant: writes the first touch once and never overwrites
 * it while it's still live, so a later session's UTM values don't clobber the
 * touch that originally brought this visitor in.
 */
export function promoteFirstTouchCookie() {
  if (readCookie()) return
  const session = readSession()
  if (!session) return
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
}

/** On real consent withdrawal: drop the first-touch cookie along with everything else. */
export function clearAttributionCookie() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
}

/** At form submit time: the first-touch cookie takes priority over this session's data. */
export function getAttributionForSubmit(): AttributionData {
  return readCookie() ?? readSession() ?? {}
}
