# @site/tracking

Client-safe analytics, consent and attribution primitives, plus a server
subpath for Meta Conversions API. No React, no Next.

## Layout

```
src/
  events.ts            trackEvent (gtag + Google Ads conversion + Meta Pixel)
  consent-mode.ts       Consent Mode v2 bootstrap script + Meta Pixel init
                         script builders, and the withdrawal update call
  consent-storage.ts    createConsentStore — localStorage read/write
  attribution.ts        createAttributionTracker — click-id/UTM capture,
                         first-touch cookie promotion, submit-time read
  tracker-cookies.ts    createTrackerCookieCleanup — GA/Meta cookie wipe
  server.ts             ("@site/tracking/server") Meta CAPI — secrets only
                         via @site/config/server
```

## Design

Every stateful piece (consent storage, attribution) is a **factory**, not a
fixed singleton: `createConsentStore`/`createAttributionTracker` take the
storage key(s) and, for consent, the exact two stored values as config, so a
different site can point them at its own key/cookie names and values without
forking this package. `apps/web/src/lib/consent-status.ts` and
`apps/web/src/lib/attribution.ts` are this app's own instances, configured
with the exact key/cookie names and Spanish values (`'aceptado'`/
`'rechazado'`) this site has always persisted — those must never change for
returning visitors.

`trackEvent`'s `adsConversion` and `consent-mode`'s pixel/gtag ids are always
passed in by the caller, never read from env here: this package has no
dependency on `@site/config`'s public env, only its server subpath (Meta
CAPI's access token, via `server.ts`).

## Byte-exact templates

`buildConsentBootstrapScript`/`buildMetaPixelScript` return the exact inline
`<script>` bodies this site has always rendered (see
`apps/web/src/components/layout/Consentimiento.tsx`). Their whitespace is
part of the output — don't reformat these template literals; a byte
comparison against the pre-migration templates is part of the phase 3 gate,
since the build snapshot toolkit (`buildcheck`) strips all non-JSON-LD
`<script>` tags and can't see this on its own.

## Server subpath

`"@site/tracking/server"` reads `META_CAPI_ACCESS_TOKEN` via
`@site/config/server`, never `process.env` directly. Import it only from
server-only code (a Server Action, a route handler) — never from a module a
`'use client'` component's bundle can reach. `sendMetaConversionEvent` gates
on `consentGranted` itself (defense in depth); the primary gate should still
live at the call site, right next to where the visitor's actual consent
value is read.
