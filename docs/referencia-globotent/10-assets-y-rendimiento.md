# 10 · Assets y rendimiento — globotent.com

Referencia extraída del código fuente real y de comprobaciones en vivo contra `https://globotent.com/` (`curl`, `file`, `ffprobe`, `md5sum`). Lectores: Claude Design (diseño nuevo para Pavivasa) y Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). `Lnnn` = línea de `main.pretty.css`. Cada bloque **"En el código"** es extracción literal y trazable; cada bloque **"→ Traducción"** es recomendación mía para el proyecto Pavivasa, no una propiedad del sitio original — no mezclar.

Páginas usadas como muestra de esta dimensión: `home.html` / `site/index.html` (home), `site/categories/storage-tents.html` (categoría), `site/products/storage-tent-9x20.html` (producto), más *greps* recursivos sobre las 78 páginas de `site/` para censar patrones (`loading`, `fetchpriority`, `sizes`, SVG, `<video>`).

---

## 1. Inventario de imágenes — home

Todas las rutas son relativas a `assets/images/` salvo que se indique lo contrario. Tamaños en bytes = `content-length` real descargado (`home_sizes.txt`, confirmado con `curl -sI` puntual en varias).

### 1.1 Hero cinematográfico (`.cine-hero`, home.html L129–130)

| Base | -800.webp | -1200.webp | base.webp (declarado Nw) | .jpg (fallback) | Dimensión real base.webp (`file`) |
|---|---|---|---|---|---|
| `hero-agricolas` | 100 474 B | 211 736 B | 317 156 B (`2000w` en preload L23 / `1920w` en `<source>` L130) | 384 103 B | **1536×2048** (retrato) |
| `hero-almacen` | 19 830 B | 38 026 B | 38 026 B (`1920w`) | 54 154 B | **1200×864** |
| `hero-ecuestre` | 88 436 B | 193 890 B | 416 910 B (`1920w`) | 356 254 B | **1920×1080** (paisaje, 16:9) |
| `hero-padel` | 94 184 B | 200 444 B | 403 708 B (`1920w`) | 359 043 B | **1920×1440** (paisaje, 4:3) |

**Hallazgo verificado — el descriptor `w` no coincide con el ancho real del fichero:**
- `hero-agricolas.webp`: descrito como `2000w` en el `<link rel=preload>` (L23) y como `1920w` en el `<source>` del carrusel (L130) — **dos descriptores distintos para el mismo fichero en la misma página** — y el ancho real medido con `file` es **1536 px**. Los tres números no coinciden entre sí.
- `hero-almacen.webp` y `hero-almacen-1200.webp` son **el mismo fichero byte a byte**: `md5sum` idéntico (`6b3c1f09981287ae17c5954e98bd15e2`), ambos 1200×864 px, mismo `content-length` (38 026 B). El descriptor `1920w` del "tamaño base" en realidad sirve una imagen de 1200 px de ancho.
- Los tres heroes verificados en píxeles (`hero-agricolas-800`=800×1066, `hero-agricolas-1200`=1200×1600, `hero-agricolas`=1536×2048) son **retrato** (ratio ≈0.75), no paisaje — se usan a sangre completa con `object-fit:cover` en un contenedor apaisado, es decir se recortan mucho lateralmente. Este recorte se compensa a mano en CSS: `.cine-hero__bg:nth-child(1) img{object-position:center 62%}` (L5996), `:nth-child(3){object-position:center 58%}` (L5998).
- `hero-ecuestre.webp` (1920×1080, 16:9) y `hero-padel.webp` (1920×1440, 4:3) **sí estaban disponibles en el espejo local** (`img/`) y se verificaron con `file`: a diferencia de `hero-agricolas`/`hero-almacen`, son **paisaje**, no retrato — el descriptor `1920w` es correcto para estos dos y solo incorrecto para `hero-agricolas` (1536 px real) y `hero-almacen` (1200 px real, arriba). Las 4 relaciones de aspecto reales del carrusel: `hero-agricolas` 3:4 (retrato), `hero-almacen` 1200×864 = 25:18 ≈1,39:1 (paisaje suave), `hero-ecuestre` 16:9 (paisaje), `hero-padel` 4:3 (paisaje) — mezcla de orientaciones bajo el mismo `object-fit:cover` + `object-position` por slide. No verificado en píxeles: los `.jpg` de fallback de `hero-ecuestre`/`hero-padel`, ni si comparten el problema de duplicado de bytes — el chequeo (§1.3) no los marcó como sospechosos.

Marcado literal del primer slide (LCP) y del segundo, `home.html` L130:
```html
<picture class="cine-hero__bg is-active" data-cine-bg>
  <source type="image/webp" srcset="assets/images/hero-agricolas-800.webp 800w, assets/images/hero-agricolas-1200.webp 1200w, assets/images/hero-agricolas.webp 1920w" sizes="100vw">
  <img src="assets/images/hero-agricolas.jpg" alt="" fetchpriority="high" decoding="async">
</picture>
<picture class="cine-hero__bg" data-cine-bg>
  <source type="image/webp" srcset="assets/images/hero-almacen-800.webp 800w, assets/images/hero-almacen-1200.webp 1200w, assets/images/hero-almacen.webp 1920w" sizes="100vw">
  <img src="assets/images/hero-almacen.jpg" alt="" loading="lazy" decoding="async">
</picture>
```
**Tabla `loading`/`fetchpriority`/`decoding` — los 4 `<img>` de `.cine-hero__bg` (home.html L130), literal:**

| Slide | `loading` | `fetchpriority` | `decoding` |
|---|---|---|---|
| 1 (`hero-agricolas`, activo) | **ausente** | `"high"` | `"async"` |
| 2 (`hero-almacen`) | `"lazy"` | ausente | `"async"` |
| 3 (`hero-ecuestre`) | `"lazy"` | ausente | `"async"` |
| 4 (`hero-padel`) | `"lazy"` | ausente | `"async"` |

El primer `<img>` no lleva `loading` en absoluto (ni `eager` ni `lazy`) — el navegador lo trata como `eager` por defecto, coherente con ser el candidato a LCP.

`<link rel="preload">` del hero, literal (home.html L23) — **no lleva `href`**, solo `imagesrcset`/`imagesizes`:
```html
<link rel="preload" as="image" type="image/webp" imagesrcset="assets/images/hero-agricolas-800.webp 800w, assets/images/hero-agricolas-1200.webp 1200w, assets/images/hero-agricolas.webp 2000w" imagesizes="100vw" fetchpriority="high">
```

### 1.2 Muro de equipo (`.team-wall`, home.html L211–222) — 10 fotos, patrón repetido

```html
<figure class="team-wall__item">
  <picture>
    <source type="image/webp" srcset="assets/images/team-globotent-01-800.webp 800w, assets/images/team-globotent-01-1200.webp 1200w, assets/images/team-globotent-01.webp 2000w" sizes="(max-width:720px) 50vw, 320px">
    <img src="assets/images/team-globotent-01.jpg" alt="The Globotent installation team on site" loading="lazy" decoding="async">
  </picture>
</figure>
```
Las 10 fotos, en el orden real del DOM (home.html L212–221): `01, 02, 04, 07, 03, 11, 05, 08, 06, 10` — orden no correlativo (mezclado a propósito para el efecto masonry). No existe `team-globotent-09*` en `assets_all.txt`. Las 10 siguen el mismo patrón: `sizes="(max-width:720px) 50vw, 320px"` literal, `loading="lazy"`, `decoding="async"`, fallback `.jpg`.

**Duplicados de bytes verificados en `home_sizes.txt`** (mismo tamaño de fichero entre variantes nominalmente distintas, dentro de las 10 fotos de equipo):

| Foto | Variantes con bytes idénticos |
|---|---|
| `team-globotent-02` | `-800`, `-1200` y base: **291 226 B los tres** |
| `team-globotent-04` | `-1200` y base: **369 990 B** ambos (`-800`=218 270 B, distinto) |
| `team-globotent-06` | `-800`, `-1200` y base: **211 016 B los tres** |
| `team-globotent-11` | `-800`, `-1200` y base: **247 076 B los tres** |

Confirmado por hash MD5 para `hero-almacen` (§1.1) y, parcialmente, para `team-globotent-02`: `-800.webp` y base `.webp` son **byte-idénticos** (`md5sum` → `e9de9601ab43e1b6169f7adb3c11d59c` en ambos; `-1200.webp` no está en el espejo local `dl/`, así que su coincidencia con las otras dos sigue siendo solo por `content-length`). Para `team-globotent-04/06/11` la coincidencia es por `content-length` idéntico, no verificada con `md5sum` (ficheros no presentes en `dl/`, ver §12, dudas). Las otras 6 fotos de equipo (01, 03, 05, 07, 08, 10) tienen tres tamaños de fichero distintos entre sí — no presentan el patrón.

### 1.3 Tarjetas de producto / categoría / caso (home.html L238–457)

Tres variantes de marcado conviven en la misma página:

**A) Con 3 breakpoints webp + fallback en formato nativo** (mayoría):
```html
<picture>
  <source type="image/webp" srcset="assets/images/rundbogenhalle-9x20-01-800.webp 800w, assets/images/rundbogenhalle-9x20-01-1200.webp 1200w, assets/images/rundbogenhalle-9x20-01.webp 2000w">
  <img src="assets/images/rundbogenhalle-9x20-01.png" alt="Arched Storage Tent 9.15 × 20 × 4.50 m" loading="lazy" decoding="async">
</picture>
```
Nótese: el `<source>` no lleva `sizes` (a diferencia del muro de equipo, que sí). El fallback es `.png` de **2 769 780 B (≈2,77 MB)** — el webp equivalente pesa 251 218 B, **11× menos**. Mismo patrón en `satteldachhalle-15x40-01.png` (2 318 410 B de fallback).

**B) Con solo 2 breakpoints** (sin `1200w`), producto `storage-tent-12x24` (home.html L304):
```html
<picture><source type="image/webp" srcset="assets/images/rundbogenhalle-12x24-01-800.webp 800w, assets/images/rundbogenhalle-12x24-01.webp 2000w"><img src="assets/images/rundbogenhalle-12x24-01.jpg" alt="Arched Storage Tent 12.20 × 24 × 6.10 m" loading="lazy" decoding="async"></picture>
```

**C) Sin `srcset` en absoluto, y sin fallback real** — `fabric-building-12x30` (home.html L313), único caso encontrado en la muestra:
```html
<picture><source type="image/webp" srcset="assets/images/satteldachhalle-12x30-01.webp"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Fabric Building 12.20 × 30 × 6.40 m" loading="lazy" decoding="async"></picture>
```
El `<img>` de respaldo es un GIF transparente de 1×1 en base64 (43 bytes), el mismo literal que usa `.lightbox__img` como placeholder inicial (site-wide, ver §4). No hay `.jpg`/`.png` de respaldo para este producto en la home — solo funciona si el navegador soporta `<picture>`+webp (universal en navegadores modernos, pero es el único producto de los 4 de "Top models" sin verdadero fallback).

**D) Categorías "Sport" sin `<picture>` — `<img>` directo, sin webp** (home.html L261, L268, L275):
```html
<a class='collection-card' href='/categories/padel-tennis-covers'>
  <img src="assets/images/padel-court-01.jpg" alt="Padel & tennis court covers" loading="lazy" decoding="async">
  ...
</a>
```
Los 3 `collection-card` del bloque "globotent SPORTS" (Padel, Riding, Pickleball) cargan el `.jpg` directo — sin `<picture>`, sin variante webp, sin `srcset` — a diferencia de los 2 `collection-card` de "Industry & Agriculture" en la misma sección, que sí usan `<picture>`+webp con 3 breakpoints (home.html L238–251).

**E) Tira de "proyectos relacionados" (`site/projects/`, 8 páginas, 40 instancias)** — sin `<picture>`, sin webp, sin `srcset`: `<img>` directo al `.jpg` original, `aria-hidden="true"`, reutilizando fotos-hero de otras familias/producto:
```html
<img src="../assets/images/rundbogenhalle-12x24-01.jpg" alt="" aria-hidden="true" loading="lazy">
```
Censo: `grep -c '<picture'` → 0 en las 8 páginas de `site/projects/` (cero `<picture>` en todo el directorio); cada página tiene exactamente 8 `<img>` (logo de cabecera, 5 de la tira de relacionados, placeholder del lightbox, logo de pie), de los cuales 5 son esta tira. `.case-gallery__item`/`.case-hero__media` (con `aspect-ratio:4/3` en la tabla de §5.3) **no se usan en ninguna página del espejo** (`grep -rl 'case-gallery__item\|case-hero__media' site/ home.html` → 0 resultados): son selectores muertos, no un patrón alternativo usado en la cabecera de estas páginas — la cabecera de `site/projects/*.html` usa `.page-hero`/`.page-hero__bg` estándar (§5.2). `.case-card__media` sí tiene uso real, pero solo en `home.html`/`site/index.html` (la cuadrícula de casos de la home), no dentro de `site/projects/`.

### 1.4 Miniaturas del menú mega (`.site-nav__mega`, home.html L58–79)

```html
<a class='mega-item' href='/categories/storage-tents'>
  <img src="assets/images/rundbogenhalle-12x24-01.jpg" alt="" aria-hidden="true" loading="lazy">
</a>
```
6 miniaturas, todas `<img>` directo sin `<picture>`, sin `decoding`, `alt=""` + `aria-hidden="true"` (decorativas). CSS las fuerza a caja fija: `.site-nav__mega .mega-item img{width:58px;height:44px;object-fit:cover;border-radius:8px}` (L4585–4589) — se descarga el `.jpg` original completo (p. ej. `rundbogenhalle-12x24-01.jpg` = 410 801 B) para mostrarlo en una caja de 58×44 CSS px; no hay variante redimensionada para este uso.

### 1.5 Iconos de feature (PNG, no SVG) — home.html L154, 163, 172, 181

| Fichero | Bytes | Uso |
|---|---|---|
| `selection_quote.png` | 3 675 | Icono "Permit-free*" |
| `express_setup.png` | 5 174 | Icono "Installed in 1 day" |
| `delivery_truck.png` | 2 620 | Icono "Delivery included" |
| `permit_management.png` | 1 982 | Icono "One-stop provider" |

Los 4 son PNG **64×64 px** (`file`: `PNG image data, 64 x 64, 8-bit/color RGBA`), sin `<picture>`/webp, marcado literal: `<img src="assets/images/selection_quote.png" alt="" role="presentation" aria-hidden="true" loading="lazy">`.

### 1.6 Otros usos directos sin `<picture>`

- `.before-after` (home.html L381–382): `<img src="assets/images/globotent-vorher.webp" ...>` / `-nachher.webp`, **sin** `loading` explícito (por tanto `eager` por defecto), sin `<picture>`. Dimensiones reales: `globotent-vorher.webp` 1448×1086, `-nachher.webp` 1600×1200 (`file` sobre `dl/`).
- Logo de cabecera (home.html L49): `<img src="assets/logo.png" alt="Globotent Logo">` — sin `loading`, sin `<picture>`, sin `srcset`. Dimensión real 872×548 px (RGBA), 54 823 B. No hay versión webp de `logo.png`.
- Logo de pie (home.html L619): `<img src="assets/images/logo_white.png" alt="Globotent" loading="lazy">` — 170×97 px, 14 776 B.

### 1.7 Censo global — `sizes=` y `loading=` (las 78 páginas + `home.html`)

| Atributo | Valores únicos | Recuento |
|---|---|---|
| `sizes=` | `"(max-width:720px) 50vw, 320px"` | 20 (muro de equipo, §1.2) |
| `sizes=` | `"100vw"` | 10 (hero cinematográfico, §1.1) |
| `sizes=` | *(ausente)* | resto de los 788 `<img>`/`<source>` |
| `loading=` | `"lazy"` | 587 |
| `loading=` | `"eager"` | 36 (todas en `.gallery__main` de `site/products/`, §3) |
| `loading=` | *(ausente)* | 165 |

Total `<img>` en el espejo (`site/*.html` + `home.html`, 79 ficheros = 78 páginas reales + `home.html` duplicado de `site/index.html`, §5.1): **788**. Los 165 sin `loading=` están dominados por dos casos que se repiten ~1 vez por página: el logo de cabecera (`<img src="assets/logo.png"...>`, sin `loading`, arriba) y el placeholder del lightbox (`<img class="lightbox__img" src="data:image/gif;base64,...">`). Solo existen **2 valores literales distintos** de `sizes=` en todo el sitio — relevante para fijar el prop `sizes` de `next/image` (§11.5).

---

## 2. Inventario de imágenes — categoría (`storage-tents.html`)

11 tarjetas de producto, todas con el mismo patrón (L156 y siguientes), 3 breakpoints, **fallback en `.webp`** (no `.jpg`/`.png` como en la home — inconsistencia entre home y categoría para las mismas fotos):
```html
<a class='product-card' href='/products/storage-tent-6x6'>
  <div class="product-card__media">
    <picture>
      <source type="image/webp" srcset="../assets/images/rundbogenhalle-6x6-01-800.webp 800w, ../assets/images/rundbogenhalle-6x6-01-1200.webp 1200w, ../assets/images/rundbogenhalle-6x6-01.webp 2000w">
      <img src="../assets/images/rundbogenhalle-6x6-01.webp" alt="Arched Storage Tent 6.10 × 6.10 × 3.66 m" loading="lazy" decoding="async">
    </picture>
  </div>
  ...
</a>
```
Ninguno de los 11 `<source>` lleva `sizes`. `<link rel="preload">` de la página (L23) apunta a un único fichero con `href` (no `imagesrcset`, a diferencia de la home):
```html
<link rel="preload" as="image" href="../assets/images/rundbogenhalle-9x20-05.webp" type="image/webp" fetchpriority="high">
```
El fondo visual del `.page-hero` de esta página (L130) es **CSS `background-image`**, no `<img>`:
```html
<div class="page-hero__bg" style="background-image:url('../assets/images/rundbogenhalle-12x24-01.jpg')"></div>
```
— es decir: el `<link preload>` (L23) precarga `rundbogenhalle-9x20-05.webp`, pero el fondo visible del hero de esta página usa `rundbogenhalle-12x24-01.jpg`. **Dos ficheros distintos** — el preload no coincide con el LCP real de esta plantilla.

---

## 3. Inventario de imágenes — producto (`storage-tent-9x20.html`)

Dos usos de la **misma imagen base**, con tratamientos distintos, en la misma página:

**A) Fondo de hero** (L129, `.page-hero__bg`, CSS `background-image`, sin variantes):
```html
<div class="page-hero__bg" style="background-image:url('../assets/images/rundbogenhalle-9x20-01.webp')"></div>
```

**B) Galería principal** (`.gallery__main`, único bloque de galería en esta página — **sin `srcset`, sin miniaturas**):
```html
<div class="gallery__main">
  <picture>
    <source type="image/webp" srcset="../assets/images/rundbogenhalle-9x20-01.webp">
    <img src="../assets/images/rundbogenhalle-9x20-01.webp" alt="Arched Storage Tent 9.15 × 20 × 4.50 m" loading="eager" decoding="async">
  </picture>
</div>
```
`loading="eager"` explícito — no es un caso aislado de esta muestra: es el patrón estándar y deliberado de `.gallery__main` en **las 36 páginas de `site/products/`** (`grep -rc 'loading="eager"' site/products/*.html` → 36/36, ninguna en 0; `grep -rl 'loading="eager"' site/ home.html` → 36 ficheros, todos dentro de `site/products/`), candidato a LCP de cada ficha de producto. No hay `[data-gallery-thumb]` en este fichero (`grep -c` = 0) pese a que `main.js` define lógica de miniaturas de galería (`document.querySelectorAll('[data-gallery-thumb]')`, ver §4) y CSS define `.gallery__thumbs{grid-template-columns:repeat(5,1fr)}` / `.gallery__thumb{aspect-ratio:1/1}` (L661–669): en esta página concreta el componente de miniaturas queda sin uso (una sola imagen de producto). **Confirmado contra las 36 páginas de `site/products/`: `[data-gallery-thumb]` no aparece en ninguna** (`grep -l 'data-gallery-thumb' site/products/*.html` → 0 resultados) — `.gallery__thumbs`/`.gallery__thumb` es CSS sin uso en todo el espejo, no solo en la página muestreada.

`<link rel="preload">` de esta página (L23) apunta al mismo fichero que la galería:
```html
<link rel="preload" as="image" href="../assets/images/rundbogenhalle-9x20-01.webp" type="image/webp" fetchpriority="high">
```
Aquí sí coincide preload ↔ imagen mostrada — a diferencia de los casos de §5.2.

`og:image` de esta página (L28) apunta a una **tercera variante**, `.png` (2,77 MB): `https://globotent.de/../assets/images/rundbogenhalle-9x20-01.png` (obsérvese también el dominio mal formado `globotent.de/../assets/...`, artefacto de generación presente en **77 de las 78 páginas** — todas excepto la home, `site/index.html`, cuyo `og:image` sí resuelve al dominio real `globotent.com`, L28: `https://globotent.com/assets/images/hero_banner_1.jpg`; en `site/pages/jobs/*.html` (3 páginas) el patrón usa `../../assets` en vez de `../assets` por estar un nivel más anidadas — mismo artefacto, variante de ruta distinta).

---

## 4. Convención de nombres de fichero

Patrón observado: `{familia}-{ancho}x{largo}-{variante:02d}[-{breakpoint}].{ext}`

| Segmento | Ejemplos | Significado |
|---|---|---|
| Familia | `rundbogenhalle`, `satteldachhalle`, `reitplatzueberdachung`, `padel-court`, `pickleball-1-court`, `team-globotent`, `hero-*` | Categoría/serie de la foto (alemán para arcos/satteldach = nombres de producto internos, aunque el sitio esté en inglés) |
| Dimensión | `9x20`, `12x24`, `20x40` | Ancho×largo del modelo (m), cuando aplica |
| Variante | `-01`, `-02`, `-05` | Número de foto dentro de esa familia/dimensión, 2 dígitos |
| Breakpoint | `-800`, `-1200`, (ninguno = base/original) | Ancho de exportación en px — **pero no siempre coincide con el ancho real del fichero** (ver §1.1) |
| Extensión | `.webp` (siempre presente), `.jpg` / `.png` (fallback, uno de los dos, no ambos) | Formato |

No hay sufijo de calidad ni de densidad (`@2x`, `-q80`), no hay AVIF en ningún fichero del inventario (`assets_all.txt`, 269 líneas, ninguna `.avif`).

---

## 5. Rendimiento — pistas de LCP y discrepancias verificadas

### 5.1 Mecanismo declarado (cuando funciona)

Home usa `<link rel=preload as=image imagesrcset= imagesizes= fetchpriority=high>` **sin `href`** apuntando al primer slide del carrusel (§1.1), más `fetchpriority="high"` directo en su `<img>`. Páginas de categoría/producto usan la forma simple `<link rel=preload as=image href=... type=... fetchpriority=high>` apuntando a un único fichero (§2, §3).

`fetchpriority="high"` aparece en **1 lugar por página** (L23, `<link rel=preload>`) en las 78 páginas de `site/` — confirmado por censo `grep -rn fetchpriority`. `home.html` es copia de `site/index.html` (mismo fichero según el espejo, no cuenta como página 79ª). De las 78, exactamente **2** repiten `fetchpriority="high"` una segunda vez, en el `<img>` inline del hero (`site/index.html` L130 y `site/pages/sport.html` L131) — el resto de páginas (categoría, producto, páginas interiores) solo lo lleva en el `<link preload>`, no en ningún `<img>`.

### 5.2 Discrepancias verificadas: el preload no siempre apunta al recurso realmente pintado

| Página | `<link rel=preload>` (L23) | Recurso realmente pintado como fondo/LCP | ¿Coincide? |
|---|---|---|---|
| `site/products/storage-tent-9x20.html` | `rundbogenhalle-9x20-01.webp` | `.gallery__main` + `.page-hero__bg` usan el mismo fichero | Sí |
| `site/categories/storage-tents.html` | `rundbogenhalle-9x20-05.webp` | `.page-hero__bg` → `rundbogenhalle-12x24-01.jpg` | **No** — fichero distinto |
| `site/pages/all-models.html` | `hero_banner_1.webp` | `.page-hero__bg` → `hero_banner_1.jpg` | Mismo fichero, **formato distinto** (precarga webp, se pinta jpg) |
| `site/pages/faq.html` | `hero_banner_1.webp` | `.page-hero__bg` → `hero_banner_1.jpg` | Igual que arriba |
| `site/pages/about-us.html` | `About_page_image_1.webp` | `.page-hero__bg` → `hero_banner_1.jpg` | **No** — ni fichero ni formato coinciden |
| `site/pages/contact.html` | `hero_banner_1.webp` | `.page-hero__bg` → `hero-banner-2.jpg` | **No** — fichero distinto |
| `site/projects/agroindustrial-extremadura.html` | `satteldachhalle-15x40-03.webp` | `.page-hero__bg` → `satteldachhalle-15x40-03.png` | Mismo fichero, **formato distinto** |
| `site/projects/family-olive-farm-jaen.html` | `rundbogenhalle-9x20-01.webp` | `.page-hero__bg` → `rundbogenhalle-9x20-01.png` | Mismo fichero, **formato distinto** |
| `site/projects/family-winery-penedes.html` | `Arched_Shelter_12x9_15x4_5_m_Green.webp` | `.page-hero__bg` → `Arched_Shelter_12x9_15x4_5_m_Green.jpg` | Mismo fichero, **formato distinto** |
| `site/projects/fruit-cooperative-murcia.html` | `rundbogenhalle-12x24-01.webp` | `.page-hero__bg` → `rundbogenhalle-12x24-01.jpg` | Mismo fichero, **formato distinto** |
| `site/projects/grain-trader-la-rioja.html` | `satteldachhalle-15x40-02.webp` | `.page-hero__bg` → `satteldachhalle-15x40-02.png` | Mismo fichero, **formato distinto** |
| `site/projects/large-farm-lleida.html` | `satteldachhalle-15x40-01.webp` | `.page-hero__bg` → `satteldachhalle-15x40-01.png` | Mismo fichero, **formato distinto** |
| `site/projects/organic-cereal-cooperative.html` | `satteldachhalle-12x30-02.webp` | `.page-hero__bg` → `satteldachhalle-12x30-02.jpg` | Mismo fichero, **formato distinto** |
| `site/projects/mountain-livestock-pyrenees.html` | `rundbogenhalle-6x9-01.webp` | `.page-hero__bg` → `rundbogenhalle-9x12-01.jpg` | **No** — ni fichero ni formato coinciden |

Las 8 páginas de `site/projects/` (fuera del muestreo original de esta tabla, ver §12) repiten la misma discrepancia preload↔pintado en el **100% de los casos (8/8)**, no en una minoría como sugería la muestra inicial de 6 páginas: 7 de 8 con mismo fichero pero formato webp↔jpg/png distinto, y 1 (`mountain-livestock-pyrenees.html`) con fichero base distinto además de formato.

`hero_banner_1` se usa como fondo `.page-hero__bg` genérico en **23 páginas interiores** (censo `grep -rl hero_banner_1` sobre `site/`: 24 ficheros, menos `site/index.html`, que solo lo usa en `og:image`, no en `.page-hero__bg`): `3d-preview`, `about-us`, `all-models`, `calculators`, `compare-shelters`, `contact`, `customer-reviews`, `downloads`, `faq`, `legal-notice`, `machinery-calculator`, `privacy-policy`, `produkte`, `reference-projects`, `request-a-quote`, `round-bale-calculator`, `shelter-finder`, `sustainability`, `team`, `technical-glossary`, `terms-and-conditions`, `thank-you`, `guides/index` — siempre vía **CSS `background-image` inline**, nunca vía `<img>`/`<picture>` — por tanto sin `srcset` posible en ese punto y sin que el navegador pueda descartar el JPG a favor del WebP salvo que el propio HTML elija cuál URL escribir en el `style=`.
`hero_banner_1.jpg` = 197 332 B; `hero_banner_1.webp` = 200 180 B (el WebP es, en este caso concreto, **más pesado** que el JPG — verificado con `curl -sI`, `content-length` real de ambos).

Regla CSS del contenedor (L231–246):
```css
.page-hero{position:relative;min-height:320px;display:flex;align-items:flex-end;color:#fff;padding:0;overflow:hidden;background:#061827}
.page-hero__bg{position:absolute;inset:0;background-size:cover;background-position:center}
.page-hero__bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))}
```

### 5.3 CLS — mecanismo real (casi nunca hay `width`/`height` en HTML)

Censo sobre `site/*.html` + `home.html` (79 ficheros = 78 páginas reales + `home.html`, duplicado de `site/index.html`, §5.1): de **788** etiquetas `<img>` en total, **1 sola** lleva `width=`/`height=` explícitos — `site/pages/sport.html` L131 (ver "Excepción real 2" más abajo). El resto, **787 de 788**, no llevan estos atributos (grep `<img[^>]*width="[0-9]+"` → 1 resultado, no 0). Regla global (`main.pretty.css` L43–46, cerca del `:root`):
```css
img{max-width:100%;display:block;height:auto}
```
La reserva de espacio se hace, en la inmensa mayoría de los casos, por **CSS `aspect-ratio` en el contenedor**, no por atributos HTML. Tabla de selectores con `aspect-ratio` declarado (**18 selectores únicos, 19 declaraciones** — `.calc-viz__canvas` tiene dos, base + breakpoint; `grep -c 'aspect-ratio:' main.pretty.css` → 19):

| Selector | `aspect-ratio` | Lnnn |
|---|---|---|
| `.photo-gallery a` | `4/3` | L416 |
| `.collection-card` | `16/10` | L551 |
| `.product-card__media` | `4/3` | L601 |
| `.gallery__main` | `4/3` | L644 |
| `.gallery__thumb` | `1/1` | L658 |
| `.calc-viz__canvas` | `8/5` (→ `4/3` en `≤560px`) | L1238 / L1618 |
| `.case-card__media` | `4/3` | L2094 |
| `.case-hero__media` | `4/3` | L2179 |
| `.case-gallery__item` | `4/3` | L2303 |
| `.blog-card__media` | `16/9` | L2488 |
| `.before-after` | `16/9` | L2815 |
| `.threed-viewer__canvas` | `16/9` | L2922 |
| `.video-testi__media` | `16/9` | L2966 |
| `.quiz__result-media` | `1` | L3115 |
| `.compare-img-wrap` | `4/3` | L3171 |
| `.sp-disc__media` | `4/3` | L4381 |
| `.choose-card__media` | `16/10` | L5076 |
| `.agro-feature__video` | `16/9` | L5900 |
| Todo `img` dentro de los anteriores | `width:100%;height:100%;object-fit:cover` (26 reglas `object-fit:cover`, tabla completa en §6) | — |

**Excepción real 1** — `.team-wall` (home.html §1.2) **no** tiene `aspect-ratio`: es un `column-count:3` (masonry por columnas CSS) con `.team-wall__item img{display:block;width:100%;height:auto}` (L5438–5441) — sin reserva de espacio, las 10 fotos de equipo pueden causar CLS mientras cargan (mitigado parcialmente por `loading="lazy"`, así que ocurre fuera del viewport inicial en la mayoría de casos, pero no dentro del contenedor una vez visible).

**Excepción real 2** — `site/pages/sport.html` L131, único `<img>` de las 79 páginas con `width=`/`height=` HTML explícitos: `<img src="../assets/logos/padel-logo.png" alt="globotent SPORTS" width="200" height="80" fetchpriority="high">`. Coincide con el segundo caso de `fetchpriority="high"` inline citado en §5.1 — es la misma línea. `padel-logo.png` mide realmente 1000×400 px (`file`), proporción 2.5:1, exactamente la que declaran 200×80 — el único caso del sitio donde el width/height HTML coincide con el fichero real (a diferencia del `manifest.webmanifest`/`logo.png`, §11.2, donde sí hay descoincidencia).

Logo de cabecera: no tiene `width`/`height` HTML, pero sí altura fijada en CSS — `.site-header__logo img{height:56px;width:auto}` (regla base) y `.site-header__logo img{height:42px}` en `≤600px` (L5321) — el navegador reserva 56px de alto antes de que la imagen cargue, sin CLS práctico pese a no llevar atributos HTML.

**→ Traducción a Next/Tailwind/shadcn:** Tailwind 3.4 cubre `aspect-ratio` como utilidad **core** desde 3.0 — no hace falta el plugin `@tailwindcss/aspect-ratio` ni el componente `AspectRatio` de shadcn/ui (basado en Radix): `aspect-[4/3]`, `aspect-[16/10]`, `aspect-[16/9]`, `aspect-square` (`.quiz__result-media`, `aspect-ratio:1`) cubren todos los valores de la tabla. Caso con breakpoint (`.calc-viz__canvas`, L1238/L1618): mobile-first, base `aspect-[4/3]` (el valor de `≤560px`, L1618) y `sm:aspect-[8/5]` a partir del breakpoint `sm` de Tailwind (640px, el más cercano al `min-width` implícito de la regla base) — **no** `md:`, que invertiría el orden real (el original aplica `4/3` en pantallas *pequeñas*, `8/5` en el resto, no al revés).

---

## 6. `object-fit` / `object-position` — tabla completa

26 declaraciones `object-fit:cover` en `main.pretty.css`, ninguna con otro valor (no hay `contain`, `fill`, `none` ni `scale-down` en todo el CSS). Selectores:

`.photo-gallery img` · `.collection-card img` · `.product-card__media img` · `.gallery__main img` · `.gallery__thumb img` · `.testimonial__author img` · `.case-card__media img` · `.case-hero__media img` · `.case-hall-card img` · `.case-gallery__item img` · `.blog-card__media img` · `.blog-related img` · `.team-card__media img` · `.before-after img` · `.video-testi__media img` · `.quiz__result-media img` · `.compare-img-wrap img` · `.hero__video` (el propio `<video>`, no un `img` hijo — **declarado en CSS, sin uso en el HTML del espejo**: `grep -rn hero__video site/ home.html` → 0 resultados; la regla asociada `.hero__video::cue{display:none}` sugiere que en algún momento se contempló un `<video>` con pistas `<track>` de subtítulos, ocultadas deliberadamente) · `.sp-disc__media img` · `.sp-video__media` · `.site-nav__mega .mega-item img` (con `width:58px;height:44px` fijos, L4585) · `.choose-card__media img` · `.lead-slide img` · `.home-montage__bg` (el `<video>`) · `.agro-feature__video img` · `.cine-hero__bg img`.

`object-position` — solo 3 declaraciones, las 3 dentro de `.cine-hero__bg` (L5995–5999):
```css
.cine-hero__bg img{object-position:center}
.cine-hero__bg:nth-child(1) img{object-position:center 62%}
.cine-hero__bg:nth-child(3) img{object-position:center 58%}
```

**→ Traducción a Next/Tailwind/shadcn:** `object-cover` para las 26 declaraciones de `object-fit:cover`; `object-center` para la regla base `.cine-hero__bg img{object-position:center}`; `object-[center_62%]` / `object-[center_58%]` (guion bajo en vez de espacio dentro del valor arbitrario) para los 2 overrides de `.cine-hero__bg:nth-child(1)`/`(3)`.

---

## 7. Iconos — catálogo completo de SVG inline

Censo `grep` sobre las 78 páginas + `home.html`: solo **4 formas de SVG inline** existen en todo el sitio (deduplicando por firma de apertura `<svg ...>`):

| Icono | `viewBox` | Atributos de apertura | Repeticiones (censo) | Uso |
|---|---|---|---|---|
| Teléfono | `0 0 24 24` | `stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"`, `width="18" height="18"` | 79 (1 por página, cabecera) | `.site-header__phone` |
| WhatsApp | `0 0 32 32` | `aria-hidden="true"`, `<path fill="currentColor" d="M16 3C9 3 3.5...">` | 79 (1 por página, botón flotante) | `.wa-fab` |
| Estrella | `0 0 24 24` | `fill="#f4c95e"`, tres tamaños: `width/height="14"` (×10), `"16"` (×57), `"18"` (×2) | 69 total | `.stars` (reseñas, rating badge) |
| Iconos de calculadora (3 formas distintas) | `0 0 64 48` | dibujados con `<rect>`/`<circle>`/`<line>`, sin `<path d=...>` | 3 (1 sola página real, `home.html` = `site/index.html`, contados ×2 por la duplicación del espejo) | `.calc-card__icon`, **solo en `home.html`** (Round Bale, Machinery, Compare) — pese al nombre de la clase, **no aparecen en `site/pages/calculators.html`** (`grep -c 'calc-card__icon\|viewBox="0 0 64 48"' site/pages/calculators.html` → 0) |

Las cifras de repeticiones de teléfono/WhatsApp/estrella (79, 79, 69) incluyen la duplicación `home.html`≈`site/index.html`: son **78 páginas reales**, no 79 — el mismo problema de doble conteo que afecta a los iconos de calculadora.

Path literal completo del icono de teléfono (idéntico en las 79 páginas):
```html
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
```
Path literal de estrella (repetido, tamaño 16 usado como ejemplo):
```html
<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="#f4c95e" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
```
Path literal completo del icono WhatsApp (idéntico en las 79 páginas, `home.html` L594–595):
```html
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill="currentColor" d="M16 3C9 3 3.5 8.6 3.5 15.5c0 2.4.7 4.8 2 6.8L3 29l6.9-2.3c2 1.1 4.2 1.7 6.1 1.7 7 0 12.5-5.6 12.5-12.5C28.5 8.6 23 3 16 3zm0 22.9c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1-1.6-1.5-3.5-1.5-5.4 0-5.8 4.7-10.5 10.2-10.5S26.2 9.7 26.2 15.5 21.5 25.9 16 25.9zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .2.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.4.8.5-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z"/>
</svg>
```
Los 3 iconos de calculadora, geometría literal completa (`home.html` L402, L408, L414 — solo existen en `home.html`/`site/index.html`):
```html
<!-- Round Bale Calculator, L402 -->
<svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="12" width="60" height="34" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="12" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="32" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="52" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="22" cy="20" r="8" fill="#fff" opacity=".7"/><circle cx="42" cy="20" r="8" fill="#fff" opacity=".7"/></svg>
<!-- Machinery Calculator, L408 -->
<svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="12" width="60" height="34" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="10" y="22" width="20" height="12" fill="#fff"/><circle cx="14" cy="38" r="4" fill="#0d4f3f"/><circle cx="26" cy="38" r="5" fill="#0d4f3f"/><rect x="34" y="26" width="18" height="10" fill="#fff" opacity=".75"/><circle cx="40" cy="38" r="3" fill="#0d4f3f"/><circle cx="48" cy="38" r="3" fill="#0d4f3f"/></svg>
<!-- Compare Shelters, L414 -->
<svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="14" width="22" height="30" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="38" y="14" width="22" height="30" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><line x1="28" y1="29" x2="36" y2="29" stroke="#fff" stroke-width="2.5"/><line x1="32" y1="25" x2="36" y2="29" stroke="#fff" stroke-width="2.5"/><line x1="32" y1="33" x2="36" y2="29" stroke="#fff" stroke-width="2.5"/></svg>
```

**No existe como SVG:** chevron, flecha, check ni cruce de cierre. **No está en el código como icono vectorial** — son glifos de texto Unicode o CSS `content`:
- Chevron del menú: `<span class="site-nav__chev" aria-hidden="true">▾</span>` (home.html L53) y, en móvil, generado por CSS `content:"▾"` en `.site-nav__group.has-dropdown>.site-nav__main::after` (media_blocks.txt, bloque `≤900px`).
- Flechas de CTA: carácter `→` literal dentro del texto del enlace (`View agricultural halls →`, home.html L137), no SVG.
- Flechas del lightbox: `‹` / `›` como texto de botón (home.html L586, L588).
- Slider "before/after": `↔` como texto (home.html L385).
- Cierre de modal: entidad `&times;` (home.html L585, L604).
- Icono del popup de salida: emoji `⏱️` literal en el HTML (home.html L605).
- Pin de ubicación en tarjetas de caso: emoji `📍` literal (home.html L434).
- Check de confirmación (banner de formulario, `main.js` L570): `✓` como texto dentro de un `innerHTML`, no SVG.

**→ Traducción a Next/Tailwind/shadcn:** el proyecto prohíbe librerías de iconos, y aquí se confirma que el original tampoco usa ninguna (ni Feather, ni Lucide, ni Heroicons como paquete — el SVG del teléfono es de estilo "Feather" pero está pegado a mano, no importado). Para Pavivasa: 4 componentes SVG inline (`<PhoneIcon>`, `<WhatsappIcon>`, `<StarIcon size=14|16|18>`, y los que haga falta para hormigón — sello de calidad, check, etc.) en lugar de un paquete de iconos; chevrons/flechas se pueden mantener como glifo de texto o subirlos a SVG propio si se quiere marca coherente (el original usa glifo de texto precisamente para ahorrarse ese SVG).

---

## 8. Vídeo

**Dos `<video>` reales en las 78 páginas, con mecanismos distintos.** El censo ingenuo de una sola línea (`grep -rhoE '<video[^>]*>'`) da **1 resultado** — `.home-montage__bg` — porque el segundo tag real, `.sp-video__media` en `site/pages/sport.html`, abre y cierra su `>` en líneas distintas y ese patrón no cruza el salto de línea; confirmado con `perl -0777 -ne 'while (/<video.*?>/gs){print}'` sobre el mismo corpus, que sí lo captura (un barrido equivalente sobre `<img>`, `<link rel="preload">` y `fetchpriority` no encontró más tags partidos en varias líneas — parece ser el único punto ciego de este tipo). El primero, de fondo de `.home-montage`, está presente en `home.html`/`site/index.html` únicamente (ver mecanismo de carga condicional abajo); el segundo se documenta en su propia subsección más adelante. `data-hero-video` (mencionado en `main.js`, ver abajo) **no está en el código HTML de ninguna de las 78 páginas** — es lógica muerta o reservada para una plantilla no incluida en el espejo.

Marcado literal (home.html L194):
```html
<video class="home-montage__bg" muted loop playsinline preload="none" poster="assets/images/reitplatz-aufbau-poster.jpg" data-bg-video="assets/video/reitplatz-aufbau.mp4"></video>
```
`autoplay` **no** está en el HTML — se añade por JS solo cuando el vídeo entra en carga (ver mecanismo abajo). `muted`, `loop`, `playsinline`, `preload="none"` sí están en el HTML desde el principio.

**Metadatos reales del fichero** (`ffprobe` contra la URL en producción, `https://globotent.com/assets/video/reitplatz-aufbau.mp4`):

| Propiedad | Valor |
|---|---|
| Contenedor | `mov,mp4,m4a,3gp,3g2,mj2` (MP4) |
| Códec vídeo | `h264`, `profile=High`, `level=31` |
| Resolución | `1152×648` |
| `display_aspect_ratio` | `16:9` |
| Frame rate | `25/1` (25 fps), `nb_frames=2270` |
| `pix_fmt` | `yuv420p` |
| Duración | `90.8` s |
| Tamaño | `8 964 844` B (≈8,55 MiB) |
| Bitrate (contenedor, `format.bit_rate`) | `789 854` bps (≈790 kbps) |
| Bitrate (stream de vídeo, `stream.bit_rate`) | `787 370` bps |
| Pista de audio | **ninguna** — solo 2 streams: `index=0 codec_type=video (h264)`, `index=1 codec_type=data (codec_name=unknown)`. No hay `codec_type=audio`. |
| Poster | `reitplatz-aufbau-poster.jpg`, 172 231 B |

**Mecanismo de carga condicional**, literal (`main.js`, bloque final, líneas ~722–744):
```js
(function(){
  var v = document.querySelector('video[data-bg-video]');
  if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  if (conn && conn.saveData) return;            // Data-Saver an → nur Poster zeigen
  function load(){
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    var s = document.createElement('source');
    s.src = v.getAttribute('data-bg-video'); s.type = 'video/mp4';
    v.appendChild(s); v.autoplay = true; v.muted = true; v.load();
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ load(); io.disconnect(); } });
    }, { rootMargin: '200px' });
    io.observe(v);
  } else { load(); }
})();
```
Resumen del mecanismo: 1) si `prefers-reduced-motion:reduce`, el vídeo nunca carga (solo se ve el `poster`); 2) si `navigator.connection.saveData` está activo, tampoco carga; 3) si pasa ambos filtros, un `IntersectionObserver` con `rootMargin:'200px'` (dispara 200px antes de entrar en viewport) crea dinámicamente un `<source src=... type="video/mp4">`, fija `autoplay=true` y `muted=true` por JS, y llama a `.load()` + `.play()` con `.catch()` silencioso (autoplay bloqueado por el navegador no rompe nada). `preload="none"` en el HTML asegura que, si el usuario nunca llega a esa sección, ni siquiera se pide el `poster` de forma prioritaria ni metadatos del vídeo.

Código relacionado pero **sin markup que lo dispare** en la muestra: `main.js` también define un manejador para `[data-hero-video]` (`error` → oculta el vídeo; `setTimeout` de 2500 ms comprobando `readyState===0` → lo oculta si no cargó) y un manejador de clic para `.video-testi__play` que inyecta un `<video controls autoplay playsinline>` con `btn.dataset.videoSrc`, más la CSS `.video-testi__media{aspect-ratio:16/9}` — ninguno de los dos tiene HTML correspondiente en las páginas descargadas. No se puede confirmar si existen en alguna de las 78 páginas no citadas explícitamente arriba (ver §12).

### Segundo `<video>`, mecanismo distinto — `.sp-video__media`

Marcado literal (`site/pages/sport.html` L191–194):
```html
<video class="sp-video__media" autoplay muted loop playsinline preload="none"
       poster="../assets/images/reitplatz-aufbau-poster.jpg">
  <source src="../assets/video/reitplatz-aufbau.mp4" type="video/mp4">
</video>
```
Reutiliza el mismo fichero `reitplatz-aufbau.mp4` que `.home-montage__bg`, pero con un mecanismo completamente distinto:
- `autoplay` está escrito **directamente en el HTML** — no se inyecta por JS como en `.home-montage__bg`.
- El `<source>` es un **hijo estático** del `<video>`, no se construye dinámicamente vía `data-bg-video` + JS.
- **No lleva `data-bg-video`** ni ningún `data-*` — no pasa por ningún gate: se reproduce siempre, sin comprobar `prefers-reduced-motion` ni `navigator.connection.saveData`.

Es decir: "único `<video>` real" (párrafo de apertura de esta sección, corregido arriba) era falso — son 2, y solo uno de los dos respeta el gate de accesibilidad/conexión de 3 capas descrito abajo.

**→ Traducción a Next/Tailwind/shadcn:** replicar el gate de 3 capas (`prefers-reduced-motion` → `navigator.connection.saveData` → `IntersectionObserver`) como hook `useConditionalVideo` de cliente — el patrón a copiar es el de `.home-montage__bg`, **no** el de `.sp-video__media` (que reproduce siempre vía `autoplay` nativo, sin respetar accesibilidad ni Data-Saver: es el patrón a evitar). El `<video>` en sí no necesita `next/video` (no existe en Next) — usar `<video>` nativo; `poster` exige una URL de cadena y **no admite** el componente `<Image>` directamente, así que sigue necesitando una URL de archivo estático servida desde `public/` (o generada en build por `next/image` y referenciada por su URL final). Si se quiere el beneficio visual de `next/image` en pantalla (blur-up, formatos modernos), superponer un `<Image fill priority>` que se oculte al evento `playing` del `<video>`, en vez de pasarlo como `poster`.

---

## 9. Fuentes

`<head>`, literal (home.html L18–22), idéntico en las 78 páginas:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"></noscript>
```
Familia: **Figtree**, fuente variable, rango solicitado `wght@300..900` (peso mínimo 300, máximo 900), `display=swap`. Técnica "preload + `media=print` + `onload`" para cargar el CSS de Google Fonts sin bloquear el render (patrón clásico anti-render-blocking, sin librería).

Token CSS: `--font-family:'Figtree',system-ui,-apple-system,sans-serif` (cerca de `:root`, también documentado en `01-fundamentos.md`).

**Pesos (`font-weight`) realmente usados en `main.pretty.css`** (censo completo, no solo el header):

| Peso | Nº de declaraciones |
|---|---|
| 800 | 70 |
| 700 | 46 |
| 600 | 36 |
| 500 | 5 |
| 400 | 4 |
| 300 | 1 |
| 900 | **0** |

Se solicita a Google Fonts el rango completo `300..900` (fuente variable, un único fichero para todo el rango) pero **900 no se usa nunca** en el CSS del sitio.

**"Clash Display" — declarada pero no cargada, confirmado:**
```css
.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1{font-family:'Clash Display',var(--font-family)}
```
(7 apariciones de `font-family:'Clash Display',var(--font-family)`, todas dentro del ámbito `.sport-world`/`.sp-*`/`.world-panel__h2--sport`/`.world-block--sport`). **No hay ningún `@font-face` en `main.pretty.css`** (`grep -c @font-face` = 0) ni ningún `<link>` que cargue "Clash Display" en el `<head>` de ninguna página. Consecuencia real: el navegador nunca encuentra 'Clash Display' instalada ni descargable, y cae directamente al segundo valor de la lista, `var(--font-family)` = Figtree — es decir, **todos los títulos del mundo "SPORTS" se renderizan en Figtree pese a pedir Clash Display**, sin que se note como fuente rota porque el propio CSS ya provee el fallback dentro de la misma declaración.

**→ Traducción a Next/Tailwind/shadcn:** `next/font/google` con `Figtree` auto-hospeda el fichero en build (Next lo descarga en build time y lo sirve desde el propio dominio) — **cero petición runtime** a `fonts.googleapis.com`/`fonts.gstatic.com`, por lo que el patrón `preconnect` + `preload as=style` + `media=print`+`onload` que usa el original (arriba) queda obsoleto y no debe replicarse: es precisamente la razón de usar `next/font/google`. Para conservar el comportamiento de fuente variable del original (`wght@300..900`), **omitir `weight`** (o usar `variable:'--font-figtree'` sin fijar pesos) en vez de pasar `weight: ['300',...,'800']` — un array de pesos fuerza instancias estáticas y renuncia al eje variable. Si Pavivasa quiere una display font real para un "mundo" propio (a diferencia de Globotent, que la declaró y nunca la cargó), cargarla de verdad con `next/font/local` o `next/font/google` — no repetir el error de fuente fantasma.

---

## 10. CSS y JS — bundle único, tamaños reales

| Fichero servido | `?v=` | `content-length` raw | Brotli real descargado (`curl -H "Accept-Encoding: br" --raw`) | `cache-control` (real, `curl -sI`) |
|---|---|---|---|---|
| `assets/css/main.min.css` | `?v=cfc09a15` | 125 019 B | **~21,8–22,0 KB** (Brotli, no determinista — ver nota) | `public,max-age=0,must-revalidate` |
| `assets/js/main.min.js` | `?v=c0f0756b` | 30 225 B | **~8,78–8,94 KB** (Brotli, no determinista — ver nota) | `public,max-age=0,must-revalidate` |

*Nota de método:* 3 descargas sucesivas con `curl -s -H 'Accept-Encoding: br' --raw ... | wc -c` dieron, para el CSS, 21 790 / 21 954 / 21 799 B, y para el JS, 8 781 / 8 935 / 8 896 B — la compresión Brotli al vuelo de Netlify no es determinista entre peticiones idénticas al mismo recurso. Una cifra puntual como "21 928 B" / "8 896 B" cae dentro de este rango observado (y para el JS coincide exactamente con una de las 3 repeticiones); la conclusión de §10.2 (JS <9% del presupuesto de 100 KB) se sostiene igual con el rango.

**El CSS servido sí está minificado; el JS servido no.** `main.css` (125 019 B, sin espacios ni saltos de línea — cabecera literal en §10.1) y `main.min.remote.css` (descargado en vivo de producción) son **idénticos byte a byte**: el CSS de producción está realmente minificado. `main.js` (30 225 B, legible, con saltos de línea) y `main.min.remote.js` (descargado en vivo) también son **idénticos byte a byte** (`diff -q` sin salida) — pero aquí el fichero "fuente" ya es lo que se sirve: **el JS "min" no pasó por ningún minificador**, conserva saltos de línea, nombres de variable legibles (`heroSlider`, `bootstrap3D`, `dlPush`...) y comentarios en alemán. Mismo sufijo `.min.js` en la URL, tratamiento real distinto: CSS comprimido de verdad, JS servido tal cual con el nombre "min" de fachada. (`main.pretty.css`, 140 631 B, es solo el reformateo local hecho para este análisis — no existe en producción.)

`cache-control: public,max-age=0,must-revalidate` en **ambos bundles y en las imágenes comprobadas** (`favicon.png`, `logo.png`, hero JPG/WebP) — no hay `max-age` largo pese al parámetro `?v=<hash>` en la URL (que normalmente serviría para cachear "para siempre" y cambiar solo la URL en cada deploy). El servidor es **Netlify** (`server: Netlify`, `cache-status: "Netlify Edge"`), con Brotli automático (`content-encoding: br` cuando el cliente lo acepta) y ETag por fichero.

### 10.1 Cabecera literal del CSS minificado (primeros ~700 caracteres, `main.css`)
```css
:root{--brand-green:#1aa585;--brand-green-dark:#12755e;--brand-green-deep:#007a4a;--brand-green-deep-hover:#0d614c;--brand-lime:#7ec700;--brand-lime-hover:#84d814;--brand-dark:#061827;--brand-navy:#0f1428;--color-title:#151719;--color-text:#535353;--color-sub-title:#535353;--color-link:#222222;--color-border:#e2e2e2;--color-bg:#ffffff;--color-bg-soft:#f6f8f7;--button-corner:50px;--button-font-weight:800;--button-text-transform:uppercase;--button-large-height:56px;--button-medium-height:56px;--button-normal-height:44px;--font-family:'Figtree',system-ui,-apple-system,sans-serif;--body-font-weight:400;--body-line-height:1.5;--container:1280px;--radius:12px;--shadow-card:0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06);--shadow-header:0 2px 16px rgba(6,24,39,.08)}
```

### 10.2 `three.js` y `model-viewer` — cargados bajo demanda desde CDN, no en el bundle

`main.js` (bloque `.threed-viewer`, líneas ~410–424) carga dos scripts externos dinámicamente, solo si el visor 3D entra en el viewport (`IntersectionObserver` con `rootMargin:'200px'`), literal:
```js
loadScript('https://unpkg.com/three@0.158.0/build/three.min.js').then(() => {
  loadScript('https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js').then(() => init3D());
})
```
Y para el botón de Realidad Aumentada (`[data-ar-btn]`, líneas ~519–546), carga `model-viewer` bajo demanda al clic:
```js
s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
```
Coherente con los `<link rel="dns-prefetch" href="https://unpkg.com">` y `<link rel="dns-prefetch" href="https://ajax.googleapis.com">` presentes en el `<head>` de las 78 páginas (home.html L24–25) — el DNS se resuelve pronto pero el script solo se descarga si el usuario realmente interactúa con esa función, así el bundle propio (`main.min.js`, ~8,8 KB br) no carga nunca Three.js (que por sí solo pesa cientos de KB) salvo que haga falta.

**→ Traducción a Next/Tailwind/shadcn — presupuesto de 100 KB JS comprimido:**
Globotent entrega el sitio completo (78 páginas) con **~8,8 KB de JS Brotli** (rango observado 8 781–8 935 B, ver nota de método arriba) — menos del 9% de un presupuesto de 100 KB. El mecanismo que lo logra, trasladable a Pavivasa:
1. Un único bundle vanilla, sin framework de UI en cliente, sin librería de carrusel/lightbox/animación (todo escrito a mano sobre `IntersectionObserver`, `matchMedia`, delegación de eventos).
2. Cero JS por defecto para funciones pesadas (3D, AR): `dynamic(() => import(...), { ssr: false })` en un componente **cliente** (`"use client"`; `ssr:false` no está permitido dentro de un Server Component en Next 15 App Router) para el visor 3D equivalente a `three.js`/`OrbitControls`; para AR (`model-viewer`), cargar el script vía `next/script` con `strategy="lazyOnload"` (no `"worker"`: esa estrategia es experimental, requiere `experimental.nextScriptWorkers` + Partytown, e inadecuada para librerías que necesitan acceso directo al hilo principal y a un `<canvas>`, como `three.js`), disparada por el mismo patrón de `IntersectionObserver`.
3. El `reveal`/scroll-in (`.reveal.is-visible`, `IntersectionObserver` con `threshold:0.12, rootMargin:'0px 0px -60px 0px'`) se puede resolver en Pavivasa con un hook de cliente mínimo (unas 20 líneas) en vez de una librería de animación (Framer Motion añadiría bastante más de los 8,7 KB usados aquí para *todo* el JS).
4. Sin librería de iconos (§7) ni de fechas/formularios visibles en `main.js` — los formularios usan atributos nativos (`data-netlify`) y validación HTML5 implícita.

---

## 11. Service worker, manifest, favicon

### 11.1 `sw.js` — existe, se auto-desactiva

`curl -s -o /dev/null -w "%{http_code}" https://globotent.com/sw.js` → **200**. Contenido completo (literal):
```js
// Service Worker — selbst-deaktivierend während aktive Entwicklung.
// Räumt alte Caches auf, deregistriert sich, lädt direkt aus dem Netz.
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) { client.navigate(client.url); }
  })());
});
self.addEventListener('fetch', e => { /* no-op, alles aus dem Netz */ });
```
Es decir: al activarse, borra **todas** las caches existentes, se **desregistra a sí mismo** y fuerza recarga de las pestañas abiertas; el handler de `fetch` no hace nada (`no-op`, todo va a red). El propio comentario en alemán lo confirma: "autodesactivante durante desarrollo activo". Pese a esto, `main.js` (línea ~561) sigue registrándolo en cada carga:
```js
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
```
Efecto neto: cero beneficio de cache offline (nunca llega a cachear nada útil), coste de un registro + un ciclo de instalación/activación/limpieza en cada visita.

### 11.2 `manifest.webmanifest`

```json
{
  "name": "Globotent",
  "short_name": "Globotent",
  "description": "Rundbogenhallen, Weidezelte & Satteldachhallen",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1aa585",
  "icons": [
    { "src": "/assets/logo.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/assets/logo.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```
`description` está en alemán pese a que el sitio (`.com`) es inglés — artefacto de generación multi-idioma no localizado para este manifest. **Los tamaños declarados no coinciden con el fichero real**: `sizes:"512x512"` y `sizes:"192x192"` apuntan ambos al mismo `/assets/logo.png`, cuya dimensión real medida es **872×548 px** (ni cuadrado ni ninguno de los dos tamaños declarados).

### 11.3 Favicon / iconos de pestaña

`<link rel="icon" type="image/png" href="assets/images/favicon.png">` (home.html L33) — único `<link rel="icon">` por página, **PNG 64×64 px** (2 034 B), sin `.ico`, sin SVG, sin `sizes=` en el `<link>`. Censo `grep -n 'apple-touch-icon\|shortcut icon\|mask-icon'` sobre home.html y una muestra de páginas → **0 resultados**: no hay `apple-touch-icon` en el código.

**→ Traducción a Next/Tailwind/shadcn:** Next 15 App Router resuelve favicon/`apple-icon`/manifest por convención de fichero en `app/` (`icon.png`, `apple-icon.png`, `manifest.ts`) — usar esa convención en vez de `<link>` manuales, y sí incluir `apple-touch-icon` (ausente en el original, hueco a cubrir). Para el Service Worker: si Pavivasa no necesita funcionalidad offline real, no añadir ninguno (el propio Globotent demuestra que uno que se autodesactiva no aporta nada); si se quiere PWA de verdad, usar `next-pwa`/Workbox con estrategia de cache explícita, no replicar el patrón "se registra y se borra a sí mismo".

---

## 11.4 → Traducción: `next/image` `quality` y estructura de `public/`

**`quality` de `next/image`:** el original no tiene pipeline de calidad automática — las variantes `-800`/`-1200`/base se exportaron a mano, con el resultado inconsistente ya documentado (§1.1: duplicados de bytes en `hero-almacen` y 4 de las 10 fotos de equipo; §1.3: fallback `.png` de 2,77 MB conviviendo con su equivalente `.webp` de 251 KB). `quality` en `next/image` (junto con `sizes` bien calculado y generación automática de variantes en build) sustituye exactamente ese trabajo manual y elimina la clase de error verificada aquí (variantes que en realidad no varían). Para Pavivasa: `quality={75}` (default) como punto de partida, sin exportar variantes a mano.

**Estructura de `public/`:** el inventario real de Globotent es plano — `assets/images/` con ~230 ficheros sin subcarpetas por tipo (heroes, productos, equipo y iconos PNG conviven en el mismo directorio), y una única excepción, `assets/logos/` (usada solo para `padel-logo.png`, la variante de logo del mundo "SPORTS"). Es el contraejemplo a no repetir: para Pavivasa, separar `public/images/{hero,productos,equipo,proyectos}/` y `public/icons/` desde el inicio evita el directorio único de 230 ficheros sin criterio que dificultó este propio inventario.

Inventario de las 14 apariciones de `padel-logo.png`: **13** como logo de cabecera alternativo del "mundo SPORTS" (`<img src="../assets/logos/padel-logo.png" alt="Globotent Logo">`, mismo `alt` que el logo normal pese a ser una imagen distinta) en `site/products/{riding-arena-cover-20x30,riding-arena-cover-25x45,riding-arena-cover-20x40,pickleball-2-courts,riding-arena-cover-14x14,riding-arena-cover-20x60,riding-arena-cover-20x20,padel-tennis-cover,riding-arena-cover-20x80,pickleball-1-court}.html` y `site/categories/{pickleball,padel-tennis-covers,riding-arena-covers}.html`; **1** como lockup de hero con `width=`/`height=`/`fetchpriority` explícitos en `site/pages/sport.html` L131 (§5.3, "Excepción real 2"). `padel-logo.png` mide 1000×400 px (`file`).

### 11.5 → Traducción: contrato de props `next/image` por componente

| Componente | Props | Notas |
|---|---|---|
| Hero, slide activo (`.cine-hero__bg.is-active`) | `<Image fill priority sizes="100vw" className="object-cover object-[center_62%]" />` dentro de un contenedor `position:relative` | `priority` sustituye a la vez `fetchpriority="high"` y el `<link rel=preload>` manual (§1.1, §5.1) |
| Hero, slides 2–4 | igual que el activo, **sin** `priority` | equivalente a `loading="lazy"` (§1.1) |
| Muro de equipo (`.team-wall__item img`) | `<Image fill sizes="(max-width:720px) 50vw, 320px" className="object-cover" />` | `sizes` literal calcado del original (§1.2, §1.7) |
| Mega-menú (`.mega-item img`) | `<Image width={58} height={44} sizes="58px" className="object-cover rounded-lg" />` | resuelve el hallazgo de §1.4: en el original se descarga el `.jpg` original completo (410 801 B) para una caja CSS de 58×44 — `next/image` genera la variante real |

`priority` es la traducción directa del único caso verificado de `fetchpriority="high"` + `<link rel=preload>` manual del original (§1.1, §5.1); `fill` sustituye el patrón `background-image` inline de `.page-hero__bg` (§2, §3, §5.2) cuando se quiera el beneficio de `next/image` en esos fondos.

---

## 12. Dudas y límites del muestreo

- **Dimensiones en píxeles verificadas con `file`/`ffprobe`/`md5sum`**: solo los ficheros presentes en `img/`, `dl/`, más 5 comprobaciones puntuales por `curl` remoto (`hero-almacen.webp`/`-1200.webp`, `hero-agricolas.webp`, `hero-almacen.jpg`, `hero_banner_1.webp`, `reitplatz-aufbau.mp4`). El resto de las ~230 rutas de `assets_all.txt` **no se verificó en píxeles ni por hash** — los datos de tamaño en bytes de esas rutas (tablas de §1) vienen de `home_sizes.txt` (descarga real, fiable en bytes) pero no se confirmó su resolución real ni si son duplicados entre sí como los casos de §1.1/§1.2.
- Los ficheros de `tmpimg/` (todos exactamente 65 536 B) son descargas truncadas — **no se usó ningún dato de esa carpeta** en este documento.
- El bloque `.video-testi__play` / `data-video-src` y `[data-hero-video]` de `main.js` no tienen HTML correspondiente en la muestra de 78 páginas descargada — no se puede afirmar que sea código muerto en el sitio completo, solo que no aparece en el espejo local disponible.
- `[data-gallery-thumb]` confirmado contra las **36** páginas de `site/products/`: 0 coincidencias (`grep -l 'data-gallery-thumb' site/products/*.html`) — `.gallery__thumbs`/`.gallery__thumb` es CSS sin uso en todo el espejo, no una duda abierta. Sí queda sin inspeccionar a fondo el detalle línea a línea de marcado de imágenes en el resto de esas 36 páginas de producto (más allá del censo `grep` de `loading=eager`/`[data-gallery-thumb]`, §3) ni de las 5 páginas restantes de `site/categories/`.
- Duplicados de `content-length` en `team-globotent-02/04/06/11` (§1.2): `team-globotent-02` está **confirmado por `md5sum`** para el par `-800`/base (mismo hash, espejo local `dl/`); el `-1200` de esa misma foto y los 3 casos restantes (`04`, `06`, `11`, ninguno presente en `dl/`) siguen sin verificar byte a byte — pendientes de `curl` remoto + `md5sum`. Es razonable asumir el mismo mecanismo (variantes "redimensionadas" que en realidad no se redimensionaron) para todos, pero solo uno está confirmado.
- No se pudo determinar si existe un fichero `_headers` de Netlify con reglas de cache distintas para `assets/` frente al resto (la ruta `/_headers` devuelve la página 404 genérica de Netlify, lo que solo confirma que no es servible como archivo público, no que no exista como configuración interna del build).
- **Cobertura real de la muestra de páginas**: los patrones A/B/D de tarjetas de producto (§1.3) y el censo de galería/miniaturas (§3) están verificados sobre `home.html` + 1 página de categoría (`storage-tents.html`) + 1 página de producto (`storage-tent-9x20.html`). Las 8 páginas de `site/projects/` sí se inspeccionaron a fondo a raíz de una corrección posterior: Patrón E (§1.3) y discrepancia preload↔pintado 8/8 (§5.2). No se inspeccionaron a fondo las 5 páginas restantes de `site/categories/` ni el resto de las 36 de `site/products/` más allá del censo `grep` — los censos globales (`grep -rn`/`grep -rl` sobre `site/*.html`, `site/*/*.html`) sí cubren las 78 páginas para patrones puntuales (SVG, `<video>`, `fetchpriority`, `width=` en `<img>`), pero el detalle línea a línea del marcado de imágenes solo se verificó en esas 3 páginas + las 8 de `site/projects/`.
- No se comprobó el comportamiento real de descarga condicional del `<link rel=preload>` sin `href` (§1.1) en ningún motor de navegador — se describe el marcado tal cual está, sin inferir si el navegador lo ignora, usa `imagesrcset` igualmente, o cae a algún candidato por defecto.
- AVIF: confirmado que no aparece ningún `.avif` en `assets_all.txt` (269 líneas) ni se referencia `image/avif` en ningún `<source type=...>` de la muestra — no se revisó el 100% de las 78 páginas carácter a carácter para descartarlo con certeza absoluta, pero el patrón es consistente en toda la muestra inspeccionada (siempre `webp` + `jpg`/`png`, nunca `avif`).
