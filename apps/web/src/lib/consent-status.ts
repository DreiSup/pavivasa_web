/**
 * legacy adapter, delete when the new design consumes @site/* directly
 *
 * Reads/writes the visitor's saved cookie-consent choice via
 * `@site/tracking`'s `createConsentStore`, configured with the exact key and
 * the exact two Spanish values this site has always persisted
 * (`'aceptado'`/`'rechazado'`) — those must never change for returning
 * visitors. Does not manage the banner's own open/closed state — see
 * `components/layout/Consentimiento.tsx` for that.
 */
import { createConsentStore } from '@site/tracking'

export const CONSENT_STORAGE_KEY = 'pv-consentimiento'
export type ConsentValue = 'aceptado' | 'rechazado'

const store = createConsentStore<ConsentValue>({ key: CONSENT_STORAGE_KEY, values: ['aceptado', 'rechazado'] })

export function readConsentStatus(): ConsentValue | null {
  return store.read()
}

export function writeConsentStatus(value: ConsentValue): void {
  store.write(value)
}
