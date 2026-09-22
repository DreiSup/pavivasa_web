// Reads the visitor's saved cookie-consent choice on demand (e.g. at form
// submit time). Does not manage the banner's own state — see
// components/layout/Consentimiento.tsx for that.
export const CONSENT_STORAGE_KEY = 'pv-consentimiento'
export type ConsentValue = 'aceptado' | 'rechazado'

export function readConsentStatus(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'aceptado' || value === 'rechazado' ? value : null
  } catch {
    return null
  }
}
