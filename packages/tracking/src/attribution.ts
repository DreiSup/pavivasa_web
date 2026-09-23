/**
 * Paid-attribution capture (click ids + UTM params). Session-scoped by
 * default (no consent needed); promoted to a first-touch cookie only once
 * marketing consent is granted — `isConsentGranted` is the caller's own
 * consent read, kept out of this module so it stays independent from any
 * one consent-storage shape.
 */
export const DEFAULT_ATTRIBUTION_COOKIE = 'pv-attribution'
export const DEFAULT_ATTRIBUTION_SESSION_KEY = 'pv-attribution-session'
export const DEFAULT_MAX_VALUE_LENGTH = 200
export const DEFAULT_COOKIE_MAX_AGE_DAYS = 90

export type AttributionData = Record<string, string> & { ts?: string }

export type AttributionTrackerConfig = {
  cookieName?: string
  sessionKey?: string
  /** Click identifiers: only ever promoted/read with consent — see `isConsentGranted`. */
  clickIdParams: readonly string[]
  /** Campaign metadata: not personally identifying. */
  utmParams: readonly string[]
  maxValueLength?: number
  cookieMaxAgeDays?: number
  /** Read at call time, not cached — consent may change during the session. */
  isConsentGranted: () => boolean
}

export function createAttributionTracker(config: AttributionTrackerConfig) {
  const cookieName = config.cookieName ?? DEFAULT_ATTRIBUTION_COOKIE
  const sessionKey = config.sessionKey ?? DEFAULT_ATTRIBUTION_SESSION_KEY
  const maxValueLength = config.maxValueLength ?? DEFAULT_MAX_VALUE_LENGTH
  const cookieMaxAgeDays = config.cookieMaxAgeDays ?? DEFAULT_COOKIE_MAX_AGE_DAYS
  const allParams = [...config.clickIdParams, ...config.utmParams]

  function readSession(): AttributionData | null {
    try {
      const raw = window.sessionStorage.getItem(sessionKey)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function readCookie(): AttributionData | null {
    try {
      const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`))
      return match ? JSON.parse(decodeURIComponent(match[1])) : null
    } catch {
      return null
    }
  }

  /**
   * Called once on landing. Reads `window.location.search` directly rather
   * than a router hook, so it works from a mount effect with no
   * `<Suspense>` boundary requirement.
   */
  function captureLandingParams(): void {
    const params = new URLSearchParams(window.location.search)
    const captured: AttributionData = {}
    for (const key of allParams) {
      const value = params.get(key)
      if (value) captured[key] = value.slice(0, maxValueLength)
    }
    if (Object.keys(captured).length === 0) return
    captured.ts = String(Date.now())
    try {
      window.sessionStorage.setItem(sessionKey, JSON.stringify(captured))
    } catch {
      // No storage available: attribution simply won't be attached to this session.
    }
    // Returning visitor who already granted consent in a previous session:
    // promote immediately, don't wait for another click on the banner.
    if (config.isConsentGranted()) promoteFirstTouchCookie()
  }

  /**
   * On consent grant: writes the first touch once and never overwrites it
   * while it's still live, so a later session's params don't clobber the
   * touch that originally brought this visitor in.
   */
  function promoteFirstTouchCookie(): void {
    if (readCookie()) return
    const session = readSession()
    if (!session) return
    const maxAge = cookieMaxAgeDays * 24 * 60 * 60
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    try {
      document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(session))}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
    } catch {
      // No cookie access: falls back to the sessionStorage copy at submit time.
    }
  }

  /** Whether this browser currently holds the first-touch cookie (used to gate cleanup on withdrawal). */
  function hasAttributionCookie(): boolean {
    try {
      return new RegExp(`(?:^|; )${cookieName}=`).test(document.cookie)
    } catch {
      return false
    }
  }

  /** On real consent withdrawal: drop the first-touch cookie along with everything else. */
  function clearAttributionCookie(): void {
    try {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`
    } catch {
      // No cookie access: nothing to clear.
    }
  }

  /** At form submit time: the first-touch cookie takes priority over this session's data. */
  function getForSubmit(): AttributionData {
    return readCookie() ?? readSession() ?? {}
  }

  return {
    captureLandingParams,
    promoteFirstTouchCookie,
    hasAttributionCookie,
    clearAttributionCookie,
    getForSubmit,
  }
}
