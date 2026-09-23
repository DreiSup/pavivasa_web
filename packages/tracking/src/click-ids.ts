/**
 * Click identifiers (gclid/gbraid/wbraid/fbclid) are GDPR-sensitive and must
 * never leave the browser, or reach Meta CAPI, without marketing consent —
 * unlike UTM params, which are campaign metadata, not personally
 * identifying, and are exempt from this filter. This is the one shared
 * primitive both the client (`FormularioPresupuesto.tsx`, deciding which
 * `FormData` fields to set) and the server (`app/presupuesto/actions.ts`,
 * deciding what reaches the lead notice/Meta CAPI) apply — each with its own
 * shape, so it's kept as two small pure functions rather than one that
 * forces a common data shape on both call sites.
 */
export function isClickIdParam(key: string, clickIdParams: readonly string[]): boolean {
  return clickIdParams.includes(key)
}

/**
 * Redacts every value in `values` to `''` unless `consentGranted` — the
 * server-side twin of `isClickIdParam`, for a fixed set of already-known
 * click-id fields (e.g. `{ gclid, gbraid, wbraid, fbclid }`).
 */
export function redactClickIdsUnlessConsented<T extends Record<string, string>>(values: T, consentGranted: boolean): T {
  if (consentGranted) return values
  const redacted = { ...values }
  for (const key of Object.keys(redacted) as (keyof T)[]) redacted[key] = '' as T[keyof T]
  return redacted
}
