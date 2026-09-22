# 03 · El hero cinematográfico de Globotent (`.cine-hero`, `data-cine-hero`)

Documento de referencia para (1) Claude Design, que diseñará un hero nuevo para Pavivasa inspirado en este, y (2) Claude Code, que lo implementará en Next.js 15 App Router + Tailwind 3.4 + shadcn/ui.

Fuentes (espejo local de https://globotent.com/):

| Qué | Dónde |
|---|---|
| Markup | `home.html` líneas 129–143 (idéntico a `site/index.html`, verificado con `diff`) |
| CSS | `main.pretty.css` líneas 5973–6156 (es el **último bloque del archivo**: 6156 líneas en total) |
| JS | `main.js` líneas 64–99 (dentro de la primera IIFE `(function(){ 'use strict'; ... })()`) |
| Preload | `home.html` línea 23 |

Solo la home usa `.cine-hero`. Las otras 77 páginas usan `.page-hero` (sección 6.3) o `.sp-hero` (sección 6.4).

---

## 1. Resumen del mecanismo (lo que ve el dueño)

1. Cuatro `<picture class="cine-hero__bg">` apiladas con `position:absolute; inset:0`. Solo la que tiene `.is-active` está a `opacity:1`; el resto a `opacity:0`. El cambio entre capas es un **cross-fade por `transition:opacity 1.1s ease`**.
2. La `<img>` de la capa activa recibe `animation:cineZoom 8s ease-out both` → **`transform:scale(1.04)` → `scale(1.12)`** (Ken Burns lineal, sin desplazamiento, solo escala).
3. Un `setInterval` de **5500 ms** (`var DELAY = 5500`) avanza a la siguiente pestaña. Como 5,5 s < 8 s, **el zoom nunca termina**: en el momento del cambio la imagen va por ≈`scale(1.109)` (progreso 0,861 de la curva `ease-out`, calculado a partir de `cubic-bezier(0,0,.58,1)`).
4. Al cambiar, el JS reescribe `textContent` de eyebrow, h1, sub y CTA desde los `data-*` de la pestaña, cambia el `href` del CTA y relanza `cineSwap` (fade + translateY(11px) de 0,5 s) sobre h1 y sub.
5. Las pestañas (`.cine-tab`) son botones `role="tab"`: click → `show(k)` + reinicio del intervalo. Hover sobre el hero → pausa. Pestaña oculta (`visibilitychange`) → pausa. `prefers-reduced-motion: reduce` → no hay auto-avance ni animaciones, pero las pestañas siguen funcionando.
6. Hay un "mundo" por pestaña (`data-world="industrie"|"sport"`): si es `sport`, el hero recibe `.is-sport` y el color de acento pasa de `var(--brand-green)` (#1aa585) a **`#e3fc03`** (kicker, borde de la tab activa y botón primario).

No hay barra de progreso, no hay flechas, no hay swipe táctil, no hay teclado (flechas), no hay `aria-live`, no se usa `startViewTransition` dentro del hero, no hay detección de `pointer: coarse` en este módulo.

---

## 2. Markup literal (`home.html` 129–143)

### 2.1 Estructura de capas

```
section.cine-hero[data-cine-hero]         position:relative; isolation:isolate; overflow:hidden; flex; align-items:flex-end
├── div.cine-hero__stage                   absolute inset:0; z-index:0
│   ├── picture.cine-hero__bg.is-active[data-cine-bg]   (capa 1, fetchpriority="high")
│   ├── picture.cine-hero__bg[data-cine-bg]             (capa 2, loading="lazy")
│   ├── picture.cine-hero__bg[data-cine-bg]             (capa 3, loading="lazy")
│   └── picture.cine-hero__bg[data-cine-bg]             (capa 4, loading="lazy")
├── div.cine-hero__scrim                   absolute inset:0; z-index:1  (gradiente doble)
└── div.container.cine-hero__inner         relative; z-index:2
    ├── p.cine-hero__eyebrow
    │   ├── span.cine-hero__kicker[data-cine-eyebrow]   (cambia con la tab)
    │   └── span.cine-hero__meta                        (fijo: "100+ projects across Europe")
    ├── h1.cine-hero__h1[data-cine-h1]                  (cambia con la tab)
    ├── p.cine-hero__sub[data-cine-sub]                 (cambia con la tab)
    ├── div.cine-hero__actions
    │   ├── a.btn.btn--lg.btn--primary[data-cine-cta]   (texto y href cambian con la tab)
    │   └── a.btn.btn--lg.btn--ghost-light              (fijo: "Request a quote" → /pages/request-a-quote)
    ├── div.cine-hero__rating > a.rating-badge.rating-badge--compact  (fijo: 5 estrellas + "4.96 / 5 from 127+ reviews")
    └── div.cine-hero__tabs[role=tablist]
        ├── button.cine-tab.is-active[data-cine-tab][role=tab][aria-selected=true]  + data-*
        ├── button.cine-tab[data-cine-tab][role=tab][aria-selected=false]           + data-*
        ├── button.cine-tab ...
        └── button.cine-tab ...
```

Las capas `.cine-hero__bg` no tienen `z-index`; se apilan por orden DOM (la capa 4 pinta encima de la 1). El scrim (z-index:1) siempre está por encima de todas las capas, y el contenido (z-index:2) por encima del scrim. `isolation:isolate` en la section crea un stacking context propio.

### 2.2 Markup literal

```html
<section class="cine-hero" data-cine-hero aria-label="Globotent — clear-span buildings &amp; covers">
  <div class="cine-hero__stage"><picture class="cine-hero__bg is-active" data-cine-bg><source type="image/webp" srcset="assets/images/hero-agricolas-800.webp 800w, assets/images/hero-agricolas-1200.webp 1200w, assets/images/hero-agricolas.webp 1920w" sizes="100vw"><img src="assets/images/hero-agricolas.jpg" alt="" fetchpriority="high" decoding="async"></picture><picture class="cine-hero__bg" data-cine-bg><source type="image/webp" srcset="assets/images/hero-almacen-800.webp 800w, assets/images/hero-almacen-1200.webp 1200w, assets/images/hero-almacen.webp 1920w" sizes="100vw"><img src="assets/images/hero-almacen.jpg" alt="" loading="lazy" decoding="async"></picture><picture class="cine-hero__bg" data-cine-bg><source type="image/webp" srcset="assets/images/hero-ecuestre-800.webp 800w, assets/images/hero-ecuestre-1200.webp 1200w, assets/images/hero-ecuestre.webp 1920w" sizes="100vw"><img src="assets/images/hero-ecuestre.jpg" alt="" loading="lazy" decoding="async"></picture><picture class="cine-hero__bg" data-cine-bg><source type="image/webp" srcset="assets/images/hero-padel-800.webp 800w, assets/images/hero-padel-1200.webp 1200w, assets/images/hero-padel.webp 1920w" sizes="100vw"><img src="assets/images/hero-padel.jpg" alt="" loading="lazy" decoding="async"></picture></div>
  <div class="cine-hero__scrim"></div>
  <div class="container cine-hero__inner">
    <p class="cine-hero__eyebrow"><span class="cine-hero__kicker" data-cine-eyebrow>Industry &amp; Agriculture</span><span class="cine-hero__meta">100+ projects across Europe</span></p>
    <h1 class="cine-hero__h1" data-cine-h1>Agricultural buildings for farms</h1>
    <p class="cine-hero__sub" data-cine-sub>Clear-span arch buildings for machinery, hay and livestock — permit-free*, assembled in days with certified Eurocode engineering.</p>
    <div class="cine-hero__actions">
      <a class='btn btn--lg btn--primary' data-cine-cta href='/categories/storage-tents'>View agricultural halls →</a>
      <a class='btn btn--lg btn--ghost-light' href='/pages/request-a-quote'>Request a quote</a>
    </div>
    <div class="cine-hero__rating"><a class='rating-badge rating-badge--compact' href='/pages/customer-reviews'><div class="stars" aria-label="5 of 5 stars"><svg class="star" width="14" height="14" viewBox="0 0 24 24" fill="#f4c95e" ...>…</svg> ×5</div><span><strong>4.96 / 5</strong> from 127+ reviews</span></a></div>
    <div class="cine-hero__tabs" role="tablist">
      <button type="button" class="cine-tab is-active" data-cine-tab role="tab" aria-selected="true" data-world="industrie" data-eyebrow="Industry &amp; Agriculture" data-h1="Agricultural buildings for farms" data-sub="Clear-span arch buildings for machinery, hay and livestock — permit-free*, assembled in days with certified Eurocode engineering." data-cta="View agricultural halls →" data-href="categories/storage-tents.html"><span class="cine-tab__no">01</span><span class="cine-tab__name">Agriculture</span></button>
      <button type="button" class="cine-tab" data-cine-tab role="tab" aria-selected="false" data-world="industrie" data-eyebrow="Industry &amp; Logistics" data-h1="Storage &amp; industrial halls" data-sub="Gable-roof and lightweight halls for storage, production and logistics — wide clear spans, erected fast." data-cta="View storage halls →" data-href="categories/fabric-buildings.html"><span class="cine-tab__no">02</span><span class="cine-tab__name">Storage</span></button>
      <button type="button" class="cine-tab" data-cine-tab role="tab" aria-selected="false" data-world="sport" data-eyebrow="globotent SPORTS" data-h1="Equestrian arenas &amp; riding halls" data-sub="Light-filled, clear-span riding arenas — ride all year round, with custom spans up to 25 m." data-cta="View equestrian covers →" data-href="categories/riding-arena-covers.html"><span class="cine-tab__no">03</span><span class="cine-tab__name">Equestrian</span></button>
      <button type="button" class="cine-tab" data-cine-tab role="tab" aria-selected="false" data-world="sport" data-eyebrow="globotent SPORTS" data-h1="Padel &amp; tennis court covers" data-sub="Play in any weather: clear-span covers for padel and tennis — bright, tall and assembled in weeks." data-cta="View padel covers →" data-href="categories/padel-tennis-covers.html"><span class="cine-tab__no">04</span><span class="cine-tab__name">Padel</span></button>
    </div>
  </div>
</section>
```

(El bloque de estrellas está abreviado: son 5 `<svg class="star" width="14" height="14" viewBox="0 0 24 24" fill="#f4c95e">` idénticos con el path de estrella `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z`.)

### 2.3 Inventario de las 4 capas de imagen

Todas las `<picture>` siguen el mismo patrón: `<source type="image/webp" srcset="…-800.webp 800w, …-1200.webp 1200w, ….webp 1920w" sizes="100vw">` + `<img src="….jpg" alt="" decoding="async">`. El `alt=""` es deliberado (imagen decorativa; el texto lo da el h1). Dimensiones y pesos obtenidos por `curl` a `https://globotent.com/assets/images/…` (cabeceras JPEG/WebP):

| Capa | Base | webp 1920w real | jpg fallback real | Peso jpg | Peso webp grande | Carga | `object-position` |
|---|---|---|---|---|---|---|---|
| 1 | `hero-agricolas` | **1536×2048 (vertical)** | 1536×2048 | 384 KB | 317 KB (1200w: 212 KB, 800w: 100 KB) | `fetchpriority="high"` + preload en `<head>` | `center 62%` |
| 2 | `hero-almacen` | 1200×864 | 1200×864 | 54 KB | — | `loading="lazy"` | `center` |
| 3 | `hero-ecuestre` | 1920×1080 | 1600×900 | 356 KB | — | `loading="lazy"` | `center 58%` |
| 4 | `hero-padel` | 1920×1440 | 1600×1200 | 359 KB | — | `loading="lazy"` | `center` |

Observaciones rastreables:
- El `srcset` declara `1920w` para `hero-agricolas.webp`, pero el archivo real mide 1536×2048 (vertical). El descriptor no coincide con el ancho real. `object-fit:cover` + `object-position:center 62%` lo recorta.
- El preload de `<head>` (línea 23) declara `2000w` para el mismo archivo que el `srcset` declara `1920w`:
  ```html
  <link rel="preload" as="image" type="image/webp" imagesrcset="assets/images/hero-agricolas-800.webp 800w, assets/images/hero-agricolas-1200.webp 1200w, assets/images/hero-agricolas.webp 2000w" imagesizes="100vw" fetchpriority="high">
  ```
  Al no coincidir los descriptores, el navegador puede elegir un candidato distinto en el preload y en el `<picture>` (y descargar dos veces). Es un defecto del original, no algo a copiar.
- Las capas 2–4 llevan `loading="lazy"` pero están geométricamente dentro del viewport (absolute inset:0 dentro del hero; `opacity:0` no afecta al lazy-loading), así que el navegador las descarga en cuanto puede. Aun así no hay garantía de que la capa 2 esté lista a los 5,5 s en conexiones lentas: el JS no comprueba `complete`/`decode()`.

### 2.4 Inventario de pestañas y sus `data-*`

| # | `.cine-tab__no` | `.cine-tab__name` | `data-world` | `data-eyebrow` | `data-h1` | `data-cta` | `data-href` |
|---|---|---|---|---|---|---|---|
| 1 | `01` | Agriculture | `industrie` | Industry & Agriculture | Agricultural buildings for farms | View agricultural halls → | `categories/storage-tents.html` |
| 2 | `02` | Storage | `industrie` | Industry & Logistics | Storage & industrial halls | View storage halls → | `categories/fabric-buildings.html` |
| 3 | `03` | Equestrian | `sport` | globotent SPORTS | Equestrian arenas & riding halls | View equestrian covers → | `categories/riding-arena-covers.html` |
| 4 | `04` | Padel | `sport` | globotent SPORTS | Padel & tennis court covers | View padel covers → | `categories/padel-tennis-covers.html` |

`data-sub` (texto completo de cada una): ver markup en 2.2.

Detalles rastreables:
- El `href` inicial del CTA en el HTML es **absoluto y sin extensión** (`/categories/storage-tents`), pero los `data-href` son **relativos y con `.html`** (`categories/storage-tents.html`). Tras la primera llamada a `show()`, el CTA pasa a la forma relativa. En producción ambas rutas responden `200` (`curl -I` a `/categories/storage-tents.html` y `/categories/storage-tents`), así que funciona, pero es una inconsistencia del original. Además, como `show()` se ejecuta solo tras el primer tick (5,5 s) o un click, un usuario que pulse el CTA antes de 5,5 s va a la URL absoluta.
- El `data-world` solo toma dos valores en el markup: `industrie` (tabs 1–2) y `sport` (tabs 3–4). El JS solo compara con `'sport'`; cualquier otro valor equivale a "no sport".
- Los `<button>` llevan `type="button"`, `role="tab"` y `aria-selected`, dentro de un `role="tablist"`. No hay `aria-controls`, `id`, `tabindex` roving ni manejo de teclas de flecha (no está en el código).

---

## 3. CSS completo (`main.pretty.css` 5973–6156)

### 3.1 Contenedor `.cine-hero`

```css
.cine-hero{
  position:relative;
  isolation:isolate;
  overflow:hidden;
  display:flex;
  align-items:flex-end;          /* el contenido se ancla ABAJO */
  color:#fff;
  min-height:min(calc(100svh - 80px),780px)}   /* 80px = altura del header (.site-header__bar{height:80px}, línea 132) */
```

- Altura: el hero ocupa el viewport completo menos el header sticky de 80 px, con tope de 780 px. Usa `svh` (small viewport height) para evitar el salto de la barra de URL móvil.
- `align-items:flex-end`: todo el bloque de texto + tabs queda pegado abajo; el padding-top del `__inner` es lo que da aire arriba.

### 3.2 Escenario y capas `.cine-hero__stage`, `.cine-hero__bg`

```css
.cine-hero__stage{
  position:absolute;
  inset:0;
  z-index:0}
.cine-hero__bg{
  position:absolute;
  inset:0;
  display:block;
  opacity:0;
  transition:opacity 1.1s ease}
.cine-hero__bg img{
  width:100%;
  height:100%;
  object-fit:cover;
  object-position:center}
.cine-hero__bg:nth-child(1) img{
  object-position:center 62%}
.cine-hero__bg:nth-child(3) img{
  object-position:center 58%}
.cine-hero__bg.is-active{
  opacity:1}
.cine-hero__bg.is-active img{
  animation:cineZoom 8s ease-out both}
```

- **Cambio de capa**: `opacity 0 ↔ 1` en **1,1 s** con easing `ease` (= `cubic-bezier(.25,.1,.25,1)`). Las dos capas (saliente y entrante) transicionan **simultáneamente** porque ambas cambian de clase en el mismo tick de JS → cross-fade real, no fade-to-black.
- El ajuste de encuadre es por capa con `:nth-child(n)`, es decir, **está acoplado al orden de las imágenes en el HTML**, no a un `data-*`.
- No hay `will-change`, `backface-visibility` ni `translateZ(0)` en estas capas (no está en el código). Sí lo hay en el `.hero__bg` legado (sección 6.1).

### 3.3 `@keyframes cineZoom` (el zoom)

```css
@keyframes cineZoom{
  from{ transform:scale(1.04)}
  to{   transform:scale(1.12)}
}
```

Aplicado con `animation:cineZoom 8s ease-out both` **solo a `.cine-hero__bg.is-active img`**. Desglose:

| Propiedad | Valor | Efecto |
|---|---|---|
| `animation-name` | `cineZoom` | escala 1.04 → 1.12 (+8 % relativo, 0.08 absoluto) |
| `animation-duration` | `8s` | más largo que el intervalo de 5,5 s → nunca llega a 1.12 en auto-avance |
| `animation-timing-function` | `ease-out` | `cubic-bezier(0,0,.58,1)`: rápido al principio, se frena al final |
| `animation-fill-mode` | `both` | empieza ya en 1.04 (no en 1.0) y, si termina (p. ej. con el timer pausado por hover), **se queda en 1.12** |
| `animation-iteration-count` | (por defecto) `1` | no se repite |
| `animation-delay` | (por defecto) `0s` | |
| `transform-origin` | (por defecto) `center` | zoom hacia el centro |

**Cómo se reinicia el zoom**: la animación vive en el selector `.is-active img`. Cuando el JS quita `.is-active` de una capa, la declaración `animation` deja de aplicar y la `<img>` vuelve a `transform:none` **de golpe** (la `transition` es solo de `opacity`). Cuando pone `.is-active` a la capa entrante, la animación arranca desde `from` (1.04). No hace falta ningún truco de reflow para el zoom: **el reinicio es consecuencia de alternar la clase**. (El truco `void el.offsetWidth` del JS es para `cineSwap` sobre h1/sub, donde la clase puede quitarse y ponerse en el mismo frame; ver 4.4.)

Consecuencia visible según el código (no verificada en navegador): la capa saliente salta de ≈1.109 a 1.0 en el mismo instante en que empieza su fade-out de 1,1 s. Cuando la capa entrante está **encima** en el DOM (1→2, 2→3, 3→4), el salto queda tapado por la entrante conforme sube su opacidad; cuando la entrante está **debajo** (4→1), el salto de la capa 4 ocurre encima y puede notarse. En la traducción a React (sección 9) se propone mantener el transform de la capa saliente durante el fade.

### 3.4 Scrim `.cine-hero__scrim`

```css
.cine-hero__scrim{
  position:absolute;
  inset:0;
  z-index:1;
  background:
    linear-gradient(100deg,rgba(8,16,24,.94) 0%,rgba(8,16,24,.74) 40%,rgba(8,16,24,.34) 70%,rgba(8,16,24,.08) 100%),
    linear-gradient(0deg,rgba(8,16,24,.66) 0%,rgba(8,16,24,0) 46%)}
```

Dos gradientes del mismo color base **`#081018`** (rgb 8,16,24 — no es el `--brand-dark` #061827; es un azul-negro propio del hero):
1. Diagonal a **100deg** (casi horizontal, ligeramente inclinado): 94 % de opacidad a la izquierda → 74 % al 40 % → 34 % al 70 % → 8 % a la derecha. Oscurece la mitad izquierda, donde va el texto, y deja ver la foto a la derecha.
2. Vertical (0deg = de abajo arriba): 66 % abajo → transparente al 46 % de altura. Oscurece la franja inferior, donde están las tabs y el rating.

Es un `div` separado (no un `::after`), de modo que el scrim no se ve afectado por la `opacity` ni por el `transform` de las capas.

### 3.5 Contenido `.cine-hero__inner`

```css
.cine-hero__inner{
  position:relative;
  z-index:2;
  width:100%;
  padding-top:clamp(40px,7vh,84px);
  padding-bottom:clamp(24px,4vh,46px)}
```
Hereda de `.container{max-width:var(--container) /* 1280px */; margin:0 auto; padding:0 24px}`.

### 3.6 Eyebrow: kicker + meta

```css
.cine-hero__eyebrow{
  display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  margin:0 0 18px;
  font-size:.78rem; font-weight:800; text-transform:uppercase; letter-spacing:.14em}
.cine-hero__kicker{
  color:var(--brand-green);            /* #1aa585 */
  display:inline-flex; align-items:center; gap:10px;
  transition:color .4s ease}           /* el cambio a #e3fc03 (sport) se anima en 0,4 s */
.cine-hero__kicker::before{
  content:""; width:28px; height:2px; background:currentColor; display:inline-block}   /* raya de 28×2 px antes del texto */
.cine-hero__meta{
  color:rgba(255,255,255,.72); font-weight:700; letter-spacing:.1em}
.cine-hero.is-sport .cine-hero__kicker{ color:#e3fc03}
```

El kicker **no** tiene animación de swap (el JS solo cambia su `textContent`); lo que se anima es el color si cambia el mundo.

### 3.7 Título `.cine-hero__h1`

```css
.cine-hero__h1{
  color:#fff;
  font-size:clamp(2.1rem,5.1vw,4rem);   /* 33,6 px → 64 px */
  line-height:1.03;
  letter-spacing:-.02em;
  font-weight:800;
  margin:0 0 18px;
  max-width:17ch;
  text-shadow:0 2px 34px rgba(0,0,0,.55)}
```
Fuente: hereda `--font-family:'Figtree',system-ui,-apple-system,sans-serif` (Google Fonts, `wght@300..900`, cargada en `<head>` con `media="print" onload="this.media='all'"`). `h1{font-variation-settings:"wght" 800}` global (línea 3512). La animación `wghtFlex` de peso variable existe solo para `.hero h1` (legado), **no** para `.cine-hero__h1`. 'Clash Display' aparece en el CSS (líneas 4163–4464, secciones sport) sin ningún `@font-face` → no se carga y cae al fallback Figtree; no afecta al cine-hero.

### 3.8 Subtítulo `.cine-hero__sub`

```css
.cine-hero__sub{
  font-size:clamp(1.02rem,1.45vw,1.2rem);
  line-height:1.5;
  color:rgba(255,255,255,.92);
  max-width:56ch;
  margin:0 0 26px;
  text-shadow:0 1px 18px rgba(0,0,0,.35)}
```

### 3.9 Acciones y botones

```css
.cine-hero__actions{ display:flex; flex-wrap:wrap; gap:14px; margin-bottom:24px}
.cine-hero.is-sport .cine-hero__actions .btn--primary{ background:#e3fc03; color:#0a0f0c; border-color:#e3fc03}
.cine-hero.is-sport .cine-hero__actions .btn--primary:hover{ background:#eaff3a; border-color:#eaff3a}
```
Botones base (líneas 71–119):
```css
.btn{ display:inline-flex; align-items:center; justify-content:center; gap:.5em;
  height:var(--button-normal-height) /* 44px */; padding:0 28px;
  border-radius:var(--button-corner) /* 50px → píldora */;
  font-family:var(--font-family); font-weight:var(--button-font-weight) /* 800 */;
  text-transform:var(--button-text-transform) /* uppercase */;
  font-size:.85rem; letter-spacing:.04em; cursor:pointer; border:2px solid transparent;
  transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;
  white-space:nowrap}
.btn--lg{ height:var(--button-large-height) /* 56px */; padding:0 36px; font-size:.95rem}
.btn--primary{ background:var(--brand-green); color:#fff}
.btn--primary:hover{ background:var(--brand-green-dark) /* #12755e */; color:#fff; transform:translateY(-1px)}
.btn--ghost-light{ background:transparent; color:#fff; border-color:#fff}
.btn--ghost-light:hover{ background:#fff; color:var(--brand-green-deep) /* #007a4a */}
```
Además `.btn{min-height:var(--touch-target-min) /* 48px */}` (línea 3835).

### 3.10 Rating

```css
.cine-hero__rating{ margin-bottom:30px}
.cine-hero__rating .rating-badge{ box-shadow:0 8px 26px rgba(0,0,0,.28)}
/* base (1933–1967) */
.rating-badge{ display:inline-flex; align-items:center; gap:12px; padding:10px 18px; border-radius:50px;
  background:rgba(255,255,255,.92); color:var(--color-title) /* #151719 */; font-weight:700;
  box-shadow:0 4px 14px rgba(6,24,39,.1); transition:transform .2s,box-shadow .2s}
.rating-badge--compact{ padding:8px 14px; font-size:.82rem; gap:8px}
.rating-badge--compact span{ color:var(--color-title); font-weight:600}
.rating-badge--compact strong{ font-weight:800}
.stars{ display:inline-flex; gap:2px; align-items:center}
```
Estrellas: SVG inline 14×14, `fill="#f4c95e"`.

### 3.11 Pestañas `.cine-hero__tabs`, `.cine-tab`

```css
.cine-hero__tabs{
  display:flex;
  gap:0;
  border-top:1px solid rgba(255,255,255,.2)}      /* línea fina continua sobre las 4 tabs */
.cine-tab{
  flex:1 1 0;                                     /* 4 columnas iguales */
  display:flex; flex-direction:column; align-items:flex-start; gap:7px;
  padding:18px 6px 0;
  margin-top:-1px;                                /* solapa la línea de 1px del contenedor */
  background:none; border:0;
  border-top:2px solid transparent;               /* el indicador: borde superior de 2px */
  color:rgba(255,255,255,.74);
  cursor:pointer; text-align:left; font:inherit;
  transition:color .3s ease,border-color .3s ease}
.cine-tab__no{ font-size:.72rem; font-weight:700; letter-spacing:.12em; opacity:.75}
.cine-tab__name{ font-size:clamp(.9rem,1.25vw,1.06rem); font-weight:800; letter-spacing:.01em; text-transform:uppercase}
.cine-tab:hover{ color:#fff}
.cine-tab.is-active{ color:#fff; border-top-color:var(--brand-green)}
.cine-hero.is-sport .cine-tab.is-active{ border-top-color:#e3fc03}
```

Estados: reposo (74 % blanco, borde transparente) → hover (100 % blanco) → activa (100 % blanco + borde superior verde de 2 px). **No hay barra de progreso** ni animación de tiempo restante (no está en el código). No hay estilo `:focus-visible` específico para `.cine-tab` (no está en el código; queda el outline por defecto del navegador).

### 3.12 `@keyframes cineSwap` (entrada de texto)

```css
.cine-hero__h1.is-swap,.cine-hero__sub.is-swap{
  animation:cineSwap .5s ease both}
@keyframes cineSwap{
  from{ opacity:0; transform:translateY(11px)}
  to{   opacity:1; transform:none}
}
```
Se aplica a h1 y sub **al mismo tiempo** (mismo tick, sin stagger), 0,5 s, `ease`, `both`. Solo aparece: el texto viejo se sustituye por `textContent` sin animación de salida.

### 3.13 Modo "sport" (`.cine-hero.is-sport`)

Resumen de todo lo que cambia cuando la tab activa tiene `data-world="sport"`:

| Elemento | Normal | `.is-sport` |
|---|---|---|
| `.cine-hero__kicker` color | `var(--brand-green)` #1aa585 | `#e3fc03` (transición `color .4s ease`) |
| `.cine-tab.is-active` border-top-color | `var(--brand-green)` | `#e3fc03` (transición `border-color .3s ease`) |
| `.btn--primary` del hero | fondo `#1aa585`, texto `#fff` | fondo `#e3fc03`, texto `#0a0f0c`, hover `#eaff3a` |

`#e3fc03` es un amarillo-lima que **no** está definido como variable en `:root` (allí existe `--brand-lime:#7ec700`; el `#e3fc03` aparece literal). No hay transición para el cambio de fondo del botón más allá de la genérica `.btn{transition:background .18s ease,...}`.

### 3.14 Layout móvil `@media (max-width:760px)`

```css
@media (max-width:760px){
  .cine-hero{ min-height:min(92svh,700px)}          /* ya no resta el header */
  .cine-hero__inner{ padding-top:clamp(60px,12vh,110px)}
  .cine-hero__h1{ font-size:clamp(1.95rem,8.4vw,2.7rem); max-width:none}
  .cine-hero__sub{ font-size:1rem}
  .cine-hero__actions .btn{ flex:1 1 100%; justify-content:center}   /* botones a ancho completo, apilados */
  .cine-hero__tabs{ flex-wrap:wrap}
  .cine-tab{ flex:1 1 42%; padding:13px 6px 0}      /* 2×2 */
  .cine-tab__name{ font-size:.85rem}
}
```
El breakpoint de este módulo es **760 px**. Otros módulos del sitio usan al menos otros 15 valores de `max-width` distintos: 480, 520, 560, 600, 680, 700, 720, 768, 780, 820, 860, 880, 900, 1000, 1100px (`grep -o '@media[^{]*max-width:[0-9]*px[^{]*' main.pretty.css | grep -o 'max-width:[0-9]*px' | sort -u` sobre las 6156 líneas del CSS). No hay un sistema de breakpoints unificado en el sitio.

### 3.15 Tokens de `:root` que usa el hero

| Variable | Valor | Uso en el hero |
|---|---|---|
| `--brand-green` | `#1aa585` | kicker, tab activa, botón primario |
| `--brand-green-dark` | `#12755e` | hover botón primario |
| `--brand-green-deep` | `#007a4a` | hover texto de `.btn--ghost-light` |
| `--color-title` | `#151719` | texto del rating-badge |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | todo |
| `--button-corner` | `50px` | píldora |
| `--button-large-height` | `56px` | `.btn--lg` |
| `--container` | `1280px` | `.container` |
| `--touch-target-min` | `48px` | `.btn{min-height}` |

Literales sin variable: `#081018` (scrim), `#e3fc03` / `#eaff3a` / `#0a0f0c` (sport), `#f4c95e` (estrellas), `rgba(255,255,255,.74|.72|.92|.2)`.

---

## 4. JavaScript (`main.js` 64–99)

### 4.1 Código literal del módulo

```js
document.querySelectorAll('[data-cine-hero]').forEach(function (hero) {
var bgs  = hero.querySelectorAll('[data-cine-bg]');
var tabs = hero.querySelectorAll('[data-cine-tab]');
var h1   = hero.querySelector('[data-cine-h1]');
var sub  = hero.querySelector('[data-cine-sub]');
var eye  = hero.querySelector('[data-cine-eyebrow]');
var cta  = hero.querySelector('[data-cine-cta]');
var n = tabs.length;
if (n < 2) return;
var idx = 0, timer = null;
var DELAY = 5500;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function swap(el) { if (!el) return; el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); }
function show(i) {
idx = (i + n) % n;
var t = tabs[idx];
bgs.forEach(function (b, k) { b.classList.toggle('is-active', k === idx); });
tabs.forEach(function (b, k) {
var on = k === idx;
b.classList.toggle('is-active', on);
b.setAttribute('aria-selected', on ? 'true' : 'false');
});
if (h1)  { h1.textContent = t.getAttribute('data-h1'); swap(h1); }
if (sub) { sub.textContent = t.getAttribute('data-sub'); swap(sub); }
if (eye) { eye.textContent = t.getAttribute('data-eyebrow'); }
if (cta) { cta.textContent = t.getAttribute('data-cta'); cta.setAttribute('href', t.getAttribute('data-href')); }
hero.classList.toggle('is-sport', t.getAttribute('data-world') === 'sport');
}
function start() { if (reduce) return; stop(); timer = setInterval(function () { show(idx + 1); }, DELAY); }
function stop()  { if (timer) { clearInterval(timer); timer = null; } }
tabs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); start(); }); });
hero.addEventListener('mouseenter', stop);
hero.addEventListener('mouseleave', start);
document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
start();
});
```

El script se carga con `<script src="assets/js/main.min.js?v=c0f0756b" defer>` (línea 664), así que corre tras el parseo del DOM, antes de `DOMContentLoaded`.

### 4.2 Selección de elementos

- Soporta **varios heroes** por página (`querySelectorAll('[data-cine-hero]').forEach`), aunque solo hay uno.
- El **número de pestañas** (`tabs.length`) manda: `bgs[k]` se empareja con `tabs[k]` por índice. Si hubiera más capas que tabs, las capas sobrantes nunca se activarían; si hubiera más tabs que capas, `bgs.forEach` simplemente no encontraría capa y el texto cambiaría sin imagen.
- Con menos de 2 tabs (`n < 2`) el módulo **no hace nada**: ni timer, ni clicks, ni `is-sport`.
- `h1`, `sub`, `eye`, `cta` son opcionales (`if (h1)`, etc.).

### 4.3 `show(i)`: orden exacto de operaciones

1. `idx = (i + n) % n` — normaliza (permite índices negativos, aunque nadie los pasa).
2. `t = tabs[idx]` — la pestaña es la **fuente de verdad** de todos los textos.
3. **Capas**: `bgs.forEach(b, k) → classList.toggle('is-active', k === idx)`. Quita `.is-active` a las demás y la pone a la `idx`. Esto dispara a la vez: fade-out de la saliente, fade-in de la entrante y arranque de `cineZoom` en la entrante (ver 3.3).
4. **Tabs**: para cada botón, `toggle('is-active', on)` + `setAttribute('aria-selected', 'true'|'false')`.
5. **h1**: `textContent = data-h1` → `swap(h1)`.
6. **sub**: `textContent = data-sub` → `swap(sub)`.
7. **eyebrow (kicker)**: `textContent = data-eyebrow` (sin swap).
8. **CTA**: `textContent = data-cta` y `setAttribute('href', data-href)`.
9. **Mundo**: `hero.classList.toggle('is-sport', data-world === 'sport')`.

`textContent` (no `innerHTML`): las entidades `&amp;` del atributo llegan ya decodificadas como `&`, y no se puede meter HTML en los `data-*` (p. ej. un `<em>`).

### 4.4 `swap(el)`: reinicio forzado de `cineSwap`

```js
function swap(el) { if (!el) return; el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); }
```
Quitar y volver a poner la misma clase en el mismo tick no reinicia una animación CSS (el navegador coalesce los cambios de estilo). `void el.offsetWidth` fuerza un **reflow síncrono** entre ambos, de modo que el navegador registra que la animación se quitó, y al añadir la clase la arranca desde `from`. Patrón clásico; en React se sustituye por un `key` (sección 9).

### 4.5 Temporizador

```js
var DELAY = 5500;
function start() { if (reduce) return; stop(); timer = setInterval(function () { show(idx + 1); }, DELAY); }
function stop()  { if (timer) { clearInterval(timer); timer = null; } }
```
- **5500 ms** entre cambios, `setInterval` (no `setTimeout` encadenado ni `requestAnimationFrame`).
- `start()` siempre hace `stop()` primero → idempotente, nunca hay dos intervalos.
- `start()` es no-op si `reduce` es `true` (evaluado **una vez** al cargar; si el usuario cambia la preferencia con la página abierta, no se reevalúa: no hay `addEventListener('change')`).
- Arranque: `start()` al final del módulo. **No** llama a `show(0)` al inicio: el estado inicial (capa 1 `.is-active`, tab 1 `.is-active`/`aria-selected="true"`, textos de la tab 1, `href` absoluto) viene **del HTML servido**. Por eso el primer zoom arranca en cuanto el CSS se aplica, no cuando corre el JS.

### 4.6 Interacción del usuario

| Evento | Handler | Efecto sobre el timer |
|---|---|---|
| `click` en `.cine-tab` k | `show(k); start();` | Salta a k y **reinicia** la cuenta: la siguiente transición automática ocurre 5,5 s después del click. Click en la tab ya activa: vuelve a lanzar `cineSwap` en h1/sub (swap siempre corre), el zoom no se reinicia (la clase no cambia), y el timer se reinicia. |
| `mouseenter` en `.cine-hero` | `stop` | Pausa mientras el ratón está sobre **todo el hero** (imagen, texto, tabs). El zoom en curso continúa hasta 8 s y se queda en 1.12 (`both`). |
| `mouseleave` en `.cine-hero` | `start` | Reanuda con un intervalo nuevo de 5,5 s completos (no recuerda el tiempo restante). |
| `visibilitychange` (document) | `hidden ? stop() : start()` | Pausa en pestaña oculta; al volver, 5,5 s completos. Nota: `start()` al volver **ignora** si el ratón sigue sobre el hero. |
| teclado | — | Solo lo nativo de `<button>`: Tab + Enter/Espacio disparan `click`. No hay flechas ni Home/End (no está en el código). |
| touch | — | En móvil no hay `mouseenter` real; el auto-avance nunca se pausa por tocar. No hay swipe. |

Otras cosas que **no** hace este módulo (no están en el código): comprobar `(pointer: coarse)`; usar `IntersectionObserver` para pausar cuando el hero sale de pantalla al hacer scroll; esperar a que la imagen siguiente esté cargada; `aria-live`; `startViewTransition`.

### 4.7 Relación con `startViewTransition` (líneas 100–116)

Existe un módulo global independiente:
```js
if (document.startViewTransition) {
document.addEventListener('click', e => {
const a = e.target.closest('a[href]');
if (!a) return;
const href = a.getAttribute('href');
if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || a.target === '_blank') return;
e.preventDefault();
try {
const t = document.startViewTransition(() => { window.location.href = a.href; });
t.finished.catch(err => { if (err && err.name === 'AbortError') return; console.warn('view-transition:', err); });
} catch (err) { window.location.href = a.href; }
});
}
```
Con el CSS `@view-transition{navigation:auto}`, `::view-transition-old(root){animation:vt-fade-out .18s ease forwards}` y `::view-transition-new(root){animation:vt-fade-in .28s ease forwards}` (líneas 3403–3408; los `@keyframes vt-fade-out`/`vt-fade-in` que definen esa animación están en 3409–3418). Afecta al CTA del hero como a cualquier enlace interno (fade + translateY(±10px) entre páginas), pero **no forma parte del mecanismo del hero** ni se usa para el cambio de slide.

---

## 5. Diagrama temporal

Con auto-avance sin interacción (`DELAY=5500`, `cineZoom 8s`, `opacity 1.1s`, `cineSwap .5s`). Ciclo completo de 4 pestañas = **22 s**.

```
t (s)   0        1.1                       5.5   6.0    6.6                    11.0  11.5  12.1        16.5        22.0
        |        |                         |     |      |                      |     |     |           |           |
CAPA 1  ●op=1 (viene del HTML, sin fade)   ├─ fade-out 1.1s ─┤ op=0 ......................................... ├─fade-in─┤
  img   zoom 1.04 ─────── ease-out ──────► ≈1.109 │snap→1.0 (sin transición)                                  zoom 1.04…
CAPA 2  op=0 ..............................├─ fade-in 1.1s ──┤ op=1 ─────────────┤─ fade-out ─┤ op=0
  img   (transform:none)                   zoom 1.04 ─────────────────────────► ≈1.109 │snap→1.0
CAPA 3  op=0 ......................................................................├─ fade-in ─┤ op=1 ──────────┤
  img                                                                               zoom 1.04 ──────────► ≈1.109
CAPA 4  op=0 ..................................................................................................├─ fade-in
TEXTO   h1/sub de la tab 01 (SSR)          ├swap .5s┤ h1/sub tab 02            ├swap .5s┤ h1/sub tab 03       ├swap┤ tab 04
KICKER  "Industry & Agriculture" (#1aa585) │ "Industry & Logistics"            │ "globotent SPORTS" → color .4s a #e3fc03
TAB     01 activa                          │ 02 activa (border .3s)            │ 03 activa                     │ 04 activa
CTA     href=/categories/storage-tents     │ categories/fabric-buildings.html  │ categories/riding-arena-covers.html …
.is-sport  no                               │ no                                │ SÍ (btn primario → #e3fc03)  │ SÍ
```

Puntos clave:
- **t=0**: nada se anima salvo el zoom de la capa 1 (el HTML ya trae `.is-active`). El primer cross-fade ocurre a **t=5,5 s**.
- Cada cambio dura **1,1 s** de cross-fade; durante ese tiempo el texto nuevo ya está visible (swap de 0,5 s termina antes que el fade).
- El zoom de cada capa dura de facto **5,5 s** (interrumpido a ≈1.109 de 1.12), salvo si el timer está pausado (hover / pestaña oculta), en cuyo caso completa los 8 s y se congela en 1.12.
- Al pasar de la tab 02 a la 03 cambia el "mundo" (`industrie` → `sport`); al pasar de la 04 a la 01 vuelve.
- Con `prefers-reduced-motion: reduce`: **no hay línea temporal**; el hero se queda en la tab 01 salvo click.

Con interacción: click en la tab 04 en t=2 s → cambio inmediato (fade 1,1 s, zoom desde 1.04), siguiente auto-cambio en t=7,5 s (a la tab 01, porque `show(idx+1)` con `idx=3` → `(4)%4=0`).

---

## 6. Variantes relacionadas en el mismo CSS/JS

### 6.1 `.hero` / `.hero__bg` con parallax de scroll (legado, **sin uso en las 78 páginas**)

Comprobación: `grep -rlE 'class="hero"|class="hero |class="hero__bg|class="hero--slider'` sobre `site/` no devuelve ninguna página. Es CSS/JS muerto que documenta la generación anterior del hero.

CSS (líneas 185–230, 934–937, 1594–1597, 3419–3421, 3513–3522):
```css
.hero{ position:relative; min-height:620px; display:flex; align-items:center; color:#fff; overflow:hidden; background:#061827}
.hero__bg{ position:absolute; inset:0; background-size:cover; background-position:center}
.hero__bg::after{ content:""; position:absolute; inset:0;
  background:linear-gradient(120deg,rgba(6,24,39,.78) 0%,rgba(6,24,39,.55) 45%,rgba(6,24,39,.35) 100%)}
.hero__inner{ position:relative; z-index:1; padding-top:96px; padding-bottom:96px}
.hero h1{ color:#fff; max-width:800px}
.hero__eyebrow{ display:inline-block; background:var(--brand-green); color:#fff; padding:6px 14px; border-radius:999px;
  font-weight:800; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; margin-bottom:20px}   /* píldora, no raya */
.hero__sub{ color:#dfe7ea; font-size:1.15rem; max-width:620px; margin-bottom:36px}
.hero__ctas{ display:flex; gap:14px; flex-wrap:wrap}
.hero__proof{ margin-top:28px; display:inline-block}
/* móvil (dentro de @media (max-width:900px), línea 895) */
.hero{ min-height:480px}  .hero__inner{ padding-top:64px; padding-bottom:64px}
.hero h1{ font-size:clamp(1.8rem,7vw,2.6rem)}  .hero__sub{ font-size:1rem}
/* parallax */
.hero__bg{ will-change:transform; transition:transform .05s linear}
/* peso variable animado */
.hero h1{ animation:wghtFlex 6s ease-in-out infinite alternate}
@keyframes wghtFlex{ from{ font-variation-settings:"wght" 700; letter-spacing:-.02em} to{ font-variation-settings:"wght" 900; letter-spacing:0} }
/* vídeo de fondo opcional */
.hero__video{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0}
.hero__video+.hero__bg{ z-index:0}
```

JS (líneas 27–33):
```js
const heroBgs = document.querySelectorAll('.hero__bg');
if (heroBgs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
window.addEventListener('scroll', () => {
const t = `translateY(${window.scrollY * 0.25}px)`;
heroBgs.forEach(bg => { bg.style.transform = t; });
}, { passive: true });
}
```
Mecanismo: en cada `scroll`, el fondo se desplaza **0,25 × scrollY** hacia abajo (parallax lento) mediante `style.transform` inline; la `transition:transform .05s linear` suaviza el escalonado. Desactivado con reduced-motion. Diferencia clave con `.cine-hero`: el fondo es `background-image` (no `<img>`) y el scrim es un `::after`.

Vídeo: `[data-hero-video]` (líneas 164–170) oculta el `<video>` si da `error` o si a los 2500 ms sigue en `readyState === 0`. Tampoco se usa en ninguna página (el `data-bg-video` de la home, línea 194 de `site/index.html`, pertenece a `.home-montage`, otra sección).

### 6.2 Slider con puntos: `data-hero-slider` / `data-hero-slide` / `data-hero-bg` / `data-hero-dot` (legado, **sin uso**)

Ninguna de las 78 páginas contiene `data-hero-slider`. Es el antecesor directo del cine-hero: misma idea de capas con `.is-active`, pero con **puntos** en vez de pestañas y **sin** zoom ni sustitución de textos (cada slide es un bloque HTML completo que se muestra/oculta).

CSS (líneas 3937–4030):
```css
.hero--slider .hero__bg--slide{ opacity:0; transition:opacity .9s ease; z-index:0}
.hero--slider .hero__bg--slide.is-active{ opacity:1}
.hero--slider .hero__inner{ z-index:1}
.hero--slider .hero__slide{ display:none}
.hero--slider .hero__slide.is-active{ display:block; animation:heroSlideIn .7s cubic-bezier(.16,.84,.44,1)}
@keyframes heroSlideIn{ from{ opacity:0; transform:translateY(16px)} to{ opacity:1; transform:none} }
.hero__dots{ display:flex; gap:10px; margin-top:34px}
.hero__dot{ position:relative; width:40px; height:5px; padding:0; border:0; border-radius:999px;
  background:rgba(255,255,255,.32); cursor:pointer; transition:background .3s,transform .3s}
.hero__dot::before{ content:""; position:absolute; left:0; right:0; top:-20px; bottom:-20px}   /* zona táctil ampliada a 45px de alto */
.hero__dot:hover{ background:rgba(255,255,255,.6)}
.hero__dot.is-active{ background:var(--brand-green,#1aa585); transform:scaleY(1.4)}
.hero__dot:focus-visible{ outline:2px solid #fff; outline-offset:3px}
@media (max-width:720px){ .hero__dots{ margin-top:26px} .hero__dot{ width:32px} }
@media (prefers-reduced-motion:reduce){ .hero--slider .hero__slide.is-active{ animation:none} .hero--slider .hero__bg--slide{ transition:none} }
/* variante sports del slider */
.hero__eyebrow--sports{ background:linear-gradient(90deg,#1aa585,#0f7d63)}
.hero__bg--sports::after{ background:linear-gradient(120deg,rgba(6,24,39,.84) 0%,rgba(8,38,22,.5) 55%,rgba(126,199,0,.22) 100%)}
.hero__h1--sports em{ font-style:italic; font-weight:300; color:#7ec700}
```

JS (líneas 34–63):
```js
const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
const slides = heroSlider.querySelectorAll('[data-hero-slide]');
const bgs    = heroSlider.querySelectorAll('[data-hero-bg]');
const dots   = heroSlider.querySelectorAll('[data-hero-dot]');
const count  = slides.length;
if (count > 1) {
let idx = 0, timer = null;
const DELAY = 6000;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const show = i => {
idx = (i + count) % count;
slides.forEach((s, n) => s.classList.toggle('is-active', n === idx));
bgs.forEach((b, n)   => b.classList.toggle('is-active', n === idx));
dots.forEach((d, n)  => { const on = n === idx; d.classList.toggle('is-active', on); d.setAttribute('aria-selected', on ? 'true' : 'false'); });
};
const start = () => { if (!reduce) { stop(); timer = setInterval(() => show(idx + 1), DELAY); } };
const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
heroSlider.addEventListener('mouseenter', stop);
heroSlider.addEventListener('mouseleave', start);
document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
show(0);
start();
}
}
```

Diferencias respecto al cine-hero: `DELAY = 6000` (vs 5500); fade `.9s` (vs 1.1s); entrada de slide `heroSlideIn .7s cubic-bezier(.16,.84,.44,1)` con `translateY(16px)` (vs `cineSwap .5s ease` con 11px); llama a `show(0)` al iniciar (el cine-hero no); un solo slider por página (`querySelector`); sin zoom, sin mundos, sin `data-*` de texto.

Para comparar, el tercer carrusel del sitio (`[data-lead-slider]`, líneas 652–681, no es hero) usa 3800 ms, flechas generadas por JS y arranque escalonado `setTimeout(start, idx * 1900)`.

### 6.3 `.page-hero` — el hero de las páginas interiores (72 páginas + 4 de jobs)

Uso en `site/`: 72 × `class="page-hero"`, 1 × `class="page-hero jobs-hero"`, 3 × `class="page-hero jobdetail-hero"`. Es **estático**: sin JS, sin animación, sin `<picture>` (fondo por `style="background-image:url(...)"` inline).

Markup literal (`site/categories/storage-tents.html` 129–136):
```html
<section class="page-hero">
  <div class="page-hero__bg" style="background-image:url('../assets/images/rundbogenhalle-12x24-01.jpg')"></div>
  <div class="container page-hero__inner">
    <div class="breadcrumbs"><a href='/'>Home</a> / <span>Categories</span> / <span>Arched Storage Tents</span></div>
    <h1>Arched Storage Tents — Robust Hoop Buildings for Hay, Grain & Equipment</h1>
    <p style="color:#dfe7ea;margin:10px 0 0;font-size:1.1rem;max-width:680px">Arched storage tents from 6 × 6 m up to 12 × 30 m …</p>
  </div>
</section>
```
Mismo patrón en `site/pages/request-a-quote.html` (fondo `hero_banner_1.jpg`), `site/categories/padel-tennis-covers.html` (fondo `padel-01.jpeg`; **no** usa `.page-hero--padel` pese a existir en CSS) y en productos (`site/products/storage-tent-6x12.html`: `<section class="page-hero" style="padding-bottom:0">`, fondo `.webp`, `<p>` con `max-width:600px`). El párrafo lleva **estilos inline** (`color:#dfe7ea;margin:10px 0 0;font-size:1.1rem;max-width:680px`) en vez de una clase.

CSS (líneas 231–265):
```css
.page-hero{ position:relative; min-height:320px; display:flex; align-items:flex-end; color:#fff; padding:0; overflow:hidden; background:#061827}
.page-hero__bg{ position:absolute; inset:0; background-size:cover; background-position:center}
.page-hero__bg::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))}
.page-hero__inner{ position:relative; z-index:1; padding-top:64px; padding-bottom:48px; width:100%}
.page-hero h1{ color:#fff; margin:0}
.breadcrumbs{ font-size:.85rem; color:#cfd8dc; margin-bottom:12px}
.breadcrumbs a{ color:#cfd8dc}
```
Modificadores declarados en CSS pero **ausentes del markup** (`grep -rho 'page-hero--[a-z]*' site/` vacío): `.page-hero--calc{min-height:280px}` (1158), `.page-hero--blog{min-height:380px}` (2464), `.page-hero--padel`. Este último está **partido en dos zonas alejadas** del archivo (`grep -n 'page-hero--padel' main.pretty.css` → líneas 311, 3591, 3593, 3600): `.page-hero--padel h1 em{font-style:normal;font-weight:600;color:#e3fc03}` en la **línea 311** (dentro de un bloque de `.section--brand .calc-card`, sin relación aparente), y el resto del modificador — `.page-hero--padel{position:relative}`, `.page-hero--padel::after{...}` (scrim vertical `rgba(15,30,45,.45→.25→.55)`) y `.page-hero--padel .page-hero__inner{...}` — en las **líneas 3591–3602**. Posible CSS residual/copiado del original.

Modificadores en uso (jobs, líneas 5467–5500 y 5629–5633):
```html
<section class="page-hero jobs-hero">   <!-- site/pages/jobs.html -->
  <div class="page-hero__bg" style="background-image:url('../assets/images/About_page_image_1.jpg')"></div>
  <div class="container page-hero__inner">
    <div class="breadcrumbs">…</div>
    <span class="jobs-hero__eyebrow">Karriere bei Globotent</span>
    <h1>…</h1>
    <p>…</p>
    <div class="jobs-hero__cta"><a href="#offene-stellen" class="btn btn--lg btn--lime">Offene Stellen ansehen</a><span class="jobs-hero__count">3 offene Positionen</span></div>
  </div>
</section>
```
```css
.jobs-hero__eyebrow{ display:inline-block; background:var(--brand-lime); color:var(--brand-dark); font-weight:800; font-size:.74rem;
  letter-spacing:.08em; text-transform:uppercase; padding:6px 14px; border-radius:50px; margin-bottom:14px}
.jobs-hero h1{ max-width:14ch}
.jobs-hero p{ color:#dfe7ea; max-width:620px; font-size:1.08rem; line-height:1.55}
.jobs-hero__cta{ display:flex; align-items:center; gap:20px; flex-wrap:wrap; margin-top:26px}
.jobs-hero__count{ color:#cfe0dc; font-weight:600; font-size:.95rem}
.jobs-hero__count::before{ content:"●"; color:var(--brand-lime); margin-right:7px; font-size:.7em; vertical-align:middle}
.jobdetail-hero__gender{ font-weight:500; color:#cfe0dc; font-size:.62em; display:inline-block}
.btn--lime{ background:var(--brand-lime) /* #7ec700 */; color:var(--brand-dark)}  .btn--lime:hover{ background:var(--brand-lime-hover) /* #84d814 */}
```
No hay media query específica para `.page-hero` (no está en el código); solo cambia lo que hereda (`.container`, `h1` global).

### 6.4 `.sp-hero` — hero claro de `site/pages/sport.html` (1 página)

Variante invertida (fondo blanco, texto negro, scrim blanco), líneas 4257–4310:
```html
<section class="sp-hero">
  <div class="sp-hero__bg" style="background-image:url('../assets/images/padel-court-01.jpg')"></div>
  <div class="container sp-hero__inner">
    <span class="sp-hero__lockup"><img src="../assets/logos/padel-logo.png" alt="globotent SPORTS" width="200" height="80" fetchpriority="high"></span>
    <h1 class="sp-hero__h1">Spiel das ganze Jahr.<br><em>Padel · Tennis · Equestrian.</em></h1>
    <p class="sp-hero__sub">…</p>
    <div class="sp-hero__ctas"><a class='btn btn--lg btn--lime' href='/pages/request-a-quote'>Projekt anfragen</a><a href="#disziplinen" class="btn btn--lg btn--ghost-light">Disziplinen ansehen</a></div>
  </div>
</section>
```
```css
.sp-hero{ position:relative; min-height:84vh; display:flex; align-items:center; overflow:hidden; background:#fff; border-bottom:1px solid #000}
.sp-hero__bg{ position:absolute; inset:0; background-size:cover; background-position:center; z-index:0}
.sp-hero__bg::after{ content:""; position:absolute; inset:0;
  background:linear-gradient(105deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.86) 42%,rgba(255,255,255,.25) 78%,rgba(255,255,255,0) 100%)}
.sp-hero__inner{ position:relative; z-index:1; padding:88px 20px}
.sp-hero__lockup img{ display:block; height:clamp(64px,9vw,104px); width:auto}
.sp-hero__h1{ font-weight:600; font-size:clamp(2.6rem,7vw,5.4rem); line-height:.98; color:#000; margin:0 0 20px; text-transform:uppercase; letter-spacing:-.01em}
.sp-hero__h1 em{ font-style:normal; background:var(--sport-lime); box-shadow:.1em 0 0 var(--sport-lime),-.1em 0 0 var(--sport-lime); box-decoration-break:clone}
.sp-hero__sub{ font-size:1.2rem; color:#323232; max-width:580px; margin:0 0 30px; line-height:1.5}
.sp-hero__ctas{ display:flex; gap:14px; flex-wrap:wrap}
```
Sirve como referencia de la misma estructura (bg absoluto + scrim diagonal + inner) en clave clara. Nota: `.btn--ghost-light` (texto y borde blancos) sobre fondo blanco en esta página es un fallo del original.

### 6.5 Comparativa de los cuatro heroes

| | `.cine-hero` | `.hero` (+`--slider`) | `.page-hero` | `.sp-hero` |
|---|---|---|---|---|
| Páginas | 1 (home) | 0 | 76 | 1 |
| Fondo | 4 × `<picture>` con srcset | `background-image` | `background-image` inline | `background-image` inline |
| Scrim | `div` propio, 2 gradientes desde `#081018` | `::after`, 120deg desde `#061827` | `::after`, vertical .45→.8 | `::after`, 105deg blanco |
| Altura | `min(100svh − 80px, 780px)` | 620px | 320px | 84vh |
| Alineación vertical | `flex-end` | `center` | `flex-end` | `center` |
| Movimiento | cross-fade 1.1s + zoom 8s + swap .5s | parallax 0.25 + slider 6s | ninguno | ninguno |
| Cambio de textos | sí, desde `data-*` de las tabs | no (slides completos) | — | — |
| Control | tabs 01–04 | dots | — | — |

---

## 7. `prefers-reduced-motion: reduce` — qué se desactiva exactamente

CSS (líneas 6149–6156, último bloque del archivo):
```css
@media (prefers-reduced-motion:reduce){
  .cine-hero__bg{ transition:opacity .01s}            /* el cross-fade pasa a ser un corte (10 ms) */
  .cine-hero__bg.is-active img{ animation:none}       /* sin zoom; la img queda a scale(1) */
  .cine-hero__h1.is-swap,.cine-hero__sub.is-swap{ animation:none}   /* sin entrada de texto */
}
```
JS: `var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` → `start()` retorna sin crear el intervalo. Efecto combinado:

| Con reduced-motion | Sigue funcionando |
|---|---|
| No hay auto-avance (nunca se crea el `setInterval`) | Click en tabs → `show(k)` cambia capa/textos/CTA al instante (corte de 10 ms) |
| Sin zoom `cineZoom` | Transiciones de color de kicker (.4s), tab (.3s) y botón (.18s) **siguen activas** (no están en el bloque) |
| Sin `cineSwap` | `start()` tras click/mouseleave/visibilitychange sigue siendo no-op |

Lo que **no** cubre: no reevalúa la preferencia si cambia en caliente; no reduce las transiciones de color; las view transitions de navegación (`vt-fade-*`) tampoco tienen bloque reduced-motion (no está en el código).

Para el resto de heroes: `.hero__bg` parallax se desactiva por JS; `.hero--slider` desactiva `heroSlideIn` y la transición de opacidad por CSS, y el intervalo por JS (`if (!reduce)`).

---

## 8. Accesibilidad, SEO y rendimiento (hechos del código)

- **SEO / SSR**: el `<h1>` servido es el de la tab 01 (`Agricultural buildings for farms`). Los otros tres titulares solo existen como `data-h1` en los `<button>`; un rastreador sin JS ve un único h1 y el CTA absoluto `/categories/storage-tents`. Los nombres de las 4 tabs sí son texto visible (`.cine-tab__name`).
- **ARIA**: `section[aria-label]`, `role="tablist"`, `role="tab"`, `aria-selected` actualizado por JS, `aria-label="5 of 5 stars"` en las estrellas, `alt=""` en las 4 imágenes. Faltan: `aria-controls`/`id`, `aria-live` para anunciar el cambio de titular, botón de pausa (WCAG 2.2.2 exige poder pausar contenido que se mueve más de 5 s; aquí solo hover/reduced-motion).
- **LCP**: la imagen 1 tiene `fetchpriority="high"` + `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">`. Las capas 2–4 `loading="lazy"`. El CSS es un solo archivo externo (`main.min.css?v=cfc09a15`, sin critical CSS inline), y la fuente Figtree se carga de forma no bloqueante (`media="print" onload`).
- **CLS**: el hero tiene `min-height` explícita, así que la llegada de la imagen no desplaza el contenido. Las `<img>` no llevan `width`/`height` (no hace falta: `position:absolute; inset:0` + `height:100%`).
- **Overflow**: `overflow:hidden` en `.cine-hero` recorta el exceso del `scale(1.12)` (la imagen crece un 12 % y se sale del contenedor por los cuatro lados).

---

## 9. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui

### 9.1 Modelo de datos (props)

```ts
// components/hero/hero-cinematografico.tsx
export type HeroSlide = {
  imagen: {
    src: string;                 // /images/hero/<servicio>.webp (Next optimiza; no hace falta srcset manual)
    objectPosition?: string;     // equivale a .cine-hero__bg:nth-child(n) img{object-position}; p. ej. 'center 62%'
    alt?: string;                // '' por defecto (decorativa, como el original)
  };
  tab: { numero: string; nombre: string };   // '01' / 'Agriculture'
  mundo?: string;                // equivale a data-world; opcional. Ver 9.7
  eyebrow: string;               // data-eyebrow
  titulo: string;                // data-h1
  sub: string;                   // data-sub
  cta: string;                   // data-cta
  href: string;                  // data-href → usar SIEMPRE ruta absoluta de la app ('/servicios/hormigon-impreso')
};

export type HeroCinematograficoProps = {
  slides: HeroSlide[];           // Globotent: 4. Con < 2, el componente se renderiza estático (como el `if (n < 2) return`)
  ariaLabel: string;              // equivale a section[aria-label] del original ('Globotent — clear-span buildings & covers'); sin default fijo para que cada consumidor del componente lo defina
  meta?: string;                 // .cine-hero__meta fijo ('100+ projects across Europe')
  ctaSecundario?: { label: string; href: string };   // .btn--ghost-light fijo
  rating?: React.ReactNode;      // slot para el badge de reseñas
  intervaloMs?: number;          // 5500
  headerAltura?: string;         // '80px' → min-height: min(calc(100svh - X), 780px)
  mundoAcento?: string;          // valor de `mundo` que activa el acento alternativo (Globotent: 'sport')
};
```

### 9.2 Componente `'use client'`

```tsx
'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { HeroCinematograficoProps } from './types';

export function HeroCinematografico({
  slides, ariaLabel, meta, ctaSecundario, rating,
  intervaloMs = 5500, headerAltura = '80px', mundoAcento = 'sport',
}: HeroCinematograficoProps) {
  const n = slides.length;
  // idx = capa/tab activa (equivale a `var idx`); tick = contador para re-montar h1/sub y relanzar cineSwap (equivale a swap())
  const [{ idx, tick }, setEstado] = useState({ idx: 0, tick: 0 });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = useRef(false);

  const show = useCallback((i: number) => {
    setEstado(s => ({ idx: ((i % n) + n) % n, tick: s.tick + 1 }));
  }, [n]);

  const stop = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  }, []);

  const start = useCallback(() => {
    if (reduce.current || n < 2) return;          // equivale a `if (reduce) return;` + `if (n < 2) return;`
    stop();                                       // idempotente, como el original
    timer.current = setInterval(() => {
      setEstado(s => ({ idx: (s.idx + 1) % n, tick: s.tick + 1 }));
    }, intervaloMs);
  }, [n, intervaloMs, stop]);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [start, stop]);

  const activa = slides[idx];
  const esAcento = activa.mundo === mundoAcento;     // equivale a hero.classList.toggle('is-sport', …)

  return (
    <section
      aria-label={ariaLabel}
      onMouseEnter={stop}
      onMouseLeave={start}
      style={{ '--hero-header': headerAltura } as CSSProperties}
      className="relative isolate flex min-h-[min(calc(100svh_-_var(--hero-header)),780px)] items-end overflow-hidden text-white max-[760px]:min-h-[min(92svh,700px)]"
    >
      {/* .cine-hero__stage */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, k) => {
          const on = k === idx;
          return (
            <div
              key={s.href}
              aria-hidden={!on}
              className={cn(
                'absolute inset-0 transition-opacity duration-[1100ms] ease-[ease] motion-reduce:duration-[10ms]',
                on ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={s.imagen.src}
                alt={s.imagen.alt ?? ''}
                fill
                sizes="100vw"
                priority={k === 0}                      // fetchpriority="high" + preload solo en la primera
                loading={k === 0 ? undefined : 'lazy'}  // las demás como el original
                className={cn('object-cover', on && 'motion-safe:animate-cine-zoom')}
                style={{ objectPosition: s.imagen.objectPosition ?? 'center' }}
              />
            </div>
          );
        })}
      </div>

      {/* .cine-hero__scrim */}
      <div aria-hidden className="scrim-cine absolute inset-0 z-[1]" />

      {/* .cine-hero__inner. 'container' requiere el container:{...} añadido en tailwind.config.ts (9.3) para reproducir max-width:1280px/padding:24px de 3.5 */}
      <div className="container relative z-[2] w-full pt-[clamp(40px,7vh,84px)] pb-[clamp(24px,4vh,46px)] max-[760px]:pt-[clamp(60px,12vh,110px)]">
        <p className="mb-[18px] flex flex-wrap items-center gap-4 text-[.78rem] font-extrabold uppercase tracking-[.14em]">
          <span className={cn(
            'inline-flex items-center gap-[10px] transition-colors duration-[400ms]',
            "before:inline-block before:h-[2px] before:w-7 before:bg-current before:content-['']",
            esAcento ? 'text-hero-acento' : 'text-primary',
          )}>
            {activa.eyebrow}
          </span>
          {meta && <span className="font-bold tracking-[.1em] text-white/[.72]">{meta}</span>}
        </p>

        {/* key={tick} desmonta y monta de nuevo → la animación cine-swap arranca desde `from` (sustituye a `void el.offsetWidth`) */}
        <h1
          key={`h1-${tick}`}
          className="mb-[18px] max-w-[17ch] text-[clamp(2.1rem,5.1vw,4rem)] font-extrabold leading-[1.03] tracking-[-.02em] text-white [text-shadow:0_2px_34px_rgba(0,0,0,.55)] motion-safe:animate-cine-swap max-[760px]:max-w-none max-[760px]:text-[clamp(1.95rem,8.4vw,2.7rem)]"
        >
          {activa.titulo}
        </h1>
        <p
          key={`sub-${tick}`}
          className="mb-[26px] max-w-[56ch] text-[clamp(1.02rem,1.45vw,1.2rem)] leading-normal text-white/[.92] [text-shadow:0_1px_18px_rgba(0,0,0,.35)] motion-safe:animate-cine-swap max-[760px]:text-base"
        >
          {activa.sub}
        </p>

        <div className="mb-6 flex flex-wrap gap-[14px] max-[760px]:[&>*]:flex-[1_1_100%]">
          <Button asChild size="lg" variant={esAcento ? 'hero-acento' : 'default'}>
            <Link href={activa.href}>{activa.cta}</Link>
          </Button>
          {ctaSecundario && (
            <Button asChild size="lg" variant="ghost-light">
              <Link href={ctaSecundario.href}>{ctaSecundario.label}</Link>
            </Button>
          )}
        </div>

        {rating && <div className="mb-[30px]">{rating}</div>}

        {/* .cine-hero__tabs */}
        {n > 1 && (
          <div role="tablist" aria-label="Servicios" className="flex border-t border-white/20 max-[760px]:flex-wrap">
            {slides.map((s, k) => {
              const on = k === idx;
              return (
                <button
                  key={s.href}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => { show(k); start(); }}   // idéntico al original: salta y reinicia el intervalo
                  className={cn(
                    'flex flex-1 basis-0 flex-col items-start gap-[7px] px-[6px] pt-[18px] -mt-px',
                    'border-t-2 border-transparent text-left text-white/[.74] transition-[color,border-color] duration-300 hover:text-white',
                    'max-[760px]:basis-[42%] max-[760px]:pt-[13px]',
                    on && 'text-white',
                    on && (esAcento ? 'border-hero-acento' : 'border-primary'),
                  )}
                >
                  <span className="text-[.72rem] font-bold tracking-[.12em] opacity-75">{s.tab.numero}</span>
                  <span className="text-[clamp(.9rem,1.25vw,1.06rem)] font-extrabold uppercase tracking-[.01em] max-[760px]:text-[.85rem]">{s.tab.nombre}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

Notas de fidelidad:
- `n < 2` → sin tablist, sin timer; la primera slide se muestra estática (igual que `if (n < 2) return`).
- **Zoom**: la clase `animate-cine-zoom` se pone/quita con `on`. Igual que en el original, alternar la clase quita y vuelve a aplicar `animation`, lo que reinicia `cine-zoom` desde `scale(1.04)`. No hace falta `key` en la `<Image>` (re-montar la imagen provocaría un parpadeo). Si se quisiera reiniciar el zoom también al pulsar la tab ya activa, añadir `key={tick}` al `<div>` de la capa activa; el original no lo hace.
- **Swap**: `key={tick}` en h1 y p sustituye el truco `void el.offsetWidth`.
- **`aria-selected={on}`**: React lo serializa a `"true"`/`"false"`.
- **hover**: `onMouseEnter`/`onMouseLeave` en la `<section>` completa, como `hero.addEventListener('mouseenter', stop)`.
- Para no reproducir el "snap" de la capa saliente (3.3), añadir `motion-safe:animate-cine-zoom` también a la capa que acaba de dejar de estar activa durante 1,1 s (guardar `prevIdx` en el estado y limpiarlo con un `setTimeout(1100)`), o bien mantener el transform con `animation-fill-mode: forwards` en una clase `.cine-zoom-hold` que se quite al terminar el fade. Es una mejora sobre el original, no una copia.
- **Altura móvil**: `headerAltura` se pasa como variable CSS (`style={{'--hero-header': headerAltura}}`), no como `style.minHeight` fijo. Un `style` inline tiene siempre prioridad sobre cualquier regla de hoja de estilos, incluida una envuelta en `@media`; si `minHeight` se fijara por `style` a secas, `max-[760px]:min-h-[...]` nunca llegaría a aplicarse y el hero quedaría con el alto de escritorio en móvil. Con la variable, ambas reglas (`min-h-[...var(--hero-header)...]` y `max-[760px]:min-h-[...]`) viven en la hoja de estilos y la de `@media` gana por cascada, igual que en 3.14.
- **Breakpoint**: el módulo usa `max-[760px]:` (valor arbitrario), no `max-md:` (768px por defecto en Tailwind). El breakpoint original de `.cine-hero` es 760px (3.14); usar `max-md:` desplazaría el corte 8px y, además, redefinir `md` en `tailwind.config.ts` a 760px afectaría a header/grid/nav, que ya usan 768px en otras partes del sitio.

### 9.3 `globals.css`: keyframes, scrim y tokens

```css
@layer utilities {
  /* == .cine-hero__bg.is-active img == */
  @keyframes cine-zoom { from { transform: scale(1.04); } to { transform: scale(1.12); } }
  .animate-cine-zoom { animation: cine-zoom 8s ease-out both; }

  /* == .cine-hero__h1.is-swap, .cine-hero__sub.is-swap == */
  @keyframes cine-swap { from { opacity: 0; transform: translateY(11px); } to { opacity: 1; transform: none; } }
  .animate-cine-swap { animation: cine-swap .5s ease both; }

  /* == .cine-hero__scrim == (mismo gradiente; el color base #081018 puede pasar a un token) */
  .scrim-cine {
    background:
      linear-gradient(100deg, rgb(var(--hero-scrim) / .94) 0%, rgb(var(--hero-scrim) / .74) 40%, rgb(var(--hero-scrim) / .34) 70%, rgb(var(--hero-scrim) / .08) 100%),
      linear-gradient(0deg,   rgb(var(--hero-scrim) / .66) 0%, rgb(var(--hero-scrim) / 0) 46%);
  }
}

:root {
  --hero-scrim: 8 16 24;         /* #081018 en Globotent; Pavivasa decide el suyo */
  --hero-acento: 227 252 3;      /* #e3fc03 en Globotent (mundo 'sport'); Pavivasa decide si tiene un segundo acento */
}
```

Las `keyframes`/`animation` de arriba (`cine-zoom`, `cine-swap`) **deben** declararse vía `theme.extend` en `tailwind.config.ts`, no a mano dentro de `@layer utilities`: es la vía que la propia documentación de Tailwind señala como canónica para animaciones personalizadas, y la única que da soporte a variantes (`hover:`, `motion-safe:`, etc.) sobre la clase `animate-*` resultante. `.scrim-cine` y los tokens `--hero-scrim`/`--hero-acento` de `:root` **no** tienen equivalente en `theme.extend` (no son keyframes/animation) y se quedan en `globals.css` tal como están arriba: las dos rutas son complementarias, no alternativas intercambiables.

```ts
// tailwind.config.ts
theme: { extend: {
  keyframes: {
    'cine-zoom': { from: { transform: 'scale(1.04)' }, to: { transform: 'scale(1.12)' } },
    'cine-swap': { from: { opacity: '0', transform: 'translateY(11px)' }, to: { opacity: '1', transform: 'none' } },
  },
  animation: { 'cine-zoom': 'cine-zoom 8s ease-out both', 'cine-swap': 'cine-swap .5s ease both' },
  colors: { 'hero-acento': 'rgb(var(--hero-acento) / <alpha-value>)' },
  container: { center: true, padding: '24px', screens: { '2xl': '1280px' } },   // pisa el default de shadcn (padding:'2rem', 2xl:'1400px') para reproducir .container{max-width:1280px;padding:0 24px} de 3.5
}}
```
El `@media (prefers-reduced-motion:reduce)` del original se cubre con las variantes `motion-safe:` (animaciones) y `motion-reduce:duration-[10ms]` (la transición de opacidad de 1.1 s → .01 s). No hace falta extender `zIndex`: `z-[1]`/`z-[2]` en 9.2 son valores arbitrarios de Tailwind 3.4 y no requieren configuración.

### 9.4 shadcn/ui: variantes de `Button`

Añadir en `components/ui/button.tsx` (cva) dos variantes que reproducen `.btn--ghost-light` y el primario en modo acento. `.btn` del original (3.9) aplica `uppercase`, `font-weight:800`, `letter-spacing:.04em`, `border:2px solid transparent` y `min-height:48px` a **todos** los tamaños de botón, no solo a `--lg`; por eso esas clases van en la `base` del `cva`, no dentro de `size.lg` (que solo aporta lo específico de `.btn--lg`: 56px, padding 36px, tamaño de fuente):
```ts
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-transparent font-extrabold uppercase tracking-[.04em] min-h-12 transition-[background,color,border-color,transform] duration-[180ms] ease-[ease]',   // base: equivale a .btn (3.9), incl. su transition exacta
  {
    variants: {
      variant: {
        // ...
        'ghost-light': 'border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary',
        'hero-acento': 'border-2 border-hero-acento bg-hero-acento text-[#0a0f0c] hover:bg-[#eaff3a] hover:border-[#eaff3a]',
      },
      size: { lg: 'h-14 px-9 text-[.95rem]' },   // 56px, como .btn--lg (base ya trae rounded-full/uppercase/font-extrabold/tracking/border/min-h)
    },
  }
);
```
No usar `Tabs` de shadcn/Radix para las pestañas: Radix Tabs gestiona su propio estado y foco (activación automática con flechas), lo que chocaría con el temporizador y con el patrón "click = salta + reinicia". Los `<button role="tab">` a mano, como el original, bastan; si se quiere navegación por flechas, añadir un `onKeyDown` en el tablist (no está en el original).

### 9.5 `next/image`

- `fill` + `sizes="100vw"` + `className="object-cover"` + `style={{objectPosition}}` reproduce `<picture>` con `srcset 800/1200/1920` y `sizes="100vw"`: Next genera los candidatos según `deviceSizes` (por defecto 640…3840) y sirve WebP/AVIF automáticamente.
- `priority` solo en la capa 0 → Next añade `fetchpriority="high"` y el `<link rel="preload">` en `<head>` (corrige el desajuste 1920w/2000w del original porque lo genera del mismo srcset).
- Poner las imágenes a **1920×1080 mínimo, orientación horizontal**; el original tiene una capa vertical 1536×2048 declarada como 1920w.
- No hace falta tocar `deviceSizes` en `next.config`: el valor por defecto de Next.js ya es `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`, que incluye 1920w. Una lista como `[640, 768, 1024, 1280, 1536, 1920]` **elimina** candidatos (750/828/1080/2048/3840) en vez de añadir nada.

### 9.6 Server/Client split

- `HeroCinematografico` es cliente por el estado y el timer. El **array `slides` viene de un Server Component** (`app/page.tsx`) como prop serializable; el h1 de la slide 0 se renderiza en SSR igual que en Globotent (buen LCP y SEO).
- Para que un rastreador vea los 4 titulares (Globotent no lo hace), opción: renderizar en el server una `<ul class="sr-only">` con los 4 `titulo` + `href`. Es una mejora, no una copia.

### 9.7 De los 4 "mundos" de Globotent a los servicios de Pavivasa (sin decidir el copy)

Globotent usa el hero como **selector de líneas de negocio**: cada tab = 1 categoría = 1 imagen + 1 titular + 1 CTA a su página de categoría; y dos "mundos" (`industrie`/`sport`) que solo cambian el color de acento. Estructura equivalente para Pavivasa:

| Slot Globotent | Qué es | Equivalente Pavivasa (a rellenar) |
|---|---|---|
| `tab.numero` / `tab.nombre` | `01 Agriculture` … `04 Padel` | `01 <servicio>` … `0N <servicio>`; candidatos mencionados por el cliente: hormigón impreso, pulido, lavado/desactivado, microcemento. El número de slides es libre (el código soporta N ≥ 2). |
| `imagen` | foto de obra de esa categoría, horizontal, `object-position` ajustado por foto | 1 foto de obra real por servicio, ≥1920 px ancho; definir `objectPosition` por foto |
| `eyebrow` | línea de negocio en mayúsculas ("Industry & Agriculture") | familia/ámbito del servicio (p. ej. exterior/interior, residencial/industrial) — **copy pendiente** |
| `titulo` | qué se vende + para quién (≤17ch por línea) | **copy pendiente** |
| `sub` | beneficio + prueba (≤56ch) | **copy pendiente** |
| `cta` / `href` | "View X →" → página de categoría | "Ver <servicio> →" → `/servicios/<slug>`; rutas absolutas de la app |
| `mundo` (`data-world`) | industrie / sport → acento verde / lima | Decidir si Pavivasa tiene 2 familias con acento distinto (p. ej. pavimentos exteriores vs interiores) o un solo acento. Si es uno solo, omitir `mundo` y `mundoAcento`. |
| `meta` | "100+ projects across Europe" | cifra de prueba social de Pavivasa (obras, años, m²) — **dato pendiente** |
| `ctaSecundario` | "Request a quote" | equivalente a presupuesto/contacto — **copy pendiente** |
| `rating` | badge 4.96/5, 127 reseñas | solo si Pavivasa tiene reseñas verificables; si no, omitir el slot |

Tiempos a conservar salvo decisión contraria: intervalo 5500 ms, zoom 8 s (1.04→1.12, `ease-out`, `both`), cross-fade 1100 ms `ease`, swap 500 ms. Si Claude Design quiere que el zoom termine antes del cambio, la relación a mantener es `zoom ≤ intervalo` (p. ej. 5 s / 5,5 s); si quiere el efecto "siempre en movimiento" del original, `zoom > intervalo`.

---

## 10. Lista de verificación (afirmaciones comprobables contra el espejo)

1. `DELAY = 5500` ms (`main.js` línea 74).
2. `cineZoom`: `scale(1.04)` → `scale(1.12)`, `8s ease-out both`, aplicado a `.cine-hero__bg.is-active img` (CSS 6002–6009).
3. Cross-fade: `.cine-hero__bg{opacity:0; transition:opacity 1.1s ease}` + `.is-active{opacity:1}` (CSS 5985–6001).
4. `cineSwap`: `opacity:0; translateY(11px)` → `opacity:1`, `.5s ease both`, en `.cine-hero__h1.is-swap,.cine-hero__sub.is-swap` (CSS 6118–6127).
5. Scrim: dos gradientes desde `rgba(8,16,24,…)`: `100deg` (.94/.74@40%/.34@70%/.08) y `0deg` (.66 → 0@46%) (CSS 6010–6014).
6. `min-height:min(calc(100svh - 80px),780px)`; móvil `min(92svh,700px)` (CSS 5980, 6130).
7. h1: `clamp(2.1rem,5.1vw,4rem)`, `line-height:1.03`, `letter-spacing:-.02em`, `font-weight:800`, `max-width:17ch`, `text-shadow:0 2px 34px rgba(0,0,0,.55)` (CSS 6049–6057).
8. Acento sport `#e3fc03` (kicker, tab activa, botón), hover `#eaff3a`, texto `#0a0f0c` (CSS 6047, 6070–6076, 6116).
9. Tabs: `border-top:2px solid transparent` → `var(--brand-green)` en `.is-active`; contenedor con `border-top:1px solid rgba(255,255,255,.2)`; `margin-top:-1px` (CSS 6081–6115).
10. Sin barra de progreso, sin flechas, sin `aria-live`, sin teclado de flechas, sin `pointer: coarse` en el módulo cine-hero.
11. `show()` orden: bgs → tabs (+`aria-selected`) → h1+swap → sub+swap → eyebrow → cta (`textContent` + `href`) → `is-sport`.
12. Reinicio de `cineSwap` mediante `void el.offsetWidth`; reinicio de `cineZoom` por alternancia de `.is-active`.
13. Pausas: `mouseenter`→`stop`, `mouseleave`→`start`, `visibilitychange`→`hidden?stop:start`; click en tab → `show(k); start()`.
14. `reduce` se lee una vez con `matchMedia('(prefers-reduced-motion: reduce)').matches`; `start()` retorna si es `true`.
15. No se llama a `show(0)` al iniciar: el estado inicial es el del HTML (capa 1 y tab 1 con `.is-active`).
16. `data-href` relativos con `.html` frente a `href` inicial absoluto sin extensión.
17. Preload declara `2000w` y el `srcset` `1920w` para `hero-agricolas.webp`; el archivo mide 1536×2048.
18. Fuente: Figtree (Google Fonts, 300..900); 'Clash Display' declarada sin `@font-face` en otras secciones.
19. `.hero`, `.hero--slider`, `data-hero-slider`, `.hero__dot`: sin uso en las 78 páginas (código muerto); slider legado con `DELAY = 6000`, fade `.9s`, `heroSlideIn .7s cubic-bezier(.16,.84,.44,1)`.
20. `.page-hero`: 76 páginas, `min-height:320px`, scrim `180deg rgba(6,24,39,.45)→.8`, `align-items:flex-end`, `padding-top:64px; padding-bottom:48px`, sin JS.
21. `.page-hero--padel`, `--calc`, `--blog`: declarados en CSS, ausentes del markup.
22. El bloque `.cine-hero` es el último del CSS (5973–6156 de 6156 líneas).
