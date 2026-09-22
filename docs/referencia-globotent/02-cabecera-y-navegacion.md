# 02 · Cabecera y navegación — referencia globotent.com

Dimensión: `.site-header`, `.site-nav` y todo lo que cuelga (logo, teléfono, CTA, selector de idioma, desplegables, mega menú, menú móvil, comportamiento al scroll, a11y). Fuente: espejo local de https://globotent.com/ (`home.html`, `main.pretty.css` = `main.css` formateado, `main.js`, `site/`). Cada valor cita la línea de `main.pretty.css` (`css:NNN`), de `home.html` (`html:NNN`) o de `main.js` (`js:NNN`).

Lectores: Claude Design (mecanismo y valores para diseñar algo nuevo para Pavivasa) y Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Sección 18 = traducción.

---

## 0. Resumen en diez líneas

1. Cabecera **sticky** (`position:sticky; top:0; z-index:50`), fondo blanco opaco siempre, **80 px** de alto fijos en todos los anchos (`css:120-131`). No se compacta al hacer scroll; solo gana sombra (`.is-scrolled` cuando `scrollY > 8`, `js:187-193`).
2. Una sola barra: logo (56 px alto) · nav centro (`gap:24px`) · zona CTA derecha (`gap:12px`): idioma, teléfono pill, botón "Request a Quote", burger.
3. Nav de escritorio: enlaces en Figtree 700 / .95rem, subrayado animado 2 px verde que crece desde la izquierda (`transform:scaleX(0→1)`, `.2s ease`).
4. Dos grupos con desplegable (`.has-dropdown`): "Products" (mega menú de 3 columnas, 720 px) y "About Us" (lista simple `--wide`, 280 px). En escritorio se abren **solo por `:hover` CSS**; en móvil/táctil por **click** con clase `.is-open` (`js:264-285`).
5. Mega menú: grid `1fr 1fr .8fr`, columna "SPORTS" con fondo degradado verde-lima, items con miniatura **58×44** px redondeada, columna "Tools" separada por `border-left`.
6. Menú móvil (`≤900px`): el propio `.site-nav` pasa a `position:fixed; top:80px`, se desliza desde arriba (`translateY(-200%) → none`, `.25s ease`), acordeones internos, **sin** bloqueo de scroll del body ni trampa de foco; se cierra al hacer scroll > 12 px, click fuera, `Escape` o click en enlace.
7. Burger 48×48 con tres barras de 3 px que se convierten en X (`translateY(±8px) rotate(±45deg)`).
8. Selector de idioma: botón pill + `ul role="menu"`, banderas dibujadas en CSS puro (gradientes) salvo GB (SVG data-URI).
9. A11y: `aria-label`, `aria-expanded`, `aria-haspopup`, `aria-current`; **no hay skip link** en ninguna de las 78 páginas, no hay `:focus-within` (los desplegables no se abren con teclado en escritorio), los `<a>` de grupo reciben `role="button"` por JS.
10. Tres reglas CSS tardías (líneas 3663-3729, 3814) anulan valores anteriores; y `top:calc(100%+10px)` es **CSS inválido** (sin espacios) → el desplegable se pega al borde inferior del enlace (ver §14).

---

## 1. Markup literal del header (`home.html:46-125`)

```html
<header class="site-header">
  <div class="container site-header__bar">
    <a aria-label='Globotent Home' class='site-header__logo' href='/'>
      <img src="assets/logo.png" alt="Globotent Logo">
    </a>
    <nav class="site-nav" aria-label="Hauptnavigation">
      <div class="site-nav__group has-dropdown site-nav__group--mega">
        <a class='site-nav__main' href='/pages/produkte'>Products <span class="site-nav__chev" aria-hidden="true">▾</span></a>
        <div class="site-nav__dropdown site-nav__mega">
          <div class="site-nav__mega-col">
            <span class="site-nav__mega-head">Industry &amp; Agriculture</span>
            <a class='mega-item' href='/categories/storage-tents'>
              <img src="assets/images/rundbogenhalle-12x24-01.jpg" alt="" aria-hidden="true" loading="lazy">
              <span><strong>Arched Storage Tents</strong><small>11 Größen · permit-free*</small></span>
            </a>
            <a class='mega-item' href='/categories/fabric-buildings'>
              <img src="assets/images/satteldachhalle-10x18-01.jpg" alt="" aria-hidden="true" loading="lazy">
              <span><strong>Fabric Buildings</strong><small>bis 15 × 40 m · Giebeldach</small></span>
            </a>
            <a class='mega-link' href='/pages/all-models'>All Models →</a>
          </div>
          <div class="site-nav__mega-col site-nav__mega-col--sport">
            <span class="site-nav__mega-head">globotent SPORTS</span>
            <a class='mega-item' href='/categories/padel-tennis-covers'>
              <img src="assets/images/padel-court-01.jpg" alt="" aria-hidden="true" loading="lazy">
              <span><strong>Padel &amp; Tennis</strong><small>stützenfrei · bis 8 m Height</small></span>
            </a>
            <a class='mega-item' href='/categories/riding-arena-covers'>
              <img src="assets/images/reithalle-globotent-04.jpg" alt="" aria-hidden="true" loading="lazy">
              <span><strong>Equestrian</strong><small>indoor arenas 400–1.125 m²</small></span>
            </a>
            <a class='mega-item' href='/categories/pickleball'>
              <img src="assets/images/padel-court-08.jpg" alt="" aria-hidden="true" loading="lazy">
              <span><strong>Pickleball</strong><small>stützenfrei · ganzjährig</small></span>
            </a>
            <a class='mega-link mega-link--sport' href='/pages/sport'>Zur Sport-Welt →</a>
          </div>
          <div class="site-nav__mega-col site-nav__mega-tools">
            <span class="site-nav__mega-head">Tools &amp; Rechner</span>
            <a href='/pages/3d-preview'>3D Photo-Vorschau</a>
            <a href='/pages/shelter-finder'>Shelter Finder</a>
            <a href='/pages/compare-shelters'>Compare Shelters</a>
            <a href='/pages/calculators'>Calculators</a>
          </div>
        </div>
      </div>
      <a href='/pages/reference-projects'>References</a>
      <div class="site-nav__group has-dropdown">
        <a class='site-nav__main' href='/pages/about-us'>About Us <span class="site-nav__chev" aria-hidden="true">▾</span></a>
        <div class="site-nav__dropdown site-nav__dropdown--wide">
          <a href='/pages/about-us'>Über Globotent</a>
          <a href='/pages/team'>Unser Team</a>
          <a href='/pages/jobs'>Jobs &amp; Karriere</a>
        </div>
      </div>
      <a href='/pages/contact'>Contact</a>
    </nav>
    <div class="site-header__cta">
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
      <a href="tel:+34657472335" class="site-header__phone" aria-label="Call">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>+34 657 472 335</span>
      </a>
      <a class='btn btn--primary' href='/pages/request-a-quote'>Request a Quote</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">
```

Observaciones sobre el markup:

- Es **idéntico en las 78 páginas** (diff de `site/index.html` vs `site/products/fabric-building-10x15.html` vs `site/pages/sport.html`): solo cambian los prefijos relativos `../assets/` y el `href` del enlace `hreflang="pt"` (apunta a la página equivalente en globotent.pt). `aria-label="Hauptnavigation"` (alemán, en la web EN) y `aria-label='Globotent Home'` aparecen 78/78 veces.
- El `<nav>` mezcla `<a>` sueltos (References, Contact) con `<div class="site-nav__group">`. No hay `<ul>`.
- El icono del teléfono es SVG inline (Feather "phone", 18×18, `stroke-width="2.2"`). No hay librería de iconos.
- El burger no tiene `aria-controls` ni el `.site-nav` tiene `id`.
- `.site-nav__group--mega` y `.mega-link--sport` están en el HTML pero **no tienen ninguna regla CSS** (grep vacío en `main.pretty.css`).
- El script se carga como `<script src="assets/js/main.min.js?v=c0f0756b" defer>` (`html:664`). `main.min.js` pesa exactamente lo mismo que `main.js` (30 225 bytes): no está minificado. Es una IIFE (`(function(){'use strict'; ...})()`), sin `DOMContentLoaded` (basta con `defer`).

---

## 2. Árbol de componentes

```
header.site-header                       sticky, z 50, bg #fff, sombra al scroll
└─ div.container.site-header__bar        flex · space-between · h 80px · padding 0 24px
   ├─ a.site-header__logo > img          56px alto (42px ≤600px)
   ├─ nav.site-nav                        flex · gap 24px  |  ≤900: panel fijo bajo la barra
   │  ├─ div.site-nav__group.has-dropdown.site-nav__group--mega
   │  │  ├─ a.site-nav__main  "Products ▾"      (▾ = span.site-nav__chev)
   │  │  └─ div.site-nav__dropdown.site-nav__mega   grid 3 col · 720px
   │  │     ├─ div.site-nav__mega-col            (head + 2 mega-item + mega-link)
   │  │     ├─ div.site-nav__mega-col--sport     (head + 3 mega-item + mega-link, fondo degradado)
   │  │     └─ div.site-nav__mega-col.site-nav__mega-tools  (head + 4 a)
   │  ├─ a  "References"
   │  ├─ div.site-nav__group.has-dropdown
   │  │  ├─ a.site-nav__main  "About Us ▾"
   │  │  └─ div.site-nav__dropdown.site-nav__dropdown--wide   (3 a)
   │  └─ a  "Contact"
   └─ div.site-header__cta                flex · gap 12px
      ├─ div.lang-switch                  button pill + ul[role=menu]
      ├─ a.site-header__phone             pill con SVG + número  (≤900: círculo 48px solo icono · ≤480: oculto)
      ├─ a.btn.btn--primary               "Request a Quote"       (≤900: oculto)
      └─ button.burger                    (solo ≤900) 3 span → X
```

---

## 3. Tokens y variables usadas por la cabecera

Todas en `:root` (`css:1-29`) salvo `--touch-target-min` (`css:3583-3584`, segundo bloque `:root` más abajo en el archivo).

| Variable | Valor | Uso en cabecera |
|---|---|---|
| `--brand-green` | `#1aa585` | hover de enlaces, subrayado, botón primario, icono teléfono, `.mega-link`, cabecera columna SPORTS |
| `--brand-green-dark` | `#12755e` | hover del botón primario, hover de ítems de dropdown, hover de `.mega-item strong` |
| `--brand-lime` | `#7ec700` | solo a través de `rgba(126,199,0,…)` en la columna SPORTS |
| `--brand-dark` | `#061827` | solo como base de las sombras `rgba(6,24,39,…)` |
| `--color-title` | `#151719` | color de texto de enlaces nav, burger, teléfono, lang-switch |
| `--color-text` | `#535353` | (heredado por body) |
| `--color-sub-title` | `#535353` | `.site-nav__mega-head`, `.mega-item small` |
| `--color-link` | `#222222` | enlaces de `.site-nav__mega-tools` |
| `--color-border` | `#e2e2e2` | bordes de dropdown, pill teléfono, pill idioma, separadores móvil |
| `--color-bg-soft` | `#f6f8f7` | fondo de los acordeones abiertos en móvil |
| `--button-corner` | `50px` | radio del botón CTA |
| `--button-normal-height` | `44px` | alto del botón CTA |
| `--button-font-weight` | `800` | peso del texto del botón CTA (`css:18`, usada en `.btn`) |
| `--button-text-transform` | `uppercase` | mayúsculas del botón CTA (`css:19`, usada en `.btn`) |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | todo el header |
| `--container` | `1280px` | `.container` (ver §14: anulado a `100%` en `css:3814`) |
| `--shadow-header` | `0 2px 16px rgba(6,24,39,.08)` | sombra de `.site-header.is-scrolled` y del panel móvil |
| `--touch-target-min` | `48px` | burger, teléfono móvil, `min-height` de todos los `a`/`button` del header |

Fuente: Figtree 300..900 vía Google Fonts (`html:18-22`: `preconnect` + `preload as=style` + `<link media="print" onload="this.media='all'">` + `noscript`). La cabecera **solo** usa Figtree. `'Clash Display'` aparece en el CSS (`css:4163` y ss., secciones Sport) **sin `@font-face`**: no se carga, cae a `var(--font-family)`; no afecta a la cabecera.

Reset relevante: `a{color:var(--color-link);text-decoration:none}` y `a:hover{color:var(--brand-green)}` (`css:47-51`); `img{max-width:100%;display:block;height:auto}` (`css:43-46`); `html{scroll-behavior:smooth}` (`css:32-33`).

---

## 4. `.site-header` — posición, altura, fondo, sombra

```css
/* css:120-132 */
.site-header{position:sticky;top:0;z-index:50;background:#fff;transition:box-shadow .2s ease}
.site-header.is-scrolled{box-shadow:var(--shadow-header)}
.site-header__bar{display:flex;align-items:center;justify-content:space-between;height:80px}
```

- **Sticky, no fixed**: ocupa sitio en el flujo; el hero empieza debajo (`.cine-hero{min-height:min(calc(100svh - 80px),780px)}`, `css:5980`, descuenta los 80 px).
- **Altura 80 px constante** en todos los breakpoints: no hay ninguna otra regla para `.site-header__bar` (grep). El panel móvil usa el mismo `top:80px` (`css:900`).
- Fondo `#fff` siempre; no hay variante transparente sobre el hero.
- Sombra solo con `.is-scrolled` (`transition:box-shadow .2s ease`). No hay cambio de altura, logo ni padding al hacer scroll: **no se compacta**.
- `.container` (`css:67-70`): `max-width:var(--container);margin:0 auto;padding:0 24px` — pero ver §14: `css:3814-3815` lo anula a `max-width:100%` (regla top-level, misma especificidad, posterior en cascada → valor efectivo, sin necesitar verificación visual).
- `z-index:50`. Pila completa en §15.

JS (`js:187-193`):

```js
const header = document.querySelector('.site-header');
const onScroll = () => {
if(!header) return;
header.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();
```

Umbral **8 px**; listener `passive`; se ejecuta una vez al cargar (por si la página se abre ya scrolleada).

---

## 5. Logo

```css
/* css:133-135 */  .site-header__logo img{height:56px;width:auto}
/* css:5320-5322 */ @media (max-width:600px){ .site-header__logo img{height:42px} }
```

- Archivo `assets/logo.png`: PNG RGBA **872×548 px** (descargado con curl). Renderizado a 56 px de alto → ≈ **89 px** de ancho; a 42 px → ≈ 67 px. No hay SVG ni `srcset`.
- Enlace: `<a aria-label='Globotent Home' href='/'>` con `<img alt="Globotent Logo">` (alt redundante con el aria-label).
- `.site-header a{min-height:48px;display:inline-flex;align-items:center}` (`css:3725-3728`) también aplica al logo.

---

## 6. `.site-nav` en escritorio (> 900 px)

```css
/* css:136-160 */
.site-nav{display:flex;align-items:center;gap:24px}
.site-nav a{font-weight:700;font-size:.95rem;color:var(--color-title);position:relative;padding:6px 0}
.site-nav a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--brand-green);
  transform:scaleX(0);transform-origin:left;transition:transform .2s ease}
.site-nav a:hover{color:var(--brand-green)}
.site-nav a:hover::after{transform:scaleX(1)}
/* css:4549-4550 */ .site-nav>a,.site-nav__main{white-space:nowrap}
/* css:3725-3730 */ .site-header a,.site-header button:not(.burger){min-height:var(--touch-target-min);display:inline-flex;align-items:center}
                    .site-nav__main{min-height:var(--touch-target-min)}
```

| Propiedad | Valor |
|---|---|
| Separación entre ítems | `gap:24px` |
| Tipografía enlace | Figtree **700**, `.95rem` (15.2 px), color `#151719` |
| Alto mínimo enlace | `48px` (inline-flex, centrado) |
| Padding | `6px 0` |
| Hover color | `#1aa585` (sin transición de color declarada en `.site-nav a`; hereda nada → cambio instantáneo) |
| Subrayado | pseudo `::after`, 2 px, `#1aa585`, `bottom:-2px`, `scaleX(0)→scaleX(1)`, `transform-origin:left`, `.2s ease` |
| Estado activo | **no está en el código**: `is-active` se usa en sliders/tabs/chips/galería (`grep -n "is-active" main.js` → 14 usos), pero ninguno sobre `.site-nav`/`.site-nav__main` ni sus enlaces; tampoco `aria-current` (solo en el lang-switch) |

El subrayado `::after` está desactivado dentro de los desplegables por `.site-nav__dropdown a::after{display:none}` (`css:1008-1009`).

---

## 7. Grupos desplegables (`.has-dropdown`)

### 7.1 Trigger

```css
/* css:968-979 */
.site-nav__group.has-dropdown{position:relative}
.site-nav__main{display:inline-flex;align-items:center;gap:4px;cursor:pointer}
.site-nav__chev{font-size:.7rem;transition:transform .15s}
.site-nav__group.has-dropdown:hover .site-nav__chev,
.site-nav__group.has-dropdown.is-open .site-nav__chev{transform:rotate(180deg)}
```

- El chevron es el carácter `▾` (U+25BE) en un `<span aria-hidden="true">`, `.7rem`, gira 180° en `.15s`.
- El trigger es un `<a href>` real (`/pages/produkte`, `/pages/about-us`): en escritorio el click navega; en móvil el JS hace `preventDefault` y lo convierte en acordeón (§10).

### 7.2 `.site-nav__dropdown` (base, compartido por lista simple y mega)

```css
/* css:980-998 */
.site-nav__dropdown{position:absolute;top:calc(100%+10px);left:-20px;min-width:260px;background:#fff;
  border:1px solid var(--color-border);border-radius:12px;box-shadow:0 20px 40px rgba(6,24,39,.12);padding:10px;
  opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .18s,transform .18s,visibility .18s;z-index:80}
.site-nav__group.has-dropdown:hover .site-nav__dropdown,
.site-nav__group.has-dropdown.is-open .site-nav__dropdown{opacity:1;visibility:visible;transform:translateY(0)}
```

| Propiedad | Valor |
|---|---|
| Posición declarada | `top:calc(100%+10px)` — **inválido** (CSS exige espacios alrededor de `+`; confirmado en `main.css` minificado: `calc(100%+10px)`). El navegador descarta la declaración → `top:auto` → el panel se coloca en su **posición estática**, es decir justo debajo de la caja del enlace (gap efectivo ≈ 0 px). Esto es lo que permite pasar el ratón del enlace al panel sin que se cierre. |
| Desplazamiento horizontal | `left:-20px` (mega: `-24px`) |
| Ancho mínimo | `260px` (`--wide`: `280px`, `css:1737-1738`) |
| Caja | fondo `#fff`, borde `1px #e2e2e2`, radio `12px`, `padding:10px` |
| Sombra | `0 20px 40px rgba(6,24,39,.12)` |
| Oculto | `opacity:0; visibility:hidden; translateY(-6px)` |
| Visible | `opacity:1; visibility:visible; translateY(0)` |
| Transición | `opacity .18s, transform .18s, visibility .18s` (sin easing explícito → `ease`) |
| Capa | `z-index:80` |
| Disparador | `.has-dropdown:hover` **o** `.has-dropdown.is-open` |

### 7.3 Enlaces dentro del desplegable

```css
/* css:999-1009 */
.site-nav__dropdown a{display:block;padding:10px 14px;border-radius:8px;font-weight:600;font-size:.9rem}
.site-nav__dropdown a:hover{background:rgba(26,165,133,.08);color:var(--brand-green-dark)}
.site-nav__dropdown a::after{display:none}
```

- 600 / `.9rem` (14.4 px), `padding:10px 14px`, radio 8 px; hover: fondo verde al 8 % + texto `#12755e`.
- Cascada: `css:3725` (`.site-header a{display:inline-flex}`) tiene la **misma especificidad (0,1,1)** que `.site-nav__dropdown a{display:block}` y viene después → en escritorio los enlaces del dropdown "About Us" son `inline-flex`, no bloque. Consecuencia probable: fluyen en línea dentro del panel de 280 px (dos por fila si caben). No verificado visualmente (ver Dudas). No afecta al mega (sus columnas son flex-column y `.mega-item` tiene especificidad (0,2,0)).

### 7.4 Apertura en escritorio: `:hover` puro, sin JS

- No hay JS para abrir/cerrar en escritorio: el estado es 100 % CSS `:hover`.
- El JS (`js:264-285`) **sí** se ejecuta en todos los anchos al cargar y pone `role="button"` y `aria-expanded="false"` en cada `.site-nav__main`, pero su `toggle` retorna inmediatamente si `!isMobile()`. Resultado: en escritorio `aria-expanded` se queda en `"false"` aunque el panel esté abierto por hover.
- No hay `:focus-within` → con teclado el panel no se abre y, como está `visibility:hidden`, sus enlaces **no son tabulables**. Dropdown inaccesible por teclado en escritorio.
- Detalle de "isMobile" (`js:266-268`): `window.innerWidth <= 900 || window.matchMedia('(pointer: coarse)').matches`. Un iPad apaisado (1024 px, puntero grueso) usa el CSS de escritorio pero el comportamiento de click: por eso todos los selectores de apertura llevan el par `:hover` / `.is-open`.

---

## 8. Mega menú (`.site-nav__mega`) — grupo "Products"

Hereda todo lo de `.site-nav__dropdown` (§7.2) y añade (`css:4551-4624`):

### 8.1 Contenedor y grid

```css
.site-nav__mega{left:-24px;width:min(720px,calc(100vw - 48px));display:grid;grid-template-columns:1fr 1fr .8fr;gap:6px;padding:16px}
.site-nav__mega .site-nav__mega-col{display:flex;flex-direction:column;gap:2px;padding:4px 8px}
```

| Propiedad | Valor |
|---|---|
| Ancho | `min(720px, calc(100vw - 48px))` (48 = 2 × padding 24 del container) |
| Columnas | `1fr 1fr .8fr` (Industry · Sports · Tools) |
| Gap | `6px`; padding exterior `16px` (sobrescribe los 10 px base) |
| Columna | flex column, `gap:2px`, `padding:4px 8px` |
| Offset | `left:-24px` respecto al grupo "Products" |

### 8.2 Columna SPORTS (`--sport`)

```css
.site-nav__mega-col--sport{background:linear-gradient(160deg,rgba(6,24,39,.05),rgba(126,199,0,.09));border-radius:12px}
.site-nav__mega-col--sport .site-nav__mega-head{color:var(--brand-green)}
.site-nav__mega-col--sport .mega-item:hover{background:rgba(126,199,0,.14)}
```

Fondo degradado 160° de navy al 5 % a lima al 9 %, radio 12 px; su cabecera en `#1aa585` (las otras en `#535353`); hover de ítem en lima al 14 % (las otras en verde al 8 %).

### 8.3 Cabeceras de columna

```css
.site-nav__mega-head{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--color-sub-title);padding:2px 8px 8px}
```

`.68rem` (10.88 px), 800, mayúsculas, tracking `.1em`.

### 8.4 `.mega-item` (miniatura 58×44)

```css
.site-nav__mega .mega-item{display:flex;align-items:center;gap:12px;padding:8px;border-radius:10px}
.site-nav__mega .mega-item:hover{background:rgba(26,165,133,.08)}
.site-nav__mega .mega-item img{width:58px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0}
.site-nav__mega .mega-item span{display:flex;flex-direction:column;line-height:1.25}
.site-nav__mega .mega-item strong{font-weight:700;color:var(--color-title);font-size:.9rem}
.site-nav__mega .mega-item small{color:var(--color-sub-title);font-size:.75rem;font-weight:500}
.site-nav__mega .mega-item:hover strong{color:var(--brand-green-dark)}
```

| Elemento | Valor |
|---|---|
| Fila | flex, `gap:12px`, `padding:8px`, radio `10px` |
| Imagen | **58×44 px**, `object-fit:cover`, radio `8px`, `flex-shrink:0`, `alt=""` + `aria-hidden="true"` + `loading="lazy"` (las fuentes son JPG de producto reutilizados: `rundbogenhalle-12x24-01.jpg`, `satteldachhalle-10x18-01.jpg`, `padel-court-01.jpg`, `reithalle-globotent-04.jpg`, `padel-court-08.jpg`) |
| Título | `<strong>` 700, `.9rem`, `#151719`; hover `#12755e` |
| Subtítulo | `<small>` 500, `.75rem` (12 px), `#535353` |
| Hover fondo | `rgba(26,165,133,.08)` (sport: `rgba(126,199,0,.14)`) |
| Transición | **no está en el código** (ni en `.mega-item` ni en su `img`): el hover es instantáneo. Sin zoom de imagen. |

### 8.5 `.mega-link` (enlace "ver todo")

```css
.site-nav__mega .mega-link{font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--brand-green);padding:8px;margin-top:2px}
.site-nav__mega .mega-link:hover{color:var(--brand-green-dark)}
```

Flecha "→" en el texto, no en CSS. `.mega-link--sport` sin regla.

### 8.6 Columna Tools (`.site-nav__mega-tools`)

```css
.site-nav__mega-tools{border-left:1px solid var(--color-border)}
.site-nav__mega .site-nav__mega-tools a{font-size:.85rem;color:var(--color-link);padding:7px 8px;font-weight:600}
.site-nav__mega .site-nav__mega-tools a:hover{color:var(--brand-green-dark)}
```

Separador vertical 1 px; enlaces de texto 600 / `.85rem` / `#222`, sin fondo hover.

### 8.7 Mega en móvil (`≤900px`, `css:4625-4642`)

```css
.site-nav__mega{display:block;width:auto;padding:0;gap:0}
.site-nav__mega-col--sport{background:transparent;border-radius:0}
.site-nav__mega-tools{border-left:0}
.site-nav__mega-head{padding-top:12px}
.site-nav__mega .mega-item img{width:46px;height:36px}
.site-nav__mega .mega-item small{font-size:.78rem}
```

Se apila (bloque), pierde degradado y separador, miniaturas **46×36**.

---

## 9. Zona CTA (`.site-header__cta`)

```css
/* css:161-164 */ .site-header__cta{display:flex;align-items:center;gap:12px}
```

### 9.1 Selector de idioma (`.lang-switch`) y banderas

```css
/* css:1635-1738, 3711-3713, 3824-3826 */
.lang-switch{position:relative;margin-right:12px}
.lang-switch__current{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid var(--color-border,#e2e2e2);
  border-radius:50px;padding:8px 14px;font:600 12px/1 'Figtree',system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;
  color:var(--color-title,#151719);cursor:pointer;transition:border-color .2s,background .2s}
.lang-switch__current:hover{border-color:var(--brand-green,#1aa585);background:rgba(26,165,133,.06)}
.lang-switch__current svg{transition:transform .2s}
.lang-switch__current[aria-expanded="true"] svg{transform:rotate(180deg)}
.lang-switch__flag{display:inline-flex;align-items:center}
.lang-switch__label{display:inline-block}
.lang-switch__menu{position:absolute;top:calc(100%+8px);right:0;min-width:160px;background:#fff;border:1px solid var(--color-border,#e2e2e2);
  border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.08);list-style:none;margin:0;padding:6px;opacity:0;visibility:hidden;
  transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s;z-index:100}
.lang-switch.is-open .lang-switch__menu{opacity:1;visibility:visible;transform:translateY(0)}
.lang-switch__menu a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font:600 13px/1 'Figtree',system-ui,sans-serif;color:var(--color-title,#151719);text-decoration:none;transition:background .15s}
.lang-switch__menu a:hover,.lang-switch__menu a:focus-visible{background:rgba(26,165,133,.08);color:var(--brand-green-dark,#12755e)}
.lang-switch__menu a[aria-current="page"]{background:rgba(26,165,133,.12);color:var(--brand-green-dark,#12755e)}
@media (max-width:900px){ .lang-switch__label{display:none} .lang-switch__current{padding:8px 10px} }
.lang-switch__current{min-height:var(--touch-target-min);padding:12px 14px}   /* css:3711, tardía → gana en todos los anchos */
```

| Pieza | Valor |
|---|---|
| Botón | pill radio 50, borde 1 px `#e2e2e2`, `font:600 12px/1`, mayúsculas, tracking `.05em`, `min-height:48px`, `padding:12px 14px` (la regla tardía `css:3711` anula tanto el `8px 14px` base como el `8px 10px` de móvil) |
| Menú | `top:calc(100%+8px)` **inválido** (igual que §7.2) → posición estática bajo el botón; `right:0`; `min-width:160px`; radio 12; sombra `0 10px 30px rgba(0,0,0,.08)`; `padding:6px`; `z-index:100`; oculto con `opacity/visibility/translateY(-4px)`, `.15s` |
| Ítem | flex, `gap:10px`, `padding:10px 12px`, radio 8, `600 13px/1`; hover/focus-visible verde 8 %; `aria-current="page"` verde 12 % |
| `small` | `.72rem 500 margin-left:auto` (`css:1688`) → luego `font-size:12px;line-height:1.4` (`css:3824`) |
| ≤900 | etiqueta "EN" oculta, queda solo la bandera |
| Regla muerta | `.lang-switch__current svg` (rotación del chevron): el botón **no contiene ningún `<svg>`** en el markup |

Banderas (`css:1662-1687`) — CSS puro, sin imágenes salvo GB:

```css
.flag{display:inline-block;width:22px;height:16px;border-radius:3px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.08);vertical-align:middle;flex:0 0 auto}
.flag--de{background:linear-gradient(180deg,#000 0%,#000 33.33%,#dd0000 33.33%,#dd0000 66.66%,#ffce00 66.66%,#ffce00 100%)}
.flag--at{background:linear-gradient(180deg,#ed2939 0%,#ed2939 33.33%,#fff 33.33%,#fff 66.66%,#ed2939 66.66%,#ed2939 100%)}
.flag--gb{background-image:url("data:image/svg+xml;utf8,<svg …Union Jack 60×30…>");background-size:cover;background-position:center}
.flag--es{background:linear-gradient(180deg,#aa151b 0%,#aa151b 25%,#f1bf00 25%,#f1bf00 75%,#aa151b 75%,#aa151b 100%)}
.flag--pt{background:linear-gradient(90deg,#046a38 0%,#046a38 40%,#da020e 40%,#da020e 100%)}
.lang-switch__menu .flag{margin-right:2px}
.lang-switch__current .flag{margin-right:4px}
```

| Clase | Técnica | Colores |
|---|---|---|
| `.flag` | 22×16, radio 3, anillo `0 0 0 1px rgba(0,0,0,.08)` | — |
| `.flag--de` | gradiente 180° en tercios | `#000` / `#dd0000` / `#ffce00` |
| `.flag--at` | gradiente 180° en tercios (no usada en el markup) | `#ed2939` / `#fff` |
| `.flag--gb` | SVG data-URI (Union Jack, viewBox 0 0 60 30) | `#012169`, `#fff`, `#C8102E` |
| `.flag--es` | gradiente 180° 25/50/25 | `#aa151b` / `#f1bf00` |
| `.flag--pt` | gradiente 90° 40/60 | `#046a38` / `#da020e` |

JS del lang-switch (`js:237-251`): click en el botón → `toggle('is-open')` + `aria-expanded` (con `e.stopPropagation()`); click fuera → cierra; `Escape` → cierra (sin comprobar si estaba abierto). No hay navegación por flechas ni gestión de foco a pesar de `role="menu"`.

### 9.2 Teléfono (`.site-header__phone`) — tres estados según ancho

```css
/* css:952-967 (base) */
.site-header__phone{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:50px;font:700 .85rem/1 'Figtree',system-ui,sans-serif;
  color:var(--color-title);border:1px solid var(--color-border);transition:border-color .2s,background .2s,color .2s}
.site-header__phone svg{color:var(--brand-green)}
.site-header__phone:hover{border-color:var(--brand-green);background:rgba(26,165,133,.06);color:var(--brand-green-dark)}
/* css:1544-1545 */ @media (max-width:900px){ .site-header__phone{display:none} }          /* anulada por la siguiente */
/* css:3663-3679 */ @media (max-width:900px){ .site-header__phone{display:inline-flex;width:var(--touch-target-min);height:var(--touch-target-min);padding:0;border-radius:50%;
  background:rgba(26,165,133,.10);border-color:transparent;align-items:center;justify-content:center;gap:0}
  .site-header__phone span{display:none}
  .site-header__phone svg{width:20px;height:20px;color:var(--brand-green-dark)} }
/* css:4644-4646 */ @media (max-width:480px){ .site-header__phone{display:none} }
```

| Ancho | Aspecto |
|---|---|
| > 900 px | pill: icono 18×18 verde `#1aa585` + "+34 657 472 335", 700 / `.85rem`, borde `#e2e2e2`, radio 50; hover borde verde + fondo verde 6 % + texto `#12755e`; transición `.2s` |
| 481–900 px | círculo 48×48, fondo `rgba(26,165,133,.10)`, sin borde, solo icono 20×20 en `#12755e`; número oculto (`aria-label="Call"` lo cubre). `.mobile-sticky-cta` ya está activa en todo este rango (ver nota abajo) → **coexisten** el círculo del header y el botón de llamada de la barra inferior |
| ≤ 480 px | oculto del todo; solo queda la barra inferior `.mobile-sticky-cta` |

`.mobile-sticky-cta` (fuera de esta dimensión) pasa de `display:none` (base, `css:1130-1141`) a `display:flex` dentro del mismo bloque `@media (max-width:900px)` que oculta `.site-header__phone` (css:1543-1591): es decir, aparece ya desde **≤900px**, no solo ≤480px. Entre 481-900px coexisten dos affordances de llamada simultáneas (círculo del header + `.mobile-sticky-cta__call`); a ≤480px el círculo desaparece y solo queda la barra inferior.

### 9.3 Botón "Request a Quote" (`.btn.btn--primary`)

```css
/* css:71-98 */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;height:var(--button-normal-height);padding:0 28px;border-radius:var(--button-corner);
  font-family:var(--font-family);font-weight:var(--button-font-weight);text-transform:var(--button-text-transform);font-size:.85rem;letter-spacing:.04em;
  cursor:pointer;border:2px solid transparent;transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease;white-space:nowrap}
.btn--primary{background:var(--brand-green);color:#fff}
.btn--primary:hover{background:var(--brand-green-dark);color:#fff;transform:translateY(-1px)}
/* css:3835-3837 */ .btn{min-height:var(--touch-target-min);box-sizing:border-box}
/* css:920-921 y 3680-3681 */ @media (max-width:900px){ .site-header__cta .btn:not(.burger){display:none} }
```

44 px de alto declarado (`--button-normal-height`) pero `min-height:48px` tardío (`css:3835`) → **48 px efectivos**; `padding:0 28px`; radio 50; 800 / `.85rem` / mayúsculas / tracking `.04em`; borde 2 px transparente; hover `#12755e` + `translateY(-1px)`; transición `.18s ease`. Oculto ≤ 900 px.

### 9.4 Burger

```css
/* css:165-184 (base, anulada por 3683 en lo que se solapa) */
.burger{display:none;background:none;border:0;padding:8px;cursor:pointer}
/* css:3683-3710 (tardía, top-level) */
.burger{width:var(--touch-target-min);height:var(--touch-target-min);padding:12px;box-sizing:border-box;display:none;flex-direction:column;justify-content:center;align-items:stretch;gap:5px}
@media (max-width:900px){ .burger{display:flex} }
.burger span{display:block;width:100%;height:3px;margin:0;background:var(--color-title);border-radius:2px;transition:transform .2s ease,opacity .2s ease}
.burger.is-open span:nth-child(1){transform:translateY(8px) rotate(45deg)}
.burger.is-open span:nth-child(2){opacity:0}
.burger.is-open span:nth-child(3){transform:translateY(-8px) rotate(-45deg)}
```

| Propiedad | Valor |
|---|---|
| Caja | 48×48, `padding:12px`, sin fondo ni borde, flex column centrado, `gap:5px` |
| Barras | 3 × `span`, ancho 100 % (= 24 px), alto 3 px, `#151719`, radio 2 px; bloque total 3·3 + 2·5 = 19 px |
| Animación | `.2s ease` en `transform` y `opacity`; abierto: barra 1 `translateY(8px) rotate(45deg)`, barra 2 `opacity:0`, barra 3 `translateY(-8px) rotate(-45deg)` (8 = 3 + 5 → las barras exteriores se encuentran sobre la central) |
| Visible | solo `≤900px` |
| ARIA | `aria-label="Open menu"` fijo (no cambia a "Close"), `aria-expanded` sí se actualiza; sin `aria-controls` |

---

## 10. Menú móvil (`≤ 900 px`)

No existe un panel aparte: **el mismo `nav.site-nav` se reposiciona**.

```css
/* css:895-921 */
@media (max-width:900px){
  .burger{display:block}                          /* luego 3694 → display:flex */
  .site-nav{position:fixed;top:80px;left:0;right:0;background:#fff;flex-direction:column;align-items:flex-start;gap:0;padding:16px 24px 24px;
    box-shadow:var(--shadow-header);transform:translateY(-200%);transition:transform .25s ease;max-height:calc(100vh - 80px);overflow-y:auto;-webkit-overflow-scrolling:touch}
  .site-nav.is-open{transform:none}
  .site-nav a{width:100%;padding:12px 0;border-bottom:1px solid var(--color-border)}
  .site-header__cta .btn:not(.burger){display:none}
}
/* css:3781-3784 */ @media (max-width:900px){ .site-nav.is-open{box-shadow:0 8px 24px rgba(6,24,39,.18)} }
```

| Propiedad | Valor |
|---|---|
| Posición | `fixed; top:80px; left:0; right:0` (pegado bajo la barra, ancho completo) |
| Altura | `max-height:calc(100vh - 80px)`, `overflow-y:auto` (scroll interno) |
| Padding | `16px 24px 24px` |
| Cerrado | `transform:translateY(-200%)` (queda por encima del viewport, detrás del header sticky que tiene `z-index:50`; el nav no declara `z-index` propio en móvil → hereda contexto del header) |
| Abierto | `transform:none`; sombra `0 8px 24px rgba(6,24,39,.18)` (más fuerte que `--shadow-header`) |
| Transición | `transform .25s ease` |
| Enlaces | ancho 100 %, `padding:12px 0`, `border-bottom:1px solid #e2e2e2`; el subrayado `::after` de hover sigue existiendo |
| Sin overlay | no hay backdrop ni oscurecimiento de la página |
| Sin bloqueo de scroll | **no está en el código**: el único `document.body.style.overflow='hidden'` de `main.js` es del lightbox (`js:302`). La página sigue scrolleable; por eso el JS cierra el menú si se scrollea > 12 px |
| Sin trampa de foco / `inert` | no está en el código |
| Reduced motion | no hay regla `prefers-reduced-motion` para `.site-nav`, `.burger` ni los dropdowns (solo para `.hero--slider`, `.reveal`, `.cine-hero`) |

### 10.1 Acordeones dentro del panel

```css
/* css:1543-1582 */
@media (max-width:900px){
  .site-nav__group.has-dropdown{width:100%}
  .site-nav__dropdown{position:static;transform:none;box-shadow:none;border:0;padding:0;margin:0;background:transparent;border-radius:0;min-width:0;display:none;opacity:1;visibility:visible}
  .site-nav__group.has-dropdown.is-open>.site-nav__dropdown{display:block;border-top:1px solid var(--color-border);margin:4px 0 8px}
  .site-nav__dropdown a{padding:10px 16px;font-size:.9rem;border-bottom:1px solid var(--color-border)}
  .site-nav__main{width:100%;justify-content:space-between;cursor:pointer}
  .site-nav__group.has-dropdown>.site-nav__main::after{content:"▾";font-size:.75rem;margin-left:auto;transition:transform .2s ease;opacity:.7}
  .site-nav__group.has-dropdown.is-open>.site-nav__main::after{transform:rotate(180deg)}
  .site-nav__group.has-dropdown>.site-nav__main .site-nav__chev{display:none}
}
/* css:3860-3872 (tardía) */
@media (max-width:900px){
  .site-nav__group.has-dropdown.is-open>.site-nav__dropdown{display:block !important;background:var(--color-bg-soft);border-radius:8px;padding:6px 8px;margin:6px 0 12px}
  .site-nav__group.has-dropdown.is-open>.site-nav__dropdown a{min-height:44px;display:flex;align-items:center}
}
```

- En móvil el panel deja de ser flotante: `position:static`, sin sombra/borde/opacidad, **`display:none` ↔ `display:block !important`** (sin transición de apertura: cambio instantáneo).
- Abierto: fondo `#f6f8f7`, radio 8, `padding:6px 8px`, `margin:6px 0 12px`, `border-top:1px` (heredado de `css:1562`); enlaces `min-height:44px`, flex, `padding:10px 16px`, `.9rem`, separador inferior.
- El `span.site-nav__chev` original se oculta y se sustituye por un `::after` "▾" (`.75rem`, opacidad .7) alineado a la derecha con `margin-left:auto`, que gira 180° en `.2s ease`.

### 10.2 JS del menú móvil (`js:194-222`)

```js
const burger = document.querySelector('.burger');
const nav = document.querySelector('.site-nav');
if(burger && nav){
const setMenuOpen = (open) => {
nav.classList.toggle('is-open', open);
burger.classList.toggle('is-open', open);
burger.setAttribute('aria-expanded', String(open));
};
burger.addEventListener('click', () => {
setMenuOpen(!nav.classList.contains('is-open'));
});
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
if (!nav.classList.contains('is-open')) { lastY = window.scrollY; return; }
if (Math.abs(window.scrollY - lastY) > 12) setMenuOpen(false);
}, { passive: true });
document.addEventListener('click', (e) => {
if (!nav.classList.contains('is-open')) return;
if (nav.contains(e.target) || burger.contains(e.target)) return;
setMenuOpen(false);
});
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenuOpen(false);
});
nav.querySelectorAll('a[href]').forEach(a => {
if (a.classList.contains('site-nav__main')) return;
a.addEventListener('click', () => setMenuOpen(false));
});
}
```

Estado = clase `is-open` en `nav` y en `burger` + `aria-expanded` en el burger. Cierres: scroll de más de **12 px** respecto a la posición al abrir, click fuera, `Escape`, click en cualquier enlace que no sea un trigger de grupo. No devuelve el foco al burger al cerrar.

### 10.3 JS de los acordeones (`js:264-285`)

```js
document.querySelectorAll('.site-nav__group.has-dropdown > .site-nav__main').forEach(main => {
const group = main.parentElement;
const isMobile = () =>
window.innerWidth <= 900 ||
window.matchMedia('(pointer: coarse)').matches;
const toggle = (e) => {
if (!isMobile()) return;
e.preventDefault();
e.stopPropagation();
if (e.stopImmediatePropagation) e.stopImmediatePropagation();
const willOpen = !group.classList.contains('is-open');
document.querySelectorAll('.site-nav__group.has-dropdown.is-open').forEach(g => {
if (g !== group) g.classList.remove('is-open');
});
group.classList.toggle('is-open', willOpen);
main.setAttribute('aria-expanded', String(willOpen));
};
main.setAttribute('role', 'button');
main.setAttribute('aria-expanded', 'false');
main.addEventListener('click', toggle);
main.addEventListener('touchend', toggle, { passive: false });
});
```

- Solo un grupo abierto a la vez (cierra hermanos).
- `preventDefault` → en móvil el `<a href="/pages/produkte">` **no navega**; la página "Products" solo es alcanzable desde escritorio (o desde el mega-link "All Models").
- Escucha `click` y `touchend` (`passive:false` para poder `preventDefault`); el `preventDefault` en `touchend` evita el click sintético duplicado.
- El `isMobile()` se evalúa en cada evento (no cachea el ancho).

---

## 11. Comportamiento al hacer scroll

| Qué | Valor | Fuente |
|---|---|---|
| Clase | `.site-header.is-scrolled` cuando `window.scrollY > 8` | `js:190` |
| Efecto | solo `box-shadow: 0 2px 16px rgba(6,24,39,.08)` con `transition .2s ease` | `css:120-127` |
| ¿Se compacta? | **No**: altura, logo, paddings y tipografía no cambian | ausencia de reglas |
| ¿Se oculta al bajar? | **No** (no hay hide-on-scroll) | ausencia en `main.js` |
| Menú móvil abierto + scroll > 12 px | se cierra | `js:205-209` |
| Anclas internas | `a[href^="#"]` → `window.scrollTo({top: el.offsetTop - 90, behavior:'smooth'})` (offset **90 px** = 80 header + 10) | `js:252-263` |
| `scroll-padding-top` | no está en el código; solo `.glossary-entry{scroll-margin-top:100px}` (`css:2576`) | — |
| `html{scroll-behavior:smooth}` | global | `css:32` |

---

## 12. Skip link y accesibilidad

**Skip link: no existe** en ninguna de las 78 páginas (`grep -rl "skip" site/` vacío), aunque `<main id="main" tabindex="-1">` está preparado para recibirlo. Existe `.sr-only` (`css:4946-4955`, patrón clip estándar) pero no se usa en la cabecera.

Inventario ARIA del header:

| Elemento | Atributos | Fuente |
|---|---|---|
| `<header>` | ninguno (landmark `banner` implícito) | html:46 |
| `a.site-header__logo` | `aria-label='Globotent Home'` | html:48 |
| `nav.site-nav` | `aria-label="Hauptnavigation"` (alemán; landmark `navigation`) | html:51 |
| `a.site-nav__main` | por JS: `role="button"`, `aria-expanded="false"` (se actualiza solo en móvil/táctil) | js:281-282 |
| `span.site-nav__chev` | `aria-hidden="true"` | html:53 |
| `img` de `.mega-item` | `alt=""` + `aria-hidden="true"` + `loading="lazy"` | html:58 |
| `div.lang-switch` | `aria-label="Choose language"` en un `div` sin `role` (no se anuncia) | html:104 |
| `button.lang-switch__current` | `type="button"`, `aria-expanded`, `aria-haspopup="true"`; sin `aria-controls` | html:105 |
| `ul.lang-switch__menu` / `a` | `role="menu"` / `role="menuitem"`, `aria-current="page"` en el idioma actual, `rel="alternate" hreflang="xx"` | html:108-112 |
| `span.flag` | `aria-hidden="true"` | html:106 |
| `a.site-header__phone` | `aria-label="Call"` (sobrescribe el número visible para lectores) | html:115 |
| `button.burger` | `aria-label="Open menu"` (fijo), `aria-expanded` (dinámico); sin `aria-controls`; sin `type="button"` | html:120 |

Huecos (para no replicarlos):

1. Sin skip link.
2. Dropdowns de escritorio solo por `:hover`; sin `:focus-within`; los enlaces ocultos con `visibility:hidden` no son tabulables → inaccesibles por teclado.
3. `role="button"` sobre `<a href>` cambia la semántica del enlace también en escritorio, donde sigue navegando.
4. `aria-expanded` de los grupos no refleja el estado de hover en escritorio.
5. `role="menu"` sin navegación por flechas ni gestión de foco.
6. Menú móvil sin trampa de foco, sin `inert` en el resto de la página, sin devolver el foco al burger.
7. Sin estilos de `:focus-visible` propios en la cabecera (solo `.lang-switch__menu a:focus-visible`); dependen del outline por defecto del navegador.
8. Sin `prefers-reduced-motion` para las transiciones de nav/burger/dropdown.
9. Objetivos táctiles: sí cubiertos — `min-height:48px` en todos los `a`/`button` del header (`css:3725`), 44 px en enlaces de acordeón (`css:3868`).
10. Anidación ARIA inválida en el menú de idioma: `<ul role="menu">` (`html:108`) contiene `<li>` sin `role` que a su vez contiene `<a role="menuitem">` (`html:109-112`). El patrón ARIA menu exige que los hijos directos de `role="menu"` sean `menuitem`/`menuitemradio`/etc.; el `<li>` intermedio (sin `role="none"`/`role="presentation"`) rompe la relación padre-hijo en el árbol de accesibilidad (el lector de pantalla ve `menu > listitem > menuitem`, no `menu > menuitem`).

---

## 13. Breakpoints que afectan a la cabecera

| Breakpoint | Qué cambia | Fuente |
|---|---|---|
| `≤ 1100px` | nada en la cabecera (solo grids de producto) | css:889 |
| `≤ 900px` | burger visible; `.site-nav` → panel fijo; botón CTA oculto; teléfono → círculo 48 px; etiqueta "EN" oculta; dropdowns → acordeones; mega → bloque con miniaturas 46×36 | css:895, 1543, 1731, 3662, 3694, 3781, 3860, 4625 |
| `≤ 600px` | logo 56 → 42 px | css:5320 |
| `≤ 480px` | teléfono oculto del todo | css:4644 |
| JS `innerWidth <= 900` o `(pointer: coarse)` | dropdowns por click en vez de hover | js:266-268 |
| JS `(min-width:901px)` | (exit-popup, fuera de esta dimensión) | js:351 |

El sitio usa **max-width** (desktop-first). Corte único de escritorio/móvil en **900/901**.

---

## 14. Cascada: reglas tardías que anulan valores anteriores

El CSS parece haber crecido por capas (una "capa de objetivos táctiles" cerca de la línea 3580-3870). Para reproducir la web hay que leer el valor **final**, no el primero:

| Selector | Primera declaración | Declaración que gana | Valor efectivo |
|---|---|---|---|
| `.container` | `max-width:var(--container)` (1280px) `css:68` | `.section,.container{max-width:100%}` `css:3814` (top-level, misma especificidad, posterior, sin ninguna otra regla `.container{max-width:…}` después en el archivo) | **`max-width:100%`** → la barra ocupa todo el ancho menos `padding:0 24px`. Mismo razonamiento de cascada que las demás filas de esta tabla; no hace falta verificación visual |
| `.burger` | `padding:8px` `css:165` | `width/height:48px;padding:12px;gap:5px;flex-direction:column` `css:3683` | 48×48 |
| `.burger span` | `width:26px;margin:5px 0` `css:171` | `width:100%;margin:0` `css:3697` | barras de 24 px con `gap:5px` |
| `.lang-switch__current` | `padding:8px 14px` / móvil `8px 10px` | `min-height:48px;padding:12px 14px` `css:3711` | 48 px / `12px 14px` en todos los anchos |
| `.site-header__phone` ≤900 | `display:none` `css:1544` | `display:inline-flex` círculo `css:3663` | círculo 48 px |
| `.site-nav__dropdown a` | `display:block` `css:999` | `.site-header a{display:inline-flex}` `css:3725` | `inline-flex` en escritorio |
| `.btn` | `height:44px` `css:76` | `min-height:48px` `css:3835` | 48 px |
| `.site-nav__group…is-open>.site-nav__dropdown` (móvil) | `border-top;margin:4px 0 8px` `css:1561` | `background:#f6f8f7;radius 8;padding:6px 8px;margin:6px 0 12px` `css:3861` | ambas se combinan (border-top + fondo + margen 6/12) |
| `.site-nav__dropdown` / `.lang-switch__menu` | `top:calc(100%+10px)` / `calc(100%+8px)` | declaración inválida (sin espacios) → descartada | `top:auto` (posición estática, pegado al trigger) |

Los demás `calc()` del archivo sí son válidos (`calc(100vh - 80px)`, `calc(100vw - 48px)`, `calc(100svh - 80px)`, `calc(50% - 12px)`).

---

## 15. Pila de `z-index`

| Elemento | z-index | Fuente |
|---|---|---|
| `.splash` | 2000 | css:3343 |
| lightbox (`position:fixed;inset:0;background:rgba(6,24,39,.92)`) | 1000 | css:1060 |
| `.lang-switch__menu` | 100 | css:1710 |
| `.exit-popup` | 100 | css:2727 |
| `.site-nav__dropdown` (y mega) | 80 | css:994 |
| **`.site-header`** | **50** | css:123 |
| `.wa-fab` (WhatsApp flotante, `bottom:24px;right:24px`) | 45 | css:1743 |
| `.mobile-sticky-cta` (barra inferior móvil) | 40 | css:1135 |
| `.maint-banner` (`top:92px`) | 40 | css:5338 |

Los dropdowns (80/100) viven dentro del contexto de apilamiento del header (50): por encima de todo el contenido pero por debajo de lightbox/popup.

---

## 16. Selectores de cabecera sin uso en la home

| Selector | Fuente | Estado |
|---|---|---|
| `.site-nav__sports`, `.site-nav__sports strong`, `::after` degradado verde→lima | css:4029-4053 | no aparece en ninguna de las 78 páginas (grep vacío) |
| `.site-nav__dd-head` | css:4054 | ídem |
| `.lang-switch__current svg` (+ rotación) | css:1655-1658 | el botón no tiene `<svg>` |
| `.flag--at` | css:1673 | no hay enlace austriaco |
| `.site-nav__group--mega`, `.mega-link--sport` | html:52, 81 | clases sin CSS |
| `.burger{display:block}` ≤900 | css:896 | anulada por `display:flex` css:3694 |

---

## 17. Módulos JS de la cabecera (orden en `main.js`)

| Líneas | Módulo | Resumen |
|---|---|---|
| 187-193 | sombra al scroll | `is-scrolled` si `scrollY > 8`, `passive`, se ejecuta al cargar |
| 194-222 | burger / panel móvil | `setMenuOpen(open)`; cierres por scroll > 12 px, click fuera, `Escape`, click en enlace |
| 237-251 | lang-switch | toggle `is-open` + `aria-expanded`; click fuera y `Escape` cierran |
| 252-262 | anclas suaves | `scrollTo(offsetTop - 90)` |
| 264-285 | acordeones de grupo | click/touchend → `is-open` exclusivo; `role="button"`; solo si `innerWidth <= 900 || pointer:coarse` |

No hay dependencias externas. Todo son listeners directos sobre el DOM.

---

## 18. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui

### 18.1 Mapa de componentes y frontera server/client

| Pieza globotent | Componente propuesto | Tipo | Motivo |
|---|---|---|---|
| `header.site-header` + `.site-header__bar` | `Cabecera` (server) que renderiza logo, `<NavEscritorio/>`, teléfono, CTA, `<MenuMovil/>` | **server** | HTML estático; los datos de navegación son un array en un módulo de servidor |
| `.is-scrolled` | `SombraScroll` — wrapper mínimo que pone `data-scrolled="true"` en el `<header>` cuando `scrollY > 8` | `'use client'` | necesita `window.scroll` |
| `.site-nav` escritorio + dropdowns + mega | `NavEscritorio` con shadcn `NavigationMenu` | `'use client'` | Radix gestiona hover/foco/teclado |
| `.burger` + panel `.site-nav` móvil + acordeones | `MenuMovil` con shadcn `Sheet` + `Accordion` | `'use client'` | estado abierto/cerrado |
| `.lang-switch` | `SelectorIdioma` con shadcn `DropdownMenu` (opcional; Pavivasa es monolingüe) | `'use client'` | — |
| `.site-header__phone`, `.btn--primary`, logo | `<Link>` + `Button` de shadcn (`asChild`) | server | sin estado |

Regla: el `<header>` y sus enlaces se renderizan en servidor; solo los tres islotes con estado llevan `'use client'`. Los datos de navegación (`enlaces`, `mega`) viven en un módulo sin `'use client'` e importan en ambos.

Tipos del módulo de navegación (no declarados por shadcn; los define este documento a partir de `ItemMega`/`Columna` usados en 18.4):

```ts
type EnlaceNav =
  | { tipo: 'enlace'; href: string; texto: string }
  | { tipo: 'dropdown'; href: string; texto: string; items: { href: string; texto: string }[] }
  | { tipo: 'mega'; href: string; texto: string; columnas: ColumnaMega[] }

type ColumnaMega =
  | { titulo: string; destacada?: boolean; items: ItemMegaProps[]; enlaceTodo?: { href: string; texto: string } }
  | { titulo: string; herramientas: true; enlaces: { href: string; texto: string }[] }

type ItemMegaProps = { href: string; img: string; titulo: string; sub: string }
```

`ItemMega` (§18.4) recibe `ItemMegaProps`; `<Columna>` recibe `ColumnaMega` (más `titulo`/`destacada`/`herramientas` como props sueltas, según la variante).

Pila de `z-index` objetivo (traducción de §15 — el original no tapa nada porque dropdown/mega (80) y lang-menu (100) viven dentro del contexto de apilamiento del header (50); shadcn no reproduce eso solo, hay que fijarlo):

| Elemento | `z-index` Tailwind | Motivo |
|---|---|---|
| `<header>` (`SombraScroll`) | `z-50` | igual que el original (`css:123`) |
| `NavigationMenuContent` (dropdown y mega) | `z-[80]` explícito en su `className` | con `viewport={false}` shadcn no da z-index propio (issue conocido, ver 18.4); no depender del comportamiento por defecto |
| `DropdownMenu` de idioma (18.6) | por defecto (Radix lo porta en un portal) | equivalente al `z-index:100` original |
| `SheetOverlay` / `SheetContent` (18.5) | `z-[90]` explícito | por encima del header (50) y del `NavigationMenuContent` (80); shadcn trae `z-50` por defecto, igual que el header — ambigüedad que este valor resuelve sin depender del orden de montaje del portal |

### 18.2 Tokens Tailwind (`tailwind.config.ts`) para reproducir los valores

```ts
theme: {
  extend: {
    colors: {
      brand: { DEFAULT: '#1aa585', dark: '#12755e', lime: '#7ec700', navy: '#061827' },
      title: '#151719', sub: '#535353', linkc: '#222222', line: '#e2e2e2', soft: '#f6f8f7',
    },
    boxShadow: {
      header: '0 2px 16px rgba(6,24,39,.08)',
      dropdown: '0 20px 40px rgba(6,24,39,.12)',
      'nav-open': '0 8px 24px rgba(6,24,39,.18)',
      langmenu: '0 10px 30px rgba(0,0,0,.08)',
    },
    screens: { nav: '901px' },        // globotent corta en 900/901; Tailwind es mobile-first → usar `nav:` para "escritorio"
    height: { header: '80px' },
    fontFamily: { sans: ['Figtree', 'system-ui', 'sans-serif'] },   // next/font/google Figtree, peso variable 300..900
  },
}
```

Ajustes de escala a mano (no hay tokens equivalentes): `.95rem` → `text-[.95rem]`, `.9rem` → `text-[.9rem]`, `.85rem` → `text-[.85rem]`, `.78rem` → `text-[.78rem]`, `.75rem` → `text-xs`, `.68rem` → `text-[.68rem]`, `.7rem` → `text-[.7rem]`.

### 18.3 Barra (server)

```tsx
// components/layout/Cabecera.tsx  (server)
<SombraScroll>  {/* renderiza <header className="sticky top-0 z-50 bg-white transition-shadow duration-200 data-[scrolled=true]:shadow-header"> */}
  <div className="mx-auto flex h-header w-full items-center justify-between px-6">   {/* max-width:100% efectivo (css:3814 gana la cascada, ver §14) — sin max-w-* */}
    <Link href="/" aria-label="Pavivasa, inicio" className="inline-flex min-h-12 items-center">
      <Image src="/logo.svg" alt="" height={56} width={89} priority className="h-14 w-auto max-[600px]:h-[42px]" />
    </Link>
    <NavEscritorio />                                  {/* 'use client', oculto <901px con `hidden nav:flex` */}
    <div className="flex items-center gap-3">
      <a href="tel:+34…" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[.85rem] font-bold leading-none text-title transition-colors duration-200 hover:border-brand hover:bg-brand/[.06] hover:text-brand-dark max-nav:h-12 max-nav:w-12 max-nav:justify-center max-nav:rounded-full max-nav:border-transparent max-nav:bg-brand/10 max-nav:p-0 max-[480px]:hidden">
        <PhoneIcon className="size-[18px] text-brand max-nav:size-5 max-nav:text-brand-dark" />
        <span className="max-nav:hidden">+34 …</span>
      </a>
      <Button asChild className="hidden nav:inline-flex h-12 rounded-full bg-brand px-7 text-[.85rem] font-extrabold uppercase tracking-[.04em] text-white transition-all duration-[180ms] hover:-translate-y-px hover:bg-brand-dark">
        <Link href="/presupuesto/">Pedir presupuesto</Link>
      </Button>
      <MenuMovil />                                    {/* 'use client', trigger burger visible solo <901px */}
    </div>
  </div>
</SombraScroll>
```

`SombraScroll` ('use client'):

```tsx
'use client'
export function SombraScroll({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <header data-scrolled={scrolled} className="sticky top-0 z-50 bg-white transition-shadow duration-200 data-[scrolled=true]:shadow-header">{children}</header>
}
```

(`max-nav:` requiere definir `screens: { nav: '901px' }`; Tailwind 3.4 genera `max-nav:` automáticamente para pantallas definidas con un solo valor.)

### 18.4 Escritorio: shadcn `NavigationMenu`

Equivalencias:

| globotent | NavigationMenu |
|---|---|
| `.site-nav` (`flex gap-6`) | `<NavigationMenuList className="gap-6">` |
| `<a>` suelto (References, Contact) | `<NavigationMenuItem><NavigationMenuLink asChild><Link …/></NavigationMenuLink></NavigationMenuItem>` |
| `.site-nav__main` + `.site-nav__chev` | `<NavigationMenuTrigger>` (shadcn ya incluye `ChevronDown` con `group-data-[state=open]:rotate-180 transition duration-300` → cambiar a `duration-150` y `size-3` para imitar `.7rem`/`.15s`) |
| `.site-nav__dropdown` / `.site-nav__mega` | `<NavigationMenuContent>` |
| abrir por hover | comportamiento nativo de Radix (`delayDuration` 200 ms por defecto, `skipDelayDuration` 300 ms); además abre con teclado y cierra con `Escape` → resuelve los huecos 2-4 de §12 |
| `.is-open` / `aria-expanded` | `data-state="open"` + `aria-expanded` gestionados por Radix |

Estilo de enlace de primer nivel (subrayado animado):

```tsx
const enlaceNav = cn(
  'relative inline-flex min-h-12 items-center whitespace-nowrap bg-transparent px-0 py-1.5 text-[.95rem] font-bold text-title hover:text-brand',
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 after:ease-[cubic-bezier(.25,.1,.25,1)] after:content-['']",
  'hover:after:scale-x-100 data-[state=open]:text-brand data-[state=open]:after:scale-x-100',
)
```

Aplicarlo tanto a `NavigationMenuLink` como a `NavigationMenuTrigger` (sustituyendo `navigationMenuTriggerStyle()` de shadcn, que trae fondo gris y radio).

Contenido "About Us" (lista simple):

```tsx
<NavigationMenuContent className="z-[80] min-w-[280px] rounded-xl border border-line bg-white p-2.5 shadow-dropdown">
  <ul className="flex flex-col">
    {items.map(i => (
      <li key={i.href}><NavigationMenuLink asChild>
        <Link href={i.href} className="block rounded-lg px-3.5 py-2.5 text-[.9rem] font-semibold text-title hover:bg-brand/[.08] hover:text-brand-dark">{i.texto}</Link>
      </NavigationMenuLink></li>
    ))}
  </ul>
</NavigationMenuContent>
```

Mega menú:

```tsx
<NavigationMenuContent className="z-[80] w-[min(720px,calc(100vw-48px))] rounded-xl border border-line bg-white p-4 shadow-dropdown">
  <div className="grid grid-cols-[1fr_1fr_.8fr] gap-1.5">
    <Columna titulo="…">                                   {/* flex flex-col gap-0.5 px-2 py-1 */}
      <ItemMega img=… titulo=… sub=… />                    {/* ver abajo */}
      <Link className="mt-0.5 p-2 text-[.78rem] font-extrabold uppercase tracking-[.05em] text-brand hover:text-brand-dark">Todos los modelos →</Link>
    </Columna>
    <Columna destacada …/>                                 {/* + rounded-xl bg-[linear-gradient(160deg,rgba(6,24,39,.05),rgba(126,199,0,.09))] ; cabecera text-brand ; hover de ítems bg-brand-lime/[.14] */}
    <Columna herramientas …/>                              {/* + border-l border-line ; enlaces text-[.85rem] font-semibold text-linkc px-2 py-[7px] hover:text-brand-dark */}
  </div>
</NavigationMenuContent>
```

```tsx
function ItemMega({ href, img, titulo, sub }) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="flex items-center gap-3 rounded-[10px] p-2 hover:bg-brand/[.08] group">
        <Image src={img} alt="" width={58} height={44} className="h-11 w-[58px] shrink-0 rounded-lg object-cover" />
        <span className="flex flex-col leading-[1.25]">
          <strong className="text-[.9rem] font-bold text-title group-hover:text-brand-dark">{titulo}</strong>
          <small className="text-xs font-medium text-sub">{sub}</small>
        </span>
      </Link>
    </NavigationMenuLink>
  )
}
```

Cabecera de columna: `<span className="px-2 pb-2 pt-0.5 text-[.68rem] font-extrabold uppercase tracking-[.1em] text-sub">`.

Diferencias a decidir respecto a shadcn por defecto:

- shadcn posiciona el contenido en un `NavigationMenuViewport` **centrado** bajo la lista completa; globotent lo ancla al trigger (`left:-24px`). Para anclarlo al trigger, usar la variante sin viewport (`<NavigationMenu viewport={false}>` en las versiones recientes de shadcn, o quitar `<NavigationMenuViewport/>` y dar `absolute left-[-24px] top-full` al `NavigationMenuContent`).
- Animación: shadcn usa `data-[motion=from-start]:slide-in-from-left-52` etc. Para imitar globotent (`opacity 0→1`, `translateY(-6px)→0`, 180 ms) sustituir por `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1.5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-[180ms]` (`tailwindcss-animate` viene con shadcn).
- Gap trigger→panel: globotent efectivamente 0 px (§7.2). Con viewport shadcn mete `mt-1.5`; quitarlo o dejarlo (Radix mantiene el hover mientras el puntero cruza).
- Radix cierra al pulsar `Escape` y al hacer click fuera; globotent no lo hacía en escritorio (solo hover).

Diferencias conscientes respecto a globotent (mismo criterio que la tabla de §18.5):

| globotent | Traducción propuesta | Decisión |
|---|---|---|
| `.site-nav__dropdown a{display:block}` (`css:999`) pero `.site-header a{display:inline-flex}` (`css:3725`, misma especificidad, posterior) → en escritorio los enlaces de "About Us" son `inline-flex`, no bloque (§7.3) | `className="block rounded-lg px-3.5 py-2.5 …"` (18.4, "About Us") | normaliza a `block`: decisión consciente, no un descuido — con `NavigationMenuContent` de `min-w-[280px]` el resultado visual es equivalente y `block` es más predecible para una lista de una columna |
| subrayado `transition:transform .2s ease` (`css:145-146`, timing-function por defecto `ease` = `cubic-bezier(.25,.1,.25,1)`) | `after:ease-[cubic-bezier(.25,.1,.25,1)]` (corregido arriba; antes decía `after:ease-out`, curva distinta) | igualar a la curva real, no aproximar |

### 18.5 Móvil: shadcn `Sheet` + `Accordion`

```tsx
'use client'
export default function MenuMovil() {
  const [abierto, setAbierto] = useState(false)
  const pathname = usePathname()
  useEffect(() => setAbierto(false), [pathname])          // ≈ "click en enlace cierra" (js:218-221)
  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <button type="button" aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} className="nav:hidden group flex size-12 flex-col items-stretch justify-center gap-[5px] p-3">
          <span className="block h-[3px] w-full rounded-sm bg-title transition-transform duration-200 ease-out group-data-[state=open]:translate-y-2 group-data-[state=open]:rotate-45" />
          <span className="block h-[3px] w-full rounded-sm bg-title transition-opacity duration-200 ease-out group-data-[state=open]:opacity-0" />
          <span className="block h-[3px] w-full rounded-sm bg-title transition-transform duration-200 ease-out group-data-[state=open]:-translate-y-2 group-data-[state=open]:-rotate-45" />
        </button>
      </SheetTrigger>
      <SheetContent side="top" showCloseButton={false} className="top-20 z-[90] max-h-[calc(100vh-80px)] overflow-y-auto border-0 px-6 pb-6 pt-4 shadow-nav-open data-[state=open]:duration-[250ms] data-[state=closed]:duration-[250ms]">
        <nav aria-label="Navegación principal" className="flex flex-col">
          <Accordion type="single" collapsible>          {/* ≈ un solo grupo abierto (js:275-277) */}
            <AccordionItem value="servicios" className="border-b border-line">
              <AccordionTrigger className="min-h-12 py-3 text-[.95rem] font-bold text-title [&>svg]:size-3 [&>svg]:opacity-70">Servicios</AccordionTrigger>
              <AccordionContent className="mb-3 mt-1.5 rounded-lg bg-soft px-2 py-1.5">
                {/* enlaces: flex min-h-11 items-center border-b border-line px-4 py-2.5 text-[.9rem] font-semibold */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* enlaces sueltos: block w-full border-b border-line py-3 text-[.95rem] font-bold text-title */}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

Diferencias conscientes respecto a globotent:

| globotent | Sheet de shadcn (Radix Dialog) | Decisión sugerida |
|---|---|---|
| sin overlay | `SheetOverlay` oscurece la página | mantener overlay (mejor a11y) o `SheetOverlay className="bg-transparent"` |
| body sigue scrolleable; cierra al scroll > 12 px | Radix bloquea el scroll del body (`react-remove-scroll`) | no replicar el cierre por scroll: es innecesario con scroll bloqueado |
| sin trampa de foco, sin devolver foco | Radix atrapa el foco y lo devuelve al trigger | usar lo de Radix |
| `translateY(-200%)` .25s ease | `side="top"` → `slide-in-from-top` | igualar a 250 ms |
| panel bajo la barra (`top:80px`) | Sheet parte del borde del viewport | `className="top-20"` (**no** `top-header`: `theme.height` solo genera `h-*`, no `top-*` — eso sale de `theme.inset`, ausente en §18.2) + `showCloseButton={false}` para ocultar el botón de cierre interno |
| burger `aria-label` fijo | — | alternar "Abrir/Cerrar menú" |
| acordeón sin animación (`display:none` ↔ `block`) | Accordion anima altura (`accordion-down/up` 200 ms) | aceptable |
| `<a href>` trigger que no navega en móvil | `AccordionTrigger` es `<button>` | correcto; el enlace a la página índice va como primer ítem del acordeón |

### 18.6 Lang-switch → `DropdownMenu` (solo si Pavivasa tuviera idiomas)

`DropdownMenuTrigger asChild` sobre un `<button>` pill (`rounded-full border border-line px-3.5 py-3 text-xs font-semibold uppercase tracking-[.05em]`), `DropdownMenuContent align="end" className="min-w-40 rounded-xl p-1.5 shadow-langmenu"`, ítems `rounded-lg px-3 py-2.5 text-[13px] font-semibold` con `data-[state=checked]:bg-brand/[.12]` (usar `DropdownMenuRadioGroup`). Banderas: reproducir los gradientes CSS de §9.1 como clases `bg-[linear-gradient(…)]` en un `<span aria-hidden className="inline-block h-4 w-[22px] rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,.08)]">`. Radix añade navegación por flechas y `role="menu"` correctos. (Además resuelve de raíz el hueco 10 de §12: `DropdownMenu` no inserta `<li>` entre `menu` y `menuitem`.)

### 18.7 Skip link (añadir aunque globotent no lo tenga)

`<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] …">Saltar al contenido</a>` antes del header; `<main id="main" tabIndex={-1}>`.

### 18.8 Estado actual del repo Pavivasa (leído, no modificado)

- No hay `components.json` ni dependencias `@radix-ui/*`/`class-variance-authority`/`tailwindcss-animate` en `package.json` (`next 15.5.22`, `react 19.0.0`, `tailwindcss ^3.4.17`, `zod`): **shadcn/ui no está inicializado**. Habría que ejecutar `npx shadcn@latest init` y añadir `navigation-menu`, `sheet`, `accordion`, `button` (y `dropdown-menu` si se quiere el selector).
- Ya existen `components/layout/Cabecera.tsx` (`'use client'` entero; se compacta 72→56 px al superar 40 px de scroll; desplegable "Servicios" propio con `mousedown`/`focusin`/`Escape`) y `components/layout/MenuMovil.tsx` (panel a pantalla completa, bloquea `body.overflow`, trampa de foco manual). `app/layout.tsx` ya incluye un skip link "Saltar al contenido" (`layout.tsx:60`). Es decir, el repo ya cubre los huecos de a11y de globotent; lo que cambia con esta referencia es el **diseño** (barra 80 px fija, subrayado animado, mega menú con miniaturas) y la posibilidad de mover la cabecera a server + islotes.
- `CLAUDE.md` de Pavivasa fija: `border-radius: 0` en todo, **una sola sombra** (la barra fija de móvil), 100 KB de JS inicial, "sin librerías de animación, iconos ni formularios", 44 px táctiles, `prefers-reduced-motion`. Los radios de 12/10/8 px, las tres sombras de la cabecera globotent y el peso de Radix chocan con esas reglas: es una decisión de diseño/producto que este documento no toma; se deja señalado.
- Ese mismo choque afecta a dos dependencias concretas que arrastran los componentes de shadcn propuestos, no solo a radios/sombras: instalar `navigation-menu` y `sheet` (`npx shadcn@latest add navigation-menu sheet accordion button`) añade `lucide-react` como dependencia dura (el `ChevronDownIcon` del `NavigationMenuTrigger`, el icono `X` de cierre del `Sheet`), y las clases `data-[state=open]:animate-in`/`slide-in-from-top-1.5` de 18.4/18.5 requieren el plugin `tailwindcss-animate`. Queda por decidir: sustituir los iconos generados por los SVG inline que ya usa el sitio original (§1, p. ej. el icono de teléfono) y sustituir `animate-in`/`slide-in-from-*` por transiciones CSS planas (`transition-transform`, `transition-opacity`) para no violar la regla del cliente.

---

## 19. Lista de comprobación para verificar con navegador

1. Barra 80 px en 1440 / 900 / 375 px; logo 56 px (42 px ≤ 600).
2. Sombra aparece exactamente al pasar 8 px de scroll; no cambia nada más.
3. `.container`: confirmar que la barra llega hasta 24 px del borde en pantallas > 1328 px (`max-width:100%` por cascada, `css:3814`, §14) y no se detiene en 1280 px.
4. Dropdown "About Us": ¿los tres enlaces se muestran uno por fila o en línea (efecto `inline-flex` de `css:3725`)?
5. Gap entre "Products" y el mega: ¿0 px (calc inválido) o 10 px?
6. Mega: ancho 720 px, columnas `1fr 1fr .8fr`, miniaturas 58×44, columna SPORTS con degradado.
7. Móvil ≤ 900: panel desde arriba .25 s; página sigue scrolleable; se cierra al scrollear > 12 px.
8. Teléfono: pill > 900, círculo 481-900, oculto ≤ 480.
9. Tab desde el logo en escritorio: los enlaces de dropdown no reciben foco.
