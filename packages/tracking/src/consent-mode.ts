/**
 * Consent Mode v2 bootstrap (gtag default/update/js/config) and the Meta
 * Pixel init snippet, as inline-script strings ready for `next/script`. Byte
 * order and whitespace matter: this is compared byte-for-byte against the
 * pre-migration inline template in `Consentimiento.tsx` (see the phase 3
 * gate) — never reformat these template literals.
 */

/**
 * `configs` is one `gtag('config', id)` call per id (GA4 and/or Google Ads
 * share the same gtag.js load). Default denied, immediately updated to
 * granted: this function only ever runs after consent was actually granted
 * (see the adapter/component that calls it) — the `default`/`wait_for_update`
 * pair is Consent Mode v2's required shape, not a real waiting window here.
 */
export function buildConsentBootstrapScript(configs: readonly string[]): string {
  return `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
              gtag('consent', 'update', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
              });
              gtag('js', new Date());
              ${configs.map((id) => `gtag('config', '${id}');`).join('\n')}`
}

/** Meta's own async Pixel loader snippet, followed by `init` + `PageView`. */
export function buildMetaPixelScript(pixelId: string): string {
  return `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');`
}

/**
 * Real consent withdrawal: gtag.js/fbevents.js are already loaded and can't
 * be "un-injected", so this tells both to stop. Callers still need to drop
 * the cookies these scripts already wrote (see `tracker-cookies.ts`) and
 * reload the page.
 */
export function denyConsentUpdate(): void {
  if (typeof window === 'undefined') return
  window.gtag?.('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  window.fbq?.('consent', 'revoke')
}
