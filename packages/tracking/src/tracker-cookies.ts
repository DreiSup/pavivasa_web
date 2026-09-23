/**
 * Cleanup for first-party tracker cookies GA4/Google Ads and the Meta Pixel
 * write once marketing consent is granted. Matched by prefix, since GA
 * suffixes them with the measurement id (`_ga_XXXXXXXXXX`) and Meta Pixel
 * can write `_fbp`/`_fbc` under slightly different names depending on setup.
 */
export const DEFAULT_TRACKER_COOKIE_PREFIXES = ['_ga', '_gid', '_gcl', '_fbp', '_fbc'] as const

/** `example.com` / `www.example.com` -> `.example.com`; `null` for hosts with no registrable domain (localhost, IPv4/IPv6 literals). */
function registrableDomain(hostname: string): string | null {
  if (/^[\d.]+$/.test(hostname) || hostname.includes(':')) return null // IPv4/IPv6 literal
  const labels = hostname.split('.')
  return labels.length >= 2 ? `.${labels.slice(-2).join('.')}` : null
}

/**
 * Expires every first-party tracker cookie matching `prefixes`. gtag.js/
 * fbevents.js can't be "un-injected", so the cookies they already set have
 * to be deleted explicitly. Tries both the current host and the registrable
 * domain (leading dot), since GA/Meta write to whichever the browser
 * resolves depending on subdomain.
 */
export function createTrackerCookieCleanup(prefixes: readonly string[] = DEFAULT_TRACKER_COOKIE_PREFIXES) {
  return function deleteTrackerCookies(): void {
    try {
      const names = new Set<string>()
      for (const pair of document.cookie.split('; ')) {
        const name = pair.split('=')[0]
        if (name && prefixes.some((prefix) => name.startsWith(prefix))) names.add(name)
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
}
