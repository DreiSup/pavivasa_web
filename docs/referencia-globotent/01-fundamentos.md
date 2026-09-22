# 01 · Fundamentos del sistema visual — globotent.com

Referencia extraída del código fuente real (no de capturas). Lectores: Claude Design (diseño nuevo para Pavivasa) y Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Cada valor cita su origen: `Lnnn` = línea de `main.pretty.css`; `main.js` = `assets/js/main.min.js?v=c0f0756b` legible; `home.html` = `site/index.html`.

Verificación del espejo: `main.css` (125 019 bytes) es byte a byte idéntico a `https://globotent.com/assets/css/main.min.css?v=cfc09a15` (comprobado con `cmp`). `main.pretty.css` es el mismo CSS formateado (1 428 llaves de apertura en ambos).

Convención del sitio: BEM (`bloque__elemento--modificador`), estados con `is-*` (`is-active`, `is-open`, `is-scrolled`, `is-visible`, `is-hidden`, `is-swap`, `is-sport`), ganchos JS con `data-*`. Un solo CSS y un solo JS para las 78 páginas.

---

## 1. Tokens: los bloques `:root`

### 1.1 Bloque 1 — `:root` L1–L29 (tokens globales)

| Token | Valor | Usos `var()` en CSS | Para qué se usa (selectores representativos) |
|---|---|---|---|
| `--brand-green` | `#1aa585` | 101 | Color de marca. Fondo de `.btn--primary` (L92), color de `.section__eyebrow` (L458), `a:hover` (L50), subrayado de `.site-nav a::after` (L142), borde hover de `.product-card:hover` (L599), `.product-card__price` (L619), chips/pills activos (`.chip.is-active`, `.filter-pill.is-active`, `.calc-viz__tab.is-active`), `accent-color` de checkbox y range (L1491, L1503), inicio de gradientes (`.feature__icon`, `.cta-band`), `.hero__dot.is-active`, `.cine-tab.is-active` (border-top). |
| `--brand-green-dark` | `#12755e` | 31 | Hover de `.btn--primary` (L96). Texto sobre tintes verdes: `.product-card__badge` (L1019), `.review__hall`, `.jobcard__tag`, `.case-hero__eyebrow`, `.job-meta__k`. Hover de enlaces de dropdown (`.site-nav__dropdown a:hover`), `.cat-chip:hover`, `.site-header__phone:hover`, `.world-block__link:hover`, `.glossary-entry h3`, `.case-quote figcaption`, `.padel-sizes td strong`. |
| `--brand-green-deep` | `#007a4a` | 7 | Extremo oscuro de gradientes: `.feature__icon` (L480), `.cta-band` (L741), `.calc-result` (L1513), `.how-step__num` (L3219). Color de texto de `.btn--ghost-light:hover` (L119), `.feature__more summary` (L508), `.consent-row a` (L1484). |
| `--brand-green-deep-hover` | `#0d614c` | 1 | Solo `.avail-banner strong` (L2801 selector / L2802 propiedad). (El literal `#0d614c` aparece además en gradientes de `.co2-calc__result` L2668 y `.quiz__result` L3106.) |
| `--brand-lime` | `#7ec700` | 22 | Acento secundario. Fondo `.btn--lime` (L108) y `.mobile-sticky-cta__call` (L1150); color de `.breadcrumbs span` (L266), `.collection-card__label span` (L577), `.site-footer a:hover` (L789), `.trust-item strong` (L3444), `.section--dark .calc-card__cta`, `.quiz__result-eyebrow`; final de gradientes 90deg (`.rating-dist__bar>div`, `.quiz__progress-bar`, `.splash__bar-fill`, `.jobcard::before`, `.site-nav__sports::after`, `.timeline::before` 180deg); `.jobs-hero__eyebrow` fondo; `.choose-card--sport` inset shadow; `.maint-banner` border-left; `.job-col--offer` marcas. |
| `--brand-lime-hover` | `#84d814` | 2 | `.btn--lime:hover` (L111), `.mobile-sticky-cta__call:hover` (L1155). |
| `--brand-dark` | `#061827` | 10 | Fondo oscuro: `.section--dark` (L276), `.site-footer` (L768), `.trust-bar` (L3434), `.bau-ampel`. Color de texto sobre lima: `.btn--lime` (L109), `.mobile-sticky-cta__call`, `.jobs-hero__eyebrow`. Texto de `.site-nav__sports`. |
| `--brand-navy` | `#0f1428` | **0** | Declarado, nunca consumido con `var()` en CSS (tampoco en `style=` de las 78 páginas ni en `main.js`). Token muerto. |
| `--color-title` | `#151719` | 86 | Color de `h1–h5` (L53), `.site-nav a` (L138), títulos de card (`.product-card__title`, `.case-card__title`…), `strong` de listas, labels de formulario (`.field label` L840), texto de chips/pills, botón `.btn--secondary` (color y borde). |
| `--color-text` | `#535353` | 28 | `body` (L38), párrafos de cards (`.case-card__teaser`, `.blog-card__body p`, `.jobs-value p`…), `.prose-block p`, `.faq-item p`. |
| `--color-sub-title` | `#535353` | 47 | Mismo valor que `--color-text`; rol semántico distinto: metadatos, captions, labels secundarios: `.product-card__meta` (L613), `.review__date`, `.case-card__meta`, `.team-card__region`, `.field__hint`, `.site-nav__mega-head`, `.press-strip__label`, `.filter-bar__label`, `.padel-sizes th`, `.calc-viz__hint`. |
| `--color-link` | `#222222` | 2 | `a` (L48) y `.site-nav__mega-tools a` (L4630). |
| `--color-border` | `#e2e2e2` | 75 | Borde estándar `1px solid` de cards (`.feature`, `.product-card`, `.testimonial`, `.review`, `.case-card`, `.blog-card`, `.team-card`, `.faq-item`, `.calc-card`…), inputs (`.field input` L849), separadores (`.product-info__features li`, `.review__meta`, `.case-card__footer`, `.world-block__head` 2px), `.site-nav__dropdown`, `.quiz__progress` fondo, chips (`.chip` 1.5px, `.cat-chip` 2px, `.color-chip` 2px). |
| `--color-bg` | `#ffffff` | 5 | `body` (L39), `.splash` (L3344), `.jobs-value`, `.jobcard`, `.job-other`. |
| `--color-bg-soft` | `#f6f8f7` | 32 | `.section--soft` (L274), placeholders de media (`.product-card__media`, `.gallery__main`, `.gallery__thumb`, `.case-card__media`, `.choose-card__media`, `.photo-gallery a`), cajas de datos (`.product-info__stats`, `.rating-summary`, `.case-stat`, `.case-hall-card`, `.kf-specs`, `.m-row`, `.m-check`, `.glossary-nav`, `.jobdetail-apply`, `.job-meta__item`, `.jobcard-meta__chip`), `.padel-sizes th`, `.press-strip`, `.exit-popup__close`, `.threed-viewer`, `.calc-viz__canvas`, `.product-card__badge--alt`, `.contact-action`. |
| `--button-corner` | `50px` | 1 | `.btn` border-radius (L79). Pill. |
| `--button-font-weight` | `800` | 1 | `.btn` (L81). |
| `--button-text-transform` | `uppercase` | 1 | `.btn` (L82). |
| `--button-large-height` | `56px` | 1 | `.btn--lg` height (L89). |
| `--button-medium-height` | `56px` | **0** | Declarado, nunca consumido. Token muerto. |
| `--button-normal-height` | `44px` | 2 | `.btn` height (L76) y `min-height` de `.section__head .btn--secondary` dentro de `@media (max-width:480px)` (L3816 apertura / L3817 selector / L3821 propiedad). **Ojo**: `.btn{min-height:var(--touch-target-min)}` (L3835 selector / L3836 propiedad) = 48px gana sobre `height:44px`, así que el botón normal renderiza 48px de alto (inferido por cascada, no medido en navegador). |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | 9 | `body` (L36), `.btn` (L80) y como fallback de las 7 declaraciones `'Clash Display',var(--font-family)`. |
| `--body-font-weight` | `400` | 1 | `body` (L37). |
| `--body-line-height` | `1.5` | 1 | `body` (L38). |
| `--container` | `1280px` | 1 | `.container` max-width (L68). |
| `--radius` | `12px` | 33 | Radio estándar de cards y cajas (ver §5.1). |
| `--shadow-card` | `0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)` | 10 | Sombra de **hover** de cards (`.feature:hover` L476, `.product-card:hover` L598, `.case-card:hover`, `.blog-card:hover`, `.video-testi:hover`, `.cat-chip:hover`, `.photo-gallery a:hover`) y estática en `.case-hero__media`, `.dach-map`, `.quiz`. |
| `--shadow-header` | `0 2px 16px rgba(6,24,39,.08)` | 2 | `.site-header.is-scrolled` (L127; la clase la pone `main.js` con `window.scrollY > 8`) y `.site-nav` desplegado en `≤900px` (L908). |

### 1.2 Bloque 2 — `:root` L3583–L3584 (añadido posterior, accesibilidad táctil)

| Token | Valor | Usos | Para qué |
|---|---|---|---|
| `--touch-target-min` | `48px` | 15 | Área táctil mínima: `.site-header__phone` (selector L3663, width/height L3665-3666 en `≤900px`), `.burger` (selector L3683, width/height L3684-3685), `.lang-switch__current` min-height (L3712), `.chip` min-height (L3715), `.color-chip` min-height, `.rating-badge` min-height (L3720), `.site-header a, .site-header button:not(.burger)` min-height (L3725), `.site-nav__main` min-height, `.exit-popup__close` width/height (L3732), **`.btn` min-height (L3835)**, `.mobile-sticky-cta__call` min-width/min-height (L3838). |

### 1.3 Tokens de ámbito `.sport-world` (L4233–L4238) — sub-tema "globotent SPORTS"

Se aplican en 14 páginas con `<body class="… sport-world">` (pádel, pickleball, pistas hípicas, `/pages/sport`) y en un `div.world-block--sport.sport-world` suelto (sin `body.sport-world` ni carga de Clash Display) en la home (home.html L254) y en `pages/produkte.html` (L161).

| Token | Valor | Usos `var()` | Nota |
|---|---|---|---|
| `--sport-lime` | `#e3fc03` | 33 | Lima ácido del sub-tema: fondos de eyebrows/botones/CTA, subrayado `inset 0 -.5em 0`. |
| `--sport-ink` | `#000` | 0 | Declarado; el CSS usa `#000` literal (114 apariciones). |
| `--sport-soft` | `#f4f4f2` | 2 | `.sp-section--specs` (L4356), `.sport-world .section--soft` (L4728). |
| `--sport-line` | `#000` | 0 | Declarado, sin uso. |
| `--sport-sub` | `#323232` | 0 | Declarado; el CSS usa `#323232` literal (12 apariciones). |

### 1.4 Fallbacks de `var()` inconsistentes (dato para no copiar el error)

- `.contact-action` (L3906–L3925): `var(--color-border,#e4e9eb)` y `var(--color-title,#061827)`: los fallbacks **no coinciden** con los tokens (`#e2e2e2`, `#151719`). Irrelevante en runtime (los tokens existen), pero delata que ese bloque se escribió aparte.
- `.site-footer__bottom a[href^="tel:"]` (L3893): `var(--brand-lime,#9eb3bd)`.
- `.lang-switch__*` (L1640–L1735) y `.hero__dot.is-active` (L4009): fallbacks correctos (`#e2e2e2`, `#151719`, `#1aa585`, `#12755e`).

---

## 2. Colores usados fuera de los tokens

Inventario por `grep` de todos los hex y `rgba()` de `main.pretty.css`. Los hex se normalizan a minúsculas; el recuento incluye la propia declaración del token cuando el hex coincide.

### 2.1 Hex literales

| Hex | Apariciones | Dónde aparece | Rol |
|---|---|---|---|
| `#fff` / `#ffffff` | 152 / 1 | Fondos de cards, texto sobre oscuro y sobre `--brand`, bordes de `.btn--ghost-light`, `.hero__dot:focus-visible` outline | Blanco |
| `#000` | 114 | Sub-tema Sports: bordes `1px solid #000`, texto, fondos de botones hover, `.padel-promo` bg, `.sp-video` bg; `.video-testi__media` bg; `mask-image` de `.press-strip__logos` | Negro (tinta Sports) |
| `#061827` | 9 | `.hero` bg (L192), `.page-hero` bg (L238), `.maint-banner` bg, `.home-montage` bg, radial de `.agro-feature`, selector `svg circle[fill="#061827"]` | = `--brand-dark` escrito a mano |
| `#0d2536` / `#04101b` | 1 / 2 | `.agro-feature` radial-gradient (L5848), `.agro-feature__video` bg | Navy más claro / más oscuro |
| `#0a0f0c` | 1 | `.cine-hero.is-sport .cine-hero__actions .btn--primary` color (L6062) | Tinta casi negra sobre lima |
| `#151719` | 3 | Token + 2 fallbacks en `.lang-switch` | — |
| `#1a1a1a` | 1 | `.sport-world .padel-sizes td` color | Texto tabla Sports |
| `#222222` | 1 | Token `--color-link` | — |
| `#323232` | 12 | `.sp-hero__sub`, `.sp-section`, `.sp-head p`, `.sp-disc__body p`, `.sp-spec__lbl`, `.sport-world .product-card__meta`, `.sport-world .section p/li`, `.sport-world .filter-bar__count`, `.sport-world .avail-banner em` | Gris de cuerpo Sports (= `--sport-sub`) |
| `#535353` | 2 | Tokens | — |
| `#888` | 1 | `.form-field__helper` (L3799); también inline en `main.js` (mensaje de error 3D) | Gris helper |
| `#5a6b73` | 1 | `.contact-action__label` | Gris medio |
| `#6a8292` | 1 | `.trust-item em` | Gris sobre navy |
| `#7d909a` | 1 | `.site-footer__disclaimer` | Gris footer |
| `#9eb3bd` | 4 | `.site-footer` color y `a` (L769, L787), `.trust-item span`, fallback tel/mailto | Gris azulado sobre navy |
| `#b3c5cd` | 1 | `.site-footer__disclaimer strong` | — |
| `#c7d3db` | 1 | `.section--dark .calc-card p` | — |
| `#cfd8dc` | 4 | `.breadcrumbs` y `a` (L260, L263), `.blog-meta`, inicio gradiente `.threed-viewer__canvas` | Gris claro sobre hero oscuro |
| `#cfe0dc` | 2 | `.jobs-hero__count`, `.jobdetail-hero__gender` | — |
| `#dfe7ea` | 5 | `.hero__sub` (L223), `.section--dark` color, `.trust-bar` color, `.jobs-hero p`, `.jobdetail-back` | Texto secundario sobre navy |
| `#d8d8d8` | 1 | `.sport-world .padel-sizes td` border | — |
| `#e2e2e2` | 4 | Token + `.rating-dist__bar` bg + 2 fallbacks | — |
| `#e4e9eb` | 1 | Fallback erróneo en `.contact-action` | — |
| `#e2e8d6` | 1 | Fin gradiente `.threed-viewer__canvas` (y `0xe2e8d6` suelo THREE en `main.js`) | Verde-gris suelo 3D |
| `#eef1f3` | 1 | `.team-wall__item` bg | Placeholder |
| `#f4f4f2` | 1 | `--sport-soft` | — |
| `#f6f8f7` | 4 | Token + inicio de gradientes `.case-quote` (L2337) y `.three-d-cta` (L3283) | — |
| `#eaf3f0` | 2 | Fin de esos dos gradientes | Verde muy pálido |
| `#eaf6f1` | 2 | `.section--brand .calc-card p`, `.contact-action:hover` bg | Verde pálido |
| `#fafafa` | 1 | `.filter-bar` bg (L4664) | Gris casi blanco |
| `#cdd8d3` | 1 | `.choose-card:hover` border-color | Borde hover verdoso |
| `#1aa585` | 8 | Token, `.section--brand` gradiente (L281), `.hero__eyebrow--sports` gradiente, `.quiz__result`, `.co2-calc__result`, 2 fallbacks; en `main.js` color por defecto de la nave 3D | — |
| `#138d70` | 1 | Fin de `.section--brand` gradiente (L281) | Verde marca oscurecido |
| `#0f7d63` | 1 | Fin de `.hero__eyebrow--sports` gradiente (L3959) | — |
| `#0d614c` | 3 | Token + gradientes `.co2-calc__result`, `.quiz__result` | — |
| `#0d4f3f` | 1 | `.section--brand .calc-card svg circle[fill="#061827"]` fill (L310) | Sustituto de navy sobre brand |
| `#007a4a` / `#12755e` / `#84d814` | 1 / 3 / 1 | Tokens (+ fallbacks) | — |
| `#7ec700` | 6 | Token, `.bau-light[data-light="green"]`, `.dach-map__pin--anon` ×2, `.avail-banner__dot`, `.hero__h1--sports em` | — |
| `#9be000` | 1 | `.hero__slide--sports .hero__sub strong` | Lima claro |
| `#cdf07a` | 1 | `.world-panel--sport .world-panel__eyebrow` | Lima pastel |
| `#bfeede` | 1 | `.world-panel__eyebrow` | Verde menta pastel |
| `#2d9a00` / `#b88600` / `#c92026` | 1 / 1 / 2 | `.bau-verdict h2[data-state="green|yellow|red"]`; `#c92026` también `.m-row__remove` color | Semáforo |
| `#2d4a00` / `#6f7a55` | 1 / 1 | `.avail-banner` color / `em` | Verde oliva texto |
| `#25d366` / `#1ebe5c` | 1 / 1 | `.wa-fab` bg / hover (L1747, L1758) | Verde WhatsApp |
| `#e3fc03` | 15 | `--sport-lime` y literales: `.page-hero--padel h1 em`, `.padel-badge`, `.world-block--sport .world-block__head::after`, `.world-block--sport .world-block__link:hover`, `.sport-world .padel-promo__eyebrow`, `.lead-tile--sport` (shadow, dot, arrow), `.cine-hero.is-sport` (kicker, `.btn--primary`, `.cine-tab.is-active`) | Lima ácido Sports |
| `#eaff3a` | 2 | `.cine-hero.is-sport .btn--primary:hover` bg/border (L6066) | Lima hover |
| `#f4c95e` | 3 | `.calc-disclaimer` border-left, `.bau-light[data-light="yellow"]`, `.bau-info-box` border-left; en HTML es el `fill` de las estrellas SVG del rating | Ámbar (estrellas/aviso) |
| `#ff5254` / `#ff3b3b` | 2 / 1 | `.m-row__remove:hover` bg, `.bau-light[data-light="red"]` / `.agro-feature__badge::before` (punto "live") | Rojo |
| `#a52729` / `#2e60ac` | 1 / 1 | `.case-block__label--red` / `--blue` | Etiquetas de caso |
| Banderas | — | `.flag--de` `#000/#dd0000/#ffce00`; `.flag--at` `#ed2939`; `.flag--es` `#aa151b/#f1bf00`; `.flag--pt` `#046a38/#da020e`; `.flag--gb` SVG data-URI con `%23012169`, `%23C8102E` | Selector de idioma |

### 2.2 Familias `rgba()`

| Familia | Alphas usados | Rol |
|---|---|---|
| `rgba(6,24,39,α)` (navy `--brand-dark`) | `0 .04 .05 .06 .08 .1/.10 .12 .13 .14 .15 .18 .2 .22 .32 .34 .35 .42 .45 .55 .6 .72 .75 .78 .8 .84 .85 .88 .92` | **La familia principal**: scrims sobre imagen (`.hero__bg::after` .78/.55/.35; `.page-hero__bg::after` .45→.8; `.collection-card::after` 0→.85; `.photo-gallery__caption` 0→.78; `.lead-slide::after` 0→.84; `.home-montage__overlay` .88/.55/.35; `.world-panel--industrie::after` .05/.42/.88; `.lightbox` .92; `.exit-popup__backdrop` .72), sombras (`.06` card, `.08` header, `.12` dropdown/sticky, `.13` choose-card/jobcard, `.14` calc-card hover, `.15` three-d-cta, `.18` nav móvil, `.22` badge hero, `.32` maint-banner), bordes sutiles (`.06` team-wall inset, `.08` kf-spec-row, `.12` before-after handle, `.15/.2` color dots), pills oscuras (`.75` before-after label/notice y `.gallery__main::after`, `.85` preview hint). |
| `rgba(26,165,133,α)` (verde marca) | `0 .04 .05 .06 .07 .08 .1/.10 .12 .13 .15 .16 .25 .4 .92` | Tintes verdes: `.04` hover fila tabla, `.05` opción quiz seleccionada, `.06` hover de `.site-header__phone`/`.lang-switch__current`/`.form-expand-btn`, `.07` `.jobdetail-salary` bg, `.08` hover dropdown/mega-item/`.case-hall-card`/dropzone, `.10` badges (`.product-card__badge`, `.review__hall`, `.jobcard__tag`, `.site-header__phone` móvil), `.12` `.calc-card__icon`/`.case-hero__eyebrow`/`.lang-switch__menu a[aria-current]`, `.15` **focus ring** de inputs y `.color-chip.is-active` (`0 0 0 3px`), `.16` radial `.agro-feature::before`, `.25` borde salary, `.4` anillo hover vídeo agro, `.92` botones play, `.1/.13` sombras verdes (`.quiz__options button:hover`, `.job-other:hover`); `-webkit-tap-highlight-color` `.15`. |
| `rgba(126,199,0,α)` (lima) | `0 .09 .14 .15 .22 .55 .6 .8 .9` | `.09` gradiente `.site-nav__mega-col--sport`, `.14` `.section--dark .calc-card__icon` y hover mega Sports, `.15` `.avail-banner`, `.22` scrim `.hero__bg--sports`, `.55/.9` inset de `.world-panel--sport`, `.6→0` keyframe `pulse`, `.8` glow semáforo. |
| `rgba(255,255,255,α)` | `0 .06 .08 .1 .12 .14 .18 .2 .25 .32 .6 .7 .72 .74 .8 .82 .85 .86 .88 .9 .92 .94 .97` | Glass sobre oscuro/brand (`.06/.08/.12/.14/.18` cards en `.section--dark`/`--brand`), `.1` separador footer, `.2` hover nav lightbox, `.32/.6` `.hero__dot`, `.72/.74` texto cine-hero, `.8–.92` texto sobre oscuro, `.92/.94` fondo `.rating-badge`, `.97/.86/.25/0` scrim blanco `.sp-hero__bg::after`. |
| `rgba(0,0,0,α)` | `.08 .25 .28 .3 .35 .42 .45 .5 .55 .7 .72 .78` | Sombras neutras (`.08` photo-gallery/lang menu/flag, `.25` handle, `.28` lockup/badge, `.3` play/exit-popup, `.35` pin, `.5` lightbox img/counter, `.7/.78` vídeo agro), `.42` `.lead-arrow` bg, `.45` drop-shadow logo, `.55` text-shadow `.cine-hero__h1`, `.72` `.video-testi__duration`. |
| `rgba(8,16,24,α)` | `0 .08 .34 .66 .74 .94` | Scrim de `.cine-hero__scrim` (L6010–L6013), dos capas. |
| `rgba(3,10,6,α)` `rgba(3,12,8)` `rgba(2,8,5)` `rgba(2,10,6)` `rgba(5,10,7)` `rgba(8,38,22)` `rgba(4,16,27)` | varios | Scrims verdosos/negros del mundo Sports (`.world-panel--sport::after`, `.lead-tile--sport .lead-slide::after`, `.sp-video__overlay`, `.hero__bg--sports::after`, `.agro-feature__badge`). |
| `rgba(15,30,45,α)` | `.25 .45 .55` | `.page-hero--padel::after` (L3594). |
| `rgba(244,201,94,α)` | `.12 .8` | Fondo aviso ámbar (`.calc-disclaimer`, `.bau-info-box`), glow semáforo. |
| `rgba(255,82,84,α)` `rgba(255,59,59,.25)` | `.15 .8 / .25` | Etiqueta roja, glow rojo, halo punto live. |
| `rgba(66,127,224,.15)` | — | `.case-block__label--blue` bg. |
| `rgba(37,211,102,α)` | `.35 .45` | Sombra `.wa-fab` y hover. |
| `rgba(227,252,3,.22)` | — | Hover fila tabla Sports. |

---

## 3. Tipografía

### 3.1 Carga de fuentes

**Figtree** (Google Fonts) en las 78 páginas, patrón idéntico en cada `<head>` (home.html L19–L23):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"></noscript>
```

Google sirve una **fuente variable** (`font-weight: 300 900`, `font-display: swap`, dos `unicode-range` latin/latin-ext; comprobado con `curl`). El truco `media="print" onload` hace la carga no bloqueante.

**'Clash Display'**: `main.css` **no tiene ningún `@font-face`** (0 apariciones). Las 7 declaraciones `font-family:'Clash Display',var(--font-family)` (L4163, L4216, L4240, L4318, L4395, L4428, L4464) dependen de un `<link>` externo que **solo existe en las 14 páginas `body.sport-world`** (exactamente el mismo conjunto):

```html
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap" rel="stylesheet">
```

Fontshare sirve tres `@font-face` (comprobado con `curl` a la URL de arriba: **solo pesos 500, 600, 700**, `swap`, sin 800). Consecuencia: en esas 14 páginas Clash Display sí se carga; en las otras 64 (incluida la **home**, cuyo `div.world-block--sport` usa `.world-block--sport .world-block__head h3{font-family:'Clash Display',…}` L4216) **cae al fallback Figtree**. **Matiz**: de las 7 declaraciones, 6 fijan `font-weight:600` en la misma regla (L4163, L4216, L4318, L4395, L4428, L4464); la 7ª, `.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1{font-family:'Clash Display',var(--font-family)}` (L4239-4240), **no fija `font-weight`** y hereda `800` de la regla base `h1,h2,h3,h4,h5{font-weight:800}` (L52-56) — coherente con la tabla §3.3 ("H1 padel" documenta 800, no 600). Como Fontshare no sirve el peso 800, ese caso fuerza síntesis de negrita en el navegador (nota: `grep -rl 'padel-h1' site/` no devuelve ningún archivo — `.padel-h1` no se usa en las 78 páginas del espejo, así que hoy es un caso teórico).

**Georgia, serif** en dos sitios decorativos: `.feature__more summary::before` (la "i" itálica del tooltip, L523) y `.press-item` (logos de prensa como texto itálico, L3490).

Fuentes de sistema: `font:inherit` en `.cine-tab` (L6099) y `font-family:inherit` en inputs (L849), `.feature__more[open] summary::before`, `::-webkit-file-upload-button`.

### 3.2 Base (`body`, encabezados, párrafos)

```css
body{margin:0;font-family:var(--font-family);font-weight:var(--body-font-weight);line-height:var(--body-line-height);color:var(--color-text);background:var(--color-bg);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}   /* L34–L42 */
h1,h2,h3,h4,h5{color:var(--color-title);font-weight:800;line-height:1.15;margin:0 0 .5em}   /* L52–L56 */
h1{font-size:clamp(2rem,4.2vw,3.6rem);letter-spacing:-.01em}     /* L57–L59 */
h2{font-size:clamp(1.6rem,2.8vw,2.4rem);letter-spacing:-.01em}   /* L60–L62 */
h3{font-size:1.25rem}                                             /* L63–L64 */
p{margin:0 0 1em}                                                 /* L65–L66 */
h1{font-variation-settings:"wght" 800}                            /* L3511–L3512 */
small,.disclaimer,.helper-text,.fine-print,.form-field__helper{font-size:12px;line-height:1.4}   /* L3785–L3787 */
input,select,textarea{font-size:16px}                             /* L3816 (anti-zoom iOS) */
```

- `h4`/`h5`: sin `font-size` propio (tamaño de navegador); `.site-footer h4` = `.95rem` uppercase `.08em`.
- `h6`: no está en el código.
- El `h1` añade `font-variation-settings:"wght" 800` (redundante con `font-weight:800`, pensado para el eje variable). `.hero h1` anima `wghtFlex` 6s ease-in-out infinite alternate entre `"wght" 700 / letter-spacing -.02em` y `"wght" 900 / letter-spacing 0` (L3513–L3522). En el espejo actual ninguna página usa `class="hero"` (la home usa `.cine-hero`), así que esa animación es CSS muerto hoy.

### 3.3 Jerarquía efectiva por contexto

| Rol | Selector | font-size | weight | line-height | letter-spacing | Otros |
|---|---|---|---|---|---|---|
| H1 genérico | `h1` | `clamp(2rem,4.2vw,3.6rem)` | 800 | 1.15 | -.01em | `.page-hero h1{color:#fff;margin:0}` (L257) |
| H1 hero home | `.cine-hero__h1` (L6049) | `clamp(2.1rem,5.1vw,4rem)`; `≤760`: `clamp(1.95rem,8.4vw,2.7rem)` | 800 | 1.03 | -.02em | `max-width:17ch`, `text-shadow:0 2px 34px rgba(0,0,0,.55)`, `margin:0 0 18px` |
| Sub hero home | `.cine-hero__sub` (L6058) | `clamp(1.02rem,1.45vw,1.2rem)`; `≤760`: 1rem | 400 | 1.5 | — | `color:rgba(255,255,255,.92)`, `max-width:56ch`, `text-shadow:0 1px 18px rgba(0,0,0,.35)` |
| H1 hero clásico (`.hero`, sin uso) | `.hero h1` | hereda `h1`; `≤900`: `clamp(1.8rem,7vw,2.6rem)` | 800→anim | 1.15 | anim | `max-width:800px`, color #fff |
| Sub hero clásico | `.hero__sub` (L222) | 1.15rem; `≤900`: 1rem | 400 | 1.5 | — | `color:#dfe7ea`, `max-width:620px`, `mb 36px` |
| H1 producto | `.product-info h1` (L662) | `clamp(1.8rem,2.6vw,2.4rem)` | 800 | 1.15 | -.01em | `mb 16px`; Sports: uppercase |
| H1 caso | `.case-hero h1` | `clamp(1.8rem,3.5vw,2.8rem)` | 800 | 1.15 | -.01em | |
| H1 padel | `.padel-h1` (L318) | `clamp(2.6rem,5.4vw,4.6rem)` | 800 | 1.02 | -0.01em | uppercase, `.padel-h1__sub` `clamp(1.4rem,2.4vw,2rem)` 400 |
| H1 Sports | `.sp-hero__h1` (L4287) | `clamp(2.6rem,7vw,5.4rem)` | 600 (Clash) | .98 | -.01em | uppercase; `em` con fondo lima `box-decoration-break:clone` |
| H2 sección | `h2` | `clamp(1.6rem,2.8vw,2.4rem)` | 800 | 1.15 | -.01em | centrado dentro de `.section__head` |
| H2 Sports | `.sp-head h2` (L4349) | `clamp(1.8rem,3.6vw,2.8rem)` | 600 | 1.05 | — | uppercase |
| H2 CTA band | `.cta-band h2` | hereda h2; `≤560`: 1.4rem | 800 | | | color #fff, `mb 12px` |
| H2 montage | `.home-montage__inner h2` (L5410) | `clamp(1.8rem,3.5vw,2.8rem)` | 800 | 1.08 | -.01em | |
| H2 panel mundo | `.world-panel__inner h2` | `clamp(1.5rem,2.7vw,2.15rem)` | 800 | 1.08 | -.01em | split: `clamp(2.1rem,3.7vw,3.5rem)` lh 1.02 |
| H2 quiz/exit | `.quiz__step h2` 1.4rem; `.exit-popup h2` 1.5rem | | 800 | | | |
| H3 base | `h3` | 1.25rem | 800 | 1.15 | — | |
| H3 card colección | `.collection-card__label h3` (L574) | 1.6rem | 800 | | | color #fff |
| H3 bloque mundo | `.world-block__head h3` | 1.5rem | 800 | | -.01em | Sports: Clash 600 uppercase |
| H3 disciplina Sports | `.sp-disc__body h3` | 1.5rem | 600 | | | uppercase |
| Título card producto | `.product-card__title` (L607) | 1.05rem | 700 | | | `min-height:2.6em` (2 líneas reservadas) |
| Título card caso/blog | `.case-card__title`, `.blog-card__body h3` | 1.15rem | 800 | | | |
| Título jobcard | `.jobcard__title` | 1.22rem | 800 | 1.3 | | |
| Título feature/team/how-step | `.feature h3` (hereda 1.25rem), `.team-card h3` 1.05rem, `.how-step h3` 1.05rem | | 800 | | | |
| Precio | `.product-card__price` 1.15rem 800 verde; `.product-info__price` 1.8rem 800 verde | | | | | |
| Cifras grandes | `.rating-summary__number` 3.8rem; `.co2-calc__value` 2.8rem; `.calc-result__value` 2.4rem (1.9rem ≤560); `.sp-spec__num` 2.6rem (Clash 600); `.trust-item strong` 1.3rem | | 800 | 1 | | |
| Párrafo base | `p` en `body` | 1rem | 400 | 1.5 | | `mb 1em` |
| Párrafo prosa | `.prose` 1.05rem; `.prose-block p` 1rem lh 1.7; `.jobdetail__intro p` 1.04rem lh 1.65; `.case-block p` lh 1.6 | | | | | |
| Párrafo de card | `.feature p` .95rem; `.case-card__teaser` .92rem lh 1.5; `.blog-card__body p` .92rem; `.how-step p` .92rem; `.team-card p` .88rem lh 1.5; `.review__text` .95rem lh 1.55 | | 400 | | | |
| Intro / lead | `.hero__sub` 1.15rem; `.world-hero__intro p` 1.12rem; `.lead-hero__text p` 1.12rem; `.choose-hero__sub` 1.1rem; `.case-hero__teaser` 1.1rem; `.sp-hero__sub` 1.2rem; `.sp-head p` 1.08rem | | 400 | 1.5 | | |
| Meta / caption | `.product-card__meta` .85rem; `.breadcrumbs` .85rem; `.review__date` .8rem 600; `.case-card__meta` .78rem 700 `.03em`; `.blog-card__meta` .78rem 700; `.team-card__region` .82rem | | | | | color `--color-sub-title` |
| Small legal | `small`, `.site-footer__disclaimer` .78rem lh 1.55; `.form-trust` .82rem; `.calc-disclaimer` .8rem lh 1.4 | 12px | | 1.4 | | |
| Nav | `.site-nav a` .95rem 700; dropdown `a` .9rem 600; mega `strong` .9rem 700 / `small` .75rem 500; `.site-nav__mega-head` .68rem 800 `.1em` uppercase; `.site-nav__dd-head` .7rem 800 `.1em` | | | | | |
| Formularios | `.field label` .9rem 700; `.field__hint` .78rem 400; inputs 16px; `.form-field__helper` 12px `#888` | | | | | |

### 3.4 Inventario completo de `font-size`

Escala en `rem` (apariciones): `.62em`(1) `.65rem`(1) `.66rem`(1) `.68rem`(2) `.7rem`(5) `.7em`(1) `.72rem`(11) `.74rem`(4) `.75rem`(5) `.76rem`(3) `.78rem`(24) `.8rem`(14) `.82rem`(18) `.84rem`(2) `.85rem`(26) `.86rem`(1) `.88rem`(6) `.9rem`(16) `.92rem`(9) `.94rem`(1) `.95rem`(18) `.96rem`(1) `.98rem`(4) `1rem`(12) `1.02rem`(2) `1.04rem`(1) `1.05rem`(12) `1.06rem`(2) `1.08rem`(2) `1.1rem`(9) `1.12rem`(3) `1.15rem`(4) `1.18rem`(1) `1.2rem`(7) `1.22rem`(1) `1.25rem`(3) `1.3rem`(7) `1.4rem`(4) `1.5rem`(4) `1.6rem`(8) `1.7rem`(1) `1.8rem`(1) `1.9rem`(2) `2rem`(1) `2.4rem`(1) `2.6rem`(2) `2.8rem`(1) `3rem`(1) `3.8rem`(1). En px: `12px`(4) `13px`(1) `14px`(2) `16px`(6) `26px`(1) `32px`(1) `42px`(1) — los px grandes son iconos de texto del lightbox (`×`, `‹›`). `font-size:0` en `.wa-fab` ≤560 (oculta texto).

Los **cinco tamaños más usados** (`.85rem`, `.78rem`, `.95rem`, `.82rem`, `.9rem`) son todos sub-1rem: el sitio es denso, con mucho texto de apoyo entre 12.5 y 15 px.

Todos los `clamp()`:

| Selector | clamp | Contexto |
|---|---|---|
| `h1` | `clamp(2rem,4.2vw,3.6rem)` | base |
| `h2` | `clamp(1.6rem,2.8vw,2.4rem)` | base |
| `.hero h1` ≤900 | `clamp(1.8rem,7vw,2.6rem)` | hero clásico móvil |
| `.padel-h1` | `clamp(2.6rem,5.4vw,4.6rem)` | |
| `.padel-h1__sub` | `clamp(1.4rem,2.4vw,2rem)` | |
| `.product-info h1` | `clamp(1.8rem,2.6vw,2.4rem)` | |
| `.case-hero h1` | `clamp(1.8rem,3.5vw,2.8rem)` | |
| `.three-d-cta__text h2` | `clamp(1.6rem,3vw,2.2rem)` | |
| `.world-hero__intro h1` | `clamp(2rem,4.6vw,3.3rem)` | lh 1.06, ls -.02em |
| `.world-panel__inner h2` | `clamp(1.5rem,2.7vw,2.15rem)` | |
| `.world-hero--split .world-panel__inner h2` | `clamp(2.1rem,3.7vw,3.5rem)`; ≤820 `clamp(1.8rem,7vw,2.3rem)` | |
| `.sp-hero__h1` | `clamp(2.6rem,7vw,5.4rem)` | |
| `.sp-claim p` | `clamp(1.05rem,2.4vw,1.7rem)` | |
| `.sp-head h2` | `clamp(1.8rem,3.6vw,2.8rem)` | |
| `.sp-cta h2`, `.sp-video__inner h2` | `clamp(1.8rem,4vw,3rem)` | |
| `.choose-hero__title` | `clamp(1.9rem,3.6vw,2.9rem)` | |
| `.choose-card__body h2` | `clamp(1.35rem,2vw,1.75rem)` | |
| `.lead-hero__text h1` | `clamp(2rem,4vw,3.4rem)` | ≤600: 1.7rem |
| `.lead-slide__label` | `clamp(1.05rem,1.5vw,1.35rem)` | |
| `.home-montage__inner h2` | `clamp(1.8rem,3.5vw,2.8rem)` | |
| `.agro-feature__intro h2` | `clamp(1.7rem,3.2vw,2.5rem)` | |
| `.cine-hero__h1` | `clamp(2.1rem,5.1vw,4rem)`; ≤760 `clamp(1.95rem,8.4vw,2.7rem)` | **home** |
| `.cine-hero__sub` | `clamp(1.02rem,1.45vw,1.2rem)` | home |
| `.cine-tab__name` | `clamp(.9rem,1.25vw,1.06rem)` | home |

### 3.5 `font-weight`, `letter-spacing`, `line-height`, `text-transform`

- **font-weight** (apariciones): `800`(70) `700`(46) `600`(36) `500`(5) `400`(4) `300`(1: `.hero__h1--sports em`). El sitio vive en **800 para títulos/eyebrows/botones/precios, 700 para nav/labels/títulos de card pequeños, 600 para metadatos con énfasis, 400 para cuerpo**. Clash Display a 600 en 6 de sus 7 reglas; la 7ª (`.sport-world h1,h2,h3,.padel-h1`, L4239) no fija peso propio y hereda 800 (ver §3.1).
- **letter-spacing**: `.12em`(13, eyebrows) `.05em`(11) `-.01em`(11, títulos) `.06em`(8) `.08em`(7) `.04em`(7, botones) `-.02em`(5, títulos hero) `.01em`(5) `.1em`(4) `.02em`(4) `.03em`(3) `.14em`(2) `.18em`(1) `0`(1). Regla: **caps pequeñas = tracking positivo entre .04em y .14em; títulos = tracking negativo -.01/-.02em**.
- **line-height**: `1.5`(14) `1.55`(10) `1`(10, cifras) `1.4`(7) `1.3`(4) `1.6`(3) `1.35`(3) `1.15`(3, títulos base) `1.1`(3) `1.08`(3) `1.7`(2) `1.25`(2) `1.2`(2) `1.06`(2) `1.05`(2) `1.02`(2) `.98`(1) `1.03`(1) `1.12`(1) `1.65`(1) `1.8`(1) `.7`(1). Títulos hero entre `.98` y `1.08`; cuerpo `1.5`–`1.55`; prosa larga `1.6`–`1.7`.
- **text-transform**: `uppercase` ×65 (+ `var(--button-text-transform)`). No hay `capitalize` ni `lowercase`.

### 3.6 Patrón "eyebrow" (kicker sobre el título)

Patrón canónico (usado 18 veces en el espejo completo de 78 páginas, 11 de ellas en la home, como `<div class="section__eyebrow">` dentro de `.section__head`):

```css
.section__eyebrow{color:var(--brand-green);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:.8rem;margin-bottom:8px}   /* L457–L463 */
```

Sobre `.section--brand` la home lo sobreescribe inline: `style="color:#fff;opacity:.85"` (home.html L396). Variante Sports: `.sport-world .section__eyebrow{display:inline-block;color:#000;background:var(--sport-lime);padding:6px 13px;border-radius:50px}` (L4735).

Todas las variantes del patrón:

| Selector (línea) | color | fondo | size | weight | tracking | padding / radio | margin-bottom | Uso en espejo |
|---|---|---|---|---|---|---|---|---|
| `.section__eyebrow` (L457) | `--brand-green` | — | .8rem | 800 | .12em | — | 8px | 18 |
| `.hero__eyebrow` (L211) | #fff | `--brand-green` | .78rem | 800 | .12em | 6px 14px / 999px | 20px | 0 |
| `.hero__eyebrow--sports` (L3958) | #fff | `linear-gradient(90deg,#1aa585,#0f7d63)` | | | | | | 0 |
| `.product-card__eyebrow` (L1027) | `--brand-green` | — | .72rem | 800 | .12em | — | 8px | (product-card) |
| `.product-info__eyebrow` (L4866) | `--brand-green` | — | .8rem | 800 | .12em | — | 8px | (product pages) |
| `.case-hero__eyebrow` (L2153) | `--brand-green-dark` | `rgba(26,165,133,.12)` | .8rem | 800 | .06em | 6px 14px / 999px | 14px | 0 |
| `.world-hero__eyebrow` (L4067) | `--brand-green` | — | .8rem | 800 | .12em | — | 14px | 0 |
| `.world-panel__eyebrow` (L4134) | `#bfeede` (sport `#cdf07a`) | — | .76rem | 800 | .12em | — | 10px | 0 |
| `.world-hero--split .world-panel__eyebrow` | | | .8rem | | .18em | | 16px | 0 |
| `.choose-hero__eyebrow` (L5032) | `--brand-green` | — | .8rem | 800 | .12em | — | 14px | 0 |
| `.choose-card__eyebrow` (L5089) | `--color-sub-title` | — | .72rem | 800 | .12em | — | 10px | 0 |
| `.lead-hero__eyebrow` (L5134) | `--brand-green` | — | .8rem (≤600 .72rem lh 1.4) | 800 | .12em | — | 14px | 0 |
| `.jobs-hero__eyebrow` (L5467) | `--brand-dark` | `--brand-lime` | .74rem | 800 | .08em | 6px 14px / 50px | 14px | 4 |
| `.agro-feature__eyebrow` (L5864) | `--brand-green` | — | .74rem | 800 | .14em | — | 18px | 0 |
| `.cine-hero__eyebrow` (L6021) | — (flex, gap 16px) | — | .78rem | 800 | .14em | — | 18px | 1 (home) |
| `.cine-hero__kicker` | `--brand-green` (`.is-sport`: `#e3fc03`) | — | | | | `::before` raya 28×2px `currentColor` | | |
| `.cine-hero__meta` | `rgba(255,255,255,.72)` | — | | 700 | .1em | | | |
| `.sp-head__eyebrow` (L4338) | #000 | `--sport-lime` | .74rem | 800 | .12em | 6px 13px / 50px | 16px | 4 |
| `.sport-world .section__eyebrow` (L4735) | #000 | `--sport-lime` | .8rem | 800 | .12em | 6px 13px / 50px | 8px | |
| `.sport-world .product-info__eyebrow` (L4873) | #000 | `--sport-lime` | .8rem | 800 | .12em | 6px 13px / 50px | 8px | |
| `.padel-badge` (L328) | #000 | `#e3fc03` + `border:1px solid #000` | .78rem | 800 | .1em | 7px 15px / 50px | — | 0 |
| `.quiz__result-eyebrow` (L3120) | `--brand-lime` | — | .75rem | 800 | .08em | — | 6px | |
| `.sport-world .padel-promo__eyebrow` | `#e3fc03` | — | .85rem | 800 | .12em | — | 6px | |
| `.padel-h1` precedido por `.padel-badge`; `.sp-claim p` | | | | | | | | |

Labels-caps emparentados (mismo ADN, no son eyebrows):

| Selector | size | weight | tracking | color |
|---|---|---|---|---|
| `.site-nav__mega-head` | .68rem | 800 | .1em | `--color-sub-title` (Sports col: `--brand-green`) |
| `.site-nav__dd-head` | .7rem | 800 | .1em | `--brand-green` |
| `.press-strip__label`, `.filter-bar__label` | .78rem | 800 | .08em | `--color-sub-title` |
| `.product-info__stat span` | .75rem | 700 | .06em | `--color-sub-title` |
| `.case-stat span`, `.case-hall-card span` | .78rem / .72rem | 700 | .05em | `--color-sub-title` |
| `.job-meta__k`, `.jobdetail-salary__label` | .7rem / .72rem | 800 | .05em | `--brand-green-dark` |
| `.quiz__step-count` | .82rem | 700 | .06em | `--color-sub-title` |
| `.padel-sizes th` | .82rem | 700 | .08em | `--color-sub-title` sobre `--color-bg-soft` |
| `.site-footer h4` | .95rem | 800 (hereda) | .08em | #fff |
| `.m-row__dims label` | .72rem | 700 | — | `--color-sub-title` |

CTAs de texto en mayúsculas (enlace "Ver más →" dentro de cards):

| Selector | size | weight | tracking | color |
|---|---|---|---|---|
| `.calc-card__cta` | .82rem | 800 | .04em | `--brand-green` (dark: `--brand-lime`) |
| `.case-card__cta` | .76rem | 800 | .04em | `--brand-green` |
| `.blog-card__cta` | .78rem | 800 | .05em | `--brand-green` |
| `.choose-card__cta` | .85rem | 800 | .05em | `--brand-green` → hover `--brand-green-dark` |
| `.world-block__link` | .8rem | 800 | .06em | `--brand-green` |
| `.site-nav__mega .mega-link` | .78rem | 800 | .05em | `--brand-green` |
| `.jobcard__link` | .9rem | 800 | .03em | `--brand-green-dark`; `span` → `translateX(4px)` en hover de la card |
| `.sp-disc__cta` | .82rem | 800 | .05em | #000; hover `inset 0 -.5em 0 var(--sport-lime)` |
| `.team-card__role`, `.case-hero__role` | .82rem / .85rem | 800 | .05em / .06em | `--brand-green` |
| `.cine-tab__name` | `clamp(.9rem,1.25vw,1.06rem)` | 800 | .01em | rgba(255,255,255,.74) → #fff |

---

## 4. Espaciado

### 4.1 Contenedor y anchos

```css
.container{max-width:var(--container);margin:0 auto;padding:0 24px}   /* L67–L70: 1280px, gutter 24px */
.section,.container{max-width:100%}                                     /* L3823–L3824 */
```

Anchos de lectura secundarios: `.section__head` 720px (L455), `.prose` 780px, `.contact-grid` 880px, `.jobdetail` / `.threed-viewer` 980px, `.choose-cards` 1080px, `.world-hero__split` 1480px, `.home-montage__inner` 688px, `.form-grid` 720px / `form.form-narrow` 460px, `.case-quote` 840px, `.exit-popup__box` 520px. Anchos de texto por `ch`: `.cine-hero__h1` 17ch, `.cine-hero__sub` 56ch, `.jobs-hero h1` 14ch, `.agro-feature__intro p` 52ch, `.jobdetail-apply p` 52ch, `.jobdetail-salary__note` 64ch.

Gutter lateral: 24px en `.container`; 20px en `.sp-hero__inner`, `.sp-video__inner`, `.world-hero__intro`; 16px en `.mobile-sticky-cta`; 14px en `.world-hero__split`.

### 4.2 Padding vertical de secciones

| Selector | Desktop | ≤900 | ≤560 |
|---|---|---|---|
| `.section` (L269) | `72px 0` | — | `48px 0` (L1626) |
| `.section--tight` (L271) | `48px 0` | — | `32px 0` |
| `.sp-section` (L4351) | `78px 0` | | |
| `.sp-cta` | `70px 0` | | |
| `.sp-claim` | `20px 0` | | |
| `.trust-bar` (L3433) | `28px 0` | | |
| `.press-strip` (L3475) | `28px 0` | | |
| `.hero__inner` (L204) | `96px` top/bottom | `64px` | |
| `.page-hero__inner` (L249) | `64px` top / `48px` bottom; `min-height:320px` (`--calc` 280, `--blog` 380) | | |
| `.cine-hero__inner` (L6014) | `clamp(40px,7vh,84px)` top / `clamp(24px,4vh,46px)` bottom; ≤760 top `clamp(60px,12vh,110px)` | | |
| `.sp-hero__inner` | `88px 20px` | | |
| `.home-montage__inner` | `clamp(48px,8vw,96px) 24px` | | |
| `.agro-feature__grid` | `clamp(48px,8vw,104px) 24px` | | |
| `.choose-hero` | `clamp(40px,6vw,80px) 0` | | |
| `.lead-hero` | `clamp(32px,5vw,68px) 0` | | |
| `.world-hero__intro` | `52px 20px 28px` | | |
| `.site-footer` (L767, L3603, L3841) | `64px 0 24px` + `margin-top:80px`; luego `padding-bottom:96px` y `padding-right:80px` (hueco para el FAB WhatsApp) | | `padding-right:24px` |
| `main` ≤900 | `padding-bottom:84px` (hueco para `.mobile-sticky-cta`) | | |
| `.cta-band` (L740) | `padding:56px` | `40px 24px` | `32px 20px` |

### 4.3 Ritmo cabecera → cuerpo

- `.section__head{text-align:center;max-width:720px;margin:0 auto 48px}` (L453–L456): **48px** entre cabecera y rejilla. En la home dos cabeceras van alineadas a la izquierda con `style="text-align:left"` (home.html L515, L542).
- Dentro de la cabecera: eyebrow `margin-bottom:8px` → `h2` `margin:0 0 .5em` → `p` `margin:0 0 1em`.
- Otras cabeceras: `.reviews-head` mb 32px; `.sp-head` mb 42px; `.world-block__head` mb 22px + pb 12px + `border-bottom:2px solid var(--color-border)`; `.choose-hero__head` mb `clamp(28px,4vw,48px)`; `.team-wall` mt `clamp(24px,4vw,40px)`; `.photo-gallery` mt 8px; `.filter-bar` mb 28px.
- Hero: `.cine-hero__eyebrow` mb 18 → `h1` mb 18 → sub mb 26 → `.cine-hero__actions` mb 24 → `.cine-hero__rating` mb 30 → tabs. Hero clásico: eyebrow mb 20 → h1 (mb .5em) → sub mb 36 → ctas (gap 14) → `.hero__proof` mt 28 → `.hero__dots` mt 34.
- Card: `.product-card__body` padding 20 → título mb 8 → meta mb 16 → precio mb 14 → CTA `margin-top:auto`. `.feature` padding 28 → icono mb 16 → h3 mb 8 → p.

### 4.4 Gaps de rejilla

| Gap | Rejillas |
|---|---|
| 24px | `.features` (4 col), `.collections`/`.kategorien` (2), `.product-grid` (4), `.testimonials` (3), `.calc-grid` (3), `.case-grid` (3), `.case-body` (3), `.blog-grid` (3), `.how-steps` (3), `.jobs-grid` (3), `.trust-bar__grid` (4), `.co2-calc`, `.preview-tool` |
| 20px | `.reviews-grid` (3), `.team-grid` (4), `.photo-gallery` (3; 14px ≤880), `.download-grid` (2), `.video-testi-grid` (3), `.form-grid` (2), `.quiz__result` |
| 18px | `.sp-disciplines` (4) |
| 16px | `.compare-slots` (3), `.blog-related-grid` (3), `.cert-grid` (3), `.glossary-list`, `.job-others` (2) |
| 14px | `.case-gallery` (3), `.cat-chips`, `.hero__ctas`, `.cine-hero__actions`, `.sp-hero__ctas`, `.world-hero__split`, `.lead-hero__tiles`, `.team-wall` column-gap |
| 12px | `.product-info__stats` (2), `.case-stats` (2), `.quiz__options` (2), `.site-header__cta`, `.product-info__actions`, `.contact-actions` |
| 10px | `.gallery__thumbs` (5; 4 ≤560), `.field-row` (3), `.faq-list`, `.hero__dots` |
| 8px | `.color-picker` (3), `.heu-animal-grid` (2), `.filter-bar__pills` |
| 6px | `.chip-select`, `.calc-viz__tabs`, `.m-row__dims` |
| 32px | `.calc-layout` (360px + 1fr), `.press-strip .container` |
| 40px | `.site-footer__grid` (1.4fr 1fr 1fr 1fr), `.three-d-cta`, `.padel-size-layout` |
| 48px | `.case-hero` (2), `.contact-grid` (2), `.rating-summary` (240px 1fr) |
| 56px | `.product-detail` (1.2fr 1fr) |
| clamp | `.choose-cards` `clamp(16px,2.5vw,28px)`; `.lead-hero__grid` `clamp(24px,4vw,56px)`; `.agro-feature__grid` `clamp(28px,5vw,64px)` |

Recuento global de `gap:` — los 8 valores más frecuentes (incluidas flex): 14px(21) 12px(21) 8px(19) 24px(18) 20px(14) 10px(14) 6px(12) 16px(9). Resto de valores, para completar el inventario: 2px(6) 4px(5) 7px(4) 40px(4) 32px(4) 48px(3) 30px(2) 22px(2) 9px(1) 5px(1) 56px(1) 3px(1) 1px(1) 18px(1) (18/32/40/48/56px ya aparecen en la tabla de rejillas de arriba; 2/3/4/5/7/9/22/30px son flex-gaps u otros no documentados en otra parte de este documento).

### 4.5 Padding interior de cajas

| Padding | Elementos |
|---|---|
| 28px | `.feature`, `.testimonial`, `.calc-card`, `.case-block`, `.how-step` |
| 36px | `.calc-card--lg` |
| 40px | `.quiz` (24px ≤700), `.case-quote` (24px ≤560), `.exit-popup__box` `40px 32px` |
| 24px | `.calc-layout__controls`, `.download-card`, `.co2-calc`, `.co2-calc__result`, `.threed-viewer`, `.bau-ampel`, `.bau-verdict`, `.sp-disc__body`, `.quiz__result` |
| 22px | `.review`, `.case-card__body`, `.blog-card__body`, `.team-card`, `.preview-tool__controls` |
| 20px | `.product-card__body`, `.compare-slot`, `.calc-layout__viz`, `.glossary-nav`, `.glossary-entry` `20px 24px` |
| 18px | `.product-info__stats`, `.calc-result`, `.cert-item` `18px 22px`, `.job-other` `18px 20px` |
| 16px | `.faq-item` `16px 20px`, `.video-testi__body` `16px 20px`, `.kf-specs` `16px 20px`, `.filter-bar` `16px 18px`, `.site-nav__mega` |
| 14px | `.case-stat` `14px 18px`, `.padel-sizes th/td` `14px 18px`, `.job-meta__item`, `.compare-slot` móvil |
| 12px | `.field input` `12px 14px`, `.m-row` `12px 14px`, `.case-hall-card` |
| 10px | `.site-nav__dropdown` (contenedor), `.site-nav__dropdown a` `10px 14px`, `.blog-related`, `.m-check__row` `8px 10px` |

### 4.6 Breakpoints reales (todos los `max-width` del CSS)

`grep -oE '@media[^{]+' main.pretty.css` (normalizando `@media(...)` sin espacio con `@media (...)`) da **16 valores de `max-width`** en 71 bloques, más `@media (hover:none)` (1) y `@media (prefers-reduced-motion:reduce)` (3):

| `max-width` | Bloques | Ejemplo de regla que cambia en ese punto |
|---|---|---|
| 480px | 5 | `.section__head .btn--secondary` (L3816, wrap a 2 líneas) |
| 520px | 4 | L409, L828 |
| 560px | 13 | (el más usado tras 900; `.section` padding 48px, L1626) |
| 600px | 1 | `.lead-hero__text h1` (L3520) |
| 680px | 1 | `.jobdetail-apply .btn` (L5793, sin espacio antes de `(`) |
| 700px | 5 | L2695, L2720, L3143 |
| 720px | 3 | L542 |
| 760px | 4 | `.cine-hero__h1` (L4229, **home**) |
| 768px | 6 | `.form-grid{grid-template-columns:1fr;gap:24px}` (L3585) |
| 780px | 2 | L368, L446 |
| 820px | 4 | `.world-hero__split{flex-direction:column}` (L4167) |
| 860px | 1 | `.agro-feature__grid{grid-template-columns:1fr}` (L5958) |
| 880px | 1 | `.photo-gallery{grid-template-columns:repeat(2,1fr)}` (L404) |
| 900px | 17 | el más usado; `.burger`, `.site-nav`, layout general de header/nav |
| 1000px | 1 | `.sp-disciplines{grid-template-columns:repeat(2,1fr)}` (L4364) |
| 1100px | 3 | `.product-grid`/`.features` → `repeat(3,1fr)`/`repeat(2,1fr)` (L889-894); `.reviews-grid`/`.case-grid`/`.case-body`/`.case-hero`/`.rating-summary` (L2311-2324) |

Total: 5+4+13+1+1+5+3+4+6+2+4+1+1+17+1+3 = **71**, verificado contra `grep -cE '@media[ ]?\(max-width' main.pretty.css` (71). Los recuentos de 900px, 480px y 680px incluyen variantes escritas sin espacio (`@media(max-width:...)`), que un grep ingenuo sobre `@media \(` se salta — ojo al reproducir el conteo.

Fuera de `max-width`: `@media (hover:none)` ×1 (L5284, `.lead-arrow{opacity:1}`); `@media (prefers-reduced-motion:reduce)` ×3 — `.reveal` (L3393), `.hero--slider .hero__slide.is-active`/`.hero__bg--slide` (L4023, **CSS muerto**: ninguna página usa `class="hero--slider"`), `.cine-hero__bg`/`.cine-hero__h1.is-swap`/`.cine-hero__sub.is-swap` (L6149, **hero activo de la home**).

El `screens` de §9.2 (6 valores: xs/sm/md/lg/xl/2xl) es una **simplificación deliberada**, no "los breakpoints reales del CSS": ver §9.2 para la traducción completa a `theme.extend.screens`.

---

## 5. Radios, sombras y bordes

### 5.1 Radios

| Radio | Apariciones | Elementos |
|---|---|---|
| `var(--radius)` = **12px** | 33 | Cards estándar: `.feature`, `.collection-card`, `.product-card` (→ 10px ≤560, L1622), `.testimonial`, `.review`, `.case-card`, `.blog-card`, `.team-card`, `.calc-card`, `.video-testi`, `.download-card`, `.how-step`, `.compare-slot`, `.case-block`, `.case-quote`; cajas: `.gallery__main`, `.product-info__stats`, `.rating-summary`, `.cta-band`, `.calc-layout__controls/__viz`, `.co2-calc`, `.threed-viewer`, `.quiz`, `.preview-tool__stage/__dropzone/__controls`, `.three-d-cta` (+ `__visual`), `.case-hero__media`, `.dach-map`, `.bau-ampel`, `.bau-verdict` |
| 12px literal | 9 | `.site-nav__dropdown`, `.lang-switch__menu`, `.padel-sizes`, `.quiz__options button`, `.quiz__result`, `.before-after`, `.contact-action`, `.site-nav__mega-col--sport`, `.sport-world .gallery__thumb` |
| 10px | 26 | **Inputs** (`.field input/select/textarea` L850), `.form-expand-btn`, `.rb-mode-tab`, `.rb-alt-card`, `.color-chip`, `.m-row`, `.m-check`, `.calc-viz__canvas`, `.calc-result`, `.co2-calc__result`, `.kf-specs`, `.faq-item`, `.case-stat`, `.case-hall-card`, `.case-gallery__item`, `.blog-related`, `.glossary-nav`, `.glossary-entry`, `.cert-item`, `.threed-viewer__canvas`, `.quiz__icon`, `.quiz__result-media`, `.maint-banner`, `.site-nav__mega .mega-item`, `.compare-slot` móvil |
| 8px | 14 | `.gallery__thumb`, `.site-nav__dropdown a`, `.lang-switch__menu a`, `.lightbox__img`, `.m-preset`, `.m-check__row`, `.heu-animal input`, `.compare-select`, `.compare-img-wrap`, `.case-hall-card img`, `.bau-info-box`, `.before-after__notice`, `.mega-item img`, dropdown móvil abierto |
| 6px | 5 | `.calc-disclaimer`, `.m-row__dims input`, `.blog-related img`, `::-webkit-file-upload-button`, `.maint-banner__x` |
| 5px / 4px / 3px / 2px | 2/2/2/2 | `.rating-dist__bar` (+ hijo) / `.quiz__progress`, `.video-testi__duration` / `.flag`, `.splash__bar` / `.burger span` |
| 14px | 7 | `.cat-chip`, `.photo-gallery a`, `.feature__icon`, `.hero__sports-lockup`, `.filter-bar`, `.job-meta`, `.job-other` |
| 16px | 16 | `.calc-card__icon`, `.exit-popup__box`, `.jobdetail-salary`, `.team-wall__item` (13px ≤480), `.padel-promo`, y **todas las cards Sports**: `.sp-disc`, `.sp-specs`, `.sport-world .product-card/.feature/.padel-sizes/.cta-band/.gallery__main/.product-info__stats/.threed-viewer` |
| 18px | 3 | `.choose-card`, `.lead-tile`, `.jobs-value` |
| 20px | 4 | `.world-panel`, `.jobcard`, `.jobdetail-apply`, `.agro-feature__video` |
| **50px (pill)** | 22 (+1 vía `--button-corner`) | `.btn`, `.site-header__phone`, `.lang-switch__current`, `.lightbox__counter`, `.calc-viz__tab`, `.chip`, `.filter-pill`, `.rating-badge`, `.review__hall`, `.case-block__label`, `.avail-banner`, `.before-after__label`, `.preview-tool__hint`, `.wa-fab`, `.padel-badge`, `.sp-head__eyebrow`, `.jobs-hero__eyebrow`, `.jobcard__tag`, `.jobcard-meta__chip`, `.lead-tile__world`, `.sport-world .section__eyebrow` |
| 999px | 5 | `.hero__eyebrow`, `.product-card__badge`, `.case-hero__eyebrow`, `.hero__dot`, `.agro-feature__badge` (mismo pill, otra mano) |
| 50% | 27 | Círculos: avatares (`.testimonial__author img` 48px, `.team-card__media` 96px), números (`.how-step__num` 56, `.timeline li::before` 56, `.m-row__num` 24), botones icono (`.lightbox__close` 48, `.lightbox__nav` 56, `.video-testi__play` 72, `.agro-feature__play` 78, `.mobile-sticky-cta__call` 56, `.exit-popup__close` 36→48, `.m-row__remove` 44, `.lead-arrow` 38, `.site-header__phone` móvil 48), puntos (`.lead-dot` 7, `.avail-banner__dot` 9, `.job-col__dot` 9, `.kf-color-dot` 14, `.color-chip span` 36), `.bau-light` 80, checks (`.product-info__features li::before` 18, `.feature__more summary::before` 16), `.gallery__main::after` 44, pins mapa |
| 0 | 3 | `.world-hero--split .world-panel`, `.site-nav__dropdown` móvil, mega col Sports móvil |

### 5.2 Sombras (todas)

| Sombra | Selector(es) |
|---|---|
| `0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)` (`--shadow-card`) | hover de cards; `.case-hero__media`, `.dach-map`, `.quiz` |
| `0 2px 16px rgba(6,24,39,.08)` (`--shadow-header`) | `.site-header.is-scrolled`, `.site-nav` móvil |
| `0 8px 24px rgba(6,24,39,.18)` | `.site-nav.is-open` ≤900 (L3783) |
| `0 20px 40px rgba(6,24,39,.12)` | `.site-nav__dropdown` (L988) |
| `0 10px 30px rgba(0,0,0,.08)` | `.lang-switch__menu` |
| `0 20px 40px rgba(6,24,39,.14)` | `.calc-card:hover` (L1184) |
| `0 20px 40px rgba(6,24,39,.15)` | `.three-d-cta__visual` |
| `0 18px 44px rgba(6,24,39,.13)` | `.choose-card:hover` (L5073); `.choose-card--sport:hover` la combina con `inset 0 4px 0 0 var(--brand-lime)` |
| `0 18px 44px rgba(6,24,39,.10)` | `.jobs-value:hover` |
| `0 22px 50px rgba(6,24,39,.13)` | `.jobcard:hover` |
| `0 14px 34px rgba(26,165,133,.13)` | `.job-other:hover` |
| `0 6px 14px rgba(26,165,133,.1)` | `.quiz__options button:hover` |
| `0 0 0 3px rgba(26,165,133,.15)` | **focus ring** `.field input:focus` (L855); `.color-chip.is-active` |
| `0 4px 14px rgba(6,24,39,.1)` → hover `0 10px 24px rgba(6,24,39,.15)` | `.rating-badge` |
| `0 6px 22px rgba(6,24,39,.22)` + `backdrop-filter:blur(6px)` | `.world-hero__badge .rating-badge` |
| `0 8px 26px rgba(0,0,0,.28)` | `.cine-hero__rating .rating-badge` (L6080) |
| `0 8px 24px rgba(37,211,102,.35)` → hover `0 14px 30px rgba(37,211,102,.45)` | `.wa-fab` |
| `0 -4px 20px rgba(6,24,39,.12)` | `.mobile-sticky-cta` (sombra hacia arriba) |
| `0 2px 6px rgba(0,0,0,.08)` | `.photo-gallery a` (reposo) |
| `0 20px 60px rgba(0,0,0,.5)` | `.lightbox__img` |
| `0 30px 60px rgba(0,0,0,.3)` | `.exit-popup__box` |
| `0 10px 30px rgba(0,0,0,.3)` | `.video-testi__play`, `.agro-feature__play` (`.5`) |
| `0 10px 28px rgba(0,0,0,.28)` | `.hero__sports-lockup` |
| `0 10px 28px rgba(6,24,39,.32)` | `.maint-banner` |
| `0 8px 26px rgba(6,24,39,.10)` → hover `0 16px 40px rgba(6,24,39,.18)` | `.team-wall__item` |
| `inset 0 0 0 1px rgba(6,24,39,.06)` | `.team-wall__item::after` (borde interior) |
| `0 4px 14px rgba(0,0,0,.25)` | `.before-after__handle>div` |
| `0 0 0 1px rgba(6,24,39,.12)` | `.before-after__handle` |
| `0 0 0 1px rgba(0,0,0,.08)` | `.flag` |
| `0 2px 6px rgba(0,0,0,.35)` | `.dach-map__pin` |
| `0 0 30px rgba(255,82,84|244,201,94|126,199,0,.8)` | `.bau-light.is-active` (glow semáforo) |
| `0 0 0 0 rgba(126,199,0,.6)` → `0 0 0 8px rgba(126,199,0,0)` | `@keyframes pulse` (1.8s) en `.avail-banner__dot` |
| `0 0 0 4px rgba(255,59,59,.25)` | `.agro-feature__badge::before` |
| `0 30px 70px -20px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)` → hover `0 40px 90px -20px rgba(0,0,0,.78),0 0 0 1px rgba(26,165,133,.4)` | `.agro-feature__video` |
| `inset 0 0 0 2px rgba(126,199,0,.55)` / `inset 5px 0 0 -2px rgba(126,199,0,.9)` / `inset 0 5px 0 -2px …` | `.world-panel--sport` y variantes split |
| `inset 0 0 0 3px #e3fc03` | `.lead-tile--sport` |
| `inset 0 4px 0 0 var(--brand-lime)` | `.choose-card--sport` (raya superior lima) |
| `7px 7px 0 var(--sport-lime),7px 7px 0 1px #000` | `.sp-disc:hover` (sombra dura "sticker" Sports, L4379) |
| `inset 0 -.5em 0 var(--sport-lime)` / `inset 0 -.55em 0 #e3fc03` | subrayado marcador en hover: `.sp-disc:hover .sp-disc__cta`, `.sport-world .filter-pill:hover`, `.world-block--sport .world-block__link:hover` |
| `.1em 0 0 var(--sport-lime),-.1em 0 0 var(--sport-lime)` | `.sp-hero__h1 em` (extiende el fondo lima a los lados) |
| `text-shadow` `0 2px 34px rgba(0,0,0,.55)` / `0 1px 18px rgba(0,0,0,.35)` | `.cine-hero__h1` / `.cine-hero__sub` |
| `drop-shadow(0 8px 24px rgba(0,0,0,.45))` / `drop-shadow(0 1px 1px rgba(0,0,0,.3))` | `.agro-feature__logo` / `.dach-map__pin--ref::after` |

Regla de sombras: en reposo casi nada (solo `--shadow-card` estática en 3 sitios); **la sombra aparece en hover junto con `translateY(-4px)`** y, en cards, con `border-color:var(--brand-green)`.

### 5.3 Bordes

- Estándar: `1px solid var(--color-border)` (#e2e2e2) en cards, inputs, dropdown, filas de tabla.
- 2px: `.cat-chip`, `.color-chip`, `.quiz__options button`, `.gallery__thumb` (transparente → verde en `.is-active`/hover), `.btn` (transparente salvo `--secondary`/`--ghost-light`), `.timeline li::before` (`2px solid var(--brand-green)`), `.dach-map__pin` (#fff), `.color-chip span` (`rgba(6,24,39,.15)`), `.world-block__head` border-bottom, `.preview-tool__dropzone` `2px dashed`.
- 1.5px: `.chip`.
- Acentos laterales (`border-left`): `3px solid #f4c95e` `.calc-disclaimer`; `4px solid #f4c95e` `.bau-info-box`; `6px solid var(--brand-green)` `.case-quote`; `4px solid var(--brand-lime)` `.maint-banner`; `4px solid #1aa585` banner inline creado en `main.js` (config → formulario). `.site-nav__mega-tools` `border-left:1px solid var(--color-border)`.
- Rayas superiores: `.jobcard::before` (4px gradiente verde→lima, `scaleX(0→1)` en hover); `.choose-card--sport` inset 4px lima; `.cine-tab` `border-top:2px solid transparent` → verde/lima en `.is-active`; `.cine-hero__tabs` `border-top:1px solid rgba(255,255,255,.2)`.
- Dashed: `.form-expand-btn` `1px dashed var(--color-border)`.
- Sports: **todo** `1px solid #000` (cards, tablas, botones, secciones con `border-top/bottom`).
- Separadores sobre oscuro: `rgba(255,255,255,.1)` (footer bottom), `.08` (disclaimer, trust-bar), `.14` (maint-banner).

---

## 6. Botones

### 6.1 Base `.btn`

```css
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;height:var(--button-normal-height);padding:0 28px;border-radius:var(--button-corner);font-family:var(--font-family);font-weight:var(--button-font-weight);text-transform:var(--button-text-transform);font-size:.85rem;letter-spacing:.04em;cursor:pointer;border:2px solid transparent;transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;white-space:nowrap}   /* L71–L87 */
.btn{min-height:var(--touch-target-min);box-sizing:border-box}   /* L3835–L3837 → 48px */
.btn,a.btn,button,summary{touch-action:manipulation}             /* L3935–L3936 */
```

Resuelto: pill 50px, **800 uppercase .85rem tracking .04em**, padding horizontal 28px, borde 2px siempre presente (transparente) para que las variantes con borde no salten, altura declarada 44px pero `min-height:48px` posterior → **48px efectivos**; `white-space:nowrap`; `gap:.5em` para un icono opcional. No hay `line-height` explícito (hereda 1.5 del body; irrelevante con flex + altura fija).

### 6.2 Modificadores

| Clase | Reposo | Hover | Transform | Uso en 78 páginas |
|---|---|---|---|---|
| `.btn--primary` (L92) | `background:var(--brand-green); color:#fff` | `background:var(--brand-green-dark); color:#fff` | `translateY(-1px)` **solo en primary** | 272 |
| `.btn--secondary` (L99) | `background:transparent; color:var(--color-title); border-color:var(--color-title)` (outline negro) | `background:var(--brand-green); color:#fff; border-color:var(--brand-green)` (se rellena de verde) | ninguno | 119 |
| `.btn--lime` (L107) | `background:var(--brand-lime); color:var(--brand-dark)` | `background:var(--brand-lime-hover); color:var(--brand-dark)` | ninguno | 50 |
| `.btn--ghost-light` (L113) | `background:transparent; color:#fff; border-color:#fff` (para fondos oscuros) | `background:#fff; color:var(--brand-green-deep)` | ninguno | 4 |
| `.btn--lg` (L88) | `height:var(--button-large-height)` = 56px; `padding:0 36px`; `font-size:.95rem` | — | — | 235 |

No existen en el código: `.btn--sm`, `.btn--icon`, `.btn--outline`, `.btn--link`, `.btn--block`, estados `:focus-visible`, `:active`, `:disabled`, `[aria-busy]` para `.btn`. El foco es el **outline por defecto del navegador**. El único "disabled" es inline en `main.js` (`arBtn.disabled = true; arBtn.style.opacity = '.6'`).

Combinaciones reales en la home: `btn btn--primary`, `btn btn--lg btn--primary`, `btn btn--lg btn--ghost-light`, `btn btn--secondary`, `btn btn--primary btn--lg`, `btn btn--lg btn--lime`, y `<span class="btn btn--primary product-card__cta">` (botón decorativo dentro de una card-enlace).

### 6.3 Iconos y flechas

- No hay componente de icono para `.btn`. Las flechas van **como texto en el label**: `View agricultural halls →`, `View projects →`, `All Models →` (17 `→` y 1 `›` en home.html). El carácter forma parte del string; no hay `::after` ni animación de la flecha en `.btn`.
- `gap:.5em` en `.btn` y `gap:8px` en `.ar-cta .btn` sugieren un `<svg>` inline opcional (el AR button). Botones-icono fuera de `.btn`: `.site-header__phone` (svg 20px, `color:var(--brand-green)`), `.wa-fab svg` 22px (26px ≤560), `.mobile-sticky-cta__call` (círculo 56px lima).
- Micro-animación de flecha: solo en `.jobcard__link span{transition:transform .2s}` → `.jobcard:hover .jobcard__link span{transform:translateX(4px)}`.

### 6.4 Overrides contextuales de `.btn`

| Contexto | Regla |
|---|---|
| `.product-card__cta` | `margin-top:auto` (pegado abajo en la card) |
| `.mobile-sticky-cta .btn` | `flex:1` |
| `.ar-cta .btn` | `width:100%; max-width:420px; gap:8px` |
| `.preview-tool__controls .btn` | `width:100%` |
| `.world-panel .btn` | `pointer-events:none` (la card entera es el enlace) |
| `.cine-hero__actions .btn` ≤760 | `flex:1 1 100%; justify-content:center` |
| `.section__head .btn--secondary` ≤480 | `max-width:100%; white-space:normal; height:auto; min-height:44px; padding:10px 18px` (permite 2 líneas) |
| `.padel-promo .btn` ≤560 | `width:100%; white-space:normal; text-align:center` |
| `.jobdetail-apply .btn` ≤680 | `text-align:center` |
| `.cine-hero.is-sport .cine-hero__actions .btn--primary` | `background:#e3fc03; color:#0a0f0c; border-color:#e3fc03`; hover `#eaff3a` |
| `.site-header__cta .btn:not(.burger)` ≤900 | `display:none` |

### 6.5 Sub-tema Sports (`.sport-world`, `.sp-cta`, `.padel-promo`)

| Selector | Reposo | Hover |
|---|---|---|
| `.sport-world .btn` | `border-radius:50px` (redundante) | |
| `.sport-world .btn--primary` (L4882) | `background:var(--sport-lime); color:#000; border:1px solid #000` | `background:#000; color:var(--sport-lime)` |
| `.sport-world .btn--secondary` | `transparent; color:#000; border-color:#000` | `#000 / lima` |
| `.sport-world .btn--lime` (L4243) | `var(--sport-lime); #000; border 1px #000` | `#000 / lima` |
| `.sport-world .btn--ghost-light` | `transparent; #000; border #000` | `#000 / #fff` |
| `.sp-cta .btn--lime` | `#000; color lima; border #000` (inversión sobre fondo lima) | `#fff / #000` |
| `.sp-cta .btn--ghost-light` | `#000 / border #000` | `#000 / lima` |
| `.sport-world .cta-band .btn--primary` | `#000; lima; border 1px #000` | `#fff / #000` |
| `.sport-world .cta-band .btn--secondary`, `.sport-world .cta-band .btn--ghost-light` (L4792) | `transparent; color #000; border #000` | `#000; color lima` (L4796) |
| `.padel-promo .btn--lime` | `lima; #000; border lima` | `#fff / #000; border #fff` |
| `.padel-promo .btn--ghost-light` | `transparent; #fff; border #fff` | `#fff / #000` |

### 6.6 Otros controles tipo botón (pills, chips, tabs)

| Selector | Altura/padding | Tipografía | Reposo | Activo/hover |
|---|---|---|---|---|
| `.filter-pill` (L4677) | `8px 16px`, pill 50px | .85rem 700 | `#fff`, borde `--color-border`, color title | hover borde+color verde; `.is-active` fondo verde, texto #fff. Transición `.18s` |
| `.chip` (L1439, L3701) | `10px 16px`, min-height 48, pill | .82rem 700 (+`small` .65rem 600 uppercase .06em) | `#fff`, `1.5px` borde | hover borde/color verde; `.is-active` verde/#fff; `all .15s` |
| `.calc-viz__tab` | `12px 18px`, min-height 44, pill | .9rem 700 | transparente + borde | `.is-active` verde |
| `.rb-mode-tab` | `10px 12px`, radio 10 | .84rem 700 | | hover borde verde; `.is-active` verde |
| `.cat-chip` | `14px 22px`, radio 14, columna | .98rem 700 + small .78rem 500 | `#fff`, `2px` borde | hover borde verde, texto verde-dark, `translateY(-2px)`, `--shadow-card` |
| `.color-chip` | `10px 6px`, radio 10, min-height 48 | .78rem 700 | `2px` borde | `.is-active` borde verde + ring 3px |
| `.quiz__options button` | `18px 20px`, radio 12 | strong 1rem / span .85rem | `2px` borde | hover borde verde, `translateY(-1px)`, sombra verde; `.is-selected` fondo `rgba(26,165,133,.05)` |
| `.site-header__phone` | `8px 14px`, pill, min-height 48 | `700 .85rem/1` | borde `--color-border` | hover borde verde, fondo `rgba(26,165,133,.06)`, texto verde-dark |
| `.lang-switch__current` | `12px 14px`, pill | `600 12px/1` uppercase .05em | borde | hover borde verde + tinte .06 |
| `.wa-fab` (L1739) | `12px 18px`, pill, fixed 24/24 | .88rem 800 uppercase .04em | `#25D366` #fff, sombra verde | hover `#1ebe5c`, `translateY(-2px)`, sombra mayor; `.is-hidden` cuando el footer entra en viewport (IntersectionObserver `threshold .05`) |
| `.rating-badge` | `10px 18px`, pill, min-height 48 | 700 (.82rem texto, strong 1rem) | `rgba(255,255,255,.92)`, sombra | hover `translateY(-2px)` |
| `.cine-tab` | `18px 6px 0`, `border-top 2px` | `.cine-tab__no` .72rem 700 .12em / `__name` clamp 800 uppercase | `rgba(255,255,255,.74)` | hover #fff; `.is-active` border-top verde (lima en `.is-sport`) |
| `.hero__dot` | 40×5px pill, hit-area ±20px vía `::before` | — | `rgba(255,255,255,.32)` | hover .6; `.is-active` verde + `scaleY(1.4)`; `:focus-visible` outline 2px #fff offset 3px |
| `.lead-dot` | 7px círculo | — | `rgba(255,255,255,.5)` | `.is-active` #fff `scale(1.3)` |
| `.form-expand-btn` | `12px 16px`, radio 10, min-height 44 | .9rem 700 | `1px dashed` borde, texto verde-dark | hover tinte .06 + borde verde |

---

## 7. Enlaces, foco, selección, scrollbars, `html`/`body`, reset

### 7.1 Enlaces

```css
a{color:var(--color-link);text-decoration:none}   /* L47–L49: #222222, sin subrayado */
a:hover{color:var(--brand-green)}                  /* L50–L51 */
```

Variantes: `.prose a{color:var(--brand-green);font-weight:700}`; `.glossary-nav a` verde 600; `.consent-row a` verde-deep 700 **subrayado**; `.site-footer a` `#9eb3bd` → hover `--brand-lime`; `.site-footer__bottom a[href^="tel:"], [href^="mailto:"]` subrayado lima 600; `.breadcrumbs a` `#cfd8dc` → #fff; `.jobdetail-back` subrayado `text-underline-offset:3px`; `.quiz__restart` subrayado gris; `.dach-map__popup a` verde 700. Los enlaces-card (`.product-card`, `.case-card`, `.blog-card`, `.contact-action`…) fijan `color:var(--color-title)` y re-fijan el mismo color en `:hover` para anular el verde global.

Subrayado animado de navegación (L139–L153):

```css
.site-nav a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--brand-green);transform:scaleX(0);transform-origin:left;transition:transform .2s ease}
.site-nav a:hover::after{transform:scaleX(1)}
```

`.site-nav__sports::after` igual pero gradiente `90deg` verde→lima, `bottom:-5px`, `.25s`, también en `:focus-visible`.

### 7.2 Foco

- **No hay estilo global de `:focus-visible`**. Botones y enlaces usan el anillo por defecto del navegador.
- Inputs: `.field input:focus, select:focus, textarea:focus{outline:none;border-color:var(--brand-green);box-shadow:0 0 0 3px rgba(26,165,133,.15)}` (L852–L855).
- `:focus-visible` explícito solo en 4 selectores: `.lang-switch__menu a:focus-visible` (mismo estilo que hover), `.contact-action:focus-visible` (idem), `.hero__dot:focus-visible{outline:2px solid #fff;outline-offset:3px}`, `.site-nav__sports:focus-visible::after`. Sports: `.sport-world .gallery__thumb.is-active/hover{outline:2px solid var(--sport-lime);outline-offset:-2px}`.
- `accent-color:var(--brand-green)` en `.consent-row input[type="checkbox"]` (L1491) e `input[type="range"]` (L1503).
- `-webkit-tap-highlight-color:rgba(26,165,133,.15)` en `html` (L3933–L3934).

### 7.3 Selección y scrollbars

- `::selection`: **no está en el código**.
- Scrollbars (`::-webkit-scrollbar`, `scrollbar-width`, `scrollbar-color`): **no está en el código**. Solo `-webkit-overflow-scrolling:touch` en `.site-nav` móvil y `.padel-sizes-wrap`.

### 7.4 `html` y `body`

```css
html{scroll-behavior:smooth}                       /* L32–L33 */
html,body{overflow-x:hidden;width:100%}            /* L3580–L3582 */
html{overflow-x:clip}                              /* L4647–L4648: gana sobre hidden en html; body sigue hidden */
```

- `html{overflow-x:clip}` evita que `overflow-x:hidden` convierta `html` en contenedor de scroll (rompería `position:sticky` del header). `body` queda `overflow-x:hidden`.
- Scroll a anclas: `main.js` intercepta `a[href^="#"]` y hace `window.scrollTo({top: el.offsetTop - 90, behavior:'smooth'})` (offset 90px por el header de 80px). `.glossary-entry{scroll-margin-top:100px}`.
- `body` sin `min-height`; `main{padding-bottom:84px}` ≤900 para la barra sticky. `body.is-product-detail .wa-fab{display:none}` (L3609).
- `document.body.style.overflow='hidden'` lo pone el JS al abrir el lightbox.

### 7.5 Reset

Mínimo, sin normalize:

```css
*,*::before,*::after{box-sizing:border-box}   /* L30–L31 */
img{max-width:100%;display:block;height:auto} /* L43–L46 */
```

Más `body{margin:0}`, márgenes de `h*`/`p` (§3.2). Listas se resetean por componente (`.timeline`, `.product-info__features`, `.job-col ul`, `.calc-result__meta`, `.lang-switch__menu`: `list-style:none;padding:0;margin:0`). `summary` sin marcador: `list-style:none` + `::-webkit-details-marker{display:none}` en `.feature__more` y `.faq-item`. `.sr-only` estándar (L4946). Inputs: `font-family:inherit`, `font-size:16px`, `width:100%`, `box-sizing:border-box`.

### 7.6 Movimiento global (afecta a todo el sistema)

- **Reveal on scroll**: `main.js` añade `.reveal` a `.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other` y `.is-visible` con `IntersectionObserver({threshold:0.12, rootMargin:'0px 0px -60px 0px'})`. CSS: `.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}` → `.is-visible{opacity:1;transform:none}` (L3386–L3392); anulado en `prefers-reduced-motion:reduce`.
- **Tilt 3D en cards**: `.product-card,.case-card,.calc-card,.blog-card{will-change:transform;transform-style:preserve-3d;transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease}` (L3399–L3402); `main.js` en `mousemove` (no en `pointer:coarse`) pone `translateY(-4px) perspective(900px) rotateX(±3deg) rotateY(±3deg)` y lo limpia en `mouseleave`.
- **View Transitions**: `@view-transition{navigation:auto}`; `::view-transition-old(root)` `vt-fade-out .18s` (opacidad 0 + `translateY(-10px)`), `::view-transition-new(root)` `vt-fade-in .28s` (desde `translateY(10px)`) (L3404–L3418). `main.js` envuelve la navegación interna en `document.startViewTransition`.
- `@keyframes fadeUp` (.6s, `translateY(14px)`), `quizFade` (.3s), `heroSlideIn` (.7s `cubic-bezier(.16,.84,.44,1)`), `cineSwap` (.5s), `cineZoom` (8s ease-out `scale(1.04→1.12)`), `press-scroll` (40s linear), `logo-pulse`/`loadbar` (splash), `pulse`, `jobsPulse`, `wghtFlex`.
- Easings usados: `ease` (mayoría), `linear` (marquee, parallax), `ease-out` (cineZoom), `ease-in-out` (pulsos), `cubic-bezier(.2,.7,.2,1)` (team-wall), `cubic-bezier(.2,.7,.3,1)` (world-panel flex-grow), `cubic-bezier(.16,.84,.44,1)` (heroSlideIn). Duraciones estándar: **.15s** (chips), **.18s** (botones, pills), **.2s** (cards, nav), **.25s** (cards con tilt), **.4s** (zoom de imagen en card), **.6s** (reveal).

---

## 8. Escala de z-index y patrones de fondo

### 8.1 z-index (todos)

| z | Selector | Nota |
|---|---|---|
| 0 | `.hero__video`, `.hero__video+.hero__bg`, `.hero--slider .hero__bg--slide`, `.sp-hero__bg`, `.world-panel__bg`, `.sp-video__media`, `.cine-hero__stage`, `.home-montage__bg` | Capa imagen/vídeo |
| 1 | `.hero__inner`, `.page-hero__inner`, `.hero--slider .hero__inner`, `.collection-card__label`, `.page-hero--padel::after`, `.timeline li::before`, `.world-panel::after`, `.sp-video__overlay`, `.cine-hero__scrim`, `.home-montage__overlay`, `.agro-feature__grid`, `.sp-hero__inner` (L4276) | Scrim o contenido sobre imagen |
| 2 | `.page-hero--padel .page-hero__inner`, `.before-after__label`, `.world-panel__inner`, `.sp-video__inner`, `.cine-hero__inner`, `.home-montage__inner`, `.lead-slide__label` | Contenido sobre scrim |
| 3 | `.lead-tile__world`, `.lead-tile__dots` | |
| 4 | `.lead-arrow` | |
| 6 | `.world-hero__badge` | |
| 40 | `.mobile-sticky-cta` (L1135), `.maint-banner` (L5338) | Fixed inferiores/avisos |
| 45 | `.wa-fab` (L1743) | FAB WhatsApp |
| 50 | `.site-header` (L123, `position:sticky;top:0`) | Header |
| 80 | `.site-nav__dropdown` (L994) | Dropdown desktop |
| 100 | `.lang-switch__menu` (L1710), `.exit-popup` (L2727) | Menú idioma / modal salida |
| 1000 | `.lightbox` (L1060) | Lightbox |
| 2000 | `.splash` (L3343) | Pantalla de carga |

Contextos de apilamiento aislados: `isolation:isolate` en `.before-after` (L3612), `.lead-tile` (L5168), `.cine-hero` (L5975).

### 8.2 Fondos de sección

| Clase | Fondo | Texto | Uso |
|---|---|---|---|
| `.section` | ninguno (hereda `body` #fff) | | 123 |
| `.section--soft` (L273) | `var(--color-bg-soft)` #f6f8f7 | | 52 |
| `.section--brand` (L280) | `linear-gradient(135deg,#1aa585 0%,#138d70 100%)` | #fff; `h2,h3` #fff; `.calc-card` glass `rgba(255,255,255,.08)` + borde `.18`, hover `.14` + `translateY(-3px)`; svg forzados a blanco con `!important` | 38 |
| `.section--dark` (L275) | `var(--brand-dark)` #061827 | `#dfe7ea`; `h2,h3` #fff; `.calc-card` glass `.06` + borde `.12`; icono `rgba(126,199,0,.14)`; CTA lima | 0 |
| `.section--tight` | — (solo padding) | | 1 |
| `.trust-bar` (L3433) | `#061827`, `border-bottom:1px solid rgba(255,255,255,.08)` | `#dfe7ea`; cifras lima 1.3rem 800 | 1 |
| `.press-strip` (L3475) | `--color-bg-soft`; logos con `mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)` y marquee `press-scroll 40s linear infinite` (pausa en hover) | | 1 |
| `.site-footer` | `--brand-dark` | `#9eb3bd`; h4 #fff | 78 |
| `.cta-band` (L740) | `linear-gradient(135deg,var(--brand-green-deep),var(--brand-green))`, radio 12, padding 56, centrado | #fff; `p` `rgba(255,255,255,.9)` 1.05rem | 47 |
| `.home-montage` | imagen `object-fit:cover` + overlay `linear-gradient(90deg,rgba(6,24,39,.88) 0%,rgba(6,24,39,.55) 60%,rgba(6,24,39,.35) 100%)` | #fff | 1 |
| `.agro-feature` | `radial-gradient(120% 120% at 80% 0%,#0d2536 0%,#061827 55%,#04101b 100%)` + `::before` `radial-gradient(40% 60% at 18% 30%,rgba(26,165,133,.16),transparent 70%)` | #fff | 0 |
| `.calc-result`, `.co2-calc__result`, `.quiz__result` | gradientes 135deg deep↔green (ver §2.1) | #fff | |
| `.case-quote`, `.three-d-cta` | `linear-gradient(135deg,#f6f8f7,#eaf3f0)` | | |
| `.site-nav__mega-col--sport` | `linear-gradient(160deg,rgba(6,24,39,.05),rgba(126,199,0,.09))`, radio 12 | | |
| `.filter-bar` | `#fafafa` + borde | | |
| Sports: `.sp-claim`, `.sp-cta`, `.sport-world .cta-band` | `var(--sport-lime)` + `border 1px #000` | #000 | |
| Sports: `.sp-section--specs`, `.sport-world .section--soft` | `#f4f4f2` + `border-top/bottom 1px #000` | | |
| `.padel-promo` | `#000`, radio 16 | #fff | |

### 8.3 Scrims sobre imagen (gradientes de legibilidad)

| Selector | Gradiente |
|---|---|
| `.hero__bg::after` (L198) | `linear-gradient(120deg,rgba(6,24,39,.78) 0%,rgba(6,24,39,.55) 45%,rgba(6,24,39,.35) 100%)` — oscuro a la izquierda, texto a la izquierda |
| `.hero__bg--sports::after` | `linear-gradient(120deg,rgba(6,24,39,.84) 0%,rgba(8,38,22,.5) 55%,rgba(126,199,0,.22) 100%)` |
| `.page-hero__bg::after` (L245) | `linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))` — más oscuro abajo (título abajo, `align-items:flex-end`) |
| `.page-hero--padel::after` | `linear-gradient(180deg,rgba(15,30,45,.45) 0%,rgba(15,30,45,.25) 50%,rgba(15,30,45,.55) 100%)` |
| `.cine-hero__scrim` (L6010) | dos capas: `linear-gradient(100deg,rgba(8,16,24,.94) 0%,rgba(8,16,24,.74) 40%,rgba(8,16,24,.34) 70%,rgba(8,16,24,.08) 100%)` + `linear-gradient(0deg,rgba(8,16,24,.66) 0%,rgba(8,16,24,0) 46%)` — **la home** |
| `.collection-card::after` (L561) | `linear-gradient(180deg,rgba(6,24,39,0) 40%,rgba(6,24,39,.85) 100%)` — solo el tercio inferior |
| `.photo-gallery__caption` | `linear-gradient(180deg,rgba(6,24,39,0) 0%,rgba(6,24,39,.78) 100%)` |
| `.lead-slide::after` | `linear-gradient(180deg,rgba(6,24,39,0) 38%,rgba(6,24,39,.84) 100%)`; sport `rgba(3,10,6,0) 30%→rgba(2,10,6,.9)` |
| `.world-panel--industrie::after` | `180deg .05 / .42 45% / .88`; `--sport` `rgba(3,10,6,.18)/rgba(3,12,8,.58) 40%/rgba(2,8,5,.93)`; split `160deg .34→.6` / `rgba(3,10,6,.4)→rgba(2,10,6,.66)` |
| `.home-montage__overlay` | `90deg .88 / .55 60% / .35` |
| `.sp-hero__bg::after` | **scrim blanco**: `linear-gradient(105deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.86) 42%,rgba(255,255,255,.25) 78%,rgba(255,255,255,0) 100%)` |
| `.sp-video__overlay` | `180deg rgba(5,10,7,.12) / .5 55% / .92` |
| `.lightbox` / `.exit-popup__backdrop` | planos `rgba(6,24,39,.92)` / `.72` |

Patrón: **siempre navy `rgba(6,24,39,α)` (o su variante `rgba(8,16,24,α)`), nunca negro puro**, con el lado del texto entre .78 y .94 y el opuesto entre .08 y .35.

---

## 9. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui

### 9.1 Fuentes (`app/layout.tsx`)

```ts
import { Figtree } from "next/font/google";
import localFont from "next/font/local";

export const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: "variable",          // Google sirve 300..900 variable (comprobado)
  display: "swap",
  variable: "--font-figtree",
});
// Solo si Pavivasa quiere una display distinta. Globotent usa Clash Display (Fontshare 500/600/700)
// en su sub-tema Sports; no es Google Font: descargar el .woff2 y cargarlo con localFont.
export const display = localFont({
  src: [{ path: "./fonts/ClashDisplay-Semibold.woff2", weight: "600" }],
  display: "swap",
  variable: "--font-display",
});
// <html className={`${figtree.variable} ${display.variable}`}>
```

### 9.2 `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "24px",                       // .container{padding:0 24px}
      screens: { "2xl": "1280px" },          // --container:1280px (max-width fijo, no fluido por breakpoint)
    },
    // OJO: no se toca `theme.screens` (declararlo aquí, fuera de `extend`, SUSTITUYE los breakpoints
    // por defecto de Tailwind sm:640/md:768/lg:1024/xl:1280/2xl:1536 y rompe cualquier bloque shadcn
    // copiado tal cual, p.ej. `Dialog`/`Sheet` con `sm:max-w-lg`). Los 16 breakpoints reales del CSS
    // (max-width, inventario completo en §4.6) van en `extend.screens` con nombres que no chocan.
    extend: {
      screens: {
        bp480: "481px", bp520: "521px", bp560: "561px", bp600: "601px", bp680: "681px",
        bp700: "701px", bp720: "721px", bp760: "761px", bp768: "769px", bp780: "781px",
        bp820: "821px", bp860: "861px", bp880: "881px", bp900: "901px", bp1000: "1001px", bp1100: "1101px",
      },
      colors: {
        brand: {
          DEFAULT: "#1aa585",                 // --brand-green
          dark: "#12755e",                    // --brand-green-dark (hover primary)
          deep: "#007a4a",                    // --brand-green-deep (fin de gradientes, ghost hover text)
          "deep-hover": "#0d614c",            // --brand-green-deep-hover
          lime: "#7ec700",                    // --brand-lime
          "lime-hover": "#84d814",            // --brand-lime-hover
          navy: "#061827",                    // --brand-dark (fondo oscuro, texto sobre lima, base de scrims)
        },
        title: "#151719",                     // --color-title
        body: "#535353",                      // --color-text
        sub: "#535353",                       // --color-sub-title (mismo valor, rol distinto)
        link: "#222222",                      // --color-link
        line: "#e2e2e2",                      // --color-border
        soft: "#f6f8f7",                      // --color-bg-soft
        "on-dark": { DEFAULT: "#dfe7ea", muted: "#9eb3bd", faint: "#7d909a", crumb: "#cfd8dc" },
        amber: "#f4c95e",                     // estrellas, avisos
        wa: { DEFAULT: "#25D366", hover: "#1ebe5c" },
        sport: { lime: "#e3fc03", "lime-hover": "#eaff3a", soft: "#f4f4f2", sub: "#323232" },
        // semánticos shadcn (los HSL van en globals.css, §9.3)
        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontFamily: {
        sans: ["var(--font-figtree)", "system-ui", "-apple-system", "sans-serif"],   // --font-family
        display: ["var(--font-display)", "var(--font-figtree)", "sans-serif"],       // 'Clash Display',var(--font-family)
        serif: ["Georgia", "serif"],                                                  // .press-item, tooltip "i"
      },
      fontSize: {
        // escala real del sitio (rem) — los cinco más usados están marcados ★
        "3xs": ["0.68rem", { lineHeight: "1.4" }],
        "2xs": ["0.72rem", { lineHeight: "1.4" }],
        xs:    ["0.78rem", { lineHeight: "1.4" }],   // ★ badges, eyebrows pequeños
        "xs+": ["0.82rem", { lineHeight: "1.5" }],   // ★
        sm:    ["0.85rem", { lineHeight: "1.5" }],   // ★ meta, .btn
        "sm+": ["0.9rem",  { lineHeight: "1.5" }],   // ★ labels, dropdown
        md:    ["0.95rem", { lineHeight: "1.5" }],   // ★ nav, .btn--lg, párrafos de card
        base:  ["1rem",    { lineHeight: "1.5" }],
        lg:    ["1.05rem", { lineHeight: "1.5" }],   // títulos de card, prosa
        xl:    ["1.15rem", { lineHeight: "1.5" }],   // hero sub, precio card
        "2xl": ["1.25rem", { lineHeight: "1.15" }],  // h3
        "3xl": ["1.6rem",  { lineHeight: "1.15" }],  // collection h3, prose-block h2
        "4xl": ["1.8rem",  { lineHeight: "1.15" }],  // precio detalle
        "5xl": ["2.4rem",  { lineHeight: "1" }],     // cifras
        "6xl": ["3.8rem",  { lineHeight: "1" }],     // rating number
        h2:   ["clamp(1.6rem,2.8vw,2.4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "800" }],
        h1:   ["clamp(2rem,4.2vw,3.6rem)",   { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "800" }],
        hero: ["clamp(2.1rem,5.1vw,4rem)",   { lineHeight: "1.03", letterSpacing: "-0.02em", fontWeight: "800" }],
        "hero-sub": ["clamp(1.02rem,1.45vw,1.2rem)", { lineHeight: "1.5" }],
        "h1-product": ["clamp(1.8rem,2.6vw,2.4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "800" }],
        eyebrow: ["0.8rem",  { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "800" }],
        btn:     ["0.85rem", { lineHeight: "1.5", letterSpacing: "0.04em", fontWeight: "800" }],   // §6.1: sin line-height propio en .btn, hereda 1.5 del body
        "btn-lg":["0.95rem", { lineHeight: "1.5", letterSpacing: "0.04em", fontWeight: "800" }],
      },
      fontWeight: { light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800", black: "900" },
      letterSpacing: { tighter: "-0.02em", tight: "-0.01em", btn: "0.04em", caps: "0.08em", eyebrow: "0.12em", wide: "0.14em" },
      lineHeight: { hero: "1.03", title: "1.15", body: "1.5", relaxed: "1.55", prose: "1.7" },
      borderRadius: {
        // DEFAULT/lg referencian var(--radius) — el patrón estándar que inyecta `npx shadcn add` — para que
        // sea la ÚNICA fuente de verdad; el resto de la escala (xs…4xl, pill) es extensión propia del sitio
        // que el CLI de shadcn no toca.
        xs: "6px", sm: "8px", md: "10px",           // 10px = inputs
        DEFAULT: "var(--radius)", lg: "var(--radius)",       // --radius: cards (12px, §9.3)
        xl: "14px", "2xl": "16px", "3xl": "18px", "4xl": "20px",
        pill: "50px", full: "9999px",
      },
      boxShadow: {
        card: "0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)",      // --shadow-card
        header: "0 2px 16px rgba(6,24,39,.08)",                                // --shadow-header
        dropdown: "0 20px 40px rgba(6,24,39,.12)",
        lift: "0 18px 44px rgba(6,24,39,.13)",                                 // choose-card hover
        "lift-lg": "0 22px 50px rgba(6,24,39,.13)",                            // jobcard hover
        "card-hover": "0 20px 40px rgba(6,24,39,.14)",                         // calc-card hover
        ring: "0 0 0 3px rgba(26,165,133,.15)",                                // focus inputs
        badge: "0 4px 14px rgba(6,24,39,.1)",
        "badge-hover": "0 10px 24px rgba(6,24,39,.15)",
        sticky: "0 -4px 20px rgba(6,24,39,.12)",
        fab: "0 8px 24px rgba(37,211,102,.35)",
        "fab-hover": "0 14px 30px rgba(37,211,102,.45)",
        modal: "0 30px 60px rgba(0,0,0,.3)",
        lightbox: "0 20px 60px rgba(0,0,0,.5)",
        sport: "7px 7px 0 #e3fc03,7px 7px 0 1px #000",
      },
      spacing: {
        gutter: "24px", section: "72px", "section-sm": "48px", "section-tight": "32px",
        head: "48px", "card-pad": "28px", "card-pad-sm": "20px",
        header: "80px",
      },
      height: { btn: "48px", "btn-lg": "56px", header: "80px" },
      minHeight: { touch: "48px", hero: "620px", "page-hero": "320px" },
      maxWidth: { container: "1280px", head: "720px", prose: "780px", contact: "880px", detail: "980px", choose: "1080px" },
      aspectRatio: { card: "4 / 3", wide: "16 / 10", video: "16 / 9" },
      transitionDuration: { 150: "150ms", 180: "180ms", 200: "200ms", 250: "250ms", 400: "400ms", 600: "600ms" },
      transitionTimingFunction: {
        lift: "cubic-bezier(.2,.7,.2,1)", panel: "cubic-bezier(.2,.7,.3,1)", slide: "cubic-bezier(.16,.84,.44,1)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg,#1aa585 0%,#138d70 100%)",             // .section--brand
        "cta-gradient": "linear-gradient(135deg,#007a4a,#1aa585)",                      // .cta-band
        "icon-gradient": "linear-gradient(135deg,#1aa585,#007a4a)",                     // .feature__icon
        "bar-gradient": "linear-gradient(90deg,#1aa585,#7ec700)",                       // barras de progreso
        "scrim-hero": "linear-gradient(120deg,rgba(6,24,39,.78) 0%,rgba(6,24,39,.55) 45%,rgba(6,24,39,.35) 100%)",
        "scrim-page": "linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))",
        "scrim-card": "linear-gradient(180deg,rgba(6,24,39,0) 40%,rgba(6,24,39,.85) 100%)",
        "scrim-cine": "linear-gradient(100deg,rgba(8,16,24,.94) 0%,rgba(8,16,24,.74) 40%,rgba(8,16,24,.34) 70%,rgba(8,16,24,.08) 100%),linear-gradient(0deg,rgba(8,16,24,.66) 0%,rgba(8,16,24,0) 46%)",
        "pale-gradient": "linear-gradient(135deg,#f6f8f7,#eaf3f0)",
      },
      keyframes: {
        reveal: { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
        "cine-zoom": { from: { transform: "scale(1.04)" }, to: { transform: "scale(1.12)" } },
        "cine-swap": { from: { opacity: "0", transform: "translateY(11px)" }, to: { opacity: "1", transform: "none" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulse: { "0%,100%": { boxShadow: "0 0 0 0 rgba(126,199,0,.6)" }, "50%": { boxShadow: "0 0 0 8px rgba(126,199,0,0)" } },
      },
      animation: {
        reveal: "reveal .6s ease both",
        "cine-zoom": "cine-zoom 8s ease-out both",
        "cine-swap": "cine-swap .5s ease both",
        marquee: "marquee 40s linear infinite",
        pulse: "pulse 1.8s ease-in-out infinite",
      },
      zIndex: {
        // Tailwind 3.4 no trae z-1…z-9 por defecto (escala nativa 0/10/20/30/40/50/auto): sin extenderlos
        // haría falta z-[2] arbitrario. Valores bajos = apilamiento imagen→scrim→contenido de heros (§8.1).
        img: "0", scrim: "1", content: "2", dot: "3", arrow: "4", badge: "6",
        sticky: "40", fab: "45", header: "50", dropdown: "80", menu: "100", lightbox: "1000", splash: "2000",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### 9.3 `globals.css` (variables shadcn + tokens literales)

```css
@layer base {
  :root {
    /* shadcn semánticos (HSL sin hsl(), calculados desde los hex del sitio) */
    --background: 0 0% 100%;            /* #ffffff */
    --foreground: 0 0% 33%;             /* #535353 --color-text */
    --card: 0 0% 100%;
    --card-foreground: 210 9% 9%;       /* #151719 --color-title */
    --primary: 166 73% 37%;             /* #1aa585 --brand-green */
    --primary-foreground: 0 0% 100%;
    --secondary: 150 12% 97%;           /* #f6f8f7 --color-bg-soft */
    --secondary-foreground: 210 9% 9%;
    --muted: 150 12% 97%;
    --muted-foreground: 0 0% 33%;       /* --color-sub-title */
    --accent: 82 100% 39%;              /* #7ec700 --brand-lime */
    --accent-foreground: 207 73% 9%;    /* #061827 --brand-dark */
    --border: 0 0% 89%;                 /* #e2e2e2 --color-border */
    --input: 0 0% 89%;
    --ring: 166 73% 37%;
    --radius: 12px;                     /* --radius */
    /* tokens literales que shadcn no modela */
    --brand-green-dark: #12755e;
    --brand-green-deep: #007a4a;
    --brand-navy: #061827;
    --shadow-card: 0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06);
    --shadow-header: 0 2px 16px rgba(6,24,39,.08);
    --touch-target-min: 48px;
  }
  html { scroll-behavior: smooth; overflow-x: clip; -webkit-tap-highlight-color: rgba(26,165,133,.15); }
  body { @apply bg-background text-body font-sans antialiased; overflow-x: hidden; }
  h1, h2, h3, h4, h5 { @apply text-title font-extrabold leading-title; margin: 0 0 .5em; }
  h1 { @apply text-h1; font-variation-settings: "wght" 800; }
  h2 { @apply text-h2; }
  h3 { @apply text-2xl; }
  p  { margin: 0 0 1em; }
  a  { @apply text-link no-underline hover:text-brand; }
  img { @apply block max-w-full h-auto; }
  input, select, textarea { font-size: 16px; }   /* anti-zoom iOS (L3816) */
  small { font-size: 12px; line-height: 1.4; }
}
```

### 9.4 `SiteButton` con `cva` (NO sustituye a `components/ui/button.tsx`)

**Este componente es un par nuevo, no un reemplazo.** El `Button`/`buttonVariants` canónico de shadcn expone `variant: default|destructive|outline|secondary|ghost|link` y `size: default|sm|lg|icon`; varios componentes shadcn (`Calendar`, `Pagination`, `AlertDialogCancel`…) llaman internamente a `buttonVariants({variant:"outline"})` o `{variant:"ghost"}`. Ninguno de esos estilos existe en el `.btn` de globotent (no hay nada parecido a un botón fantasma gris o un link-button en el código fuente — "no está en el código"), así que inventarlos ahí sería falsificar la referencia. Solución: dejar `components/ui/button.tsx` tal cual lo genera el CLI de shadcn (intacto para que el resto del kit funcione) y añadir este componente aparte, `components/site/site-button.tsx`, para los patrones reales de `.btn`:

```tsx
// components/site/site-button.tsx
import { cva, type VariantProps } from "class-variance-authority";

export const siteButtonVariants = cva(
  // .btn (L71–L87) + min-height 48 (L3835-3836) + touch-action (L3935). Foco: el sitio no lo estiliza; aquí se añade
  // un ring coherente con el de los inputs (0 0 0 3px rgba(26,165,133,.15)) porque shadcn lo espera.
  // OJO cva: cva no aplica tailwind-merge — dos utilidades que tocan la misma propiedad (p.ej. border-color en
  // base Y en una variante) compiten por orden de aparición en el CSS compilado, no por orden del array. Por eso
  // `border-transparent` NO va en la base: cada variante declara su propio color de borde (ver más abajo).
  [
    "inline-flex items-center justify-center gap-[.5em] whitespace-nowrap",
    "rounded-pill border-2",
    "font-sans font-extrabold uppercase tracking-btn",
    "transition-[background-color,color,border-color,transform] duration-180 ease-[ease]",
    "cursor-pointer touch-manipulation select-none",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/15",
    "disabled:pointer-events-none disabled:opacity-60",   // opacidad .6 = única señal de disabled en main.js
  ],
  {
    variants: {
      variant: {
        // .btn--primary: único con translateY(-1px) en hover; border-transparent explícito (no en la base)
        primary: "bg-brand text-white border-transparent hover:bg-brand-dark hover:-translate-y-px",
        // .btn--secondary: outline negro que se rellena de verde
        secondary: "bg-transparent text-title border-title hover:bg-brand hover:text-white hover:border-brand",
        // .btn--lime
        lime: "bg-brand-lime text-brand-navy border-transparent hover:bg-brand-lime-hover",
        // .btn--ghost-light: para fondos oscuros
        ghostLight: "bg-transparent text-white border-white hover:bg-white hover:text-brand-deep",
        // .sport-world .btn--primary / .btn--secondary (sub-tema; borde 1px #000 en el original, aquí 2px para no romper la base)
        sportPrimary: "bg-sport-lime text-black border-black hover:bg-black hover:text-sport-lime",
        sportSecondary: "bg-transparent text-black border-black hover:bg-black hover:text-sport-lime",
        // .wa-fab (no es .btn en el original, pero comparte anatomía)
        whatsapp: "bg-wa text-white border-transparent shadow-fab hover:bg-wa-hover hover:-translate-y-0.5 hover:shadow-fab-hover text-[.88rem]",
      },
      size: {
        default: "h-12 min-h-touch px-7 text-btn",      // 48px (44 declarados + min-height 48), padding 0 28px, .85rem
        lg: "h-14 px-9 text-btn-lg",                     // .btn--lg: 56px, padding 0 36px, .95rem
        icon: "h-12 w-12 p-0 rounded-full",              // .mobile-sticky-cta__call / .site-header__phone móvil
      },
      block: { true: "w-full" },                          // .ar-cta .btn, .preview-tool__controls .btn, móviles
      // .section__head .btn--secondary en ≤480px (L3816-3822): 2 líneas, min-height REAL 44px (no el token táctil
      // de 48px — excepción documentada en §1.1). Desactiva whitespace-nowrap/h-12 de la base/size.
      wrap: { true: "whitespace-normal h-auto min-h-11 max-w-full px-[18px] py-2.5" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);
export type SiteButtonProps = VariantProps<typeof siteButtonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

// asChild seleccionable, igual que el Button canónico de shadcn (usa <Slot> de @radix-ui/react-slot)
export function SiteButton({ variant, size, block, wrap, asChild, className, ...p }: SiteButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(siteButtonVariants({ variant, size, block, wrap }), className)} {...p} />;
}
```

Notas de implementación:

- La flecha es texto: `<SiteButton asChild><Link href="/proyectos">Ver proyectos →</Link></SiteButton>`. Si se prefiere icono, `<ArrowRight className="size-4" />` hereda el `gap-[.5em]`.
- `.product-card__cta` era un `<span class="btn">` dentro de un `<a>`: en React, `SiteButton` con `asChild` sobre un `span` o simplemente un `div` con `siteButtonVariants()` y `aria-hidden`.
- Los `translateY(-1px)` de hover y el `min-height:48px` obligan a `box-sizing:border-box` (Tailwind ya lo aplica).
- No copiar `--button-medium-height` ni `--brand-navy` (muertos).
- Regla general anti-`cva`+`tailwind-merge`: cuando `siteButtonVariants()` se combine con clases externas (p.ej. un `className` que pasa el consumidor), envolver el resultado con `cn()` (que en shadcn ya incluye `tailwind-merge`), como hace `cardBase` en §9.7.

### 9.5 Componente `Eyebrow`

```tsx
import type { ComponentPropsWithoutRef, ElementType } from "react";

// .section__eyebrow (L457): verde, 800, uppercase, .12em, .8rem, mb 8px. Variante "pill" = .hero__eyebrow / .sport-world .section__eyebrow.
export const eyebrowVariants = cva("block text-eyebrow uppercase font-extrabold tracking-eyebrow mb-2", {
  variants: {
    tone: {
      brand: "text-brand",
      onDark: "text-white/85",                             // home sobre .section--brand: style="color:#fff;opacity:.85"
      muted: "text-sub",                                   // .choose-card__eyebrow
      pill: "inline-block rounded-full bg-brand text-white px-3.5 py-1.5 text-xs mb-5",         // .hero__eyebrow
      pillSoft: "inline-block rounded-full bg-brand/10 text-brand-dark px-3.5 py-1.5 tracking-[.06em] mb-3.5", // .case-hero__eyebrow
      pillLime: "inline-block rounded-pill bg-brand-lime text-brand-navy px-3.5 py-1.5 text-[.74rem] tracking-caps mb-3.5", // .jobs-hero__eyebrow
      kicker: "inline-flex items-center gap-2.5 text-brand text-xs tracking-wide before:content-[''] before:w-7 before:h-0.5 before:bg-current", // .cine-hero__kicker
    },
  },
  defaultVariants: { tone: "brand" },
});

export type EyebrowProps = VariantProps<typeof eyebrowVariants> &
  ComponentPropsWithoutRef<"span"> & { as?: ElementType; children: React.ReactNode };

// children como prop directa (no composición): <Eyebrow tone="pill">Ver más</Eyebrow>
export function Eyebrow({ as: As = "span", tone, className, children, ...p }: EyebrowProps) {
  return <As className={cn(eyebrowVariants({ tone }), className)} {...p}>{children}</As>;
}
```

### 9.6 `SectionHead` y `Section`

```tsx
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// .section{padding:72px 0} → ≤560 48px ; .section--soft ; .section--brand ; .cta-band
// OJO cva: py-* fuera de la base (ver nota anti-tailwind-merge en §9.4) — `tight` como booleano con
// sus dos ramas explícitas, así nunca coexisten dos utilidades py-* del mismo eje en el string final.
const sectionVariants = cva("", {
  variants: {
    tone: {
      plain: "",
      soft: "bg-soft",
      brand: "bg-brand-gradient text-white [&_h2]:text-white [&_h3]:text-white",
      dark: "bg-brand-navy text-on-dark [&_h2]:text-white [&_h3]:text-white",
    },
    tight: {
      false: "py-section-sm sm:py-section",
      true: "py-section-tight sm:py-section-sm",
    },
  },
  defaultVariants: { tone: "plain", tight: false },
});

export type SectionProps = VariantProps<typeof sectionVariants> &
  ComponentPropsWithoutRef<"section"> & { as?: ElementType; children: ReactNode };

export function Section({ as: As = "section", tone, tight, className, children, ...p }: SectionProps) {
  return <As className={cn(sectionVariants({ tone, tight }), className)} {...p}>{children}</As>;
}

// .section__head{text-align:center;max-width:720px;margin:0 auto 48px}
export type SectionHeadProps = ComponentPropsWithoutRef<"div"> & { align?: "center" | "left" };

export function SectionHead({ align = "center", className, ...p }: SectionHeadProps) {
  return <div className={cn("max-w-head mb-head", align === "center" ? "mx-auto text-center" : "text-left", className)} {...p} />;
}
```

### 9.7 Card (patrón hover compartido)

```tsx
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// .product-card / .case-card / .blog-card / .feature: fondo #fff, borde 1px line, radio 12, transición .2s,
// hover: translateY(-4px) + shadow-card + border-brand; imagen interior scale(1.04) en .4s
export const cardBase = "bg-white border border-line rounded-lg overflow-hidden " +
  "transition-[transform,box-shadow,border-color] duration-200 ease-[ease] " +
  "hover:-translate-y-1 hover:shadow-card hover:border-brand " +
  "[&_img]:transition-transform [&_img]:duration-400 hover:[&_img]:scale-[1.04]";

export type CardProps = ComponentPropsWithoutRef<"div"> & { as?: ElementType; children: ReactNode };

// consumidor: <Card as="a" href="/productos/x">…</Card> (las cards-enlace del sitio son <a> completos)
export function Card({ as: As = "div", className, children, ...p }: CardProps) {
  return <As className={cn(cardBase, className)} {...p}>{children}</As>;
}
```

### 9.8 Reglas que **no** conviene trasladar tal cual

- El tilt 3D por `mousemove` (`main.js`) y el parallax de `.hero__bg` (`translateY(scrollY*0.25)`) escriben `style.transform` inline; en React van en un `useEffect` con `matchMedia('(pointer: coarse)')` y `prefers-reduced-motion`. `transform-style:preserve-3d` + `will-change:transform` en todas las cards es caro; limitarlo a las que lo usen.
- `html,body{overflow-x:hidden}` + `html{overflow-x:clip}`: en Next basta `html{overflow-x:clip}`.
- `.section,.container{max-width:100%}` es un parche; con `container` de Tailwind no hace falta.
- `!important` en los svg de `.section--brand .calc-card`: usar `currentColor` en los iconos.

---

## 10. Lo que no está en el código (para no inventarlo)

- `::selection`, scrollbars personalizadas, `:focus-visible` global, estados `:active`/`:disabled`/`:focus` de `.btn`, `h6`, `.btn--sm`, `.btn--icon`, modo oscuro (solo `document.documentElement.dataset.theme === 'dark'` en la escena 3D de `main.js`, sin CSS asociado), `@font-face` propio, `font-display` propio, `text-wrap:balance`, `hyphens` (solo `.lead-hero__text h1` ≤600), fluid type con `vw` en cuerpo (solo en títulos), `letter-spacing` en cuerpo, `prefers-color-scheme`.
