# 08 · Comportamiento responsive de globotent.com

Documento de referencia para (1) Claude Design y (2) Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Describe **cómo** se adapta la web a cada ancho, con valores literales y su origen en el código. Fuente única: `main.pretty.css` (6156 líneas; las referencias `L####` son líneas de ese archivo), `main.js` (742 líneas) y las 78 páginas del espejo `site/`.

Convenciones:
- "≤900" significa `@media (max-width:900px)`. Todo el sitio es **desktop-first**: los estilos base son escritorio y las `@media` solo restan/recolocan.
- "escritorio" = >1100px; "tablet" ≈ 901–1100px y 769–900px según el componente; "móvil" ≤560px (con matices en 480/520).
- Cuando dos reglas del mismo selector chocan, gana la que aparece **más tarde** en el archivo (misma especificidad). Se señala cuando eso invalida una regla.
- Cuando algo no está en el código se dice "no está en el código".

---

## 0. Resumen ejecutivo

| Dato | Valor | Origen |
|---|---|---|
| Nº de bloques `@media` | **75** (no ~90) | recuento sobre `main.pretty.css` |
| Breakpoints `max-width` usados | 1100, 1000, 900, 880, 860, 820, 780, 768, 760, 720, 700, 680, 600, 560, 520, 480 (16 valores) | idem |
| Media queries no dimensionales | `(hover:none)` ×1, `(prefers-reduced-motion:reduce)` ×3 | L5284, L3393, L4023, L6149 |
| Ningún `@media (min-width:…)` en el CSS | cierto como *media feature*; el único `(min-width:…)` está en JS (`matchMedia('(min-width:901px)')`, exit-popup). Como **propiedad CSS** (no media feature) — dentro o fuera de `@media`, indistintamente — `min-width` sí se usa 16 veces (p. ej. `.mobile-sticky-cta__call`, `.form-grid>*`, ver §7) | main.js L351 |
| Corte estructural principal | **900px**: burger, nav como panel fijo, dropdowns acordeón, CTA de cabecera oculto, la mayoría de rejillas a 2 col | L895–L941, L1543–L1608, L3662–L3695, L4624–L4642 |
| Corte "todo a 1 columna" | **560px** | L942, L1609, L2325, L3460, L3017… |
| Corte intermedio de 3→2 col | **1100px** | L889, L1539, L2311 |
| Viewport meta | `<meta name="viewport" content="width=device-width, initial-scale=1">` | `home.html` L5 |
| Tipografía fluida | 44 usos de `clamp()` (tabla completa en §4) | grep |
| Objetivo táctil mínimo | `--touch-target-min:48px` (declarado en un segundo `:root`, L3583–L3584) | L3584 |
| Contenedor | `.container{max-width:var(--container)/*1280px*/;margin:0 auto;padding:0 24px}` (L67–L70) **pero** `.section,.container{max-width:100%}` (L3814) lo sobrescribe más tarde → ver §6 | L67, L3814 |

---

## 1. Inventario de bloques `@media` (por breakpoint)

Recuento de bloques por consulta (orden descendente de anchura):

| Consulta | Nº bloques | Líneas |
|---|---|---|
| `(max-width:1100px)` | 3 | 889, 1539, 2311 |
| `(max-width:1000px)` | 1 | 4364 |
| `(max-width:900px)` | 17 | 895, 1543, 1731, 2548, 2646, 3013, 3202, 3299, 3332, 3455, 3662, 3693, 3781, 3860, 4624, 5455, 5782 (las dos últimas con sintaxis sin espacio `@media(max-width:900px)`) |
| `(max-width:880px)` | 1 | 404 |
| `(max-width:860px)` | 1 | 5958 |
| `(max-width:820px)` | 4 | 4167, 4531, 5010, 5288 |
| `(max-width:780px)` | 2 | 368, 446 |
| `(max-width:768px)` | 6 | 3585, 3626, 3650, 3740, 3805, 3849 |
| `(max-width:760px)` | 4 | 4229, 4848, 5122, 6128 |
| `(max-width:720px)` | 3 | 542, 2898, 4015 |
| `(max-width:700px)` | 5 | 2695, 2720, 3143, 3235, 3505 |
| `(max-width:680px)` | 1 | 5793 |
| `(max-width:600px)` | 1 | 5320 |
| `(max-width:560px)` | 13 | 942, 1609, 1767, 1915, 2325, 2349, 2554, 2652, 3017, 3460, 3844, 4699, 4855 |
| `(max-width:520px)` | 4 | 409, 828, 4543, 5372 |
| `(max-width:480px)` | 5 | 3775, 3801, 3816, 4643, 5459 (la última con sintaxis sin espacio `@media(max-width:480px)`) |
| `(hover:none)` | 1 | 5284 |
| `(prefers-reduced-motion:reduce)` | 3 | 3393, 4023, 6149 |

El total es 75 (comprobación: 3+1+17+1+1+4+2+6+4+3+5+1+1+13+4+5+1+3 = 75).

---

## 2. Todas las reglas `@media`, literalmente, ordenadas por breakpoint

Formato: línea del bloque → selector → declaraciones literales.

### 2.1 `@media (max-width:1100px)` — de 4/3 columnas a 3/2

| L | Selector | Cambia a |
|---|---|---|
| 889 | `.product-grid` | `grid-template-columns:repeat(3,1fr)` |
| 889 | `.features` | `grid-template-columns:repeat(2,1fr)` |
| 1539 | `.calc-grid` | `grid-template-columns:repeat(2,1fr)` |
| 2311 | `.reviews-grid` | `grid-template-columns:repeat(2,1fr)` |
| 2311 | `.case-grid` | `grid-template-columns:repeat(2,1fr)` |
| 2311 | `.case-body` | `grid-template-columns:1fr` |
| 2311 | `.case-hero` | `grid-template-columns:1fr` |
| 2311 | `.rating-summary` | `grid-template-columns:1fr; gap:24px; text-align:center` |

### 2.2 `@media (max-width:1000px)`

| L | Selector | Cambia a |
|---|---|---|
| 4364 | `.sp-disciplines` | `grid-template-columns:repeat(2,1fr)` |

### 2.3 `@media (max-width:900px)` — el corte estructural (nav móvil)

Bloque L895 (cabecera + rejillas básicas):

```css
@media (max-width:900px){
  .burger{display:block}                     /* anulado después por L3694: display:flex */
  .site-nav{
    position:fixed; top:80px; left:0; right:0; background:#fff;
    flex-direction:column; align-items:flex-start; gap:0;
    padding:16px 24px 24px; box-shadow:var(--shadow-header);
    transform:translateY(-200%); transition:transform .25s ease;
    max-height:calc(100vh - 80px); overflow-y:auto; -webkit-overflow-scrolling:touch}
  .site-nav.is-open{transform:none}
  .site-nav a{width:100%; padding:12px 0; border-bottom:1px solid var(--color-border)}
  .site-header__cta .btn:not(.burger){display:none}
  .product-grid{grid-template-columns:repeat(2,1fr)}
  .product-detail{grid-template-columns:1fr}
  .testimonials{grid-template-columns:1fr}
  .collections{grid-template-columns:1fr}
  .site-footer__grid{grid-template-columns:1fr 1fr}
  .form-grid{grid-template-columns:1fr}
  .hero{min-height:480px}
  .hero__inner{padding-top:64px; padding-bottom:64px}
  .cta-band{padding:40px 24px}
}
```

Bloque L1543 (dropdowns acordeón, calculadora, sticky CTA, lightbox):

```css
@media (max-width:900px){
  .site-header__phone{display:none}          /* anulado después por L3663 */
  .site-nav__group.has-dropdown{width:100%}
  .site-nav__dropdown{
    position:static; transform:none; box-shadow:none; border:0; padding:0; margin:0;
    background:transparent; border-radius:0; min-width:0; display:none; opacity:1; visibility:visible}
  .site-nav__group.has-dropdown.is-open>.site-nav__dropdown{
    display:block; border-top:1px solid var(--color-border); margin:4px 0 8px}
  .site-nav__dropdown a{padding:10px 16px; font-size:.9rem; border-bottom:1px solid var(--color-border)}
  .site-nav__main{width:100%; justify-content:space-between; cursor:pointer}
  .site-nav__group.has-dropdown>.site-nav__main::after{
    content:"▾"; font-size:.75rem; margin-left:auto; transition:transform .2s ease; opacity:.7}
  .site-nav__group.has-dropdown.is-open>.site-nav__main::after{transform:rotate(180deg)}
  .site-nav__group.has-dropdown>.site-nav__main .site-nav__chev{display:none}
  .calc-layout{grid-template-columns:1fr; gap:20px}
  .calc-layout__controls{position:static}
  .product-info__stats{grid-template-columns:1fr 1fr}
  .mobile-sticky-cta{display:flex}
  main{padding-bottom:84px}                  /* GLOBAL: todo <main> gana 84px abajo en ≤900 */
  .hero h1{font-size:clamp(1.8rem,7vw,2.6rem)}
  .hero__sub{font-size:1rem}
  .lightbox{padding:16px}
  .lightbox__nav{width:44px; height:44px; font-size:26px}
  .lightbox__nav--prev{left:8px}
  .lightbox__nav--next{right:8px}
}
```

Resto de bloques a 900px:

| L | Selector | Cambia a |
|---|---|---|
| 1731 | `.lang-switch__label` | `display:none` |
| 1731 | `.lang-switch__current` | `padding:8px 10px` (**anulado** por L3711 base `padding:12px 14px`, posterior y misma especificidad) |
| 2548 | `.blog-grid` | `grid-template-columns:repeat(2,1fr)` |
| 2548 | `.blog-related-grid` | `grid-template-columns:1fr` |
| 2646 | `.team-grid` | `grid-template-columns:repeat(2,1fr)` |
| 2646 | `.cert-grid` | `grid-template-columns:1fr 1fr` |
| 3013 | `.video-testi-grid` | `grid-template-columns:1fr 1fr` |
| 3202 | `.compare-slots` | `grid-template-columns:1fr` |
| 3299 | `.three-d-cta` | `grid-template-columns:1fr; padding:28px` |
| 3332 | `.preview-tool` | `grid-template-columns:1fr` |
| 3332 | `.preview-tool__stage` | `min-height:320px` |
| 3332 | `.preview-tool__dropzone` | `height:320px` |
| 3455 | `.trust-bar__grid` | `grid-template-columns:1fr 1fr; gap:20px` |
| 3662 | `.site-header__phone` | `display:inline-flex; width:var(--touch-target-min); height:var(--touch-target-min); padding:0; border-radius:50%; background:rgba(26,165,133,.10); border-color:transparent; align-items:center; justify-content:center; gap:0` |
| 3662 | `.site-header__phone span` | `display:none` |
| 3662 | `.site-header__phone svg` | `width:20px; height:20px; color:var(--brand-green-dark)` |
| 3662 | `.site-header__cta .btn:not(.burger)` | `display:none` (repetido) |
| 3693 | `.burger` | `display:flex` |
| 3781 | `.site-nav.is-open` | `box-shadow:0 8px 24px rgba(6,24,39,.18)` |
| 3860 | `.site-nav__group.has-dropdown.is-open>.site-nav__dropdown` | `display:block !important; background:var(--color-bg-soft); border-radius:8px; padding:6px 8px; margin:6px 0 12px` |
| 3860 | `.site-nav__group.has-dropdown.is-open>.site-nav__dropdown a` | `min-height:44px; display:flex; align-items:center` |
| 4624 | `.site-nav__mega` | `display:block; width:auto; padding:0; gap:0` |
| 4624 | `.site-nav__mega-col--sport` | `background:transparent; border-radius:0` |
| 4624 | `.site-nav__mega-tools` | `border-left:0` |
| 4624 | `.site-nav__mega-head` | `padding-top:12px` |
| 4624 | `.site-nav__mega .mega-item img` | `width:46px; height:36px` (escritorio 58×44) |
| 4624 | `.site-nav__mega .mega-item small` | `font-size:.78rem` (escritorio .75rem) |
| 5455 | `.team-wall` | `column-count:2` |
| 5782 | `.jobs-values,.jobs-grid` | `grid-template-columns:1fr` |
| 5782 | `.job-cols` | `grid-template-columns:1fr; gap:24px` |
| 5782 | `.job-meta` | `grid-template-columns:repeat(2,1fr)` |
| 5782 | `.job-others` | `grid-template-columns:1fr` |

### 2.4 `@media (max-width:880px)`

| L | Selector | Cambia a |
|---|---|---|
| 404 | `.photo-gallery` | `grid-template-columns:repeat(2,1fr); gap:14px` |

### 2.5 `@media (max-width:860px)`

| L | Selector | Cambia a |
|---|---|---|
| 5958 | `.agro-feature__grid` | `grid-template-columns:1fr; gap:30px` |
| 5958 | `.agro-feature__intro` | `order:2` |
| 5958 | `.agro-feature__video` | `order:1` (vídeo pasa arriba) |
| 5958 | `.agro-feature__play` | `width:62px; height:62px` |
| 5958 | `.agro-feature__play svg` | `width:24px; height:24px` |

### 2.6 `@media (max-width:820px)` — heros de dos paneles y sport

| L | Selector | Cambia a |
|---|---|---|
| 4167 | `.world-hero__split` | `flex-direction:column; gap:12px` |
| 4167 | `.world-panel` | `min-height:340px` (escritorio 470px) |
| 4167 | `.world-panel--sport` | `min-height:400px` (escritorio 520px) |
| 4531 | `.sp-disciplines` | `grid-template-columns:1fr` |
| 4531 | `.sp-specs` | `grid-template-columns:1fr 1fr` |
| 4531 | `.sp-spec:nth-child(2n)` | `border-right:0` |
| 4531 | `.sp-spec` | `border-bottom:1px solid #000` |
| 4531 | `.sp-spec:nth-last-child(-n+1)` | `border-bottom:0` |
| 5010 | `.world-hero--split .world-hero__split` | `min-height:0; flex-direction:column` |
| 5010 | `.world-hero--split .world-panel` | `min-height:54svh; align-items:flex-end` |
| 5010 | `.world-hero--split .world-panel__inner` | `padding:28px 24px 32px` |
| 5010 | `.world-hero--split .world-panel__inner h2` | `font-size:clamp(1.8rem,7vw,2.3rem)` |
| 5010 | `.world-hero--split .world-panel--sport` | `box-shadow:inset 0 5px 0 -2px rgba(126,199,0,.9)` (la línea lima pasa de lateral a superior) |
| 5010 | `.world-hero__badge` | `top:12px` |
| 5288 | `.lead-hero__grid` | `grid-template-columns:minmax(0,1fr)` |
| 5288 | `.lead-hero__tiles` | `height:auto; min-width:0` |
| 5288 | `.lead-hero__text` | `min-width:0` |
| 5288 | `.lead-tile` | `height:230px; flex:none` |
| 5288 | `.lead-slide__label` | `bottom:36px; left:16px; right:16px; font-size:.98rem; line-height:1.15` |
| 5288 | `.lead-tile__dots` | `left:50%; right:auto; transform:translateX(-50%); bottom:14px` |
| 5288 | `.lead-tile__world` | `top:12px; left:12px; padding:5px 11px; font-size:.66rem` |
| 5288 | `.lead-tile--sport .lead-tile__world` | `padding:6px 12px` |
| 5288 | `.lead-tile__logo` | `height:22px` |

### 2.7 `@media (max-width:780px)`

| L | Selector | Cambia a |
|---|---|---|
| 368 | `.padel-sizes th:nth-child(3),.padel-sizes td:nth-child(3)` | `display:none` (oculta la 3.ª columna de la tabla) |
| 446 | `.padel-detail__grid` | `grid-template-columns:1fr; gap:32px` |
| 446 | `.padel-hero__inner` | `padding:60px 0` |

### 2.8 `@media (max-width:768px)` — formularios y herramientas

| L | Selector | Cambia a |
|---|---|---|
| 3585 | `.form-grid` | `grid-template-columns:1fr; gap:24px; max-width:100%` |
| 3626 | `.compare-tool .compare-slots` | `display:flex; flex-direction:column; gap:16px` |
| 3626 | `.compare-slot` | `border:1px solid var(--color-border); border-radius:10px; padding:14px; background:#fff` |
| 3626 | `.compare-slot__body` | `color:var(--color-title)` |
| 3626 | `.compare-specs` | `margin:8px 0 0` |
| 3626 | `.compare-specs dt` | `color:var(--color-sub-title); font-weight:600; font-size:.85rem` |
| 3626 | `.compare-specs dd` | `color:var(--color-title); font-weight:700; font-size:.95rem; margin:2px 0 8px` |
| 3650 | `.step-grid` | `grid-template-columns:1fr; display:grid; gap:14px` |
| 3650 | `.step-card[data-step="1"]`/`"2"`/`"3"` | `order:1` / `order:2` / `order:3` |
| 3740 | `.contact-grid` | `grid-template-columns:1fr; gap:32px` |
| 3740 | `.contact-grid>div,.contact-grid>form` | `min-width:0; max-width:100%` |
| 3805 | `.calc-layout` | `grid-template-columns:1fr` |
| 3805 | `.calc-layout__controls,.calc-layout__viz` | `max-width:100%; width:100%; padding-right:0; box-sizing:border-box` |
| 3849 | `.calc-layout,.calc-layout__controls,.calc-layout__viz` | `width:100%; max-width:100%; min-width:0; box-sizing:border-box; padding-left:0; padding-right:0` |
| 3849 | `.calc-viz__canvas` | `max-width:100%` |

### 2.9 `@media (max-width:760px)` — cine-hero móvil

| L | Selector | Cambia a |
|---|---|---|
| 4229 | `.world-block--sport .kategorien .collection-card:last-child:nth-child(odd)` | `width:100%` (escritorio `calc(50% - 12px)` centrada) |
| 4848 | `.padel-size-layout` | `grid-template-columns:1fr; gap:22px` |
| 4848 | `.padel-size-layout .padel-sizes th:last-child, … td:last-child` | `display:none` |
| 5122 | `.choose-cards` | `grid-template-columns:1fr; max-width:460px` |
| 6128 | `.cine-hero` | `min-height:min(92svh,700px)` |
| 6128 | `.cine-hero__inner` | `padding-top:clamp(60px,12vh,110px)` |
| 6128 | `.cine-hero__h1` | `font-size:clamp(1.95rem,8.4vw,2.7rem); max-width:none` |
| 6128 | `.cine-hero__sub` | `font-size:1rem` |
| 6128 | `.cine-hero__actions .btn` | `flex:1 1 100%; justify-content:center` (botones a ancho completo, apilados) |
| 6128 | `.cine-hero__tabs` | `flex-wrap:wrap` |
| 6128 | `.cine-tab` | `flex:1 1 42%; padding:13px 6px 0` (2 pestañas por fila) |
| 6128 | `.cine-tab__name` | `font-size:.85rem` |

### 2.10 `@media (max-width:720px)`

| L | Selector | Cambia a |
|---|---|---|
| 542 | `.collections,.kategorien,.kategorien--center` | `grid-template-columns:1fr; max-width:none` |
| 2898 | `.before-after` | `overflow:visible; margin-bottom:70px` |
| 2898 | `.before-after__notice` | `top:calc(100%+10px); bottom:auto; left:0; right:0; background:rgba(6,24,39,.04); color:var(--color-text); backdrop-filter:none; text-align:left; font-size:.82rem` (el aviso sale del recuadro y se coloca debajo) |
| 4015 | `.hero__dots` | `margin-top:26px` |
| 4015 | `.hero__dot` | `width:32px` (escritorio 40px) |
| 4015 | `.hero__sports-logo` | `height:36px` (escritorio 42px) |

### 2.11 `@media (max-width:700px)`

| L | Selector | Cambia a |
|---|---|---|
| 2695 | `.co2-calc` | `grid-template-columns:1fr` |
| 2720 | `.download-grid` | `grid-template-columns:1fr` |
| 3143 | `.quiz` | `padding:24px` |
| 3143 | `.quiz__options` | `grid-template-columns:1fr` |
| 3143 | `.quiz__result` | `grid-template-columns:1fr` |
| 3235 | `.how-steps` | `grid-template-columns:1fr` |
| 3505 | `.press-strip .container` | `flex-direction:column; align-items:flex-start; gap:14px` (la etiqueta pasa encima de la cinta) |

### 2.12 `@media (max-width:680px)`

| L | Selector | Cambia a |
|---|---|---|
| 5793 | `.job-meta` | `grid-template-columns:1fr` |
| 5793 | `.jobdetail-apply` | `flex-direction:column; align-items:stretch; text-align:center; padding:26px 22px` |
| 5793 | `.jobdetail-apply .btn` | `text-align:center` |
| 5793 | `.jobdetail-hero__gender` | `display:block; margin-top:6px` |

### 2.13 `@media (max-width:600px)`

| L | Selector | Cambia a |
|---|---|---|
| 5320 | `.site-header__logo img` | `height:42px` (escritorio 56px) |
| 5320 | `.lead-hero__text h1` | `font-size:1.7rem; line-height:1.12; overflow-wrap:break-word; hyphens:auto` |
| 5320 | `.lead-hero__eyebrow` | `font-size:.72rem; line-height:1.4` |
| 5320 | `.lead-hero__text p` | `font-size:1rem` |

### 2.14 `@media (max-width:560px)` — móvil: una columna

| L | Selector | Cambia a |
|---|---|---|
| 942 | `.product-grid` | `grid-template-columns:1fr` |
| 942 | `.features` | `grid-template-columns:1fr` |
| 942 | `.site-footer__grid` | `grid-template-columns:1fr` |
| 942 | `.gallery__thumbs` | `grid-template-columns:repeat(4,1fr)` (escritorio 5) |
| 1609 | `.calc-grid` | `grid-template-columns:1fr` |
| 1609 | `.field-row` | `grid-template-columns:1fr 1fr 1fr; gap:6px` |
| 1609 | `.field-row .field label` | `font-size:.75rem` |
| 1609 | `.calc-viz__canvas` | `aspect-ratio:4/3` (escritorio 8/5) |
| 1609 | `.chip` | `padding:8px 10px; font-size:.78rem` (**anulado** en parte por L3714 base `.chip{min-height:48px;padding:10px 16px}`, posterior) |
| 1609 | `.calc-result__value` | `font-size:1.9rem` |
| 1609 | `.product-card` | `border-radius:10px` (escritorio `var(--radius)`=12px) |
| 1609 | `.section` | `padding:48px 0` (escritorio 72px 0) |
| 1609 | `.section--tight` | `padding:32px 0` (escritorio 48px 0) |
| 1609 | `.cta-band` | `padding:32px 20px` |
| 1609 | `.cta-band h2` | `font-size:1.4rem` |
| 1767 | `.wa-fab` | `bottom:92px; padding:12px; font-size:0` |
| 1767 | `.wa-fab span` | `display:none` (solo icono) |
| 1767 | `.wa-fab svg` | `width:26px; height:26px` (escritorio 22px) |
| 1915 | `.heu-animal-grid` | `grid-template-columns:1fr` |
| 1915 | `.color-picker` | `grid-template-columns:repeat(2,1fr)` |
| 1915 | `.bau-light` | `width:60px; height:60px` |
| 1915 | `.bau-ampel` | `gap:14px; padding:18px` |
| 2325 | `.reviews-grid` | `grid-template-columns:1fr` |
| 2325 | `.case-grid` | `grid-template-columns:1fr` |
| 2325 | `.case-stats` | `grid-template-columns:1fr` |
| 2325 | `.case-gallery` | `grid-template-columns:1fr 1fr` |
| 2325 | `.case-quote` | `padding:24px` |
| 2325 | `.case-quote blockquote` | `font-size:1.05rem` |
| 2325 | `.reviews-head` | `flex-direction:column; align-items:flex-start` |
| 2349 | `.dach-map` | `height:380px` |
| 2554 | `.blog-grid` | `grid-template-columns:1fr` |
| 2652 | `.team-grid` | `grid-template-columns:1fr` |
| 2652 | `.cert-grid` | `grid-template-columns:1fr` |
| 3017 | `.video-testi-grid` | `grid-template-columns:1fr` |
| 3460 | `.trust-bar__grid` | `grid-template-columns:1fr` |
| 3844 | `.site-footer` | `padding-right:24px; padding-bottom:96px` (escritorio `padding-right:80px`, L3841) |
| 4699 | `.filter-bar__count` | `margin-left:0; width:100%` |
| 4699 | `.filter-bar` | `gap:10px` |
| 4855 | `.padel-promo` | `padding:22px 18px` |
| 4855 | `.padel-promo>div:last-child` | `flex-direction:column; align-items:stretch` |
| 4855 | `.padel-promo .btn` | `width:100%; white-space:normal; text-align:center` |

### 2.15 `@media (max-width:520px)`

| L | Selector | Cambia a |
|---|---|---|
| 409 | `.photo-gallery` | `grid-template-columns:1fr` |
| 828 | `form.form-narrow` | `max-width:100%` (escritorio 460px) |
| 4543 | `.sp-specs` | `grid-template-columns:1fr` |
| 4543 | `.sp-spec` | `border-right:0` |
| 5372 | `.maint-banner` | `font-size:.7rem; line-height:1.25; top:70px; left:8px; right:8px; max-width:none; padding:7px 6px 7px 11px; border-left-width:3px` |
| 5372 | `.maint-banner__x` | `font-size:1.2rem; padding:0 4px` |

### 2.16 `@media (max-width:480px)`

| L | Selector | Cambia a |
|---|---|---|
| 3775 | `.field input[type="file"]` | `font-size:13px` |
| 3775 | `.field input[type="file"]::-webkit-file-upload-button` | `padding:6px 10px` |
| 3801 | `.form-field__helper` | `flex-basis:100%` |
| 3816 | `.section__head .btn--secondary` | `max-width:100%; white-space:normal; height:auto; min-height:var(--button-normal-height); padding:10px 18px` (permite que el texto del botón se parta en 2 líneas) |
| 4643 | `.site-header__phone` | `display:none` |
| 5459 | `.team-wall` | `column-count:2; column-gap:10px` |
| 5459 | `.team-wall__item` | `margin-bottom:10px; border-radius:13px` |

### 2.17 `@media (hover:none)`

| L | Selector | Cambia a |
|---|---|---|
| 5284 | `.lead-arrow` | `opacity:1` (las flechas del slider, que en escritorio aparecen solo al hover, quedan siempre visibles en pantallas táctiles) |

### 2.18 `@media (prefers-reduced-motion:reduce)`

| L | Selector | Cambia a |
|---|---|---|
| 3393 | `.reveal` | `opacity:1; transform:none; transition:none` |
| 4023 | `.hero--slider .hero__slide.is-active` | `animation:none` |
| 4023 | `.hero--slider .hero__bg--slide` | `transition:none` |
| 6149 | `.cine-hero__bg` | `transition:opacity .01s` |
| 6149 | `.cine-hero__bg.is-active img` | `animation:none` (sin Ken-Burns `cineZoom`) |
| 6149 | `.cine-hero__h1.is-swap,.cine-hero__sub.is-swap` | `animation:none` |

---

## 3. Comportamiento por componente: escritorio → tablet → móvil

### 3.1 Cabecera, navegación, burger, dropdowns, mega menú

Markup (home.html): `header.site-header > div.container.site-header__bar > a.site-header__logo + nav.site-nav + div.site-header__cta`. Dentro de `.site-header__cta`: `.lang-switch`, `a.site-header__phone`, `a.btn.btn--primary` ("Request a Quote") y `button.burger`.

| Elemento | Escritorio (>900) | 601–900 | ≤600 / ≤480 |
|---|---|---|---|
| `.site-header` | `position:sticky; top:0; z-index:50; background:#fff` (L118); sombra `.is-scrolled` cuando `scrollY > 8` (main.js L190) | igual | igual |
| `.site-header__bar` | `height:80px` (L128–L132) — **no cambia en ningún breakpoint** | 80px | 80px |
| `.site-header__logo img` | `height:56px` (L133) | 56px | `42px` a ≤600 (L5321) |
| `.site-nav` | `display:flex; gap:24px` en línea (L136) | panel fijo bajo la cabecera: `position:fixed; top:80px; left:0; right:0; flex-direction:column; padding:16px 24px 24px; transform:translateY(-200%); transition:transform .25s ease; max-height:calc(100vh - 80px); overflow-y:auto` (L898); abierto: `.is-open{transform:none}` + sombra `0 8px 24px rgba(6,24,39,.18)` (L3782) | igual |
| `.site-nav a` | `font-weight:700; font-size:.95rem; padding:6px 0` + subrayado animado `::after scaleX` (L140–L158) | `width:100%; padding:12px 0; border-bottom:1px solid var(--color-border)` (L916) | igual |
| `.burger` | `display:none` (L165, L3683) | `display:flex` (L3694), caja `48×48px` (`--touch-target-min`), `padding:12px`, 3 `span` de `height:3px` con `gap:5px` (L3683–L3704); abierto → X (`translateY(±8px) rotate(±45deg)`) | igual |
| `.site-header__cta .btn:not(.burger)` | visible (`btn--primary`, 44px alto) | `display:none` (L919 / L3680) | oculto |
| `.site-header__phone` | píldora con texto: `padding:8px 14px; border-radius:50px; font:700 .85rem/1 'Figtree'` (L953) | círculo solo-icono: `width/height:48px; padding:0; border-radius:50%; background:rgba(26,165,133,.10); svg 20px color var(--brand-green-dark)`; `span{display:none}` (L3663–L3679). L1544 decía `display:none` pero L3663 (posterior) lo revierte | `display:none` a ≤480 (L4644) |
| `.lang-switch__label` ("EN") | `display:inline-block` (L1692) | `display:none` (L1732) → solo bandera | oculto |
| `.lang-switch__current` | `min-height:48px; padding:12px 14px` (L3711) | igual (el `padding:8px 10px` de L1734 queda anulado por L3711) | igual |
| Dropdown `.site-nav__dropdown` | flotante `position:absolute; top:calc(100%+10px); left:-20px; min-width:260px; opacity:0; visibility:hidden; transform:translateY(-6px); transition:.18s`; abre por `:hover` del grupo o `.is-open` (L980–L998) | acordeón: `position:static; display:none` (L1548); `.is-open > .site-nav__dropdown{display:block !important; background:var(--color-bg-soft); border-radius:8px; padding:6px 8px; margin:6px 0 12px}` (L3861); enlaces `min-height:44px` (L3867) | igual |
| `.site-nav__main` | `inline-flex; gap:4px` con `.site-nav__chev` ▾ que rota 180° al hover (L970–L979) | `width:100%; justify-content:space-between`; `.site-nav__chev{display:none}` y se pinta `::after{content:"▾"; margin-left:auto}` que rota 180° al abrir (L1569–L1582) | igual |
| Mega menú `.site-nav__mega` | `left:-24px; width:min(720px,calc(100vw - 48px)); display:grid; grid-template-columns:1fr 1fr .8fr; gap:6px; padding:16px` (L4551); miniaturas `58×44px` | `display:block; width:auto; padding:0; gap:0`; columna sport sin fondo; `.site-nav__mega-tools{border-left:0}`; miniaturas `46×36px`; `small` `.78rem` (L4624–L4642) | igual |
| Toque en dropdown (JS) | hover CSS | `isMobile = innerWidth <= 900 \|\| matchMedia('(pointer: coarse)').matches` → `click`/`touchend` en `.site-nav__main` hace `preventDefault` y alterna `.is-open` del grupo (cierra los demás), `aria-expanded` (main.js L264–L285) | igual |
| Cierre del panel (JS) | — | se cierra al hacer scroll >12px, al clic fuera, con Escape y al pulsar cualquier enlace que no sea `.site-nav__main` (main.js L204–L221) | igual |

Traducción a Next/Tailwind/shadcn:
- Breakpoint de colapso: 901px, como variante arbitraria (ver §11 — no se define como screen `lg`, que en Tailwind por defecto es 1024px y lo usan los primitives de shadcn). Burger: `flex min-[901px]:hidden`, CTA: `hidden min-[901px]:inline-flex`, teléfono: `hidden min-[481px]:inline-flex` + variante icono en `max-[900px]:`.
- Panel móvil: no usar `Sheet` lateral de shadcn si se quiere fidelidad; es un panel **superior** que baja (`translate-y-[-200%]` → `translate-y-0`, `duration-[250ms] ease`), `fixed top-20 inset-x-0 max-h-[calc(100vh-5rem)] overflow-y-auto`.
- Acordeón de dropdowns en móvil: `Accordion`/`Collapsible` de shadcn con estado controlado; en escritorio `NavigationMenu` (hover). El JS de Globotent decide "móvil" por `innerWidth<=900 || pointer:coarse`, replicable con un hook `useMediaQuery('(max-width:900px), (pointer:coarse)')`.

#### Orden de apilamiento (`z-index`)

No es una lista plana: varios de estos elementos están anidados dentro de `.site-header` (que ya crea su propio contexto de apilamiento por `position:sticky; z-index:50`), así que su `z-index` solo compite **dentro** de ese contexto, no contra elementos externos.

| Elemento | `z-index` | L | Contexto |
|---|---|---|---|
| `.splash` | 2000 | 3343 | raíz — por encima de todo |
| `.lightbox` | 1000 | 1060 | raíz |
| `.lang-switch__menu` | 100 | 1710 | **dentro de** `.site-header` (z-index:50) — no compite con `.lightbox`/`.splash` |
| `.exit-popup` | 100 | 2727 | raíz |
| `.site-nav__dropdown` | 80 | 994 | **dentro de** `.site-header` |
| `.site-header` | 50 | 123 | raíz — `position:sticky` |
| `.wa-fab` | 45 | 1743 | raíz |
| `.mobile-sticky-cta` | 40 | 1135 | raíz |
| `.maint-banner` | 40 | 5338 | raíz |
| `.site-nav` (panel móvil ≤900, L895–913) | *(sin declarar)* | — | hereda el contexto de `.site-header` como ancestro apilado; no define `z-index` propio |

Implicación práctica: `.wa-fab` (45) y `.mobile-sticky-cta` (40) son ambos `position:fixed` cerca del borde inferior en móvil, y el primero queda **por encima** del segundo — coherente con que `wa-fab` se eleva 92px (`bottom:92px`, §5.4) para no solaparse. `.lang-switch__menu` y `.site-nav__dropdown`, aunque parezcan "altos" (100/80), nunca tapan `.lightbox` ni `.exit-popup` porque están contenidos en el contexto de `.site-header`, no en la raíz.

### 3.2 `cine-hero` (home; 1 página)

| Propiedad | Escritorio (>760) | Móvil (≤760, L6128) |
|---|---|---|
| `.cine-hero` `min-height` | `min(calc(100svh - 80px),780px)` (L5980) — descuenta la cabecera de 80px | `min(92svh,700px)` |
| `.cine-hero__inner` padding vertical | `padding-top:clamp(40px,7vh,84px); padding-bottom:clamp(24px,4vh,46px)` (L6019) | `padding-top:clamp(60px,12vh,110px)` |
| `.cine-hero__h1` | `clamp(2.1rem,5.1vw,4rem); line-height:1.03; max-width:17ch` (L6051) | `clamp(1.95rem,8.4vw,2.7rem); max-width:none` |
| `.cine-hero__sub` | `clamp(1.02rem,1.45vw,1.2rem); max-width:56ch` (L6059) | `1rem` |
| `.cine-hero__actions .btn` | `flex-wrap:wrap; gap:14px` en línea | `flex:1 1 100%; justify-content:center` → apilados a ancho completo |
| `.cine-hero__tabs` / `.cine-tab` | fila de pestañas `flex:1 1 0; padding:18px 6px 0` con `border-top` (L6083–L6102) | `flex-wrap:wrap`; `.cine-tab{flex:1 1 42%; padding:13px 6px 0}` → 2 por fila; `.cine-tab__name{font-size:.85rem}` |
| Fondo | `<picture>` con `srcset` 800/1200/1920w y `sizes="100vw"`; `object-fit:cover` (L5994); Ken-Burns `cineZoom 8s` | igual; sin animación con `prefers-reduced-motion` |
| Alineación | `align-items:flex-end` (contenido abajo) | igual |

Traducción: `min-h-[min(calc(100svh-5rem),780px)] max-[760px]:min-h-[min(92svh,700px)]`, `text-[clamp(2.1rem,5.1vw,4rem)] max-[760px]:text-[clamp(1.95rem,8.4vw,2.7rem)]`, botones `max-[760px]:flex-[1_1_100%]`, tabs `max-[760px]:flex-wrap max-[760px]:[&>button]:basis-[42%]` (breakpoint exacto del cine-hero, L6128, no el 768 aproximado). `next/image` con `sizes="100vw"` y `priority` en el primer fondo (Globotent usa `fetchpriority="high"` solo en el primero, `loading="lazy"` en el resto).

### 3.3 `page-hero` (76 páginas interiores)

| Propiedad | Todos los anchos |
|---|---|
| `.page-hero` | `min-height:320px; display:flex; align-items:flex-end; background:#061827; overflow:hidden` (L231–L239) |
| `.page-hero__inner` | `padding-top:64px; padding-bottom:48px; width:100%` (L250) |
| `.page-hero h1` | hereda `h1{font-size:clamp(2rem,4.2vw,3.6rem)}` (L58); `margin:0` |
| `.page-hero--calc` | `min-height:280px` (L1158) |
| Fondo | `.page-hero__bg{background-size:cover; background-position:center}` + degradado `180deg rgba(6,24,39,.45)→.8` |

**No hay ninguna `@media` para `.page-hero`**: la única adaptación es el `clamp()` del `h1` (32px→57.6px entre 762px y 1371px de ancho). `.breadcrumbs a` tiene `min-height:44px` (L3877) para el toque.

### 3.4 `hero` legado y `hero--slider`

Están en el CSS (L185–L230, L3960–L4028) pero **ninguna página del espejo usa `class="hero`**. Sus reglas: `min-height:620px` → `480px` a ≤900; `.hero__inner` padding 96px → 64px; `.hero h1` → `clamp(1.8rem,7vw,2.6rem)` a ≤900; `.hero__sub` 1.15rem → 1rem; `.hero__dot` 40px → 32px a ≤720. Se documentan por si se reutiliza el patrón, pero no influyen en el sitio actual.

### 3.5 `world-hero` / `world-panel` (paneles Industria/Sport)

**No aparece en ninguna de las 78 páginas del espejo** (grep `world-hero`, `world-panel` = 0). Reglas por si se adopta el patrón:

| Propiedad | Escritorio (>820) | ≤820 (L4167 / L5010) |
|---|---|---|
| `.world-hero__split` | `display:flex; gap:14px; padding:0 14px 16px; max-width:1480px` (L4090) | `flex-direction:column; gap:12px` |
| `.world-panel` | `flex:1 1 0; min-height:470px; border-radius:20px; transition:flex-grow .55s cubic-bezier(.2,.7,.3,1)` (L4096) | `min-height:340px` |
| `.world-panel--sport` | `min-height:520px` | `min-height:400px` |
| `.world-panel__inner` | `padding:30px 34px 36px` | (variante split) `padding:28px 24px 32px` |
| `.world-panel__inner h2` | `clamp(1.5rem,2.7vw,2.15rem)` | (split) `clamp(1.8rem,7vw,2.3rem)` |
| Variante `.world-hero--split .world-hero__split` | `min-height:calc(100svh - 80px)` (L4964, con fallback `100vh` en L4963); paneles `border-radius:0; align-items:center`; `.world-panel__inner{max-width:560px; padding:clamp(32px,4vw,72px)}`; h2 `clamp(2.1rem,3.7vw,3.5rem)` | `min-height:0; flex-direction:column`; `.world-panel{min-height:54svh; align-items:flex-end}`; línea lima pasa de `inset 5px 0 0 -2px` a `inset 0 5px 0 -2px` |

### 3.6 `sp-*` (layout de `.sp-hero`/`.sp-disciplines`/`.sp-specs`/`.sp-cta`/`.sp-video`: 1 página, `site/pages/sport.html`; pero la tipografía "Clash Display" que declaran alcanza 14 páginas — ver nota tipográfica)

| Componente | Escritorio | ≤1000 | ≤820 | ≤520 |
|---|---|---|---|---|
| `.sp-hero` | `min-height:84vh; align-items:center; border-bottom:1px solid #000` (L4257); `.sp-hero__inner{padding:88px 20px}` | igual | igual (sin media) | igual |
| `.sp-hero__lockup img` | `height:clamp(64px,9vw,104px)` (L4285) | fluido | fluido | 64px |
| `.sp-hero__h1` | `clamp(2.6rem,7vw,5.4rem); line-height:.98; uppercase` (L4289) | fluido | fluido | 41.6px |
| `.sp-claim p` | `clamp(1.05rem,2.4vw,1.7rem)` (L4321) | | | 16.8px |
| `.sp-section` | `padding:78px 0` (L4327) — **sin media** | | | 78px |
| `.sp-disciplines` | `repeat(4,1fr); gap:18px` (L4362) | `repeat(2,1fr)` (L4364) | `1fr` (L4531) | 1fr |
| `.sp-specs` | `repeat(4,1fr)`; `.sp-spec{padding:34px 26px; border-right:1px solid #000}` (L4416–L4424) | 4 | `1fr 1fr`; pares sin `border-right`; `border-bottom:1px solid #000` salvo el último (L4531) | `1fr`; `border-right:0` (L4543) |
| `.sp-cta` | `padding:70px 0`; h2 `clamp(1.8rem,4vw,3rem)` | | | |
| `.sp-video` | `min-height:70vh; align-items:flex-end`; `.sp-video__inner{padding:60px 20px}`; h2 `clamp(1.8rem,4vw,3rem)` | | | |

Nota tipográfica: `'Clash Display'` se declara en **7** sitios del CSS, no 4, y **no hay `@font-face` ni `<link>`** para esa fuente en ningún HTML del espejo → cae a Figtree en los 7 casos, en todos los anchos:

| L | Selector | Activado por | Alcance real en el espejo |
|---|---|---|---|
| 4163 | `.world-panel__h2--sport` | clase `.world-panel` | **inactivo**: `world-panel`/`world-hero` no aparece en ninguna de las 78 páginas (ver §3.5) |
| 4216 | `.world-block--sport .world-block__head h3` | `<div class="world-block world-block--sport sport-world">…<div class="world-block__head">` | activo en `home.html` L254–255 (y en `pages/produkte.html`, que usa el mismo bloque) aunque su `<body>` no lleve `sport-world` |
| 4240 | `.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1` | clase `sport-world` en `<body>` | 14 páginas (ver tabla siguiente) |
| 4318, 4395, 4428, 4464 | `.sp-claim p`/`.sp-disc__body h3`/`.sp-spec__num`/`.sp-cta h2` | layout `sp-*` | solo `sport.html` (h1 usa `.sp-hero__h1`, que hereda de L4240 vía `.sport-world`) |

`body.sport-world` aparece en **14 páginas**, no solo en `sport.html`: `pages/sport.html`, `categories/padel-tennis-covers.html`, `categories/pickleball.html`, `categories/riding-arena-covers.html`, `products/padel-tennis-cover.html`, `products/pickleball-1-court.html`, `products/pickleball-2-courts.html`, `products/riding-arena-cover-{14x14,20x20,20x30,20x40,20x60,20x80,25x45}.html`. En todas ellas, todos los `h1`/`h2`/`h3`/`.padel-h1` caen a Figtree por el `@font-face` que falta — relevante para Pavivasa si replica una sección de pádel.

### 3.7 Secciones y CTA

| Selector | Escritorio | ≤900 | ≤560 |
|---|---|---|---|
| `.section` | `padding:72px 0` (L269) | 72px | `48px 0` (L1626) |
| `.section--tight` | `padding:48px 0` (L271) | 48px | `32px 0` (L1628) |
| `.section__head` | `text-align:center; max-width:720px; margin:0 auto 48px` (L453) — sin media | | |
| `.section__head .btn--secondary` | `height:44px; white-space:nowrap` | | ≤480: `max-width:100%; white-space:normal; height:auto; min-height:44px; padding:10px 18px` (L3817) |
| `.cta-band` | `padding:56px; border-radius:12px; text-align:center` (L740) | `padding:40px 24px` (L939) | `padding:32px 20px`; `h2{font-size:1.4rem}` (L1630) |
| `main` | sin padding | `padding-bottom:84px` (L1592, pensado para `.mobile-sticky-cta`, que **no existe en el HTML**; el hueco se aplica igualmente) | igual |
| `h1` / `h2` globales | `clamp(2rem,4.2vw,3.6rem)` / `clamp(1.6rem,2.8vw,2.4rem)` (L58, L61) | fluido | 32px / 25.6px |
| `h3` | `1.25rem` fijo (L63) | | |
| `.home-montage__inner` | `padding:clamp(48px,8vw,96px) 24px; max-width:688px`; h2 `clamp(1.8rem,3.5vw,2.8rem)` (L5406) | fluido | 48px / 28.8px |
| `.team-section` | `padding-bottom:clamp(48px,7vw,88px)` (L5420) | | 48px |

### 3.8 Rejillas de tarjetas (columnas por breakpoint)

Todas usan `display:grid` + `grid-template-columns:repeat(n,1fr)`; el `gap` solo cambia donde se indica.

| Rejilla (páginas que la usan) | Escritorio | 1100 | 1000 | 900 | 880 | 820 | 780/768/760 | 720/700 | 560 | 520/480 | gap |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `.product-grid` (7 pág.) | 4 | 3 | | 2 | | | | | 1 | | 24px |
| `.features` (6) | 4 | 2 | | | | | | | 1 | | 24px |
| `.collections` (0) | 2 | | | 1 | | | | | | | 24px |
| `.kategorien` (9) | 2 | | | | | | | 1 (≤720) | | | 24px |
| `.kategorien--center` | `minmax(0,1fr)` con `max-width:calc(50% - 12px)` centrado | | | | | | | 1, `max-width:none` | | | |
| `.testimonials` (1) | 3 | | | 1 | | | | | | | 24px |
| `.case-grid` (1, home) | 3 | 2 | | | | | | | 1 | | 24px |
| `.reviews-grid` (2) | 3 | 2 | | | | | | | 1 | | 20px |
| `.trust-bar__grid` (1) | 4 | | | 2 (gap 20) | | | | | 1 | | 24→20px |
| `.calc-grid` (1) | 3 | 2 | | | | | | | 1 | | 24px |
| `.blog-grid` (0) | 3 | | | 2 | | | | | 1 | | 24px |
| `.blog-related-grid` (0) | 3 | | | 1 | | | | | | | 16px |
| `.team-grid` (0) | 4 | | | 2 | | | | | 1 | | 20px |
| `.cert-grid` (0) | 3 | | | 2 | | | | | 1 | | 16px |
| `.video-testi-grid` (0) | 3 | | | 2 | | | | | 1 | | 20px |
| `.photo-gallery` (0) | 3 (gap 20) | | | | 2 (gap 14) | | | | | 1 (≤520) | |
| `.sp-disciplines` (1) | 4 | | 2 | | | 1 | | | | | 18px |
| `.sp-specs` (1) | 4 | | | | | 2 | | | | 1 (≤520) | 0 (bordes) |
| `.choose-cards` (0) | 2, `max-width:1080px`, gap `clamp(16px,2.5vw,28px)` | | | | | | 1, `max-width:460px` (≤760) | | | | |
| `.jobs-values` / `.jobs-grid` (1) | 3 | | | 1 | | | | | | | 22 / 24px |
| `.job-meta` (3) | 4 (gap 1px, bordes) | | | 2 | | | | 1 (≤680) | | | |
| `.job-cols` (3) | 3 (gap 30) | | | 1 (gap 24) | | | | | | | |
| `.job-others` (3) | 2 | | | 1 | | | | | | | 16px |
| `.how-steps` (0) | 3 | | | | | | | 1 (≤700) | | | 24px |
| `.download-grid` (0) | 2 | | | | | | | 1 (≤700) | | | 20px |
| `.co2-calc` (0) | 2 | | | | | | | 1 (≤700) | | | 24px |
| `.quiz__options` (0) | 2 | | | | | | | 1 (≤700) | | | 12px |
| `.compare-slots` (0) | 3 | | | 1 | | | flex column (≤768) | | | | 16px |
| `.step-grid` (0) | (sin base grid en CSS) | | | | | | 1 col + `order` 1/2/3 (≤768) | | | | 14px |
| `.team-wall` (1, home; `column-count`) | 3 col, `column-gap:14px` | | | 2 | | | | | | 2, gap 10px (≤480) | |
| `.case-body` (0) | 3 | 1 | | | | | | | | | 24px |
| `.case-hero` (0) | 2 (gap 48) | 1 | | | | | | | | | |
| `.case-stats` (0) | 2 | | | | | | | | 1 | | 12px |
| `.case-gallery` (0) | 3 | | | | | | | | 2 | | 14px |
| `.rating-summary` (0) | `240px 1fr` (gap 48) | 1, gap 24, centrado | | | | | | | | | |
| `.gallery__thumbs` (0) | 5 | | | | | | | | 4 | | 10px |
| `.product-info__stats` (0) | 2 | | | 2 (`1fr 1fr`) | | | | | | | 12px |
| `.field-row` (0) | 3 (gap 10) | | | | | | | | 3 (gap 6) | | |
| `.heu-animal-grid` (0) | 2 | | | | | | | | 1 | | 8px |
| `.color-picker` (0) | 3 | | | | | | | | 2 | | 8px |
| `.lead-hero__grid` (0) | `1.04fr 1fr`, gap `clamp(24px,4vw,56px)` | | | | | `minmax(0,1fr)` | | | | | |
| `.agro-feature__grid` (0) | `1fr 1.05fr`, gap `clamp(28px,5vw,64px)` | | | | (≤860) 1, gap 30, vídeo primero | | | | | | |
| `.padel-detail__grid` (0) | (base no localizada en CSS) | | | | | | 1, gap 32 (≤780) | | | | |
| `.padel-size-layout` (0) | `1.1fr 1fr` (gap 40) | | | | | | 1, gap 22 (≤760) | | | | |

"(0)" = está en el CSS pero no en ninguna página del espejo. `.world-block--sport .kategorien .collection-card:last-child:nth-child(odd)` ocupa `grid-column:1/-1; width:calc(50% - 12px)` centrado en escritorio y `width:100%` a ≤760 (L4225–L4231).

### 3.9 Tarjetas: `product-card`, `case-card`, `review`, `rating-badge`

| Tarjeta | Escritorio | Cambios responsive |
|---|---|---|
| `.product-card` | `border:1px solid var(--color-border); border-radius:var(--radius)` (12px); `.product-card__media{aspect-ratio:4/3}`; `.product-card__body{padding:20px}`; título `1.05rem; min-height:2.6em` (L588–L638) | ≤560: `border-radius:10px` (L1624). Tilt 3D por `mousemove` desactivado si `pointer: coarse` (main.js L19). Sin cambios de padding |
| `.case-card` | `.case-card__media{aspect-ratio:4/3}`; `.case-card__body{padding:22px; gap:10px}` (L2080–L2145) | **ninguna `@media` propia**; solo cambia la rejilla |
| `.review` | `padding:22px; gap:14px` (L1984) | ninguna propia; `.reviews-head` pasa a columna a ≤560 (L2338) |
| `.rating-badge` / `--compact` | `padding:10px 18px` / `8px 14px` (L1936, L1962) → después L3719 `min-height:48px; padding:10px 16px` para ambos | sin media |
| `.collection-card` | `aspect-ratio:16/10; border-radius:12px`; label `left/right:24px; bottom:20px`; h3 `1.6rem` (L547–L582) | ninguna propia |
| `.sp-disc` | `border:1px solid #000; border-radius:16px`; media 4/3; body `padding:24px`; h3 1.5rem (L4370–L4410) | ninguna propia |
| `.jobcard` | `border-radius:20px; padding:28px 26px 24px` (L5538) | ninguna propia |

### 3.10 `press-strip` (home)

| Propiedad | Escritorio | ≤700 (L3505) |
|---|---|---|
| `.press-strip` | `padding:28px 0; background:var(--color-bg-soft); overflow:hidden; width:100%` (L3464, L3615); además `overflow-x:clip; max-width:100%` (L4652) | igual |
| `.press-strip .container` | `display:flex; align-items:center; gap:32px; overflow:hidden` (L3468, L3618) | `flex-direction:column; align-items:flex-start; gap:14px` |
| `.press-strip__logos` | `display:flex; gap:40px; width:max-content; flex:0 0 auto; mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent); animation:press-scroll 40s linear infinite` (L3479, L3620); `:hover{animation-play-state:paused}` (L3624); keyframes `translateX(0)→translateX(-50%)` (L3499) — requiere duplicar los logos (home tiene 14 `.press-item`) | igual velocidad (no hay ajuste móvil) |
| `.press-strip__label` | `white-space:nowrap; font-size:.78rem; uppercase` | encima de la cinta |

Sin regla para `prefers-reduced-motion` en la cinta: **no está en el código**.

### 3.11 Footer

| Propiedad | Escritorio | ≤900 | ≤560 |
|---|---|---|---|
| `.site-footer` | `padding:64px 0 24px; margin-top:80px` (L767) → `padding-bottom:96px` (L3603) → `padding-right:80px; padding-bottom:96px` (L3841; deja hueco al `wa-fab`) | igual | `padding-right:24px; padding-bottom:96px` (L3845) |
| `.site-footer__grid` | `1.4fr 1fr 1fr 1fr; gap:40px; margin-bottom:48px` (L772) | `1fr 1fr` (L930) | `1fr` (L947) |
| `.site-footer__grid a` | `display:inline-flex; min-height:44px; padding:6px 0` (L3827) → `min-width:48px; padding:6px 12px 6px 0` (L3882) | igual | igual |
| `.site-footer__bottom` | `display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:.85rem` (L794) — envuelve solo | | |
| `.site-footer__bottom a[href^="tel:"], …mailto` | `min-height:44px; padding:4px 8px; margin:0 -8px; underline` (L3893) | | |
| `.site-footer__logo img` | `height:52px` (L790) — sin media | | |

### 3.12 Formularios

| Selector | Escritorio | ≤900 | ≤768 | ≤520/480 |
|---|---|---|---|---|
| `.form-grid` (4 pág.) | `1fr 1fr; gap:20px; max-width:720px; margin:0 auto` (L815); `.full{grid-column:1/-1}` | `1fr` (L932) | `1fr; gap:24px; max-width:100%` (L3586) | |
| `form.form-narrow` (0) | `1fr; max-width:460px` (L824) | | | ≤520 `max-width:100%` (L829) |
| `.contact-grid` (contact.html) | `max-width:880px; 1fr 1fr; gap:48px` (L3734) | | `1fr; gap:32px`; hijos `min-width:0; max-width:100%` (L3741) | |
| `.field input/select/textarea` | `width:100%; padding:12px 14px; border-radius:10px; font-size:16px` (L844) — **16px evita el zoom de iOS**; `max-width:100%; box-sizing:border-box` (L3755) | | | `input[type=file]{font-size:13px}`; botón de subida `padding:6px 10px` (≤480, L3776) |
| `.field textarea` | `min-height:140px; resize:vertical` | | | |
| `.form-field__helper` | en línea con la etiqueta | | | ≤480 `flex-basis:100%` (L3802) |
| `.form-expand-btn` | `min-height:44px; padding:12px 16px` (L3890) | | | |
| `.field-row` (0) | 3 col gap 10 | | | ≤560 3 col gap 6, label .75rem |
| `.chip` (0) | `min-height:48px; padding:10px 16px` (L3714) | | | ≤560 L1620 `padding:8px 10px; font-size:.78rem` → el padding queda anulado por L3714 (posterior), la fuente sí se reduce |

### 3.13 Tablas

Solo hay una tabla estilizada, `.padel-sizes` (L339–L367), y **no se usa en ninguna página del espejo**:

| Propiedad | Escritorio | ≤780 | ≤760 (dentro de `.padel-size-layout`) |
|---|---|---|---|
| `.padel-sizes` | `width:100%; border-collapse:collapse; border:1px solid var(--color-border); border-radius:12px; overflow:hidden`; `th{padding:14px 18px; font-size:.82rem; uppercase}`; `td{padding:14px 18px; font-size:.95rem}` | 3.ª columna oculta: `th:nth-child(3),td:nth-child(3){display:none}` (L369) | última columna oculta (L4851) |
| `.padel-sizes-wrap` | `overflow-x:auto; -webkit-overflow-scrolling:touch` (L4841) — scroll horizontal como red de seguridad | | |
| `.compare-specs` (dl) | `grid-template-columns:auto 1fr; gap:6px 12px` (L3191) | | ≤768 `margin:8px 0 0`; `dt .85rem`, `dd .95rem` (L3638) |

Estrategia: **ocultar columnas secundarias** por breakpoint + envoltorio con `overflow-x:auto`. No hay tablas con `display:block`/apilado.

### 3.14 `filter-bar`

En el CSS (L4655–L4703) y en `main.js` (L681–L704, `[data-filter-bar]` + `[data-filter-grid]` con `.filter-pill[data-w]` que filtra `.product-card[data-w]`), pero **no hay ninguna página en el espejo con `filter-bar`**.

| Propiedad | Escritorio | ≤560 (L4699) |
|---|---|---|
| `.filter-bar` | `display:flex; flex-wrap:wrap; align-items:center; gap:14px; padding:16px 18px; border-radius:14px; background:#fafafa` | `gap:10px` |
| `.filter-bar__pills` | `flex; flex-wrap:wrap; gap:8px` | igual |
| `.filter-pill` | `padding:8px 16px; border-radius:50px; font-size:.85rem` (≈35px alto; **por debajo de 48px**) | igual |
| `.filter-bar__count` | `margin-left:auto; white-space:nowrap` | `margin-left:0; width:100%` (pasa a su propia línea) |

### 3.15 `lead-hero`, `choose-hero`, `agro-feature`, `maint-banner`

Todos en CSS, **ninguno en el HTML del espejo**. Ver §2.6 (820), §2.13 (600), §2.5 (860), §2.15 (520) para los cambios literales. Resumen:
- `.lead-hero`: 2 columnas `1.04fr 1fr` con mosaico de tiles de `height:clamp(400px,46vw,520px)` → ≤820 una columna, tiles `height:230px`; ≤600 h1 `1.7rem` con `hyphens:auto`.
- `.choose-cards`: 2 → 1 (≤760) con `max-width:460px`.
- `.agro-feature__grid`: 2 → 1 (≤860), el vídeo se reordena arriba (`order:1`), botón play 62px.
- `.maint-banner`: `position:fixed; top:92px; left:12px; max-width:min(92vw,400px)` → ≤520 `top:70px; left/right:8px; font-size:.7rem`.

### 3.16 Ficha de producto: `product-detail`, `gallery`, `lightbox` (36 páginas)

| Propiedad | Escritorio | ≤900 | ≤560 |
|---|---|---|---|
| `.product-detail` | `grid-template-columns:1.2fr 1fr; gap:56px; align-items:flex-start` (L639) | `1fr` (L924) | |
| `.gallery__main` | `aspect-ratio:4/3; border-radius:12px; cursor:zoom-in` + lupa `44×44px` en esquina (L643, L1108) | | |
| `.gallery__thumbs` | 5 col gap 10 (L654); `.gallery__thumb{aspect-ratio:1/1; border:2px solid transparent}` | | 4 col (L949) |
| `.product-info h1` | `clamp(1.8rem,2.6vw,2.4rem)` (L672) | | 28.8px |
| `.product-info__stats` | 2 col gap 12 (L1035) | `1fr 1fr` (L1588) | |
| `.lightbox` | `position:fixed; inset:0; padding:48px; z-index:1000` (L1053); `__close 48×48`, `__nav 56×56 font 32px`, offsets 24px | `padding:16px`; `__nav 44×44 font 26px`; offsets 8px (L1598–L1608) | |
| Swipe | `touchstart/touchend` en `.lightbox__img` y en `[data-gallery-main]` (main.js L327–L330, L583–L586) | | |
| `body.is-product-detail .wa-fab` | `display:none` (L3609) — sin botón de WhatsApp en fichas | | |

### 3.17 Flotantes: `wa-fab`, `mobile-sticky-cta`, `exit-popup`

| Elemento | Escritorio | ≤900 | ≤560 |
|---|---|---|---|
| `.wa-fab` (78 pág.) | `position:fixed; bottom:24px; right:24px; z-index:45; padding:12px 18px; border-radius:50px; background:#25D366; font-size:.88rem uppercase`; svg `22px` (L1739–L1766); se oculta (`.is-hidden{opacity:0; translateY(20px)}`) cuando el footer entra en viewport (`IntersectionObserver threshold .05`, main.js L370–L376) | igual | `bottom:92px; padding:12px; font-size:0`; `span{display:none}`; svg `26×26px` → botón circular de ~50px solo-icono, subido 92px (hueco para la sticky CTA) (L1767) |
| `.mobile-sticky-cta` (0 pág.) | `display:none` (L1130) | `display:flex; position:fixed; bottom:0; padding:12px 16px; gap:12px; box-shadow:0 -4px 20px…` (L1590); `.btn{flex:1}`; `__call 56×56 circular lima` (L1144) | igual |
| `.exit-popup` (78 pág.) | `position:fixed; inset:0; padding:20px; z-index:100`; caja `max-width:520px; padding:40px 32px` (L2725–L2752) | **JS lo desactiva** si `isTouchDevice` o si no se cumple `matchMedia('(min-width:901px)')` (main.js L345–L351) → nunca aparece en ≤900 ni en táctil | — |
| `.maint-banner` (0 pág.) | ver §3.15 | | |

---

## 4. Tipografía y espaciado fluidos: todos los `clamp()`

44 apariciones. "Rango" = valor mínimo → máximo en px (1rem = 16px). "Viewport" = anchura (o altura para `vh`) en la que se alcanza el mínimo → el máximo, calculada como `min·100/vw` y `max·100/vw`.

| L | Selector | Propiedad | Expresión | Rango px | Viewport mín → máx |
|---|---|---|---|---|---|
| 58 | `h1` | font-size | `clamp(2rem,4.2vw,3.6rem)` | 32 → 57.6 | 762 → 1371 px |
| 61 | `h2` | font-size | `clamp(1.6rem,2.8vw,2.4rem)` | 25.6 → 38.4 | 914 → 1371 |
| 317 | `.padel-h1` | font-size | `clamp(2.6rem,5.4vw,4.6rem)` | 41.6 → 73.6 | 770 → 1363 |
| 323 | `.padel-h1__sub` | font-size | `clamp(1.4rem,2.4vw,2rem)` | 22.4 → 32 | 933 → 1333 |
| 672 | `.product-info h1` | font-size | `clamp(1.8rem,2.6vw,2.4rem)` | 28.8 → 38.4 | 1108 → 1477 |
| 1595 | `.hero h1` (≤900) | font-size | `clamp(1.8rem,7vw,2.6rem)` | 28.8 → 41.6 | 411 → 594 |
| 2166 | `.case-hero h1` | font-size | `clamp(1.8rem,3.5vw,2.8rem)` | 28.8 → 44.8 | 823 → 1280 |
| 3289 | `.three-d-cta__text h2` | font-size | `clamp(1.6rem,3vw,2.2rem)` | 25.6 → 35.2 | 853 → 1173 |
| 4076 | `.world-hero__intro h1` | font-size | `clamp(2rem,4.6vw,3.3rem)` | 32 → 52.8 | 696 → 1148 |
| 4143 | `.world-panel__inner h2` | font-size | `clamp(1.5rem,2.7vw,2.15rem)` | 24 → 34.4 | 889 → 1274 |
| 4285 | `.sp-hero__lockup img` | height | `clamp(64px,9vw,104px)` | 64 → 104 | 711 → 1156 |
| 4289 | `.sp-hero__h1` | font-size | `clamp(2.6rem,7vw,5.4rem)` | 41.6 → 86.4 | 594 → 1234 |
| 4321 | `.sp-claim p` | font-size | `clamp(1.05rem,2.4vw,1.7rem)` | 16.8 → 27.2 | 700 → 1133 |
| 4351 | `.sp-head h2` | font-size | `clamp(1.8rem,3.6vw,2.8rem)` | 28.8 → 44.8 | 800 → 1244 |
| 4467 | `.sp-cta h2` | font-size | `clamp(1.8rem,4vw,3rem)` | 28.8 → 48 | 720 → 1200 |
| 4523 | `.sp-video__inner h2` | font-size | `clamp(1.8rem,4vw,3rem)` | 28.8 → 48 | 720 → 1200 |
| 4977 | `.world-hero--split .world-panel__inner` | padding | `clamp(32px,4vw,72px)` | 32 → 72 | 800 → 1800 |
| 4983 | `.world-hero--split .world-panel__inner h2` | font-size | `clamp(2.1rem,3.7vw,3.5rem)` | 33.6 → 56 | 908 → 1514 |
| 5020 | idem (≤820) | font-size | `clamp(1.8rem,7vw,2.3rem)` | 28.8 → 36.8 | 411 → 526 |
| 5027 | `.choose-hero` | padding-block | `clamp(40px,6vw,80px)` | 40 → 80 | 667 → 1333 |
| 5031 | `.choose-hero__head` | margin-bottom | `clamp(28px,4vw,48px)` | 28 → 48 | 700 → 1200 |
| 5041 | `.choose-hero__title` | font-size | `clamp(1.9rem,3.6vw,2.9rem)` | 30.4 → 46.4 | 844 → 1289 |
| 5059 | `.choose-cards` | gap | `clamp(16px,2.5vw,28px)` | 16 → 28 | 640 → 1120 |
| 5088 | `.choose-card__body` | padding | `clamp(20px,2.4vw,30px)` | 20 → 30 | 833 → 1250 |
| 5098 | `.choose-card__body h2` | font-size | `clamp(1.35rem,2vw,1.75rem)` | 21.6 → 28 | 1080 → 1400 |
| 5128 | `.lead-hero` | padding-block | `clamp(32px,5vw,68px)` | 32 → 68 | 640 → 1360 |
| 5132 | `.lead-hero__grid` | gap | `clamp(24px,4vw,56px)` | 24 → 56 | 600 → 1400 |
| 5143 | `.lead-hero__text h1` | font-size | `clamp(2rem,4vw,3.4rem)` | 32 → 54.4 | 800 → 1360 |
| 5161 | `.lead-hero__tiles` | height | `clamp(400px,46vw,520px)` | 400 → 520 | 870 → 1130 |
| 5205 | `.lead-slide__label` | font-size | `clamp(1.05rem,1.5vw,1.35rem)` | 16.8 → 21.6 | 1120 → 1440 |
| 5406 | `.home-montage__inner` | padding-block | `clamp(48px,8vw,96px)` | 48 → 96 | 600 → 1200 |
| 5410 | `.home-montage__inner h2` | font-size | `clamp(1.8rem,3.5vw,2.8rem)` | 28.8 → 44.8 | 823 → 1280 |
| 5420 | `.team-section` | padding-bottom | `clamp(48px,7vw,88px)` | 48 → 88 | 686 → 1257 |
| 5428 | `.team-wall` | margin-top | `clamp(24px,4vw,40px)` | 24 → 40 | 600 → 1000 |
| 5861 | `.agro-feature__grid` | gap | `clamp(28px,5vw,64px)` | 28 → 64 | 560 → 1280 |
| 5863 | `.agro-feature__grid` | padding-block | `clamp(48px,8vw,104px)` | 48 → 104 | 600 → 1300 |
| 5881 | `.agro-feature__intro h2` | font-size | `clamp(1.7rem,3.2vw,2.5rem)` | 27.2 → 40 | 850 → 1250 |
| 6019 | `.cine-hero__inner` | padding-top | `clamp(40px,7vh,84px)` | 40 → 84 | **alto** 571 → 1200 |
| 6020 | `.cine-hero__inner` | padding-bottom | `clamp(24px,4vh,46px)` | 24 → 46 | **alto** 600 → 1150 |
| 6051 | `.cine-hero__h1` | font-size | `clamp(2.1rem,5.1vw,4rem)` | 33.6 → 64 | 659 → 1255 |
| 6059 | `.cine-hero__sub` | font-size | `clamp(1.02rem,1.45vw,1.2rem)` | 16.32 → 19.2 | 1126 → 1324 |
| 6107 | `.cine-tab__name` | font-size | `clamp(.9rem,1.25vw,1.06rem)` | 14.4 → 16.96 | 1152 → 1357 |
| 6132 | `.cine-hero__inner` (≤760) | padding-top | `clamp(60px,12vh,110px)` | 60 → 110 | **alto** 500 → 917 |
| 6134 | `.cine-hero__h1` (≤760) | font-size | `clamp(1.95rem,8.4vw,2.7rem)` | 31.2 → 43.2 | 371 → 514 |

Otras funciones de viewport (no `clamp`): `.site-nav__mega{width:min(720px,calc(100vw - 48px))}` (L4553), `.maint-banner{max-width:min(92vw,400px)}` (L5342), `.agro-feature__logo{max-width:min(280px,70%)}` (L5875), `.cine-hero{min-height:min(calc(100svh - 80px),780px)}` (L5980), `.sp-hero{min-height:84vh}` (L4259), `.sp-video{min-height:70vh}`, `.world-hero--split .world-hero__split{min-height:calc(100svh - 80px)}` (L4964), `.world-hero--split .world-panel{min-height:54svh}` (L5015), `.site-nav{max-height:calc(100vh - 80px)}` (L911).

Patrón de diseño: el texto de sección (`h2` global) es fluido entre 914 y 1371px; los heros cambian de `clamp` en su breakpoint móvil por otro con **pendiente mucho mayor** (7–8.4vw) para que el titular llene el ancho del teléfono.

Traducción: en `tailwind.config` `theme.extend.fontSize` con tokens `'display': 'clamp(2.1rem,5.1vw,4rem)'`, `'h1': 'clamp(2rem,4.2vw,3.6rem)'`, `'h2': 'clamp(1.6rem,2.8vw,2.4rem)'`, etc., o valores arbitrarios `text-[clamp(...)]`. `svh` está en Tailwind 3.4 (`min-h-svh`); para `calc(100svh-80px)` usar `min-h-[calc(100svh-5rem)]`.

---

## 5. Táctil

### 5.1 Objetivo mínimo 48px (`--touch-target-min`)

Declarado en un **segundo** `:root` (L3583–L3584: `:root{--touch-target-min:48px}`), fuera del bloque de tokens inicial. Consumidores (todos sin media, es decir, también en escritorio):

| Selector | Regla | L |
|---|---|---|
| `.site-header__phone` (≤900) | `width/height:var(--touch-target-min)` | 3665 |
| `.burger` | `width/height:var(--touch-target-min); padding:12px` | 3684 |
| `.lang-switch__current` | `min-height:var(--touch-target-min); padding:12px 14px` | 3711 |
| `.chip` | `min-height:var(--touch-target-min); padding:10px 16px` | 3714 |
| `.color-chip` | `min-height:var(--touch-target-min)` | 3717 |
| `.rating-badge,.rating-badge--compact` | `min-height:var(--touch-target-min); padding:10px 16px; inline-flex` | 3719 |
| `.site-header a, .site-header button:not(.burger)` | `min-height:var(--touch-target-min); display:inline-flex; align-items:center` | 3725 |
| `.site-nav__main` | `min-height:var(--touch-target-min)` | 3729 |
| `.exit-popup__close` | `width/height:var(--touch-target-min)` (antes 36px, L2757) | 3732 |
| `.btn` | `min-height:var(--touch-target-min); box-sizing:border-box` | 3836 |
| `.mobile-sticky-cta__call` | `min-width/min-height:var(--touch-target-min)` | 3839 |

Otros mínimos de 44px (literal, no variable): `.site-footer__grid a{min-height:44px}` (L3827), `.breadcrumbs a{min-height:44px; padding:6px 4px}` (L3877), `.feature__more summary,.faq-item summary,details>summary{min-height:44px}` (L3884), `.form-expand-btn{min-height:44px}` (L3890), `.site-footer__bottom a[href^="tel:"], [href^="mailto:"]{min-height:44px; padding:4px 8px; margin:0 -8px}` (L3893), `.site-nav__group.has-dropdown.is-open>.site-nav__dropdown a{min-height:44px}` (L3867), `.lightbox__nav` 44px en ≤900 (L1600), lupa de galería 44px (L1113).

Consecuencia sobre `.btn`: la altura declarada `height:var(--button-normal-height)` = 44px (L76) queda **elevada a 48px** por `min-height:48px` (L3836). `.btn--lg` = 56px (`--button-large-height`). En móvil no hay una regla que cambie alturas de botón; solo `.section__head .btn--secondary` a ≤480 permite `height:auto; white-space:normal` (L3817), `.cine-hero__actions .btn` a ≤760 ocupa el 100% (L6138) y `.padel-promo .btn` a ≤560 `width:100%` (L4862).

Elementos por debajo de 48px sin corrección: `.filter-pill` (≈35px), `.site-nav__dropdown a` en escritorio (`padding:10px 14px`, ≈38px), `.hero__dot` (5px de alto pero con `::before` que extiende la zona a ±20px, L4003), `.lead-dot` (no verificado).

Dos reglas CSS globales de interacción táctil, aparte de `--touch-target-min`: `html{-webkit-tap-highlight-color:rgba(26,165,133,.15)}` (L3933–3934, suprime el highlight de tap por defecto de iOS/Android y lo sustituye por uno del color de marca) y `.btn,a.btn,button,summary{touch-action:manipulation}` (L3935–3936, elimina el delay de doble-tap de 300ms en botones y `summary`). Traducción: `touch-manipulation` (clase nativa de Tailwind) en botones/`summary`, y `[-webkit-tap-highlight-color:rgba(26,165,133,0.15)]` (valor literal del original) en `html`.

### 5.2 `(hover:none)` en CSS

Una sola regla: `@media (hover:none){.lead-arrow{opacity:1}}` (L5284). No hay `(hover:hover)` ni `(pointer:coarse)` en CSS: **no está en el código**. Los efectos hover (tilt, `translateY(-4px)`, zoom de imagen `scale(1.04)`) se aplican igualmente en táctil al tocar.

### 5.3 `pointer: coarse` y táctil en JS (`main.js`)

| Línea | Uso |
|---|---|
| L19 | Tilt 3D de `.product-card/.case-card/.calc-card/.blog-card`: `if (window.matchMedia('(pointer: coarse)').matches) return;` dentro de `mousemove` |
| L266–L268 | `isMobile = () => window.innerWidth <= 900 \|\| window.matchMedia('(pointer: coarse)').matches` → los dropdowns pasan a toggle por clic/`touchend` (con `passive:false` para poder `preventDefault`) |
| L345–L351 | `isTouchDevice = 'ontouchstart' in window \|\| navigator.maxTouchPoints > 0 \|\| matchMedia('(pointer: coarse)').matches`; el exit-popup solo se activa si `!isTouchDevice && matchMedia('(min-width:901px)').matches` |
| L327–L330, L583–L586 | Swipe (`touchstart`/`touchend` con `changedTouches[0].clientX`) en lightbox y galería |
| L399–L403 | Comparador antes/después: `touchstart`/`touchmove` (`passive:true`) sobre `.before-after__handle`; CSS `touch-action:pan-y` (L2819) |
| L284 | `main.addEventListener('touchend', toggle, { passive: false })` |

Rama de JS "responsive" sin efecto en el espejo: `init3D`/`onResize` (main.js L408–501) recalcula cámara y render del `<canvas>` del visor 3D en cada `resize` de la ventana (`camera.aspect = canvasWrap.clientWidth/canvasWrap.clientHeight; renderer.setSize(...)`, L496–501), dentro de `if (threedRoot) {…}` con `threedRoot = document.querySelector('.threed-viewer')`. La clase literal `.threed-viewer` **no aparece en el HTML de ninguna de las 78 páginas del espejo** (`.three-d-cta` sí, en `home.html` L370); `querySelector` devuelve `null` y todo el bloque, incluido `onResize`, nunca se ejecuta.

### 5.4 Botón flotante `wa-fab` en móvil

Escritorio: píldora `12px 18px` con texto (≈46px alto). ≤560: `bottom:92px; padding:12px; font-size:0; svg 26px` → círculo de 50×50px (12+26+12) sin texto, elevado 92px del borde inferior (L1767–L1776). Se oculta con `.is-hidden` cuando el footer es visible (IO). Oculto por completo en fichas (`body.is-product-detail`).

Traducción: `fixed bottom-6 right-6 max-[560px]:bottom-[92px] max-[560px]:p-3 max-[560px]:text-[0] [&>span]:max-[560px]:hidden [&>svg]:max-[560px]:size-[26px]`; el `IntersectionObserver` del footer se replica con un `useEffect` o `react-intersection-observer`. Para `pointer:coarse`, un hook `useMediaQuery` (o `window.matchMedia` en `useEffect`) y **desactivar el tilt** en `mousemove` cuando sea coarse; en Tailwind 3.4 añadir a `theme.extend.screens: { touch: { raw: '(hover:none)' }, fine: { raw: '(hover:hover) and (pointer:fine)' } }` (aditivo, no choca con shadcn) y usar `fine:hover:-translate-y-1`.

---

## 6. Contenedor

| Regla | Valor | L |
|---|---|---|
| Token | `--container:1280px` | 24 |
| `.container` | `max-width:var(--container); margin:0 auto; padding:0 24px` | 67–70 |
| **Sobrescritura posterior** | `.section,.container{max-width:100%}` | 3814 |
| `img` | `max-width:100%; display:block; height:auto` | 43–46 |

Hallazgo de cascada: `.section,.container{max-width:100%}` (L3814; byte 76113 del `main.css` minificado) va **después** de `.container{max-width:var(--container)…}` (byte 1460) con la misma especificidad (0,1,0). Según la cascada, el `max-width` efectivo de `.container` es `100%` y el tope de 1280px **no se aplica**: el contenido iría a ancho completo con gutter de 24px en cualquier pantalla. No se ha podido verificar en navegador (no permitido). Para Pavivasa: **mantener el tope de 1280px** como intención de diseño (es el token declarado) y tratar L3814 como un parche accidental.

Padding lateral: **24px fijo en todos los anchos** (no hay media que lo cambie). Excepciones con padding propio: `.world-hero__split{padding:0 14px 16px}` (L4093), `.world-hero__intro{padding:52px 20px 28px}` (L4066), `.sp-hero__inner{padding:88px 20px}` (L4278), `.home-montage__inner{padding:… 24px}`, `.agro-feature__grid{padding:… 24px}`, `.cta-band` (56 → 40px 24px → 32px 20px). Anchos máximos internos: `.section__head` 720px, `.prose` 780px, `.form-grid` 720px, `.contact-grid` 880px, `.choose-cards` 1080px, `.world-hero__split` 1480px, `.jobdetail` 980px, `.threed-viewer` 980px, `.home-montage__inner` 688px.

Traducción: en `tailwind.config.js`: `theme.container = { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } }` (Tailwind añade `max-width` por cada screen; para un único tope usar `max-w-[1280px] mx-auto px-6` en un componente `<Container>`).

---

## 7. Overflow horizontal

| Regla | L | Comentario |
|---|---|---|
| `html,body{overflow-x:hidden; width:100%}` | 3580–3582 | Corta cualquier desbordamiento horizontal (efecto: `position:sticky` puede romperse en algunos navegadores; el header sigue funcionando porque `overflow-x:hidden` en `html` no genera contexto de scroll en `body` de la misma forma que `overflow:hidden`) |
| `html{overflow-x:clip}` | 4647–4648 | Redefinición posterior: `clip` no crea contenedor de scroll, así que `position:sticky` de `.site-header` queda intacto. En `body` sigue `hidden` |
| `.press-strip,.press-strip .container{overflow-x:clip; max-width:100%}` | 4652 | La cinta de logos (`width:max-content`) no ensancha la página |
| `.press-strip__logos{min-width:0; width:100%}` | 4649 | luego `width:max-content` en L3620 — orden inverso: L4649 es posterior, así que gana `width:100%` sobre `width:max-content`; el `flex:0 0 auto` de L3620 se mantiene. **Veredicto para Pavivasa** (no verificado visualmente en el original, ver §12.3): con `width:100%` el contenedor mide el ancho del `.press-strip`, no el del contenido duplicado, y el `keyframe press-scroll` (`translateX(0)→translateX(-50%)`) queda referido a ese ancho — la técnica estándar de marquee infinito exige que el contenedor mida su contenido. **No copiar la regla L4649**; implementar con `w-max flex-none` (`width:max-content`, como en L3620) y los logos duplicados. |
| `.padel-sizes-wrap{overflow-x:auto; -webkit-overflow-scrolling:touch}` | 4841 | tabla desplazable |
| `.site-nav{overflow-y:auto; -webkit-overflow-scrolling:touch}` (≤900) | 910–912 | panel de navegación desplazable |
| `.form-grid,.form-grid>*{min-width:0; max-width:100%}`, `.field{min-width:0}`, `.contact-grid>div,.contact-grid>form{min-width:0}` | 3748–3757, 3744 | evita que inputs anchos rompan la rejilla |
| `.lead-hero__tiles,.lead-hero__text{min-width:0}` (≤820) | 5292–5295 | idem en grid |
| `overflow:hidden` en tarjetas/heros | `.product-card`, `.case-card`, `.collection-card`, `.cine-hero`, `.page-hero`, `.sp-hero`, `.world-panel`… | recortan zoom de imagen |

Traducción — recomendación para Pavivasa (simplifica lo que envía el original): usar solo `html{overflow-x:clip}` (Tailwind 3.4: `overflow-x-clip`) y **omitir** `body{overflow-x:hidden}`. `clip` por sí solo ya evita el desbordamiento horizontal sin generar contexto de scroll, así que no hace falta el `overflow-x:hidden` de `body` que el sitio original arrastra desde antes de introducir `clip` (L3580–3582 es el estado previo a L4647–4648, ver fila anterior) y que sigue siendo el riesgo — ya limitado, no activo aquí — para `position:sticky` que describe esa fila. Aplicar `min-w-0` a hijos de grid que contengan inputs o texto largo.

---

## 8. Movimiento reducido (CSS + JS)

CSS (3 bloques `@media (prefers-reduced-motion:reduce)`): `.reveal` sin transición (L3393); `.hero--slider` sin animación/transition (L4023, dos reglas dentro del mismo bloque); `.cine-hero__bg{transition:opacity .01s}` + sin `cineZoom` ni `cineSwap` (L6149).

JS (`main.js`): L28 (parallax de `.hero__bg` solo si no reduce), L43 y L75 (`const reduce = matchMedia(...)`, contadores/animaciones), L652 (`reduceMotion` bloquea el autoplay de `[data-lead-slider]`), L723 (vídeo de fondo `video[data-bg-video]` no se carga si reduce; tampoco si `navigator.connection.saveData`).

Sin cobertura de reduced-motion: `press-scroll` (cinta de logos), transiciones hover de tarjetas, `scroll-behavior:smooth` en `html` (L31). **No está en el código.**

Traducción: variante `motion-reduce:` de Tailwind (`motion-reduce:animate-none motion-reduce:transition-none`), y `useReducedMotion` (framer-motion) o `matchMedia` para los efectos JS.

---

## 9. Imágenes responsive (HTML)

| Patrón | Dónde | Valor |
|---|---|---|
| `<picture><source type="image/webp" srcset="…-800.webp 800w, …-1200.webp 1200w, ….webp 1920w" sizes="100vw"><img src="….jpg" fetchpriority="high" decoding="async">` | fondos del `cine-hero` (home L130) | 3 tamaños: 800/1200/1920; el primero `fetchpriority="high"`, el resto `loading="lazy"` |
| `<link rel="preload" as="image" type="image/webp" imagesrcset="…-800.webp 800w, …-1200.webp 1200w, ….webp 2000w" imagesizes="100vw" fetchpriority="high">` | `<head>` (home L23) | precarga de la **misma** imagen de fondo del primer slide del `cine-hero`, pero con el tamaño mayor declarado como **2000w**, no 1920w — inconsistencia literal entre el `preload` (2000w) y el `<source>` real del `<picture>` (1920w, L130, fila anterior). No copiar la incoherencia: usar un único valor (1920w) en ambos, o generar el archivo a 2000px si se prefiere ese tamaño y actualizar el `<source>` a juego. En `next/image`, la propiedad `priority` sustituye al `preload` manual y toma `sizes`/`srcset` de una sola fuente, así que esta inconsistencia no puede reproducirse por accidente. |
| `sizes="(max-width:720px) 50vw, 320px"` con `srcset` 800/1200/2000w | `.team-wall__item` (home L212–L221) | **único `sizes` con media query** del sitio; coincide con el `column-count` 2 en móvil |
| `loading="lazy" decoding="async"` | 35 imágenes en home | |
| `img{max-width:100%; height:auto; display:block}` | L43 | base global |
| `object-fit:cover` + `aspect-ratio` | `4/3` product/case/gallery/photo-gallery/sp-disc; `16/10` collection-card/choose-card; `16/9` blog/before-after/video/threed; `1/1` gallery__thumb/quiz__result-media; `8/5` calc-viz (→`4/3` ≤560) | |

Traducción: `next/image` con `sizes="100vw"` para heros, `sizes="(max-width:720px) 50vw, 320px"` para mosaicos, `sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, (max-width:1100px) 33vw, 25vw"` para `.product-grid` (derivado de sus columnas; **no está en el código original**, que no pone `sizes` en las tarjetas).

---

## 10. Componentes con reglas responsive en el CSS pero sin uso en el espejo (78 páginas)

`world-hero`/`world-panel`, `lead-hero`, `choose-hero`/`choose-cards`, `agro-feature`, `mobile-sticky-cta`, `maint-banner`, `filter-bar`, `hero`/`hero--slider`, `padel-*` (`padel-hero`, `padel-detail__grid`, `padel-sizes`, `padel-size-layout`, `padel-promo`, `page-hero--padel`), `blog-grid`, `team-grid`, `cert-grid`, `co2-calc`, `download-grid`, `video-testi-grid`, `quiz`, `how-steps`, `preview-tool`, `photo-gallery`, `dach-map`, `heu-animal-grid`, `color-picker`, `bau-ampel`, `field-row`, `chip`, `rating-summary`, `case-body`/`case-hero`/`case-stats`/`case-gallery`, `blog-related-grid`, `timeline`, `collections`, `cat-chips`, `form-narrow`, `compare-tool`/`compare-slots`, `calc-layout`, `step-grid`, `gallery__thumbs`, `product-info__stats`.

Implicación: el CSS es un "kit" más amplio que el sitio publicado. Para Pavivasa, los patrones **vivos** que conviene copiar son: header/nav (78 pág.), `cine-hero` (home), `page-hero` (76), `product-grid`/`product-card` (7), `kategorien`/`collection-card` (9), `features` (6), `case-grid` (home), `reviews-grid` (2), `trust-bar` (home), `press-strip` (home), `team-wall` (home), `cta-band` (47), `form-grid` (4), `contact-grid` (1), `product-detail`+`lightbox` (36), `wa-fab` (78), `exit-popup` (78, solo escritorio), `sp-*` (1).

---

## 11. Traducción a Next/Tailwind/shadcn: mapa de breakpoints y reglas

### 11.1 Mapa recomendado (`tailwind.config.ts`)

Globotent es desktop-first con `max-width`; Tailwind es mobile-first con `min-width`. **No redefinir `theme.screens`**: shadcn/ui usa los nombres por defecto `sm`/`md`/`lg`/`xl`/`2xl` (640/768/1024/1280/1536) dentro de sus propios primitives (p. ej. `Dialog` `sm:max-w-lg`, `AlertDialog` `sm:flex-row`); sobrescribirlos en `theme.screens` (en vez de `theme.extend.screens`) cambia el comportamiento responsive de esos componentes sin avisar. En su lugar: variantes arbitrarias `max-[Npx]:` para cada corte de Globotent (fidelidad exacta, no aproximación), y solo lo aditivo —que no colisiona con ningún nombre por defecto— en `theme.extend`:

```ts
// tailwind.config.ts
theme: {
  extend: {
    minHeight: { touch: '48px' },
    fontSize: {
      h1: 'clamp(2rem,4.2vw,3.6rem)',
      h2: 'clamp(1.6rem,2.8vw,2.4rem)',
      display: 'clamp(2.1rem,5.1vw,4rem)',
      'display-m': 'clamp(1.95rem,8.4vw,2.7rem)',
    },
    screens: {
      touch: { raw: '(hover:none)' },
      fine: { raw: '(hover:hover) and (pointer:fine)' },
    },
  },
},
```

Qué controla cada corte (referencia, no config): ≤480 → teléfono oculto, botones que envuelven, `file input`; ≤560 → "todo a 1 columna", `.section` 48px, `wa-fab` icono; ≤768/760/720/700 → formularios 1 col, cine-hero móvil, `kategorien` 1 col; ≤900 → burger, nav panel, 2 columnas, CTA oculto; ≤1100 → 4→3 col (`product-grid`), 3→2 (reviews/case).

Equivalencias directas (regla original → clase), usando el valor **exacto** del breakpoint, sin agrupar bajo un nombre que pierda precisión:

| Globotent | Tailwind (variante arbitraria) |
|---|---|
| `@media (max-width:1100px)` | `max-[1100px]:` |
| `@media (max-width:900px)` | `max-[900px]:` |
| `@media (max-width:1000px)`, 880, 860, 820, 780 | `max-[1000px]:`, `max-[880px]:`, `max-[860px]:`, `max-[820px]:`, `max-[780px]:` (cada uno con su valor exacto, no aproximar a otro) |
| `@media (max-width:768px)`, 760, 720, 700 | `max-[768px]:`, `max-[760px]:`, `max-[720px]:`, `max-[700px]:` — cada componente con el valor exacto de su propia regla (ver §2.8–§2.11); no unificar en un solo corte si se quiere no perder ninguna decisión móvil |
| `@media (max-width:680px)`, 600 | `max-[680px]:`, `max-[600px]:` |
| `@media (max-width:560px)` | `max-[560px]:` |
| `@media (max-width:520px)` | `max-[520px]:` |
| `@media (max-width:480px)` | `max-[480px]:` |
| `(hover:none)` | `theme.extend.screens.touch` → `touch:opacity-100` |
| `(prefers-reduced-motion:reduce)` | `motion-reduce:` |
| `pointer: coarse` (JS) | `useMediaQuery('(pointer: coarse)')` |

Si se prefiere **aproximar a los defaults de Tailwind** (640/768/1024/1280) para no usar ninguna variante arbitraria: 560→`sm` 640 (las tarjetas pasan a 1 col 80px antes), 900→`lg` 1024 (el burger aparece 124px antes; en iPad horizontal 1024 se vería la nav móvil), 1100→`xl` 1280 (3 columnas hasta 1279px). Es una aproximación aceptable para diseño, no para réplica fiel; el corte de 900 es el que más se nota. Esta ruta **sí es compatible con shadcn** porque no toca `theme.screens`.

### 11.2 Reglas para no perder decisiones móviles

1. **Header fijo de 80px** en todos los anchos (`h-20`); el logo baja de 56 a 42px solo a ≤600 (`max-[600px]:h-[42px]`). Descontar 80px en heros con `svh`.
2. **Nav ≤900**: panel superior fijo (`fixed top-20 inset-x-0`), `translate-y-[-200%]`→`translate-y-0` en 250ms, `max-h-[calc(100vh-5rem)] overflow-y-auto`; enlaces a ancho completo con `border-b` y `py-3`; dropdowns como acordeón con `!block bg-[--color-bg-soft] rounded-lg p-[6px_8px] my-[6px_12px]` y enlaces `min-h-11`; cerrar al scroll >12px, clic fuera, Escape y clic en enlace.
3. **CTA de cabecera oculta ≤900** y **teléfono → icono circular 48px** (481–900) → oculto ≤480. Mantener `lang-switch` con solo bandera ≤900.
4. **Rejillas**: product 4/3/2/1 (1100/900/560); features 4/2/1 (1100/560); case & reviews 3/2/1 (1100/560); trust-bar 4/2/1 (900/560); kategorien 2/1 (720); footer 4/2/1 (900/560); form 2/1 (900); contact 2/1 (768); sp-disciplines 4/2/1 (1000/820); sp-specs 4/2/1 (820/520).
5. **Section padding** 72→48 y `--tight` 48→32 a ≤560 (`py-[72px] max-[560px]:py-12`); `cta-band` 56 → `40px 24px` (≤900) → `32px 20px` (≤560) y su h2 a 1.4rem.
6. **Botones**: `min-h-12` (48px) siempre; en el hero móvil `basis-full justify-center`; en `section__head` a ≤480 permitir `whitespace-normal h-auto py-2.5 px-[18px]`.
7. **wa-fab**: ≤560 icono solo, `bottom:92px`, `p-3`, svg 26px; ocultar cuando el footer es visible; ocultar en fichas de producto.
8. **cine-hero**: `min-h-[min(calc(100svh-5rem),780px)] max-[760px]:min-h-[min(92svh,700px)]`, padding-top fluido `clamp(40px,7vh,84px)` / móvil `clamp(60px,12vh,110px)`, h1 `clamp(2.1rem,5.1vw,4rem)` → `clamp(1.95rem,8.4vw,2.7rem)`, tabs 2 por fila (`basis-[42%]`).
9. **Inputs con `font-size:16px`** para evitar el zoom de iOS; `min-w-0` en hijos de grid.
10. **Tablas**: envoltorio `overflow-x-auto` + ocultar columnas terciarias con `max-[780px]:hidden` en `th/td` (3.ª columna de `.padel-sizes`, L369) y `max-[760px]:hidden` para la última columna dentro de `.padel-size-layout` (L4851) — dos breakpoints distintos, no uno solo.
11. **Lightbox** ≤900: `p-4`, flechas 44px a 8px del borde; swipe con `touchstart/touchend`.
12. **exit-popup** solo `min-width:901px` y no táctil.
13. **`main` con `pb-[84px]` ≤900** solo si se implementa una `mobile-sticky-cta`; si no, omitirlo (en Globotent el hueco existe sin barra).
14. **`overflow-x:clip`** en `html` (omitir `hidden` en `body`, ver §7); la cinta de prensa con `overflow-x-clip`, logos duplicados y `w-max flex-none` (no `width:100%`, ver §7/§12.3); en ≤700 etiqueta arriba en columna.
15. **Reduced motion**: sin Ken-Burns, sin `reveal`, sin autoplay de sliders, sin vídeo de fondo; añadir (mejora sobre el original) pausa de `press-scroll`.
16. **Imágenes**: `sizes` explícito por rejilla (Globotent solo lo hace en hero y team-wall).

### 11.3 shadcn/ui

- `Sheet` (side="top") puede servir para el panel móvil si se ajusta `top-20` y se elimina el overlay oscuro (Globotent no oscurece el fondo; usa sombra `0 8px 24px rgba(6,24,39,.18)`).
- `Accordion` para dropdowns móviles; `NavigationMenu` para escritorio (hover, `top:calc(100%+10px)`, `left:-20px`, `min-w-[260px]`, `rounded-xl`, sombra `0 20px 40px rgba(6,24,39,.12)`).
- `Button` con `size` mapeado: `default` = 44px declarado/48px efectivo (`h-11 min-h-12`), `lg` = 56px (`h-14 px-9 text-[.95rem]`), `rounded-full` (`--button-corner:50px`), `uppercase font-extrabold tracking-[.04em] text-[.85rem]`.
- `Dialog` para lightbox (padding 48 → 16 en ≤900) y para exit-popup (max-w 520px, solo escritorio).

### 11.4 Contratos de props (ejemplos)

No hay componentes React en el original (HTML estático); estos son los props sugeridos para los bloques reutilizables de §3.7/§3.8/§6, derivados de los valores literales ya documentados:

```tsx
// Section — §3.7, L269-271, L1626-1628
type SectionProps = {
  padding?: 'normal' | 'tight'; // normal: py-[72px] max-[560px]:py-12 (72→48)
                                  // tight:  py-12 max-[560px]:py-8   (48→32)
};

// Container — §6, L67-70 (tope 1280px como intención de diseño, ver §6)
type ContainerProps = { className?: string };
// → max-w-[1280px] mx-auto px-6

// CardGrid — §3.8 (secuencia de columnas por rejilla, p.ej. product-grid 4/3/2/1 en 1100/900/560)
type CardGridProps = {
  cols: 4 | 3 | 2;              // columnas en escritorio
  collapse: { at1100?: number; at900?: number; at560?: 1 }; // valores tomados de la fila de §3.8 correspondiente
  gap?: number;                  // px, columna "gap" de §3.8
};
```

---

## 12. Dudas / no verificado

1. **`.container` a 100%**: la cascada indica que L3814 anula el tope de 1280px; no se ha comprobado en navegador si el sitio real se ve a ancho completo en pantallas >1328px.
2. Varias reglas móviles quedan **anuladas por reglas base posteriores** (`.lang-switch__current{padding:8px 10px}` L1734 vs L3711; `.chip{padding:8px 10px}` L1620 vs L3714; `.burger{display:block}` L896 vs `display:flex` L3694; `.site-header__phone{display:none}` L1544 vs L3663). Se ha aplicado la regla "última gana" sin ejecutar un motor CSS.
3. `.press-strip__logos`: `width:100%` (L4649) vs `width:max-content` (L3620): por orden gana `100%` en el **sitio original**; no se ha verificado visualmente si la cinta sigue funcionando ahí. Para la implementación de Pavivasa esto no es una duda: no replicar `width:100%`, usar `width:max-content`/`w-max flex-none` (ver §7).
4. Efecto real de `main{padding-bottom:84px}` (≤900) sin `.mobile-sticky-cta` en el HTML: presumiblemente un hueco de 84px sobre el footer en móvil; no verificado.
5. El `data-lead-slider` (`.lead-arrow`, `(hover:none)`) no existe en ninguna página; su comportamiento táctil se documenta solo a partir del CSS/JS.
6. No se ha medido el alto real de `.filter-pill` ni `.site-nav__dropdown a` en escritorio (estimaciones a partir de padding + line-height).
7. `.padel-detail__grid` tiene media (L446) pero no se localizó su regla base en el CSS; puede que la base esté en otro selector o que falte.
8. La lista de bloques `@media` del enunciado hablaba de ~90; el recuento real es 75. Puede que el enunciado contara selectores en vez de bloques.
