# 11. Inventario exhaustivo de clases y hooks — globotent.com

> Documento de referencia para dos lectores: **Claude Design** (arquitectura de componentes, para inspirar un diseño nuevo en Pavivasa) y **Claude Code** (implementación en Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Este archivo (11) es el **inventario crudo** que sustenta y debe poder verificar cualquier afirmación de los archivos 01–10: todo bloque, atributo `data-*`, estado y `id` documentado en aquellos debe aparecer aquí, y todo lo que aparece aquí y no se use en el diseño de Pavivasa debe poder descartarse conscientemente, no por omisión.

## 0. Metodología (léelo antes de usar las tablas)

**Fuentes:**
- `main.pretty.css` (6156 líneas, formateado, sin minificar) — parseado con un tokenizador de llaves en Python (`parse_css.py`) que respeta el anidamiento de `@media`/`@keyframes`/`@view-transition` (profundidad máx. 2 en todo el archivo) y produce 1315 reglas individuales.
- `site/**/*.html` (78 páginas, confirmadas contra `sitemap.xml` — exactamente 78 `<loc>`, así que el espejo es el sitio completo, no una muestra) — parseado con regex sobre `class="…"`/`class='…'` (el sitio mezcla comillas simples y dobles; ambas se capturan), `id="…"`, y `data-[a-z-]+(="…")?`, excluyendo el contenido de `<script>` y `<style>` para evitar falsos positivos (p. ej. `id=` dentro de fragmentos de JS inline de GTM).
- `main.js` (742 líneas, un único IIFE principal en `1–719` con dos IIFE anidadas — GTM/conversión en `633–643` y banner de mantenimiento en `706–718` — más una IIFE de vídeo de fondo `720–742` fuera de la principal) — leído línea a línea completo; ~34 bloques de funcionalidad consecutivos, sin nombres de módulo explícitos (no hay comentarios de sección), de ahí que este documento los numere por orden de aparición y por el selector con el que arrancan.

**Definición de "bloque BEM"** (para la Sección 1): el primer segmento del nombre de clase, cortando en el primer `__` o `--` que aparezca (lo que venga antes). Ej.: `product-card__title` → bloque `product-card`, elemento `title`; `btn--primary` → bloque `btn`, modificador `primary`; `site-nav__dropdown--wide` → bloque `site-nav`, elemento `dropdown`, con el modificador `wide` anotado como `dropdown (mod:wide)`.

**"Reglas CSS" por bloque**: nº de reglas (selectores compilados, no líneas) en las que aparece **alguna** clase de ese bloque — incluida como contexto descendente de otro bloque. Por eso una regla como `.sport-world .product-card__title{...}` cuenta tanto para `sport-world` como para `product-card`: es intencional, refleja que `sport-world` reescribe visualmente ese bloque.

**"Páginas" y "CSS muerto"**: nº de las 78 páginas del espejo cuyo HTML estático contiene al menos una clase de ese bloque. Un bloque en **0/78** significa que ninguna de las 78 páginas la usa — es candidato a CSS muerto **dentro de este espejo**. Antes de dar cada uno por muerto se verificó manualmente que la página "natural" para ese bloque (p. ej. `calculators.html` para `calc-*`, `pages/team.html` para `team-*`, `pages/reference-projects.html` para `case-*`/`dach-map`) existe pero contiene solo una versión *stub*: `page-hero` + un único `section` con `<p>` genéricos — es decir, el contenido rico que usaría ese bloque fue retirado de la página, no es que falte la página. Ver §6 para el detalle de qué páginas están así de "vaciadas". **No se puede confirmar** si esos bloques siguen vivos en el sitio en producción fuera de las 78 páginas de este espejo (p. ej. tras iniciar sesión, en una landing de pago no listada en el sitemap, etc.) — el dato es "muerto en el espejo", no "muerto en globotent.com".

**Columna "¿En main.js?"**: `sí` si el nombre exacto del bloque aparece en `main.js` como token independiente (delimitado por algo que no sea letra/dígito/guion a la izquierda, y algo que no sea letra/dígito a la derecha — así `hero` no marca falso positivo dentro de `page-hero`, `sp-hero`, `cine-hero`, `world-hero`, `lead-hero`). **Limitación conocida**: cuando el único vínculo de un bloque con JS es un atributo `data-<nombre-del-bloque>` (p. ej. bloque `before-after` ↔ `[data-before-after]`, bloque `filter-bar`/`filter-pill` ↔ `[data-filter-bar]`), el guion de `data-` rompe la coincidencia estricta y la columna marca `no` aunque **sí exista** un módulo JS operando sobre ese bloque — estos casos están todos cubiertos y correctamente atribuidos en la §2 (tabla de `data-*`), que es la fuente autorizada para hooks JS↔HTML.

---

## 1. Bloques BEM — inventario completo (212 bloques definidos en CSS, sin recortar)

Universo total de clases: **212 bloques definidos en `main.pretty.css`** (este apartado) **+ 8 clases usadas en el HTML sin ninguna regla CSS propia** (§1-bis, inmediatamente después de la tabla; una de esas 8, `hp-field`, constituye un bloque entero sin CSS — las otras 7 son elementos/modificadores sueltos de bloques que sí existen en CSS) — la tabla de abajo por sí sola no es todo el universo; léela junto con el §1-bis antes de dar un bloque por "no documentado en CSS".

212 bloques distintos definidos en `main.pretty.css` (contando también las clases de estado sin `__`/`--`, p. ej. `is-active`, que BEM-parseadas quedan como "bloque" propio sin elementos ni modificadores — se documentan también en la §3). De estos 212 **definidos en CSS**, **89 aparecen en al menos 1 de las 78 páginas** y **123 no aparecen en ninguna** (de los cuales 24 sí tienen algún módulo de `main.js` operando sobre ellos — "hooks vestigiales" — y 99 no tienen ni HTML ni JS que los toquen). Sumando el bloque solo-HTML `hp-field` (§1-bis, sin ninguna regla CSS), el universo total de bloques usados en el sitio es **90**, sobre 213 bloques nombrados en total (212 en CSS + 1 solo en HTML).

Catorce bloques son "chrome universal": aparecen en las 78/78 páginas porque forman el `<header>`/`<nav>`/`<footer>`/overlays comunes a toda plantilla: `site-header`, `site-nav`, `has-dropdown`, `mega-item`, `mega-link`, `lang-switch`, `flag`, `btn`, `burger`, `lightbox`, `wa-fab`, `exit-popup`, `site-footer`, `container`. `page-hero` está en 76/78 (falta en `index.html`, que usa `cine-hero`, y en `pages/sport.html`, que usa `sp-hero`). `section` está en 76/78 pero por un par de páginas distinto: falta en `pages/sport.html`, que usa `sp-section`, y en `pages/thank-you.html`, que no envuelve su contenido en ningún `.section` — no en `index.html`, que sí usa `.section` (6 apariciones, incl. `section--brand`, `section--soft`, `team-section`) para las secciones no-hero de la home. `breadcrumbs` está en 72/78 (faltan en `index.html`, `pages/sport.html`, `pages/thank-you.html` y las 3 páginas legales `legal-notice`/`privacy-policy`/`terms-and-conditions`).

| # | Bloque | Reglas CSS | Elementos (`__`) | Modificadores (`--`) | Páginas (n/78) | Detalle páginas | ¿En main.js? |
|---|---|---|---|---|---|---|---|
| 1 | `agro-feature` | 22 | `badge`, `eyebrow`, `grid`, `intro`, `logo`, `play`, `video` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 2 | `ar-cta` | 3 | `note` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 3 | `avail-banner` | 8 | `dot` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 4 | `bau-ampel` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 5 | `bau-info-box` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 6 | `bau-light` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 7 | `bau-verdict` | 6 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 8 | `before-after` | 16 | `after`, `handle`, `label`, `notice`; elem.+mod: `label (mod:after)`, `label (mod:before)` | — | 1/78 | `site/index.html` | sí |
| 9 | `blog-card` | 10 | `body`, `cta`, `media`, `meta` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 10 | `blog-grid` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 11 | `blog-meta` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 12 | `blog-related` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 13 | `blog-related-grid` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 14 | `breadcrumbs` | 6 | — | — | 72/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, … (72 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 15 | `btn` | 45 | — | `ghost-light`, `lg`, `lime`, `primary`, `secondary` | 78/78 | todas (78/78) | sí |
| 16 | `burger` | 15 | — | — | 78/78 | todas (78/78) | sí |
| 17 | `calc-card` | 25 | `cta`, `icon` | `lg` | 1/78 | `site/index.html` | sí |
| 18 | `calc-disclaimer` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 19 | `calc-grid` | 3 | — | — | 1/78 | `site/index.html` | no |
| 20 | `calc-layout` | 9 | `controls`, `viz` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 21 | `calc-result` | 8 | `main`, `meta`, `unit`, `value` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 22 | `calc-viz` | 8 | `canvas`, `hint`, `tab`, `tabs` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 23 | `case-block` | 7 | `label`; elem.+mod: `label (mod:blue)`, `label (mod:green)`, `label (mod:red)` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 24 | `case-body` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 25 | `case-card` | 14 | `body`, `cta`, `footer`, `hall`, `media`, `meta`, `teaser`, `title`, `year` | — | 1/78 | `site/index.html` | sí |
| 26 | `case-gallery` | 4 | `item` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 27 | `case-grid` | 3 | — | — | 1/78 | `site/index.html` | no |
| 28 | `case-hall-card` | 7 | `link` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 29 | `case-hero` | 8 | `eyebrow`, `media`, `role`, `teaser` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 30 | `case-quote` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 31 | `case-stat` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 32 | `case-stats` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 33 | `cat-chip` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 34 | `cat-chips` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 35 | `cert-grid` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 36 | `cert-item` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 37 | `chip` | 10 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 38 | `chip-select` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 39 | `choose-card` | 14 | `body`, `cta`, `eyebrow`, `media` | `sport` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 40 | `choose-cards` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 41 | `choose-hero` | 6 | `eyebrow`, `head`, `rating`, `sub`, `title` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 42 | `cine-hero` | 34 | `actions`, `bg`, `eyebrow`, `h1`, `inner`, `kicker`, `meta`, `rating`, `scrim`, `stage`, `sub`, `tabs` | — | 1/78 | `site/index.html` | no |
| 43 | `cine-tab` | 8 | `name`, `no` | — | 1/78 | `site/index.html` | no |
| 44 | `co2-calc` | 7 | `main`, `meta`, `result`, `unit`, `value` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 45 | `collection-card` | 9 | `label` | — | 4/78 | `site/index.html`, `site/pages/all-models.html`, `site/pages/calculators.html`, `site/pages/produkte.html` | sí |
| 46 | `collections` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 47 | `color-chip` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 48 | `color-picker` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 49 | `compare-img-wrap` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 50 | `compare-select` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 51 | `compare-slot` | 4 | `body` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 52 | `compare-slots` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 53 | `compare-specs` | 6 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 54 | `compare-tool` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 55 | `compare-type` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 56 | `consent-row` | 5 | — | — | 3/78 | `site/pages/3d-preview.html`, `site/pages/contact.html`, `site/pages/request-a-quote.html` | no |
| 57 | `contact-action` | 5 | `icon`, `label` | — | 1/78 | `site/pages/contact.html` | no |
| 58 | `contact-actions` | 1 | — | — | 1/78 | `site/pages/contact.html` | no |
| 59 | `contact-grid` | 3 | — | — | 1/78 | `site/pages/contact.html` | no |
| 60 | `container` | 6 | — | — | 78/78 | todas (78/78) | no |
| 61 | `cta-band` | 13 | — | — | 47/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, … (47 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 62 | `dach-map` | 13 | `marker`, `pin`, `popup`; elem.+mod: `pin (mod:anon)`, `pin (mod:ref)` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 63 | `disclaimer` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 64 | `download-card` | 4 | `icon` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 65 | `download-grid` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 66 | `exit-popup` | 13 | `actions`, `backdrop`, `box`, `close`, `icon` | — | 78/78 | todas (78/78) | sí |
| 67 | `fade-up` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 68 | `faq-item` | 7 | — | — | 1/78 | `site/pages/faq.html` | no |
| 69 | `faq-list` | 1 | — | — | 1/78 | `site/pages/faq.html` | no |
| 70 | `feature` | 16 | `icon`, `more` | — | 1/78 | `site/index.html` | sí |
| 71 | `features` | 3 | — | — | 1/78 | `site/index.html` | no |
| 72 | `field` | 13 | `hint` | — | 4/78 | `site/pages/3d-preview.html`, `site/pages/contact.html`, `site/pages/downloads.html`, `site/pages/request-a-quote.html` | no |
| 73 | `field-row` | 4 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 74 | `filter-bar` | 9 | `count`, `label`, `pills` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 75 | `filter-pill` | 6 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 76 | `fine-print` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 77 | `flag` | 8 | — | `at`, `de`, `es`, `gb`, `pt` | 78/78 | todas (78/78) | no |
| 78 | `form-expand-btn` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 79 | `form-field` | 5 | `helper`, `label-row` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 80 | `form-grid` | 5 | — | — | 4/78 | `site/pages/3d-preview.html`, `site/pages/contact.html`, `site/pages/downloads.html`, `site/pages/request-a-quote.html` | sí |
| 81 | `form-narrow` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 82 | `form-trust` | 1 | — | — | 3/78 | `site/pages/3d-preview.html`, `site/pages/downloads.html`, `site/pages/request-a-quote.html` | no |
| 83 | `full` | 1 | — | — | 1/78 | `site/pages/request-a-quote.html` | sí |
| 84 | `gallery` | 12 | `main`, `thumb`, `thumbs` | — | 36/78 | `site/products/fabric-building-10x15.html`, `site/products/fabric-building-10x18.html`, `site/products/fabric-building-10x21.html`, `site/products/fabric-building-10x24.html`, … (36 páginas — ver §5 (página → bloques) para el detalle completo) | sí |
| 85 | `glossary-entry` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 86 | `glossary-list` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 87 | `glossary-nav` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 88 | `has-dropdown` | 10 | — | — | 78/78 | todas (78/78) | sí |
| 89 | `helper-text` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 90 | `hero` | 41 | `bg`, `ctas`, `dot`, `dots`, `eyebrow`, `h1`, `inner`, `proof`, `slide`, `sports-lockup`, `sports-logo`, `sub`, `video`; elem.+mod: `bg (mod:slide)`, `bg (mod:sports)`, `eyebrow (mod:sports)`, `h1 (mod:sports)`, `slide (mod:sports)` | `slider` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 91 | `heu-animal` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 92 | `heu-animal-grid` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 93 | `home-montage` | 6 | `bg`, `inner`, `overlay` | — | 1/78 | `site/index.html` | no |
| 94 | `how-step` | 4 | `num` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 95 | `how-steps` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 96 | `is-active` | 27 | — | — | 1/78 | `site/index.html` | sí |
| 97 | `is-done` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 98 | `is-hidden` | 1 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3, sobre `.wa-fab`, chrome universal) | sí |
| 99 | `is-hiding` | 1 | — | — | 0/78 | 0/78 en HTML estático — el token existe en `main.js` (`714`) pero su módulo (`#maint-banner`) no encuentra elemento raíz en ninguna página (ver §3): **no llega a aplicarse en runtime**, a diferencia de las demás filas `is-*` de esta tabla | sí |
| 100 | `is-open` | 15 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3: menú móvil, selector de idioma y mega-menú, los tres sobre chrome universal) | sí |
| 101 | `is-over` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 102 | `is-product-detail` | 1 | — | — | 36/78 | `site/products/fabric-building-10x15.html`, `site/products/fabric-building-10x18.html`, `site/products/fabric-building-10x21.html`, `site/products/fabric-building-10x24.html`, … (36 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 103 | `is-scrolled` | 1 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3, sobre `.site-header`, chrome universal) | sí |
| 104 | `is-selected` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 105 | `is-sport` | 4 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3, sobre `.cine-hero` en `site/index.html`) | sí |
| 106 | `is-swap` | 2 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3, sobre `<h1>`/`.sub` del `cine-hero` en `site/index.html`) | sí |
| 107 | `is-visible` | 3 | — | — | 0/78 | 0/78 en HTML estático — **aplicada por JS en runtime** (ver §3, `IntersectionObserver` sobre los mismos elementos que `.reveal`) | sí |
| 108 | `job-col` | 7 | `dot` | `offer` | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 109 | `job-cols` | 2 | — | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 110 | `job-meta` | 7 | `item`, `k`, `v` | `detail` | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 111 | `job-other` | 6 | `ico` | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | sí |
| 112 | `job-others` | 2 | — | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 113 | `jobcard` | 14 | `gender`, `ico`, `link`, `tag`, `teaser`, `title`, `top` | — | 1/78 | `site/pages/jobs.html` | sí |
| 114 | `jobcard-meta` | 3 | `chip`; elem.+mod: `chip (mod:salary)` | — | 1/78 | `site/pages/jobs.html` | no |
| 115 | `jobdetail` | 4 | `intro` | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 116 | `jobdetail-apply` | 5 | — | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 117 | `jobdetail-back` | 2 | — | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 118 | `jobdetail-hero` | 2 | `gender` | — | 3/78 | `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 119 | `jobdetail-salary` | 5 | `amount`, `ico`, `label`, `note` | — | 1/78 | `site/pages/jobs/studentische-assistenz.html` | no |
| 120 | `jobs-grid` | 2 | — | — | 1/78 | `site/pages/jobs.html` | no |
| 121 | `jobs-hero` | 6 | `count`, `cta`, `eyebrow` | — | 4/78 | `site/pages/jobs.html`, `site/pages/jobs/freiberuflicher-ingenieur.html`, `site/pages/jobs/sdr-sales.html`, `site/pages/jobs/studentische-assistenz.html` | no |
| 122 | `jobs-value` | 5 | `ico` | — | 1/78 | `site/pages/jobs.html` | no |
| 123 | `jobs-values` | 2 | — | — | 1/78 | `site/pages/jobs.html` | no |
| 124 | `kategorien` | 5 | — | `center` | 4/78 | `site/index.html`, `site/pages/all-models.html`, `site/pages/calculators.html`, `site/pages/produkte.html` | no |
| 125 | `kf-color-dot` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 126 | `kf-spec-row` | 4 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 127 | `kf-specs` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 128 | `lang-switch` | 19 | `current`, `flag`, `label`, `menu` | — | 78/78 | todas (78/78) | sí |
| 129 | `lead-arrow` | 7 | — | `next`, `prev` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 130 | `lead-dot` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 131 | `lead-hero` | 13 | `eyebrow`, `grid`, `rating`, `text`, `tiles` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 132 | `lead-slide` | 7 | `label` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 133 | `lead-tile` | 15 | `dots`, `logo`, `world` | `sport` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 134 | `lightbox` | 14 | `close`, `counter`, `img`, `nav`; elem.+mod: `nav (mod:next)`, `nav (mod:prev)` | — | 78/78 | todas (78/78) | sí |
| 135 | `m-check` | 5 | `icon`, `label`, `row`, `value` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 136 | `m-list` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 137 | `m-preset` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 138 | `m-row` | 9 | `dims`, `head`, `num`, `remove` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 139 | `maint-banner` | 7 | `txt`, `x` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 140 | `mega-item` | 10 | — | — | 78/78 | todas (78/78) | no |
| 141 | `mega-link` | 2 | — | — | 78/78 | todas (78/78) | no |
| 142 | `mobile-sticky-cta` | 7 | `call` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 143 | `padel-badge` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 144 | `padel-detail` | 1 | `grid` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 145 | `padel-h1` | 3 | `sub` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 146 | `padel-hero` | 1 | `inner` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 147 | `padel-promo` | 11 | `eyebrow` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 148 | `padel-size-layout` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 149 | `padel-sizes` | 15 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 150 | `padel-sizes-wrap` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 151 | `page-hero` | 11 | `bg`, `inner` | `blog`, `calc`, `padel` | 76/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, … (76 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 152 | `photo-gallery` | 8 | `caption` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 153 | `press-item` | 2 | — | — | 1/78 | `site/index.html` | sí |
| 154 | `press-strip` | 11 | `label`, `logos` | — | 1/78 | `site/index.html` | no |
| 155 | `preview-tool` | 15 | `controls`, `dropzone`, `dropzone-inner`, `hint`, `stage` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 156 | `product-card` | 25 | `badge`, `badges`, `body`, `cta`, `eyebrow`, `media`, `meta`, `price`, `title`; elem.+mod: `badge (mod:alt)`, `price (mod:quote)` | — | 43/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, … (43 páginas — ver §5 (página → bloques) para el detalle completo) | sí |
| 157 | `product-detail` | 3 | — | — | 36/78 | `site/products/fabric-building-10x15.html`, `site/products/fabric-building-10x18.html`, `site/products/fabric-building-10x21.html`, `site/products/fabric-building-10x24.html`, … (36 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 158 | `product-grid` | 4 | — | — | 7/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, `site/categories/storage-tents.html`, `site/index.html`, `site/pages/sport.html` | no |
| 159 | `product-info` | 18 | `actions`, `eyebrow`, `features`, `meta`, `price`, `stat`, `stats`; elem.+mod: `price (mod:quote)` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 160 | `prose` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 161 | `prose-block` | 5 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 162 | `quiz` | 24 | `icon`, `options`, `progress`, `progress-bar`, `restart`, `result`, `result-body`, `result-eyebrow`, `result-media`, `step`, `step-count` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 163 | `rating-badge` | 11 | `text` | `compact` | 1/78 | `site/index.html` | no |
| 164 | `rating-dist` | 4 | `bar`, `row` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 165 | `rating-summary` | 6 | `dist`, `number`, `score`, `total` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 166 | `rb-alt-card` | 4 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 167 | `rb-alternatives` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 168 | `rb-mode-tab` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 169 | `rb-mode-tabs` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 170 | `reveal` | 3 | — | — | 1/78 | `site/pages/jobs.html` | sí |
| 171 | `review` | 8 | `date`, `hall`, `head`, `meta`, `text` | — | 2/78 | `site/index.html`, `site/pages/customer-reviews.html` | sí |
| 172 | `reviews-grid` | 3 | — | — | 2/78 | `site/index.html`, `site/pages/customer-reviews.html` | no |
| 173 | `reviews-head` | 3 | — | — | 1/78 | `site/index.html` | no |
| 174 | `section` | 35 | `eyebrow`, `head` | `brand`, `dark`, `soft`, `tight` | 76/78 | `site/categories/fabric-buildings.html`, `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, … (76 páginas — ver §5 (página → bloques) para el detalle completo) | sí |
| 175 | `site-footer` | 19 | `bottom`, `disclaimer`, `grid`, `logo` | — | 78/78 | todas (78/78) | sí |
| 176 | `site-header` | 17 | `bar`, `cta`, `logo`, `phone` | — | 78/78 | todas (78/78) | sí |
| 177 | `site-nav` | 60 | `chev`, `dd-head`, `dropdown`, `group`, `main`, `mega`, `mega-col`, `mega-head`, `mega-tools`, `sports`; elem.+mod: `dropdown (mod:wide)`, `mega-col (mod:sport)` | — | 78/78 | todas (78/78) | sí |
| 178 | `sp-claim` | 3 | — | — | 1/78 | `site/pages/sport.html` | no |
| 179 | `sp-cta` | 8 | `btns` | — | 1/78 | `site/pages/sport.html` | no |
| 180 | `sp-disc` | 10 | `body`, `cta`, `media` | — | 1/78 | `site/pages/sport.html` | no |
| 181 | `sp-disciplines` | 3 | — | — | 1/78 | `site/pages/sport.html` | no |
| 182 | `sp-head` | 5 | `eyebrow` | — | 1/78 | `site/pages/sport.html` | no |
| 183 | `sp-hero` | 10 | `bg`, `ctas`, `h1`, `inner`, `lockup`, `sub` | — | 1/78 | `site/pages/sport.html` | no |
| 184 | `sp-section` | 6 | — | `specs` | 1/78 | `site/pages/sport.html` | no |
| 185 | `sp-spec` | 9 | `lbl`, `num` | — | 1/78 | `site/pages/sport.html` | no |
| 186 | `sp-specs` | 3 | — | — | 1/78 | `site/pages/sport.html` | no |
| 187 | `sp-video` | 7 | `inner`, `media`, `overlay` | — | 1/78 | `site/pages/sport.html` | no |
| 188 | `splash` | 5 | `bar`, `bar-fill`, `logo` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 189 | `sport-world` | 67 | — | — | 16/78 | `site/categories/padel-tennis-covers.html`, `site/categories/pickleball.html`, `site/categories/riding-arena-covers.html`, `site/index.html`, … (16 páginas — ver §5 (página → bloques) para el detalle completo) | no |
| 190 | `sr-only` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 191 | `star` | 1 | — | — | 2/78 | `site/index.html`, `site/pages/customer-reviews.html` | no |
| 192 | `stars` | 2 | — | — | 2/78 | `site/index.html`, `site/pages/customer-reviews.html` | no |
| 193 | `step-card` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 194 | `step-grid` | 1 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 195 | `team-card` | 8 | `media`, `region`, `role` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 196 | `team-grid` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 197 | `team-section` | 2 | — | — | 1/78 | `site/index.html` | no |
| 198 | `team-wall` | 9 | `item` | — | 1/78 | `site/index.html` | sí |
| 199 | `testimonial` | 6 | `author`, `quote` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 200 | `testimonials` | 2 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 201 | `three-d-cta` | 5 | `text`, `visual` | — | 1/78 | `site/index.html` | sí |
| 202 | `threed-viewer` | 4 | `canvas`, `controls` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 203 | `timeline` | 9 | `body` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 204 | `toggle-row` | 2 | — | — | 1/78 | `site/pages/downloads.html` | no |
| 205 | `trust-bar` | 4 | `grid` | — | 1/78 | `site/index.html` | no |
| 206 | `trust-item` | 3 | — | — | 1/78 | `site/index.html` | no |
| 207 | `video-testi` | 10 | `body`, `duration`, `media`, `play` | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | sí |
| 208 | `video-testi-grid` | 3 | — | — | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 209 | `wa-fab` | 9 | — | — | 78/78 | todas (78/78) | sí |
| 210 | `world-block` | 14 | `head`, `link`, `sport-logo` | `sport` | 2/78 | `site/index.html`, `site/pages/produkte.html` | no |
| 211 | `world-hero` | 28 | `badge`, `eyebrow`, `intro`, `rating`, `split` | `split` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |
| 212 | `world-panel` | 32 | `bg`, `eyebrow`, `h2`, `inner`, `lockup`, `logo`; elem.+mod: `h2 (mod:sport)` | `industrie`, `sport` | 0/78 | **ninguna — no aparece en las 78 páginas del espejo** | no |

### 1-bis. Clases usadas en el HTML sin regla CSS propia

Diferencia de conjuntos entre las clases que aparecen en `class="…"`/`class='…'` de las 78 páginas (254 clases distintas) y las clases que tienen al menos una regla en `main.pretty.css` (542 clases distintas): **8 clases** están en el HTML pero no en el CSS. Ninguna es un bug de parseo — se verificó cada una contra el HTML y el CSS fuente (líneas citadas):

| Clase HTML sin regla propia | Páginas (n/78) | Contexto | Veredicto |
|---|---|---|---|
| `hp-field` (bloque entero, 0 reglas CSS) | 4 — `pages/request-a-quote.html`, `pages/downloads.html`, `pages/contact.html`, `pages/3d-preview.html` | `<p class="hp-field" hidden><label>Do not fill in: <input name="bot-field"></label></p>` — campo *honeypot* anti-spam en los 4 formularios del sitio | **Benigno**: oculto por el atributo HTML `hidden`, no necesita CSS |
| `gallery` (bloque, bare, sin `__`/`--`) | 36 — todas las páginas `site/products/*.html` | `<div class="product-detail"><div class="gallery"><div class="gallery__main">…` — el wrapper no tiene regla propia, solo sus hijos (`.gallery__main`, `.gallery__thumb`, `.gallery__thumbs`, `main.pretty.css` bloque `gallery`, 12 reglas) | **Benigno**: el layout lo dan los hijos; comprobado además que **ninguna de las 36 páginas tiene `.gallery__thumb`** — el wrapper solo envuelve una única `<picture>` en todos los casos, nunca una tira de miniaturas (refuerza §2, módulos `#13`/`#27`: el hook JS de galería no tiene ni el atributo ni el contenido que necesitaría) |
| `jobdetail-hero` (bloque, bare) | 3 — las 3 páginas `pages/jobs/*.html` | `<section class="page-hero jobdetail-hero">` — combinado con `page-hero`; CSS solo define `.jobdetail-hero__gender` (`main.pretty.css:5629,5803`), nunca `.jobdetail-hero{}` a secas | **Benigno**: `jobdetail-hero` actúa de namespace para escopar su único hijo con regla propia; el aspecto de la sección lo da `page-hero` |
| `before-after__before` | 1 — `site/index.html:381` | `<img … class="before-after__before">`, hermano de `.before-after__after` | **Benigno**: CSS estiliza `.before-after img{}` (`main.pretty.css:2820`) con selector de etiqueta, no de clase — cubre la imagen "before" sin necesitar una regla `__before` dedicada |
| `case-card__loc` | 1 (con 3 usos) — `site/index.html:434,443,452` | `<span class="case-card__loc">📍 Lower Austria</span>` dentro de `.case-card__meta` | **Hueco real, menor**: `.case-card__meta{}` existe (`main.pretty.css:2110`, `display:flex` presumible) pero no hay `.case-card__loc{}` propia — el `<span>` hereda el flex del padre sin espaciado/color propio. Bloque `case-card` en sí está solo en 1/78 páginas (`site/index.html`, ver §1) — no es un bloque con uso extendido en el espejo |
| `product-detail__info` | 36 — todas `site/products/*.html` | `<div class="product-detail"><div class="gallery">…</div><div class="product-detail__info">…</div></div>` | **Hueco real**: `.product-detail{}` existe (`main.pretty.css:638,924`, define el grid 2 columnas) pero **no hay ninguna regla `.product-detail__info{}`**; el contenido interior (`product-card__badges`, texto, botones) se apoya en estilos de otros bloques y en `style=""` inline (ver ejemplo `site/products/fabric-building-8x12.html:141-150`) |
| `mega-link--sport` | 78 — todas (es el enlace "To the sports world →" del mega-menú de navegación, presente en el `<header>` común a toda plantilla) | `<a class='mega-link mega-link--sport' href='/pages/sport'>…</a>` | **Modificador muerto**: CSS solo define `.site-nav__mega .mega-link{}` y `:hover` (`main.pretty.css:4605,4613`); no existe `.mega-link--sport{}` en ningún punto del archivo — el modificador no tiene ningún efecto visual |
| `site-nav__group--mega` | 78 — todas | `<div class="site-nav__group has-dropdown site-nav__group--mega">` | **Modificador muerto**: todas las reglas de `main.pretty.css` que tocan `.site-nav__group` usan `.site-nav__group.has-dropdown` (10 reglas; 12 si se cuenta cada selector separado por coma, ya que dos de esas reglas repiten el selector compuesto dos veces); `--mega` no aparece en ninguna regla — el efecto de mega-menú lo da por completo `.site-nav__mega`/`.site-nav__mega-col` (ver §1, bloque `site-nav`), no este modificador |

**Para Pavivasa**: los dos "modificadores muertos" (`mega-link--sport`, `site-nav__group--mega`) son la señal más clara de que el mega-menú con columna deportiva se construyó primero con una convención de modificador y luego se resolvió con clases de bloque dedicadas (`site-nav__mega-col--sport`, que sí tiene reglas) sin limpiar el modificador original del HTML — no replicar ese resto al diseñar el nuevo menú.
## 2. Atributos `data-*` — inventario completo (49 distintos)

`main.js` referencia **41** atributos `data-*` como literal de cadena (selector `[data-x]` o `getAttribute('data-x')`) más **8** adicionales vía la API `.dataset` (que traduce `el.dataset.miProp` ↔ atributo `data-mi-prop`) — total **49**. De estos, solo **19** aparecen realmente en el HTML estático de alguna de las 78 páginas (columna "Páginas"); el resto son hooks que el JS instala (`querySelector`/`querySelectorAll`) pero para los que ninguna página del espejo tiene el atributo correspondiente — el `if (elemento)` correspondiente en `main.js` simplemente no se ejecuta nunca (falla el guard, módulo silenciosamente inactivo). Están marcados **"— (0 páginas)"**.

Módulos identificados en `main.js` por orden de aparición (no hay comentarios de sección en el archivo; los nombres de módulo son descriptivos, no literales del código):

| # | Módulo (líneas) | Atributo(s) `data-*` | Consumidor JS (función/selector) | Páginas HTML (de 78) | Notas |
|---|---|---|---|---|---|
| 1 | Reveal-on-scroll (`3–15`) | — | `IntersectionObserver` sobre lista fija de selectores de clase (ver §3, `.reveal`) | n/a | No usa `data-*`, usa clases |
| 2 | Tilt 3D en hover (`16–26`) | — | `mousemove` en `.product-card, .case-card, .calc-card, .blog-card` | n/a | Solo `style.transform` inline, sin clase ni atributo |
| 3 | Parallax de `.hero__bg` (`27–33`) | — | `window.addEventListener('scroll', …)` sobre `.hero__bg` | 0 (bloque `hero` no usado, ver §1) | Módulo inactivo en las 78 páginas |
| 4 | Hero slider (`34–63`) | `data-hero-slider`, `data-hero-slide`, `data-hero-bg`, `data-hero-dot` | `document.querySelector('[data-hero-slider]')` | 0 | Inactivo en el espejo (la home usa el módulo 5, no este) |
| 5 | Cine-hero tabs — home (`64–99`) | `data-cine-hero`, `data-cine-bg`, `data-cine-tab`, `data-cine-h1`, `data-cine-sub`, `data-cine-eyebrow`, `data-cine-cta`, y en cada `<button data-cine-tab>`: `data-h1`, `data-sub`, `data-eyebrow`, `data-cta`, `data-href`, `data-world` | `document.querySelectorAll('[data-cine-hero]')`; lee los `data-*` del tab activo y reescribe `textContent`/`href` del H1/sub/eyebrow/CTA del hero | `site/index.html` (único uso, línea 141 de `home.html`: 4 botones `data-cine-tab` con esos 6 atributos cada uno) | Único carrusel de héroe realmente activo del sitio |
| 6 | View Transitions API (`100–117`) | — | Feature-detect `document.startViewTransition`, intercepta clicks en enlaces internos | n/a | Sin `data-*`; envuelve toda navegación interna del sitio |
| 7 | Contador "en vivo" (falso) (`118–137`) | `data-live-counter` | `document.querySelector('[data-live-counter]')` | 0 | Prueba social simulada (incrementa un nº con `setInterval`), sin elemento en el espejo |
| 8 | Widget de carga de nieve por geolocalización (`138–163`) | `data-weather-loc` (+ `id="weather-snow"`, ver §4) | `document.getElementById('weather-snow')` + `document.querySelector('[data-weather-loc]')`, `navigator.geolocation` | 0 | `#weather-snow` no existe en ninguna de las 78 páginas — módulo inactivo |
| 9 | Fallback de vídeo de héroe (`164–170`) | `data-hero-video` | `document.querySelector('[data-hero-video]')` | 0 | — |
| 10 | Formulario progresivo (2 pasos) (`171–186`) | `data-form-expand` | `document.querySelectorAll('[data-form-expand]')`, busca `.form-stage-2` en el `<form>` ancestro | 0 | `.form-stage-2` tampoco existe en ningún formulario del espejo (`3d-preview.html`, `request-a-quote.html`, `downloads.html`, `contact.html`) |
| 11 | Header al hacer scroll (`187–193`) | — | `.site-header` → ver `.is-scrolled` en §3 | n/a | — |
| 12 | Menú móvil / burger (`194–222`) | — | `.burger` + `.site-nav` → ver `.is-open` en §3 | n/a | — |
| 13 | Galería simple — versión 1 (`223–236`) | `data-gallery-main`, `data-gallery-thumb` (+ `data-src` en cada thumb) | `document.querySelector('[data-gallery-main] img')` | 0 | — |
| 14 | Selector de idioma (`237–251`) | — | `.lang-switch` / `.lang-switch__current` → ver `.is-open` en §3 | n/a | — |
| 15 | Scroll suave a anclas (`252–263`) | — | `a[href^="#"]` | n/a | offset fijo `-90px` (altura del header fijo) |
| 16 | Mega-menú desplegable (`264–285`) | — | `.site-nav__group.has-dropdown > .site-nav__main` → ver `.is-open` en §3 | n/a | Solo activo en móvil/touch (`isMobile()` gate) |
| 17 | Lightbox (`286–344`) | `data-lightbox` (contenedor), `data-gallery-thumb`+`data-src` (fuente de imágenes), `data-photo-gallery`+`data-lightbox-trigger` (fuente alternativa) | `document.querySelector('[data-lightbox]')` | `data-lightbox`: **78/78** (el contenedor `<div class="lightbox" data-lightbox hidden>` se inyecta en el footer/plantilla común de las 78 páginas); `data-gallery-thumb`, `data-photo-gallery`, `data-lightbox-trigger`: **0/78** | El contenedor existe en todas las páginas pero **nada lo dispara**: no hay ninguna miniatura (`data-gallery-thumb`) ni disparador (`data-lightbox-trigger`) en el HTML estático del espejo. Módulo de apertura inactivo en las 78 páginas, aunque el markup del propio lightbox sí se renderiza siempre (13 reglas CSS del bloque `lightbox` cargan en toda página) |
| 18 | Popup de salida ("exit intent") (`345–368`) | `data-exit-popup` (raíz), `data-exit-close` (botones) | `document.querySelector('[data-exit-popup]')`, gate: no-touch + `sessionStorage` + `min-width:901px` | `data-exit-popup`: **78/78**; `data-exit-close`: **78/78** | Único popup realmente activo del sitio; se muestra 1 vez por sesión (`sessionStorage.globotent_exit_shown`) al detectar el ratón saliendo por arriba del viewport |
| 19 | Ocultar FAB de WhatsApp cerca del footer (`370–376`) | — | `.wa-fab` + `.site-footer`, `IntersectionObserver` → ver `.is-hidden` en §3 | n/a | `.wa-fab` sí está en 78/78 páginas |
| 20 | Banner de disponibilidad falsa ("urgencia") (`377–386`) | `data-avail` (+ `id="avail-slots"`, `id="avail-recent"`, ver §4) | `document.querySelector('[data-avail]')` | 0 | Genera texto pseudo-aleatorio determinista a partir del hash del pathname. Inactivo: ninguno de los 3 hooks (`data-avail`, `#avail-slots`, `#avail-recent`) existe en el espejo |
| 21 | Comparador antes/después (slider de imagen) (`387–407`) | `data-before-after` | `document.querySelectorAll('[data-before-after]')`, busca `.before-after__handle` y `.before-after__after` dentro | `site/index.html` (**1/78**) | Único uso: sección de la home (bloque CSS `before-after`, 16 reglas) |
| 22 | Visor 3D de nave (Three.js, CDN unpkg) (`408–516`) | `data-hall-w`, `data-hall-l`, `data-hall-h`, `data-hall-type` (vía `.dataset`, vía `threedRoot.dataset.hallW` etc.), `data-theme` (vía `document.documentElement.dataset.theme`), `data-color` (vía `btn.dataset.color` en `.threed-viewer__controls .chip`) | `document.querySelector('.threed-viewer')` | 0 | Carga perezosa (`IntersectionObserver`, `rootMargin:200px`) de `three@0.158.0` + `OrbitControls` desde `unpkg.com`. Inactivo: bloque `threed-viewer` en 0/78 páginas (ver `pages/3d-preview.html`, que en el espejo es un formulario de contacto, no el visor) |
| 23 | Botón AR / `<model-viewer>` (`517–551`) | `data-ar-btn`, `data-ar-viewer` | `document.querySelector('[data-ar-btn]')` | 0 | Carga perezosa de `model-viewer@3.4.0` desde `ajax.googleapis.com` |
| 24 | Reproducir vídeo de testimonio (`552–558`) | `data-video-src` (vía `btn.dataset.videoSrc`) | `document.querySelectorAll('.video-testi__play')` | 0 | Bloque `video-testi` en 0/78 |
| 25 | Registro de Service Worker (`559–561`) | — | `navigator.serviceWorker.register('/sw.js')` | n/a | `/sw.js` no está en el espejo descargado (no se verificó su existencia real) |
| 26 | Prefill del formulario de presupuesto (`562–578`) | — | `window.location.pathname.endsWith('request-for-quote.html')` | **0 — módulo muerto por diseño** | **Bug/legado confirmado**: la página real es `pages/request-a-quote.html` (con **a**), el guard compara contra `'request-for-quote.html'` (con **for**) — el `if` nunca es verdadero en ninguna URL real del sitio. La función `ecUserData()` (línea 618) que se define más abajo tampoco se llama nunca desde ningún sitio del archivo — código muerto confirmado por ausencia total de invocación |
| 27 | Galería — swipe táctil, versión 2 (`579–598`) | `data-gallery-main`, `data-gallery-thumb`, `data-src` | Igual que módulo 13 pero con lógica de `touchstart`/`touchend` | 0 | Segunda implementación redundante del mismo hook que el módulo 13 (duplicación, no fusionadas) |
| 28 | Helpers de tracking / dataLayer (`599–632`) | — | `dlPush`, `genEventId`, `getCookie`, `fbcFromUrl`, `addHidden`, `ecUserData` | n/a | Funciones auxiliares para GTM/Meta CAPI |
| 29 | Inyección de campos ocultos en formularios Netlify (`633–643`, IIFE anidada) | `data-netlify` | `document.querySelectorAll('form[data-netlify]')` | 0 | Ninguno de los 4 `<form>` del espejo (`3d-preview`, `request-a-quote`, `downloads`, `contact`) tiene el atributo `data-netlify` ni `netlify` — módulo inactivo |
| 30 | Tracking de clics salientes (WhatsApp/tel/mailto) (`645–651`) | — | Delegación de click a nivel `document`, regex sobre `href` | n/a | — |
| 31 | Carrusel "lead slider" (`653–680`) | `data-lead-slider` | `document.querySelectorAll('[data-lead-slider]')`, hijos `.lead-slide`/`.lead-dot` | 0 | Genera dinámicamente botones `.lead-arrow.lead-arrow--prev`/`.lead-arrow.lead-arrow--next` vía `document.createElement` — estas clases **nunca existen en el HTML estático**, solo las crea este módulo en tiempo de ejecución, y solo si encuentra un `[data-lead-slider]` (que no existe en el espejo) |
| 32 | Barra de filtro por anchura — `sport.html` (`681–705`) | `data-filter-bar`, `data-filter-grid` (hermano), `data-filter-count`, y `data-w` en cada `.product-card`/`.filter-pill` | `document.querySelectorAll('[data-filter-bar]')` | `data-w`: `site/pages/sport.html` (**1/78**, en 10 `.product-card`, las 10 tarjetas de la página); `data-filter-bar`/`data-filter-grid`/`data-filter-count`: **0/78** | El atributo `data-w` sí está en el HTML (ver `product-card` en `sport.html`; 9 con valor numérico y 1, `/products/padel-tennis-cover`, con `data-w` sin valor asignado) pero **la barra de filtro (`data-filter-bar`) que lo consumiría no existe** — atributo huérfano, sin efecto visible |
| 33 | Banner de mantenimiento (`706–718`, IIFE anidada) | `data-maint-time` (+ `id="maint-banner"`, ver §4) | `document.getElementById('maint-banner')` | 0 | Auto-dismiss a los 14s, recuerda cierre en `sessionStorage.maint-dismissed`. Inactivo: `#maint-banner` no existe en el espejo |
| 34 | Vídeo de fondo con carga perezosa (`720–742`, IIFE final) | `data-bg-video`, `data-loaded` (vía `.dataset.loaded`) | `document.querySelector('video[data-bg-video]')` | `site/index.html` (**1/78**) | Respeta `prefers-reduced-motion` y `navigator.connection.saveData` |

**Resumen** (34 módulos, numerados como en la tabla), en tres grupos:

- **12 módulos no dependen de ningún `data-*`/`id` opcional** — operan sobre clases/selectores que existen siempre en la plantilla común, así que su código se ejecuta en las 78 páginas (su efecto visual puede variar según cuántos elementos de esa clase haya en cada página, pero el módulo arranca): `#1` reveal-on-scroll, `#2` tilt 3D, `#6` view transitions, `#11` header-scroll, `#12` burger, `#14` lang-switch, `#15` smooth-scroll, `#16` mega-dropdown, `#19` wa-fab-hide, `#25` registro de service worker (incondicional, solo comprueba `'serviceWorker' in navigator` y `location.protocol`), `#28` helpers de tracking, `#30` tracking de clics salientes.
- **5 módulos dependen de un `data-*`/`id` específico y sí lo encuentran** en al menos 1 de las 78 páginas: `#5` cine-hero (`site/index.html`), `#18` exit-popup (78/78), `#21` before-after (`site/index.html`), `#34` bg-video (`site/index.html`), y `#17` lightbox — con matiz: su contenedor (`[data-lightbox]`) está en 78/78 y el `if(lightbox)` de la línea `287` sí se cumple siempre (se atan los listeners de teclado/cierre/flechas), pero las dos fuentes de imágenes que alimentarían el visor (`[data-gallery-thumb]` y `[data-photo-gallery]`) no existen en ninguna página, así que `srcList` queda vacío y abrir el lightbox no tiene ningún efecto visible en el espejo — **módulo "atado" pero sin datos que mostrar**, no completamente inerte como los del tercer grupo.
- **17 módulos no encuentran su elemento raíz en ninguna de las 78 páginas** y por tanto no llegan a ejecutar su lógica interna: `#3` hero parallax, `#4` hero-slider clásico, `#7` contador en vivo, `#8` clima/nieve, `#9` vídeo-hero-fallback, `#10` form-expand, `#13` y `#27` galería (dos implementaciones redundantes del mismo hook, ambas inactivas — confirmado además que **ninguna de las 36 páginas de producto con bloque `gallery` tiene más de 1 imagen**: todas usan solo `.gallery__main` con una única `<picture>`, sin `.gallery__thumb` ni `data-gallery-*`, así que el hook no solo está desconectado del DOM sino que tampoco habría contenido que mostrar aunque lo estuviera), `#20` avail-banner, `#22` visor 3D, `#23` AR, `#24` video-testi, `#26` prefill de presupuesto (además roto por lógica, ver tabla), `#29` netlify-fields, `#31` lead-slider, `#32` filter-bar, `#33` maintenance-banner.

---

## 3. Estados y clases dinámicas (`.is-*`, `.reveal`, `.fade-up`, `.sr-only`)

| Clase de estado | La pone (mecanismo) | Selector/elemento objetivo | Dónde (línea `main.js`) | ¿Existe ya en el HTML estático? |
|---|---|---|---|---|
| `.reveal` | JS, al cargar | `.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other` (lista fija) | `5` | **Sí, parcialmente**: `site/pages/jobs.html` trae 3 `.jobcard` con `class='jobcard reveal'` ya hardcodeado en el HTML estático (líneas 161, 175, 188); en el resto de casos la añade `el.classList.add('reveal')` en tiempo de ejecución |
| `.is-visible` | JS, `IntersectionObserver` (umbral `0.12`, `rootMargin:'0px 0px -60px 0px'`) | mismos elementos que arriba, tras `.reveal` | `6–13` | No |
| `.is-active` (tabs cine-hero) | JS, `classList.toggle` | `.cine-hero` bgs/tabs | `80,83` | **Sí, parcialmente**: el primer `.cine-tab` de `site/index.html` trae `class="cine-tab is-active"` ya en el HTML servido (estado inicial hardcodeado), y luego JS lo reasigna al cambiar de pestaña |
| `.is-active` (hero slider clásico) | JS, `classList.toggle` | `.hero__bg`/`[data-hero-slide]`/`[data-hero-dot]` | `46–50` | No (módulo inactivo, ver §2 #4) |
| `.is-active` (galería, thumbs) | JS, `add`/`remove` | `[data-gallery-thumb]` | `231–232`, `592–593` | No (módulo inactivo) |
| `.is-active` (visor 3D, chips de color) | JS, `add`/`remove` | `.threed-viewer__controls .chip` | `504–505` | No (módulo inactivo) |
| `.is-active` (lead slider, lead dots) | JS, `add`/`remove` | `.lead-slide`, `.lead-dot` | `659–661` | No (módulo inactivo) |
| `.is-active` (filtro por anchura, `sport.html`) | JS, `add`/`remove` | `.filter-pill` | `699–700` | No (falta `.filter-pill` en el HTML, ver §2 #32) |
| `.is-swap` | JS: `classList.remove` + *reflow forzado* (`void el.offsetWidth`) + `classList.add`, para reiniciar una animación CSS de fundido | `<h1>`/`.sub` del cine-hero al cambiar de tab | `76` | No |
| `.is-sport` | JS, `classList.toggle` condicionado a `data-world==='sport'` del tab activo | `.cine-hero` (el propio contenedor) | `90` | No |
| `.is-scrolled` | JS, `classList.toggle` en cada evento de scroll (`passive`) | `.site-header` | `190` | No |
| `.is-open` (menú móvil) | JS, `classList.toggle` (en `.site-nav` **y** en `.burger` a la vez) | `.site-nav`, `.burger` | `198–199` | No |
| `.is-open` (selector de idioma) | JS, `classList.toggle` | `.lang-switch` | `246` | No |
| `.is-open` (mega-menú, solo móvil) | JS, `classList.toggle`, cierra los demás grupos abiertos primero | `.site-nav__group.has-dropdown` | `274–278` | No |
| `.is-hidden` | JS, `classList.toggle` según `IntersectionObserver` (visibilidad del footer) | `.wa-fab` | `374` | No |
| `.is-hiding` | JS, `classList.add`, luego `el.remove()` a los 500ms | `#maint-banner` | `714` | No (módulo inactivo) |
| `.is-visible` (popup de salida) | JS, `classList.add`/`remove` (vía `requestAnimationFrame`) | `[data-exit-popup]` | `357, 360` | No |
| `.is-selected` | **Nadie la pone** — definida en CSS (`.quiz__options button.is-selected`, `main.pretty.css:3081`) pero el bloque `quiz` no existe en ninguna página ni se referencia en `main.js` | `.quiz__options button` | — | **CSS 100% muerto, sin JS ni HTML** |
| `.is-over` | **Nadie la pone** — `.preview-tool__dropzone.is-over` (`main.pretty.css:3265`); bloque `preview-tool` en 0/78 y sin JS | `.preview-tool__dropzone` | — | **CSS 100% muerto** |
| `.is-done` | **Nadie la pone** — `.splash.is-done` (`main.pretty.css:3351`); bloque `splash` en 0/78 y sin JS | `.splash` | — | **CSS 100% muerto** |
| `.is-product-detail` | **Estático en el HTML**, no lo pone JS | `<body class="is-product-detail">` y `<main id="main" class="is-product-detail">` en las 36 páginas `site/products/*.html` | — | Sí, en las 36 páginas de producto |
| `.sport-world` (no es `is-*` pero es una clase de estado/contexto) | Estático en el HTML | `<body class="sport-world">` (páginas de disciplina deportiva) y `<div class="world-block world-block--sport sport-world">` en la home | — | Sí, en 16/78 páginas (ver bloque `sport-world` en §1) |
| `.fade-up` | **Nadie la pone dinámicamente** — clase de utilidad para animación de entrada (`animation:fadeUp .6s ease both`, keyframes `fadeUp` en `main.pretty.css:879`); no aparece en `main.js` ni en el HTML estático de ninguna de las 78 páginas | — | — | Ni HTML ni JS — solo definida en CSS, sin consumidor detectado |
| `.sr-only` | Utilidad de accesibilidad (visualmente oculto), se aplicaría manualmente en el HTML | — | — | No aparece en el HTML estático de ninguna de las 78 páginas (0/78) — definida pero sin uso en el espejo |

---

## 4. Todos los `id=` de las páginas

**Solo 4 `id` distintos** aparecen en el HTML estático de las 78 páginas (excluyendo el contenido de `<script>`/`<style>`, donde aparecían falsos positivos del snippet inline de Google Tag Manager):

| `id` | Nº páginas | Páginas | Para qué |
|---|---|---|---|
| `main` | 72/78 | todas menos `pages/sport.html`, `pages/produkte.html`, `pages/jobs.html`, `pages/jobs/freiberuflicher-ingenieur.html`, `pages/jobs/sdr-sales.html`, `pages/jobs/studentische-assistenz.html` | `<main id="main" tabindex="-1">` — patrón típico de destino de skip-link / foco programático tras navegación. **No se encontró ningún `<a href="#main">` en el HTML estático de ninguna página** (ni en las que sí tienen el `id`), así que no puede confirmarse que exista un skip-link visible; puede ser solo una convención de foco (p. ej. para las View Transitions del módulo 6, §2) |
| `exit-title` | 78/78 | todas | Título del popup de salida. Confirmado en `site/index.html:601-606`: `<div class="exit-popup" data-exit-popup hidden>` → `<div class="exit-popup__box" role="dialog" aria-labelledby="exit-title">` → `<h2 id="exit-title">Fast advice within 24h</h2>` |
| `disziplinen` | 1/78 | `pages/sport.html` | Ancla de sección (nombre en alemán pese a que el resto de la página está en inglés — mezcla de idiomas ya notada en el propio contenido de las páginas) |
| `offene-stellen` | 1/78 | `pages/jobs.html` | Ancla de sección ("vacantes abiertas" en alemán) |

**Inconsistencia detectada**: 6 páginas (`pages/sport.html`, `pages/produkte.html`, `pages/jobs.html`, y las 3 páginas de detalle de empleo `pages/jobs/freiberuflicher-ingenieur.html`, `pages/jobs/sdr-sales.html`, `pages/jobs/studentische-assistenz.html`) tienen `<main>` a secas, sin `id="main"` ni `tabindex="-1"`, mientras las otras 72 sí los tienen — inconsistencia de plantilla, no se pudo determinar la causa.

**`id` que `main.js` busca pero que no existen en ninguna de las 78 páginas** (confirma la sección §2 — módulos inactivos por `id` inexistente, no solo por `data-*`):

| `id` buscado (`getElementById`) | Línea `main.js` | Módulo | Presente en HTML? |
|---|---|---|---|
| `weather-snow` | `138` | Widget de clima/nieve | No — 0/78 |
| `avail-slots` | `379` | Banner de disponibilidad | No — 0/78 |
| `avail-recent` | `380` | Banner de disponibilidad | No — 0/78 |
| `maint-banner` | `707` | Banner de mantenimiento | No — 0/78 |


## 5. Página → bloques que usa (78 filas)

Cada fila lista el nº total de bloques BEM presentes en el HTML estático de esa página y, para no repetir 78 veces la misma plantilla, **solo los bloques que no son "chrome universal"** (los 14 bloques presentes en las 78/78 páginas, definidos en la §1: `site-header`, `site-nav`, `has-dropdown`, `mega-item`, `mega-link`, `lang-switch`, `flag`, `btn`, `burger`, `lightbox`, `wa-fab`, `exit-popup`, `site-footer`, `container`). El nº total sí los incluye. Para el listado completo (chrome + específicos) de una página concreta, cruzar con la tabla de la §1 (columna "Detalle páginas").

**Nota**: los bloques listados en la columna "Bloques específicos" están en **orden alfabético**, no en el orden real de aparición en el DOM, y no anotan anidación (qué bloque contiene a cuál) ni nº de instancias. Para el orden real, la anidación y el nº de instancias de cada uno de los ~8 arquetipos de página estructuralmente distintos (home, categoría, producto, sport, jobs-index, job-detail, formulario, stub), ver `06-plantillas-interiores.md`.

| # | Página | Total bloques | Bloques específicos (excl. chrome universal de 14 bloques, ver nota) |
|---|---|---|---|
| 1 | `site/categories/fabric-buildings.html` | 20 | `breadcrumbs`, `cta-band`, `page-hero`, `product-card`, `product-grid`, `section` |
| 2 | `site/categories/padel-tennis-covers.html` | 21 | `breadcrumbs`, `cta-band`, `page-hero`, `product-card`, `product-grid`, `section`, `sport-world` |
| 3 | `site/categories/pickleball.html` | 21 | `breadcrumbs`, `cta-band`, `page-hero`, `product-card`, `product-grid`, `section`, `sport-world` |
| 4 | `site/categories/riding-arena-covers.html` | 21 | `breadcrumbs`, `cta-band`, `page-hero`, `product-card`, `product-grid`, `section`, `sport-world` |
| 5 | `site/categories/storage-tents.html` | 20 | `breadcrumbs`, `cta-band`, `page-hero`, `product-card`, `product-grid`, `section` |
| 6 | `site/guides/index.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 7 | `site/index.html` | 46 | `before-after`, `calc-card`, `calc-grid`, `case-card`, `case-grid`, `cine-hero`, `cine-tab`, `collection-card`, `cta-band`, `feature`, `features`, `home-montage`, `is-active`, `kategorien`, `press-item`, `press-strip`, `product-card`, `product-grid`, `rating-badge`, `review`, `reviews-grid`, `reviews-head`, `section`, `sport-world`, `star`, `stars`, `team-section`, `team-wall`, `three-d-cta`, `trust-bar`, `trust-item`, `world-block` |
| 8 | `site/pages/3d-preview.html` | 22 | `breadcrumbs`, `consent-row`, `field`, `form-grid`, `form-trust`, `hp-field`, `page-hero`, `section` |
| 9 | `site/pages/about-us.html` | 18 | `breadcrumbs`, `cta-band`, `page-hero`, `section` |
| 10 | `site/pages/all-models.html` | 19 | `breadcrumbs`, `collection-card`, `kategorien`, `page-hero`, `section` |
| 11 | `site/pages/calculators.html` | 19 | `breadcrumbs`, `collection-card`, `kategorien`, `page-hero`, `section` |
| 12 | `site/pages/compare-shelters.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 13 | `site/pages/contact.html` | 24 | `breadcrumbs`, `consent-row`, `contact-action`, `contact-actions`, `contact-grid`, `field`, `form-grid`, `hp-field`, `page-hero`, `section` |
| 14 | `site/pages/customer-reviews.html` | 22 | `breadcrumbs`, `cta-band`, `page-hero`, `review`, `reviews-grid`, `section`, `star`, `stars` |
| 15 | `site/pages/downloads.html` | 22 | `breadcrumbs`, `field`, `form-grid`, `form-trust`, `hp-field`, `page-hero`, `section`, `toggle-row` |
| 16 | `site/pages/faq.html` | 20 | `breadcrumbs`, `cta-band`, `faq-item`, `faq-list`, `page-hero`, `section` |
| 17 | `site/pages/jobs.html` | 25 | `breadcrumbs`, `cta-band`, `jobcard`, `jobcard-meta`, `jobs-grid`, `jobs-hero`, `jobs-value`, `jobs-values`, `page-hero`, `reveal`, `section` |
| 18 | `site/pages/jobs/freiberuflicher-ingenieur.html` | 27 | `breadcrumbs`, `job-col`, `job-cols`, `job-meta`, `job-other`, `job-others`, `jobdetail`, `jobdetail-apply`, `jobdetail-back`, `jobdetail-hero`, `jobs-hero`, `page-hero`, `section` |
| 19 | `site/pages/jobs/sdr-sales.html` | 27 | `breadcrumbs`, `job-col`, `job-cols`, `job-meta`, `job-other`, `job-others`, `jobdetail`, `jobdetail-apply`, `jobdetail-back`, `jobdetail-hero`, `jobs-hero`, `page-hero`, `section` |
| 20 | `site/pages/jobs/studentische-assistenz.html` | 28 | `breadcrumbs`, `job-col`, `job-cols`, `job-meta`, `job-other`, `job-others`, `jobdetail`, `jobdetail-apply`, `jobdetail-back`, `jobdetail-hero`, `jobdetail-salary`, `jobs-hero`, `page-hero`, `section` |
| 21 | `site/pages/legal-notice.html` | 16 | `page-hero`, `section` |
| 22 | `site/pages/machinery-calculator.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 23 | `site/pages/privacy-policy.html` | 16 | `page-hero`, `section` |
| 24 | `site/pages/produkte.html` | 22 | `breadcrumbs`, `collection-card`, `cta-band`, `kategorien`, `page-hero`, `section`, `sport-world`, `world-block` |
| 25 | `site/pages/reference-projects.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 26 | `site/pages/request-a-quote.html` | 23 | `breadcrumbs`, `consent-row`, `field`, `form-grid`, `form-trust`, `full`, `hp-field`, `page-hero`, `section` |
| 27 | `site/pages/round-bale-calculator.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 28 | `site/pages/shelter-finder.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 29 | `site/pages/sport.html` | 27 | `product-card`, `product-grid`, `sp-claim`, `sp-cta`, `sp-disc`, `sp-disciplines`, `sp-head`, `sp-hero`, `sp-section`, `sp-spec`, `sp-specs`, `sp-video`, `sport-world` |
| 30 | `site/pages/sustainability.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 31 | `site/pages/team.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 32 | `site/pages/technical-glossary.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 33 | `site/pages/terms-and-conditions.html` | 16 | `page-hero`, `section` |
| 34 | `site/pages/thank-you.html` | 15 | `page-hero` |
| 35 | `site/products/fabric-building-10x15.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 36 | `site/products/fabric-building-10x18.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 37 | `site/products/fabric-building-10x21.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 38 | `site/products/fabric-building-10x24.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 39 | `site/products/fabric-building-10x30.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 40 | `site/products/fabric-building-12x15.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 41 | `site/products/fabric-building-12x18.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 42 | `site/products/fabric-building-12x24.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 43 | `site/products/fabric-building-12x30.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 44 | `site/products/fabric-building-15x24.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 45 | `site/products/fabric-building-15x30.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 46 | `site/products/fabric-building-15x40.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 47 | `site/products/fabric-building-8x12.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 48 | `site/products/fabric-building-8x18.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 49 | `site/products/fabric-building-8x21.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 50 | `site/products/padel-tennis-cover.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 51 | `site/products/pickleball-1-court.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 52 | `site/products/pickleball-2-courts.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 53 | `site/products/riding-arena-cover-14x14.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 54 | `site/products/riding-arena-cover-20x20.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 55 | `site/products/riding-arena-cover-20x30.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 56 | `site/products/riding-arena-cover-20x40.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 57 | `site/products/riding-arena-cover-20x60.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 58 | `site/products/riding-arena-cover-20x80.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 59 | `site/products/riding-arena-cover-25x45.html` | 23 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section`, `sport-world` |
| 60 | `site/products/storage-tent-12x15.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 61 | `site/products/storage-tent-12x18.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 62 | `site/products/storage-tent-12x24.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 63 | `site/products/storage-tent-12x30.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 64 | `site/products/storage-tent-6x12.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 65 | `site/products/storage-tent-6x18.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 66 | `site/products/storage-tent-6x6.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 67 | `site/products/storage-tent-6x9.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 68 | `site/products/storage-tent-9x12.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 69 | `site/products/storage-tent-9x20.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 70 | `site/products/storage-tent-9x26.html` | 22 | `breadcrumbs`, `cta-band`, `gallery`, `is-product-detail`, `page-hero`, `product-card`, `product-detail`, `section` |
| 71 | `site/projects/agroindustrial-extremadura.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 72 | `site/projects/family-olive-farm-jaen.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 73 | `site/projects/family-winery-penedes.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 74 | `site/projects/fruit-cooperative-murcia.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 75 | `site/projects/grain-trader-la-rioja.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 76 | `site/projects/large-farm-lleida.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 77 | `site/projects/mountain-livestock-pyrenees.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
| 78 | `site/projects/organic-cereal-cooperative.html` | 17 | `breadcrumbs`, `page-hero`, `section` |
## 6. Hallazgos clave para el crítico (checklist de cobertura de 01–10)

- **89 de los 212 bloques definidos en CSS tienen uso real** en al menos 1 de las 78 páginas del espejo; **123 no aparecen en ninguna**. De esos 123: **99 tampoco tienen ningún hook en `main.js`** (candidatos sólidos a descartar del diseño nuevo) y **24 sí tienen un módulo JS operando sobre ellos**, en la mayoría de los casos sin que ninguna página los dispare (ver lista exacta en `out_dead_blocks.json`, campo `dead_but_js`, y detalle módulo a módulo en la §2) — **excepción**: las clases de estado `is-hidden`, `is-open`, `is-scrolled`, `is-sport`, `is-swap`, `is-visible` sí están dentro de esos 24 (0/78 en el HTML estático) pero JS **sí las aplica en runtime** en toda página o interacción relevante (ver §1, filas correspondientes, y §3). Sumando `hp-field` (bloque usado en 4 páginas pero sin ninguna regla CSS propia, §1-bis), el total de bloques con uso real en el espejo es **90** sobre **213** bloques nombrados en total (212 en CSS + 1 solo-HTML).
- **Páginas "vaciadas" a un stub genérico** (`page-hero` + un único `<section class="section">` con `<p>`/`<h2>`/`<ul>`/`<dl>` sueltos, sin ningún bloque específico — 17 páginas en total, identificadas en §5 por tener exactamente 17 bloques totales = `breadcrumbs`+`page-hero`+`section`): `pages/team.html`, `pages/reference-projects.html`, `pages/sustainability.html`, `guides/index.html`, `pages/compare-shelters.html`, `pages/machinery-calculator.html`, `pages/round-bale-calculator.html`, `pages/shelter-finder.html`, `pages/technical-glossary.html`, y las **8 páginas completas** de `site/projects/*.html` (`agroindustrial-extremadura`, `family-olive-farm-jaen`, `family-winery-penedes`, `fruit-cooperative-murcia`, `grain-trader-la-rioja`, `large-farm-lleida`, `mountain-livestock-pyrenees`, `organic-cereal-cooperative`) — esta última es una categoría entera de contenido (8/78 páginas, el 10% del sitio) en ese estado. Los bloques CSS que "deberían" vivir en esas páginas (`team-card`/`team-wall`/`team-grid`, `case-*`/`dach-map`, `blog-card`/`blog-grid`, `calc-*`/`m-row`/`m-check`/`co2-calc`, `compare-*`) están definidos en CSS pero en 0/78 páginas — no son ruido de parseo, es contenido retirado.
- `pages/calculators.html` y `pages/all-models.html` sí tienen contenido (son índices con `collection-card`), pero enlazan a páginas hijas vaciadas.
- `pages/3d-preview.html` no contiene el visor 3D (bloque `threed-viewer`, módulo JS §2 #22): es un formulario de contacto (`form-grid`, `field`, `consent-row`, `hp-field`). El visor 3D en Three.js está completamente presente y operativo en el código (CSS + JS) pero sin ninguna página que lo monte.
- **Bug/código muerto confirmado por lógica, no solo por ausencia de markup**: el módulo de prefill de presupuesto (`main.js:562`) comprueba `pathname.endsWith('request-for-quote.html')`, pero la página real es `pages/request-a-quote.html` (**a**, no **for**) — el guard nunca es cierto. La función `ecUserData()` (`main.js:618`) no se invoca desde ningún punto del archivo.
- **`data-w` huérfano en `pages/sport.html`**: las 10 `.product-card` de la página llevan el atributo `data-w` (9 con valor numérico `data-w='…'`, ancho en metros, y 1, `/products/padel-tennis-cover`, con `data-w` sin valor) pero la barra de filtro (`data-filter-bar`/`.filter-pill`) que lo consumiría no existe en esa página — atributo sin efecto.
- **El contenedor del lightbox se renderiza en las 78/78 páginas** (`<div class="lightbox" data-lightbox hidden>`, 13 reglas CSS) pero **nada lo dispara** en ninguna página: faltan `data-gallery-thumb`, `data-gallery-main`, `data-photo-gallery` y `data-lightbox-trigger` en las 78. Además, comprobado directamente: **las 36 páginas de producto con bloque `gallery` solo tienen 1 imagen** (`.gallery__main` sin ningún `.gallery__thumb`) — aunque se conectara el hook, hoy no habría más de una foto que mostrar en ninguna ficha de producto.
- **Dos modificadores BEM sin ninguna regla CSS, presentes en las 78 páginas** (ver §1-bis): `mega-link--sport` (enlace "sports world" del mega-menú) y `site-nav__group--mega` (contenedor del mega-menú) — restos de una convención de modificador anterior; el aspecto real del mega-menú lo dan por completo los bloques `site-nav__mega`/`site-nav__mega-col--sport`, que sí tienen reglas. No replicar estos dos modificadores al diseñar el menú nuevo de Pavivasa.
- Solo **4 `id`** existen en las 78 páginas (`main`, `exit-title`, `disziplinen`, `offene-stellen`); **4 más** que `main.js` busca con `getElementById` (`weather-snow`, `avail-slots`, `avail-recent`, `maint-banner`) no existen en ninguna.
- 6 páginas sin `id="main"` en su `<main>` (`pages/sport.html`, `pages/produkte.html`, `pages/jobs.html`, `pages/jobs/freiberuflicher-ingenieur.html`, `pages/jobs/sdr-sales.html`, `pages/jobs/studentische-assistenz.html`) — inconsistencia de plantilla frente a las otras 72.
- `.sport-world` es una clase de **contexto** puesta estáticamente en `<body>` (o en el wrapper `.world-block--sport` de la home) en 16/78 páginas — reescribe visualmente `.btn`, `.product-card`, `.filter-bar`, `.cta-band`, `.section`, `.feature`, `.padel-sizes` mediante selectores descendentes `.sport-world .bloque{…}` (67 reglas). Para Pavivasa, este es el mecanismo más directo a imitar si se quiere una variante de marca "por sección" sin duplicar componentes.
- El único hero realmente interactivo y en uso es `cine-hero` (home, 1 página, carrusel de 4 pestañas vía `data-cine-tab`). El bloque `hero` "clásico" (slider con `.hero__bg` parallax) está completo en CSS+JS pero en 0/78 páginas — es una implementación anterior no eliminada.
- El contenido de texto de las páginas mezcla inglés/alemán/español de forma inconsistente (p. ej. "in days", "Snow load", "Municipality" en `site/index.html`, ids en alemán `disziplinen`/`offene-stellen`) — el sitio real es multi-idioma (`hreflang` a `.de`/`.es`/`.pt`) y este espejo parece ser una mezcla/traducción parcial de la versión `.de`; no afecta a la arquitectura CSS/JS pero si 01–10 citan textos literales de contenido, señalarlo.
- El HTML mezcla comillas simples y dobles para `class=`/atributos dentro del mismo archivo (p. ej. `site/index.html` usa `class='site-header__logo'` y `class="container site-header__bar"` a dos líneas de distancia) — irrelevante para Tailwind/JSX pero se documenta porque afectó la metodología de escaneo (§0).

## 7. Ficheros de trabajo generados en esta pasada (no forman parte del entregable, referencia de auditoría)

`parse_css.py`, `css_records.json`, `analyze_blocks.py`, `block_info.pkl`, `scan_html.py`, `html_scan.json`, `build_doc.py`, `out_blocks_table.md`, `out_dead_blocks.json`, `build_page_table.py`, `out_pages_table.md` — todos en `/tmp/claude-1000/-home-ysst/de558d45-a364-4fbb-a555-2a7526e7eb8c/scratchpad/globotent/`, reproducibles contra el espejo local citado en el encabezado del encargo.

## 8. Traducción a Next.js 15 App Router + Tailwind 3.4 + shadcn/ui

> Esta sección no repite el mecanismo de 01–10; traduce las conclusiones de este inventario (§1–§7) a decisiones de implementación concretas para Pavivasa. Los valores de `tailwind.config` (colores, breakpoints, tipografía) **no se listan aquí**: viven en `01-fundamentos.md` (§1 tokens `:root`, §2 colores fuera de tokens, §4.6 breakpoints reales) y en `08-responsive.md` (§1–§2, inventario `@media`) — no faltan por omisión de este archivo, están documentados con sus valores literales en esos dos.

### 8.1 Chrome universal: `app/layout.tsx` vs. por página

Los 14 bloques "chrome universal" de la §1 (`site-header`, `site-nav`, `has-dropdown`, `mega-item`, `mega-link`, `lang-switch`, `flag`, `btn`, `burger`, `lightbox`, `wa-fab`, `exit-popup`, `site-footer`, `container`) aparecen en las 78/78 páginas del espejo porque forman la cabecera, el menú, el footer y los overlays comunes — van en `app/layout.tsx` (Server Component que envuelve `{children}`), no en cada página:

| Bloque(s) | Componente Next/React | Notas de implementación |
|---|---|---|
| `site-header`, `site-nav` (+ elementos `mega`, `mega-col`, `dropdown`; modificadores `has-dropdown`, `mega-item`, `mega-link`) | `<SiteHeader>` en `layout.tsx` | 60 reglas CSS propias del bloque `site-nav` (§1, fila `site-nav`); el desplegable móvil es el módulo JS #16 (`264–285`, gate `isMobile()`) — Cliente Component solo para esa parte interactiva |
| `lang-switch`, `flag` | `<LangSwitch>` | 19 reglas, `.is-open` vía `classList.toggle` (§3, línea `246`) → estado local `useState` en un Client Component |
| `burger` | dentro de `<SiteHeader>` | `.is-open` en `.site-nav` y `.burger` a la vez (§3, `198–199`) |
| `btn` | `<Button>` de shadcn (variantes `btn--primary`/`btn--lg`/etc. → prop `variant`/`size`) | Bloque más repetido del sitio; no crear un componente propio |
| `lightbox` | `<Dialog>` de shadcn | Contenedor en 78/78 páginas pero **sin disparador activo en el espejo** (§2 módulo #17, §6): implementar como `Dialog` controlado, no replicar el hueco funcional |
| `wa-fab` | `<WaFab>` flotante, oculto cerca del footer vía `IntersectionObserver` (§2 módulo #19, §1 fila `is-hidden`) | Client Component con `useEffect` + `IntersectionObserver` |
| `exit-popup` | `<Dialog>` de shadcn (variante "salida") | 78/78, activo (§1 fila `exit-popup`); trigger es el módulo JS correspondiente, no un bloque CSS |
| `site-footer` | `<SiteFooter>` en `layout.tsx` | — |
| `container` | clase de utilidad Tailwind (`max-w-*` + `mx-auto` + padding), no un componente | Ver `01-fundamentos.md` §4.1 para el ancho exacto |

`page-hero` y `section` **no** son chrome universal (76/78 cada uno, por pares de páginas distintos — ver nota corregida en §1, línea 28): van como componentes reusables (`<PageHero>`, `<Section>`) importados por cada página, no en `layout.tsx`.

### 8.2 Bloques vivos (de los 89 con uso real, §1) → primitivas shadcn

Solo se listan los bloques con un equivalente directo en shadcn/ui; el resto (`product-card`, `case-card`, `cta-band`, `calc-card`, etc.) no tiene primitiva 1:1 y se construye como componente propio sobre `Card`/`Button` base.

| Bloque(s) (fuente: §1/§2) | Primitiva shadcn | Justificación |
|---|---|---|
| `lightbox` (78/78, 14 reglas, §1 fila `lightbox`) | `Dialog` | Overlay modal con `.lightbox__close`, navegación prev/next → `DialogContent` + botones |
| `exit-popup` (78/78, 13 reglas, §1 fila `exit-popup`) | `Dialog` | `role="dialog"` + `aria-labelledby="exit-title"` ya está en el HTML fuente (§4) — mapeo directo |
| `lang-switch` (78/78, 19 reglas, §1 fila `lang-switch`) | `DropdownMenu` | `.is-open`/`.lang-switch__menu` (§3) equivalen a `DropdownMenuContent` |
| `site-nav` (elementos `mega`, `mega-col`, `mega-head`, `mega-tools`; 78/78, 60 reglas) | `NavigationMenu` | El desplegable de escritorio es `:hover`/CSS puro (no JS, §2 no lista módulo para escritorio); solo el acordeón móvil (#16) necesita JS — `NavigationMenu` de shadcn ya separa ambos casos |
| `faq-item`/`faq-list` (1/78, `pages/faq.html`, 7+1 reglas) | `Accordion` | Único uso real en el espejo; sin JS propio (§1, columna "¿En main.js?" = `no` para ambos) — en origen es literalmente `<details class="faq-item"><summary>…</summary><div>…</div></details>` (`site/pages/faq.html:141-149`, elemento nativo `<details>`/`<summary>`, sin JS), así que `Accordion` de shadcn sustituye ese mecanismo nativo, no solo la apariencia |
| `cine-hero`/`cine-tab` (1/78, `site/index.html`, 34 reglas) | `Tabs` (adaptado) | 4 pestañas vía `data-cine-tab` (§2 módulo #5, `64–99`) que reescriben `textContent`/`href` del H1/sub/eyebrow/CTA — no es contenido oculto/mostrado como un `Tabs` estándar, es reescritura de un único hero; usar `Tabs` solo para la lista de botones, con lógica propia para el contenido |
| `field`, `consent-row`, `form-grid`, `form-trust`, `toggle-row` (4/78 formularios: `3d-preview`, `contact`, `downloads`, `request-a-quote`) | `Form` (`react-hook-form` + `zod`) + `Input`/`Checkbox`/`Label` de shadcn | `hp-field` (honeypot, §1-bis) se mantiene como `<input>` oculto fuera del `Form` de shadcn, con `aria-hidden`/`tabIndex={-1}`, no como componente shadcn |

### 8.3 `.sport-world`: contexto de sección sin `:has()` nativo

`.sport-world` (§1, 67 reglas, 16/78 páginas) es una clase de **contexto** puesta en `<body>` o en el wrapper `.world-block--sport` de la home (ver bullet final de §6) que reescribe descendientes (`.sport-world .btn{…}`, `.sport-world .product-card{…}`, etc.) vía selectores CSS descendentes puros — no hay JS que la añada o quite (§1, columna JS = `no`; no aparece en la tabla de estados de §3). Las variantes nativas de Tailwind 3.4 (`group-*`, `peer-*`, `has-*`) exigen una relación fija con el elemento marcado (`group`/`peer` en un ancestro directo conocido, o comprobar los propios descendientes del elemento con `has-*`) — ninguna cubre "aplícate un estilo distinto porque *algún* ancestro, a cualquier profundidad, tiene este atributo", que es justo el mecanismo de `.sport-world .bloque{…}`. Para eso hace falta una variante propia vía `addVariant` (no la sintaxis `@theme` de Tailwind 4, que no aplica en 3.4):

1. Marcar el contexto con un atributo de datos en el wrapper de sección o en `<body>`: `data-world="sport"` (en vez de una clase de contexto).
2. Declarar la variante en `tailwind.config.ts` (no en CSS `@theme`, que es Tailwind 4):
   ```ts
   // tailwind.config.ts
   export default {
     theme: { extend: { /* colores/tokens de 01-fundamentos.md §1.3 */ } },
     plugins: [
       plugin(({ addVariant }) => {
         addVariant('sport', '[data-world="sport"] &');
       }),
     ],
   }
   ```
3. Usar la variante en cada componente descendiente: `className="bg-white sport:bg-[var(--sport-accent)]"` (los valores exactos de los tokens `.sport-world` están en `01-fundamentos.md` §1.3, `L4233–L4238`, no se listan aquí para no duplicarlos).

Esto evita duplicar `product-card`/`cta-band`/`section`/`feature` en dos versiones (normal y "sport"): un único componente lee la variante `sport:` (definida en el paso 2) igual que el CSS fuente lee `.sport-world .bloque{…}`.
