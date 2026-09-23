/**
 * `@site/tracking` — client-safe analytics/consent/attribution primitives.
 * No secrets here; see `"@site/tracking/server"` for Meta CAPI. Explicit
 * named re-exports, not `export * from`, so a consumer that only needs
 * `trackEvent` doesn't pull in the attribution/consent modules too — same
 * precaution as `@site/content`'s barrel (see its README).
 */
export { trackEvent } from './events.ts'
export type { TrackEventOptions } from './events.ts'

export { buildConsentBootstrapScript, buildMetaPixelScript, denyConsentUpdate } from './consent-mode.ts'

export { createConsentStore, DEFAULT_CONSENT_STORAGE_KEY } from './consent-storage.ts'
export type { ConsentStoreConfig } from './consent-storage.ts'

export { createAttributionTracker, DEFAULT_ATTRIBUTION_COOKIE, DEFAULT_ATTRIBUTION_SESSION_KEY } from './attribution.ts'
export type { AttributionData, AttributionTrackerConfig } from './attribution.ts'

export { createTrackerCookieCleanup, DEFAULT_TRACKER_COOKIE_PREFIXES } from './tracker-cookies.ts'

export { isClickIdParam, redactClickIdsUnlessConsented } from './click-ids.ts'
