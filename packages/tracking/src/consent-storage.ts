/**
 * Reads/writes the visitor's saved cookie-consent choice from `localStorage`.
 * The storage key is configurable (a client's own key), but the two stored
 * values are also caller-provided (`values`) so an existing site's already
 * persisted values (e.g. Spanish `'aceptado'`/`'rechazado'`) never change
 * shape for returning visitors — see the adapter in
 * `apps/web/src/lib/consent-status.ts`.
 */
export const DEFAULT_CONSENT_STORAGE_KEY = 'pv-consentimiento'

export type ConsentStoreConfig<T extends string> = {
  key?: string
  /** [grantedValue, deniedValue] — the exact two values considered valid. */
  values: readonly [T, T]
}

export function createConsentStore<T extends string>(config: ConsentStoreConfig<T>) {
  const key = config.key ?? DEFAULT_CONSENT_STORAGE_KEY
  const [granted, denied] = config.values

  function read(): T | null {
    try {
      const value = window.localStorage.getItem(key)
      return value === granted || value === denied ? (value as T) : null
    } catch {
      return null
    }
  }

  function write(value: T): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // No storage available: the decision only holds for this visit.
    }
  }

  return { key, read, write }
}
