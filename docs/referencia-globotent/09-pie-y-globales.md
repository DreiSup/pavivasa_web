# 09 · Pie y elementos globales — referencia globotent.com

Dimensión: `.site-footer`, `.wa-fab`, `.exit-popup`, cookies/consentimiento, skip link, `.loadbar`/`.splash`, banderas de idioma, `<head>` (home y producto), JSON-LD de todo el sitio, accesibilidad global, 404 y thank-you. Fuente: espejo local de https://globotent.com/ (`home.html` = `site/index.html`, `main.pretty.css` = `main.css` formateado, `main.js`, `site/` con las 78 páginas, `sitemap.xml`, `robots.txt`) más `curl` puntuales a `https://globotent.com/` para `manifest.webmanifest`, `sw.js`, favicon, logos y la 404. Cada valor cita línea: `css:NNN` (main.pretty.css), `html:NNN` (home.html), `js:NNN` (main.js), o ruta `site/...`.

Lectores: Claude Design (mecanismo y valores) y Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Sección 22 = traducción. Sección 23 = lista de comprobación.

Aviso metodológico: no se ha usado navegador. Todo lo que dependa de renderizado real (p. ej. si los enlaces del pie fluyen en línea por el `display:inline-flex` tardío, §8.6) queda marcado como duda.

---

## 0. Resumen en diez líneas

1. **Pie** de 4 columnas (`grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px`, `css:772-776`) sobre fondo `--brand-dark` `#061827`, texto `#9eb3bd`, títulos `h4` blancos en versalitas (`.95rem`, `letter-spacing:.08em`), hover de enlace en lima `#7ec700`. Colapsa a `1fr 1fr` en ≤900 px y a `1fr` en ≤560 px. Idéntico byte a byte (salvo rutas relativas) en las 78 páginas.
2. Bajo la rejilla: barra `.site-footer__bottom` (copyright + NAP en texto plano, `flex; space-between; wrap`, `.85rem`) y un **disclaimer legal** `.site-footer__disclaimer` sobre permisos de obra (`.78rem`, `#7d909a`). No hay newsletter, ni redes sociales, ni badges/certificados, ni selector de idioma en el pie.
3. **`.wa-fab`**: botón WhatsApp fijo `bottom:24px; right:24px; z-index:45`, verde WhatsApp `#25D366`, pill ≈46 px de alto (padding 12px + icono 22px) con icono 22 px, `border-radius:50px` (el 50 es el radio, no la altura) + texto "WhatsApp"; en ≤560 px se vuelve circular 50×50 px solo-icono y sube a `bottom:92px`. Se oculta (`.is-hidden`, `translateY(20px)`) cuando el pie entra ≥5 % en viewport (IntersectionObserver, `js:370-376`) y **no existe** en las 36 páginas de producto (`body.is-product-detail .wa-fab{display:none}`, `css:3609`). **No tiene animación pulse**: `@keyframes pulse` existe (`css:2806`) pero solo se aplica a `.avail-banner__dot`, que no está en ningún HTML.
4. **`.exit-popup`**: modal de intención de salida (`role="dialog"`, backdrop `rgba(6,24,39,.72)`, caja 520 px, `scale(.94→1)` en `.3s`). Se dispara con `mouseout` a `clientY <= 0` sin `relatedTarget`, **solo** en escritorio ≥901 px, no táctil, una vez por sesión (`sessionStorage 'globotent_exit_shown'`). Sin trampa de foco, sin `aria-modal`, sin bloqueo de scroll.
5. **No hay banner de cookies ni CMP**. GTM `GTM-MR5F4PQR` se inyecta desde el `<head>` al primer `scroll/mousemove/touchstart/keydown/pointerdown` o a los 4 s, sin consentimiento previo (`html:13`). "consent" en el código = checkbox obligatorio de privacidad en los formularios (`.consent-row`, `css:1477`).
6. **No hay skip link** en ninguna página. `<main id="main" tabindex="-1">` en 72/78 (6 páginas tienen `<main>` pelado) y ningún enlace ni JS lo enfoca. `.sr-only` está en CSS (`css:4946`) pero no se usa en HTML.
7. **`.loadbar`** es un `@keyframes` de un splash de carga (`.splash`, `css:3340-3384`) que **no existe en ningún HTML**: CSS huérfano. Lo mismo `.mobile-sticky-cta`, `.maint-banner`, `.avail-banner` — pero sus reglas colaterales sí actúan (p. ej. `main{padding-bottom:84px}` en ≤900 px, `css:1592`).
8. **`<head>`**: `title` patrón `"{Página} | Globotent"`, `description` 85-253 caracteres, `canonical` absoluta con `.html`, 5 `hreflang` (`en`, `de`, `es`, `pt`, `x-default`), OG básico (`title/description/image/url/type=website/locale=en_GB`), `twitter:card=summary_large_image` sin más campos twitter, un solo favicon PNG 64×64, `theme-color #1aa585`, manifest, Figtree vía Google Fonts con truco `media="print" onload`, preload del hero con `fetchpriority="high"`, un CSS bloqueante (`?v=cfc09a15`) y un JS `defer` al final del body (`?v=c0f0756b`).
9. **Bugs de metadatos** en 77/78 páginas: `hreflang="x-default"` apunta a la ruta alemana sobre el dominio `.com` (p. ej. `https://globotent.com/produkte/rundbogenhalle-12x24.html`) y `og:image` es `https://globotent.de/../assets/images/...` (fragmento relativo sobre dominio ajeno). Solo la home es correcta.
10. **JSON-LD** real: `Organization` mínimo en 77 páginas; en la home, `Organization` completo en su lugar (no además) con `founder` (Person) + `AggregateRating`, y `LocalBusiness` con `AggregateRating` + 6 `Review` (6 Person); `Organization`+`AggregateRating` duplicado en customer-reviews; `JobPosting` ×3; `Article` ×8. **No hay** `FAQPage`, `Product`, `BreadcrumbList`, `WebSite` ni `SiteNavigationElement` en el código. Pavivasa prohíbe `AggregateRating` sin reseñas verificables (`CLAUDE.md:29`).

---

## 1. `<head>` de la home (`home.html:1-40`) — literal anotado

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="alternate" hreflang="en" href="https://globotent.com/">
<link rel="alternate" hreflang="de" href="https://globotent.de/">
<link rel="alternate" hreflang="es" href="https://globotent.es/">
<link rel="alternate" hreflang="pt" href="https://globotent.pt/">
<link rel="alternate" hreflang="x-default" href="https://globotent.com/">

<!-- Google day Manager — deferred bis 1. Interaktion or 4s (Performance; lädt GA4+Meta+Clarity via Container) -->
<script>window.dataLayer=window.dataLayer||[];(function(){var L=false;function G(){if(L)return;L=true;(function(w,d,s,l,i){…GTM…})(window,document,'script','dataLayer','GTM-MR5F4PQR');}var E=['scroll','mousemove','touchstart','keydown','pointerdown'];function F(){G();}E.forEach(function(e){window.addEventListener(e,F,{passive:true,once:true});});setTimeout(G,4000);})();</script>
<!-- End Google day Manager -->
<title>Storage Tents, Hoop Buildings &amp; Livestock Shelters | Globotent</title>
<meta name="description" content="Robust storage tents, hoop buildings and field shelters for farming, hay storage, equipment and equestrian use. Fast installation, PVC 750 g/m², galvanised steel.">
<meta name="theme-color" content="#1aa585">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"></noscript>
<link rel="preload" as="image" type="image/webp" imagesrcset="assets/images/hero-agricolas-800.webp 800w, assets/images/hero-agricolas-1200.webp 1200w, assets/images/hero-agricolas.webp 2000w" imagesizes="100vw" fetchpriority="high">
<link rel="dns-prefetch" href="https://unpkg.com">
<link rel="dns-prefetch" href="https://ajax.googleapis.com">
<meta property="og:title" content="Arched Storage Tents, Fabric Buildings &amp; Sportplatzüberdachungen | Globotent">
<meta property="og:description" content="Stützenfreie Rundbogen- &amp; Fabric Buildings for Industry and Agriculture – plus Überdachungen for Padel, Tennis &amp; Equestrian. Permit-free*, montiert in days. 4,9/5 →">
<meta property="og:image" content="https://globotent.com/assets/images/hero_banner_1.jpg">
<meta property="og:url" content="https://globotent.com/">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="assets/images/favicon.png">
<link rel="canonical" href="https://globotent.com/">
<link rel="manifest" href="manifest.webmanifest">
<link rel="stylesheet" href="assets/css/main.min.css?v=cfc09a15">

<script type="application/ld+json">{…Organization…}</script>   <!-- html:38, ver §6.1 -->
<script type="application/ld+json">{…LocalBusiness…}</script>  <!-- html:39, ver §6.2 -->
</head>
```

Orden dentro del `<head>` (relevante para el crítico de renderizado):

| # | Elemento | Nota |
|---|---|---|
| 1 | `charset`, `viewport` | `viewport` sin `maximum-scale` ni `user-scalable=no` (correcto). |
| 2 | 5× `hreflang` | Antes del título. |
| 3 | Script GTM inline (diferido por interacción/4 s) | Ver §13. |
| 4 | `title`, `description`, `theme-color` | `theme-color` = `--brand-green` `#1aa585`; sin variante `media="(prefers-color-scheme: dark)"`. |
| 5 | Fuentes: 2× `preconnect`, `preload as=style`, `stylesheet media=print onload`, `noscript` | Figtree 300..900 variable, `display=swap`. **No hay `@font-face`** en `main.pretty.css` (0 coincidencias): nada autohospedado. |
| 6 | `preload as=image` del hero con `imagesrcset`/`imagesizes` + `fetchpriority="high"` | Declara `hero-agricolas.webp 2000w`; el `<picture>` del hero declara el mismo fichero como `1920w` (`html:129`). Discrepancia menor. |
| 7 | 2× `dns-prefetch` (`unpkg.com`, `ajax.googleapis.com`) | Para three.js (`js:406-407`) y model-viewer (`js:533`), que solo cargan en páginas con `.threed-viewer` / `[data-ar-btn]`. En la home son inútiles pero inocuos. |
| 8 | Open Graph (6 campos) + `twitter:card` | Sin `og:site_name`, `og:image:width/height`, `twitter:title/description/image` (0 en las 78 páginas). |
| 9 | `icon` PNG, `canonical`, `manifest` | Un solo favicon: `assets/images/favicon.png`, **64×64 px, 2034 bytes** (curl + `file`). Sin `apple-touch-icon` (0/78), sin `.ico`, sin SVG. |
| 10 | `stylesheet main.min.css?v=cfc09a15` | Único CSS, bloqueante, 125 019 bytes en disco (pese al `.min`). |
| 11 | 2× JSON-LD | Ver §5-6. |

Fuera del head: `<noscript><iframe GTM ns.html>` justo tras `<body>` (`html:43-45`) y `<script src="assets/js/main.min.js?v=c0f0756b" defer>` como último hijo de `<body>` (`html:664`), 30 225 bytes.

`'Clash Display'` aparece como `font-family:'Clash Display',var(--font-family)` en `css:4163, 4216, 4240, 4318, 4395, 4428, 4464` (mundo "sport"). **No hay `@font-face` ni `<link>` que la cargue**: cae siempre al fallback Figtree.

---

## 2. `<head>` de una página de producto (`site/products/storage-tent-12x24.html:1-40`) — diferencias respecto a la home

```html
<link rel="alternate" hreflang="en" href="https://globotent.com/products/storage-tent-12x24.html">
<link rel="alternate" hreflang="de" href="https://globotent.de/produkte/rundbogenhalle-12x24.html">
<link rel="alternate" hreflang="es" href="https://globotent.es/productos/carpa-agricola-12x24.html">
<link rel="alternate" hreflang="pt" href="https://globotent.pt/productos/carpa-agricola-12x24.html">
<link rel="alternate" hreflang="x-default" href="https://globotent.com/produkte/rundbogenhalle-12x24.html">
…
<title>Arched Storage Tent 12.20 × 24 × 6.10 m — 293 m² | Globotent</title>
<meta name="description" content="Arched Storage Tent 12.20 × 24 × 6.10 m (293 m²): XXL shelter for large operations. Galvanised steel, PVC 750 g/m². Quote within 24 h.">
…
<link rel="preload" as="image" href="../assets/images/rundbogenhalle-12x24-01.webp" type="image/webp" fetchpriority="high">
…
<meta property="og:title" content="Arched Storage Tent 12.20 × 24 × 6.10 m – ca. 293 m² | Globotent">
<meta property="og:description" content="Arched Storage Tent 12.20 × 24 × 6.10 m with ca. 293 m² – permit-free, installed in 1 day. PVC tarpaulin, verzinkter Stahl. 4,9/5 Sterne. Jetzt Angebot →">
<meta property="og:image" content="https://globotent.de/../assets/images/rundbogenhalle-12x24-01.jpg">
<meta property="og:url" content="https://globotent.com/products/storage-tent-12x24.html">
…
<link rel="icon" type="image/png" href="../assets/images/favicon.png">
<link rel="canonical" href="https://globotent.com/products/storage-tent-12x24.html">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="stylesheet" href="../assets/css/main.min.css?v=cfc09a15">

<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Organization", "name": "Globotent", "url": "https://globotent.com/", "logo": "https://globotent.com/assets/logo.png", "telephone": "+34 657 472 335", "email": "info@globotent.com", "address": {"@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES"}}</script>
</head>
<body class="is-product-detail">
```

| Aspecto | Home | Producto |
|---|---|---|
| `title` | `Storage Tents, Hoop Buildings & Livestock Shelters \| Globotent` | `Arched Storage Tent {W} × {L} × {H} m — {m²} m² \| Globotent` |
| `description` | 162 car. | 113-150 car.; patrón `{Nombre} ({m²} m²): {claim}. Galvanised steel, PVC 750 g/m². Quote within 24 h.` |
| `x-default` | `https://globotent.com/` ✔ | `https://globotent.com/produkte/rundbogenhalle-12x24.html` ✘ (ruta alemana en dominio `.com`) |
| `og:image` | `https://globotent.com/assets/images/hero_banner_1.jpg` ✔ (JPEG 197 332 bytes, existe) | `https://globotent.de/../assets/images/rundbogenhalle-12x24-01.jpg` ✘ |
| `preload` hero | `imagesrcset` 3 anchos | `href` único `.webp` |
| Rutas de assets | relativas a raíz (`assets/...`) | `../assets/...` (páginas en `/pages/jobs/` usan `../../`) |
| JSON-LD | Organization completa + LocalBusiness | **Solo Organization mínima. No hay `Product`, ni `Offer`, ni `BreadcrumbList`** aunque la página tiene migas HTML (`.breadcrumbs`, línea 131). |
| `<body>` | `<body>` | `<body class="is-product-detail">` (26 págs.) o `class="is-product-detail sport-world"` (10 págs.) |
| `<main>` | `<main id="main" tabindex="-1">` | `<main id="main" tabindex="-1" class="is-product-detail">` |

Efectos de `body.is-product-detail`: la única regla es `body.is-product-detail .wa-fab{display:none}` (`css:3609-3610`).

---

## 3. Patrones de metadatos en las 78 páginas

Generado con un script sobre `site/**/*.html`. Constantes en las 78: `<html lang="en">`, `viewport`, `theme-color #1aa585`, `og:type website`, `og:locale en_GB`, `twitter:card summary_large_image`, `rel=icon` PNG, `rel=manifest`, `main.min.css?v=cfc09a15`, `main.min.js?v=c0f0756b`, 2× `dns-prefetch`, 1× `preload as=image` con `fetchpriority="high"` en cada página (+1 extra en el `<img>` del hero de home y +1 extra en el `<img>` del logo de `pages/sport.html` = 80 en total), GTM `GTM-MR5F4PQR`.

| Grupo | Nº | Patrón `title` | Ejemplo |
|---|---|---|---|
| Home | 1 | `{claims} \| Globotent` | ver §1 |
| Categorías | 5 | `{Categoría} \| Globotent` | `Arched Storage Tents & Hoop Buildings \| Globotent` |
| Productos | 36 | `{Tipo} {W} × {L} × {H} m — {m²} m² \| Globotent` | `Riding Arena Cover 20 × 40 × 6.5 m — 800 m² \| Globotent` |
| Páginas | 24 | `{Página} \| Globotent` (variantes: `About Us \| Globotent Carpas S.L.`, `Globotent Calculators \| Bales, Machinery, Compare`) | `Request a Quote \| Globotent` |
| Jobs | 3 | `{Puesto} (m/w/d) – Jobs \| Globotent` | 171-253 car. de description |
| Proyectos | 8 | `{Cliente anonimizado} — {obra} \| Globotent` | `Large farm M. — Machinery shelter in Upper Austria \| Globotent` |
| Guides | 1 | `Guides & Praxiswissen zu Arched Storage Tents \| Globotent` | |

Otros hallazgos globales:

- `canonical` siempre absoluta y **con `.html`** (`https://globotent.com/pages/contact.html`), mientras que la navegación interna enlaza **sin** `.html` (`/pages/contact`, `html:97`). El sitemap usa `.html`. Netlify sirve ambas (pretty URLs), pero la señal canónica es la versión `.html`.
- `x-default != canonical` en **77/78** páginas (todas salvo la home). Formato del error: `https://globotent.com/{ruta-alemana}` (`kategorien/…`, `seiten/…`, `produkte/…`, `projekte/…`, `ratgeber/…`).
- `og:image` malformada en 77/78 (`https://globotent.de/../assets/…`; en `/pages/jobs/*` `https://globotent.de/../../assets/…`).
- `meta name="robots"` solo en `pages/thank-you.html` (`noindex,nofollow`, `site/pages/thank-you.html:39`, colocada **después** del JSON-LD, último hijo del head) — y sin embargo `sitemap.xml` incluye `https://globotent.com/pages/thank-you.html`.
- 0 páginas con `og:site_name`, `twitter:title/description/image`, `apple-touch-icon`, `format-detection`, `color-scheme`, `author`, `generator`.
- `loading="lazy"` en 552 imágenes (78 páginas), `decoding="async"` en 117 (44 páginas).
- El `<head>` mezcla inglés y alemán en `og:*` de casi todas las páginas (residuo de traducción automática: "Google day Manager" por "Tag Manager", `html:12`).

---

## 4. Orden de carga: CSS, JS, fuentes, cache busting

| Recurso | Cómo | Dónde | Bloqueante |
|---|---|---|---|
| GTM loader | inline `<script>` en head, carga `gtm.js` en la 1.ª interacción o a los 4000 ms | `html:13` | No (inline pequeño) |
| Google Fonts CSS | `preload as=style` + `<link media="print" onload="this.media='all'">` + `noscript` | `html:19-23` | No (truco print→all) |
| Imagen hero | `preload as=image fetchpriority=high` | `html:24` | — |
| `main.min.css?v=cfc09a15` | `<link rel=stylesheet>` normal | `html:36` | **Sí** |
| `main.min.js?v=c0f0756b` | `<script defer>` último en body | `html:664` | No |
| three.js 0.158 + OrbitControls | `loadScript()` dinámico desde unpkg cuando `.threed-viewer` entra a 200 px del viewport | `js:400-431` | No |
| model-viewer 3.4.0 | `<script type=module>` dinámico desde ajax.googleapis.com al pulsar `[data-ar-btn]` | `js:516-547` | No |
| `/sw.js` | `navigator.serviceWorker.register('/sw.js')` si `https:` | `js:559-561` | No |

Cache busting: query `?v=<hash 8 hex>` fijo por build, **el mismo en las 78 páginas** (`cfc09a15` CSS, `c0f0756b` JS). Netlify responde `cache-control: public,max-age=0,must-revalidate` (cabeceras de `sw.js` y la 404), es decir, el `?v=` es el único mecanismo de invalidación.

`sw.js` (curl): worker **auto-desactivador** — en `install` hace `skipWaiting()`, en `activate` borra todas las caches, se `unregister()` y recarga los clientes; `fetch` es no-op. Comentario literal: "selbst-deaktivierend während aktive Entwicklung". Efecto neto: no hay PWA offline.

`manifest.webmanifest` (curl):

```json
{ "name": "Globotent", "short_name": "Globotent",
  "description": "Rundbogenhallen, Weidezelte & Satteldachhallen",
  "start_url": "/", "display": "standalone",
  "background_color": "#ffffff", "theme_color": "#1aa585",
  "icons": [ { "src": "/assets/logo.png", "sizes": "512x512", "type": "image/png" },
             { "src": "/assets/logo.png", "sizes": "192x192", "type": "image/png" } ] }
```

`assets/logo.png` real: **872×548 px RGBA, 54 823 bytes** (`file logo.png`) — no es cuadrado ni 512/192: los `sizes` del manifest son falsos. Descripción en alemán en un sitio `lang="en"`.

---

## 5. JSON-LD — inventario por página (78/78 analizadas con `json.loads`, 0 errores de parseo)

| Página(s) | Bloques (`@type`) | Notas |
|---|---|---|
| `index.html` | `Organization` (completo: `legalName`, `vatID`, `foundingDate`, `founder` Person, `address` completa, `sameAs`, `areaServed`, `aggregateRating`) + `LocalBusiness` (`aggregateRating` + 6 `Review`) | Únicos `Person`: 1 founder + 6 autores = **7 Person**. |
| `pages/customer-reviews.html` | `Organization` mínimo + `Organization` con solo `name` + `aggregateRating` | Dos `Organization` en la misma página, sin `@id` que los una. |
| `pages/jobs/*.html` (3) | `Organization` mínimo + `JobPosting` | `url` apunta a `globotent.de/seiten/jobs/...`; `hiringOrganization.sameAs` = `https://globotent.de`. |
| `projects/*.html` (8) | `Organization` mínimo + `Article` | `author` y `publisher` son `Organization`. |
| Resto (65): categorías, productos, páginas, guides | `Organization` mínimo | Idéntico en todas (§6.4). |

Totales: `Organization` 79 bloques (76 mínimos en el resto de páginas + 1 mínimo adicional en `customer-reviews.html` = 77 mínimos + 1 completo en home + 1 solo-rating [segundo bloque de `customer-reviews.html`]; el "solo-rating" y el bloque "en reviews" son el mismo `<script>`, no dos distintos), `LocalBusiness` 1, `AggregateRating` 3 (valor `4.96`, `reviewCount 127` en los tres), `Review` 6, `Person` 7, `JobPosting` 3, `Article` 8. **0**: `FAQPage` (ni en `pages/faq.html`), `Product`, `Offer`, `BreadcrumbList` (aunque 72 páginas tienen `.breadcrumbs` HTML), `WebSite`, `WebPage`, `ImageObject` suelto, `VideoObject`, `Service`.

Ninguna entidad usa `@id`; no hay `@graph`; cada bloque es un `<script>` independiente. El `LocalBusiness` no declara `priceRange`, `openingHours`, `geo` ni `url`.

---

## 6. JSON-LD — bloques literales

### 6.1 `Organization` completo (solo home, `html:38`)

```json
{"@context": "https://schema.org", "@type": "Organization", "name": "Globotent",
 "legalName": "Globotent Carpas S.L.", "url": "https://globotent.com/",
 "logo": "https://globotent.com/assets/logo.png", "telephone": "+34 657 472 335",
 "email": "info@globotent.com", "vatID": "ESB22837041", "foundingDate": "2018",
 "founder": {"@type": "Person", "name": "Javier Pozo", "jobTitle": "CEO & Founder",
             "worksFor": {"@type": "Organization", "name": "Globotent Carpas S.L."}},
 "address": {"@type": "PostalAddress", "streetAddress": "Gran Vía de les Corts Catalanes 303",
             "postalCode": "08014", "addressLocality": "Barcelona", "addressCountry": "ES"},
 "sameAs": ["https://globotent.de", "https://globotent.es", "https://globotent.com/"],
 "areaServed": ["ES", "DE", "AT", "CH", "FR", "IT", "PT", "EU"],
 "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.96", "reviewCount": "127",
                     "bestRating": "5", "worstRating": "1"}}
```

### 6.2 `LocalBusiness` con 6 `Review` (solo home, `html:39`)

```json
{"@context": "https://schema.org", "@type": "LocalBusiness", "name": "Globotent",
 "image": "https://globotent.com/assets/logo.png", "telephone": "+34 657 472 335",
 "email": "info@globotent.com",
 "address": {"@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES"},
 "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.96", "reviewCount": "127",
                     "bestRating": "5", "worstRating": "1"},
 "review": [
  {"@type": "Review", "author": {"@type": "Person", "name": "Markus H."},
   "reviewRating": {"@type": "Rating", "ratingValue": "5", "bestRating": "5"},
   "reviewBody": "Absolut top! Shelter stand in a Tag, Crew war pünktlich and sauber. …",
   "datePublished": "2025-11-01"},
  {"@type": "Review", "author": {"@type": "Person", "name": "Carlos M."},      "reviewRating": {…"5"…}, "reviewBody": "…", "datePublished": "2026-02-01"},
  {"@type": "Review", "author": {"@type": "Person", "name": "Johann M."},      "reviewRating": {…"5"…}, "reviewBody": "…", "datePublished": "2025-07-01"},
  {"@type": "Review", "author": {"@type": "Person", "name": "María Á."},       "reviewRating": {…"5"…}, "reviewBody": "…", "datePublished": "2026-01-01"},
  {"@type": "Review", "author": {"@type": "Person", "name": "Dr. Sebastian W."},"reviewRating": {…"5"…}, "reviewBody": "…", "datePublished": "2025-09-01"},
  {"@type": "Review", "author": {"@type": "Person", "name": "Antoni B."},      "reviewRating": {…"5"…}, "reviewBody": "…", "datePublished": "2025-12-01"}
 ]}
```

Los 6 `reviewBody` están en alemán con palabras sueltas en inglés (traducción automática parcial). Las 6 puntuaciones son `5`. Los nombres son iniciales anonimizadas. Nada de esto es verificable desde el código: no hay enlace a Google/Trustpilot ni `sameAs` de la reseña.

### 6.3 `Organization` + `AggregateRating` (solo `pages/customer-reviews.html`)

```json
{"@context": "https://schema.org", "@type": "Organization", "name": "Globotent",
 "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.96", "reviewCount": "127",
                     "bestRating": "5", "worstRating": "1"}}
```

### 6.4 `Organization` mínimo (las 78 páginas; en la home lo sustituye 6.1)

```json
{"@context": "https://schema.org", "@type": "Organization", "name": "Globotent",
 "url": "https://globotent.com/", "logo": "https://globotent.com/assets/logo.png",
 "telephone": "+34 657 472 335", "email": "info@globotent.com",
 "address": {"@type": "PostalAddress", "addressLocality": "Barcelona", "addressCountry": "ES"}}
```

### 6.5 `JobPosting` (`pages/jobs/sdr-sales.html`; `freiberuflicher-ingenieur.html` sigue la misma forma — mismo conjunto exacto de claves, solo cambia `employmentType` a `["CONTRACTOR"]`; `studentische-assistenz.html` **no**: ver 6.5b)

```json
{"@context": "https://schema.org", "@type": "JobPosting",
 "title": "SDR / Sales Development Representative (m/w/d) – 100 % Homeoffice",
 "description": "<p>…HTML en alemán…</p>",
 "datePosted": "2026-06-09", "validThrough": "2026-12-31",
 "employmentType": ["FULL_TIME", "PART_TIME"],
 "identifier": {"@type": "PropertyValue", "name": "Globotent", "value": "sdr-sales"},
 "hiringOrganization": {"@type": "Organization", "name": "Globotent Carpas S.L.",
                        "sameAs": "https://globotent.de", "logo": "https://globotent.com/assets/logo.png"},
 "jobLocation": {"@type": "Place", "address": {"@type": "PostalAddress", "addressCountry": "ES"}},
 "url": "https://globotent.de/seiten/jobs/sdr-sales.html",
 "directApply": true, "jobLocationType": "TELECOMMUTE",
 "applicantLocationRequirements": [{"@type": "Country", "name": "Austria"},
                                   {"@type": "Country", "name": "Germany"},
                                   {"@type": "Country", "name": "Switzerland"}]}
```

### 6.5b `JobPosting` — diferencias en `pages/jobs/studentische-assistenz.html`

Mismas claves base salvo dos ausencias y una adición: **sin** `jobLocationType` ni `applicantLocationRequirements` (las dos ofertas remotas/TELECOMMUTE sí las llevan), **con** `baseSalary` (ausente en las otras dos):

```json
{"employmentType": ["PART_TIME", "INTERN"],
 "jobLocation": {"@type": "Place", "address": {"@type": "PostalAddress",
   "addressLocality": "Barcelona", "postalCode": "1010", "addressCountry": "ES",
   "streetAddress": "Gran Vía de les Corts Catalanes 303, Entresuelo 1"}},
 "baseSalary": {"@type": "MonetaryAmount", "currency": "EUR",
   "value": {"@type": "QuantitativeValue", "value": 1273.5, "unitText": "MONTH"}}}
```

Claves completas de `studentische-assistenz.html`: `@context, @type, baseSalary, datePosted, description, directApply, employmentType, hiringOrganization, identifier, jobLocation, title, url, validThrough` (13, sin `jobLocationType`/`applicantLocationRequirements`). Relevante para §22.2: si Pavivasa añade `JobPosting`, `baseSalary` solo aparece en la oferta INTERN/PART_TIME, mientras `jobLocationType`+`applicantLocationRequirements` solo en las dos remotas.

### 6.6 `Article` (`projects/large-farm-lleida.html`; ×8)

```json
{"@context": "https://schema.org", "@type": "Article",
 "headline": "large operation M. – Fabric Building 15.35 × 40 × 7.10 m",
 "description": "600 m² Machinery Shelter with hoher eaves height for combine harvester & kompletten Fuhrpark.",
 "image": "https://globotent.com/assets/images/satteldachhalle-15x40-01.png",
 "datePublished": "2025-01-01",
 "author": {"@type": "Organization", "name": "Globotent"},
 "publisher": {"@type": "Organization", "name": "Globotent",
               "logo": {"@type": "ImageObject", "url": "https://globotent.com/assets/logo.png"}}}
```

Sin `dateModified`, `mainEntityOfPage` ni `url`.

---

## 7. Pie `.site-footer` — markup literal (`home.html:615-663`)

```html
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">
      <div>
        <div class="site-footer__logo"><img src="assets/images/logo_white.png" alt="Globotent" loading="lazy"></div>
        <p>Globotent liefert Arched Storage Tents and Fabric Buildings for Industry &amp; Agriculture sowie stützenfreie Sport-Überdachungen for Padel, Tennis and Equestrian in ganz Europa. consultation, planning, Delivery and Installation from a single source.</p>
      </div>
      <div>
        <h4>Industry &amp; Agriculture</h4>
        <a href='/categories/storage-tents'>Arched Storage Tents</a>
        <a href='/categories/fabric-buildings'>Fabric Buildings</a>
        <a href='/pages/all-models'>All Models</a>
        <h4 style="margin-top:22px">globotent SPORTS</h4>
        <a href='/pages/sport'>Sport-Welt</a>
        <a href='/categories/padel-tennis-covers'>Padel- &amp; Tennisüberdachung</a>
        <a href='/categories/riding-arena-covers'>Riding Arena Cover</a>
        <a href='/categories/pickleball'>Pickleball-Überdachung</a>
      </div>
      <div>
        <h4>Tools &amp; Rechner</h4>
        <a href='/pages/3d-preview'>3D Photo Preview</a>
        <a href='/pages/shelter-finder'>Shelter Finder</a>
        <a href='/pages/compare-shelters'>Compare Shelters</a>
        <a href='/pages/round-bale-calculator'>Round Bale Calculator</a>
        <a href='/pages/machinery-calculator'>Machinery Calculator</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href='/pages/about-us'>About Us</a>
        <a href='/pages/jobs'>Jobs &amp; Karriere</a>
        <a href='/pages/reference-projects'>References</a>
        <a href='/pages/customer-reviews'>Customer Reviews</a>
        <a href='/pages/faq'>FAQ</a>
        <a href='/pages/contact'>Contact</a>
        <a href='/pages/request-a-quote'>Request a Quote</a>
        <a href='/pages/legal-notice'>Legal Notice</a>
        <a href='/pages/privacy-policy'>Privacy Policy</a>
        <a href='/pages/terms-and-conditions'>Terms & Conditions</a>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>&copy; 2026 Globotent Carpas S.L.. All rights reserved.</span>
      <span>Office ES: Gran Vía de les Corts Catalanes 303, Entresuelo 1, 08014 Barcelona &bull; Telefon: +34 657 472 335 &bull; Email: info@globotent.com</span>
    </div>
    <div class="site-footer__disclaimer">
      <p><strong>* Note on permits and approvals:</strong> Whether your shelter can be erected without a building permit depends on several factors: <strong>construction type</strong> (arched, gable, livestock, riding arena, padel), <strong>location and postcode</strong>, regional and municipal regulations, and <strong>snow and wind load zones</strong>. As standard, with the right configuration we exceed <strong>220 kg/m² snow load</strong> and <strong>100 kg/m² wind load</strong> — for higher requirements we reinforce the structure. Our team supports you from consultation to final installation: we liaise with your local authority, clarify all conditions and deliver technical drawings and structural calculations. We see ourselves not as mere distributors, but as a one-stop provider — for your legal peace of mind.</p>
    </div>
  </div>
</footer>
```

Observaciones estructurales:

- `<footer>` sin `role`/`aria-label`; las columnas son `<div>` anónimos, no `<nav>` ni `<ul>`: los enlaces son `<a>` sueltos apilados por `display:block`.
- `<h4>` como rótulo de columna: en la home el encabezado anterior es `<h2>` (salto h2→h4, §16).
- Segundo rótulo con estilo inline `style="margin-top:22px"`.
- Copyright con doble punto literal `S.L..`. Año `2026` escrito a mano (no JS).
- Teléfono y email del NAP **en texto plano**, no `<a href="tel:">`/`mailto:` — aunque exista CSS para ello (`css:3893-3901`, ver §8.6).
- Sin redes sociales, sin newsletter, sin badges, sin certificados, sin selector de idioma, sin mapa, sin horario, sin "volver arriba".
- Idéntico en las 78 páginas (md5 del bloque normalizado: 1 variante).

---

## 8. Pie — CSS completo, cascada y valores finales

### 8.1 Bloque base (`css:767-814`)

```css
.site-footer{ background:var(--brand-dark); color:#9eb3bd; padding:64px 0 24px; margin-top:80px}
.site-footer__grid{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:48px}
.site-footer h4{ color:#fff; font-size:.95rem; text-transform:uppercase; letter-spacing:.08em; margin:0 0 18px}
.site-footer a{ color:#9eb3bd; display:block; padding:4px 0; font-size:.95rem}
.site-footer a:hover{ color:var(--brand-lime)}
.site-footer__logo img{ height:52px; margin-bottom:16px; display:block}
.site-footer__bottom{ border-top:1px solid rgba(255,255,255,.1); padding-top:24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:.85rem}
.site-footer__disclaimer{ border-top:1px solid rgba(255,255,255,.08); margin-top:18px; padding-top:18px; font-size:.78rem; line-height:1.55; color:#7d909a}
.site-footer__disclaimer p{ margin:0; max-width:none}
.site-footer__disclaimer strong{ color:#b3c5cd; font-weight:600}
```

### 8.2 Breakpoints (`css:895-948`)

```css
@media (max-width:900px){ … .site-footer__grid{ grid-template-columns:1fr 1fr} … }   /* css:930-931 */
@media (max-width:560px){ … .site-footer__grid{ grid-template-columns:1fr} … }       /* css:947-948 */
```

Con `1fr 1fr` la columna 1 (logo+texto) y la 2 (Industry+SPORTS) quedan en la primera fila; Tools y Company en la segunda. No hay acordeón móvil.

### 8.3 Reglas tardías que cambian el pie (`css:3603, 3827-3834, 3841-3848, 3882-3884, 3893-3901`)

```css
.site-footer{ padding-bottom:96px}                                   /* css:3603 */
.site-footer__grid a{ display:inline-flex; align-items:center; min-height:44px; padding:6px 0; line-height:1.35}   /* css:3827 */
.site-footer__grid h4{ margin-bottom:8px}                            /* css:3833 */
.site-footer{ padding-right:80px; padding-bottom:96px}               /* css:3841 */
@media (max-width:560px){ .site-footer{ padding-right:24px; padding-bottom:96px} }   /* css:3844 */
.site-footer__grid a{ min-width:48px; padding:6px 12px 6px 0}        /* css:3882 */
.site-footer__bottom a[href^="tel:"],.site-footer__bottom a[href^="mailto:"]{ display:inline-flex; align-items:center; min-height:44px; padding:4px 8px; margin:0 -8px; color:var(--brand-lime,#9eb3bd); text-decoration:underline; font-weight:600}   /* css:3893 */
```

### 8.4 Valores finales (tras la cascada)

| Propiedad | Escritorio | ≤900 px | ≤560 px | Fuente |
|---|---|---|---|---|
| Fondo / texto | `#061827` / `#9eb3bd` | = | = | `css:768-769` |
| `padding` del footer | `64px 80px 96px 0` | = | `64px 24px 96px 0` | `css:770, 3603, 3841, 3845` |
| `margin-top` | `80px` | = | = | `css:771` |
| Columnas | `1.4fr 1fr 1fr 1fr`, `gap:40px` | `1fr 1fr` | `1fr` | `css:774, 930, 947` |
| Rótulo `h4` | `#fff`, `.95rem`, `uppercase`, `letter-spacing:.08em`, `font-weight:800` (herencia de `h1,h2,h3,h4,h5` `css:51-55`), `margin:0 0 8px` | = | = | `css:777-782, 3833` |
| Enlace de columna | `inline-flex`, `#9eb3bd`, `.95rem`, `min-height:44px`, `min-width:48px`, `padding:6px 12px 6px 0`, `line-height:1.35`; hover `#7ec700` | = | = | `css:783-789, 3827-3832, 3882-3884` |
| Logo | `logo_white.png` 170×97 nativo → `height:52px` (≈91 px ancho), `margin-bottom:16px` | = | = | `css:790-793` |
| Párrafo de marca | hereda: `1rem`, `line-height:1.5`, `#9eb3bd`, `margin:0 0 1em` | = | = | `css:34-42, 64-65` |
| `__bottom` | `flex; space-between; wrap; gap:12px; .85rem; border-top 1px rgba(255,255,255,.1); padding-top:24px` | = (los dos `span` envuelven) | = | `css:794-801` |
| `__disclaimer` | `.78rem/1.55`, `#7d909a`, `border-top rgba(255,255,255,.08)`, `margin-top:18px; padding-top:18px`; `strong` `#b3c5cd` 600 | = | = | `css:802-814` |

Contraste (calculado, WCAG 2.1 — luminancia relativa por canal con corrección gamma sRGB, no promedio lineal): `#9eb3bd` sobre `#061827` ≈ 8.25:1 (AA/AAA); `#7d909a` sobre `#061827` ≈ 5.42:1 (AA en texto normal, el disclaimer es `.78rem` ≈ 12.5 px); `#7ec700` (hover) sobre `#061827` ≈ 8.61:1. El veredicto cualitativo (AA/AAA) no cambia.

### 8.5 Por qué `padding-right:80px` y `padding-bottom:96px`

Los 80 px de la derecha (más los 24 px del `.container`) reservan sitio para `.wa-fab` (`right:24px`, ancho ≈ 150 px) — aunque el propio JS oculta el FAB cuando el pie es visible (§10.4), así que la reserva es redundante. Los 96 px inferiores reservan sitio para `.mobile-sticky-cta` (`css:1130`), que **no existe en ningún HTML** (§14.2): el pie arrastra un hueco de 96 px en todos los anchos sin nada que lo justifique.

### 8.6 Duda de renderizado: `display:inline-flex` en los enlaces

`.site-footer a{display:block}` (`css:783`, especificidad 0,1,1) es anulado por `.site-footer__grid a{display:inline-flex}` (`css:3827`, misma especificidad, posterior): gana `inline-flex` por orden de cascada. **Resuelto por razonamiento CSS puro, sin necesidad de navegador**: los `<a>` inline-flex, separados solo por saltos de línea en el HTML, fluyen en línea como palabras y se envuelven (wrap) según el ancho disponible de la columna — no se apilan verticalmente salvo que el ancho de columna sea menor que cada enlace individual. Es decir, en producción el pie de Globotent **fluye como enlaces en línea que se envuelven, no como lista vertical** (salvo que alguna columna sea más estrecha que el enlace más largo). Esto es una réplica probablemente accidental del layout de Globotent, no una decisión de diseño deliberada; en §22.3 Pavivasa decide conscientemente usar `flex flex-col` (lista vertical) como decisión propia, no como copia de este comportamiento.

### 8.7 CSS del pie sin uso

- `.site-footer__bottom a[href^="tel:"], …mailto` (`css:3893-3901`): la barra inferior no contiene ningún `<a>`.

---

## 9. Pie — inventario de enlaces por columna

| Col. | Rótulo (`h4`) | Enlace (texto literal) | `href` | Nota |
|---|---|---|---|---|
| 1 | — (logo + párrafo) | — | — | Párrafo en alemán/inglés mezclado. |
| 2 | Industry & Agriculture | Arched Storage Tents | `/categories/storage-tents` | |
| 2 | | Fabric Buildings | `/categories/fabric-buildings` | |
| 2 | | All Models | `/pages/all-models` | |
| 2 | globotent SPORTS (`style="margin-top:22px"`) | Sport-Welt | `/pages/sport` | Texto en alemán. |
| 2 | | Padel- & Tennisüberdachung | `/categories/padel-tennis-covers` | Alemán. |
| 2 | | Riding Arena Cover | `/categories/riding-arena-covers` | |
| 2 | | Pickleball-Überdachung | `/categories/pickleball` | Alemán. |
| 3 | Tools & Rechner | 3D Photo Preview | `/pages/3d-preview` | Rótulo mitad alemán. |
| 3 | | Shelter Finder | `/pages/shelter-finder` | |
| 3 | | Compare Shelters | `/pages/compare-shelters` | |
| 3 | | Round Bale Calculator | `/pages/round-bale-calculator` | |
| 3 | | Machinery Calculator | `/pages/machinery-calculator` | |
| 4 | Company | About Us | `/pages/about-us` | |
| 4 | | Jobs & Karriere | `/pages/jobs` | |
| 4 | | References | `/pages/reference-projects` | |
| 4 | | Customer Reviews | `/pages/customer-reviews` | |
| 4 | | FAQ | `/pages/faq` | |
| 4 | | Contact | `/pages/contact` | |
| 4 | | Request a Quote | `/pages/request-a-quote` | |
| 4 | | Legal Notice | `/pages/legal-notice` | Legales mezclados con la columna corporativa, sin separación visual. |
| 4 | | Privacy Policy | `/pages/privacy-policy` | |
| 4 | | Terms & Conditions | `/pages/terms-and-conditions` | `&` sin escapar en el HTML. |

Barra inferior (texto plano): `© 2026 Globotent Carpas S.L.. All rights reserved.` · `Office ES: Gran Vía de les Corts Catalanes 303, Entresuelo 1, 08014 Barcelona • Telefon: +34 657 472 335 • Email: info@globotent.com`.

Total: 22 enlaces, 3 legales, 0 externos, 0 `rel="nofollow"`. Páginas del sitemap **no enlazadas** desde el pie: `pages/team`, `pages/downloads`, `pages/sustainability`, `pages/technical-glossary`, `pages/calculators`, `pages/produkte`, `guides/`, `projects/*`.

---

## 10. WhatsApp flotante `.wa-fab`

### 10.1 Markup (`home.html:593-599`, idéntico en las 78 páginas)

```html
<a class="wa-fab" href="https://wa.me/34657472335?text=Hi%20Globotent%2C%20I%20have%20a%20question%20about%20a%20shelter." target="_blank" rel="noopener" aria-label="Enquire via WhatsApp">
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="currentColor" d="M16 3C9 3 3.5 8.6 3.5 15.5c0 2.4.7 4.8 2 6.8L3 29l6.9-2.3c2 1.1 4.2 1.7 6.1 1.7 7 0 12.5-5.6 12.5-12.5C28.5 8.6 23 3 16 3zm0 22.9c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1-1.6-1.5-3.5-1.5-5.4 0-5.8 4.7-10.5 10.2-10.5S26.2 9.7 26.2 15.5 21.5 25.9 16 25.9zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.4.8.5-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z"/>
  </svg>
  <span>WhatsApp</span>
</a>
```

Posición en el DOM: tras `</main>` y tras el `.lightbox`, antes del `.exit-popup` y del `<footer>`. Mensaje prellenado: `Hi Globotent, I have a question about a shelter.` (mismo en las 78 páginas, sin contexto de producto). Sin `rel="noreferrer"`.

### 10.2 CSS (`css:1739-1777`)

```css
.wa-fab{ position:fixed; bottom:24px; right:24px; z-index:45; display:inline-flex; align-items:center; gap:8px;
  background:#25D366; color:#fff; padding:12px 18px; border-radius:50px; font-weight:800; font-size:.88rem;
  letter-spacing:.04em; text-transform:uppercase; box-shadow:0 8px 24px rgba(37,211,102,.35);
  transition:transform .2s,box-shadow .2s,background .2s}
.wa-fab:hover{ background:#1ebe5c; color:#fff; transform:translateY(-2px); box-shadow:0 14px 30px rgba(37,211,102,.45)}
.wa-fab svg{ width:22px; height:22px}
.wa-fab span{ line-height:1}
@media (max-width:560px){
  .wa-fab{ bottom:92px; padding:12px; font-size:0}
  .wa-fab span{ display:none}
  .wa-fab svg{ width:26px; height:26px}
}
```

Y tardías (`css:3605-3610`):

```css
.wa-fab.is-hidden{ opacity:0; transform:translateY(20px); pointer-events:none}
body.is-product-detail .wa-fab{ display:none}
```

| Aspecto | Escritorio | ≤560 px |
|---|---|---|
| Tamaño | ≈ 150 × 46 px (icono 22 + gap 8 + texto .88rem 800 uppercase; padding 12/18) | 50 × 50 px circular (icono 26 + padding 12) |
| Posición | `bottom:24px; right:24px` | `bottom:92px; right:24px` (deja 92 px para una barra sticky que no existe, §14.2) |
| Color | `#25D366`, hover `#1ebe5c` | = |
| Sombra | `0 8px 24px rgba(37,211,102,.35)`; hover `0 14px 30px rgba(37,211,102,.45)` | = |
| Hover | `translateY(-2px)` | = |
| Animación pulse | **No hay.** | = |
| `z-index` | 45 (por debajo del header 50 y del exit-popup 100; por encima de la barra sticky 40) | = |

`opacity` **no** está en la lista de `transition` del `.wa-fab`, así que al añadir `.is-hidden` el botón desaparece de golpe y solo el `translateY(20px)` se anima en `.2s` (y viceversa al volver).

### 10.3 Cuándo aparece

- Siempre visible desde la carga (no espera scroll ni tiempo). No hay retardo de entrada.
- Se oculta con `.is-hidden` cuando `.site-footer` intersecta ≥ 5 % del viewport (`js:370-376`):

```js
const waFab = document.querySelector('.wa-fab');
const footerEl = document.querySelector('.site-footer');
if (waFab && footerEl && 'IntersectionObserver' in window) {
new IntersectionObserver(entries => {
entries.forEach(e => waFab.classList.toggle('is-hidden', e.isIntersecting));
}, { threshold: 0.05 }).observe(footerEl);
}
```

- **No existe** en las 36 páginas de producto (`body.is-product-detail .wa-fab{display:none}`). El HTML sí lo incluye (78/78); solo lo esconde CSS. No está en el código por qué (probable CTA propio de producto: fuera de esta dimensión).

### 10.4 Tracking

Listener delegado en captura (`js:645-651`): cualquier click en `<a>` cuyo `href` case `/wa\.me|api\.whatsapp\.com|whatsapp/i` hace `dataLayer.push({event:'whatsapp_click'})`; `tel:` → `phone_click`; `mailto:` → `email_click`. El interceptor de View Transitions (`js:100-115`) ignora este enlace por empezar por `http` y por `target="_blank"`.

---

## 11. Exit popup `.exit-popup`

### 11.1 Markup (`home.html:601-613`, idéntico en las 78 páginas)

```html
<div class="exit-popup" data-exit-popup hidden>
  <div class="exit-popup__backdrop"></div>
  <div class="exit-popup__box" role="dialog" aria-labelledby="exit-title">
    <button class="exit-popup__close" aria-label="Close" data-exit-close>&times;</button>
    <div class="exit-popup__icon">⏱️</div>
    <h2 id="exit-title">Fast advice within 24h</h2>
    <p>Answer 3 questions — we'll send you a no-obligation quote within one business day.</p>
    <div class="exit-popup__actions">
      <a class='btn btn--primary btn--lg' href='/pages/request-a-quote'>Start 24h quote</a>
      <button type="button" class="btn btn--secondary" data-exit-close>Maybe later</button>
    </div>
  </div>
</div>
```

Un emoji como icono (`⏱️`, `font-size:3rem`). El `<h2>` entra en el outline de encabezados de todas las páginas aunque el diálogo esté oculto (§16).

### 11.2 CSS (`css:2724-2783` + `css:3731-3733`)

```css
.exit-popup{ position:fixed; inset:0; z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; opacity:0; transition:opacity .3s; pointer-events:none}
.exit-popup.is-visible{ opacity:1; pointer-events:auto}
.exit-popup[hidden]{ display:none}
.exit-popup__backdrop{ position:absolute; inset:0; background:rgba(6,24,39,.72)}
.exit-popup__box{ position:relative; max-width:520px; background:#fff; border-radius:16px; padding:40px 32px; text-align:center; box-shadow:0 30px 60px rgba(0,0,0,.3); transform:scale(.94); transition:transform .3s}
.exit-popup.is-visible .exit-popup__box{ transform:scale(1)}
.exit-popup__close{ position:absolute; top:12px; right:12px; width:36px; height:36px; border-radius:50%; border:0; background:var(--color-bg-soft); font-size:1.3rem; cursor:pointer; color:var(--color-title)}
.exit-popup__close:hover{ background:var(--brand-green); color:#fff}
.exit-popup__icon{ font-size:3rem; margin-bottom:8px}
.exit-popup h2{ margin:0 0 10px; font-size:1.5rem}
.exit-popup p{ margin:0 0 22px; color:var(--color-text)}
.exit-popup__actions{ display:flex; flex-direction:column; gap:10px}
/* tardía */
.exit-popup__close{ width:var(--touch-target-min); height:var(--touch-target-min)}   /* 48×48, css:3731 */
```

Botones: primario `.btn--primary.btn--lg` (56 px alto, `#1aa585`, hover `#12755e` + `translateY(-1px)`, `css:68-98`); secundario `.btn--secondary` (44 px → `min-height:48px` por `css:3835`, transparente con borde `#151719`, hover fondo verde, `css:99-106`). Apilados en columna, ancho natural (no `width:100%`).

### 11.3 Disparo y ciclo de vida (`js:345-368`)

```js
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
const exitPop = document.querySelector('[data-exit-popup]');
if (exitPop && !isTouchDevice && !sessionStorage.getItem('globotent_exit_shown')
&& window.matchMedia('(min-width:901px)').matches) {
let shown = false;
const show = () => {
if (shown) return; shown = true;
sessionStorage.setItem('globotent_exit_shown','1');
exitPop.hidden = false;
requestAnimationFrame(() => exitPop.classList.add('is-visible'));
};
const hide = () => {
exitPop.classList.remove('is-visible');
setTimeout(() => { exitPop.hidden = true; }, 300);
};
document.addEventListener('mouseout', e => {
if (e.clientY <= 0 && !e.relatedTarget) show();
});
exitPop.querySelectorAll('[data-exit-close]').forEach(b => b.addEventListener('click', hide));
exitPop.querySelector('.exit-popup__backdrop').addEventListener('click', hide);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !exitPop.hidden) hide(); });
}
```

| Condición / evento | Valor |
|---|---|
| Solo si | no táctil **y** viewport ≥ 901 px **y** no mostrado antes en esta pestaña (`sessionStorage['globotent_exit_shown']`) |
| Disparador | `mouseout` en `document` con `clientY <= 0` y `relatedTarget === null` (el cursor sale por el borde superior, hacia la barra del navegador) |
| Sin retardo mínimo | Puede saltar en el primer segundo. No hay temporizador de "tiempo en página" ni de scroll. |
| Mostrar | `hidden=false` → `rAF` → `.is-visible` (fade `.3s` + `scale(.94→1)`) |
| Cerrar | botón ×, "Maybe later", click en backdrop, `Escape`; `.is-visible` fuera → `hidden=true` a los 300 ms |
| Una vez por sesión de pestaña | `sessionStorage` (no `localStorage`): vuelve a salir en otra pestaña o tras cerrar el navegador |
| A11y | `role="dialog"` + `aria-labelledby`; **sin** `aria-modal="true"`, sin mover el foco al diálogo, sin trampa de foco, sin devolver el foco, sin `inert` en el resto, sin bloquear el scroll del body (a diferencia del lightbox, `js:301`) |
| Tracking | Ninguno específico (no hay `dataLayer.push` al abrir/cerrar). |

---

## 12. Banderas de idioma y `hreflang` (complemento del doc 02 §8)

### 12.1 Markup del selector (`home.html:101-112`)

```html
<div class="lang-switch" aria-label="Choose language">
  <button class="lang-switch__current" aria-expanded="false" aria-haspopup="true" type="button">
    <span class="lang-switch__flag flag flag--gb" aria-hidden="true"></span><span class="lang-switch__label">EN</span>
  </button>
  <ul class="lang-switch__menu" role="menu">
    <li><a aria-current="page" href="/" role="menuitem"><span class="flag flag--gb" aria-hidden="true"></span> English <small style="opacity:.6">(UK · INTL)</small></a></li>
    <li><a href="https://globotent.de/" role="menuitem" rel="alternate" hreflang="de"><span class="flag flag--de" aria-hidden="true"></span> Deutsch</a></li>
    <li><a href="https://globotent.es/" role="menuitem" rel="alternate" hreflang="es"><span class="flag flag--es" aria-hidden="true"></span> Español</a></li>
      <li><a href="https://globotent.pt/" role="menuitem" rel="alternate" hreflang="pt"><span class="flag flag--pt" aria-hidden="true"></span> Português</a></li>
</ul>
</div>
```

`aria-label` en un `<div>` sin `role` (no se expone). El `<button>` no tiene `aria-controls`. El `<svg>` chevron al que se refiere `.lang-switch__current svg{…rotate(180deg)}` (`css:1655-1658`) **no existe en el HTML** — CSS huérfano.

### 12.2 Banderas: CSS puro (`css:1662-1687`)

```css
.flag{ display:inline-block; width:22px; height:16px; border-radius:3px; overflow:hidden; box-shadow:0 0 0 1px rgba(0,0,0,.08); vertical-align:middle; flex:0 0 auto}
.flag--de{ background:linear-gradient(180deg,#000 0%,#000 33.33%,#dd0000 33.33%,#dd0000 66.66%,#ffce00 66.66%,#ffce00 100%)}
.flag--at{ background:linear-gradient(180deg,#ed2939 0%,#ed2939 33.33%,#fff 33.33%,#fff 66.66%,#ed2939 66.66%,#ed2939 100%)}   /* sin uso en HTML */
.flag--gb{ background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'>…Union Jack: #012169, #fff, #C8102E…</svg>"); background-size:cover; background-position:center}
.flag--es{ background:linear-gradient(180deg,#aa151b 0%,#aa151b 25%,#f1bf00 25%,#f1bf00 75%,#aa151b 75%,#aa151b 100%)}
.flag--pt{ background:linear-gradient(90deg,#046a38 0%,#046a38 40%,#da020e 40%,#da020e 100%)}
.lang-switch__menu .flag{ margin-right:2px}
.lang-switch__current .flag{ margin-right:4px}
```

22×16 px, radio 3 px, anillo de 1 px al 8 % de negro. Cuatro banderas por gradiente (DE, AT, ES, PT: bandas 33/33/33, 25/50/25 y 40/60) y una por SVG inline en data-URI (GB). Sin imágenes externas: 0 peticiones. `.flag--at` no se usa en ninguna página (0/78).

Responsive (`css:1731-1736`): en `@media (max-width:900px)`, `.lang-switch__label{display:none}` (el texto "EN" desaparece) y `.lang-switch__current{padding:8px 10px}` (padding reducido). En tablet/móvil el selector queda solo con bandera + chevron.

### 12.3 Coherencia `hreflang` ↔ menú

| Página | `<link hreflang="de/es/pt">` | Menú DE / ES | Menú PT |
|---|---|---|---|
| Home | raíces de cada dominio | raíz | raíz |
| Producto (`storage-tent-12x24`) | `globotent.de/produkte/rundbogenhalle-12x24.html`, `globotent.es/productos/carpa-agricola-12x24.html`, `globotent.pt/productos/carpa-agricola-12x24.html` | **raíz** (`https://globotent.de/`, `https://globotent.es/`) en las 78 páginas | localizada (`globotent.pt/productos/carpa-agricola-12x24.html`) |

Es decir, los `<link>` del head sí son página a página; el menú visible lleva a la portada del otro idioma salvo PT. Los `<a>` del menú llevan `rel="alternate" hreflang="xx"` (por eso el recuento total de `rel="alternate" hreflang` es 624 = 78 × (5 link + 3 a)).

---

## 13. Cookies, consentimiento y analítica

**No hay banner de cookies, CMP, Consent Mode ni `gtag('consent', …)`** en ninguna de las 78 páginas ni en `main.js` (grep de `cookie|consent|gdpr` en HTML: solo `.consent-row` en 3 formularios y el texto de la política de privacidad; en JS: `getCookie` para leer `_fbp`/`_fbc`).

Lo que sí hay:

1. **GTM `GTM-MR5F4PQR`** inline en el `<head>` de las 78 páginas (`html:13`), diferido hasta el primero de `['scroll','mousemove','touchstart','keydown','pointerdown']` (listeners `{passive:true, once:true}`) o `setTimeout(G, 4000)`. El comentario dice que el contenedor carga "GA4+Meta+Clarity". `<noscript><iframe ns.html>` tras `<body>` (`html:43-45`). Todo sin consentimiento previo.
2. **Capa de datos propia** (`js:597-651`): `window.dataLayer`, `dlPush()`, `genEventId()` (`crypto.randomUUID()` o `'ev-'+Date.now()+…`), `getCookie('_fbp'/'_fbc')`, `fbcFromUrl()` (construye `fb.1.{ts}.{fbclid}`), `ecUserData()` (email, teléfono E.164, nombre/apellido) — infraestructura para Meta Conversions API. Se añaden como `<input type="hidden">` (`event_id`, `fbp`, `fbc`, `event_source_url`, `client_user_agent`) a `form[data-netlify]` (`js:636-643`)… pero **ningún formulario servido tiene `data-netlify`** (0/78; ver §19), así que en producción ese módulo no hace nada. `window.gtEventId` sí se expone.
3. **Checkbox de privacidad** obligatorio en `request-a-quote`, `contact` y `3d-preview` (`.consent-row`, `css:1477-1500`): `flex; gap:10px; .9rem; color --color-title`; input `18×18`, `accent-color:var(--brand-green)`; enlace `--brand-green-deep` 700 subrayado.

```html
<label class="consent-row"><input type="checkbox" required><span>I have read the <a href='/pages/privacy-policy'>Privacy Policy</a> and accept it.</span></label>
```

4. **Política de privacidad** (`site/pages/privacy-policy.html:159-160`): "We use Google Analytics 4 with the anonymize_ip option enabled. We do not use marketing cookies or third-party cookies for advertising profiling." — contradice el comentario del GTM ("lädt GA4+Meta+Clarity") y el código de `_fbp`/`_fbc`. Es una observación del código, no una valoración legal.

Para Pavivasa: `CLAUDE.md:31` exige "Analítica y publicidad solo tras consentimiento (`components/layout/Consentimiento.tsx`)" — el patrón de Globotent **no** es reutilizable tal cual.

---

## 14. Otros elementos globales (presentes en las 78 páginas o solo en CSS/JS)

### 14.1 Lightbox `.lightbox` (HTML en 78/78, `home.html:583-590`)

```html
<div class="lightbox" data-lightbox hidden>
  <button class="lightbox__close" aria-label="Close">&times;</button>
  <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">‹</button>
  <img class="lightbox__img" alt="Enlarged shelter view" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
  <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">›</button>
  <div class="lightbox__counter"></div>
</div>
```

CSS (`css:1053-1110`, móvil `css:1598-1608`): `position:fixed; inset:0; background:rgba(6,24,39,.92); z-index:1000; padding:48px` (16 px en ≤900); imagen `max-width/height:100%; border-radius:8px; box-shadow:0 20px 60px rgba(0,0,0,.5)`; cierre 48×48 esquina superior derecha `font-size:42px`; flechas 56×56 circulares `rgba(255,255,255,.08)`; contador pill `rgba(0,0,0,.5)` abajo centrado. JS (`js:286-341`): fuentes = `[data-gallery-thumb][data-src]` o `[data-photo-gallery] [data-lightbox-trigger][href]`; abre con click en `[data-gallery-main]`; teclado `Escape/←/→`; swipe > 50 px; **bloquea scroll** (`document.body.style.overflow='hidden'`). Sin `role="dialog"`, sin trampa de foco. En la home no hay galería que lo use: markup inerte.

### 14.2 `.mobile-sticky-cta` — **solo CSS, 0 páginas**

`css:1130-1157`: `position:fixed; bottom:0; left:0; right:0; z-index:40; display:none; gap:12px; padding:12px 16px; background:#fff; box-shadow:0 -4px 20px rgba(6,24,39,.12); border-top:1px solid var(--color-border)`; `.btn{flex:1}`; `__call` 56×56 circular lima `#7ec700` sobre `#061827`, hover `background:var(--brand-lime-hover)` = `#84d814` + `color:var(--brand-dark)` (`css:1155-1157`). En `@media (max-width:900px)` (`css:1590-1593`): `.mobile-sticky-cta{display:flex}` y **`main{padding-bottom:84px}`** — esta última sí afecta a todas las páginas en móvil aunque la barra no exista. También `css:3838` (`min-width/height:48px`) y `css:4938` (`.sport-world .mobile-sticky-cta{border-top:1px solid #000}`). Es la barra a la que hacen sitio `.site-footer{padding-bottom:96px}` y `.wa-fab{bottom:92px}`.

### 14.3 `.splash` + `@keyframes loadbar` / `logo-pulse` — **solo CSS, 0 páginas**

```css
.splash{ position:fixed; inset:0; z-index:2000; background:var(--color-bg); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:20px; transition:opacity .5s ease}
.splash.is-done{ opacity:0; pointer-events:none}
.splash__logo img{ height:64px; animation:logo-pulse 1.4s ease-in-out infinite}
.splash__bar{ width:180px; height:3px; background:var(--color-border); border-radius:3px; overflow:hidden}
.splash__bar-fill{ height:100%; background:linear-gradient(90deg,var(--brand-green),var(--brand-lime)); animation:loadbar 1.2s ease-in-out infinite}
@keyframes logo-pulse{ 0%,100%{ opacity:.6; transform:scale(.96)} 50%{ opacity:1; transform:scale(1)} }
@keyframes loadbar{ 0%{ width:0; margin-left:0} 50%{ width:60%; margin-left:20%} 100%{ width:0; margin-left:100%} }
```
(`css:3340-3384`). Ni `.splash` ni `.is-done` aparecen en `main.js`. Pantalla de carga muerta.

### 14.4 `.maint-banner` — CSS + módulo JS, **0 páginas**

CSS `css:5334-5372` (fijo `top:92px; left:12px; z-index:40; max-width:min(92vw,400px); background:#061827; border-left:4px solid var(--brand-lime); border-radius:10px; .82rem`). Con `@media (max-width:520px)` inmediatamente después (`css:5372-5385`): `.maint-banner{font-size:.7rem; line-height:1.25; top:70px; left:8px; right:8px; max-width:none; padding:7px 6px 7px 11px; border-left-width:3px}` y `.maint-banner__x{font-size:1.2rem; padding:0 4px}`. JS `js:706-719`: busca `#maint-banner`, lo descarta si `sessionStorage['maint-dismissed']`, rellena `[data-maint-time]` con "Stand dd.mm.yyyy, hh:mm Uhr" (hora actual − 5 min), cierra con `.maint-banner__x` (recuerda) o solo a los 14 000 ms. `js:720-742` es un módulo distinto y no relacionado (precargador diferido del vídeo de fondo `video[data-bg-video]`, con comprobación de `prefers-reduced-motion` y Data-Saver). Sin markup en ninguna página.

### 14.5 `.avail-banner` + `@keyframes pulse` — **0 páginas**

`css:2784-2811`: pill `rgba(126,199,0,.15)`, punto 9 px lima con `animation:pulse 1.8s ease-in-out infinite` (anillo `box-shadow 0 0 0 0 → 0 0 0 8px rgba(126,199,0,.6→0)`). JS `js:377-386` (`[data-avail]`, `#avail-slots`, `#avail-recent`): calcula un hash del `pathname` y muestra "1-4 huecos" y un "hace X min" **falsos y deterministas** (`recentChoices = ['vor 12 min','vor 47 min','vor 2 h','vor 6 h','heute Morgen','gestern']`). No hay markup que lo active. Override (CSS huérfano sobre CSS huérfano, ya que `.avail-banner` tampoco tiene markup) `css:4915-4923`: `.sport-world .avail-banner{background:#fff; border:1px solid #000; color:#000}`, `.sport-world .avail-banner strong{color:#000}`, `.sport-world .avail-banner em{color:#323232}`, `.sport-world .avail-banner__dot{background:var(--sport-lime)}`. Ídem `[data-live-counter]` (`js:116-135`, contador que sube solo) y `#weather-snow` (`js:136-163`, geolocalización → zona de nieve): 0 páginas.

### 14.6 View Transitions entre páginas (78/78)

CSS `css:3403-3419`: `@view-transition{navigation:auto}`; `::view-transition-old(root){animation:vt-fade-out .18s ease forwards}` (→ `opacity:0; translateY(-10px)`); `::view-transition-new(root){animation:vt-fade-in .28s ease forwards}` (desde `opacity:0; translateY(10px)`). JS `js:100-115`: intercepta clicks en `a[href]` que no sean `#…`, `tel:`, `mailto:`, `http…` ni `target=_blank`, hace `preventDefault()` y `document.startViewTransition(() => location.href = a.href)`. Sin comprobación de `prefers-reduced-motion` en este módulo.

### 14.7 `.reveal` (IntersectionObserver, `js:3-15`)

Añade `.reveal` por JS a `.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other` y `.is-visible` al intersectar (`threshold:0.12, rootMargin:'0px 0px -60px 0px'`). CSS `css:3386-3398`: `opacity:0; translateY(18px); transition .6s ease`; con `prefers-reduced-motion:reduce` → visible sin transición. `class="reveal"` no está en ningún HTML (0/78): lo pone el JS.

### 14.8 Scroll suave y anclas

`html{scroll-behavior:smooth}` (`css:32-33`) + JS `js:252-263`: en `a[href^="#"]` hace `scrollTo({top: el.offsetTop - 90, behavior:'smooth'})` (90 px = 80 px de header + 10). No respeta `prefers-reduced-motion`.

### 14.9 Global de layout

`html,body{overflow-x:hidden; width:100%}` (`css:3580-3582`) — tapa desbordes horizontales pero rompe `position:sticky` en descendientes en algunos navegadores (el header es sticky: doc 02). `:root{--touch-target-min:48px}` (`css:3583-3584`). `input,select,textarea{font-size:16px}` (`css:3872-3873`) para evitar el zoom de iOS.

---

## 15. Skip link, foco y accesibilidad global

| Aspecto | Estado en el código |
|---|---|
| Skip link | **No existe** (`skip` en 0/78 páginas). |
| `main` | `<main id="main" tabindex="-1">` en 72/78; `<main>` sin atributos en `pages/sport.html`, `pages/produkte.html`, `pages/jobs.html` y los 3 `pages/jobs/*.html`. Nada enlaza a `#main` ni lo enfoca por JS: el `tabindex="-1"` es preparación sin uso. |
| `.sr-only` | Definido (`css:4946-4955`, patrón clip estándar) y **sin uso** en HTML. |
| Landmarks | `<header class="site-header">`, `<nav aria-label="Hauptnavigation">` (alemán, 78/78), `<main>`, `<footer>` sin nombre. Un solo `<nav>` por página. |
| Foco visible | **No hay regla global** `:focus-visible`: se usa el outline por defecto del navegador en `.btn`, enlaces del pie, `.wa-fab`, cierre del popup. Excepciones: `.field input/select/textarea:focus{outline:none; border-color:#1aa585; box-shadow:0 0 0 3px rgba(26,165,133,.15)}` (`css:852-855`), `.lang-switch__menu a:focus-visible` (fondo `rgba(26,165,133,.08)`, `css:1725`), `.contact-action:focus-visible` (`css:3919`), `.hero__dot:focus-visible{outline:2px solid #fff; outline-offset:3px}` (`css:4012`, sin uso), `css:4904` (`outline:2px solid var(--sport-lime); outline-offset:-2px`, mundo sport). |
| Objetivo táctil | `--touch-target-min:48px` aplicado a `.btn` (`css:3835`), `.lang-switch__current` (`css:3711`), `.exit-popup__close` (`css:3731`), enlaces/botones del header (`css:3722`), `.site-nav__main` (`css:3727`); 44 px en enlaces del pie (`css:3827`), migas (`css:3876`), `summary` (`css:3885`). |
| `prefers-reduced-motion` | Respetado en `.reveal` (`css:3393`), hero cine (`css:6149-6156`, `js:75`), slider lead (`js:652`), vídeo de fondo (`js:728`), parallax (`js:29`). **No** en View Transitions, scroll suave, hover `translateY`, exit popup, `.wa-fab`. |
| Diálogos | `.exit-popup`: `role="dialog"` + `aria-labelledby`, sin `aria-modal`/foco/trampa. `.lightbox`: sin `role`, botones con `aria-label`, bloquea scroll. |
| Menús | Lang: `aria-expanded`, `aria-haspopup`, `role="menu"/"menuitem"`, `aria-current="page"`; sin navegación por flechas. Nav: los `<a>` de grupo reciben `role="button"` + `aria-expanded` por JS (`js:281-282`). |
| Tabs del hero | `role="tablist"` / `role="tab"` + `aria-selected`, **sin** `aria-controls` ni `role="tabpanel"`, sin teclado (solo click). |
| Iconos | SVG con `aria-hidden="true"` (24 en la home); iconos de features `<img alt="" role="presentation" aria-hidden="true">` (4). |
| Idioma | `<html lang="en">` en 78/78 con abundante texto alemán sin `lang="de"` (pie, títulos de columna, menú, JSON-LD). |
| `aria-live` | 0/78. |

Inventario literal de atributos ARIA/`role`/`tabindex` en `home.html` (recuento):

```
1 aria-current="page"          2 aria-expanded="false"       1 aria-haspopup="true"
24 aria-hidden="true"          2 aria-label="5 of 5 stars"   6 aria-label="5 of 5"
1 aria-label="Call"            1 aria-label="Choose language" 2 aria-label="Close"
1 aria-label="Enquire via WhatsApp"   1 aria-label="Featured in industry press"
1 aria-label="Globotent — clear-span buildings & covers"     1 aria-label="Hauptnavigation"
1 aria-label="Next image"      1 aria-label="Open menu"      1 aria-label="Previous image"
1 aria-labelledby="exit-title" 3 aria-selected="false"       1 aria-selected="true"
1 role="dialog"  1 role="menu"  4 role="menuitem"  4 role="presentation"  4 role="tab"  1 role="tablist"
1 tabindex="-1"
```

---

## 16. Jerarquía de encabezados de la home (`home.html`, orden del DOM)

```
h1  Agricultural buildings for farms                       (hero; el texto cambia por JS con cada pestaña)
h2  Fast, robust, permit-free*
  h3  Permit-free*  ·  h3  Installed in 1 day  ·  h3  Delivery included  ·  h3  One-stop provider
h2  Your building up in a few days                         (montaje con vídeo)
h2  Real people. Real buildings.                           (muro de equipo)
h2  The right solution for every operation.
  h3  Industry & Agriculture                               (rótulo de grupo, no de tarjeta)
  h3  Arched storage tents  ·  h3  Fabric buildings
  h3  globotent SPORTS                                     (rótulo de grupo)
  h3  Padel & tennis court covers  ·  h3  Riding arena covers  ·  h3  Pickleball court covers
h2  Most popular shelters
  h3  Arched Storage Tent 9.15 × 20 × 4.50 m  ·  h3  Arched Storage Tent 12.20 × 24 × 6.10 m
  h3  Fabric Building 12.20 × 30 × 6.40 m  ·  h3  Fabric Building 15.35 × 40 × 7.10 m
h2  Request a 3D preview — see how the shelter will look on your land
h2  Which shelter fits your need?
  h3  Round Bale Calculator  ·  h3  Machinery Calculator  ·  h3  Compare Shelters
h2  Globotent shelters in action.
  h3  The M. family  ·  h3  W. farm  ·  h3  Large operation M.
h2  4.96 out of 5 from over 127 reviews
h2  Why professionals choose Globotent
  h3  Eurocode certified  ·  h3  Established Spanish company  ·  h3  In-house installation team  ·  h3  Industrial warranty
h2  What you should know before buying a shelter
  h3  Snow load by zone  ·  h3  Planning permission  ·  h3  PVC tarpaulin: 750 vs 900 g/m²  ·  h3  Ground anchoring
h2  Ready for your shelter?                                (CTA final)
h2  Fast advice within 24h                                 (exit popup, oculto)
h4  Industry & Agriculture  ·  h4  globotent SPORTS  ·  h4  Tools & Rechner  ·  h4  Company   (pie)
```

Recuento: 1 h1, 13 h2, 29 h3, 4 h4, 0 h5/h6. Problemas: salto h2→h4 en el pie (no hay h3 intermedio); el h2 del popup oculto figura en el outline; "Industry & Agriculture" y "globotent SPORTS" son h3 hermanos de las tarjetas que agrupan (mismo nivel en vez de superior). Página de producto: 1 h1 + 4 h2 (+ h3 no contados).

---

## 17. `alt` de imágenes de la home (40 `<img>`)

| Grupo | `alt` | Atributos | Juicio |
|---|---|---|---|
| Logo header (`assets/logo.png`) | `Globotent Logo` | dentro de `<a aria-label='Globotent Home'>` | Redundante con el aria-label del enlace; "Logo" sobra. |
| Logo pie (`logo_white.png`) | `Globotent` | `loading="lazy"` | Correcto. |
| 4 fondos del hero cine (`hero-*.jpg` en `<picture>`) | `""` | 1.º `fetchpriority="high" decoding="async"`, resto `loading="lazy" decoding="async"` | Decorativos, correcto. |
| 4 iconos de features (`selection_quote.png`, `express_setup.png`, `delivery_truck.png`, `permit_management.png`) | `""` | `role="presentation" aria-hidden="true" loading="lazy"` | Triple redundancia inofensiva. |
| 5 miniaturas del mega menú | `""` | `aria-hidden="true" loading="lazy"` | Correcto (el texto está en `<strong>`). |
| 6 tarjetas de colección | `Arched storage tents`, `Fabric buildings`, `Padel & tennis court covers`, `Riding arena covers`, `Pickleball court covers` (+1) | | Duplican el h3 de la tarjeta; aceptable. |
| 4 tarjetas de producto | Nombre completo del producto | una usa `src="data:image/gif;base64,…"` 1×1 (placeholder) | Ver doc 04. |
| 11 fotos del muro de equipo (`team-globotent-01…11.jpg`) | Descriptivas ("Two installers preparing the foundation", …) | | Bien. |
| 3 casos (`rundbogenhalle-9x20-01.png`, `satteldachhalle-12x30-02.jpg`, `satteldachhalle-15x40-01.png`) | `The M. family`, `W. farm`, `Large operation M.` | | Repiten el h3. |
| Antes/después (`globotent-vorher.webp`, `globotent-nachher.webp`) | `Site before installation…`, `Site with installed…` | | Bien. |
| Lightbox | `Enlarged shelter view` | `src` 1×1 gif | Genérico, se reutiliza para cualquier imagen. |

Ninguna imagen sin atributo `alt`. Todas decorativas con `alt=""`.

---

## 18. Página 404 y thank-you

### 18.1 404

**No hay 404 propia**: ni `404.html` en el espejo ni en el servidor. `curl -I https://globotent.com/this-page-does-not-exist-xyz` → `HTTP/2 404`, `server: Netlify`, cuerpo = **plantilla por defecto de Netlify** ("Page not found", tarjeta 364 px, `system-ui`, enlace teal `rgb(2 128 125)`, soporte `prefers-color-scheme: dark`, texto "If this is your site… Netlify's 'page not found' support guide"). Sin header, pie, logo, buscador ni enlaces al sitio. `/404.html` también devuelve 404.

### 18.2 Thank-you (`site/pages/thank-you.html`)

Head: igual que el resto + `<meta name="robots" content="noindex,nofollow">` (último hijo del head, línea 39); `title` `Thank you! | Globotent`; `description` "We've received your enquiry. We'll respond within 24 hours with a personalised quote."; preload de `hero_banner_1.webp`; JSON-LD `Organization` mínimo. `x-default` → `https://globotent.com/seiten/danke.html` (bug §3). Aparece en `sitemap.xml` pese al `noindex`.

Cuerpo (`<main id="main" tabindex="-1">`):

```html
<section class="page-hero">
  <div class="container page-hero__inner" style="text-align:center">
    <h1>Thanks for your enquiry!</h1>
    <p style="color:#dfe7ea;margin:10px 0 0;font-size:1.15rem;max-width:600px;margin-left:auto;margin-right:auto">We've received your request. Our team will respond within 24 hours with a personalised, no-obligation quote.</p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:30px">
      <a href="https://wa.me/34657472335?text=Hi%20Globotent%2C%20I%20just%20sent%20my%20request..." class="btn btn--primary btn--lg">💬 Continue on WhatsApp</a>
      <a href="tel:+34657472335" class="btn btn--secondary btn--lg">📞 Call now</a>
      <a class='btn btn--ghost-light btn--lg' href='/'>Back to home</a>
    </div>
  </div>
</section>
```

Una sola sección `page-hero` (fondo oscuro, ver doc 06) con estilos inline; tres CTA de 56 px: WhatsApp (verde, emoji 💬, mensaje prellenado distinto al del FAB), teléfono (`.btn--secondary`: sobre fondo oscuro el borde `#151719` es casi invisible — duda de contraste), "Back to home" (`.btn--ghost-light`, blanco). Después: `.wa-fab`, `.exit-popup`, pie idénticos. **No hay evento de conversión** en JS para esta página: el único código dependiente de ruta (`js:562-577`) comprueba `pathname.endsWith('request-for-quote.html')`, un nombre que **no existe** en el sitio (`request-a-quote.html`) → código muerto; la conversión, si se mide, se hace desde GTM por URL.

---

## 19. Formularios: destino y campos (contexto del thank-you)

```html
<!-- site/pages/request-a-quote.html:138-139 -->
<form action='../pages/thank-you' class='form-grid' method='POST' name='angebot-rfq' style='grid-template-columns:1fr 1fr;gap:18px'>
<input type="hidden" name="form-name" value="angebot-rfq">
<!-- contact.html:160 --> <form action='../pages/thank-you' class='form-grid' method='POST' name='kontakt' …>
<!-- 3d-preview.html:139 --> <form action='../pages/thank-you' class='form-grid' enctype='multipart/form-data' method='POST' name='3d-vorschau' …>
```

- `action` relativa `../pages/thank-you` (sin `.html`), `method=POST`, `name` en alemán. `<input type="hidden" name="form-name">` en 4 páginas y **0** `data-netlify`/`netlify-honeypot`/reCAPTCHA en el HTML servido. Inferencia (no está en el código): es el patrón de Netlify Forms tras el post-procesado de Netlify, que elimina el atributo `data-netlify` e inyecta `form-name`; eso explicaría por qué `form[data-netlify]` (`js:636`) no encuentra nada en producción.
- Prefill por `sessionStorage['globotent_config']` desde el configurador (`js:562-577`) apunta a una ruta inexistente (ver §18.2).

---

## 20. Pila de `z-index` global (todas las capas fijas/flotantes del CSS)

| `z-index` | Selector | Existe en HTML |
|---|---|---|
| 2000 | `.splash` | No |
| 1000 | `.lightbox` | Sí (78) |
| 100 | `.exit-popup` | Sí (78) |
| 100 | `.lang-switch__menu` | Sí (78) |
| 80 | `.site-nav__dropdown` | Sí |
| 50 | `.site-header` (sticky) | Sí |
| 45 | `.wa-fab` | Sí (78; oculto en 36) |
| 40 | `.mobile-sticky-cta` | No |
| 40 | `.maint-banner` | No |
| 0-6 | capas internas de heros/tarjetas | — |

Conflicto latente: `.lang-switch__menu` (100) vive dentro de `.site-header` (50, crea contexto de apilamiento por `position:sticky`+`z-index`), así que en realidad nunca supera al `.exit-popup` (100, raíz). Sin efecto visible salvo que ambos estén abiertos.

---

## 21. `robots.txt` y `sitemap.xml`

`robots.txt`: `User-agent: *` → `Allow: /`, `Disallow: /netlify/`, `Crawl-delay: 1`; luego 12 bloques que **permiten explícitamente** a crawlers de IA (`GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `Claude-Web`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `CCBot`, `Applebot-Extended`, `cohere-ai`); `Sitemap: https://globotent.com/sitemap.xml`.

`sitemap.xml`: 78 `<url>` (= todas las páginas del espejo), todas con `<changefreq>monthly</changefreq>`, **sin** `<lastmod>` ni `<priority>`, URLs con `.html` (la home como `https://globotent.com/`), incluye `pages/thank-you.html` (noindex). Sin `xhtml:link hreflang`.

---

## 22. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui (Pavivasa)

Estado actual del repo (leído, no modificado): `app/layout.tsx` ya tiene `metadata` con `metadataBase`, `title.template`, `openGraph` centralizado, `viewport.themeColor`, skip link `sr-only focus:not-sr-only`, `<main id="contenido">`, `Pie`, `BarraMovil`, `Consentimiento`, `EventosGlobales` y `<JsonLd data={schemaNegocioLocal()} />`; `lib/schema.tsx` exporta `schemaNegocioLocal`, `schemaServicio`, `schemaFAQ`, `schemaArticulo`, `schemaMigas`, `JsonLd`; `app/not-found.tsx` existe; `app/robots.ts` y `app/sitemap.ts` existen. Lo que sigue dice **qué tomar y qué no** de Globotent para cada pieza.

### 22.1 `app/layout.tsx` — `<head>` y metadatos

| Globotent | Pavivasa (Next 15) |
|---|---|
| `title` `"{Página} \| Globotent"` | Ya: `title.template: '%s \| ${nap.nombre}'`. Mantener el patrón `{Página} \| Marca`; en servicios `"{Servicio} en {zona} — {claim corto}"` como hace Globotent con medidas (`{Tipo} {W}×{L}×{H} — {m²}`). |
| `description` 85-253 car. | Objetivo 120-160; el `description` de jobs (253) se trunca. |
| `canonical` absoluta con `.html` ≠ enlaces internos | En Next: `alternates: { canonical: './' }` por ruta + `trailingSlash: true` (regla del proyecto) → una sola forma de URL. No repetir el desajuste `.html`/sin `.html`. |
| `hreflang` ×5 + `x-default` roto en 77/78 | Pavivasa es monolingüe: **no** emitir `alternates.languages`. Si algún día hay `va`/`en`, generar desde `alternates.languages` y validar `x-default` = URL real. |
| `og:image` rota (`globotent.de/../…`) | Ya resuelto por convención de fichero `app/opengraph-image.jpg` (1200×630). Añadir `opengraph-image` por servicio solo si hay foto real; nunca URL construida a mano. |
| `twitter:card` solo | Ya. Next hereda `twitter:title/description/image` del OG. |
| Favicon PNG 64×64 único, sin apple-touch-icon | Ya: `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`. Añadir `app/icon.svg` opcional. |
| `theme-color #1aa585` fijo | Ya: `viewport.themeColor: '#EDEFEC'`. Opcional: `[{media:'(prefers-color-scheme: dark)', color:…}]` si hay tema oscuro (no lo hay en Globotent). |
| `manifest.webmanifest` con `sizes` falsos | Si se quiere PWA-lite: `app/manifest.ts` (`MetadataRoute.Manifest`) con iconos reales 192/512 generados; si no, omitir el manifest (no aporta nada sin SW). |
| SW auto-desactivador | **No** registrar service worker. |
| Google Fonts con `media=print onload` + `noscript` | `next/font/google` (o `next/font/local`): ya en `app/fuentes.ts`. Sustituye preconnect/preload/print-swap y no bloquea. Para 'Clash Display' (no cargada en Globotent) no hay nada que replicar. |
| `preload as=image` del hero con `imagesrcset` + `fetchpriority=high` | `<Image priority sizes="100vw" />` en el hero de cada ruta (genera el `preload` con `imagesrcset` automáticamente). No poner `priority` a más de una imagen por página. |
| `dns-prefetch` a CDNs de three.js/model-viewer | No aplica (sin 3D). Regla del proyecto: sin librerías de animación/iconos. |
| CSS único bloqueante 125 KB + `?v=hash` | Next genera CSS por ruta con hash en el nombre: no hay que gestionar `?v=`. Presupuesto del proyecto: 100 KB JS inicial. |
| GTM inline diferido por interacción/4 s, sin consentimiento | **No copiar.** `Consentimiento.tsx` + `registrarEvento` (`lib/eventos.ts`); carga de terceros solo tras aceptar. Si se usa GTM: `next/script` con `strategy="lazyOnload"` **después** del consentimiento, nunca en el `<head>`. |
| `<html lang="en">` con texto alemán | `<html lang="es">` (ya). Si hay fragmentos en valenciano, `lang="ca"` en el elemento. |
| `meta robots noindex` en thank-you + incluida en sitemap | `app/presupuesto/gracias/page.tsx` (o equivalente) con `export const metadata = { robots: { index:false, follow:false } }` **y** excluida en `app/sitemap.ts`. |

### 22.2 `lib/schema.tsx` — JSON-LD

| Bloque Globotent | Decisión Pavivasa |
|---|---|
| `Organization` mínimo ×78 sin `@id` | Un solo `LocalBusiness` (subtipo: `GeneralContractor` o `HomeAndConstructionBusiness`) con `@id = ID_NEGOCIO` en `layout.tsx` (ya: `schemaNegocioLocal()`), con `address` completa, `telephone`, `areaServed`, `geo`, `openingHoursSpecification`, `priceRange` — campos que a Globotent le faltan. `Organization` aparte solo si hace falta `founder`/`vatID`; en ese caso enlazado por `@id`, no duplicado en cada página. |
| `LocalBusiness` con `AggregateRating` + 6 `Review` | **Prohibido** (`CLAUDE.md:29`): "Sin `AggregateRating` mientras no haya reseñas verificables". Tampoco `Review` inventadas (`CLAUDE.md:20`). Si en el futuro hay reseñas de Google verificables, `Review` con `author.name` real y `datePublished`, y `AggregateRating` calculado del mismo origen. |
| `Organization`+`AggregateRating` en la página de reseñas | No. |
| `JobPosting` ×3 | No aplica (sin página de empleo). Si la hubiera: `datePosted`, `validThrough`, `jobLocation` con dirección real (Globotent la deja en `addressCountry` solo). |
| `Article` ×8 en proyectos | `schemaArticulo` (ya). Añadir lo que Globotent omite: `dateModified`, `mainEntityOfPage`, `url`, `author` como la empresa con `@id`. |
| Sin `BreadcrumbList` pese a migas HTML | `schemaMigas` (ya) en cada página interior, alineado con `components/layout/Migas.tsx`. |
| Sin `FAQPage` en `faq.html` | `schemaFAQ` (ya) solo donde el `<details>`/acordeón muestre el mismo texto. |
| Sin `Product`/`Service` | `schemaServicio` (ya) por `[servicio]`, con `provider: {"@id": ID_NEGOCIO}` y `areaServed`. |
| Un `<script>` por bloque, sin `@graph` | Mantener `JsonLd` por bloque (más simple de depurar) pero enlazar por `@id`. |

### 22.3 `components/layout/Pie.tsx`

Qué tomar del pie de Globotent:

- Estructura de **4 columnas** con la primera más ancha (`1.4fr 1fr 1fr 1fr`, gap 40) → Tailwind: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10`. **Aviso:** `tailwind.config.ts` no define ningún bloque `screens` personalizado (revisado completo) — "los del proyecto" son los breakpoints por defecto de Tailwind (`sm:640px`, `lg:1024px`), que no coinciden con los puntos de colapso reales de Globotent (`@media max-width:900px` y `@media max-width:560px`, css:930-931/947-948). Elegir conscientemente una de las dos opciones: (a) usar los defaults de Tailwind (`sm:`/`lg:`) asumiendo el desajuste de ~60-124px como aceptable, o (b) usar variantes arbitrarias `max-[900px]:grid-cols-2 max-[560px]:grid-cols-1` para igualar los valores exactos citados. El actual `Pie.tsx` ya tiene NAP + servicios + empresa + legales: encaja en 4 columnas.
- **Rótulo de columna** en versalitas pequeñas con tracking (`.95rem`, `.08em`) → ya existe `Rotulo` (`font-mono text-d-10 tracking-[0.12em] uppercase`). Semántica: usar `<h2 class="sr-only">Pie de página</h2>` opcional y rótulos como `<p>`/`<span>` o `h3` coherentes con el nivel anterior; **no** repetir el salto h2→h4 de Globotent.
- Cada columna de enlaces como `<nav aria-label="…"><ul>` en vez de `<a>` sueltos.
- Barra inferior `flex justify-between flex-wrap gap-3 text-14` con `© {año} {razón social}` (año por `new Date().getFullYear()`, como ya hace `Pie.tsx`) + NAP desde `lib/config.ts` con **`<a href="tel:">` y `mailto:`** (Globotent los deja en texto plano; el CSS para ellos, `css:3893`, está sin usar).
- Disclaimer legal en `text-12 leading-[1.55]` con color atenuado: útil para la garantía de 10 años / condiciones de mantenimiento de Pavivasa, si el documento maestro lo cubre. `<strong>` en un tono intermedio (`#b3c5cd` sobre `#061827` ≈ 10.09:1, WCAG 2.1 gamma sRGB).
- Colores: `bg-tinta text-sobre-tinta` (ya) ≈ `#061827`/`#9eb3bd`; hover en acento **solo** si respeta "un CTA primario y el estado activo por pantalla" — en Globotent el hover lima es el mismo color del CTA final (`.btn--lime`), lo que crea dos acentos. En Pavivasa: hover `hover:text-fondo-alt` (ya).
- **No** reservar `padding-bottom:96px`/`padding-right:80px` a ciegas: `BarraMovil.tsx` existe de verdad en Pavivasa, así que el hueco inferior debe medirse con la altura real de esa barra y solo en el breakpoint donde se muestra. `barra-movil` es un token de `spacing` en `tailwind.config.ts:62` (`'barra-movil': '64px'`), **no** una variable CSS `--barra-movil` (no existe ninguna declaración `--barra-movil` en el proyecto): usar el patrón que ya usa el propio repo, `pb-barra-movil` directamente (como `BarraMovil.tsx:7` y `Consentimiento.tsx:75`), o si se necesita sumar un margen, `pb-[calc(theme(spacing.barra-movil)+1rem)]`.
- `border-radius:0` en todo (regla del proyecto): las pills del pie de Globotent no aplican.

Contrato mínimo:

```ts
type ColumnaPie = { titulo: string; enlaces: { texto: string; href: string }[] }
```

### 22.4 WhatsApp flotante

Globotent: `position:fixed bottom-6 right-6 z-[45]`, pill `#25D366`, oculto sobre el pie por IO, sin pulse, ausente en producto. Pavivasa ya tiene `BarraMovil.tsx` (barra fija inferior en móvil, la única sombra permitida). Recomendación coherente con `CLAUDE.md`: **no** añadir un segundo elemento fijo; el WhatsApp va como botón de `BarraMovil` en móvil y como enlace en cabecera/pie en escritorio. Si aun así se quiere FAB en escritorio (`hidden md:inline-flex`): componente cliente pequeño con `IntersectionObserver` sobre `<footer>` (`threshold:0.05`) que añade `opacity-0 translate-y-5 pointer-events-none` (incluir `transition-[opacity,transform]` — Globotent olvida `opacity`), `aria-label="Consultar por WhatsApp"`, `rel="noopener noreferrer"`, mensaje prellenado con el nombre del servicio de la página (Globotent usa el mismo texto genérico en 78 páginas), y el click sale por `registrarEvento('whatsapp_click')` — nunca `dataLayer.push` directo. Sin animación pulse (no la hay en Globotent tampoco).

Contrato mínimo:

```ts
type BotonWhatsAppFlotanteProps = { mensaje?: string; className?: string }
```

### 22.5 Exit popup

**Aviso:** shadcn no está inicializado en este repo (sin `components.json`, sin `components/ui/dialog.tsx`, sin ninguna dependencia `@radix-ui/*` en `package.json`); instalarlo requiere `npx shadcn@latest add dialog`, una dependencia nueva a ponderar contra "Presupuesto de JS inicial: 100 KB comprimido. Sin librerías de animación, iconos ni formularios" (`CLAUDE.md:27`). Alternativa sin dependencia nueva: `<dialog>` nativo de HTML (`showModal()`/`close()`), que da foco inicial, trampa de foco, `Escape` y backdrop gratis, con 0 KB de JS extra. `shadcn/ui` `Dialog` (Radix), si se instala, da gratis lo que a Globotent le falta: `aria-modal`, foco inicial, trampa y retorno de foco, `Escape`, bloqueo de scroll. Lógica cliente (`'use client'`, ~40 líneas): `matchMedia('(min-width: 901px)')` + `!(pointer: coarse)` + `sessionStorage` + `document.addEventListener('mouseout', e => e.clientY <= 0 && !e.relatedTarget && abrir())`. Añadir lo que Globotent no tiene: retardo mínimo (p. ej. 10 s en página o 25 % de scroll) y evento `registrarEvento('exit_popup_view'|'exit_popup_cta')`. Contenido: un `h2` **fuera del outline** de la página → en Radix, `DialogTitle` renderiza `<h2>`; aceptable porque el diálogo se monta solo al abrirse (a diferencia del `hidden` de Globotent, que deja el h2 en el DOM siempre). Estilo: `border-radius:0`, sin emoji como icono, botón primario `Boton variante="tinta"` y secundario `contorno`. Valorar si un exit-intent encaja con el tono de Pavivasa: es opcional.

Contrato mínimo:

```ts
type PopupSalidaProps = {
  mensajeInicial: string
  retardoMinimoMs?: number
  onEvento?: (evento: 'exit_popup_view' | 'exit_popup_cta') => void
}
```

### 22.5b Capas fijas (`z-index`)

Mapeo con las capas reales ya en producción en Pavivasa (grep verificado): `BarraMovil.tsx:7` → `z-20`, `Consentimiento.tsx:75` → `z-[25]`, skip link de `app/layout.tsx:58` → `focus:z-50`. Un exit-popup/FAB nuevo debe situarse conscientemente respecto a ellas (p. ej. exit-popup como overlay de página > 25 y > 50 para no quedar bajo el skip link enfocado ni bajo el aviso de consentimiento; FAB de escritorio por debajo de ambos).

### 22.6 Cookies / consentimiento

Nada que copiar. `Consentimiento.tsx` (ya) debe: bloquear GTM/GA/Meta hasta aceptar; guardar la decisión (cookie de 1.ª parte o `localStorage`), exponer "Configurar cookies" en el pie (Globotent no tiene ni enlace a política de cookies; Pavivasa ya lista `/politica-de-cookies/`).

### 22.7 Skip link, `main`, foco, reduced motion

Ya en `layout.tsx`: skip link `href="#contenido"` + `<main id="contenido">`. Añadir `tabIndex={-1}` a `<main>` para que el salto mueva el foco de verdad (Globotent lo tiene pero sin enlace que lo use; Pavivasa tiene el enlace pero no el `tabindex`). Foco visible global: Pavivasa **ya** tiene una regla en `app/globals.css:73-75` (`outline:2px solid var(--acero); outline-offset:3px` sobre `:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible`) — más completa que la de Globotent (que no tiene ninguna regla global de foco, solo excepciones puntuales, §15). No hace falta añadir nada nuevo; en particular no usar `pigmento` para el foco, reservado por `CLAUDE.md:15` a "un CTA primario y el estado activo por pantalla. Nada más." Todas las transiciones/animaciones bajo `motion-safe:`; View Transitions (`@view-transition{navigation:auto}`, fade `.18s`/`.28s`) son opcionales en Next 15 (`experimental.viewTransition` o CSS puro para MPA no aplica en SPA) — omitir.

### 22.8 404 y gracias

`app/not-found.tsx` ya existe con marca, atajos y `nav aria-label` — mejor que la 404 de Netlify de Globotent. Comprobar que devuelve **HTTP 404** (Next lo hace en `not-found.tsx`) y añadir `metadata.title = 'Página no encontrada'`. Thank-you: ruta propia con `robots noindex`, excluida del sitemap, `h1` + 2-3 acciones (WhatsApp / llamar / volver) como Globotent, sin emojis en los botones, y el evento de conversión disparado en servidor o vía `registrarEvento` **al enviar**, no al cargar la página de gracias (evita conversiones por recarga).

### 22.9 `app/robots.ts` y `app/sitemap.ts`

`robots.ts`: `allow: '/'`, `sitemap: ${sitio.url}/sitemap.xml`; los bloques de "AI crawlers allow" de Globotent son redundantes con `User-agent: *` (no aportan nada, solo si se quisiera *bloquear* alguno). `sitemap.ts`: añadir `lastModified` real (fecha de build o del contenido) — Globotent no lo tiene — y no listar rutas `noindex`.

---

## 23. Lista de comprobación para el verificador (con navegador)

1. Pie: ¿los enlaces de columna se apilan en vertical o fluyen en línea? (`display:inline-flex` tardío, §8.6). Medir el `padding-right` real del `.site-footer` (esperado 80 px + 24 del container).
2. Pie: comprobar hueco inferior de 96 px sin barra sticky (esperado vacío) y `margin-top:80px` antes del pie.
3. `.wa-fab`: confirmar que desaparece al ver el pie (sin fundido, solo desplazamiento) y que no está en `/products/*`. Medir 50×50 en ≤560 px y `bottom:92px`.
4. `.exit-popup`: en escritorio ≥901 px, mover el ratón fuera por arriba → aparece una vez; recargar → no aparece (sessionStorage); en pestaña nueva → aparece. Verificar que el foco **no** entra en el diálogo y que el scroll de fondo sigue activo.
5. `hreflang x-default` de cualquier página interior → abrir la URL → ¿404? (esperado sí: `https://globotent.com/produkte/rundbogenhalle-12x24.html`).
6. `og:image` de una página interior en un validador OG → ¿imagen rota? (esperado sí).
7. `main.min.css` y `.js`: confirmar cabeceras `cache-control` y que `?v=` es igual en todas las páginas.
8. Google Fonts: ¿se ve Figtree o el fallback (`system-ui`) durante la carga? ¿Alguna página muestra 'Clash Display'? (esperado no: no se carga).
9. Confirmar ausencia total de banner de cookies y que `gtm.js` se pide tras la primera interacción o a los ~4 s.
10. `/sw.js`: en Application → Service Workers debe registrarse y desregistrarse solo.
11. Página 404 = plantilla Netlify; `/pages/thank-you` tiene `noindex` y aparece en el sitemap.
12. Contrastes del pie con herramienta: `#9eb3bd`/`#061827`, `#7d909a`/`#061827`, `#7ec700`/`#061827`.
13. Tab por el pie y el FAB: ¿outline visible del navegador? (esperado sí, por ausencia de reglas).
14. Validar los 2 JSON-LD de la home en el validador de Schema.org: `LocalBusiness` sin `url`/`priceRange` y `Review` con `datePublished` futuras respecto al build (`2026-02-01`).
