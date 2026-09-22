// Paid-attribution capture (gclid/gbraid/wbraid/fbclid/utm_*). Session-scoped by
// default (no consent needed); promoted to a 90-day first-touch cookie only once
// the visitor has granted marketing consent. See components/layout/Consentimiento.tsx
// (grant/withdrawal) and components/layout/EventosGlobales.tsx (landing capture).
import { readConsentStatus } from './consent-status'

const SESSION_KEY = 'pv-attribution-session'
const COOKIE_NAME = 'pv-attribution'
const COOKIE_MAX_AGE_DAYS = 90
const MAX_VALUE_LENGTH = 200 // matches the server-side cap in app/presupuesto/actions.ts

// Click identifiers: GDPR-sensitive, only ever sent to the server with marketing
// consent (see FormularioPresupuesto.tsx and the defensive drop in actions.ts).
export const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid'] as const

// Campaign metadata: not personally identifying, may be sent regardless of consent.
export const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export const ATTRIBUTION_PARAMS = [...CLICK_ID_PARAMS, ...UTM_PARAMS] as const

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
  try {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
  } catch {
    // No cookie access: falls back to the sessionStorage copy at submit time.
  }
}

/** Whether this browser currently holds the first-touch cookie (used to gate cleanup on withdrawal). */
export function hasAttributionCookie(): boolean {
  try {
    return new RegExp(`(?:^|; )${COOKIE_NAME}=`).test(document.cookie)
  } catch {
    return false
  }
}

/** On real consent withdrawal: drop the first-touch cookie along with everything else. */
export function clearAttributionCookie() {
  try {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
  } catch {
    // No cookie access: nothing to clear.
  }
}

// First-party tracker cookies GA4/Google Ads and Meta Pixel write once marketing
// consent is granted. Matched by prefix since GA suffixes them with the
// measurement ID (`_ga_XXXXXXXXXX`) and Meta Pixel can write `_fbp`/`_fbc` under
// slightly different names depending on setup.
const TRACKER_COOKIE_PREFIXES = ['_ga', '_gid', '_gcl', '_fbp', '_fbc']

/** `example.com` / `www.example.com` -> `.example.com`; `null` for hosts with no registrable domain (localhost, IPv4/IPv6 literals). */
function registrableDomain(hostname: string): string | null {
  if (/^[\d.]+$/.test(hostname) || hostname.includes(':')) return null // IPv4/IPv6 literal
  const labels = hostname.split('.')
  return labels.length >= 2 ? `.${labels.slice(-2).join('.')}` : null
}

/**
 * On real consent withdrawal: expires every first-party tracker cookie GA/Meta
 * wrote while consent was granted. gtag.js/fbevents.js can't be "un-injected", so
 * the cookies they already set have to be deleted explicitly. Tries both the
 * current host and the registrable domain (leading dot), since GA/Meta write to
 * whichever the browser resolves depending on subdomain.
 */
export function deleteTrackerCookies() {
  try {
    const names = new Set<string>()
    for (const pair of document.cookie.split('; ')) {
      const name = pair.split('=')[0]
      if (name && TRACKER_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) names.add(name)
    }
    if (names.size === 0) return
    const domain = registrableDomain(window.location.hostname)
    for (const name of names) {
      document.cookie = `${name}=; Max-Age=0; Path=/`
      if (domain) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}`
    }
  } catch {
    // No cookie access: nothing to clean up.
  }
}

/** At form submit time: the first-touch cookie takes priority over this session's data. */
export function getAttributionForSubmit(): AttributionData {
  return readCookie() ?? readSession() ?? {}
}
