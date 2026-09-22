# 05 · Gramática de secciones de la home de globotent.com

Fuentes: `home.html` (= `site/index.html`, 666 líneas), `main.pretty.css` (6156 líneas, formateado desde `main.min.css?v=cfc09a15`) y `main.js` (742 líneas, `main.min.js?v=c0f0756b`). Todo valor citado sale de esos tres archivos; cuando algo no está, se dice "no está en el código". Lectores: Claude Design (diseño nuevo de Pavivasa) y Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui).

---

## 0. Sistema común que comparten todas las secciones

### 0.1 Tokens usados por las secciones (`:root`, líneas 1-29)

| Token | Valor | Dónde se usa en la home |
|---|---|---|
| `--brand-green` | `#1aa585` | eyebrows, CTAs primarios, bordes hover, kicker del hero |
| `--brand-green-dark` | `#12755e` | hover del primario, badges, knob del before/after |
| `--brand-green-deep` | `#007a4a` | gradiente de `.feature__icon` y `.cta-band` |
| `--brand-lime` | `#7ec700` | cifras de `.trust-bar`, span de `.collection-card__label`, `.btn--lime`, hover de enlaces del footer |
| `--brand-dark` | `#061827` | fondo de `.trust-bar`, `.home-montage`, `.site-footer`; base de todos los `rgba(6,24,39,…)` |
| `--color-title` | `#151719` | h1-h5 |
| `--color-text` / `--color-sub-title` | `#535353` | body y textos secundarios |
| `--color-border` | `#e2e2e2` | borde de todas las tarjetas |
| `--color-bg-soft` | `#f6f8f7` | `.section--soft`, `.press-strip`, fondo de `__media` |
| `--container` | `1280px` | `.container` |
| `--radius` | `12px` | radio de tarjetas, `.cta-band`, `.three-d-cta`, `.before-after` |
| `--shadow-card` | `0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)` | hover de `.feature`, `.product-card`, `.case-card` |
| `--button-corner` | `50px` | píldora de todos los `.btn` |
| `--button-normal-height` | `44px` | alto base de `.btn` (línea 22; anulado a 48px por `--touch-target-min`, ver §0.4) |
| `--button-large-height` | `56px` | alto de `.btn--lg` (línea 20) |
| `--button-font-weight` | `800` | peso del texto de `.btn` (línea 18) |
| `--button-text-transform` | `uppercase` | transformación del texto de `.btn` (línea 19) |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | única familia cargada (Google Fonts, `wght@300..900`) |

`'Clash Display'` se declara en 7 reglas (`.world-block--sport .world-block__head h3`, `.sport-world h1/h2/h3`, `.world-panel__h2--sport`…) **sin ningún `@font-face`** (`grep "@font-face" main.pretty.css` → 0 resultados): no se carga y cae al fallback `var(--font-family)` = Figtree.

### 0.2 Contenedor y ritmo vertical

```css
.container{max-width:var(--container);margin:0 auto;padding:0 24px}
.section{padding:72px 0}            /* ≤560px: padding:48px 0 (línea 1626) */
.section--tight{padding:48px 0}     /* no se usa en la home */
.section--soft{background:var(--color-bg-soft)}
.section--dark{background:var(--brand-dark);color:#dfe7ea}   /* no se usa en la home */
.section--brand{background:linear-gradient(135deg,#1aa585 0%,#138d70 100%);color:#fff}
```

Cuatro secciones **no** llevan `.section` y por tanto no tienen los 72 px: `.cine-hero`, `.home-montage`, `.trust-bar`, `.press-strip` (cada una define su propio padding).

### 0.3 Cabecera de sección

```html
<div class="section__head">
  <div class="section__eyebrow">Why Globotent?</div>
  <h2>Fast, robust, permit-free*</h2>
  <p>Over 100 shelters installed across Europe. …</p>
</div>
```
```css
.section__head{text-align:center;max-width:720px;margin:0 auto 48px}
.section__eyebrow{color:var(--brand-green);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:.8rem;margin-bottom:8px}
h2{font-size:clamp(1.6rem,2.8vw,2.4rem);letter-spacing:-.01em;font-weight:800;line-height:1.15;color:var(--color-title)}
```
Variantes en la home: centrada (por defecto, 6 veces: secciones 2, 4, 5, 6, 10, 11 — `grep -c 'class="section__head"' home.html` da 8 en total, de las que 2 llevan `style="text-align:left"`); alineada a la izquierda con `style="text-align:left"` y `.container` a `max-width:920px` inline (secciones 13 y 14); cabecera en dos columnas `.reviews-head` (sección 12); eyebrow blanco inline `style="color:#fff;opacity:.85"` en `.section--brand`.

Copy de cabecera en la home (medido): eyebrow 10-26 caracteres (moda ≈ 18); h2 21-44 caracteres (excepción: 65 en `.three-d-cta`); párrafo 54-242 caracteres (mediana ≈ 115).

### 0.4 Botones

```css
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;height:var(--button-normal-height);padding:0 28px;border-radius:var(--button-corner);font-family:var(--font-family);font-weight:var(--button-font-weight);text-transform:var(--button-text-transform);font-size:.85rem;letter-spacing:.04em;cursor:pointer;border:2px solid transparent;transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;white-space:nowrap}
.btn--lg{height:var(--button-large-height);padding:0 36px;font-size:.95rem}
.btn--primary{background:#1aa585;color:#fff}      .btn--primary:hover{background:#12755e;transform:translateY(-1px)}
.btn--secondary{background:transparent;color:#151719;border-color:#151719}  .btn--secondary:hover{background:#1aa585;color:#fff;border-color:#1aa585}
.btn--lime{background:#7ec700;color:#061827}      .btn--lime:hover{background:#84d814}
.btn--ghost-light{background:transparent;color:#fff;border-color:#fff}  .btn--ghost-light:hover{background:#fff;color:#007a4a}
```
Regla táctil (línea 3835): `.btn{min-height:var(--touch-target-min);box-sizing:border-box}` con `--touch-target-min:48px`. Esta regla **no está dentro de ningún `@media`**: el `@media (max-width:480px)` anterior se cierra en la línea 3823, dos reglas antes; `.btn{min-height:…}` queda a nivel global. Se aplica siempre, a todos los `.btn` y todos los tamaños, así que la altura real de un botón normal es **48px, no 44px**: `--touch-target-min` anula a `--button-normal-height` en todos los viewports y punteros.

### 0.5 Reveal on scroll (aplica a casi todo)

`main.js` líneas 3-15:
```js
if ('IntersectionObserver' in window) {
const targets = document.querySelectorAll('.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other');
targets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => { … e.target.classList.add('is-visible'); io.unobserve(e.target); }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
}
```
El bloque entero está envuelto en `if ('IntersectionObserver' in window)` (línea 3 abre, línea 15 cierra): sin soporte, ningún elemento recibe `.reveal` y todo se renderiza visible sin animar (degradación de accesibilidad, no un bug).
```css
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.reveal.is-visible{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
```
En la home se revelan: cada `.section__head`, cada `.feature`, `.team-wall` (el muro entero, no cada foto), cada `.collection-card`, `.product-card`, `.press-item`, `.three-d-cta`, `.calc-card`, `.case-card`, `.review`. No hay escalonado (`transition-delay`): cada elemento entra cuando cruza el 12 % de su caja, 60 px antes del borde inferior.

### 0.6 Tilt 3D en tarjetas (`main.js` líneas 16-26)

```js
const tiltEls = document.querySelectorAll('.product-card, .case-card, .calc-card, .blog-card');
el.addEventListener('mousemove', e => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `translateY(-4px) perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg)`;
});
el.addEventListener('mouseleave', () => { el.style.transform = ''; });
```
```css
.product-card,.case-card,.calc-card,.blog-card{will-change:transform;transform-style:preserve-3d;transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease}
```
Máximo ±1.5° por eje. Sustituye al `transform:translateY(-4px)` del `:hover` de CSS mientras el ratón está dentro (inline style gana).

### 0.7 Imágenes

Patrón dominante: `<picture><source type="image/webp" srcset="X-800.webp 800w, X-1200.webp 1200w, X.webp 2000w"><img src="X.jpg|png" alt="…" loading="lazy" decoding="async"></picture>`. Excepción fuera de `.product-card`/`.case-card`: las 3 tarjetas del bloque sport (`.collection-card` en `.world-block--sport`, §2.5) usan `<img>` suelto sin `<picture>`. Dentro de las 7 tarjetas `.product-card`/`.case-card` de la home, 4 rompen el patrón dominante: `product-card` #2 y `case-card` #3 tienen `srcset` con solo `800w`/`2000w` (falta el nivel `1200w`); `product-card` #3 usa como `src` un GIF 1×1 en data-URI y un único `<source>` webp sin ningún descriptor de ancho; `case-card` #2 (`organic-cereal-cooperative`) tiene el mismo patrón roto: un único `<source srcset="…satteldachhalle-12x30-02.webp">` sin descriptor. Además, **ningún** `<source>` de `.product-card`/`.case-card` lleva `sizes=` (verificado con `grep -o 'srcset="[^"]*"' home.html` sobre los bloques `product-grid`/`case-grid`), a diferencia de `.cine-hero__bg` (`sizes="100vw"`) y `.team-wall__item` (`sizes="(max-width:720px) 50vw, 320px"`); `.collection-card` tampoco lleva `sizes=`. En la traducción a `next/image`, fijar explícitamente un `sizes` coherente con el grid (algo que el propio Globotent no hace para estas tarjetas).

### 0.8 Traducción global a Next/Tailwind/shadcn

- `<Section tone="default|soft|brand|dark" className>`: `py-[72px] max-[560px]:py-12` (el corte real es `.section{padding:72px 0}` con `@media ≤560px → 48px`; `md:` por defecto es min-width 768px y dejaría 48px entre 561-767px donde debería haber 72px — ver nota de breakpoints más abajo); `soft` → `bg-[--color-bg-soft]`; `brand` → `bg-gradient-to-br from-[#1aa585] to-[#138d70] text-white`.
- `<Container>`: `mx-auto max-w-[1280px] px-6`.
- `<SectionHead eyebrow h2 p align="center|left">`: `mx-auto mb-12 max-w-[720px] text-center`; eyebrow `text-[.8rem] font-extrabold uppercase tracking-[.12em] text-primary mb-2`.
- Reveal: un hook `useReveal()` con `IntersectionObserver({threshold:.12, rootMargin:'0px 0px -60px 0px'})` que añade `data-visible`; clases `opacity-0 translate-y-[18px] transition-[opacity,transform] duration-[600ms] ease-out data-[visible]:opacity-100 data-[visible]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0`. Como el original solo revela con soporte de `IntersectionObserver` (§0.5), el hook debe renderizar `data-visible` por defecto en SSR (visible sin animar) y pasar a "oculto→revelado" solo tras montar en cliente con `IntersectionObserver` disponible; si no, el primer render del servidor queda con `opacity-0` (FOUC).
- Botones: shadcn `Button` con variantes `primary|secondary|lime|ghostLight`. Tamaño normal `size="default"` → `h-12` (48px reales, por la regla táctil de §0.4, no los 44px de `--button-normal-height`); `size="lg"` (h-14 px-9). El contenido se centra con `flex items-center justify-center gap-2` (no solo `inline-flex`). En Pavivasa las esquinas van a 0 (brief §7-3), así que `rounded-none` en vez de `rounded-full`.
- **Ojo con los prefijos responsive de este documento**: `sm:`/`md:`/`lg:`/`xl:` en Tailwind 3.4 por defecto son *min-width* 640/768/1024/1280px. Las rejillas de la home son *max-width* (1100/900/560px, ver el comentario en cada bloque CSS de §2): esos prefijos **no** reproducen esos cortes salvo que se redefina `screens` con el mapa custom de `08-responsive.md` §11.1 (`max+1`, variantes `max-*`). Sin ese `tailwind.config`, usar directamente variantes arbitrarias `max-[Npx]:`, p. ej. `grid-cols-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1` para `.features`/`.calc-grid`/`.case-grid`/`.reviews-grid`, la escalera de 4 pasos de `.product-grid` (§2.6: 4→3 en ≤1100, 3→2 en ≤900, 2→1 en ≤560), `py-[72px] max-[560px]:py-12` para `.section`, y `columns-3 max-[900px]:columns-2` para `.team-wall` (§2.4: el corte real es ≤900, no el `md:` de 768 por defecto).
- Tilt: client component `<TiltCard>` opcional; en Pavivasa el brief permite una sola sombra, por lo que el feedback hover debería ser `translate-y` + `border-color`, sin `shadow-card`.

---

## 1. Inventario ordenado (15 `<section>` + 1 `<footer>`)

| # | Línea | Clases | Propósito | `.container` | Cabecera | Rejilla | Componentes · cuántos | Fondo | CTA → destino | Hooks JS |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 129 | `cine-hero` | Hero cinematográfico con 4 "mundos" rotativos | sí (`.container.cine-hero__inner`) | eyebrow+h1+sub propios | — | 4 `picture.cine-hero__bg`, 4 `button.cine-tab`, 1 `rating-badge--compact` | 4 fotos crossfade + scrim | primario `data-cine-cta` → `/categories/storage-tents` (cambia por tab); ghost → `/pages/request-a-quote`; rating → `/pages/customer-reviews` | `data-cine-hero`, `data-cine-bg`, `data-cine-tab`, `data-cine-h1/-sub/-eyebrow/-cta`, `data-world/-eyebrow/-h1/-sub/-cta/-href` |
| 2 | 145 | `section` | Propuesta de valor "Why Globotent?" | sí | centrada, eyebrow+h2+p | `.features` 4 col / 24 px | 4 `.feature` con `details.feature__more` | blanco | ninguno | reveal |
| 3 | 193 | `home-montage` | Vídeo de fondo "instalación en pocos días" | sí (`.container.home-montage__inner`) | eyebrow+h2+p propios, izquierda | — | 1 `video[data-bg-video]` | vídeo + overlay oscuro | primario → `/pages/reference-projects` | `data-bg-video` |
| 4 | 204 | `section team-section` | Muro fotográfico del equipo | sí | centrada, eyebrow+h2+p | `.team-wall` CSS columns 3 | 10 `figure.team-wall__item` | blanco | ninguno | reveal (`.team-wall`) |
| 5 | 226 | `section section--soft` | "Our two worlds": categorías | sí | centrada, eyebrow+h2 (sin p) | 2 `.world-block` › `.kategorien` 2 col / 24 px | 5 `a.collection-card` (2 + 3) | `#f6f8f7` | `.world-block__link` → `/categories/storage-tents`, `/pages/sport` | reveal |
| 6 | 286 | `section` | "Top models": productos | sí | centrada, eyebrow+h2+p | `.product-grid` 4 col / 24 px | 4 `a.product-card` | blanco | span `btn--primary` dentro de cada card; `btn--secondary` → `/pages/all-models` | reveal, tilt |
| 7 | 337 | `trust-bar` | Franja de cifras | sí (`.container.trust-bar__grid`) | — | 4 col / 24 px | 4 `.trust-item` | `#061827` | ninguno | — |
| 8 | 346 | `press-strip` | Marquee "Featured in" | sí | label inline | flex | 14 `.press-item` (7 + 7 duplicados `aria-hidden`) | `#f6f8f7` | ninguno | reveal (cada item) |
| 9 | 368 | `section` | Oferta 3D + slider antes/después | sí | eyebrow+h2+p **dentro** de `.three-d-cta__text`, izquierda | `.three-d-cta` 1fr 1fr / 40 px | 1 `.before-after[data-before-after]` | tarjeta gradiente claro | `btn--primary btn--lg` → `/pages/3d-preview` | `data-before-after`, reveal |
| 10 | 393 | `section section--brand` | Herramientas / calculadoras | sí | centrada (blanca) | `.calc-grid` 3 col / 24 px | 3 `a.calc-card` | gradiente verde | `calc-card__cta` → `/pages/round-bale-calculator`, `/pages/machinery-calculator`, `/pages/compare-shelters` | reveal, tilt |
| 11 | 423 | `section section--soft` | Proyectos de referencia | sí | centrada, eyebrow+h2+p | `.case-grid` 3 col / 24 px | 3 `a.case-card` | `#f6f8f7` | cards → `/projects/{slug}`; `btn--secondary` → `/pages/reference-projects` | reveal, tilt |
| 12 | 465 | `section` | Reseñas | sí | `.reviews-head` (texto izq + `rating-badge` dcha) | `.reviews-grid` 3 col / 20 px | 6 `article.review` | blanco | `rating-badge` → `/pages/customer-reviews` | reveal |
| 13 | 513 | `section section--soft` | "Experience & trust" | sí, `max-width:920px` inline | izquierda, eyebrow+h2 | `.features` inline `auto-fit minmax(240px,1fr)` / 20 px | 4 `.feature` sin icono | `#f6f8f7` | ninguno | reveal |
| 14 | 540 | `section` | "Technical knowledge" | sí, `max-width:920px` inline | izquierda, eyebrow+h2 | div inline `auto-fit minmax(260px,1fr)` / 18 px | 4 `div` planos (h3+p) | blanco | `btn--secondary` → `/pages/faq` | reveal (solo la cabecera) |
| 15 | 570 | `section` | CTA final | sí | h2+p dentro de `.cta-band` | — | 1 `.cta-band` | tarjeta gradiente verde | `btn--lg btn--lime` → `/pages/request-a-quote` | — |
| F | 615 | `site-footer` | Pie | sí | — | `.site-footer__grid` 1.4fr 1fr 1fr 1fr / 40 px | 4 columnas, 22 enlaces, bottom, disclaimer | `#061827` | enlaces | `wa-fab` se oculta al intersectar |

Además, fuera de `<main>` pero presentes en la home: `a.wa-fab` (WhatsApp flotante), `div.exit-popup[data-exit-popup]` y `div.lightbox[data-lightbox]` (sin uso en la home: no hay `[data-gallery-thumb]`). Ver §3.17.

---

## 2. Sección por sección

### 2.1 `section.cine-hero` — hero cinematográfico (líneas 129-143)

**Markup literal resumido**
```html
<section class="cine-hero" data-cine-hero aria-label="Globotent — clear-span buildings &amp; covers">
  <div class="cine-hero__stage">
    <picture class="cine-hero__bg is-active" data-cine-bg>
      <source type="image/webp" srcset="assets/images/hero-agricolas-800.webp 800w, …-1200.webp 1200w, hero-agricolas.webp 1920w" sizes="100vw">
      <img src="assets/images/hero-agricolas.jpg" alt="" fetchpriority="high" decoding="async">
    </picture>
    <picture class="cine-hero__bg" data-cine-bg>… hero-almacen (loading="lazy") …</picture>
    <picture class="cine-hero__bg" data-cine-bg>… hero-ecuestre …</picture>
    <picture class="cine-hero__bg" data-cine-bg>… hero-padel …</picture>
  </div>
  <div class="cine-hero__scrim"></div>
  <div class="container cine-hero__inner">
    <p class="cine-hero__eyebrow"><span class="cine-hero__kicker" data-cine-eyebrow>Industry &amp; Agriculture</span><span class="cine-hero__meta">100+ projects across Europe</span></p>
    <h1 class="cine-hero__h1" data-cine-h1>Agricultural buildings for farms</h1>
    <p class="cine-hero__sub" data-cine-sub>Clear-span arch buildings for machinery, hay and livestock — permit-free*, assembled in days with certified Eurocode engineering.</p>
    <div class="cine-hero__actions">
      <a class='btn btn--lg btn--primary' data-cine-cta href='/categories/storage-tents'>View agricultural halls →</a>
      <a class='btn btn--lg btn--ghost-light' href='/pages/request-a-quote'>Request a quote</a>
    </div>
    <div class="cine-hero__rating"><a class='rating-badge rating-badge--compact' href='/pages/customer-reviews'><div class="stars" aria-label="5 of 5 stars">5 × svg.star 14px fill="#f4c95e"</div><span><strong>4.96 / 5</strong> from 127+ reviews</span></a></div>
    <div class="cine-hero__tabs" role="tablist">
      <button type="button" class="cine-tab is-active" data-cine-tab role="tab" aria-selected="true"
              data-world="industrie" data-eyebrow="Industry &amp; Agriculture" data-h1="Agricultural buildings for farms"
              data-sub="Clear-span arch buildings …" data-cta="View agricultural halls →" data-href="categories/storage-tents.html">
        <span class="cine-tab__no">01</span><span class="cine-tab__name">Agriculture</span>
      </button>
      <!-- 02 Storage (industrie) · 03 Equestrian (sport) · 04 Padel (sport) -->
    </div>
  </div>
</section>
```
`<head>` preconecta y precarga la primera imagen: `<link rel="preload" as="image" type="image/webp" imagesrcset="…hero-agricolas-800.webp 800w, …-1200.webp 1200w, hero-agricolas.webp 2000w" imagesizes="100vw" fetchpriority="high">` (el preload dice `2000w`, el `<source>` dice `1920w`: discrepancia menor).

**Copy**: eyebrow kicker 22 caracteres + meta 27; h1 de 32 caracteres (los 4 h1 de los tabs: 32 / 26 / 32 / 27); sub de 129 caracteres (los 4: 129 / 104 / 91 / 98); CTA "View … →" 19-25 (25 / 20 / 24 / 19); nombres de tab 5-11 (Agriculture=11, Storage=7, Equestrian=10, Padel=5).

**CSS literal** (líneas 5973-6156)
```css
.cine-hero{position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:flex-end;color:#fff;min-height:min(calc(100svh - 80px),780px)}
.cine-hero__stage{position:absolute;inset:0;z-index:0}
.cine-hero__bg{position:absolute;inset:0;display:block;opacity:0;transition:opacity 1.1s ease}
.cine-hero__bg img{width:100%;height:100%;object-fit:cover;object-position:center}
.cine-hero__bg:nth-child(1) img{object-position:center 62%}
.cine-hero__bg:nth-child(3) img{object-position:center 58%}
.cine-hero__bg.is-active{opacity:1}
.cine-hero__bg.is-active img{animation:cineZoom 8s ease-out both}
@keyframes cineZoom{from{transform:scale(1.04)}to{transform:scale(1.12)}}
.cine-hero__scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(100deg,rgba(8,16,24,.94) 0%,rgba(8,16,24,.74) 40%,rgba(8,16,24,.34) 70%,rgba(8,16,24,.08) 100%),linear-gradient(0deg,rgba(8,16,24,.66) 0%,rgba(8,16,24,0) 46%)}
.cine-hero__inner{position:relative;z-index:2;width:100%;padding-top:clamp(40px,7vh,84px);padding-bottom:clamp(24px,4vh,46px)}
.cine-hero__eyebrow{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:0 0 18px;font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em}
.cine-hero__kicker{color:var(--brand-green);display:inline-flex;align-items:center;gap:10px;transition:color .4s ease}
.cine-hero__kicker::before{content:"";width:28px;height:2px;background:currentColor;display:inline-block}
.cine-hero__meta{color:rgba(255,255,255,.72);font-weight:700;letter-spacing:.1em}
.cine-hero.is-sport .cine-hero__kicker{color:#e3fc03}
.cine-hero__h1{color:#fff;font-size:clamp(2.1rem,5.1vw,4rem);line-height:1.03;letter-spacing:-.02em;font-weight:800;margin:0 0 18px;max-width:17ch;text-shadow:0 2px 34px rgba(0,0,0,.55)}
.cine-hero__sub{font-size:clamp(1.02rem,1.45vw,1.2rem);line-height:1.5;color:rgba(255,255,255,.92);max-width:56ch;margin:0 0 26px;text-shadow:0 1px 18px rgba(0,0,0,.35)}
.cine-hero__actions{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:24px}
.cine-hero.is-sport .cine-hero__actions .btn--primary{background:#e3fc03;color:#0a0f0c;border-color:#e3fc03}
.cine-hero.is-sport .cine-hero__actions .btn--primary:hover{background:#eaff3a;border-color:#eaff3a}
.cine-hero__rating{margin-bottom:30px}
.cine-hero__rating .rating-badge{box-shadow:0 8px 26px rgba(0,0,0,.28)}
.cine-hero__tabs{display:flex;gap:0;border-top:1px solid rgba(255,255,255,.2)}
.cine-tab{flex:1 1 0;display:flex;flex-direction:column;align-items:flex-start;gap:7px;padding:18px 6px 0;margin-top:-1px;background:none;border:0;border-top:2px solid transparent;color:rgba(255,255,255,.74);cursor:pointer;text-align:left;font:inherit;transition:color .3s ease,border-color .3s ease}
.cine-tab__no{font-size:.72rem;font-weight:700;letter-spacing:.12em;opacity:.75}
.cine-tab__name{font-size:clamp(.9rem,1.25vw,1.06rem);font-weight:800;letter-spacing:.01em;text-transform:uppercase}
.cine-tab:hover{color:#fff}
.cine-tab.is-active{color:#fff;border-top-color:var(--brand-green)}
.cine-hero.is-sport .cine-tab.is-active{border-top-color:#e3fc03}
.cine-hero__h1.is-swap,.cine-hero__sub.is-swap{animation:cineSwap .5s ease both}
@keyframes cineSwap{from{opacity:0;transform:translateY(11px)}to{opacity:1;transform:none}}
@media (max-width:760px){
  .cine-hero{min-height:min(92svh,700px)}
  .cine-hero__inner{padding-top:clamp(60px,12vh,110px)}
  .cine-hero__h1{font-size:clamp(1.95rem,8.4vw,2.7rem);max-width:none}
  .cine-hero__sub{font-size:1rem}
  .cine-hero__actions .btn{flex:1 1 100%;justify-content:center}
  .cine-hero__tabs{flex-wrap:wrap}
  .cine-tab{flex:1 1 42%;padding:13px 6px 0}
  .cine-tab__name{font-size:.85rem}}
@media (prefers-reduced-motion:reduce){
  .cine-hero__bg{transition:opacity .01s}
  .cine-hero__bg.is-active img{animation:none}
  .cine-hero__h1.is-swap,.cine-hero__sub.is-swap{animation:none}}
```

**JS literal** (`main.js` líneas 64-99)
```js
document.querySelectorAll('[data-cine-hero]').forEach(function (hero) {
  var bgs = hero.querySelectorAll('[data-cine-bg]'), tabs = hero.querySelectorAll('[data-cine-tab]');
  var h1 = hero.querySelector('[data-cine-h1]'), sub = hero.querySelector('[data-cine-sub]'), eye = hero.querySelector('[data-cine-eyebrow]'), cta = hero.querySelector('[data-cine-cta]');
  var n = tabs.length; if (n < 2) return;
  var idx = 0, timer = null; var DELAY = 5500;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function swap(el) { if (!el) return; el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); }
  function show(i) {
    idx = (i + n) % n; var t = tabs[idx];
    bgs.forEach(function (b, k) { b.classList.toggle('is-active', k === idx); });
    tabs.forEach(function (b, k) { var on = k === idx; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    if (h1)  { h1.textContent = t.getAttribute('data-h1'); swap(h1); }
    if (sub) { sub.textContent = t.getAttribute('data-sub'); swap(sub); }
    if (eye) { eye.textContent = t.getAttribute('data-eyebrow'); }
    if (cta) { cta.textContent = t.getAttribute('data-cta'); cta.setAttribute('href', t.getAttribute('data-href')); }
    hero.classList.toggle('is-sport', t.getAttribute('data-world') === 'sport');
  }
  function start() { if (reduce) return; stop(); timer = setInterval(function () { show(idx + 1); }, DELAY); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }
  tabs.forEach(function (b, k) { b.addEventListener('click', function () { show(k); start(); }); });
  hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  start();
});
```

**Mecanismo, en orden**
1. Las 4 `<picture>` están apiladas (`position:absolute;inset:0`) con `opacity:0`; solo la que lleva `is-active` está a `opacity:1`. El cambio es un **crossfade de 1.1 s** (`transition:opacity 1.1s ease`).
2. Al recibir `is-active`, el `img` interior arranca `cineZoom`: **8 s ease-out de scale(1.04) a scale(1.12)**, `both` (se queda en 1.12). Como el intervalo es de **5500 ms**, la foto sigue haciendo zoom cuando entra el crossfade de la siguiente; al volver a activarse más tarde, la animación reinicia desde 1.04 (la clase se quita y se vuelve a poner).
3. El texto no se cruza: `show()` sustituye `textContent` de h1/sub y fuerza reflow (`void el.offsetWidth`) para relanzar `cineSwap` (0.5 s, fade + 11 px hacia arriba). El eyebrow y el CTA cambian sin animación; el CTA cambia también su `href` al `data-href` del tab.
4. Tabs 03 y 04 llevan `data-world="sport"` → `hero.is-sport`: kicker, borde del tab activo y botón primario pasan a lima `#e3fc03` (texto `#0a0f0c`).
5. Pausa con `mouseenter`, reanuda con `mouseleave`; para al ocultar la pestaña (`visibilitychange`); clic en tab = `show(k)` + reinicio del temporizador. Con `prefers-reduced-motion` no hay autoplay, ni zoom, ni swap (solo clic manual).
6. No hay parallax en este hero: el módulo `heroBgs` (`main.js` 27-33, `translateY(scrollY*0.25)`) busca `.hero__bg`, que no existe en la home (`grep -rl 'class="hero__bg' site` → 0 páginas; ojo, una búsqueda de la subcadena `hero__bg` sin el prefijo `class="` da 74 falsos positivos con la clase no relacionada `.page-hero__bg` de las páginas interiores — usar el grep exacto citado). `[data-hero-slider]` (líneas 34-63, `DELAY = 6000`) tampoco está en la home.
7. Discrepancia en el código: el `href` inicial es `/categories/storage-tents` pero los `data-href` son rutas relativas con `.html` (`categories/storage-tents.html`); tras la primera rotación el CTA apunta a `categories/fabric-buildings.html`. No se puede confirmar sin navegador si el host reescribe `.html`.
8. Accesibilidad: `role="tablist"` / `role="tab"` / `aria-selected` sí; no hay `aria-controls`, ni navegación con flechas, ni control de pausa visible.

**Traducción a Next/Tailwind/shadcn**
- `components/secciones/HeroCine.tsx` (client). Props: `slides: {eyebrow,h1,sub,cta:{label,href},world:'a'|'b',image}[]`, `delayMs=5500`.
- Imágenes: `next/image` con `fill sizes="100vw"` y `priority` solo en la primera; las otras `loading="lazy"`. Contenedor `relative isolate overflow-hidden flex items-end min-h-[min(calc(100svh-80px),780px)] max-md:min-h-[min(92svh,700px)]`.
- Capa por slide: `absolute inset-0 transition-opacity duration-[1100ms] ease-in-out data-[active=true]:opacity-100 opacity-0`; la `img` interior `object-cover data-[active=true]:animate-cine-zoom motion-reduce:animate-none`. En `tailwind.config`: `keyframes.cineZoom {from:{transform:'scale(1.04)'},to:{transform:'scale(1.12)'}}`, `animation['cine-zoom']:'cineZoom 8s ease-out both'`. Para reiniciar el zoom al reactivar, remonta el `<img>` con `key={\`${i}-${activationCount}\`}`, donde `activationCount` es un contador por slide (`activationCount[i]`, estado del propio componente `HeroCine`, inicializado en 0) que se incrementa cada vez que `show(i)` activa esa imagen, incluida la reactivación tras rotar.
- Scrim: `absolute inset-0 z-[1] bg-[linear-gradient(100deg,rgba(8,16,24,.94)_0%,rgba(8,16,24,.74)_40%,rgba(8,16,24,.34)_70%,rgba(8,16,24,.08)_100%),linear-gradient(0deg,rgba(8,16,24,.66)_0%,rgba(8,16,24,0)_46%)]`.
- Texto: `key={idx}` en `<h1>`/`<p>` para relanzar `animate-cine-swap` (`cineSwap .5s ease both`).
- Tabs: shadcn `Tabs` (Radix) da `role=tablist/tab`, `aria-selected`, flechas de teclado. `TabsTrigger` con `flex-1 flex-col items-start gap-[7px] border-t-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent`.
- Temporizador: `useEffect` con `setInterval(delayMs)`, limpiar en `onMouseEnter`, `visibilitychange` y `useReducedMotion` (media query manual: `matchMedia('(prefers-reduced-motion: reduce)')`).
- Rating badge: **no aplica a Pavivasa** (brief §1: cero reseñas; §7-6 prohíbe estrellas).

### 2.2 `section.section` — "Why Globotent?" (líneas 145-191)

**Markup**
```html
<section class="section"><div class="container">
  <div class="section__head"><div class="section__eyebrow">Why Globotent?</div><h2>Fast, robust, permit-free*</h2><p>Over 100 shelters installed across Europe. From a single source: consultation, planning, delivery and installation.</p></div>
  <div class="features">
    <div class="feature">
      <div class="feature__icon"><img src="assets/images/selection_quote.png" alt="" role="presentation" aria-hidden="true" loading="lazy"></div>
      <h3>Permit-free*</h3>
      <p>Temporary structures — no months of paperwork.</p>
      <details class="feature__more"><summary>More info</summary><p>Permit exemption depends on … see the footer disclaimer for details.</p></details>
    </div>
    <!-- ×4: Permit-free* · Installed in 1 day · Delivery included · One-stop provider -->
  </div>
</div></section>
```
**Copy**: eyebrow 14; h2 26; p 115; h3 12-18; p corto 46-65; p del `details` 181-245. Iconos: 4 PNG (`selection_quote.png`, `express_setup.png`, `delivery_truck.png`, `permit_management.png`) pasados a blanco con `filter:brightness(0) invert(1)`.

**CSS** (464-535)
```css
.features{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}   /* ≤1100px: 2 col · ≤560px: 1 col */
.feature{background:#fff;border:1px solid var(--color-border);border-radius:var(--radius);padding:28px;transition:transform .2s ease,box-shadow .2s ease}
.feature:hover{transform:translateY(-4px);box-shadow:var(--shadow-card)}
.feature__icon{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,var(--brand-green),var(--brand-green-deep));display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.feature__icon img{width:32px;height:32px;filter:brightness(0) invert(1)}
.feature h3{margin:0 0 8px}  .feature p{font-size:.95rem;margin:0}
.feature__more{margin-top:10px;font-size:.85rem}
.feature__more summary{cursor:pointer;color:var(--brand-green-deep);font-weight:700;list-style:none;display:inline-flex;align-items:center;gap:6px;user-select:none}
.feature__more summary::-webkit-details-marker{display:none}
.feature__more summary::before{content:"i";display:inline-flex;width:16px;height:16px;border-radius:50%;background:var(--brand-green);color:#fff;…;font-size:.7rem;font-weight:800;font-style:italic;font-family:Georgia,serif}
.feature__more[open] summary::before{content:"−";font-family:inherit;font-style:normal}
.feature__more p{margin-top:8px;font-size:.85rem;color:var(--color-sub-title);line-height:1.55}
```
Sin JS propio: el desplegable es `<details>` nativo. `::-webkit-details-marker{display:none}` oculta el triángulo nativo de WebKit/Blink; sin esa regla se duplicaría con el icono circular "i"/"−" custom de `::before`. Reveal en `.section__head` y en cada `.feature`.

**Traducción**: `<Section><Container><SectionHead/><div className="grid gap-6 grid-cols-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">` con `<Card className="rounded-none border p-7 transition-transform hover:-translate-y-1">`. El "More info" → shadcn `Accordion type="single" collapsible` (o `Collapsible`) con trigger `text-[.85rem] font-bold text-primary`; si se usa `<details>` nativo en vez de Radix, recordar `[&::-webkit-details-marker]:hidden` para no duplicar el marcador del navegador con el icono custom. En Pavivasa el contenido natural son los 4 claims verificables (15 años · garantía 10 años con mantenimiento · 30 % repiten · empresas/particulares/profesionales) del brief §1.

### 2.3 `section.home-montage` — vídeo de fondo (líneas 193-202)

**Markup**
```html
<section class="home-montage">
  <video class="home-montage__bg" muted loop playsinline preload="none" poster="assets/images/reitplatz-aufbau-poster.jpg" data-bg-video="assets/video/reitplatz-aufbau.mp4"></video>
  <div class="home-montage__overlay"></div>
  <div class="container home-montage__inner">
    <span class="section__eyebrow" style="color:var(--brand-green)">One-stop installation</span>
    <h2>Your building up in a few days</h2>
    <p>Our own installation teams erect clear-span structures … The video shows the installation of a riding arena cover.</p>
    <a class='btn btn--lg btn--primary' href='/pages/reference-projects'>View projects →</a>
  </div>
</section>
```
**Copy**: eyebrow 21; h2 30; p 234; CTA 15.

**CSS** (5386-5418)
```css
.home-montage{position:relative;overflow:hidden;background:#061827;color:#fff}
.home-montage__bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.home-montage__overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(6,24,39,.88) 0%,rgba(6,24,39,.55) 60%,rgba(6,24,39,.35) 100%)}
.home-montage__inner{position:relative;z-index:2;padding:clamp(48px,8vw,96px) 24px;max-width:688px}
.home-montage__inner h2{color:#fff;font-size:clamp(1.8rem,3.5vw,2.8rem);line-height:1.08;letter-spacing:-.01em;margin:10px 0 12px}
.home-montage__inner p{color:rgba(255,255,255,.85);font-size:1.1rem;line-height:1.5;margin:0 0 24px}
```
Ojo: `.home-montage__inner` tiene `max-width:688px` y `margin:0 auto` heredado de `.container` → el bloque de texto queda **centrado como caja** pero con texto alineado a la izquierda; el overlay es más oscuro a la izquierda (.88) que a la derecha (.35). Sin `.section`, la altura la da el padding `clamp(48px,8vw,96px)`.

**JS** (`main.js` 720-742, IIFE aparte al final)
```js
var v = document.querySelector('video[data-bg-video]'); if (!v) return;
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
if (conn && conn.saveData) return;            // Data-Saver an → nur Poster zeigen
function load(){ if (v.dataset.loaded) return; v.dataset.loaded = '1';
  var s = document.createElement('source'); s.src = v.getAttribute('data-bg-video'); s.type = 'video/mp4';
  v.appendChild(s); v.autoplay = true; v.muted = true; v.load();
  var p = v.play(); if (p && p.catch) p.catch(function(){}); }
new IntersectionObserver(function(entries){ entries.forEach(function(e){ if (e.isIntersecting){ load(); io.disconnect(); } }); }, { rootMargin: '200px' }).observe(v);
```
Mecanismo: el `<video>` no tiene `<source>` en el HTML (`preload="none"` + `poster`); el MP4 solo se inyecta cuando la sección está a 200 px del viewport, y nunca con reduced-motion o Data Saver (queda el póster). No hay control de pausa para el usuario.

**Traducción**: `<BandaVideo>` client component; `<video muted loop playsInline preload="none" poster>` y `useEffect` con `IntersectionObserver({rootMargin:'200px'})` que hace `video.src = mp4` + `play().catch(()=>{})`; respetar `matchMedia('(prefers-reduced-motion: reduce)')` y `navigator.connection?.saveData`. Overlay `bg-gradient-to-r from-[rgba(6,24,39,.88)] via-[rgba(6,24,39,.55)] via-60% to-[rgba(6,24,39,.35)]`. Para Pavivasa **no hay vídeo** (brief: ninguna foto/vídeo en las páginas de servicio): usar `BloquePosicion` como fondo hasta que exista material.

### 2.4 `section.section.team-section` + `.team-wall` — muro de fotos (líneas 204-224)

**Markup**
```html
<section class="section team-section"><div class="container">
  <div class="section__head"><div class="section__eyebrow">The team behind Globotent</div><h2>Real people. Real buildings.</h2><p>Behind every clear-span building is our own installation team … These pictures are straight from our sites across Europe.</p></div>
  <div class="team-wall">
    <figure class="team-wall__item"><picture><source type="image/webp" srcset="assets/images/team-globotent-01-800.webp 800w, …-1200.webp 1200w, team-globotent-01.webp 2000w" sizes="(max-width:720px) 50vw, 320px"><img src="assets/images/team-globotent-01.jpg" alt="The Globotent installation team on site" loading="lazy" decoding="async"></picture></figure>
    <!-- ×10, orden de archivo: 01, 02, 04, 07, 03, 11, 05, 08, 06, 10 (no hay 09) -->
  </div>
</div></section>
```
**Copy**: eyebrow 25; h2 28; p 242 (el más largo de las cabeceras). Cada `img` lleva `alt` descriptivo (10 distintos). Sin `<figcaption>`.

**CSS** (5419-5467)
```css
.team-section{padding-bottom:clamp(48px,7vw,88px)}
.team-section .section__head p{max-width:680px;margin-left:auto;margin-right:auto}
.team-wall{column-count:3;column-gap:14px;margin-top:clamp(24px,4vw,40px)}
.team-wall__item{break-inside:avoid;margin:0 0 14px;border-radius:16px;overflow:hidden;box-shadow:0 8px 26px rgba(6,24,39,.10);background:#eef1f3;position:relative;transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s ease}
.team-wall__item img{display:block;width:100%;height:auto;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.team-wall__item::after{content:"";position:absolute;inset:0;border-radius:16px;box-shadow:inset 0 0 0 1px rgba(6,24,39,.06);pointer-events:none}
.team-wall__item:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(6,24,39,.18)}
.team-wall__item:hover img{transform:scale(1.05)}
@media(max-width:900px){.team-wall{column-count:2}}
@media(max-width:480px){.team-wall{column-count:2;column-gap:10px}.team-wall__item{margin-bottom:10px;border-radius:13px}}
```
Mecanismo: **masonry por CSS multi-columna** (`column-count`, no grid): el navegador reparte los 10 `figure` en 3 columnas equilibradas en altura; el orden visual es por columnas, no por filas. Radio 16 px (no el `--radius` de 12). Hover: elevación 4 px + sombra más profunda + **zoom de la foto 1.05 en 0.6 s** con `cubic-bezier(.2,.7,.2,1)`. Reveal: la clase `.reveal` se pone en `.team-wall` entero, así que las 10 fotos aparecen a la vez. Sin lightbox (no hay `[data-gallery-thumb]`).

**Traducción**: `<MuroFotos items>` con `columns-3 max-[900px]:columns-2 gap-[14px]` (corte real ≤900px, no el `md:` de 768 por defecto) y cada `figure` `break-inside-avoid mb-[14px] overflow-hidden [&_img]:transition-transform [&_img]:duration-[600ms] hover:[&_img]:scale-105`. `next/image` con `sizes="(max-width:720px) 50vw, 320px"` y `width/height` reales (masonry necesita altura intrínseca). Para Pavivasa: **cero fotos de personas** (brief §7-6) → o se elimina o se reconvierte en muro de obras con `BloquePosicion` a distintas proporciones, marcado pendiente hasta catalogar las 77 fotos de `/proyectos/` (brief §4).

### 2.5 `section.section.section--soft` — "Our two worlds" (`.world-block` / `.sport-world` / `.kategorien` / `.collection-card`) (líneas 226-284)

**Markup**
```html
<section class="section section--soft"><div class="container">
  <div class="section__head"><div class="section__eyebrow">Our two worlds</div><h2>The right solution for every operation.</h2></div>
  <div class="world-block">
    <div class="world-block__head"><h3>Industry &amp; Agriculture</h3><a class='world-block__link' href='/categories/storage-tents'>All buildings →</a></div>
    <div class="kategorien">
      <a class='collection-card' href='/categories/storage-tents'>
        <picture>…rundbogenhalle-9x20-05…</picture>
        <div class="collection-card__label"><span>Category</span><h3>Arched storage tents</h3></div>
      </a>
      <a class='collection-card' href='/categories/fabric-buildings'>… <h3>Fabric buildings</h3> …</a>
    </div>
  </div>
  <div class="world-block world-block--sport sport-world">
    <div class="world-block__head"><h3><span class="world-block__sport-logo">globotent</span> SPORTS</h3><a class='world-block__link' href='/pages/sport'>To the sports world →</a></div>
    <div class="kategorien">
      <a class='collection-card' href='/categories/padel-tennis-covers'><img src="assets/images/padel-court-01.jpg" alt="Padel & tennis court covers" loading="lazy" decoding="async"><div class="collection-card__label"><span>Category</span><h3>Padel &amp; tennis court covers</h3></div></a>
      <a class='collection-card' href='/categories/riding-arena-covers'>…Riding arena covers…</a>
      <a class='collection-card' href='/categories/pickleball'>…Pickleball court covers…</a>
    </div>
  </div>
</div></section>
```
**Copy**: eyebrow 14; h2 39, sin párrafo; h3 de bloque 16-22; h3 de tarjeta 16-27; kicker de tarjeta siempre "Category"; enlaces "All buildings →" / "To the sports world →".

**CSS**
```css
.collections,.kategorien{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}     /* ≤720px: 1fr */
.collection-card{position:relative;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10;display:block;color:#fff}
.collection-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.collection-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,24,39,0) 40%,rgba(6,24,39,.85) 100%)}
.collection-card:hover img{transform:scale(1.05)}
.collection-card__label{position:absolute;left:24px;right:24px;bottom:20px;z-index:1}
.collection-card__label h3{color:#fff;margin:0 0 4px;font-size:1.6rem}
.collection-card__label span{color:var(--brand-lime);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.8rem}

.world-block{margin-bottom:46px}  .world-block:last-child{margin-bottom:0}
.world-block__head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:22px;padding-bottom:12px;border-bottom:2px solid var(--color-border)}
.world-block__head h3{font-size:1.5rem;color:var(--color-title);margin:0;letter-spacing:-.01em}
.world-block__link{font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:.8rem;color:var(--brand-green);white-space:nowrap}
.world-block__link:hover{color:var(--brand-green-dark)}

.world-block--sport .world-block__head{border-bottom-color:#000;border-bottom-width:1px;position:relative}
.world-block--sport .world-block__head::after{content:"";position:absolute;left:0;bottom:-1px;width:64px;height:3px;background:#e3fc03}
.world-block--sport .world-block__head h3{font-family:'Clash Display',var(--font-family);font-weight:600;text-transform:uppercase}
.world-block--sport .world-block__sport-logo{color:#000}
.world-block--sport .world-block__link{color:#000}
.world-block--sport .world-block__link:hover{box-shadow:inset 0 -.55em 0 #e3fc03}
.world-block--sport .kategorien .collection-card:last-child:nth-child(odd){grid-column:1 / -1;justify-self:center;width:calc(50% - 12px)}   /* ≤760px: width:100% */
.sport-world{--sport-lime:#e3fc03;--sport-ink:#000;--sport-soft:#f4f4f2;--sport-line:#000;--sport-sub:#323232}
.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1{font-family:'Clash Display',var(--font-family)}
```
Mecanismos: (a) tarjeta-imagen 16:10 con degradado inferior y label superpuesta; **hover = zoom 1.05 en 0.4 s** de la foto (el mismo gesto que `.team-wall__item`, `.product-card__media img` y `.case-card__media img`). (b) El bloque sport cambia de sistema visual dentro de la misma sección: negro + lima `#e3fc03`, subrayado corto de 64×3 px bajo la cabecera, hover del enlace tipo rotulador (`box-shadow:inset 0 -.55em 0 #e3fc03`), y la tercera tarjeta (impar) se centra ocupando media anchura. (c) `'Clash Display'` no está cargada → Figtree 600.

`.world-panel` (CSS 4096-4175: paneles `flex:1 1 0; min-height:470px; border-radius:20px; transition:flex-grow .55s cubic-bezier(.2,.7,.3,1)`, fondo `transform .7s`, degradados `--industrie`/`--sport`, y `.world-hero__split{display:flex;gap:14px;max-width:1480px}`) **no aparece en el markup de ninguna de las 78 páginas del espejo** (`grep -rl world-panel site home.html` → nada). Es CSS huérfano, presumiblemente de un hero anterior de "dos paneles que se expanden al hover". No copiar de ahí nada que no se pueda ver.

El bloque huérfano es más extenso de lo que sugiere esa sola cita: `grep -n 'world-panel\|world-hero' main.pretty.css` devuelve coincidencias en **dos** rangos, ninguno con markup asociado en las 78 páginas: 4062-4175 (`.world-hero__intro`/`.world-hero__split` + `.world-panel` base, ~113 líneas) y un **segundo bloque en 4956-5023** (~68 líneas) con `.world-hero--split` — una variante alternativa de hero de dos paneles que además incluye `.world-hero__badge` (posicionado `absolute;left:50%;top:20px`) reutilizando `.rating-badge`/`.rating-badge--compact` con fondo semitransparente y `backdrop-filter:blur(6px)`. Ninguno de los dos bloques (~180 líneas combinadas) tiene markup en el espejo; no usar tampoco el tratamiento de badge superpuesto como referencia.

**Traducción**: `<RejillaEspacios>` = `grid gap-6 sm:grid-cols-2` con `<Link className="group relative block aspect-[16/10] overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-40% after:to-[rgba(6,24,39,.85)]">` + `next/image fill className="object-cover transition-transform duration-[400ms] group-hover:scale-105"` + label `absolute inset-x-6 bottom-5 z-[1]`. Es el patrón exacto para "¿Qué quieres pavimentar?" con 6 espacios (brief §7-4, pantalla 02): `grid-cols-2 md:grid-cols-3`, con `BloquePosicion` en vez de foto. El sub-bloque `world-block__head` (h3 + enlace "ver todo" con línea inferior) es reutilizable como `<CabeceraBloque>` para "servicios" (7) con enlace a la página de servicio.

### 2.6 `section.section` — "Top models" (`.product-grid` / `.product-card`) (líneas 286-335)

**Markup**
```html
<div class="section__head"><div class="section__eyebrow">Top models</div><h2>Most popular shelters</h2><p>Our best-selling models — available for fast delivery.</p></div>
<div class="product-grid">
  <a class='product-card' href='/products/storage-tent-9x20'>
    <div class="product-card__media"><picture>…rundbogenhalle-9x20-01…</picture></div>
    <div class="product-card__body">
      <h3 class="product-card__title">Arched Storage Tent 9.15 × 20 × 4.50 m</h3>
      <p class="product-card__meta">Versatile shelter for farming &amp; industry</p>
      <div class="product-card__badges"><span class="product-card__badge">9.15 × 20 × 4.50 m</span><span class="product-card__badge product-card__badge--alt">ca. 183 m²</span></div>
      <span class="btn btn--primary product-card__cta">View details</span>
    </div>
  </a>
  <!-- ×4 -->
</div>
<div style="text-align:center;margin-top:40px"><a class='btn btn--secondary' href='/pages/all-models'>See all models</a></div>
```
**Copy**: eyebrow 10; h2 21; p 54; títulos 35-39 (todos con dimensiones); meta 32-47; badge 1 = dimensiones, badge 2 = "ca. NNN m²"; CTA "View details" (es un `<span>` con clase de botón dentro del `<a>`, no un enlace propio).

**CSS**
```css
.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}   /* ≤1100: 3 · ≤900: 2 · ≤560: 1 */
.product-card{background:#fff;border:1px solid var(--color-border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}   /* ≤560: border-radius:10px */
.product-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-card);border-color:var(--brand-green)}
.product-card__media{aspect-ratio:4/3;background:var(--color-bg-soft);overflow:hidden}
.product-card__media img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.product-card:hover .product-card__media img{transform:scale(1.04)}
.product-card__body{padding:20px;display:flex;flex-direction:column;flex:1}
.product-card__title{font-size:1.05rem;font-weight:700;color:var(--color-title);margin:0 0 8px;min-height:2.6em}
.product-card__meta{font-size:.85rem;color:var(--color-sub-title);margin:0 0 16px;flex:1}
.product-card__badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.product-card__badge{display:inline-block;padding:4px 10px;background:rgba(26,165,133,.10);color:var(--brand-green-dark);font-weight:800;font-size:.78rem;letter-spacing:.02em;border-radius:999px}
.product-card__badge--alt{background:var(--color-bg-soft);color:var(--color-title)}
.product-card__cta{margin-top:auto}
```
Mecanismo: tarjeta entera clicable; media 4:3 con zoom 1.04 en hover; título con `min-height:2.6em` para alinear; `meta` con `flex:1` empuja badges y CTA al fondo. Hover CSS (-4 px + sombra + borde verde) más tilt JS (§0.6). Reveal por tarjeta.

**Traducción**: rejilla `grid gap-6 grid-cols-4 max-[1100px]:grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1` (la escalera real de `.product-grid`: 4→3 en ≤1100, 3→2 en ≤900, 2→1 en ≤560). shadcn `Card` sin `CardHeader`: `<Link className="group flex flex-col overflow-hidden border bg-white transition-[transform,border-color] hover:-translate-y-1 hover:border-primary">`; media `aspect-[4/3] overflow-hidden bg-[--fondo-alt]` con `img group-hover:scale-[1.04] duration-[400ms]`; cuerpo `flex flex-col flex-1 p-5`, título `min-h-[2.6em]`, meta `flex-1` y CTA `mt-auto` (necesarias para que tarjetas con títulos de distinta longitud alineen badges/CTA al fondo, igual que `min-height:2.6em`/`flex:1`/`margin-top:auto` del CSS original); badges = shadcn `Badge variant="secondary"` (`rounded-none`, mono en versalitas para datos según brief §7-3). Mapeo Pavivasa: rejilla de los **7 servicios** (título = servicio, meta = frase literal del brief, badges = aplicaciones o "sin obra documentada"), con los 3 fuertes destacados (impreso, pulido, microcemento).

### 2.7 `section.trust-bar` (líneas 337-344)

```html
<section class="trust-bar"><div class="container trust-bar__grid">
  <div class="trust-item"><strong>220 kg/m²</strong><span>Standard snow load (reinforceable)</span></div>
  <div class="trust-item"><strong>100 kg/m²</strong><span>Standard wind load</span></div>
  <div class="trust-item"><strong>Engineering included</strong><span>Technical drawings + calculation</span></div>
  <div class="trust-item"><strong>One-stop provider</strong><span>Consulting · Permits · Delivery · Installation</span></div>
</div></section>
```
```css
.trust-bar{background:var(--brand-dark);color:#dfe7ea;padding:28px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.trust-bar__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}   /* ≤900: 1fr 1fr gap 20 · ≤560: 1fr */
.trust-item strong{display:block;color:var(--brand-lime);font-size:1.3rem;font-weight:800;margin-bottom:4px}
.trust-item span{font-size:.85rem;color:#9eb3bd}
.trust-item em{font-style:normal;color:#6a8292}   /* no se usa en la home */
```
4 ítems: 2 cifras + 2 frases. `strong` 9-20 caracteres, `span` 18-46. Sin JS, sin reveal. Colocada **después** de productos y **antes** de prensa: separa oferta de prueba.

**Traducción**: es exactamente `BarraConfianza` del brief (§7-2): `bg-[--tinta] text-[--sobre-tinta] py-7 grid grid-cols-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-6 text-center`, cifra en display 26 px acento y texto 14 px atenuado. Datos reales: MÁS DE 15 AÑOS · 10 AÑOS DE GARANTÍA CON MANTENIMIENTO · cobertura · MÁS DEL 30 % REPITEN (brief §7-5). El dato de cobertura **existe** literal en brief §1 ("Valencia, Castellón, Alicante, Murcia, Albacete y Almería…") y §2 (línea 379: "Cobertura real: web 6 provincias, Facebook 9 municipios"); lo que sigue siendo `DatoPendiente` es solo la **decisión** de zona prioritaria y su condensación a 3-6 palabras para caber en `.trust-item` (p. ej. "6 PROVINCIAS" o 2-3 zonas ancla), no el dato en sí.

### 2.8 `section.press-strip` — marquee (líneas 346-366)

```html
<section class="press-strip"><div class="container">
  <span class="press-strip__label">Featured in</span>
  <div class="press-strip__logos" aria-label="Featured in industry press">
    <div class="press-item">Farmers Weekly</div> … <div class="press-item">Top Agrar International</div>   <!-- 7 -->
    <div class="press-item" aria-hidden="true">Farmers Weekly</div> … <!-- los mismos 7, duplicados -->
  </div>
</div></section>
```
```css
.press-strip{padding:28px 0;background:var(--color-bg-soft);overflow:hidden}
.press-strip .container{display:flex;align-items:center;gap:32px}
.press-strip__label{color:var(--color-sub-title);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;white-space:nowrap}
.press-strip__logos{display:flex;gap:40px;flex:1;overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);animation:press-scroll 40s linear infinite;align-items:center}
.press-item{flex-shrink:0;color:var(--color-title);font-family:Georgia,serif;font-style:italic;font-size:1.05rem;font-weight:700;opacity:.65;transition:opacity .2s;white-space:nowrap}
.press-item:hover{opacity:1}
@keyframes press-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (max-width:700px){.press-strip .container{flex-direction:column;align-items:flex-start;gap:14px}}
/* parches posteriores */
.press-strip__logos{width:max-content;flex:0 0 auto;animation:press-scroll 40s linear infinite}   /* línea 3620 */
.press-strip__logos:hover{animation-play-state:paused}                                             /* línea 3624 */
.press-strip__logos{min-width:0;width:100%}                                                         /* línea 4649 */
.press-strip,.press-strip .container{overflow-x:clip;max-width:100%}                                /* línea 4652 */
```
Mecanismo: **no hay JS**. Los 7 nombres se duplican en HTML (segunda tanda `aria-hidden="true"`) y el contenedor se desplaza `translateX(0 → -50%)` en **40 s lineal infinito**; como la mitad del contenido es idéntica a la otra, el salto al reiniciar es invisible **solo si el ancho de la pista es exactamente el del contenido**. Cascada real: la línea 3620 pone `width:max-content` (correcto para el bucle) pero la 4649 lo sobrescribe con `width:100%` y `min-width:0`; queda `flex:0 0 auto` de 3620. Con `width:100%` el `-50%` es la mitad del contenedor, no de la pista: el bucle puede no ser perfectamente continuo. No verificable sin navegador. Los bordes se funden con `mask-image` (5 % / 95 %). Hover pausa. Son **texto** en Georgia itálica, no logotipos. Cada `.press-item` recibe `.reveal` del observer (fade individual al entrar).

**Traducción**: `<Marquee items>`: `overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]` › `flex w-max gap-10 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none` con `keyframes.marquee:{from:{transform:'translateX(0)'},to:{transform:'translateX(-50%)'}}` y `animation.marquee:'marquee 40s linear infinite'`; renderizar `[...items, ...items]` con `aria-hidden` en la segunda mitad. **No aplica a Pavivasa**: no tiene prensa ni logos de cliente (brief §1: "Certificaciones / marcas: ninguna"; §7-6 prohíbe logos de clientes). Los logos Kit Digital van en el pie, no en marquee.

### 2.9 `section.section` › `.three-d-cta` + `.before-after[data-before-after]` (líneas 368-391)

**Markup**
```html
<section class="section"><div class="container">
  <div class="three-d-cta">
    <div class="three-d-cta__text">
      <div class="section__eyebrow">Free · No obligation</div>
      <h2>Request a 3D preview — see how the shelter will look on your land</h2>
      <p>Upload a photo of your site and choose category and colour. … within 24 hours — completely free, no purchase obligation.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a class='btn btn--primary btn--lg' href='/pages/3d-preview'>Upload photo now</a></div>
    </div>
    <div class="three-d-cta__visual">
      <div class="before-after" data-before-after>
        <img src="assets/images/globotent-vorher.webp" alt="Site before installation of the Globotent shelter" class="before-after__before">
        <img src="assets/images/globotent-nachher.webp" alt="Site with installed Globotent arched shelter" class="before-after__after">
        <div class="before-after__label before-after__label--before">Before</div>
        <div class="before-after__label before-after__label--after">After</div>
        <div class="before-after__handle"><div>↔</div></div>
        <div class="before-after__notice">Real Globotent project · We create your personalised 3D rendering within 24 h based on your photo</div>
      </div>
    </div>
  </div>
</div></section>
```
**Copy**: eyebrow 20; h2 65 (el más largo); p 185; CTA 16; notice 96.

**CSS `.three-d-cta`** (3278-3303)
```css
.three-d-cta{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;background:linear-gradient(135deg,#f6f8f7,#eaf3f0);border-radius:var(--radius);padding:48px;border:1px solid var(--color-border)}
.three-d-cta__text h2{margin:8px 0 14px;font-size:clamp(1.6rem,3vw,2.2rem)}
.three-d-cta__text p{color:var(--color-text);font-size:1.02rem;line-height:1.6;margin:0}
.three-d-cta__visual{border-radius:var(--radius);overflow:hidden;box-shadow:0 20px 40px rgba(6,24,39,.15)}
@media (max-width:900px){.three-d-cta{grid-template-columns:1fr;padding:28px}}
```
**CSS `.before-after`** (2812-2905 + parches 3611-3613)
```css
.before-after{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:12px;user-select:none;touch-action:pan-y;isolation:isolate}
.before-after img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}
.before-after__after{clip-path:inset(0 0 0 50%)}
.before-after__handle{position:absolute;top:0;bottom:0;left:50%;width:4px;background:#fff;cursor:ew-resize;transform:translateX(-50%);box-shadow:0 0 0 1px rgba(6,24,39,.12)}
.before-after__handle::before,.before-after__handle::after{content:"";position:absolute;top:50%;transform:translateY(-50%);width:16px;height:2px;background:#fff}
.before-after__handle::before{right:100%;margin-right:4px}  .before-after__handle::after{left:100%;margin-left:4px}
.before-after__handle>div{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:#fff;color:var(--brand-green-dark);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,.25)}
.before-after__label{position:absolute;top:14px;padding:6px 12px;background:rgba(6,24,39,.75);color:#fff;border-radius:50px;font-size:.78rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;z-index:2}
.before-after__label--before{left:14px}  .before-after__label--after{right:14px}
.before-after__notice{position:absolute;left:14px;right:14px;bottom:14px;background:rgba(6,24,39,.75);color:#fff;border-radius:8px;padding:8px 12px;font-size:.78rem;line-height:1.4;text-align:center;backdrop-filter:blur(4px)}
@media (max-width:720px){
  .before-after{overflow:visible;margin-bottom:70px}
  .before-after__notice{top:calc(100%+10px);bottom:auto;left:0;right:0;background:rgba(6,24,39,.04);color:var(--color-text);backdrop-filter:none;text-align:left; …}}
```
Nota: `top:calc(100%+10px)` está así también en `main.css` original (sin espacios alrededor de `+`); es `calc()` inválido y el navegador descarta esa declaración → en móvil el aviso conserva `bottom:auto` pero sin `top` válido; posición efectiva no confirmable sin navegador.

**JS** (`main.js` 387-407)
```js
document.querySelectorAll('[data-before-after]').forEach(box => {
  const handle = box.querySelector('.before-after__handle');
  const after = box.querySelector('.before-after__after');
  if (!handle || !after) return;
  let dragging = false;
  const update = (clientX) => {
    const rect = box.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    handle.style.left = pct + '%';
    after.style.clipPath = `inset(0 0 0 ${pct}%)`;
  };
  handle.addEventListener('mousedown', () => dragging = true);
  handle.addEventListener('touchstart', () => dragging = true, { passive: true });
  document.addEventListener('mouseup', () => dragging = false);
  document.addEventListener('touchend', () => dragging = false);
  document.addEventListener('mousemove', e => { if (dragging) update(e.clientX); });
  document.addEventListener('touchmove', e => { if (dragging) update(e.touches[0].clientX); }, { passive: true });
  box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'IMG') update(e.clientX); });
});
```
Mecanismo: dos imágenes superpuestas; la de "después" se recorta con `clip-path:inset(0 0 0 X%)` y el asa se mueve con `left:X%`. Arrastre = flag `dragging` en el asa + `mousemove`/`touchmove` en `document` (sigue el dedo aunque salga de la caja). El clic directo en la caja también salta a esa posición (la rama `tagName === 'IMG'` nunca se cumple porque los `img` tienen `pointer-events:none`). No hay teclado, ni `role="slider"`, ni `aria-valuenow`; sin transición (cambio instantáneo). `touch-action:pan-y` deja pasar el scroll vertical.

**Traducción**: `<AntesDespues before after labels>` client component; estado `pct` (0-100); `after` con `style={{clipPath:\`inset(0 0 0 ${pct}%)\`}}`; para accesibilidad, sobreponer un shadcn `Slider` (Radix) transparente `absolute inset-0` con `min=0 max=100` que gobierne `pct` (da teclado y ARIA gratis); mantener `onPointerMove` con `setPointerCapture` en el asa. Aspecto `aspect-video`, `select-none touch-pan-y`, esquinas a 0. **Pavivasa**: solo aplicable si el cliente entrega pares antes/después de una obra; hoy no existen (brief §4: fotos ≤ 1024 px sin catalogar) → reservar el componente con dos `BloquePosicion` o no incluirlo.

### 2.10 `section.section.section--brand` — calculadoras (`.calc-grid` / `.calc-card`) (líneas 393-421)

**Markup**
```html
<section class="section section--brand"><div class="container">
  <div class="section__head">
    <div class="section__eyebrow" style="color:#fff;opacity:.85">Interactive planning tools</div>
    <h2 style="color:#fff">Which shelter fits your need?</h2>
    <p style="color:#eaf6f1;max-width:640px;margin:0 auto">No more poring over datasheets: …</p>
  </div>
  <div class="calc-grid">
    <a class='calc-card' href='/pages/round-bale-calculator'>
      <div class="calc-card__icon"><svg viewBox="0 0 64 48">…</svg></div>
      <h3>Round Bale Calculator</h3>
      <p>How many hay bales fit in each shelter? With stack visualisation.</p>
      <span class="calc-card__cta">Calculate now →</span>
    </a>
    <!-- ×3: Round Bale · Machinery · Compare Shelters ("Compare now →") -->
  </div>
</div></section>
```
**Copy**: eyebrow 26; h2 29; p 125; h3 16-21; p 65-82; CTA 13-15. Iconos: SVG inline 64×48 con trazos `#fff` y rellenos `#0d4f3f`.

**CSS**
```css
.section--brand{background:linear-gradient(135deg,#1aa585 0%,#138d70 100%);color:#fff}
.calc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}   /* ≤1100: 2 · ≤560: 1 */
.calc-card{display:flex;flex-direction:column;gap:12px;background:#fff;color:var(--color-title);border:1px solid var(--color-border);border-radius:var(--radius);padding:28px;transition:transform .2s,box-shadow .2s,border-color .2s}
.calc-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(6,24,39,.14);border-color:var(--brand-green)}
.calc-card__icon{width:72px;height:72px;border-radius:16px;background:rgba(26,165,133,.12);display:flex;align-items:center;justify-content:center}
.calc-card__icon svg{width:48px;height:36px}
.calc-card h3{margin:6px 0 4px}  .calc-card p{margin:0;font-size:.95rem;flex:1}
.calc-card__cta{color:var(--brand-green);font-weight:800;letter-spacing:.04em;text-transform:uppercase;font-size:.82rem;margin-top:6px}
/* dentro de .section--brand (vidrio) */
.section--brand .calc-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#fff}
.section--brand .calc-card h3{color:#fff}   .section--brand .calc-card p{color:#eaf6f1}
.section--brand .calc-card__icon{background:rgba(255,255,255,.14)}
.section--brand .calc-card:hover{background:rgba(255,255,255,.14);transform:translateY(-3px)}
.section--brand .calc-card__cta{color:#fff;font-weight:700}
.section--brand .calc-card svg [stroke]{stroke:#fff !important}  … circle[fill="#061827"]{fill:#0d4f3f !important}
```
Mecanismo: tarjetas "vidrio" sobre gradiente de marca (fondo blanco al 8 %, borde blanco al 18 %); en CSS puro el hover sube a 14 % y `translateY(-3px)`, pero `.calc-card` está en la lista de tarjetas con tilt JS (`main.js` líneas 16-26), que en cada `mousemove` escribe `el.style.transform='translateY(-4px) perspective(900px) rotateX(…) rotateY(…)'` como **estilo inline**, y un estilo inline gana siempre sobre cualquier regla de hoja de estilos sin importar su especificidad. El único caso donde de verdad se ve el `-3px` del CSS es con `window.matchMedia('(pointer: coarse)').matches` (el tilt aborta): punteros táctiles con hover, no ratón normal. Con ratón, lo que siempre se ve es `-4px` + rotación 3D, nunca `-3px`. La sombra `0 20px 40px` y el borde verde sí se aplican siempre (no los toca el `style.transform` inline). Tilt JS y reveal activos.

**Traducción**: `<Section tone="brand">` + `grid gap-6 grid-cols-3 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1` + `<Link className="flex flex-col gap-3 border border-white/20 bg-white/10 p-7 text-white hover:bg-white/15 hover:-translate-y-[3px]">` (el `-3px` en CSS puro solo es fiel al original si el `<TiltCard>` respeta el mismo gate `pointer:coarse`; sin ese gate, el `-3px` se vería también en ratón, divergiendo del original que ahí muestra `-4px` + rotación 3D — ver §2.10 mecanismo). **No aplica a Pavivasa** (no hay calculadoras ni herramientas; brief §5-15 "sin FAQ, sin proceso"). El patrón de sección de marca con 3 tarjetas de vidrio sirve para "garantía 10 años" (título + "mantenimiento y reparación en caso de que lo necesite" + CTA a presupuesto), sin inventar más.

### 2.11 `section.section.section--soft` — proyectos de referencia (`.case-grid` / `.case-card`) (líneas 423-463)

**Markup**
```html
<div class="section__head"><div class="section__eyebrow">Reference projects</div><h2>Globotent shelters in action.</h2><p>Three of the documented projects from across Spain and Central Europe.</p></div>
<div class="case-grid">
  <a class='case-card' href='/projects/family-olive-farm-jaen'>
    <div class="case-card__media"><picture>…</picture></div>
    <div class="case-card__body">
      <div class="case-card__meta"><span class="case-card__loc">📍 Lower Austria</span><span class="case-card__year">2025</span></div>
      <h3 class="case-card__title">The M. family</h3>
      <p class="case-card__teaser">One shelter for hay, straw and farm machinery — installed in one day, permit-free*.</p>
      <div class="case-card__footer"><span class="case-card__hall">Arched Storage Tent 9.15 × 20 × 4.50 m</span><span class="case-card__cta">Read →</span></div>
    </div>
  </a>
  <!-- ×3 -->
</div>
<div style="text-align:center;margin-top:40px"><a class='btn btn--secondary' href='/pages/reference-projects'>See all projects</a></div>
```
**Copy**: eyebrow 18; h2 29; p 70; título 7-18 (cliente anonimizado: "The M. family", "W. farm", "Large operation M."); teaser 78-83; `__loc` con emoji 📍 + región; `__year` "2025"; `__hall` = modelo. Los 3 slugs existen en el espejo (`site/projects/…`, 8 fichas en sitemap). Incoherencias visibles en el código: el slug `family-olive-farm-jaen` muestra "Lower Austria"; `large-farm-lleida` muestra "Upper Austria".

**Ojo, no son fotos de obra**: el `<img>` de `case-card` #1 (`family-olive-farm-jaen`) apunta al mismo archivo que `product-card` #1 (`assets/images/rundbogenhalle-9x20-01.png`, con el mismo `srcset` completo 800/1200/2000w), y el de `case-card` #3 (`large-farm-lleida`) al mismo archivo que `product-card` #4 (`satteldachhalle-15x40-01.png`; el `srcset` de `case-card` #3 es más pobre, solo 800w/2000w — ver §0.7). Solo cambia el `alt`. Globotent no usa fotografía de obra real para 2 de los 3 casos destacados de la home: son renders de producto reetiquetados como "caso".

**CSS**
```css
.case-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}   /* ≤1100: 2 · ≤560: 1 */
.case-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--color-border);border-radius:var(--radius);overflow:hidden;transition:transform .2s,box-shadow .2s,border-color .2s;color:var(--color-title)}
.case-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-card);border-color:var(--brand-green)}
.case-card__media{aspect-ratio:4/3;overflow:hidden;background:var(--color-bg-soft)}
.case-card__media img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.case-card:hover .case-card__media img{transform:scale(1.04)}
.case-card__body{padding:22px;display:flex;flex-direction:column;gap:10px;flex:1}
.case-card__meta{display:flex;justify-content:space-between;font-size:.78rem;color:var(--color-sub-title);font-weight:700;letter-spacing:.03em}
.case-card__year{color:var(--brand-green);font-weight:800}
.case-card__title{margin:0;font-size:1.15rem;color:var(--color-title)}
.case-card__teaser{margin:0;font-size:.92rem;color:var(--color-text);line-height:1.5;flex:1}
.case-card__footer{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:14px;border-top:1px solid var(--color-border);font-size:.82rem}
.case-card__hall{color:var(--color-sub-title);font-weight:600}
.case-card__cta{color:var(--brand-green);font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.76rem;white-space:nowrap}
```
Anatomía de la tarjeta de obra: **meta (lugar · año) → título → teaser → pie (modelo · "Read →")**, con el teaser en `flex:1` para alinear pies. Hover idéntico a `product-card` (−4 px, sombra, borde verde, zoom 1.04) + tilt.

**Traducción**: `TarjetaProyecto` del brief con esta misma anatomía: meta en mono/versalitas (`municipio · año` con `DatoPendiente` para el año), `h3` = técnica + municipio, teaser = frase real de la obra, pie = `EtiquetaTecnica` (modelo · color) y "Ver obra →". `grid gap-6 grid-cols-3 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1`; media `aspect-[4/3]` con `BloquePosicion`. Datos: las 15 obras del brief §4 (mínimo las 6 con ficha técnica: Dénia, Moraira, Calpe 2021, Benissa pulido, Riba-roja, Godella…). CTA secundario → `/proyectos/`.

### 2.12 `section.section` — reseñas (`.reviews-head` / `.reviews-grid` / `article.review` + JSON-LD) (líneas 465-511)

**Markup**
```html
<div class="reviews-head">
  <div>
    <div class="section__eyebrow">Customer reviews</div>
    <h2>4.96 out of 5 from over 127 reviews</h2>
    <p style="color:var(--color-sub-title);margin:6px 0 0;font-size:.95rem">From Spain, Germany, Austria and beyond · We show a curated, anonymised selection.</p>
  </div>
  <a class='rating-badge' href='/pages/customer-reviews'>
    <div class="stars" aria-label="5 of 5 stars"><svg class="star" width="18" height="18" … fill="#f4c95e">…</svg></div>   <!-- UNA sola estrella -->
    <div class="rating-badge__text"><strong>4.96 out of 5</strong><span>from over 127 customer reviews</span></div>
  </a>
</div>
<div class="reviews-grid">
  <article class="review">
    <div class="review__head"><div class="stars" aria-label="5 of 5"><svg class="star" width="16" height="16" … fill="#f4c95e">…</svg></div><span class="review__date">2025-11</span></div>
    <p class="review__text">"Absolutely top! Shelter was up in one day, crew was punctual and tidy. No issues since, even in winter with heavy snow."</p>
    <div class="review__meta"><div><strong>Markus H.</strong><span>Lower Austria</span></div><span class="review__hall">Arched Tent 20×9 m</span></div>
  </article>
  <!-- ×6: Markus H. · Carlos M. · Johann M. · María Á. · Dr. Sebastian W. · Antoni B. -->
</div>
```
**Copy**: eyebrow 16; h2 35; sub 82; texto de reseña (nodo `p.review__text`) 101-146 caracteres (con comillas rectas ASCII `"…"`, no tipográficas, incluidas en el texto); nombre "Nombre I."; lugar región/país; `__hall` = modelo. Fechas `AAAA-MM`. Solo hay **una** estrella SVG por reseña y en el badge de esta sección (`aria-label` dice "5 of 5"); en el hero sí hay 5.

**CSS**
```css
.reviews-head{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px;margin-bottom:32px}   /* ≤560: column, flex-start */
.reviews-head h2{margin:0}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}   /* ≤1100: 2 · ≤560: 1 */
.review{background:#fff;border:1px solid var(--color-border);border-radius:var(--radius);padding:22px;display:flex;flex-direction:column;gap:14px}
.review__head{display:flex;justify-content:space-between;align-items:center}
.review__date{font-size:.8rem;color:var(--color-sub-title);font-weight:600}
.review__text{margin:0;font-size:.95rem;color:var(--color-title);line-height:1.55;flex:1}
.review__meta{display:flex;justify-content:space-between;align-items:flex-end;padding-top:12px;border-top:1px solid var(--color-border);gap:12px;font-size:.85rem}
.review__meta strong{display:block;color:var(--color-title);font-size:.9rem}   .review__meta span{color:var(--color-sub-title);font-size:.8rem}
.review__hall{background:rgba(26,165,133,.10);color:var(--brand-green-dark);padding:4px 10px;border-radius:50px;font-weight:800;font-size:.72rem;letter-spacing:.03em;white-space:nowrap}
.stars{display:inline-flex;gap:2px;align-items:center}
.rating-badge{display:inline-flex;align-items:center;gap:12px;padding:10px 18px;border-radius:50px;background:rgba(255,255,255,.92);color:var(--color-title);font-weight:700;box-shadow:0 4px 14px rgba(6,24,39,.1);transition:transform .2s,box-shadow .2s}
.rating-badge:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(6,24,39,.15)}
.rating-badge__text{display:flex;flex-direction:column;line-height:1.2;font-size:.82rem}   .rating-badge__text strong{font-size:1rem}
.rating-badge--compact{padding:8px 14px;font-size:.82rem;gap:8px}
```
Sin hover en `.review` (no es enlace); no tilt. Reveal por reseña.

**JSON-LD** (`<head>`, líneas 38-39): dos bloques. `Organization` con `aggregateRating {ratingValue:"4.96", reviewCount:"127", bestRating:"5", worstRating:"1"}`, `foundingDate:"2018"`, `founder Javier Pozo`, `areaServed [ES,DE,AT,CH,FR,IT,PT,EU]`. `LocalBusiness` con el mismo `aggregateRating` y un array `review` de **6 `Review`** cuyos `author.name` coinciden uno a uno con las 6 `article.review` visibles (Markus H. 2025-11-01, Carlos M. 2026-02-01, Johann M. 2025-07-01, María Á. 2026-01-01, Dr. Sebastian W. 2025-09-01, Antoni B. 2025-12-01), todos `ratingValue:"5"`. Los `reviewBody` del JSON-LD están en alemán con palabras sueltas en inglés ("Absolut top! Shelter stand in a Tag…"), mientras que el texto visible está en inglés: no coinciden literalmente. No hay microdatos inline en los `article` (sin `itemprop`).

**Traducción**: `<CabeceraDosColumnas>` (`flex flex-wrap items-end justify-between gap-5`) + `grid gap-5 grid-cols-3 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1` + `Card` con `blockquote`. **No aplica a Pavivasa**: brief §1 "Reseñas / testimonios: ninguno", §6 "Sin `AggregateRating`; sin testimonios inventados", §7-6 prohíbe valoraciones con estrellas. Si en el futuro llegan reseñas reales, replicar esta anatomía (texto → nombre + municipio → etiqueta de técnica) y el JSON-LD `LocalBusiness.review`.

### 2.13 `section.section.section--soft` — "Experience & trust" (líneas 513-538)

```html
<section class="section section--soft"><div class="container" style="max-width:920px">
  <div class="section__head" style="text-align:left"><div class="section__eyebrow">Experience &amp; trust</div><h2>Why professionals choose Globotent</h2></div>
  <div class="features" style="grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;margin-top:18px">
    <div class="feature" style="text-align:left"><h3>Eurocode certified</h3><p>All models calculated to EN 1991-1-3 (snow load) and EN 1991-1-4 (wind load). …</p></div>
    <!-- ×4: Eurocode certified · Established Spanish company · In-house installation team · Industrial warranty -->
  </div>
</div></section>
```
**Copy**: eyebrow 18; h2 34; sin párrafo de cabecera; h3 18-27; p 119-150. Contiene los datos legales/verificables: "Globotent Carpas S.L. — Tax ID ESB22837041, headquartered in Barcelona. Founded by Javier Pozo, engineer with over 15 years' experience"; garantía "Up to 10 years on the galvanised steel structure and 5–10 years on the PVC tarpaulin".

CSS: misma `.feature` de §2.2 (borde, radio 12, padding 28, hover −4 px + sombra) sin `.feature__icon`; rejilla por inline style `auto-fit minmax(240px,1fr)` gap 20 (a 920 px de contenedor caben 3 columnas, no 4; la cuarta tarjeta cae sola a la segunda fila… no confirmable sin navegador). Contenedor estrecho (920) y cabecera a la izquierda: cambio de ritmo respecto a las secciones centradas.

**Traducción**: `<Section tone="soft"><Container className="max-w-[920px]"><SectionHead align="left"/><div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">`. Pavivasa: bloque "empresa" con los claims literales (15 años, sede Sollana, equipo propio/maquinaria/moldes, garantía 10 años + mantenimiento) del brief §1 y §7-5; los cinco valores en mayúsculas van a `/empresa/`, no a la home.

### 2.14 `section.section` — "Technical knowledge" (líneas 540-568)

```html
<section class="section"><div class="container" style="max-width:920px">
  <div class="section__head" style="text-align:left"><div class="section__eyebrow">Technical knowledge</div><h2>What you should know before buying a shelter</h2></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:18px;margin-top:18px">
    <div><h3 style="font-size:1.05rem">Snow load by zone</h3><p>Across Europe snow load varies from 0.4 kN/m² … we reinforce the structure.</p></div>
    <!-- ×4: Snow load by zone · Planning permission · PVC tarpaulin: 750 vs 900 g/m² · Ground anchoring -->
  </div>
  <div style="text-align:center;margin-top:28px"><a class='btn btn--secondary' href='/pages/faq'>See all frequently asked questions</a></div>
</div></section>
```
**Copy**: eyebrow 19; h2 44; h3 16-30; p 135-181; CTA 34. Sin tarjetas (divs planos, sin borde), h3 a 1.05rem inline. Es una pre-FAQ en formato "4 columnas de texto" con CTA a la FAQ completa. Solo la cabecera recibe reveal.

**Traducción**: mismo contenedor de 920 px; `grid gap-[18px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))]`; o directamente shadcn `Accordion` (el brief pide FAQ en acordeón con 4-5 preguntas y respuestas como `DatoPendiente`). Pavivasa sí tiene "conocimiento técnico" real para este formato: ficha técnica literal del lavado (HA-25, EHE-08, clase 3 Rd>45) y del impreso (HM20, 10 cm, árido 12 mm, mallazo 20×30, fibra, 4 kg color/m²) del brief §3/§4 → `TablaFichaTecnica`.

### 2.15 `section.section` › `.cta-band` — CTA final (líneas 570-578)

```html
<section class="section"><div class="container">
  <div class="cta-band">
    <h2>Ready for your shelter?</h2>
    <p>Describe your project — we'll respond within 24 hours with a no-obligation quote.</p>
    <a class='btn btn--lg btn--lime' href='/pages/request-a-quote'>Request a quote now</a>
  </div>
</div></section>
```
```css
.cta-band{background:linear-gradient(135deg,var(--brand-green-deep),var(--brand-green));color:#fff;border-radius:var(--radius);padding:56px;text-align:center}   /* ≤900: 40px 24px · ≤560: 32px 20px + h2 1.4rem */
.cta-band h2{color:#fff;margin-bottom:12px}
.cta-band p{color:rgba(255,255,255,.9);margin-bottom:24px;font-size:1.05rem}
```
**Copy**: h2 23; p 81; CTA 19. Es la **única** aparición de `.btn--lime` en la home (lima `#7ec700` sobre verde oscuro: máximo contraste para el último clic). Tarjeta con radio dentro de sección blanca, no sección a sangre. Sin eyebrow, sin JS, sin reveal. Después viene el footer con `margin-top:80px`.

**Traducción**: `<BandaCTA h2 p cta>`: `bg-gradient-to-br from-[--pigmento-hover] to-[--pigmento] p-8 md:p-14 text-center text-[--sobre-tinta]` (esquinas 0). Pavivasa: el brief pide **formulario corto** al final de la home (nombre, teléfono, qué quieres pavimentar) → `FormularioPresupuesto variant="corto"` dentro de esta banda, con el botón "Enviar y que me llamen" y sin prometer plazo (el "within 24 hours" de Globotent es exactamente lo que el brief prohíbe inventar).

### 2.16 `footer.site-footer` (líneas 615-663)

```html
<footer class="site-footer"><div class="container">
  <div class="site-footer__grid">
    <div><div class="site-footer__logo"><img src="assets/images/logo_white.png" alt="Globotent" loading="lazy"></div><p>Globotent liefert Arched Storage Tents … from a single source.</p></div>
    <div><h4>Industry &amp; Agriculture</h4><a>…</a>×3 <h4 style="margin-top:22px">globotent SPORTS</h4><a>…</a>×4</div>
    <div><h4>Tools &amp; Rechner</h4><a>…</a>×5</div>
    <div><h4>Company</h4><a>…</a>×10 (About · Jobs · References · Reviews · FAQ · Contact · Quote · Legal Notice · Privacy · Terms)</div>
  </div>
  <div class="site-footer__bottom"><span>&copy; 2026 Globotent Carpas S.L.. All rights reserved.</span><span>Office ES: Gran Vía de les Corts Catalanes 303, … &bull; Telefon: +34 657 472 335 &bull; Email: info@globotent.com</span></div>
  <div class="site-footer__disclaimer"><p><strong>* Note on permits and approvals:</strong> … (≈ 900 caracteres, explica el asterisco de "permit-free*")</p></div>
</div></footer>
```
```css
.site-footer{background:var(--brand-dark);color:#9eb3bd;padding:64px 0 24px;margin-top:80px}
.site-footer{padding-right:80px;padding-bottom:96px}      /* parche 3841: hueco para .wa-fab; ≤560: padding-right:24px */
.site-footer__grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px}   /* ≤900: 1fr 1fr · ≤560: 1fr */
.site-footer h4{color:#fff;font-size:.95rem;text-transform:uppercase;letter-spacing:.08em;margin:0 0 18px}
.site-footer a{color:#9eb3bd;display:block;padding:4px 0;font-size:.95rem}   .site-footer a:hover{color:var(--brand-lime)}
.site-footer__grid a{display:inline-flex;align-items:center;min-height:44px;padding:6px 0;line-height:1.35}   /* parche táctil 3827 */
.site-footer__logo img{height:52px;margin-bottom:16px}
.site-footer__bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:.85rem}
.site-footer__disclaimer{border-top:1px solid rgba(255,255,255,.08);margin-top:18px;padding-top:18px;font-size:.78rem;line-height:1.55;color:#7d909a}
.site-footer__disclaimer strong{color:#b3c5cd;font-weight:600}
```
Texto de la primera columna en alemán/inglés mezclado (resto de traducción incompleta). El teléfono y el email del `__bottom` son texto plano, no `tel:`/`mailto:` (el CSS 3893 prevé esos enlaces pero el HTML no los usa). JS: `IntersectionObserver` (`main.js` 370-376, threshold .05) añade `.is-hidden` al `.wa-fab` cuando el footer entra en pantalla.

**Traducción**: `<Pie>`: `bg-[--tinta] text-[--sobre-tinta]/70 pt-16 pb-24 mt-20` › `grid gap-10 grid-cols-[1.4fr_1fr_1fr_1fr] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1`. Pavivasa (brief §7-5 PIE): logo · dirección · teléfono (`tel:`) · email (`mailto:`) · 7 servicios · legales · "PROYECTO WEB FINANCIADO POR LA UNIÓN EUROPEA – NEXTGENERATIONEU" con logos · © 2026 Pavivasa. La franja `__disclaimer` es el sitio natural para la nota de cobertura declarada pendiente de confirmar.

### 2.17 Elementos globales presentes en la home (fuera de `<main>`)

| Elemento | Markup | CSS clave | JS |
|---|---|---|---|
| `a.wa-fab` | `href="https://wa.me/34657472335?text=…" target="_blank" rel="noopener"`, svg + `<span>WhatsApp</span>` | `position:fixed;bottom:24px;right:24px;z-index:45;background:#25D366;padding:12px 18px;border-radius:50px;font-weight:800;font-size:.88rem;text-transform:uppercase;box-shadow:0 8px 24px rgba(37,211,102,.35)`; hover `#1ebe5c`, −2 px; ≤560: `bottom:92px;padding:12px;font-size:0`, solo icono 26 px; `.is-hidden{opacity:0;transform:translateY(20px);pointer-events:none}` | oculto cuando `.site-footer` intersecta (threshold .05); clic → `dataLayer.push({event:'whatsapp_click'})` (líneas 644-651; también `phone_click`, `email_click`) |
| `div.exit-popup[data-exit-popup] hidden` | backdrop + `role="dialog"` con h2 "Fast advice within 24h", p, `btn--primary btn--lg` → `/pages/request-a-quote`, `btn--secondary` "Maybe later" | `position:fixed;inset:0;z-index:100;opacity:0;transition:opacity .3s`; `.is-visible{opacity:1}`; backdrop `rgba(6,24,39,.72)` | líneas 349-369: solo desktop (`min-width:901px`), no táctil, una vez por sesión (`sessionStorage 'globotent_exit_shown'`), se dispara con `mouseout` cuando `e.clientY <= 0 && !e.relatedTarget`; cierra con `[data-exit-close]`, backdrop o Escape |
| `div.lightbox[data-lightbox] hidden` | close/prev/next/img/counter | — | módulo 286-344 se inicializa pero en la home no hay `[data-gallery-thumb]` ni `[data-photo-gallery]` → inerte |
| `header.site-header` | — | — | `.is-scrolled` cuando `scrollY > 8` (187-193) |
| View Transitions | — | `@view-transition{navigation:auto}`, `::view-transition-old(root){animation:vt-fade-out .18s}`, `::view-transition-new(root){animation:vt-fade-in .28s}` (fade + 10 px) | 100-117: intercepta clics en `a[href]` internos (no `#`, `tel:`, `mailto:`, `http`, `_blank`) y navega dentro de `document.startViewTransition` |
| GTM | script inline en `<head>` | — | carga `GTM-MR5F4PQR` en la primera interacción (`scroll/mousemove/touchstart/keydown/pointerdown`) o a los 4000 ms |

Pavivasa: `BarraMovil` (Llamar / WhatsApp) sustituye al `wa-fab`; WhatsApp como `DatoPendiente` (brief §1: "WhatsApp: no existe"). Exit-popup: no está en la arquitectura fija del brief; no incluir.

---

## 3. Narrativa: tabla resumen y porqué del orden

| Orden | Sección | Función en el embudo | Por qué aquí |
|---|---|---|---|
| 1 | `cine-hero` | Promesa + segmentación (4 mundos) + CTA doble + prueba social compacta (4.96/127) | Abre con la foto grande y deja elegir "mundo" sin scroll; la valoración va ya en el primer viewport |
| 2 | Why Globotent (4 features) | Razones para creer, versión corta con "More info" | Responde a la objeción principal (permisos, plazo, logística) justo después de la promesa |
| 3 | `home-montage` (vídeo) | Prueba de proceso: "lo montamos nosotros" | Corte oscuro a sangre tras dos bloques claros; demuestra en vez de afirmar |
| 4 | `team-wall` | Prueba humana: caras y obra real | Refuerza el "equipo propio" del vídeo con 10 fotos; humaniza antes de vender |
| 5 | Two worlds (5 categorías) | Oferta, nivel 1: navegación por categoría | Primera bifurcación de la oferta; fondo suave para separar "prueba" de "catálogo" |
| 6 | Top models (4 productos) | Oferta, nivel 2: producto concreto con m² y dimensiones | Del "qué" al "cuál"; termina con "See all models" |
| 7 | `trust-bar` | Cifras técnicas (cargas, ingeniería incluida) | Cierra la oferta con datos duros en una franja oscura, sin pedir clic |
| 8 | `press-strip` | Autoridad externa (prensa) | Prueba de terceros, en formato ligero de 28 px que no interrumpe |
| 9 | 3D preview + before/after | Lead magnet gratuito (foto → render 24 h) | Oferta de bajo compromiso para quien no está listo para pedir presupuesto |
| 10 | Calculadoras (`section--brand`) | Herramientas de autoservicio | Segunda oferta de bajo compromiso; el gradiente de marca lo marca como "interactivo" |
| 11 | Reference projects (3 casos) | Prueba de resultado: obra documentada con modelo y lugar | Después de las herramientas, enseña obras terminadas para el que ya sabe qué quiere |
| 12 | Reviews (6) | Prueba social extensa + JSON-LD | Testimonios con nombre, región y modelo; refuerza el 4.96 del hero |
| 13 | Experience & trust | Credenciales legales (CIF, sede, fundador, garantía) | Objeciones de "¿quién hay detrás?" para el comprador que compara proveedores |
| 14 | Technical knowledge | Educación + puente a FAQ | Reduce dudas técnicas antes del último CTA |
| 15 | `cta-band` | Cierre: pedir presupuesto (botón lima) | Único botón lima de la página; ya se han cubierto oferta, prueba y objeciones |
| F | Footer | Navegación completa, NAP, disclaimer del asterisco | El asterisco de "permit-free*" se resuelve aquí |

Patrón: **promesa → razones → prueba (proceso, personas) → oferta (categorías, productos) → datos → autoridad → lead magnets → prueba (obras, reseñas) → credenciales → educación → cierre**. Alternancia de fondos: blanco / blanco / oscuro-vídeo / blanco / soft / blanco / oscuro / soft / blanco(tarjeta) / verde / soft / blanco / soft / blanco / blanco(tarjeta) / oscuro. Nunca dos oscuros seguidos; el verde de marca solo una vez.

---

## 4. Mapeo a la home de Pavivasa

Base: brief §1 (ficha: 15 años, garantía 10 años + mantenimiento, 30 % repiten, cobertura declarada, 7 servicios, contacto único), §2 (inventario: 7 páginas de servicio, 15 fichas de obra en el blog, 4 artículos, galería de 77 fotos sin datos) y la arquitectura fija de la pantalla 02 HOME (brief §7-4). No se propone copy nuevo: solo tipos de contenido que ya existen.

| Sección Globotent | Decisión | Sección Pavivasa | Contenido real que la llena |
|---|---|---|---|
| `cine-hero` (4 mundos rotativos) | **Adaptar** | Hero con titular y dos CTA (Pedir presupuesto / Ver proyectos) | Tabs = los 3 servicios fuertes (impreso · pulido · microcemento) rotando h1/sub/CTA hacia `/hormigon-impreso/` etc.; imágenes = `BloquePosicion`; sin rating badge; kicker "Expertos en pavimentos de hormigón" |
| Why Globotent (4 features + More info) | **Adaptar** | Bloque de razones (o fusionar con BarraConfianza) | 15 años · 10 años de garantía con mantenimiento · 30 % clientes repiten · empresas/particulares/profesionales; el "More info" con la frase literal de garantía |
| `home-montage` (vídeo) | **No aplica** (sin vídeo) | Opcional: banda oscura "garantía 10 años" con `BloquePosicion` | Texto literal de garantía del brief §7-5 |
| `team-wall` (10 fotos de equipo) | **No aplica** (cero fotos de personas) | Reservar como "muro de obras" pendiente | 77 fotos de `/proyectos/` una vez catalogadas; hasta entonces `BloquePosicion` |
| Two worlds (`collection-card` 16:10) | **Conservar patrón** | "¿Qué quieres pavimentar?" con 6 espacios | Entrada de garaje · porche/terraza · contorno de piscina · interior · patio/jardín · nave/parking/local (brief §7-4) → cada tarjeta enlaza a `/presupuesto/` o al servicio |
| `world-block__head` (h3 + "ver todo") | **Conservar** | Cabecera de bloque para "Servicios" | Enlace a cada página de servicio |
| Top models (`product-card` ×4) | **Adaptar** | Servicios (7, con los 3 fuertes destacados) | Título = servicio; meta = frase literal de su página; badges = aplicaciones reales o "sin obra documentada" en mono |
| `trust-bar` | **Conservar** | `BarraConfianza` (componente fijo del esqueleto) | MÁS DE 15 AÑOS · 10 AÑOS DE GARANTÍA · cobertura (dato ya disponible en brief §1; `DatoPendiente` es solo la zona prioritaria a mostrar) · MÁS DEL 30 % REPITEN |
| `press-strip` (marquee) | **No aplica** | — | No hay prensa ni logos de cliente; Kit Digital va en el pie |
| 3D preview + `before-after` | **No aplica hoy** | Reservar `AntesDespues` para cuando existan pares de fotos de obra | — |
| Calculadoras (`section--brand`) | **No aplica** (sin herramientas) | Reutilizar el tono de marca para "Garantía 10 años" o para el muestrario | `MuestraAcabado` con modelos y colores reales (piedra inglesa, sillería, adoquín belga, manteado; gris medio/oscuro, crema, arena, 107, 117) |
| Reference projects (`case-card` ×3) | **Conservar** | Obras destacadas: 3 `TarjetaProyecto` | Dénia (impreso, piedra inglesa, HM20 10 cm), Calpe 2021 (sillería grande, HM25), Daimús (pulido, 2000 m² nave) u otras del brief §4; año como `DatoPendiente`. A diferencia de Globotent (§2.11: 2 de sus 3 casos reutilizan fotos de `product-card`), aquí debe ser fotografía real de las 15 obras documentadas |
| Reviews (6 + JSON-LD) | **No aplica** | — | Cero reseñas; prohibido inventar; sin `AggregateRating` |
| Experience & trust (4 features, 920 px, izquierda) | **Adaptar** | Bloque "empresa" corto en la home | Sede Sollana, equipo/maquinaria/moldes, 15 años de trayectoria, garantía; los 5 valores van a `/empresa/` |
| Technical knowledge (4 columnas + CTA FAQ) | **Adaptar** | FAQ en acordeón (4-5 preguntas, respuestas `DatoPendiente`) y/o ficha técnica | Datos literales: HM20/HM25, 10-12 cm, árido 12 mm, mallazo 20×30, fibra, 4 kg color/m², HA-25 EHE-08, clase 3 Rd>45 |
| `cta-band` | **Adaptar** | Formulario corto + llamada | `FormularioPresupuesto variant="corto"` (nombre, teléfono, qué quieres pavimentar); botón "Enviar y que me llamen"; sin plazo de respuesta |
| Footer | **Conservar** | `Pie` | NAP único, 7 servicios, legales, NEXTGENERATIONEU con logos, © 2026 Pavivasa |
| `wa-fab` | **Sustituir** | `BarraMovil` (Llamar / WhatsApp pendiente) | Teléfono 627 66 31 46; WhatsApp `DatoPendiente` |
| Exit popup, lightbox, GTM diferido | **No aplica** en el diseño | — | — |

Orden propuesto para Pavivasa siguiendo la misma lógica (promesa → razones → oferta → prueba → datos → cierre): Hero → BarraConfianza → ¿Qué quieres pavimentar? (6) → Servicios (7) → Obras destacadas (3) → Muestrario de modelos y colores → Garantía 10 años → FAQ → Formulario corto → Pie. Es exactamente la lista de la pantalla 02 del brief; lo que aporta Globotent es la **gramática** (cabecera eyebrow+h2+p, rejillas de 3/4, tarjeta imagen-con-label, banda oscura de cifras, CTA final único) y los **gestos** (zoom 1.04-1.05 en 0.4 s al hover, reveal 18 px/0.6 s, hero con crossfade 1.1 s + zoom 8 s + rotación 5.5 s).

Restricciones del brief que cambian la traducción literal: esquinas a 0 (nada de `border-radius:12px`/`50px`); una sola sombra en toda la web (los hovers pasan a `translate-y` + `border-color`); nada de estrellas, reseñas ni logos; nada de fotos de personas ni de stock; un solo CTA primario por pantalla (Globotent pone `btn--primary` en cada `product-card`: no replicar).

---

## 5. Cosas que están en el código y conviene no copiar

1. `data-href` de los tabs del hero con rutas relativas `.html` frente a `href` absoluto sin extensión (§2.1-7).
2. `top:calc(100%+10px)` inválido en `.before-after__notice` móvil (§2.9).
3. Cascada contradictoria en `.press-strip__logos` (`width:max-content` → `width:100%`) que puede romper la continuidad del marquee (§2.8).
4. `'Clash Display'` sin `@font-face` (§0.1).
5. Una sola estrella SVG con `aria-label="5 of 5"` en reseñas (§2.12).
6. `reviewBody` del JSON-LD en alemán frente a texto visible en inglés; localización de casos incoherente con el slug (`family-olive-farm-jaen` → "Lower Austria") (§2.11-2.12).
7. Texto del footer y `og:title`/`og:description` en alemán mezclado.
8. `.world-panel` y `.hero__bg`/`[data-hero-slider]`: CSS/JS sin markup en la home (no inventar comportamiento a partir de ellos).
9. Botón `btn--primary` repetido dentro de cada tarjeta de producto (4 primarios en una sección).
10. Promesas de plazo ("within 24 hours") en 3D, exit-popup y CTA final: el brief de Pavivasa prohíbe prometer plazos.
11. `case-card` #1 y #3 reutilizan el mismo archivo de imagen que `product-card` #1 y #4 (mismo filename; el `srcset` completo solo coincide en el primer par) en vez de fotografía de obra real (§2.11).
