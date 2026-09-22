# 06 · Plantillas de página interior (globotent.com)

Documento de referencia para (1) Claude Design (diseño nuevo de Pavivasa inspirado en esta web) y (2) Claude Code (implementación en Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Describe mecanismo + valores exactos; cada afirmación cita el selector, atributo o función de origen.

Fuentes leídas (espejo local `scratchpad/globotent/`): `site/categories/{storage-tents,padel-tennis-covers,fabric-buildings,riding-arena-covers}.html`, `site/products/{storage-tent-12x15,padel-tennis-cover}.html`, `site/pages/{about-us,team,contact,request-a-quote,reference-projects,customer-reviews,faq,calculators,round-bale-calculator,machinery-calculator,all-models,compare-shelters,shelter-finder,downloads,jobs,legal-notice,privacy-policy,terms-and-conditions,technical-glossary,thank-you,sustainability,3d-preview,produkte,sport}.html`, `site/pages/jobs/{sdr-sales,studentische-assistenz}.html`, `site/guides/index.html`, `site/projects/agroindustrial-extremadura.html`, `home.html` (solo para `.case-card`), `main.pretty.css` (6156 líneas) y `main.js` (742 líneas).

> **Aviso metodológico importante.** El espejo EN (`globotent.com`) usa **un subconjunto** del CSS y del JS. Muchos componentes que la tarea pedía documentar (`.product-info`, `data-gallery-thumb`, `.filter-bar`, `.quiz`, `.download-card`, `.prose-block`, `.padel-sizes`, `data-ar-viewer`, `data-form-expand`, `data-netlify`…) **existen en `main.pretty.css` y/o `main.js` pero no aparecen en ninguna página EN** (comprobado con `grep -l` sobre las 78 páginas: 0 resultados). Los documento igualmente como "componentes latentes" (sección 13), reconstruyendo el markup esperado **a partir de los selectores CSS y las consultas `querySelector` del JS**, y lo marco explícitamente. Donde escribo "no está en el código" es literal.

---

## 1. Esqueleto común de toda página interior

### 1.1 Orden del `<body>`

Todas las páginas interiores comparten esta secuencia (ej. `site/categories/storage-tents.html`):

```html
<body>                       <!-- o <body class="sport-world"> / <body class="is-product-detail"> -->
<noscript><iframe GTM…></noscript>
<header class="site-header">…</header>          <!-- documentado en otra dimensión -->
<main id="main" tabindex="-1">
  <section class="page-hero">…</section>        <!-- SIEMPRE primero, salvo sport.html (.sp-hero) -->
  <section class="section">…</section>          <!-- N bloques .section -->
  …
</main>
<div class="lightbox" data-lightbox hidden>…</div>
<a class="wa-fab" href="https://wa.me/34657472335?text=…">…</a>
<div class="exit-popup" data-exit-popup hidden>…</div>
<footer class="site-footer">…</footer>
<script src="../assets/js/main.min.js?v=c0f0756b" defer></script>
</body>
```

Observaciones rastreables:

| Hecho | Origen |
|---|---|
| `<main id="main" tabindex="-1">` en casi todas; en `jobs.html`, `jobs/*.html`, `produkte.html` y `sport.html` es `<main>` sin id (inconsistencia del generador). | páginas citadas |
| `body.sport-world` en categorías/productos deportivos (`padel-tennis-covers`, `riding-arena-covers`, `pickleball` + sus 10 productos) y en `sport.html`. | `<body class="sport-world">` |
| `body.is-product-detail` + `main.is-product-detail` en todas las fichas de producto. Efecto CSS: `body.is-product-detail .wa-fab{display:none}` (línea 3609). | `products/*.html` |
| `<link rel="preload" as="image" href="…" type="image/webp" fetchpriority="high">` en `<head>` de cada página; **no siempre coincide** con la imagen del `.page-hero__bg` (ej. `about-us.html` precarga `About_page_image_1.webp` pero el hero usa `hero_banner_1.jpg`). | `<head>` de cada página |
| Lightbox, WhatsApp FAB y exit-popup se incluyen en **todas** las páginas aunque no haya galería (el JS es defensivo: `if (lightbox)`, `if (exitPop && …)`). | `main.js` |
| No hay `<script>` inline por página ni CSS por página: **un único** `main.min.css?v=cfc09a15` y `main.min.js?v=c0f0756b`. | `<head>` / final de `<body>` |

### 1.2 Tokens y primitivas usados por los interiores (`:root`, líneas 1-30)

```css
--brand-green:#1aa585; --brand-green-dark:#12755e; --brand-green-deep:#007a4a;
--brand-green-deep-hover:#0d614c; --brand-lime:#7ec700; --brand-lime-hover:#84d814;
--brand-dark:#061827; --brand-navy:#0f1428;
--color-title:#151719; --color-text:#535353; --color-sub-title:#535353;
--color-link:#222222; --color-border:#e2e2e2; --color-bg:#ffffff; --color-bg-soft:#f6f8f7;
--button-corner:50px; --button-font-weight:800; --button-text-transform:uppercase;
--button-large-height:56px; --button-normal-height:44px;
--font-family:'Figtree',system-ui,-apple-system,sans-serif;
--container:1280px; --radius:12px;
--shadow-card:0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06);
```

`.container{max-width:var(--container);margin:0 auto;padding:0 24px}` (línea 67). `.section{padding:72px 0}`, `.section--tight{padding:48px 0}`, `.section--soft{background:var(--color-bg-soft)}`, `.section--dark{background:var(--brand-dark);color:#dfe7ea}`, `.section--brand{background:linear-gradient(135deg,#1aa585 0%,#138d70 100%);color:#fff}` (líneas 269-284). En ≤900px `.section` no cambia salvo `.section,.container{max-width:100%}` (línea 3814); en ≤560px (línea 1626) `.section{padding:48px 0}` y `.section--tight{padding:32px 0}`.

Botones (líneas 71-120): `.btn` = `inline-flex; height:44px; padding:0 28px; border-radius:50px; font-weight:800; text-transform:uppercase; font-size:.85rem; letter-spacing:.04em; border:2px solid transparent; transition:… .18s ease`. `.btn--lg{height:56px;padding:0 36px;font-size:.95rem}`. `.btn--primary{background:#1aa585;color:#fff}` hover `#12755e` + `translateY(-1px)`. `.btn--secondary` transparente con `border-color:var(--color-title)`, hover verde. `.btn--lime{background:#7ec700;color:#061827}`. `.btn--ghost-light{background:transparent;color:#fff;border-color:#fff}` hover fondo blanco, texto `--brand-green-deep`. `.btn{min-height:var(--touch-target-min)}` = 48px (líneas 3583, 3835).

### 1.3 Micro-interacciones transversales que afectan a los interiores (`main.js`)

| Mecanismo | Código | Afecta a |
|---|---|---|
| **Reveal on scroll**: añade `.reveal` a `.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other`; `IntersectionObserver` con `{threshold:0.12, rootMargin:'0px 0px -60px 0px'}` añade `.is-visible` y hace `unobserve`. CSS `.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}` → `.reveal.is-visible{opacity:1;transform:none}`; anulado bajo `prefers-reduced-motion:reduce` (líneas 3386-3398). | `main.js` líneas 3-16 | categorías, reseñas, empleo, produkte, all-models |
| **Tilt 3D en hover**: `.product-card, .case-card, .calc-card, .blog-card` → en `mousemove` (no en `pointer:coarse`) `transform = translateY(-4px) perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`, reset en `mouseleave`. CSS `will-change:transform;transform-style:preserve-3d;transition:transform .25s ease…` (línea 3399). | `main.js` líneas 17-27 | tarjetas de producto y casos |
| **View Transitions**: si `document.startViewTransition`, intercepta clics en `a[href]` internos (excluye `#`, `tel:`, `mailto:`, `http`, `target=_blank`) y navega dentro de `startViewTransition`. CSS `@view-transition{navigation:auto}`, `::view-transition-old(root){animation:vt-fade-out .18s}` (a `opacity:0;translateY(-10px)`), `::view-transition-new(root){animation:vt-fade-in .28s}` (líneas 3403-3418). | `main.js` líneas 104-121 | toda navegación interna |
| **Anclas suaves**: `a[href^="#"]` → `window.scrollTo({top: el.offsetTop - 90, behavior:'smooth'})`. | `main.js` | `jobs.html#offene-stellen`, `sport.html#disziplinen` |
| **Exit-intent**: `[data-exit-popup]` se muestra en `mouseout` con `clientY<=0`, solo `min-width:901px`, no táctil, una vez por sesión (`sessionStorage.globotent_exit_shown`); `.is-visible` vía `requestAnimationFrame`, cierre con `[data-exit-close]`, backdrop o Escape; ocultado tras 300ms. | `main.js` | todas |
| **WA FAB**: `IntersectionObserver` sobre `.site-footer` (`threshold:0.05`) alterna `.wa-fab.is-hidden` (`opacity:0;translateY(20px);pointer-events:none`, línea 3603). | `main.js` | todas salvo producto |
| **Tracking**: clic en `a[href*=wa.me]` → `dataLayer.push({event:'whatsapp_click'})`; `tel:` → `phone_click`; `mailto:` → `email_click` (capture phase). | `main.js` `dlPush` | contacto, thank-you, empleo |
| **Parallax hero**: solo `.hero__bg` (home): `translateY(scrollY*0.25)`. **`.page-hero__bg` no tiene parallax ni zoom** (no está en el código). | `main.js` líneas 28-35 | — |

**Traducción a Next/Tailwind/shadcn**: reveal → un `useInView` (o `IntersectionObserver` en un `<Reveal>` client component) que aplica `data-[visible]:opacity-100 data-[visible]:translate-y-0 opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] motion-reduce:opacity-100 motion-reduce:translate-y-0`. Tilt → handler `onPointerMove` en el `Card` con `style.transform`; desactivar si `matchMedia('(pointer: coarse)')`. View Transitions → Next 15 `experimental.viewTransition` o simplemente omitir. Exit-intent → `Dialog` de shadcn controlado por `mouseout` + `sessionStorage`.

---

## 2. `.page-hero` — cabecera de todas las interiores

### 2.1 Markup canónico (`categories/storage-tents.html`)

```html
<section class="page-hero">
  <div class="page-hero__bg" style="background-image:url('../assets/images/rundbogenhalle-12x24-01.jpg')"></div>
  <div class="container page-hero__inner">
    <div class="breadcrumbs"><a href='/'>Home</a> / <span>Categories</span> / <span>Arched Storage Tents</span></div>
    <h1>Arched Storage Tents — Robust Hoop Buildings for Hay, Grain & Equipment</h1>
    <p style="color:#dfe7ea;margin:10px 0 0;font-size:1.1rem;max-width:680px">Arched storage tents from 6 × 6 m …</p>
  </div>
</section>
```

### 2.2 CSS (líneas 231-268)

```css
.page-hero{position:relative;min-height:320px;display:flex;align-items:flex-end;color:#fff;padding:0;overflow:hidden;background:#061827}
.page-hero__bg{position:absolute;inset:0;background-size:cover;background-position:center}
.page-hero__bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))}
.page-hero__inner{position:relative;z-index:1;padding-top:64px;padding-bottom:48px;width:100%}
.page-hero h1{color:#fff;margin:0}
.breadcrumbs{font-size:.85rem;color:#cfd8dc;margin-bottom:12px}
.breadcrumbs a{color:#cfd8dc}  .breadcrumbs a:hover{color:#fff}
.breadcrumbs span{color:var(--brand-lime)}            /* el tramo actual va en lima #7ec700 */
.breadcrumbs a{display:inline-flex;align-items:center;min-height:44px;padding:6px 4px;line-height:1.35}  /* línea 3876, touch target */
```

- `h1` global: `font-size:clamp(2rem,4.2vw,3.6rem);letter-spacing:-.01em;font-weight:800;line-height:1.15` (líneas 55-60).
- El subtítulo **no tiene clase**: siempre `<p style="color:#dfe7ea;margin:10px 0 0;font-size:1.1rem;max-width:680px">` (600px en fichas de producto, 1.05rem en `produkte.html` y `projects/*.html`).
- Imagen: **`background-image` inline** en `.page-hero__bg` (no `<img>`, no `<picture>`, no srcset). Formato mixto: `.jpg` (`hero_banner_1.jpg`, `hero-banner-2.jpg`), `.webp`, `.png`, `.jpeg` (`padel-01.jpeg`).
- Overlay: degradado vertical 45 % → 80 % de `#061827`. El contenido se alinea **abajo** (`align-items:flex-end`).
- **No hay JS** asociado a `.page-hero` (no parallax, no zoom, no slider). Solo `.hero__bg` (home) y `[data-cine-hero]` (home) tienen animación.

### 2.3 Variantes observadas

| Variante | Página(s) | Diferencia literal |
|---|---|---|
| Estándar con imagen + breadcrumbs + h1 + p | categorías, productos, about-us, team, faq, reviews, tools, guides, projects/* | ver 2.1 |
| Sin imagen de fondo (fondo plano `#061827`) | `legal-notice.html`, `privacy-policy.html`, `terms-and-conditions.html`, `thank-you.html` | `<section class="page-hero"><div class="container page-hero__inner"><h1>Legal Notice</h1></div></section>` (una línea, sin breadcrumbs, sin p) |
| Centrado con botones | `thank-you.html` | `page-hero__inner style="text-align:center"`, `p` con `font-size:1.15rem;max-width:600px;margin-left:auto;margin-right:auto`, fila de 3 botones `display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:30px` |
| Ficha de producto | `products/*.html` | `<section class="page-hero" style="padding-bottom:0">` (sin efecto real: `.page-hero{padding:0}`); breadcrumb con enlace a la categoría; `p` con `max-width:600px` y texto "meta · approx. N m²" |
| Solo h1 (contact) | `contact.html` | breadcrumbs + h1, sin p |
| `.page-hero.jobs-hero` | `jobs.html` | añade `<span class="jobs-hero__eyebrow">`, `<div class="jobs-hero__cta">` con `.btn--lime` + `.jobs-hero__count` (ver §11) |
| `.page-hero.jobdetail-hero` | `jobs/*.html` | h1 con `<span class="jobdetail-hero__gender">`, `.jobs-hero__cta` con `.btn--lime` (mailto) + `.jobdetail-back` |
| `.page-hero--padel` | **ninguna página EN** | CSS latente líneas 311, 3591-3602: `::after` degradado `rgba(15,30,45,.45)→.25→.55`, `.page-hero--padel h1 em{font-style:normal…}` |
| `.page-hero--calc{min-height:280px}` / `.page-hero--blog{min-height:380px}` | ninguna página EN | CSS latente líneas 1158, 2464 |
| `.sp-hero` (sport) | `sport.html` | componente distinto, ver §14 |

No hay JSON-LD `BreadcrumbList` en ninguna página EN (`grep -rl "BreadcrumbList" site/` → 0 resultados) pese a que el `.breadcrumbs` visual es universal en interiores; añadirlo es una mejora recomendable para Pavivasa, igual que `FAQPage` en §9.

### 2.4 Traducción a Next/Tailwind/shadcn

```tsx
// components/page-hero.tsx (Server Component)
<section className="relative flex min-h-[320px] items-end overflow-hidden bg-[#061827] text-white">
  <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover" />   {/* sustituye background-image inline */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#061827]/45 to-[#061827]/80" />
  <div className="container relative z-10 w-full pt-16 pb-12">
    <Breadcrumb>…</Breadcrumb>   {/* shadcn Breadcrumb; último item text-lime (token brand-lime) */}
    <h1 className="text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1.15] tracking-[-0.01em]">…</h1>
    <p className="mt-2.5 max-w-[680px] text-[1.1rem] text-[#dfe7ea]">…</p>
  </div>
</section>
```
Props sugeridas: `bg?`, `crumbs[]`, `title`, `lead?`, `align: 'start'|'center'`, `children` (CTA row). Sin imagen → omitir `<Image>` (caso legales).

---

## 3. Bloques de sección reutilizados en los interiores

### 3.1 `.section__head` y `.section__eyebrow` (líneas 453-463)

```css
.section__head{text-align:center;max-width:720px;margin:0 auto 48px}
.section__eyebrow{color:var(--brand-green);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:.8rem;margin-bottom:8px}
```
En interiores casi siempre se fuerza `style="text-align:left"` (categorías, about-us). Recibe `.reveal` por JS.

### 3.2 `.cta-band` (líneas 740-752) — banda final de casi todas las plantillas

```css
.cta-band{background:linear-gradient(135deg,var(--brand-green-deep),var(--brand-green));color:#fff;border-radius:var(--radius);padding:56px;text-align:center}
.cta-band h2{color:#fff;margin-bottom:12px}
.cta-band p{color:rgba(255,255,255,.9);margin-bottom:24px;font-size:1.05rem}
@media (max-width:900px){.cta-band{padding:40px 24px}}
@media (max-width:560px){.cta-band{padding:32px 20px} .cta-band h2{font-size:1.4rem}}
```
Tres usos literales:
1. Dentro de `.section` blanca o `.section--soft`: `<div class="cta-band"><h2>…</h2><p>…</p><a class='btn btn--lg btn--lime' href='/pages/request-a-quote'>…</a></div>` (categorías con `btn--lime`; reviews/faq/produkte con `btn--primary`).
2. Dentro de `.section--brand` (productos, about-us): `<div class="cta-band" style="background:transparent;color:#fff"><h2 style="color:#fff">…</h2><p style="color:#eaf6f1">…</p><a class='btn btn--lg btn--lime'>…</a></div>` — la banda se "disuelve" en la sección degradada.
3. En `sport-world`: `.sport-world .cta-band{background:var(--sport-lime);color:#000;border:1px solid #000;border-radius:16px}` (línea 4776), botones invertidos (ver §14).

### 3.3 "Callout" de placeholder (sin clase)

Patrón repetido en `reference-projects`, `round-bale-calculator`, `machinery-calculator`, `compare-shelters`, `shelter-finder`:
```html
<div style="text-align:center;padding:40px;background:var(--color-bg-soft);border-radius:14px;margin-top:24px">
  <p …>For a personalised calculation of your hay store:</p>
  <a class='btn btn--primary btn--lg' href='/pages/request-a-quote' style='margin-top:14px'>Request a personalised calculation</a>
</div>
```
Y en `guides/index.html` / `projects/*.html`: `<div style="text-align:center;padding:40px 0;margin-top:30px;border-top:1px solid var(--color-border)">` con dos botones (`btn--primary btn--lg` + `btn--secondary btn--lg style='margin-left:10px'`).

### 3.4 Contenedor de prosa

Todas las páginas de texto usan `<div class="container" style="max-width:820px">` (about-us, team, faq, sustainability, legales, guides, projects, tools) — **no** la clase `.prose` (CSS latente: `.prose{max-width:780px;margin:0 auto;font-size:1.05rem}`, `.prose h2{margin-top:2em}`, `.prose a{color:var(--brand-green);font-weight:700}`, líneas 753-765). Listas con `style="line-height:1.8;color:var(--color-sub-title)"`.

**Traducción**: `<Section variant="default|soft|brand|dark|tight">`, `<SectionHead eyebrow title lead align>`, `<CtaBand tone="brand|transparent|sport">`, `<Prose>` (`max-w-[820px] mx-auto`), `<Callout>` (`rounded-[14px] bg-soft p-10 text-center`).

---

## 4. Plantilla CATEGORÍA (`site/categories/*.html`)

### 4.1 Esqueleto (idéntico en las 5 categorías)

1. `section.page-hero` (imagen distinta por categoría: `rundbogenhalle-12x24-01.jpg`, `satteldachhalle-12x30-01.webp`, `reitplatzueberdachung-20x40-01.png`, `padel-01.jpeg`; breadcrumb `Home / Categories / <Nombre>`; h1 largo tipo SEO; p ≤680px).
2. `section.section` › `.container` › `.section__head[style=text-align:left]` › `h2` "… — key features" + `p` + `<ul style="margin:14px 0 0;line-height:1.8;color:var(--color-sub-title);max-width:680px">` de 6 `<li>`.
3. `section.section.section--soft` › `.section__head[left]` (`h2` "Our … range", `p` "N standard models available…") › **`.product-grid`** con N `a.product-card`.
4. `section.section` › `.cta-band` ("Can't find the exact size?", `btn--lg btn--lime`).

No hay tabla, FAQ, filtros ni `<details>` en las categorías EN (el grep de "details" solo coincide con el texto "View details").

### 4.2 `.product-grid` + `.product-card` (líneas 584-637, 1010-1033)

Markup literal:
```html
<a class='product-card' href='/products/storage-tent-6x6'>
  <div class="product-card__media"><picture><source type="image/webp" srcset="../assets/images/rundbogenhalle-6x6-01-800.webp 800w, ../assets/images/rundbogenhalle-6x6-01-1200.webp 1200w, ../assets/images/rundbogenhalle-6x6-01.webp 2000w"><img src="../assets/images/rundbogenhalle-6x6-01.webp" alt="Arched Storage Tent 6.10 × 6.10 × 3.66 m" loading="lazy" decoding="async"></picture></div>
  <div class="product-card__body">
    <h3 class="product-card__title">Arched Storage Tent 6.10 × 6.10 × 3.66 m</h3>
    <p class="product-card__meta">Small square shelter for yard & garden</p>
    <div class="product-card__badges"><span class="product-card__badge">6.10 × 6.10 × 3.66 m</span><span class="product-card__badge product-card__badge--alt">ca. 37 m²</span></div>
    <span class="btn btn--primary product-card__cta">View details</span>
  </div>
</a>
```
CSS:
```css
.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}   /* ≤1100px: 3 col; ≤900px: 2; ≤560px: 1 */
.product-card{background:#fff;border:1px solid var(--color-border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
.product-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-card);border-color:var(--brand-green)}
.product-card__media{aspect-ratio:4/3;background:var(--color-bg-soft);overflow:hidden}
.product-card__media img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.product-card:hover .product-card__media img{transform:scale(1.04)}        /* zoom en hover */
.product-card__body{padding:20px;display:flex;flex-direction:column;flex:1}
.product-card__title{font-size:1.05rem;font-weight:700;color:var(--color-title);margin:0 0 8px;min-height:2.6em}
.product-card__meta{font-size:.85rem;color:var(--color-sub-title);margin:0 0 16px;flex:1}
.product-card__cta{margin-top:auto}
.product-card__badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.product-card__badge{display:inline-block;padding:4px 10px;background:rgba(26,165,133,.10);color:var(--brand-green-dark);font-weight:800;font-size:.78rem;letter-spacing:.02em;border-radius:999px}
.product-card__badge--alt{background:var(--color-bg-soft);color:var(--color-title)}
.product-card__eyebrow{color:var(--brand-green);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;margin-bottom:8px}  /* no usado en EN */
.product-card__price / __price--quote                                       /* no usado en EN */
```
Nota: el CTA es un `<span class="btn">` dentro del `<a>` (toda la card es enlace). Srcset: 800w / 1200w / 2000w, `sizes` ausente. JS: `.reveal` + tilt (§1.3). En `sport.html` las cards llevan `data-w='20'` (ancho en m) para el `filter-bar` latente (§6.4). Excepción: la card de Padel/Tennis Court Cover en `sport.html` tiene `data-w` **sin valor** (`<a class='product-card' data-w href='/products/padel-tennis-cover'>`), a diferencia de las demás que sí llevan `data-w='20'|'25'|'14'|'10'|'18'`; `getAttribute('data-w')` devolvería `""`, lo que rompería el filtro de §6.4 si se activara sobre esa rejilla. En ≤560px `.product-card{border-radius:10px}` (línea 1624, frente a `var(--radius)`=12px base).

### 4.3 Traducción

shadcn `Card` como `<Link>` completo: `className="group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:border-primary hover:shadow-card"`; media `aspect-[4/3] overflow-hidden bg-soft` con `<Image className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]" sizes="(max-width:560px) 100vw,(max-width:900px) 50vw,(max-width:1100px) 33vw,25vw">`; badges = shadcn `Badge` variante `secondary` con `rounded-full bg-primary/10 text-primary-dark font-extrabold text-[.78rem]`; CTA = `Button` con `asChild` **no** (evitar `<a>` dentro de `<a>`): usar `<span className={buttonVariants()}>`. Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

Props sugeridas: `href`, `image: {src, alt}`, `title`, `meta?`, `badges: {label, alt?}[]`, `ctaLabel`.

---

## 5. Plantilla PRODUCTO (`site/products/*.html`)

### 5.1 Esqueleto real EN (`storage-tent-12x15.html`, `padel-tennis-cover.html`)

```html
<body class="is-product-detail [sport-world]">
<main id="main" tabindex="-1" class="is-product-detail">
<section class="page-hero" style="padding-bottom:0">…breadcrumb Home / <a href=categoría> / <span>12.20 × 15 × 6.10 m</span>… h1 … <p style="…max-width:600px">Industrial shelter with full drive-through · approx. 183 m²</p></section>
<section class="section"><div class="container">
  <div class="product-detail">
    <div class="gallery">
      <div class="gallery__main"><picture><source type="image/webp" srcset="../assets/images/rundbogenhalle-12x15-01.webp"><img src="…" alt="…" loading="eager" decoding="async"></picture></div>
    </div>
    <div class="product-detail__info">
      <div class="product-card__badges"><span class="product-card__badge">12.20 × 15 × 6.10 m</span><span class="product-card__badge product-card__badge--alt">approx. 183 m²</span></div>
      <p style="margin:18px 0 0;font-size:1.05rem;line-height:1.55">…descripción…</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
        <a class='btn btn--primary btn--lg' href='/pages/request-a-quote'>Request a quote</a>
        <a href="tel:+34657472335" class="btn btn--secondary btn--lg">Call now</a>
      </div>
      <p style="color:var(--color-sub-title);margin-top:14px;font-size:.92rem">Delivery and installation included · response within 24 h</p>
    </div>
  </div>
</div></section>
<section class="section section--soft"><div class="container"><h2 style="text-align:left">… — everything you need to know</h2><ul style="line-height:1.8;color:var(--color-sub-title);margin-top:14px">6 li</ul></div></section>
<section class="section"><div class="container"><h2 style="text-align:left">Technical data</h2><div style="max-width:640px;margin-top:18px"><table style="width:100%;border-collapse:collapse;font-size:1rem"><tbody>
  <tr><th style="text-align:left;padding:10px 0;border-bottom:1px solid #e4e9eb">Width</th><td style="padding:10px 0;border-bottom:1px solid #e4e9eb">12.20 m</td></tr>
  … Length / Height / Area / Tarpaulin thickness (última fila sin border-bottom) …
</tbody></table></div></div></section>
<section class="section section--brand"><div class="container"><div class="cta-band" style="background:transparent;color:#fff"><h2 style="color:#fff">Ready for this shelter?</h2><p style="color:#eaf6f1">…</p><a class='btn btn--lg btn--lime' href='/pages/request-a-quote'>Request a quote</a></div></div></section>
</main>
```

Hechos:
- **Una sola imagen**: `.gallery__main` sin `.gallery__thumbs`, sin `data-gallery-main` ni `data-gallery-thumb` (grep = 0 en EN). Por tanto el lightbox **no se abre** en producto: en `main.js` el listener de clic solo se registra bajo `if (galleryMain && srcList.length)`, y `galleryMain = document.querySelector('[data-gallery-main]')` ya devuelve `null` en las páginas EN — falta el propio contenedor con el atributo, no solo los thumbs; aunque `srcList.length` fuera > 0, sin `data-gallery-main` en el contenedor el listener nunca llegaría a registrarse.
- Tabla técnica con **estilos inline** (no `.padel-sizes`, no clase): 5 filas `th/td`, borde `#e4e9eb` (color que **no** es token; `--color-border` es `#e2e2e2`).
- `.product-detail__info` **no tiene CSS propio** (solo `.product-detail` y `.product-info*`). El generador EN usó un nombre distinto al del CSS.
- En padel: `td` de Height vacío y "fro 20 m" (typo) — datos de contenido, no de plantilla.
- No hay JSON-LD `Product` (solo `Organization`).

### 5.2 CSS de `.product-detail` y galería (líneas 638-670, 1115-1130, 3609)

```css
.product-detail{display:grid;grid-template-columns:1.2fr 1fr;gap:56px;align-items:flex-start}   /* ≤900px: 1fr */
.gallery__main{aspect-ratio:4/3;background:var(--color-bg-soft);border-radius:var(--radius);overflow:hidden;margin-bottom:14px}
.gallery__main img{width:100%;height:100%;object-fit:cover}
.gallery__main{cursor:zoom-in;position:relative}
.gallery__main::after{content:"";position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;background:rgba(6,24,39,.75) url("data:image/svg+xml;…lupa con +…") center/22px no-repeat;pointer-events:none;opacity:.85}   /* icono de zoom SIEMPRE visible aunque no haya lightbox funcional */
.gallery__thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}   /* ≤560px: 4 col */
.gallery__thumb{aspect-ratio:1/1;background:var(--color-bg-soft);border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color .15s ease}
.gallery__thumb.is-active,.gallery__thumb:hover{border-color:var(--brand-green)}
body.is-product-detail .wa-fab{display:none}
```

### 5.3 JS de galería y lightbox (`main.js`) — mecanismo completo aunque EN no lo active

1. **Thumbs → main** (`main.js` ~línea 230): `mainImg = querySelector('[data-gallery-main] img')`, `thumbs = querySelectorAll('[data-gallery-thumb]')`; clic en thumb → `mainImg.src = t.getAttribute('data-src')`, toggle `.is-active`.
2. **Swipe en main** (final del archivo): `touchstart/touchend` en `[data-gallery-main]`, si `|dx|>50` avanza/retrocede índice y aplica el `data-src` del thumb.
3. **Lightbox** `[data-lightbox]` (`.lightbox__img`, `.lightbox__counter`, `.lightbox__close`, `.lightbox__nav--prev/--next`): `srcList = thumbs.map(data-src)`; clic en `[data-gallery-main]` → busca la posición cuya `src` termina en el mismo nombre de archivo y `show(pos)`; `show(i)` hace `lightbox.hidden=false; body.style.overflow='hidden'`, counter `"(idx+1) / total"`. Cierre: botón, clic en el propio contenedor (`e.target === lightbox`), `Escape`; flechas `ArrowLeft/ArrowRight`; swipe `|dx|>50` sobre `.lightbox__img`.
4. **Galería fotográfica alternativa**: `[data-photo-gallery]` con `[data-lightbox-trigger]` (`href` = imagen grande) → al clic sustituye `srcList` por los `href` y abre. Tampoco hay markup EN.
5. CSS lightbox (líneas 1053-1114): `position:fixed;inset:0;background:rgba(6,24,39,.92);z-index:1000;padding:48px`; `.lightbox__img{max-width:100%;max-height:100%;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5)}`; close 48×48 `font-size:42px` top:20px right:24px; nav 56×56 `rgba(255,255,255,.08)` hover `.2`; counter `bottom:20px` pill `rgba(0,0,0,.5)`. `hidden` → `display:none`.

Markup reconstruido (a partir de selectores; **no está en EN**):
```html
<div class="gallery">
  <div class="gallery__main" data-gallery-main><img src="…01.webp" alt=""></div>
  <div class="gallery__thumbs">
    <button class="gallery__thumb is-active" data-gallery-thumb data-src="…01.webp"><img …></button>
    <button class="gallery__thumb" data-gallery-thumb data-src="…02.webp"><img …></button>
  </div>
</div>
```

### 5.4 `.product-info` (CSS latente, líneas 671-710, 1034-1052, 4866-4914) — la columna de información "completa" que el CSS prevé

| Selector | Valores |
|---|---|
| `.product-info h1` | `font-size:clamp(1.8rem,2.6vw,2.4rem);margin-bottom:16px` |
| `.product-info__eyebrow` | `color:var(--brand-green);font-weight:800;text-transform:uppercase;font-size:.8rem;letter-spacing:.12em;margin-bottom:8px` |
| `.product-info__price` / `--quote` | `color:#1aa585;font-size:1.8rem;font-weight:800` / `color:var(--color-title);font-size:1.2rem` |
| `.product-info__stats` | `display:grid;grid-template-columns:repeat(2,1fr);gap:12px;background:var(--color-bg-soft);border-radius:12px;padding:18px;margin-bottom:24px` |
| `.product-info__stat span` / `strong` | label `.75rem uppercase letter-spacing:.06em font-weight:700 color sub-title` / valor `1rem color title` |
| `.product-info__features li` | `padding:10px 0 10px 32px;border-bottom:1px solid var(--color-border);position:relative`; `::before` círculo 18px `background:var(--brand-green) url(svg check blanco) center/14px` |
| `.product-info__actions` | `display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px` |
| `.product-info__meta` | `border-top:1px solid var(--color-border);padding-top:20px;font-size:.9rem;color:sub-title` |
| `.avail-banner` (líneas 2784-2806) | pill `background:rgba(126,199,0,.15);color:#2d4a00;padding:8px 14px;border-radius:50px`; `.avail-banner__dot` 9px `#7ec700` con `animation:pulse 1.8s ease-in-out infinite` (`@keyframes pulse` box-shadow 0→8px `rgba(126,199,0,.6→0)`). JS `[data-avail]`: `#avail-slots` = `1 + (hash(pathname) % 4)`, `#avail-recent` de `['vor 12 min','vor 47 min','vor 2 h','vor 6 h','heute Morgen','gestern']` — **escasez simulada determinista por URL** (no está en EN). |
| `.mobile-sticky-cta` (líneas 1130-1157) | `position:fixed;bottom:0;…;display:none` en base; en `@media (max-width:900px)` (abre línea 1543) pasa a `display:flex` (línea 1590), y en el mismo bloque `main{padding-bottom:84px}` compensa la barra fija. `.mobile-sticky-cta__call` 56px círculo lima. Sin markup EN. |
| `.chip` (líneas 1435-1465) | pill `border:1.5px solid border;padding:8px 12px;border-radius:50px;font-weight:700;font-size:.82rem;display:inline-flex;flex-direction:column` + `small` .65rem uppercase; `.is-active` verde. Usado por el visor 3D (`data-color`). |

### 5.5 Visor 3D / AR (JS latente, `main.js` `.threed-viewer`, `[data-ar-btn]`, `[data-ar-viewer]`)

- `.threed-viewer` (CSS 2913-2935: `background:soft;border:1px solid border;border-radius:12px;padding:24px;max-width:980px`; `.threed-viewer__canvas{aspect-ratio:16/9;background:linear-gradient(180deg,#cfd8dc,#e2e8d6)}`; `.threed-viewer__controls` flex de `.chip`).
- Carga perezosa con `IntersectionObserver({rootMargin:'200px'})` de `https://unpkg.com/three@0.158.0/build/three.min.js` + `examples/js/controls/OrbitControls.js`; lee `data-hall-w`, `data-hall-l`, `data-hall-h`, `data-hall-type` (`arch|gable|shed`); extruye una `THREE.Shape` (arco = `absarc`), puerta gris `0xc9c9c9`, color inicial `#1aa585`, `OrbitControls` con `enableDamping`, `maxPolarAngle: Math.PI/2 - 0.05`; los `.chip[data-color]` cambian `planeMat.color`.
- AR: `[data-ar-btn]` inyecta `https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js` (module) y llama `arViewer.activateAR()`; textos en alemán ("3D-Modell lädt…"). CSS `model-viewer{width:100%;max-width:620px;height:420px}` (línea 2957). **Ninguna página EN tiene `.threed-viewer` ni `model-viewer`.** `dns-prefetch` a unpkg y ajax.googleapis está en el `<head>` de todas las páginas, lo que confirma que el sistema lo prevé.

### 5.6 Traducción a Next/Tailwind/shadcn

- Layout: `grid gap-14 lg:grid-cols-[1.2fr_1fr] items-start`.
- Galería: componente cliente `<ProductGallery images[]>` con estado `active`; thumbs como `<button>` con `aria-pressed`; lightbox = shadcn `Dialog` a pantalla completa (`bg-[#061827]/92`) con `Carousel` (embla) para teclado/swipe; contador en `absolute bottom-5`.
- Tabla técnica → shadcn `Table` con `th` en `text-left`, filas `border-b`; para Pavivasa: "Sistema / Espesor / Acabado / Uso" en lugar de W×L×H.
- Stats → grid 2 col con `<dl>`; features → lista con icono `Check` de lucide en círculo `bg-primary`.
- Para hormigón no aplica el visor 3D; sí se puede reutilizar el patrón "antes/después" (`[data-before-after]`, `.before-after__handle`, `clip-path:inset(0 0 0 pct%)`, en `main.js`) para pavimento antiguo vs nuevo.

Props sugeridas `ProductGallery`: `images: {src, alt, thumbSrc?}[]`, `initialIndex?`.

---

## 6. Plantilla PROYECTOS / CASOS

### 6.1 Listado `pages/reference-projects.html` (EN = placeholder)

`page-hero` (bg `hero_banner_1.jpg`, breadcrumb `Home / Projects`, h1 "Reference projects", p "Over 100 shelters installed…") + `.section` › `.container[max-width:820px]` › 2 `<p>` + callout `btn--primary btn--lg` → `/pages/contact`. **No hay grid de casos, ni filtros, ni JSON-LD.** Los 8 casos de `sitemap.xml` (`/projects/*.html`) no se enlazan desde esta página; se enlazan 3 desde la home.

### 6.2 Tarjeta de caso `.case-card` (markup en `home.html`, CSS líneas 2076-2147)

```html
<div class="case-grid">
  <a class='case-card' href='/projects/family-olive-farm-jaen'>
    <div class="case-card__media"><picture>…srcset 800/1200/2000w…<img loading="lazy" decoding="async"></picture></div>
    <div class="case-card__body">
      <div class="case-card__meta"><span class="case-card__loc">📍 Lower Austria</span><span class="case-card__year">2025</span></div>
      <h3 class="case-card__title">The M. family</h3>
      <p class="case-card__teaser">One shelter for hay, straw and farm machinery — installed in one day, permit-free*.</p>
      <div class="case-card__footer"><span class="case-card__hall">Arched Storage Tent 9.15 × 20 × 4.50 m</span><span class="case-card__cta">Read →</span></div>
    </div>
  </a>
</div>
```
```css
.case-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}     /* ≤1100px: 2; ≤560px: 1 */
.case-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--color-border);border-radius:12px;overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s;color:var(--color-title)}
.case-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-card);border-color:var(--brand-green)}
.case-card__media{aspect-ratio:4/3;overflow:hidden;background:soft}  .case-card__media img{…transition:transform .4s}  .case-card:hover .case-card__media img{transform:scale(1.04)}
.case-card__body{padding:22px;display:flex;flex-direction:column;gap:10px;flex:1}
.case-card__meta{display:flex;justify-content:space-between;font-size:.78rem;color:sub-title;font-weight:700;letter-spacing:.03em}
.case-card__year{color:var(--brand-green);font-weight:800}
.case-card__title{font-size:1.15rem}  .case-card__teaser{font-size:.92rem;line-height:1.5;flex:1}
.case-card__footer{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:14px;border-top:1px solid var(--color-border);font-size:.82rem}
.case-card__hall{color:sub-title;font-weight:600}  .case-card__cta{color:#1aa585;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.76rem}
```
Recibe `.reveal` y tilt por JS.

### 6.3 Detalle de caso `projects/[slug].html` (EN)

```html
<section class="page-hero"> bg = foto del proyecto; breadcrumbs Home / <a href='/pages/reference-projects'>Projects</a> / <span>título</span>; h1; <p style="color:#dfe7ea;margin:10px 0 0;font-size:1.05rem">📍 Northern Germany · 2023 · 3 × Fabric Building 15.35 × 40 × 7.10 m (1,842 m² total)</p></section>
<section class="section"><div class="container" style="max-width:820px">
  <h2>The challenge</h2><p>…</p>
  <h2 style="margin-top:30px">The Globotent solution</h2><p>…</p>
  <h2 style="margin-top:30px">The outcome</h2><p>…</p>
  <div style="text-align:center;padding:40px 0;margin-top:30px;border-top:1px solid var(--color-border)"><p style="font-size:1.1rem;margin-bottom:18px">A project similar to yours?</p><a class='btn btn--primary btn--lg' href='/pages/request-a-quote'>Request a no-obligation quote</a></div>
</div></section>
```
JSON-LD `Article` (`headline`, `description`, `image`, `datePublished`, `author` Organization, `publisher` con logo). Estructura narrativa fija **reto → solución → resultado**.

CSS latente para un detalle más rico (líneas 2148-2200, 2311-2335): `.case-hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}`, `.case-hero__eyebrow` pill `rgba(26,165,133,.12)`, `.case-hero__role` uppercase verde, `.case-hero__media{aspect-ratio:4/3;box-shadow:var(--shadow-card)}`, `.case-stats{grid 2 col;gap:12px}`, `.case-stat{background:soft;border-radius:10px;padding:14px 18px}`, `.case-body`, `.case-gallery` (≤560px `1fr 1fr`), `.case-quote{padding:24px}`. Sin markup EN.

### 6.4 Filtros de proyectos/productos (`[data-filter-bar]`, JS latente; CSS 4655-4724)

JS (`main.js`, bloque `document.querySelectorAll('[data-filter-bar]')`): busca el **siguiente hermano** que coincida con `[data-filter-grid]`; `cards = grid.querySelectorAll('.product-card')`; `pills = bar.querySelectorAll('.filter-pill')`; `countEl = bar.querySelector('[data-filter-count]')`. `apply(w)`: muestra la card si `w==='all' || card.getAttribute('data-w')===w` (`style.display=''|'none'`), y escribe `n + ' Modell'|' Modelle'` (alemán) en el contador. Clic en pill → `.is-active` exclusivo + `apply(p.getAttribute('data-w'))`. Arranca con `apply('all')`.

Markup reconstruido:
```html
<div class="filter-bar" data-filter-bar>
  <span class="filter-bar__label">Breite</span>
  <div class="filter-bar__pills">
    <button class="filter-pill is-active" data-w="all">Alle</button>
    <button class="filter-pill" data-w="20">20 m</button>
  </div>
  <span class="filter-bar__count" data-filter-count></span>
</div>
<div class="product-grid" data-filter-grid> <a class="product-card" data-w="20">… </div>
```
CSS: `.filter-bar{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin:0 0 28px;padding:16px 18px;border:1px solid var(--color-border);border-radius:14px;background:#fafafa}`; `.filter-bar__label` `.78rem uppercase letter-spacing:.08em font-weight:800`; `.filter-pill{border:1px solid border;background:#fff;font-weight:700;font-size:.85rem;padding:8px 16px;border-radius:50px;transition:… .18s}` hover borde/texto verde; `.is-active{background:#1aa585;color:#fff}`; `.filter-bar__count{margin-left:auto;font-size:.85rem;font-weight:600}` (≤560px `width:100%`). Variante sport (§14). En EN solo `sport.html` tiene cards con `data-w`, pero **sin** `filter-bar` → filtro inerte.

**Traducción**: `/proyectos/` = `PageHero` + `FilterBar` (shadcn `ToggleGroup type="single"` con `rounded-full`) + grid de `CaseCard`; filtrado por `searchParams` (server) o estado cliente; contador `aria-live="polite"`. `/proyectos/[slug]/` = `PageHero` con foto + `Prose` reto/solución/resultado + `CaseStats` (dl 2 col) + `CaseGallery` con lightbox + JSON-LD `Article` (o `CreativeWork`) + CTA.

Props sugeridas: `FilterBar`: `{label, options: {value, label}[], active, onChange, count}`. `CaseCard`: `{href, image: {src, alt}, location, year, title, teaser, hallLabel}`.

---

## 7. Plantilla EMPRESA

### 7.1 `about-us.html`

Secciones: `page-hero` (bg `hero_banner_1.jpg`) → 3 bloques de prosa alternando `.section` / `.section--soft` / `.section`, cada uno `.container[max-width:820px]` › `.section__head[text-align:left]` › `.section__eyebrow` ("Our mission", "Why Globotent?", "Founder") + `h2` + `p`/`ul` → `section--brand` con `cta-band` transparente. Cita del fundador:
```html
<blockquote style="font-style:italic;border-left:4px solid var(--brand-green);padding:10px 0 10px 18px;color:var(--color-sub-title);margin:18px 0">"…"<footer style="margin-top:10px;font-style:normal;font-weight:700;color:var(--color-title)">— Javier Pozo, CEO &amp; Founder</footer></blockquote>
```
Sin imágenes en el cuerpo, sin cifras, sin timeline (CSS latente `.timeline` líneas 3523-3580, `.trust-bar` 3433-3462, `.cert-grid/.cert-item` 2632-2660, `.press-strip` con `animation:press-scroll 40s linear infinite`).

### 7.2 `team.html`

`page-hero` + `.section` › `.container[820px]` › `p`, `h2` "Leadership", `p` con `<strong>`. **Sin tarjetas**. CSS latente `.team-grid{repeat(4,1fr);gap:20px}` (≤900: 2, ≤560: 1), `.team-card{padding:22px;text-align:center}` hover borde verde `translateY(-2px)`, `.team-card__media{96px círculo}`, `.team-card__role` verde uppercase `.82rem`, `.team-card__region`; y `.team-wall`/`.team-wall__item` (5425-5466, hover `img` scale) para mosaico.

### 7.3 `sustainability.html`, `technical-glossary.html`

Prosa 820px con `h2` + `ul style="line-height:1.8"` (`<li><strong>…:</strong> …</li>`). Glosario: `<dl>` con `<dt><strong>Term</strong></dt><dd>…</dd>` sin clases.

### 7.4 `produkte.html` y `all-models.html` — hubs de categorías

`produkte.html`:
```html
<div class="world-block">
  <div class="world-block__head"><h3>Industry &amp; Agriculture</h3><a class='world-block__link' href='/categories/storage-tents'>Alle Shelters →</a></div>
  <div class="kategorien">
    <a class='collection-card' href='/categories/storage-tents'><picture>…</picture><div class="collection-card__label"><span>Category</span><h3>Arched Storage Tents</h3></div></a> …
  </div>
</div>
<div class="world-block world-block--sport sport-world" style="margin-top:48px">
  <div class="world-block__head"><h3><span class="world-block__sport-logo">globotent</span> SPORTS</h3><a class='world-block__link' href='/pages/sport'>Zur Sport-Welt →</a></div>
  <div class="kategorien"> 3 collection-card </div>
</div>
```
CSS (líneas 537-583, 4176-4232): `.kategorien{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}` (≤720: 1); `.kategorien--center{grid-template-columns:minmax(0,1fr);max-width:calc(50% - 12px);margin:auto}`; `.collection-card{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:16/10;display:block;color:#fff}`, `img` absolute cover `transition:transform .4s ease`, `::after` degradado `rgba(6,24,39,0) 40% → rgba(6,24,39,.85) 100%`, hover `img{transform:scale(1.05)}`; `.collection-card__label{position:absolute;left:24px;right:24px;bottom:20px}`, `h3` blanco `1.6rem`, `span` lima uppercase `.8rem letter-spacing:.08em`. `.world-block__head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:22px;padding-bottom:12px;border-bottom:2px solid var(--color-border)}`; `.world-block__link` uppercase verde `.8rem`. Sport: `border-bottom:1px solid #000` + `::after` subrayado `64px × 3px #e3fc03`, `h3` en `'Clash Display'` uppercase, link negro con hover `box-shadow:inset 0 -.55em 0 #e3fc03`; regla `.world-block--sport .kategorien .collection-card:last-child:nth-child(odd){grid-column:1/-1;justify-self:center;width:calc(50% - 12px)}` (la 3.ª card impar se centra).

`all-models.html` y `calculators.html` usan `.collection-card` **sin `<picture>`** → card vacía de `aspect-ratio:16/10` con solo el degradado y el label (sobre fondo transparente; el `::after` es lo único visible). Segunda fila con `.kategorien.kategorien--center`.

**Traducción**: `CollectionCard` = `<Link className="group relative block aspect-[16/10] overflow-hidden rounded-xl text-white">` + `<Image fill className="object-cover transition-transform duration-[400ms] group-hover:scale-105">` + overlay `bg-gradient-to-b from-transparent via-40% to-[#061827]/85` + label absolute. Para Pavivasa: hub `/servicios` con una card por sistema (impreso, pulido, microcemento…).

Props sugeridas: `{href, image?: {src, alt}, category, title}` (`image` opcional: variante sin `<picture>` de `all-models.html`/`calculators.html`).

---

## 8. FORMULARIOS (contact, request-a-quote, downloads, 3d-preview, thank-you)

### 8.1 Convenciones comunes a los 4 formularios

| Convención | Literal |
|---|---|
| Etiqueta | `<form action='../pages/thank-you' class='form-grid' method='POST' name='kontakt' style='…'>` — **no hay `data-netlify`, `netlify`, `data-netlify-honeypot` ni `netlify-honeypot`** en ninguna página EN (grep = 0). El JS sí prevé `form[data-netlify]` (ver 8.6). |
| Campo oculto | `<input type="hidden" name="form-name" value="kontakt">` (patrón Netlify Forms) |
| Honeypot | `<p class="hp-field" hidden><label>Do not fill in: <input name="bot-field"></label></p>` — `.hp-field` **no tiene CSS**; se oculta por el atributo `hidden`. |
| Campo | `<div class="field"><label>Name *</label><input type="text" name="name" required autocomplete="name" enterkeyhint="next"></div>` |
| Hint en label | `<label>Phone *<span class="field__hint">for WhatsApp / photo exchange</span></label>` |
| Consentimiento | `<label class="consent-row"><input type="checkbox" required><span>I have read the <a href='/pages/privacy-policy'>Privacy Policy</a> and accept it.</span></label>` (checkbox **sin `name`**) |
| Botón | `<button class="btn btn--primary btn--lg" type="submit">…</button>` |
| Trust line | `<p class="form-trust">🔒 SSL-encrypted · Response within 24 h · free &amp; no obligation</p>` |
| Destino | `thank-you.html` (§8.5) |
| `name=` en alemán | `telefon`, `nachricht`, `vorname`, `nachname`, `firma`, `halltyp`, `land`, `groesse`, `anmerkungen`, `wunsch`, `foto`, `halle_kategorie`, `farbe`, `ort` |

CSS (líneas 815-878, 1465-1503, 3748-3780):
```css
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:720px;margin:0 auto}   /* ≤900/768px: 1fr; 768: gap 24px */
.form-grid .full{grid-column:1/-1}
.field label{display:block;font-weight:700;margin-bottom:6px;color:var(--color-title);font-size:.9rem}
.field__hint{display:inline-block;margin-left:8px;font-weight:400;color:sub-title;font-size:.78rem}
.field input,.field select,.field textarea{width:100%;padding:12px 14px;border:1px solid var(--color-border);border-radius:10px;font-family:inherit;font-size:16px;background:#fff}
.field input:focus,…{outline:none;border-color:var(--brand-green);box-shadow:0 0 0 3px rgba(26,165,133,.15)}
.field textarea{min-height:140px;resize:vertical}
.field input[type="file"]{padding:10px 12px;font-size:14px;background:soft;cursor:pointer}  + ::-webkit-file-upload-button estilizado
.consent-row{display:flex;align-items:flex-start;gap:10px;margin:6px 0 14px;font-size:.9rem;line-height:1.5}
.consent-row input[type="checkbox"]{width:18px;height:18px;flex:0 0 18px;margin:2px 0 0;accent-color:var(--brand-green)}
.consent-row a{color:var(--brand-green-deep);font-weight:700;text-decoration:underline}
.toggle-row{display:inline-flex;align-items:center;gap:8px;margin-top:6px;font-weight:600;font-size:.9rem;cursor:pointer}
.form-trust{grid-column:1/-1;margin:0;text-align:center;color:sub-title;font-size:.82rem}
input[type=text],…,textarea,select{font-size:16px}   /* evita zoom iOS */
```

### 8.2 `contact.html` — `.contact-grid`

```html
<div class="contact-grid">
  <div>  h2 "How to reach us" · p · dirección · 
    <div class="contact-actions">
      <a class="contact-action" href="tel:+34657472335" aria-label="Call the hotline"><span class="contact-action__icon" aria-hidden="true">📞</span><span class="contact-action__label">Hotline<br><strong>+34 657 472 335</strong></span></a>
      <a class="contact-action" href="mailto:info@globotent.com">✉️ … </a>
    </div>
    p horario · <p><a class='btn btn--primary' href='/pages/request-a-quote'>Request a fast quote</a></p>
  </div>
  <form action='../pages/thank-you' class='form-grid' method='POST' name='kontakt' style='grid-template-columns:1fr'>
    form-name=kontakt · hp · name* (text) · telefon* (tel) · email · nachricht* (textarea, enterkeyhint="send") · consent-row · "Send message"
  </form>
</div>
```
CSS: `.contact-grid{max-width:880px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px}` (≤768: 1fr, gap 32px); `.contact-actions{grid;gap:12px;margin:24px 0}`; `.contact-action{display:flex;align-items:center;gap:14px;min-height:64px;padding:14px 18px;background:soft;border:1px solid border;border-radius:12px}` hover `background:#eaf6f1;border-color:#1aa585`; `__icon 1.6rem`, `__label .95rem #5a6b73`, `strong 1.05rem`. Sin mapa, sin JSON-LD `ContactPage`.

### 8.3 `request-a-quote.html` — formulario de presupuesto (2 columnas)

`<form … name='angebot-rfq' style='grid-template-columns:1fr 1fr;gap:18px'>` dentro de `.container[max-width:760px]`. Campos en orden: `vorname*` | `nachname` | `telefon*` (tel, inputmode) | `email` | `firma` (`.field.full` + `style="grid-column:1/-1"`) | `halltyp*` select (`— Please select —`, Arched Storage Tent, Fabric Building, Riding Arena Cover, Padel/Tennis Court Cover, Pickleball Court Cover, Not sure yet) | `land` select (Spain, Germany, Austria, France, UK, Other) | `groesse` text placeholder "e.g. 20 × 9 × 4.5 m" | `anmerkungen` textarea | `consent-row.full` | `button.full` "Request no-obligation quote" | `.form-trust`. Sin `data-form-expand` (JS latente, 8.6).

### 8.4 `downloads.html` y `3d-preview.html`

- Downloads (`name='downloads'`, 1 col): `name*`, `email*`, `firma`, grupo de 4 `label.toggle-row` con checkbox `name="wunsch"` (`Katalog` checked, `Checkliste`, `Bauanzeige`, `Förderungen`), consentimiento como `label.toggle-row` (no `.consent-row`), botón "Receive documents", trust "Instant delivery". **No hay `.download-card`** (CSS latente 2703-2725: `.download-grid{2 col;gap:20px}`, `.download-card{padding:24px;text-align:center}`, `__icon 2.6rem`, `p{min-height:54px}`); los documentos se piden por email, no se descargan.
- 3D preview (`name='3d-vorschau'`, `enctype='multipart/form-data'`): `foto*` (`type="file" accept="image/*"`), `halle_kategorie*` select, `farbe*` radios inline (White/Green/Grey/Anthracite en `div style="display:flex;gap:14px;flex-wrap:wrap"`), `anmerkungen`, `name*`, `telefon*`, `email`, `ort` (`autocomplete="postal-code"`), consent, "Request free 3D rendering". Es un **formulario**, no un visor.

### 8.5 `thank-you.html`

Solo `page-hero` sin imagen, centrado: h1 "Thanks for your enquiry!", p, y 3 botones: WhatsApp (`btn--primary btn--lg`, `https://wa.me/34657472335?text=Hi%20Globotent%2C%20I%20just%20sent%20my%20request...`), `tel:` (`btn--secondary btn--lg` — sobre fondo oscuro, borde `--color-title` #151719 casi invisible), `btn--ghost-light btn--lg` "Back to home". Sin `<section class="section">`, sin tracking de conversión específico (el GTM es global).

### 8.6 JS de formularios (`main.js`, latente en EN)

- `[data-form-expand]`: botón dentro del form que revela `.form-stage-2` (`hidden=false`) al clic **o automáticamente cuando el usuario enfoca ≥2 campos** (`focus` con `{once:true}` por campo). CSS `.form-expand-btn{grid-column:1/-1;border:1px dashed border;color:var(--brand-green-dark);padding:10px 16px;border-radius:10px;font-weight:700;font-size:.9rem}` hover `rgba(26,165,133,.06)`. `.form-stage-2` no tiene CSS.
- `form[data-netlify]`: añade hidden `event_id` (`crypto.randomUUID()`), `fbp` (cookie `_fbp`), `fbc` (cookie `_fbc` o `fbclid` de la URL → `fb.1.<ts>.<fbclid>`), `event_source_url`, `client_user_agent` — para Meta CAPI. `ecUserData(form)` normaliza `email` lowercase, `telefon` a `[0-9+]`, `vorname/nachname` o split de `name`.
- Prefill: si `location.pathname.endsWith('request-for-quote.html')` (¡no coincide con `request-a-quote.html` EN!) lee `sessionStorage.globotent_config` y lo vuelca en `textarea[name="anmerkungen"]` con banner verde `border-left:4px solid #1aa585`.

### 8.7 Traducción a Next/Tailwind/shadcn

- `react-hook-form` + `zod` + shadcn `Form`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`; server action que envía (Resend/SMTP) y redirige a `/presupuesto/gracias`.
- Mantener: honeypot (`<input name="bot-field" className="hidden" tabIndex={-1} autoComplete="off">`), `font-size:16px` en inputs, focus ring `ring-[3px] ring-primary/15 border-primary`, `inputmode`/`autocomplete`, consent con enlace a `/legal/privacidad`, línea trust bajo el botón, layout 2 col con `col-span-2` en select/textarea.
- Campos Pavivasa sugeridos (equivalentes a `halltyp/groesse/anmerkungen/ort`): `servicio` (select: hormigón impreso / pulido / …), `superficie_m2`, `localidad`, `mensaje`, `foto` opcional (`multipart`).

---

## 9. FAQ (`pages/faq.html`)

Acordeón **nativo `<details>`** sin JS:
```html
<div class="faq-list" style="display:flex;flex-direction:column;gap:10px">
  <details class="faq-item"><summary>What sizes are available for each model?</summary><div style="padding:10px 0;color:var(--color-sub-title);line-height:1.6">…</div></details>
  × 10
</div>
```
CSS (líneas 2418-2449, 3885):
```css
.faq-list{display:flex;flex-direction:column;gap:10px}
.faq-item{border:1px solid var(--color-border);border-radius:10px;padding:16px 20px;background:#fff;transition:border-color .2s}
.faq-item[open]{border-color:var(--brand-green)}
.faq-item summary{cursor:pointer;font-weight:700;color:var(--color-title);font-size:1rem;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq-item summary::after{content:"+";color:var(--brand-green);font-size:1.6rem;font-weight:400}
.faq-item[open] summary::after{content:"–"}
.faq-item p{margin:12px 0 0;color:var(--color-text)}     /* el EN usa <div style> en vez de <p> */
.feature__more summary,.faq-item summary,details>summary{min-height:44px;display:flex;align-items:center;padding:8px 0}
```
- **Sin animación** de apertura (solo transición del borde). Sin `::-webkit-details-marker` reset para `.faq-item` (sí para `.feature__more`).
- **No hay JSON-LD `FAQPage`** (grep `"@type"` en faq.html: solo `Organization` + `PostalAddress`).
- Cierre: `section--soft` › `cta-band` "Can't find your answer?" → `/pages/contact` con `btn--primary`.

**Traducción**: shadcn `Accordion type="single" collapsible` con `AccordionItem className="rounded-[10px] border px-5 data-[state=open]:border-primary"`, trigger `font-bold` con icono `Plus`/`Minus` en `text-primary text-[1.6rem]`; añadir JSON-LD `FAQPage` (mejora sobre el original).

---

## 10. RESEÑAS (`pages/customer-reviews.html`)

- Hero: h1 "4.96 out of 5 — over 127 reviews". JSON-LD con `AggregateRating` (único tipo enriquecido, además de `Organization`/`JobPosting`/`Article`, **entre las páginas interiores documentadas en esta dimensión** — excluida `home.html`, que pertenece a otra dimensión: esta sí añade un segundo `<script type="application/ld+json">` con `"@type":"LocalBusiness"` y un `review[]` de 6 `Review`/`Rating`/`Person` anidados, más rico que el `AggregateRating` suelto de esta página. Las 8 páginas `projects/*.html` usan además `ImageObject` en `publisher.logo`, también fuera de esta dimensión).
- Grid: `.reviews-grid` › 9 × `article.review`:
```html
<article class="review">
  <div class="review__head"><div class="stars" aria-label="5 of 5"><svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="#f4c95e">…</svg> ×5</div></div>
  <p class="review__text">"…"</p>
  <div class="review__meta"><div><strong>Alba Márquez</strong><span>Cantabria, Spain</span></div></div>
</article>
```
CSS (`.reviews-grid` en línea 1980; bloque 1927-2025): `.reviews-grid{repeat(3,1fr);gap:20px}` (≤1100: 2, ≤560: 1); `.review{background:#fff;border:1px solid border;border-radius:12px;padding:22px;display:flex;flex-direction:column;gap:14px}`; `.review__text{font-size:.95rem;color:title;line-height:1.55;flex:1}`; `.review__meta{display:flex;justify-content:space-between;align-items:flex-end;padding-top:12px;border-top:1px solid border;font-size:.85rem}`, `strong .9rem`, `span .8rem sub-title`; `.stars{inline-flex;gap:2px}`; estrella `#f4c95e` (amarillo no tokenizado). Latentes: `.review__date`, `.review__hall` (pill verde `rgba(26,165,133,.10)`), `.reviews-head` (flex space-between), `.testimonials/.testimonial` (3 col, `padding:28px`, cita itálica, avatar 48px), `.rating-badge`, `.video-testi` (+ JS `.video-testi__play` que inyecta `<video controls autoplay>` desde `data-video-src`).
- Cierre: `section--soft` › `cta-band` `btn--primary`.

**Traducción**: `ReviewCard` = shadcn `Card` `flex flex-col gap-3.5 p-[22px]`; estrellas = 5 × lucide `Star` `fill-[#f4c95e] stroke-none size-4`; `aria-label="5 de 5"`; grid `md:grid-cols-2 xl:grid-cols-3`; JSON-LD `AggregateRating` sobre `LocalBusiness`.

Props sugeridas: `ReviewCard`: `{stars: 1-5, text, authorName, authorLocation}`.

---

## 11. EMPLEO (`pages/jobs.html` + `pages/jobs/*.html`) — la plantilla más "diseñada" del sitio

### 11.1 Listado `jobs.html`

1. `section.page-hero.jobs-hero` (bg `About_page_image_1.jpg`): breadcrumbs `Home / About Us / Jobs`, `<span class="jobs-hero__eyebrow">Karriere bei Globotent</span>`, h1, p, `<div class="jobs-hero__cta"><a href="#offene-stellen" class="btn btn--lg btn--lime">Offene Stellen ansehen</a><span class="jobs-hero__count">3 offene Positionen</span></div>`.
2. `section.section.section--tight` › `.jobs-values` › 3 × `.jobs-value` (`span.jobs-value__ico` emoji, h3, p).
3. `section.section.section--soft#offene-stellen` › `.section__head` (eyebrow + h2 + p, centrado) › `.jobs-grid` › 3 × `a.jobcard.reveal`.
4. `section.section` › `cta-band` "Keine passende Stelle dabei?" con `mailto:…?subject=Initiativbewerbung` `btn--primary`.

`jobcard`:
```html
<a class='jobcard reveal' href='/pages/jobs/sdr-sales'>
  <div class="jobcard__top"><span class="jobcard__ico" aria-hidden="true">📞</span><span class="jobcard__tag">Vollzeit · Teilzeit · Remote</span></div>
  <h2 class="jobcard__title">SDR / Sales Development Representative</h2>
  <span class="jobcard__gender">(m/w/d) – 100 % Homeoffice</span>
  <div class="jobcard-meta"><span class="jobcard-meta__chip">Remote (deutschsprachiger Raum)</span><span class="jobcard-meta__chip">100 % Homeoffice</span><span class="jobcard-meta__chip jobcard-meta__chip--salary">from € 1.273,50 brutto/Monat</span></div>
  <p class="jobcard__teaser">…</p>
  <span class="jobcard__link">Stelle ansehen <span aria-hidden="true">→</span></span>
</a>
```
CSS (`.jobcard` en línea 5538; bloque 5467-5628, más 5807-5811):
```css
.jobs-hero__eyebrow{display:inline-block;background:var(--brand-lime);color:var(--brand-dark);font-weight:800;font-size:.74rem;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:50px;margin-bottom:14px}
.jobs-hero h1{max-width:14ch}  .jobs-hero p{color:#dfe7ea;max-width:620px;font-size:1.08rem;line-height:1.55}
.jobs-hero__cta{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:26px}
.jobs-hero__count{color:#cfe0dc;font-weight:600;font-size:.95rem}
.jobs-hero__count::before{content:"●";color:var(--brand-lime);margin-right:7px;font-size:.7em;vertical-align:middle;animation:jobsPulse 2s infinite}
@keyframes jobsPulse{0%,100%{opacity:1}50%{opacity:.35}}
.jobs-values{grid repeat(3,1fr);gap:22px}  .jobs-value{background:#fff;border:1px solid border;border-radius:18px;padding:26px 24px;transition:transform .2s,box-shadow .2s} :hover{translateY(-4px);box-shadow:0 18px 44px rgba(6,24,39,.10)}
.jobs-grid{grid repeat(3,1fr);gap:24px}   /* ≤900: 1fr (también .jobs-values) */
.jobcard{position:relative;display:flex;flex-direction:column;background:#fff;border:1px solid border;border-radius:20px;padding:28px 26px 24px;overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s}
.jobcard::before{content:"";position:absolute;left:0;top:0;height:4px;width:100%;background:linear-gradient(90deg,var(--brand-green),var(--brand-lime));transform:scaleX(0);transform-origin:left;transition:transform .25s}
.jobcard:hover{transform:translateY(-5px);box-shadow:0 22px 50px rgba(6,24,39,.13);border-color:transparent}  .jobcard:hover::before{transform:scaleX(1)}   /* barra superior que "se dibuja" */
.jobcard__tag{background:rgba(26,165,133,.10);color:var(--brand-green-dark);font-weight:800;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;padding:5px 11px;border-radius:50px}
.jobcard__title{font-size:1.22rem;line-height:1.3}  .jobcard__gender{display:block;color:sub-title;font-size:.84rem;font-weight:600;margin-top:5px}
.jobcard-meta__chip{background:soft;border:1px solid border;color:title;font-size:.76rem;font-weight:600;padding:5px 11px;border-radius:50px}
.jobcard-meta__chip--salary{background:rgba(26,165,133,.10);border-color:transparent;color:var(--brand-green-dark);font-weight:800}
.jobcard__teaser{font-size:.92rem;line-height:1.55;flex-grow:1}
.jobcard__link{inline-flex;gap:7px;color:var(--brand-green-dark);font-weight:800;font-size:.9rem;text-transform:uppercase;letter-spacing:.03em}  .jobcard:hover .jobcard__link span{transform:translateX(4px)}
```

### 11.2 Detalle `jobs/sdr-sales.html`

1. `page-hero.jobdetail-hero`: breadcrumbs 4 niveles, `jobs-hero__eyebrow` (tag), `h1` + `<span class="jobdetail-hero__gender">` (`font-weight:500;color:#cfe0dc;font-size:.62em`), `.jobs-hero__cta` con `btn--lg btn--lime` `mailto:…?subject=Bewerbung%3A…` y `<a class='jobdetail-back' href='/pages/jobs'>← Alle offenen Stellen</a>` (subrayado, `text-underline-offset:3px`).
2. `section.section` › `.container.jobdetail` (`max-width:980px`):
   - `.job-meta.job-meta--detail` › 4 × `.job-meta__item` (`span.job-meta__k` + `span.job-meta__v`): grid `repeat(4,1fr);gap:1px;background:var(--color-border);border:1px solid border;border-radius:14px` (celdas `background:soft;padding:14px 18px`; ≤900: 2 col; ≤680: 1). Labels `.7rem uppercase verde oscuro`.
   - `.jobdetail-salary` (solo en `studentische-assistenz.html`): `💶` + `__label` "Gehalt" + `__amount` + `__note`; `background:rgba(26,165,133,.07);border:1px solid rgba(26,165,133,.25);border-radius:16px;padding:20px 22px`.
   - `.jobdetail__intro` (h2 1.3rem + p 1.04rem).
   - `.job-cols` (grid 3 col, gap 30px; ≤900: 1) › 3 × `.job-col` (`h3` con `span.job-col__dot` 9px verde; `ul` sin viñeta, `li::before` check CSS `border-left/bottom 2.5px` rotado −45°); la tercera `.job-col--offer` usa `--brand-lime` en punto y checks.
   - `.jobdetail-apply` (flex space-between, `background:soft;border-radius:20px;padding:30px 34px;margin-top:42px`; ≤680: columna centrada) con h2 "Interesse?" + p + `btn--lg btn--primary` mailto.
3. `section.section--soft` › `.section__head` (eyebrow "Karriere", h2) › `.job-others` (grid 2 col) › `a.job-other` (`__ico` + `strong` + `small` uppercase verde; hover borde verde, `translateY(-3px)`, `box-shadow:0 14px 34px rgba(26,165,133,.13)`).
4. JSON-LD **`JobPosting`**, con campos que varían por puesto (los 3 job listados en el alcance: `sdr-sales`, `studentische-assistenz`, `freiberuflicher-ingenieur`). Comunes a los 3: `title`, `description` HTML, `datePosted`, `validThrough`, `employmentType[]`, `identifier`, `hiringOrganization`, `jobLocation` (`@type":"Place"`), `directApply:true`. El resto no:

| Campo | `sdr-sales` | `studentische-assistenz` | `freiberuflicher-ingenieur` |
|---|---|---|---|
| `employmentType` | `["FULL_TIME","PART_TIME"]` | `["PART_TIME","INTERN"]` | `["CONTRACTOR"]` |
| `jobLocation.address` | solo `addressCountry:"ES"` | completa: `addressLocality:"Barcelona"`, `postalCode:"1010"`, `streetAddress:"Gran Vía de les Corts Catalanes 303, Entresuelo 1"` | solo `addressCountry:"ES"` |
| `jobLocationType` | `"TELECOMMUTE"` | — (ausente) | `"TELECOMMUTE"` |
| `applicantLocationRequirements` | `[Austria, Germany, Switzerland]` | — (ausente) | `[Austria, Germany, Switzerland]` |
| `baseSalary` | — (ausente) | `{"@type":"MonetaryAmount","currency":"EUR","value":{"@type":"QuantitativeValue","value":1273.5,"unitText":"MONTH"}}` | — (ausente) |

`baseSalary` es el dato real que sustenta el chip visual `.jobcard-meta__chip--salary` ("from € 1.273,50 brutto/Monat", §11.1) y el bloque `.jobdetail-salary` (punto 2, "solo en `studentische-assistenz.html`"). Nota de fuente: `jobLocation.address` de este puesto declara `addressLocality:"Barcelona"` con código postal `1010` (el de Viena), aunque la `description` del propio puesto menciona oficina "am Schwedenplatz in Wien" — inconsistencia del dato fuente, no de la plantilla.

Contenido en alemán sin traducir en el sitio EN (`jobs.html`, `produkte.html`, `sport.html`): la plantilla es la del `.de`.

**Traducción / reutilización en Pavivasa**: el `jobcard` (barra superior animada + chips + link con flecha) y el `job-meta` (grid de 4 datos clave con `gap:1px` sobre color de borde) son directamente reutilizables como **ficha de servicio** (`/[servicio]/`): meta = "Espesor · Uso · Plazo · Garantía"; `job-cols` = "Ventajas / Proceso / Incluye". shadcn: `Card` + `Badge` + `Separator`; la barra superior: `before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-primary before:to-lime group-hover:before:scale-x-100 before:transition-transform`.

Props sugeridas: `JobCard`: `{href, tag, title, gender?, chips: string[], teaser}`.

---

## 12. LEGALES y páginas de texto

`legal-notice.html`, `privacy-policy.html`, `terms-and-conditions.html`:
```html
<section class="page-hero"><div class="container page-hero__inner"><h1>Legal Notice</h1></div></section>
<section class="section"><div class="container" style="max-width:820px">
<h2>Service Provider Identification</h2><p><strong>Globotent Carpas S.L.</strong><br>…</p>
<h2>Purpose</h2><p>…</p> …
</div></section>
```
- Hero sin imagen, sin breadcrumbs. Cuerpo `h2` + `p` (terms con numeración "1. Scope…" en el propio texto). Sin `.prose`, sin `.prose-block` (CSS latente 2450-2463: `.prose-block{margin-bottom:36px}`, `h2{margin-bottom:14px;font-size:1.6rem}`, `p{line-height:1.7}`, `ul{padding-left:22px;line-height:1.7}`; recibe `.reveal` por JS).
- Sin CTA final, sin fecha de última actualización.

**Traducción**: `/legal/aviso-legal`, `/legal/privacidad`, `/legal/cookies` con `PageHero` sin imagen + `<article className="prose prose-neutral max-w-[820px] mx-auto">` (plugin `@tailwindcss/typography`) y `h2 mt-8`. Añadir fecha.

---

## 13. Herramientas: calculadoras, comparador, buscador, guías, descargas (EN = placeholders; CSS/JS latentes)

### 13.1 Estado real EN

| Página | Contenido real | Componentes |
|---|---|---|
| `calculators.html` | hero + `.kategorien` con 3 `.collection-card` **sin imagen** (`<span>Calculator|Tool</span><h3>…</h3>`) | `.kategorien`, `.collection-card` |
| `round-bale-calculator.html`, `machinery-calculator.html` | hero + `p` explicativo + callout gris con `btn--primary btn--lg` → quote | ninguno interactivo. **No hay `<input>`, ni JS de cálculo en `main.js`** (grep `calc` en JS = 2, ambos `.calc-card`/`.calc-*` en la lista de reveal/tilt) |
| `compare-shelters.html` | hero + `p` + callout | idem |
| `shelter-finder.html` | hero + `p` + callout + enlace a contact | idem. Sin `.quiz` |
| `guides/index.html` | hero + `p` "We're preparing the English guide articles" + 2 botones | sin artículos (sitemap solo lista `guides/index.html`) |
| `downloads.html` | formulario (§8.4) | sin `.download-card` |

### 13.2 CSS latente de calculadoras (1158-1275, 1504-1540)

`.calc-grid{repeat(3,1fr);gap:24px}`; `.calc-card{flex column;gap:12px;background:#fff;border:1px solid border;border-radius:12px;padding:28px}` hover `translateY(-4px);box-shadow:0 20px 40px rgba(6,24,39,.14);border-color:#1aa585`; `.calc-card__icon{72px;border-radius:16px;background:rgba(26,165,133,.12)}` (svg 48×36); `.calc-card__cta` uppercase verde `.82rem`; variantes `.section--dark .calc-card` (fondo `rgba(255,255,255,.06)`, cta lima) y `.section--brand .calc-card` (fondo `rgba(255,255,255,.08)`, svg forzados a blanco con `!important`). Layout de calculadora: `.calc-layout{grid 360px 1fr;gap:32px}`, `.calc-layout__controls{sticky;top:100px;padding:24px}`, `.calc-viz__canvas{aspect-ratio:8/5;background:soft}` con `svg`, `.calc-viz__tabs/.calc-viz__tab` (pill 44px, `.is-active` verde), `.calc-disclaimer{background:rgba(244,201,94,.12);border-left:3px solid #f4c95e}`, `.field-row{grid 3 col;gap:10px}`, `input[type="range"]{accent-color:#1aa585}`, `.calc-result{background:linear-gradient(135deg,deep,green);border-radius:10px;padding:18px;color:#fff}` con `__value{2.4rem;800}`, `__unit`, `__meta li`. La lógica JS de cálculo **no está en `main.js`** (estaría inline en las páginas DE; no confirmado).

### 13.3 Quiz del shelter-finder (CSS 3021-3150, sin JS ni markup)

`.quiz{background:#fff;border:1px solid border;border-radius:12px;padding:40px;box-shadow:var(--shadow-card)}` (≤700: 24px); `.quiz__progress{height:4px;background:border;border-radius:4px}` › `.quiz__progress-bar{background:linear-gradient(90deg,#1aa585,#7ec700);transition:width .4s ease}`; `.quiz__step-count` uppercase `.82rem`; `.quiz__step{display:none}` / `.quiz__step.is-active{display:block;animation:quizFade .3s ease}`; `@keyframes quizFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`; `.quiz__options{grid 2 col;gap:12px}` › `button{flex column;padding:18px 20px;border:2px solid border;border-radius:12px}` hover borde verde `translateY(-1px)` `box-shadow:0 6px 14px rgba(26,165,133,.1)`, `.is-selected{border-color:#1aa585;background:rgba(26,165,133,.05)}`; `.quiz__icon{40px;border-radius:10px;background:rgba(26,165,133,.1)}`; `.quiz__result{grid 240px 1fr;background:linear-gradient(135deg,#1aa585,#0d614c);color:#fff;border-radius:12px;padding:24px}` con `__result-eyebrow` lima; `.quiz__restart` enlace subrayado. **La lógica de pasos no está en `main.js`** (no hay `querySelector('.quiz')`).

### 13.4 Comparador (CSS 3151-3205, 3626-3650)

`.compare-slots{grid 3 col;gap:16px}` › `.compare-slot{padding:20px;flex column;gap:14px}` con `select.compare-select`, `.compare-img-wrap{aspect-ratio:4/3}`, `.compare-type` uppercase verde, `h3`, `dl.compare-specs{grid auto 1fr;gap:6px 12px}` (`dt` sub-title 600, `dd` title 700 right). Sin JS.

### 13.5 Otros latentes: `.how-steps/.how-step` (3 col, `__num` 56px círculo degradado, `1.5rem 800`), `.three-d-cta` (grid 2 col, `background:linear-gradient(135deg,#f6f8f7,#eaf3f0)`, `padding:48px`, visual con `box-shadow:0 20px 40px rgba(6,24,39,.15)`), `.blog-card` (2474-2515), `.co2-calc`.

**Traducción**: para Pavivasa las calculadoras se reducen a un **estimador de m²** (`/presupuesto/` paso 1): `Slider` + `RadioGroup` de acabado + resultado en `CalcResult` (degradado verde → aquí tono Pavivasa). El quiz de 3-4 pasos (`quizFade`, barra de progreso) es directamente trasladable a "¿Qué pavimento necesito?" con shadcn `Progress` + `Card` opciones `aria-pressed`.

Props sugeridas: `CalcResult`: `{value, unit, meta: string[]}`.

---

## 14. SUB-MARCA SPORT — cómo el sistema soporta dos lenguajes visuales

Esqueleto de `<section>` de `sport.html`, en orden (`grep -n '<section' site/pages/sport.html`):
1. `section.sp-hero` (línea 128)
2. `section.sp-claim` (línea 141)
3. `section.sp-section#disziplinen` (línea 147)
4. `section.sp-video` (línea 190)
5. `section.sp-section.sp-section--specs` (línea 204)
6. `section.sp-section` (línea 219, sin id ni modificador — contiene el `product-grid` de 10 `product-card`)
7. `section.sp-cta` (línea 321)

### 14.1 Mecanismo: un modificador en `<body>` + overrides por descendencia

```css
.sport-world{--sport-lime:#e3fc03;--sport-ink:#000;--sport-soft:#f4f4f2;--sport-line:#000;--sport-sub:#323232}    /* línea 4234 */
.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1{font-family:'Clash Display',var(--font-family)}
.sport-world .btn{border-radius:50px}
.sport-world .btn--lime{background:var(--sport-lime);color:#000;border:1px solid #000}  :hover{background:#000;color:var(--sport-lime)}
.sport-world .btn--ghost-light{background:transparent;color:#000;border-color:#000}   :hover{background:#000;color:#fff}
.sport-world .btn--primary{background:var(--sport-lime);color:#000;border:1px solid #000}  :hover{background:#000;color:var(--sport-lime)}
.sport-world .btn--secondary{background:transparent;color:#000;border-color:#000}       :hover{background:#000;color:var(--sport-lime)}
.sport-world main{background:#fff}
.sport-world .section--soft{background:var(--sport-soft);border-top:1px solid #000;border-bottom:1px solid #000}
.sport-world .section h2,… h3{color:#000}   .sport-world .section p,… li{color:#323232}
.sport-world .section__eyebrow{display:inline-block;color:#000;background:var(--sport-lime);padding:6px 13px;border-radius:50px}
.sport-world .section__head h2{text-transform:uppercase;letter-spacing:-.01em;line-height:1.06}
.sport-world .product-card{background:#fff;border:1px solid #000;border-radius:16px}   .product-card__badge{background:var(--sport-lime);color:#000}
.sport-world .feature{border:1px solid #000;border-radius:16px}
.sport-world .padel-sizes{border:1px solid #000;border-radius:16px}  th{background:#000;color:var(--sport-lime)}  tr:hover td{background:rgba(227,252,3,.22)}
.sport-world .cta-band{background:var(--sport-lime);color:#000;border:1px solid #000;border-radius:16px}  .btn--primary{background:#000;color:lime}
.sport-world .filter-bar{background:#fff;border-color:#000}  .filter-pill{border-color:#000;color:#000} :hover{box-shadow:inset 0 -.5em 0 var(--sport-lime)}  .is-active{background:var(--sport-lime);border-color:#000;color:#000}
.sport-world .product-info__eyebrow{display:inline-block;color:#000;background:var(--sport-lime);padding:6px 13px;border-radius:50px}
.sport-world .product-info h1{text-transform:uppercase}
.sport-world .gallery__main{border:1px solid #000;border-radius:16px}  .gallery__thumb{border:1px solid #000;border-radius:12px}  .is-active{outline:2px solid var(--sport-lime);outline-offset:-2px}
.sport-world .product-info__stats{border:1px solid #000;border-radius:16px}   .product-info__features li::before{background:var(--sport-lime) url(check negro)}
.sport-world .chip.is-active{background:var(--sport-lime);color:#000;border-color:#000}
```
Reglas del "segundo lenguaje" (todas rastreables arriba y en §14.2):
- **Color**: lima ácido `#e3fc03` (distinto del `--brand-lime:#7ec700` corporativo) + tinta `#000` + gris `#323232` + soft `#f4f4f2`. Desaparece el verde `#1aa585`.
- **Bordes**: `1px solid #000` en todo (cards, tablas, secciones, hero) en lugar de `#e2e2e2`.
- **Radios**: 16px en cards/tablas (frente a 12px), botones siguen a 50px.
- **Sombra dura**: `.sp-disc:hover{box-shadow:7px 7px 0 var(--sport-lime),7px 7px 0 1px #000}` (offset sin blur, doble capa lima + negro).
- **Tipografía**: `'Clash Display'` en `h1-h3`, `weight 600`, `text-transform:uppercase`. **No hay `@font-face` de Clash Display ni `<link>` de fuente distinto de Figtree** en ninguna página (grep `@font-face` = 0; `font-family:` solo Figtree/Georgia/inherit) → **la fuente no se carga y cae al fallback `var(--font-family)` = Figtree**. El diseño "Clash" es intención, no realidad renderizada.
- **Subrayado marcador**: hover con `box-shadow:inset 0 -.5em 0 var(--sport-lime)` (links, pills, CTA de cards) y h1 con `<em>` resaltado: `.sp-hero__h1 em{font-style:normal;background:var(--sport-lime);box-shadow:.1em 0 0 var(--sport-lime),-.1em 0 0 var(--sport-lime);box-decoration-break:clone}`.
- **Eyebrow** = pill lima con texto negro (`padding:6px 13px;border-radius:50px`) en lugar de texto verde suelto.

### 14.2 Componentes exclusivos `sp-*` (`sport.html`, CSS 4257-4548)

| Componente | Markup | CSS clave |
|---|---|---|
| `.sp-hero` | `section.sp-hero` › `.sp-hero__bg[style=bg-image]` › `.container.sp-hero__inner` › `span.sp-hero__lockup > img` (logo 200×80, `fetchpriority="high"`) · `h1.sp-hero__h1` con `<em>` · `p.sp-hero__sub` · `.sp-hero__ctas` (`btn--lg btn--lime` + `btn--lg btn--ghost-light` a `#disziplinen`) | `min-height:84vh;align-items:center;background:#fff;border-bottom:1px solid #000`; overlay **blanco lateral**: `::after{background:linear-gradient(105deg,rgba(255,255,255,.97) 0%,.86 42%,.25 78%,0 100%)}`; `__inner{padding:88px 20px}`; `__lockup img{height:clamp(64px,9vw,104px)}`; `__h1{font-weight:600;font-size:clamp(2.6rem,7vw,5.4rem);line-height:.98;text-transform:uppercase;letter-spacing:-.01em}`; `__sub{1.2rem;#323232;max-width:580px}` |
| `.sp-claim` | `p` con 3 `<span>` "Stützenfrei. Ganzjährig. Spielbereit." | `background:lime;padding:20px 0;border-bottom:1px solid #000`; texto Clash 600 uppercase `clamp(1.05rem,2.4vw,1.7rem)`; `span{margin:0 .7em}` |
| `.sp-section` / `--specs` | contenedor de sección | `background:#fff;color:#323232;padding:78px 0`; `--specs{background:#f4f4f2;border-top/bottom:1px solid #000}` |
| `.sp-head` | `span.sp-head__eyebrow` + h2 + p | `max-width:700px;margin:0 0 42px` (izquierda, no centrado); eyebrow pill lima `.74rem`; h2 `clamp(1.8rem,3.6vw,2.8rem);line-height:1.05;uppercase` |
| `.sp-disciplines` › `a.sp-disc` | `.sp-disc__media > picture` · `.sp-disc__body` (h3, p, `span.sp-disc__cta` "Entdecken →") | grid 4 col (≤1000: 2; ≤820: 1), gap 18px; `.sp-disc{border:1px solid #000;border-radius:16px;transition:box-shadow .25s,transform .25s}` hover `translateY(-4px)` + sombra dura; media `aspect-ratio:4/3;border-bottom:1px solid #000`, img `transition:transform .5s` hover `scale(1.06)`; h3 Clash 1.5rem uppercase; cta uppercase `.82rem`, hover subrayado lima |
| `.sp-video` | `video.sp-video__media[autoplay muted loop playsinline preload="none" poster]` › `source mp4` · `.sp-video__overlay` · `.container.sp-video__inner` (eyebrow, h2, p, `btn--lime`) | `min-height:70vh;align-items:flex-end;background:#000;border-top:1px solid #000`; overlay `linear-gradient(180deg,rgba(5,10,7,.12) 0%,.5 55%,.92 100%)`; h2 blanco uppercase. **Sin JS** (el `[data-bg-video]` lazy del JS no se usa aquí: el `<source>` está inline) |
| `.sp-specs` › `.sp-spec` | `span.sp-spec__num` + `span.sp-spec__lbl` ×4 | contenedor `grid 4 col;border:1px solid #000;border-radius:16px;overflow:hidden;background:#fff`; celda `padding:34px 26px;border-right:1px solid #000` (última sin); número Clash 600 `2.6rem` con `::after` barra `34px × 6px` lima; ≤820: 2 col con bordes recalculados; ≤520: 1 col |
| `.product-grid` en sport | mismas `product-card` con `data-w` | `.sport-world .sp-section .product-card{border:1px solid #000;border-radius:16px}` badge lima |
| `.sp-cta` | h2 + p + `.sp-cta__btns` (`btn--lime` invertido a negro/lima + `btn--ghost-light` con `tel:`) | `background:lime;padding:70px 0;text-align:center;border-top/bottom:1px solid #000`; h2 Clash uppercase `clamp(1.8rem,4vw,3rem)` (línea 4467; misma regla en `.sp-video__inner h2`, línea 4523); `.sp-cta .btn--lime{background:#000;color:lime}` hover blanco |

Además latentes para sport: `.padel-promo` (caja negra `border-radius:16px;padding:28px 32px`, eyebrow lima, botones lima/ghost blancos), `.padel-size-layout{grid 1.1fr 1fr;gap:40px}` + `.padel-sizes-wrap{overflow-x:auto}`, `.padel-sizes` (tabla base líneas 339-370: `border-radius:12px;overflow:hidden;th{padding:14px 18px;background:soft;font-size:.82rem;uppercase;letter-spacing:.08em}td{padding:14px 18px;font-size:.95rem}tr:hover td{background:rgba(26,165,133,.04)}td strong{color:green-dark;italic;800}`; ≤780px oculta la 3.ª columna; en `.padel-size-layout` ≤760px oculta la última). **Ninguna página EN contiene `.padel-sizes`.**

### 14.3 Cómo lo consigue el sistema (lección para Pavivasa)

1. Un solo CSS; el tema se activa con **una clase en `<body>`** (`sport-world`) o en un bloque (`.world-block--sport.sport-world` en `produkte.html`, tematizando solo esa sección).
2. Los componentes base (`.btn`, `.product-card`, `.section--soft`, `.cta-band`, `.filter-bar`, `.gallery`, `.section__eyebrow`) se **re-pintan por descendencia** (`.sport-world .x{…}`) sin cambiar markup; los tokens nuevos se declaran como custom properties en la clase (`--sport-lime` etc.).
3. Componentes realmente nuevos solo donde el layout cambia (`sp-hero` con overlay blanco lateral en vez de oscuro inferior, `sp-specs`, `sp-claim`).
4. Puntos débiles observados: se mezclan valores literales (`#000`, `#e3fc03`, `#323232`) con las variables recién definidas; la fuente no se carga; hay nombres de clase que no coinciden con su CSS real (p. ej. `.product-detail__info` en producto, §5.1, sin regla propia) — hay que verificar cada selector contra el CSS, no asumir por el nombre.

**Traducción a Tailwind/shadcn**: definir los tokens shadcn como CSS vars en `:root` y un **segundo scope** `[data-theme="sport"]` (o `.theme-alt`) que redefine `--primary`, `--border`, `--radius`, `--foreground`. Cualquier `Button`/`Card` de shadcn cambia solo por herencia. Utilities extra: `shadow-hard: 7px 7px 0 var(--accent), 7px 7px 0 1px #000`, `underline-marker: inset 0 -.5em 0 var(--accent)` como `boxShadow` en `tailwind.config`. Para Pavivasa esto permite p. ej. una línea "Pavivasa Home / Pavivasa Industrial" o "impreso vs pulido" con dos acentos sin duplicar componentes.

---

## 15. Tabla de mapeo: plantilla Globotent → ruta Pavivasa

| Ruta Pavivasa | Plantilla Globotent de referencia | Componentes que reutiliza | Notas |
|---|---|---|---|
| `/` | `index.html` (otra dimensión) + hub `produkte.html` | `world-block`, `kategorien`/`collection-card`, `case-grid`/`case-card`, `reviews-grid`/`review`, `cta-band`, `calc-card` | La home usa `.hero`/`[data-cine-hero]`, no `.page-hero` |
| `/[servicio]/` (hormigón impreso, pulido…) | **categoría** (`categories/storage-tents.html`) + **ficha producto** (`products/*.html`) + `jobs/*.html` (meta grid / 3 columnas) | `page-hero` con foto, `section__head[left]` + `ul` de 6 claves, `product-grid` de variantes/acabados (`product-card` con badges "espesor", "uso"), `product-detail` (galería con thumbs + lightbox `data-gallery-*` + `product-info__stats` 2×2 + `product-info__features` con check), tabla técnica (inline en original → shadcn `Table`), `job-meta` (4 datos) y `job-cols` (3 columnas), `faq-item` (FAQ por servicio), `section--brand`+`cta-band` transparente | Sustituir m²/W×L×H por espesor, resistencia, plazo, garantía |
| `/proyectos/` | `reference-projects.html` (placeholder) + `case-grid` de home + `filter-bar` latente | `page-hero`, `filter-bar`/`filter-pill`/`[data-filter-count]` (filtro por servicio/localidad), `case-grid`/`case-card` (loc 📍, año, título, teaser, footer con sistema + "Ver →"), `cta-band` | Implementar el filtro que en Globotent existe en JS pero no en markup |
| `/proyectos/[slug]/` | `projects/*.html` + CSS `case-hero`/`case-stats`/`case-gallery` | `page-hero` con foto del proyecto y p meta "📍 · año · sistema · m²", prosa reto/solución/resultado (820px), `case-stats` (m², plazo, sistema, año), galería `[data-photo-gallery]` + `lightbox`, `before-after` (JS existente) para antes/después, callout final con `border-top`, JSON-LD `Article` | Enlazar "proyectos relacionados" con `job-others` (pares icono+título+small) |
| `/empresa/` | `about-us.html` + `team.html` + `sustainability.html` | `page-hero`, bloques `section`/`section--soft` alternos con `section__eyebrow`+h2+p/ul, `blockquote` fundador, `team-grid`/`team-card` latentes (96px avatar, rol verde uppercase), `trust-bar`/`cert-grid` latentes, `section--brand` CTA | Añadir cifras (`sp-specs` sin borde negro es un buen "stats strip") |
| `/presupuesto/` | `request-a-quote.html` (+ `contact.html` para columna de contacto, `3d-preview.html` para subida de foto) | `form-grid` 2 col con `.full`, `field`/`field__hint`, `select` tipo de servicio, `textarea`, `consent-row`, `form-trust`, honeypot `bot-field`, `contact-grid`/`contact-action` (tel/mail/WhatsApp), `form-expand` opcional (fase 2 progresiva), `quiz` latente como paso previo | Página `/presupuesto/gracias` = `thank-you.html` (hero centrado con WhatsApp/tel/home) |
| `/blog/` | `guides/index.html` (placeholder) + CSS `blog-card`, `page-hero--blog` | `page-hero` (min-height 380px), grid de `blog-card` (media 16/9?, meta, h3, p, cta) — ver CSS 2474-2515 | Globotent EN no tiene artículos: diseñar desde `case-card`/`blog-card` |
| `/blog/[slug]/` | `projects/*.html` (prosa 820px) + `prose-block` | `page-hero` con imagen, `prose`/`prose-block` (h2 1.6rem, p 1.7), `faq-item` si procede, `cta-band`, JSON-LD `Article` | Tipografía via `@tailwindcss/typography` |
| Legales (`/legal/*`) | `legal-notice.html`, `privacy-policy.html`, `terms-and-conditions.html` | `page-hero` **sin imagen**, `container[820px]`, h2+p | Añadir breadcrumbs y fecha (el original no los tiene) |
| 404 | El espejo **sí** contiene un `404.html` (raíz del mirror, fuera de `site/`), pero es la página de error genérica del hosting: `<title>Page not found</title>`, `<style>` inline con tokens propios (`--colorRgbFacetsTeal600` etc.), sin `main.min.css`, sin header/footer ni tokens Globotent — no es una plantilla propia del sitio. No está listada en `sitemap.xml` (`grep -i 404 sitemap.xml` → 0). Es evidencia de que el hosting es Netlify (ver §16.6). | Propuesta: `page-hero` sin imagen centrado como `thank-you.html` + 3 botones (`btn--primary` inicio, `btn--ghost-light` contacto) | — |
| Contacto (`/contacto/`, si se separa de presupuesto) | `contact.html` | `contact-grid` 1fr 1fr (880px), `contact-actions`, formulario corto 1 col | — |

---

## 16. Dudas y límites de esta extracción

1. Los componentes marcados "latentes" (`product-info`, `gallery__thumbs`, `filter-bar`, `quiz`, `compare-*`, `calc-*`, `download-card`, `prose-block`, `padel-sizes`, `padel-promo`, `team-card`, `case-hero/stats`, `threed-viewer`, `model-viewer`, `avail-banner`, `mobile-sticky-cta`, `form-expand`, `form[data-netlify]`) **no tienen markup en el espejo EN**; su HTML aquí está reconstruido a partir de selectores CSS y `querySelector` del JS. Probablemente se usan en `globotent.de` (no descargado; `sw.js`, `manifest.webmanifest` tampoco).
2. Lógica de cálculo de las calculadoras, del quiz (`shelter-finder`) y del comparador: **no está en `main.js`**; si existe, va inline en páginas DE no espejadas.
3. `'Clash Display'`: declarada en 7 reglas, sin `@font-face` ni `<link>`; conclusión "cae a Figtree" es por ausencia de código, no verificada en navegador.
4. `.mobile-sticky-cta`: resuelto, ver §5.4 — `display:none` en base, `display:flex` en `@media (max-width:900px)` (línea 1590), con `main{padding-bottom:84px}` en el mismo bloque.
5. `.section` en ≤560px: `padding:48px 0` (línea 1626); `.section--tight{padding:32px 0}` (mismo bloque). `.product-card` en ≤560px: `border-radius:10px` (línea 1624, frente a 12px base) — ver también §4.2.
6. Netlify Forms: el patrón `form-name` + `bot-field` + `action='../pages/thank-you'` sugiere Netlify, pero **sin el atributo `data-netlify`/`netlify` el formulario no sería capturado por Netlify**; no se ha verificado si el hosting real reescribe esto. El `action` relativo `../pages/thank-you` desde `/pages/contact.html` resuelve a `/pages/thank-you` (sin `.html`; asume rewrites). El `404.html` genérico presente en el espejo (§15) y `Disallow: /netlify/` en `robots.txt` son evidencia adicional, a favor, de que el hosting es Netlify — no resuelven si los formularios llevan realmente `data-netlify` en producción.
7. Imágenes de hero en `background-image` inline: no se puede confirmar si hay `srcset`/`image-set` alternativo en producción (no en el código).
8. `home.html` solo se consultó para `.case-card`; la relación hero/home queda para su dimensión.
9. Idioma: `jobs.html`, `jobs/*`, `produkte.html`, `sport.html` y parte de `faq` mezclan alemán e inglés: los textos citados son literales del espejo.
