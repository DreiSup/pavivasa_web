# 04 · Tarjetas (cards) de globotent.com

Documento de referencia para (1) Claude Design y (2) Claude Code (Next.js 15 App Router + Tailwind 3.4 + shadcn/ui). Todo lo que sigue sale del espejo local de globotent.com: `main.pretty.css` (6156 líneas, formateo del `main.css` original), `main.js` (742 líneas, IIFE) y las 78 páginas de `site/`. Cada afirmación cita el selector, atributo o función de origen. Cuando algo no aparece en el código se dice explícitamente: **no está en el código**.

Notación: `L123` = línea 123 de `main.pretty.css`; `main.js:L12` = línea 12 de `main.js`; `index.html:L295` = línea 295 de `site/index.html`.

---

## 0. Resumen ejecutivo (lo que hay que replicar)

1. **Una sola "receta" de tarjeta** repetida con variaciones: fondo `#fff`, borde `1px solid #e2e2e2`, radio `12px` (`--radius`), sin sombra en reposo, y en hover `translateY(-4px)` + sombra `--shadow-card` + borde `#1aa585`.
2. **Zoom de imagen en hover**: la imagen dentro del contenedor `overflow:hidden` hace `scale(1.04)` (product/case/choose), `scale(1.05)` (collection/team-wall) o `scale(1.06)` (sp-disc), con `transition: transform .4s`–`.6s`.
3. **Tilt 3D por ratón** (`main.js:L16-L26`) solo en `.product-card, .case-card, .calc-card, .blog-card`, con guarda `(pointer: coarse)`, `perspective(900px)` y rotación máxima ±1.5°.
4. **Aparición al hacer scroll** (`main.js:L3-L15`): el JS añade `.reveal` a 19 selectores y un `IntersectionObserver` (`threshold: 0.12`, `rootMargin: '0px 0px -60px 0px'`) añade `.is-visible` una sola vez.
5. **Badges** = píldoras `border-radius:999px/50px`, fondo `rgba(26,165,133,.10)`, texto `#12755e`, peso 800, tamaño `.68rem`–`.78rem`.
6. Dos "mundos" visuales: **industria** (verde `#1aa585`, radio 12px, borde gris) y **sport** (`.sport-world`: borde `1px solid #000`, radio 16px, lima `#e3fc03`, fuente `'Clash Display'` que **no se carga**: no hay `@font-face` ni `<link>` para ella, cae a `'Figtree'`).

---

## 1. Tokens compartidos por todas las tarjetas

Fuente: `:root` en `L1-L30`.

| Token | Valor | Uso en tarjetas |
|---|---|---|
| `--brand-green` | `#1aa585` | borde hover, CTA, año, eyebrow, badge (al 10%) |
| `--brand-green-dark` | `#12755e` | texto de badges, `.jobcard__link`, hover de CTA |
| `--brand-green-deep` | `#007a4a` | gradiente de `.feature__icon` y `.how-step__num` |
| `--brand-lime` | `#7ec700` | `.collection-card__label span`, `.trust-item strong`, línea superior de `.jobcard` |
| `--brand-dark` | `#061827` | base de las sombras `rgba(6,24,39,…)`, fondo `.trust-bar` |
| `--color-title` | `#151719` | títulos |
| `--color-text` | `#535353` | párrafos |
| `--color-sub-title` | `#535353` | metadatos (mismo valor que `--color-text`) |
| `--color-border` | `#e2e2e2` | borde de todas las tarjetas |
| `--color-bg` | `#ffffff` | fondo `.jobcard`, `.job-other` |
| `--color-bg-soft` | `#f6f8f7` | fondo del media mientras carga, badge `--alt`, chips |
| `--radius` | `12px` | radio por defecto de tarjeta |
| `--shadow-card` | `0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)` | sombra hover estándar |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | todo |
| `--touch-target-min` | `48px` (`L3584`) | min-height de `.rating-badge` en ≤900px |
| `--sport-lime` | `#e3fc03` (definida en `.sport-world`, `L4233-L4238`) | sombra dura de `.sp-disc`, badge sport |
| `--button-corner` | `50px` | `border-radius` de `.btn` (CTA de tarjetas) |
| `--button-font-weight` | `800` | `font-weight` de `.btn` |
| `--button-text-transform` | `uppercase` | `text-transform` de `.btn` |
| `--button-normal-height` | `44px` | `height` de `.btn` (tamaño usado en tarjetas) |

`--button-large-height` y `--button-medium-height` (ambas `56px`, `L20-L21`) existen pero no se usan en ninguna tarjeta de la muestra revisada (solo `.btn--lg` fuera de tarjetas).

Tipografía: `Figtree` se carga desde Google Fonts (`index.html:L20-L22`, `family=Figtree:wght@300..900`). `h3{font-size:1.25rem}` y `h1,h2,h3,h4,h5{color:var(--color-title);font-weight:800;line-height:1.15;margin:0 0 .5em}` (`L52-L63`). `'Clash Display'` se declara en `.sport-world h1,h2,h3` y `.sp-disc__body h3` (`L4240`, `L4395`) pero **no hay `@font-face` ni `<link>`**: cae al fallback `var(--font-family)`.

Enlaces: `a{color:var(--color-link)}` (`#222222`), `a:hover{color:var(--brand-green)}` (`L44-L47`). Casi todas las tarjetas son un `<a>` entero, por lo que los elementos sin color explícito heredarían el verde en hover; por eso las tarjetas fijan `color:var(--color-title)` en el bloque (`.case-card`, `.blog-card`, `.calc-card`).

Botón dentro de tarjeta (`.product-card__cta` es `<span class="btn btn--primary ...">`): `.btn` = `inline-flex; height:var(--button-normal-height); padding:0 28px; border-radius:var(--button-corner); font-weight:var(--button-font-weight); text-transform:var(--button-text-transform); font-size:.85rem; letter-spacing:.04em; border:2px solid transparent; transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease` (`L74-L92`; valores resueltos: `height:44px; border-radius:50px; font-weight:800; text-transform:uppercase`); `.btn--primary{background:#1aa585;color:#fff}`, hover `background:#12755e; transform:translateY(-1px)` (`L97-L103`).

---

## 2. Inventario completo

Recuento real de uso en las 78 páginas (grep sobre `site/`). "Solo CSS" = existe la regla pero ninguna página la usa.

| # | Tarjeta (clase raíz) | Ejemplo real | Páginas que la usan | Rejilla | Hover | Tilt JS | Reveal JS |
|---|---|---|---|---|---|---|---|
| 4.1 | `.product-card` | `index.html:L294-L301` | 50 instancias: home (4), 5 categorías (fabric-buildings 15, padel-tennis-covers 1, pickleball 2, riding-arena-covers 7, storage-tents 11) + `pages/sport.html` (10) | `.product-grid` | lift −4px + sombra + borde verde + img 1.04 | **sí** | sí |
| 4.2 | `.case-card` | `index.html:L431-L439` | 3 (solo home) | `.case-grid` | lift −4px + sombra + borde verde + img 1.04 | **sí** | sí |
| 4.3 | `.collection-card` | `index.html:L238-L244` | 18 (home, all-models, produkte, calculators) | `.kategorien` / `.collections` | img 1.05 (sin lift) | no | sí |
| 4.4 | `.calc-card` | `index.html:L401-L406` | 3 (solo home, dentro de `.section--brand`) | `.calc-grid` | lift −4px (−3px en `--brand`) + sombra fuerte + borde verde | **sí** | sí |
| 4.5 | `.feature` (+`__icon`, `__more`) | `index.html:L153-L161` | 8 (home) | `.features` | lift −4px + sombra | no | sí |
| 4.6 | `.review` | `index.html:L479-L483` | 15 (home, customer-reviews) | `.reviews-grid` | ninguno | no | sí |
| 4.7 | `.rating-badge` (+`--compact`) | `index.html:L473-L476` y `L140` | home (2), heros | inline | lift −2px + sombra | no | no |
| 4.8 | `.trust-item` | `index.html:L339-L342` | 4 (home) | `.trust-bar__grid` | ninguno | no | no |
| 4.9 | `.press-item` | `index.html:L350-L363` | 14 (home, 7 duplicados `aria-hidden`) | marquesina `.press-strip__logos` | opacity .65→1 | no | sí |
| 4.10 | `.three-d-cta` | `index.html:L370-L390` | 1 (home) | bloque 2 columnas | ninguno | no | sí |
| 4.11 | `.team-wall__item` | `index.html:L212-L221` | 10 (home) | `.team-wall` (CSS columns) | lift −4px + sombra + img 1.05 | no | contenedor `.team-wall` |
| 4.12 | `.jobcard` | `jobs.html:L161-L174` | 3 (jobs) | `.jobs-grid` | lift −5px + sombra + barra superior scaleX | no | sí (+ clase `reveal` en HTML) |
| 4.13 | `.job-other` | `jobs/sdr-sales.html:L198-L205` | 6 (3 páginas de empleo) | `.job-others` | lift −3px + sombra verde + borde verde | no | sí |
| 4.14 | `.sp-disc` | `sport.html:L154-L161` | 4 (sport) | `.sp-disciplines` | lift −4px + sombra dura lima + img 1.06 + subrayado CTA | no | no |
| 4.15 | `.mega-item` | `categories/fabric-buildings.html:L57-L60` | 390 (5 por página, todas) | `.site-nav__mega` | fondo verde 8% + título verde oscuro | no | no |
| 4.16 | `.faq-item` (`<details>`) | `faq.html:L141` | 10 (faq) | `.faq-list` | borde verde al abrir | no | no |
| 4.17 | `.testimonial` | — | **solo CSS** | `.testimonials` | ninguno | no | no |
| 4.18 | `.blog-card` | — | **solo CSS** | `.blog-grid` | lift −4px + sombra + borde | **sí** (en la lista JS) | sí |
| 4.19 | `.team-card` | — | **solo CSS** | `.team-grid` | lift −2px + borde | no | sí |
| 4.20 | `.choose-card` (+`--sport`) | — | **solo CSS** | `.choose-cards` | lift −4px + sombra + img 1.04 | no | no |
| 4.21 | `.download-card` | — | **solo CSS** | `.download-grid` | ninguno | no | sí |
| 4.22 | `.how-step` | — | **solo CSS** | `.how-steps` | ninguno | no | sí |
| 4.23 | `.cert-item` | — | **solo CSS** | `.cert-grid` | ninguno | no | sí |
| 4.24 | `.video-testi` | — | **solo CSS** | `.video-testi-grid` | lift −4px + sombra + borde | no | no |
| 4.25 | `.blog-related`, `.case-hall-card`, `.rb-alt-card`, `.glossary-entry`, `.photo-gallery a`, `.cat-chip` | — | **solo CSS** | varias | borde/fondo | no | no |
| — | `.step-card` | — | solo `order` en ≤768px (`L3655-L3660`); **no hay estilos base** | `.step-grid` | — | — | — |

Notas de inventario:
- `.product-card__price`, `.product-card__price--quote` y `.product-card__eyebrow` existen en CSS (`L627-L635`, `L1027`) pero **ninguna página los usa**.
- `.fade-up` / `@keyframes fadeUp` (`L879-L888`) **no se usan en ninguna página** ni en el JS; la aparición real es `.reveal`.
- `data-w` (filtro de `.product-card` en `main.js:L681-L704`) **sí aparece**: 9 veces, todas en `.product-card` de `site/pages/sport.html` (`data-w='20'` ×5, `'25'`, `'14'`, `'10'`, `'18'`, líneas 227,236,245,254,263,272,281,299,308). En cambio `data-filter-bar` / `.filter-pill` / `data-filter-grid` / `data-filter-count` (el disparador que activaría ese bloque) **no aparecen en ninguna de las 78 páginas**: el filtro sigue sin efecto visible, pero el atributo `data-w` no es código muerto en el HTML.
- No hay `data-tilt` ni atributo alguno: el tilt se aplica por selector de clase.

---

## 3. Mecanismos transversales

### 3.1 Hover: tabla de valores exactos

| Tarjeta | Transform bloque | Sombra hover | Borde hover | Transition del bloque (efectiva) | Imagen: scale | Transition imagen |
|---|---|---|---|---|---|---|
| `.product-card` | `translateY(-4px)` (`L596`) | `var(--shadow-card)` | `var(--brand-green)` | `transform .25s ease, box-shadow .25s ease, border-color .2s ease` (`L3399`, sobrescribe el `.2s` de `L595`) | `scale(1.04)` (`L609`) | `transform .4s ease` (`L608`) |
| `.case-card` | `translateY(-4px)` (`L2089`) | `var(--shadow-card)` | `var(--brand-green)` | ídem `L3399` | `scale(1.04)` (`L2102`) | `transform .4s` (sin easing explícito = `ease`) (`L2101`) |
| `.collection-card` | ninguno | ninguna | sin borde | — | `scale(1.05)` (`L566`) | `transform .4s ease` (`L560`) |
| `.calc-card` | `translateY(-4px)` (`L1182`); en `.section--brand`: `translateY(-3px)` + `background:rgba(255,255,255,.14)` (`L295-L297`) | `0 20px 40px rgba(6,24,39,.14)` | `var(--brand-green)` | ídem `L3399` | sin imagen | — |
| `.feature` | `translateY(-4px)` (`L474`) | `var(--shadow-card)` | sin cambio | `transform .2s ease, box-shadow .2s ease` (`L473`) | sin imagen | — |
| `.rating-badge` | `translateY(-2px)` (`L1944`) | `0 10px 24px rgba(6,24,39,.15)` | — | `transform .2s, box-shadow .2s` (`L1943`) | — | — |
| `.team-wall__item` | `translateY(-4px)` (`L5450`) | `0 16px 40px rgba(6,24,39,.18)` | — | `transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease` (`L5437`) | `scale(1.05)` (`L5453`) | `transform .6s cubic-bezier(.2,.7,.2,1)` (`L5442`) |
| `.jobcard` | `translateY(-5px)` (`L5561`) | `0 22px 50px rgba(6,24,39,.13)` | `transparent` | `transform .2s, box-shadow .2s, border-color .2s` (`L5547`) | — (barra `::before` `scaleX(0→1)`, `.25s`) | — |
| `.job-other` | `translateY(-3px)` (`L5762`) | `0 14px 34px rgba(26,165,133,.13)` | `var(--brand-green)` | `border-color .18s, transform .18s, box-shadow .18s` (`L5759`) | — | — |
| `.sp-disc` | `translateY(-4px)` (`L4377`) | `7px 7px 0 var(--sport-lime), 7px 7px 0 1px #000` | sin cambio (`#000`) | `box-shadow .25s, transform .25s` (`L4376`) | `scale(1.06)` (`L4390`) | `transform .5s` (`L4389`) |
| `.choose-card` (solo CSS) | `translateY(-4px)` (`L5071`) | `0 18px 44px rgba(6,24,39,.13)` | `#cdd8d3` | `transform .25s ease, box-shadow .25s ease, border-color .25s ease` (`L5070`) | `scale(1.04)` (`L5085`) | `transform .45s ease` (`L5084`) |
| `.blog-card` (solo CSS) | `translateY(-4px)` (`L2483`) | `var(--shadow-card)` | `var(--brand-green)` | ídem `L3399` | **sin scale** (`L2490-L2493` no tiene transition) | — |
| `.team-card` (solo CSS) | `translateY(-2px)` (`L2595`) | ninguna | `var(--brand-green)` | `border-color .2s, transform .2s` | — | — |
| `.video-testi` (solo CSS) | `translateY(-4px)` (`L2960`) | `var(--shadow-card)` | `var(--brand-green)` | `transform .2s, box-shadow .2s, border-color .2s` | — (botón play `scale(1.1)`) | — |
| `.mega-item` | ninguno | — | — | ninguna transición declarada | — | — |
| `.review`, `.trust-item`, `.three-d-cta`, `.download-card`, `.how-step`, `.cert-item`, `.testimonial` | **sin hover** | — | — | — | — | — |

Regla común para las 4 tarjetas con tilt (`L3399-L3402`):

```css
.product-card,.case-card,.calc-card,.blog-card{
  will-change:transform;
  transform-style:preserve-3d;
  transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease}
```

### 3.2 Tilt 3D por ratón (`main.js:L16-L26`)

Código literal:

```js
const tiltEls = document.querySelectorAll('.product-card, .case-card, .calc-card, .blog-card');
tiltEls.forEach(el => {
el.addEventListener('mousemove', e => {
if (window.matchMedia('(pointer: coarse)').matches) return;
const r = el.getBoundingClientRect();
const x = (e.clientX - r.left) / r.width - 0.5;
const y = (e.clientY - r.top) / r.height - 0.5;
el.style.transform = `translateY(-4px) perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg)`;
});
el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});
```

Mecanismo:
- Aplica a `.product-card, .case-card, .calc-card, .blog-card` (el último no existe en ninguna página).
- `x`, `y` ∈ [−0.5, 0.5] → `rotateX` ∈ [−1.5°, +1.5°] (invertido en Y: ratón arriba = borde superior se aleja), `rotateY` ∈ [−1.5°, +1.5°]. `toFixed(2)`.
- La guarda `(pointer: coarse)` se evalúa **en cada `mousemove`**, no al inicializar. No hay guarda `prefers-reduced-motion` para el tilt (sí la hay para hero y sliders, `main.js:L27`, `L43`, `L75`).
- La `perspective(900px)` va **dentro** del `transform` del propio elemento (no en el padre) y el orden es `translateY → perspective → rotateX → rotateY`; `transform-origin` por defecto (centro).
- Combinación con el hover CSS: el estilo inline gana a `.product-card:hover{transform:translateY(-4px)}`, por eso el JS repite `translateY(-4px)` en su cadena para mantener la elevación mientras rota. La sombra y el borde verde siguen viniendo del `:hover` CSS.
- Como la transición `transform .25s ease` (`L3399`) sigue activa, cada cambio del inline `transform` se interpola en 250 ms → el tilt "sigue" al ratón con retardo suave.
- `mouseleave` pone `el.style.transform = ''` → vuelve al valor CSS (sin hover: `none`) con la misma transición de 250 ms.

### 3.3 Aparición al hacer scroll (`.reveal` → `.is-visible`)

JS (`main.js:L3-L15`):

```js
if ('IntersectionObserver' in window) {
const targets = document.querySelectorAll('.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other');
targets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.classList.add('is-visible');
io.unobserve(e.target);
}
});
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
targets.forEach(el => io.observe(el));
}
```

CSS (`L3386-L3398`):

```css
.reveal{
  opacity:0;
  transform:translateY(18px);
  transition:opacity .6s ease,transform .6s ease}
.reveal.is-visible{
  opacity:1;
  transform:none}
@media (prefers-reduced-motion:reduce){
  .reveal{
  opacity:1;
  transform:none;
  transition:none}
}
```

Mecanismo:
- Mejora progresiva: `.reveal` la añade el JS, así que sin JS nada queda oculto. Excepción: `.jobcard` lleva `class='jobcard reveal'` en el HTML (`jobs.html:L161`), de modo que sin JS las tarjetas de empleo quedarían invisibles.
- Un solo disparo (`io.unobserve`). Umbral 12 % visible y el borde inferior del viewport retraído 60 px.
- Cada tarjeta se observa por separado → **no hay stagger** (retardo escalonado) declarado; el escalonado que se percibe proviene de que cada tarjeta cruza el umbral en momentos distintos.
- `.team-wall__item` no está en la lista: se revela el contenedor `.team-wall` entero. `.trust-item`, `.rating-badge`, `.sp-disc`, `.mega-item`, `.faq-item` tampoco.
- `@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}` y `.fade-up{animation:fadeUp .6s ease both}` (`L879-L888`) están definidos pero **sin uso**.

Efectos de cascada (derivados de especificidad y orden en el CSS, no verificados en navegador; conviene tenerlos en cuenta al replicar):
- `.reveal.is-visible{transform:none}` (`L3390`, especificidad 0,2,0) va **después** de `.product-card:hover` (`L596`), `.case-card:hover` (`L2089`), `.calc-card:hover` (`L1182`), `.feature:hover` (`L474`), `.team-card:hover`, `.video-testi:hover`, `.blog-card:hover`, todas (0,2,0). Por orden, el `translateY(-4px)` del hover CSS queda anulado en las tarjetas reveladas; la elevación real en product/case/calc la aporta el **inline style del tilt** (que gana a cualquier clase). En `.feature` y `.team-card` solo queda el cambio de sombra/borde. `.jobcard:hover` (`L5561`), `.job-other:hover` (`L5762`) y `.section--brand .calc-card:hover` (0,3,0, `L295`) sí ganan.
- La regla `L3399` (transition solo para `transform`, `box-shadow`, `border-color`) va después de `.reveal` (`L3386`) y tiene igual especificidad (0,1,0): en `.product-card/.case-card/.calc-card/.blog-card` la opacidad del reveal **no transiciona** (salta 0→1) y el desplazamiento de 18 px dura .25 s, no .6 s. En `.feature` ocurre lo contrario: `.reveal` gana a `L473` y el hover pierde la transición de `box-shadow`.
- En una réplica limpia conviene separar el reveal (wrapper) del hover/tilt (tarjeta) para evitar esta colisión de `transform`. Ver §7.6.

### 3.4 Focus

**No está en el código**: no hay reglas `:focus` ni `:focus-visible` para ninguna tarjeta. Los únicos `:focus-visible` del CSS son `.lang-switch__menu a` (`L1725`), `.contact-action` (`L3919`), `.hero__dot` (`outline:2px solid #fff; outline-offset:3px`, `L4012`) y `.site-nav__sports` (`L4052`). Las tarjetas-enlace reciben el outline por defecto del navegador. `outline:none` aparece una vez en `L853` (formulario).

### 3.5 `is-active`

**No aplica a tarjetas.** En `main.js` `is-active` se usa en slides/dots del hero (`L46-L50`), pestañas del cine-hero (`L80-L83`), miniaturas de galería (`L231`, `L592`), chips del visor 3D (`L504`), lead-slider (`L659-L661`) y `.filter-pill` (`L699-L700`, sin uso en páginas). Estilo `.filter-pill.is-active{background:var(--brand-green);border-color:var(--brand-green);color:#fff}` (`L4689`).

### 3.6 Filtro de `.product-card` por ancho (sin disparador en el HTML)

`main.js:L681-L704`: busca `[data-filter-bar]`, el siguiente hermano `[data-filter-grid]`, y muestra/oculta `.product-card` con `c.style.display = show ? '' : 'none'` según `c.getAttribute('data-w') === w`; actualiza `[data-filter-count]` con `n + ' Modell(e)'`. El atributo que consume, `data-w`, **sí existe** en 9 `.product-card` de `site/pages/sport.html` (metadata de ancho lista para un futuro filtro de tamaño, ver nota de §2). Pero `[data-filter-bar]`, `[data-filter-grid]` y `.filter-pill` (el disparador) **no aparecen en ninguna página**, así que el bloque nunca se ejecuta con datos reales: sigue inerte. Para Claude Code: si se replica `.product-card` con datos de Pavivasa, hay que decidir si se conserva o se descarta ese `data-w`.

---

## 4. Tarjetas una a una

### 4.1 `.product-card` (tarjeta de producto)

**(a) DOM literal** — `site/index.html:L294-L301` (idéntico en `site/categories/storage-tents.html:L155-L163` con rutas `../assets/`):

```html
<a class='product-card' href='/products/storage-tent-9x20'>
  <div class="product-card__media"><picture><source type="image/webp" srcset="assets/images/rundbogenhalle-9x20-01-800.webp 800w, assets/images/rundbogenhalle-9x20-01-1200.webp 1200w, assets/images/rundbogenhalle-9x20-01.webp 2000w"><img src="assets/images/rundbogenhalle-9x20-01.png" alt="Arched Storage Tent 9.15 × 20 × 4.50 m" loading="lazy" decoding="async"></picture></div>
  <div class="product-card__body">
    <h3 class="product-card__title">Arched Storage Tent 9.15 × 20 × 4.50 m</h3>
    <p class="product-card__meta">Versatile shelter for farming &amp; industry</p>
    <div class="product-card__badges"><span class="product-card__badge">9.15 × 20 × 4.50 m</span><span class="product-card__badge product-card__badge--alt">ca. 183 m²</span></div>
    <span class="btn btn--primary product-card__cta">View details</span>
  </div>
</a>
```

Toda la tarjeta es un `<a>`; el CTA es un `<span>` con clases de botón (no un `<button>` ni `<a>` anidado). Imagen: `<picture>` con `source webp` a 800/1200/2000 w sin atributo `sizes`, `loading="lazy" decoding="async"`. En `index.html:L313` una tarjeta usa `src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"` (GIF 1×1 como placeholder, el webp real va en `<source>`).

**(b) CSS** (`L588-L640`, `L1010-L1033`, `L1624-L1625`):

```css
.product-card{
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:var(--radius);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}   /* sobrescrita por L3399 → .25s */
.product-card:hover{
  transform:translateY(-4px);
  box-shadow:var(--shadow-card);
  border-color:var(--brand-green)}
.product-card__media{
  aspect-ratio:4/3;
  background:var(--color-bg-soft);
  overflow:hidden}
.product-card__media img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .4s ease}
.product-card:hover .product-card__media img{
  transform:scale(1.04)}
.product-card__body{
  padding:20px;
  display:flex;
  flex-direction:column;
  flex:1}
.product-card__title{
  font-size:1.05rem;
  font-weight:700;
  color:var(--color-title);
  margin:0 0 8px;
  min-height:2.6em}
.product-card__meta{
  font-size:.85rem;
  color:var(--color-sub-title);
  margin:0 0 16px;
  flex:1}
.product-card__price{           /* sin uso en páginas */
  color:var(--brand-green);
  font-weight:800;
  font-size:1.15rem;
  margin-bottom:14px}
.product-card__price--quote{    /* sin uso */
  color:var(--color-sub-title);
  font-weight:700;
  font-size:.95rem}
.product-card__cta{
  margin-top:auto}
.product-card__badges{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-bottom:14px}
.product-card__badge{
  display:inline-block;
  padding:4px 10px;
  background:rgba(26,165,133,.10);
  color:var(--brand-green-dark);
  font-weight:800;
  font-size:.78rem;
  letter-spacing:.02em;
  border-radius:999px}
.product-card__badge--alt{
  background:var(--color-bg-soft);
  color:var(--color-title)}
.product-card__eyebrow{         /* sin uso */
  color:var(--brand-green);
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.12em;
  font-size:.72rem;
  margin-bottom:8px}
@media (max-width:560px){ .product-card{ border-radius:10px} }
```

Layout interno: `min-height:2.6em` en el título iguala alturas (2 líneas a `line-height:1.15`… el `min-height` se calcula sobre `font-size`, 2.6em ≈ 2 líneas + holgura); `.product-card__meta{flex:1}` empuja badges y CTA al fondo; `.product-card__cta{margin-top:auto}` alinea el botón abajo.

Variante sport (`L4741-L4751`, y `.sport-world .sp-section .product-card` `L4446-L4455`):

```css
.sport-world .product-card{ background:#fff; border:1px solid #000; border-radius:16px}
.sport-world .product-card__title{ color:#000}
.sport-world .product-card__meta{ color:#323232}
.sport-world .product-card__badge{ background:var(--sport-lime); color:#000}
```

`site/pages/sport.html` es la **única página** donde se renderiza esta variante: sus 10 `.product-card` (riding-arena-covers + pickleball) viven dentro de `.sport-world .sp-section`, con borde `1px solid #000`, radio `16px` y badge fondo `var(--sport-lime)` texto `#000` (en vez de la receta base gris/verde).

Uso adicional: en las páginas de producto (`site/products/fabric-building-12x18.html:L143-L145`) `.product-card__badges` + `.product-card__badge` se reutilizan sueltos dentro de `.product-detail__info` como píldoras de especificación.

**(c) Estados**: hover (tabla §3.1); focus: no está en el código; `is-active`: no aplica.

**(d) Tilt**: sí (§3.2). **(e) Reveal**: sí (§3.3). 

**(f) Rejilla** `.product-grid` (`L584-L587`, `L890`, `L922`, `L943`):

```css
.product-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px}
@media (max-width:1100px){ .product-grid{ grid-template-columns:repeat(3,1fr)} }
@media (max-width:900px){  .product-grid{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px){  .product-grid{ grid-template-columns:1fr} }
```

**(g) Badges**: dos por tarjeta, siempre en el mismo orden: dimensiones (`.product-card__badge`, verde) + superficie (`--alt`, gris). Posición: en el cuerpo, entre `__meta` y el CTA, no sobre la imagen. 86 instancias de cada una en el sitio.

### 4.2 `.case-card` (proyecto de referencia)

**(a) DOM literal** — `site/index.html:L431-L439`:

```html
<a class='case-card' href='/projects/family-olive-farm-jaen'>
  <div class="case-card__media"><picture><source type="image/webp" srcset="assets/images/rundbogenhalle-9x20-01-800.webp 800w, assets/images/rundbogenhalle-9x20-01-1200.webp 1200w, assets/images/rundbogenhalle-9x20-01.webp 2000w"><img src="assets/images/rundbogenhalle-9x20-01.png" alt="The M. family" loading="lazy" decoding="async"></picture></div>
  <div class="case-card__body">
    <div class="case-card__meta"><span class="case-card__loc">📍 Lower Austria</span><span class="case-card__year">2025</span></div>
    <h3 class="case-card__title">The M. family</h3>
    <p class="case-card__teaser">One shelter for hay, straw and farm machinery — installed in one day, permit-free*.</p>
    <div class="case-card__footer"><span class="case-card__hall">Arched Storage Tent 9.15 × 20 × 4.50 m</span><span class="case-card__cta">Read →</span></div>
  </div>
</a>
```

Solo existe en la home (3 tarjetas). `reference-projects.html` y `projects/*.html` **no usan `.case-card`**. El pin de localización es el emoji `📍` en texto. `.case-card__loc` **no tiene regla CSS** (hereda de `__meta`).

**(b) CSS** (`L2080-L2147`):

```css
.case-card{
  display:flex;
  flex-direction:column;
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:var(--radius);
  overflow:hidden;
  transition:transform .2s,box-shadow .2s,border-color .2s;   /* → L3399 .25s ease */
  color:var(--color-title)}
.case-card:hover{
  transform:translateY(-4px);
  box-shadow:var(--shadow-card);
  border-color:var(--brand-green)}
.case-card__media{
  aspect-ratio:4/3;
  overflow:hidden;
  background:var(--color-bg-soft)}
.case-card__media img{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .4s}
.case-card:hover .case-card__media img{
  transform:scale(1.04)}
.case-card__body{
  padding:22px;
  display:flex;
  flex-direction:column;
  gap:10px;
  flex:1}
.case-card__meta{
  display:flex;
  justify-content:space-between;
  font-size:.78rem;
  color:var(--color-sub-title);
  font-weight:700;
  letter-spacing:.03em}
.case-card__year{
  color:var(--brand-green);
  font-weight:800}
.case-card__title{
  margin:0;
  font-size:1.15rem;
  color:var(--color-title)}
.case-card__teaser{
  margin:0;
  font-size:.92rem;
  color:var(--color-text);
  line-height:1.5;
  flex:1}
.case-card__footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  padding-top:14px;
  border-top:1px solid var(--color-border);
  font-size:.82rem}
.case-card__hall{
  color:var(--color-sub-title);
  font-weight:600}
.case-card__cta{
  color:var(--brand-green);
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.04em;
  font-size:.76rem;
  white-space:nowrap}
```

**(c)** Hover: tabla §3.1. Focus/is-active: no está en el código. **(d)** Tilt: sí. **(e)** Reveal: sí.

**(f) Rejilla** `.case-grid` (`L2076-L2079`, `L2314`, `L2328`):

```css
.case-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px}
@media (max-width:1100px){ .case-grid{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px){  .case-grid{ grid-template-columns:1fr} }
```

**(g) Badges**: no hay píldora; el "año" (`.case-card__year`) en verde 800 hace de etiqueta, y el modelo (`.case-card__hall`) va en el pie.

Tarjetas hermanas solo-CSS de las páginas de proyecto: `.case-hall-card` (`L2243-L2277`: `display:flex; align-items:center; gap:14px; margin-top:18px; padding:12px; background:var(--color-bg-soft); border-radius:10px; transition:background .2s`; hover `background:rgba(26,165,133,.08)`; `img 72×72 object-fit:cover border-radius:8px`; `span .72rem uppercase .05em 700`; `strong .95rem`; `__link color:var(--brand-green)!important`), `.case-stat` (`L2160`: fondo soft, radio 10, padding 14px 18px), `.case-gallery__item` (`L2302`: 4/3, radio 10). Ninguna aparece en las 8 páginas `site/projects/*.html`.

### 4.3 `.collection-card` (categoría con imagen a sangre)

**(a) DOM literal** — `site/index.html:L238-L244`:

```html
<a class='collection-card' href='/categories/storage-tents'>
  <picture><source type="image/webp" srcset="assets/images/rundbogenhalle-9x20-05-800.webp 800w, assets/images/rundbogenhalle-9x20-05-1200.webp 1200w, assets/images/rundbogenhalle-9x20-05.webp 2000w"><img src="assets/images/rundbogenhalle-9x20-05.jpg" alt="Arched storage tents" loading="lazy" decoding="async"></picture>
  <div class="collection-card__label">
    <span>Category</span>
    <h3>Arched storage tents</h3>
  </div>
</a>
```

En el bloque sport de la home (`index.html:L260-L281`) la imagen es `<img>` directo sin `<picture>`. En `site/pages/calculators.html:L139-L141` la tarjeta **no lleva imagen** (solo `__label`): queda el degradado `::after` sobre fondo transparente (no hay `background` declarado en `.collection-card`).

**(b) CSS** (`L547-L583`):

```css
.collection-card{
  position:relative;
  border-radius:var(--radius);
  overflow:hidden;
  aspect-ratio:16/10;
  display:block;
  color:#fff}
.collection-card img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .4s ease}
.collection-card::after{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(180deg,rgba(6,24,39,0) 40%,rgba(6,24,39,.85) 100%)}
.collection-card:hover img{
  transform:scale(1.05)}
.collection-card__label{
  position:absolute;
  left:24px;
  right:24px;
  bottom:20px;
  z-index:1}
.collection-card__label h3{
  color:#fff;
  margin:0 0 4px;
  font-size:1.6rem}
.collection-card__label span{
  color:var(--brand-lime);
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
  font-size:.8rem}
```

Sin borde, sin sombra, sin elevación: el único hover es el zoom 1.05 de la imagen. El texto va sobre un degradado de `#061827` del 0 % (a 40 % de altura) al 85 % (abajo). El `span` (eyebrow "Category") va **antes** del `h3` en el DOM.

**(c)** Focus/is-active: no está en el código. **(d)** Tilt: **no**. **(e)** Reveal: sí.

**(f) Rejilla** `.collections, .kategorien` (`L533-L546`, `L926`, `L4225-L4232`):

```css
.collections,.kategorien{ display:grid; grid-template-columns:repeat(2,1fr); gap:24px}
.kategorien--center{ grid-template-columns:minmax(0,1fr); max-width:calc(50% - 12px); margin-left:auto; margin-right:auto}
@media (max-width:720px){ .collections,.kategorien,.kategorien--center{ grid-template-columns:1fr; max-width:none} }
@media (max-width:900px){ .collections{ grid-template-columns:1fr} }
/* bloque sport de la home: 3 tarjetas → la impar final se centra a media anchura */
.world-block--sport .kategorien .collection-card:last-child:nth-child(odd){
  grid-column:1 / -1; justify-self:center; width:calc(50% - 12px)}
@media (max-width:760px){ .world-block--sport .kategorien .collection-card:last-child:nth-child(odd){ width:100%} }
```

Cabecera del bloque: `.world-block__head` (`L4180-L4187`: flex baseline space-between, `border-bottom:2px solid var(--color-border)`, `margin-bottom:22px`) con `h3 1.5rem` y `.world-block__link` (verde 800 uppercase .8rem). Variante sport: borde `1px #000` + subrayado `64×3px #e3fc03` vía `::after`.

**(g) Badge**: el `span` lima uppercase dentro de `__label` (no es píldora, texto plano).

### 4.4 `.calc-card` (herramienta / calculadora)

**(a) DOM literal** — `site/index.html:L401-L406` (dentro de `<section class="section section--brand">`):

```html
<a class='calc-card' href='/pages/round-bale-calculator'>
  <div class="calc-card__icon"><svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="12" width="60" height="34" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="12" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="32" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="52" cy="32" r="9" fill="#fff" opacity=".9"/><circle cx="22" cy="20" r="8" fill="#fff" opacity=".7"/><circle cx="42" cy="20" r="8" fill="#fff" opacity=".7"/></svg></div>
  <h3>Round Bale Calculator</h3>
  <p>How many hay bales fit in each shelter? With stack visualisation.</p>
  <span class="calc-card__cta">Calculate now →</span>
</a>
```

Icono: SVG inline `viewBox="0 0 64 48"` con trazos `#fff`. La flecha del CTA es el carácter `→` en texto.

**(b) CSS** base (`L1164-L1216`) y variante `.section--brand` (`L285-L310`) y `.section--dark` (`L1174-L1181`, `L1196`, `L1214`, sin uso en páginas):

```css
.calc-card{
  display:flex;
  flex-direction:column;
  gap:12px;
  background:#fff;
  color:var(--color-title);
  border:1px solid var(--color-border);
  border-radius:var(--radius);
  padding:28px;
  transition:transform .2s,box-shadow .2s,border-color .2s}   /* → L3399 */
.calc-card:hover{
  transform:translateY(-4px);
  box-shadow:0 20px 40px rgba(6,24,39,.14);
  border-color:var(--brand-green)}
.calc-card--lg{ padding:36px}          /* sin uso */
.calc-card__icon{
  width:72px;
  height:72px;
  border-radius:16px;
  background:rgba(26,165,133,.12);
  display:flex;
  align-items:center;
  justify-content:center}
.calc-card__icon svg{ width:48px; height:36px}
.calc-card h3{ margin:6px 0 4px}
.calc-card p{ margin:0; font-size:.95rem; flex:1}
.calc-card__cta{
  color:var(--brand-green);
  font-weight:800;
  letter-spacing:.04em;
  text-transform:uppercase;
  font-size:.82rem;
  margin-top:6px}

/* variante usada en la home: sección con degradado verde */
.section--brand{ background:linear-gradient(135deg,#1aa585 0%,#138d70 100%); color:#fff}
.section--brand .calc-card{
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.18);
  color:#fff}
.section--brand .calc-card h3{ color:#fff}
.section--brand .calc-card p{ color:#eaf6f1}
.section--brand .calc-card__icon{ background:rgba(255,255,255,.14)}
.section--brand .calc-card:hover{
  background:rgba(255,255,255,.14);
  transform:translateY(-3px)}
.section--brand .calc-card__cta{ color:#fff; font-weight:700}
.section--brand .calc-card svg [stroke]{ stroke:#fff !important}
.section--brand .calc-card svg [fill]:not([fill="none"]){ fill:#fff !important}
.section--brand .calc-card svg rect[fill="none"]{ stroke:#fff !important}
.section--brand .calc-card svg path[fill]:not([fill="none"]){ fill:rgba(255,255,255,0.9) !important}
.section--brand .calc-card svg circle[fill="#061827"]{ fill:#0d4f3f !important}

/* variante oscura (solo CSS) */
.section--dark .calc-card{ background:rgba(255,255,255,.06); color:#fff; border-color:rgba(255,255,255,.12)}
.section--dark .calc-card p{ color:#c7d3db}
.section--dark .calc-card__icon{ background:rgba(126,199,0,.14)}
.section--dark .calc-card__cta{ color:var(--brand-lime)}
```

En `.section--brand`, la sombra `0 20px 40px rgba(6,24,39,.14)` y el `border-color:var(--brand-green)` de `.calc-card:hover` (`L1182`, posterior a `L285`) siguen aplicándose en hover (cascada: igual especificidad, gana la posterior).

**(c)** Focus/is-active: no está en el código. **(d)** Tilt: sí (el inline `translateY(-4px)` del JS anula el `-3px` de la variante brand). **(e)** Reveal: sí.

**(f) Rejilla** `.calc-grid` (`L1160-L1163`, `L1540`, `L1610`):

```css
.calc-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px}
@media (max-width:1100px){ .calc-grid{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px){  .calc-grid{ grid-template-columns:1fr} }
```

**(g) Badges**: ninguno.

### 4.5 `.feature` (ventaja con icono + `<details>`)

**(a) DOM literal** — `site/index.html:L153-L161`:

```html
<div class="feature">
  <div class="feature__icon"><img src="assets/images/selection_quote.png" alt="" role="presentation" aria-hidden="true" loading="lazy"></div>
  <h3>Permit-free*</h3>
  <p>Temporary structures — no months of paperwork.</p>
  <details class="feature__more">
    <summary>More info</summary>
    <p>Permit exemption depends on construction type, location, regional rules, snow/wind load zones and your local authority. …</p>
  </details>
</div>
```

Segunda sección de la home (`index.html:L509-L525`): `.feature` sin icono ni `<details>`, con `style="text-align:left"` y la rejilla inline `grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px`.

**(b) CSS** (`L468-L532`, `L3885-L3889`):

```css
.feature{
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:var(--radius);
  padding:28px;
  transition:transform .2s ease,box-shadow .2s ease}
.feature:hover{
  transform:translateY(-4px);
  box-shadow:var(--shadow-card)}
.feature__icon{
  width:56px;
  height:56px;
  border-radius:14px;
  background:linear-gradient(135deg,var(--brand-green),var(--brand-green-deep));
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:16px}
.feature__icon img{
  width:32px;
  height:32px;
  filter:brightness(0) invert(1)}      /* PNG negro → blanco */
.feature h3{ margin:0 0 8px; color:var(--color-title)}
.feature p{ font-size:.95rem; margin:0}
.feature__more{ margin-top:10px; font-size:.85rem}
.feature__more summary{
  cursor:pointer;
  color:var(--brand-green-deep);
  font-weight:700;
  list-style:none;
  display:inline-flex;
  align-items:center;
  gap:6px;
  user-select:none}
.feature__more summary::-webkit-details-marker{ display:none}
.feature__more summary::before{
  content:"i";
  display:inline-flex;
  width:16px;
  height:16px;
  border-radius:50%;
  background:var(--brand-green);
  color:#fff;
  align-items:center;
  justify-content:center;
  font-size:.7rem;
  font-weight:800;
  font-style:italic;
  font-family:Georgia,serif}
.feature__more[open] summary::before{
  content:"−";
  font-family:inherit;
  font-style:normal}
.feature__more p{
  margin-top:8px;
  font-size:.85rem;
  color:var(--color-sub-title);
  line-height:1.55}
/* táctil */
.feature__more summary,.faq-item summary,details>summary{
  min-height:44px; display:flex; align-items:center; padding:8px 0}
```

Sport (`L4752-L4759`): `.sport-world .feature{background:#fff;border:1px solid #000;border-radius:16px}`, `h3 #000`, `p #323232`.

**(c)** Hover sin cambio de borde. Focus: no está en el código. **(d)** Tilt: no. **(e)** Reveal: sí.

**(f) Rejilla** `.features` (`L464-L467`, `L894`, `L947`):

```css
.features{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px}
@media (max-width:1100px){ .features{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px){  .features{ grid-template-columns:1fr} }
```

**(g)** Sin badges.

### 4.6 `.review` (reseña)

**(a) DOM literal** — `site/index.html:L479-L483`:

```html
<article class="review">
  <div class="review__head"><div class="stars" aria-label="5 of 5"><svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="#f4c95e" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><span class="review__date">2025-11</span></div>
  <p class="review__text">"Absolutely top! Shelter was up in one day, crew was punctual and tidy. No issues since, even in winter with heavy snow."</p>
  <div class="review__meta"><div><strong>Markus H.</strong><span>Lower Austria</span></div><span class="review__hall">Arched Tent 20×9 m</span></div>
</article>
```

En la home cada reseña tiene **una sola** estrella SVG (16 px) con `aria-label="5 of 5"`; en `customer-reviews.html:L139-L147` hay cinco `<svg class="star">` y no hay `__date` ni `__hall`. Estrella: `fill="#f4c95e"`, `viewBox 0 0 24 24`, path de estrella de 5 puntas.

**(b) CSS** (`L1927-L1931`, `L1984-L2029`):

```css
.stars{ display:inline-flex; gap:2px; align-items:center}
.stars .star{ flex-shrink:0}
.review{
  background:#fff;
  border:1px solid var(--color-border);
  border-radius:var(--radius);
  padding:22px;
  display:flex;
  flex-direction:column;
  gap:14px}
.review__head{ display:flex; justify-content:space-between; align-items:center}
.review__date{ font-size:.8rem; color:var(--color-sub-title); font-weight:600}
.review__text{
  margin:0;
  font-size:.95rem;
  color:var(--color-title);
  line-height:1.55;
  flex:1}
.review__meta{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  padding-top:12px;
  border-top:1px solid var(--color-border);
  gap:12px;
  font-size:.85rem}
.review__meta strong{ display:block; color:var(--color-title); font-size:.9rem}
.review__meta span{ color:var(--color-sub-title); font-size:.8rem}
.review__hall{
  background:rgba(26,165,133,.10);
  color:var(--brand-green-dark);
  padding:4px 10px;
  border-radius:50px;
  font-weight:800;
  font-size:.72rem;
  letter-spacing:.03em;
  white-space:nowrap}
```

**(c)** **Sin hover** (no hay regla `.review:hover`). Focus/is-active: no está en el código. **(d)** Tilt: no. **(e)** Reveal: sí.

**(f) Rejilla** `.reviews-grid` (`L1980-L1983`, `L2312`, `L2326`) y cabecera `.reviews-head` (`L1971-L1979`, `L2338`):

```css
.reviews-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px}
@media (max-width:1100px){ .reviews-grid{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px){  .reviews-grid{ grid-template-columns:1fr} }
.reviews-head{ display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:20px; margin-bottom:32px}
@media (max-width:560px){ .reviews-head{ flex-direction:column; align-items:flex-start} }
```

**(g) Badge**: `.review__hall` (declarada verde 10 %, `.72rem`, `border-radius:50px`), en el pie a la derecha, con `white-space:nowrap`. Pero por especificidad CSS (determinística, no depende del navegador) el elemento es también un `span` dentro de `.review__meta`, y `.review__meta span{color:var(--color-sub-title);font-size:.8rem}` (`L2018`, especificidad 0,1,1) **gana** a `.review__hall{color:var(--brand-green-dark);font-size:.72rem}` (`L2021`, especificidad 0,1,0) en `color` y `font-size`, con independencia del orden de las reglas. **En el sitio real la píldora se renderiza gris `#535353` / `.8rem`, no verde `#12755e` / `.72rem`: es un bug de especificidad del CSS original.** Para la réplica (`Badge variant="hall"`, §7.3) se recomienda implementar el aspecto **intencionado** (verde, `.72rem`) salvo que se pida reproducir el bug.

### 4.7 `.rating-badge` (píldora de valoración)

**(a) DOM literal** — `site/index.html:L473-L476` (versión completa) y `L140` (compacta en el cine-hero):

```html
<a class='rating-badge' href='/pages/customer-reviews'>
  <div class="stars" aria-label="5 of 5 stars"><svg class="star" width="18" height="18" …fill="#f4c95e"…></svg></div>
  <div class="rating-badge__text"><strong>4.96 out of 5</strong><span>from over 127 customer reviews</span></div>
</a>

<a class='rating-badge rating-badge--compact' href='/pages/customer-reviews'><div class="stars" aria-label="5 of 5 stars">(5 × svg.star 14×14)</div><span><strong>4.96 / 5</strong> from 127+ reviews</span></a>
```

**(b) CSS** (`L1933-L1968`, `L3719-L3724`, `L5005-L5009`, `L6079-L6080`):

```css
.rating-badge{
  display:inline-flex;
  align-items:center;
  gap:12px;
  padding:10px 18px;
  border-radius:50px;
  background:rgba(255,255,255,.92);
  color:var(--color-title);
  font-weight:700;
  box-shadow:0 4px 14px rgba(6,24,39,.1);
  transition:transform .2s,box-shadow .2s}
.rating-badge:hover{
  transform:translateY(-2px);
  box-shadow:0 10px 24px rgba(6,24,39,.15);
  color:var(--color-title)}
.rating-badge__text{ display:flex; flex-direction:column; line-height:1.2; font-size:.82rem}
.rating-badge__text strong{ font-size:1rem; color:var(--color-title)}
.rating-badge__text span{ color:var(--color-sub-title); font-weight:600}
.rating-badge--compact{ padding:8px 14px; font-size:.82rem; gap:8px}
.rating-badge--compact span{ color:var(--color-title); font-weight:600}
.rating-badge--compact strong{ font-weight:800}
@media (max-width:900px){
  .rating-badge,.rating-badge--compact{ min-height:var(--touch-target-min); padding:10px 16px; display:inline-flex; align-items:center; gap:8px} }
.world-hero__badge .rating-badge,.world-hero__badge .rating-badge--compact{
  background:rgba(255,255,255,.94);
  box-shadow:0 6px 22px rgba(6,24,39,.22);
  -webkit-backdrop-filter:blur(6px);
  backdrop-filter:blur(6px)}
.cine-hero__rating .rating-badge{ box-shadow:0 8px 26px rgba(0,0,0,.28)}
```

**(c)** Hover −2px. Focus: no está en el código. **(d)** Tilt: no. **(e)** Reveal: no.

### 4.8 `.trust-item` (cifra de confianza, barra oscura)

**(a) DOM** — `site/index.html:L337-L344`:

```html
<section class="trust-bar">
  <div class="container trust-bar__grid">
    <div class="trust-item"><strong>220 kg/m²</strong><span>Standard snow load (reinforceable)</span></div>
    …
```

**(b) CSS** (`L3430-L3462`):

```css
.trust-bar{ background:var(--brand-dark); color:#dfe7ea; padding:28px 0; border-bottom:1px solid rgba(255,255,255,.08)}
.trust-bar__grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; text-align:center}
.trust-item strong{ display:block; color:var(--brand-lime); font-size:1.3rem; font-weight:800; margin-bottom:4px}
.trust-item span{ font-size:.85rem; color:#9eb3bd}
.trust-item em{ font-style:normal; color:#6a8292}
@media (max-width:900px){ .trust-bar__grid{ grid-template-columns:1fr 1fr; gap:20px} }
@media (max-width:560px){ .trust-bar__grid{ grid-template-columns:1fr} }
```

Sin caja propia (sin fondo, borde ni sombra). Sin hover, sin tilt, sin reveal.

### 4.9 `.press-item` (logotipo de prensa en marquesina)

**(a) DOM** — `site/index.html:L346-L365`: `.press-strip > .container > .press-strip__label + .press-strip__logos > .press-item × 7 + 7 duplicados con aria-hidden="true"`. Son **texto**, no imágenes.

**(b) CSS** (`L3466-L3512`):

```css
.press-strip__logos{
  display:flex; gap:40px; flex:1; overflow:hidden;
  mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);
  animation:press-scroll 40s linear infinite;
  align-items:center}
.press-item{
  flex-shrink:0;
  color:var(--color-title);
  font-family:Georgia,serif;
  font-style:italic;
  font-size:1.05rem;
  font-weight:700;
  opacity:.65;
  transition:opacity .2s;
  white-space:nowrap}
.press-item:hover{ opacity:1}
.press-strip__logos:hover{ animation-play-state:paused}
@keyframes press-scroll{ from{ transform:translateX(0)} to{ transform:translateX(-50%)} }
```

El hover no solo sube la opacidad del logo (`.press-item:hover`, `L3497`): el **contenedor** `.press-strip__logos:hover{animation-play-state:paused}` (`L3624-L3625`) pausa el marquee entero al pasar el ratón por encima, para poder leer los logos en movimiento.

Reveal: sí (cada `.press-item` recibe `.reveal`). Tilt: no.

### 4.10 `.three-d-cta` (bloque CTA de vista 3D con before/after)

**(a) DOM** — `site/index.html:L370-L390`: `.three-d-cta > .three-d-cta__text (section__eyebrow + h2 + p + botón) + .three-d-cta__visual > .before-after[data-before-after]`.

**(b) CSS** (`L3278-L3304`):

```css
.three-d-cta{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:40px;
  align-items:center;
  background:linear-gradient(135deg,#f6f8f7,#eaf3f0);
  border-radius:var(--radius);
  padding:48px;
  border:1px solid var(--color-border)}
.three-d-cta__text h2{ margin:8px 0 14px; font-size:clamp(1.6rem,3vw,2.2rem)}
.three-d-cta__text p{ color:var(--color-text); font-size:1.02rem; line-height:1.6; margin:0}
.three-d-cta__visual{ border-radius:var(--radius); overflow:hidden; box-shadow:0 20px 40px rgba(6,24,39,.15)}
@media (max-width:900px){ .three-d-cta{ grid-template-columns:1fr; padding:28px} }
```

Sin hover. Reveal: sí. Tilt: no.

### 4.11 `.team-wall__item` (mosaico de fotos de equipo, masonry por columnas CSS)

**(a) DOM literal** — `site/index.html:L212`:

```html
<figure class="team-wall__item"><picture><source type="image/webp" srcset="assets/images/team-globotent-01-800.webp 800w, assets/images/team-globotent-01-1200.webp 1200w, assets/images/team-globotent-01.webp 2000w" sizes="(max-width:720px) 50vw, 320px"><img src="assets/images/team-globotent-01.jpg" alt="The Globotent installation team on site" loading="lazy" decoding="async"></picture></figure>
```

**(b) CSS** (`L5425-L5470`):

```css
.team-wall{ column-count:3; column-gap:14px; margin-top:clamp(24px,4vw,40px)}
.team-wall__item{
  break-inside:avoid;
  margin:0 0 14px;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 8px 26px rgba(6,24,39,.10);
  background:#eef1f3;
  position:relative;
  transition:transform .4s cubic-bezier(.2,.7,.2,1),box-shadow .4s ease}
.team-wall__item img{
  display:block;
  width:100%;
  height:auto;
  transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.team-wall__item::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:16px;
  box-shadow:inset 0 0 0 1px rgba(6,24,39,.06);
  pointer-events:none}
.team-wall__item:hover{ transform:translateY(-4px); box-shadow:0 16px 40px rgba(6,24,39,.18)}
.team-wall__item:hover img{ transform:scale(1.05)}
@media(max-width:900px){ .team-wall{ column-count:2} }
@media(max-width:480px){ .team-wall{ column-count:2; column-gap:10px} .team-wall__item{ margin-bottom:10px; border-radius:13px} }
```

Es la única tarjeta con **sombra en reposo** y easing personalizado `cubic-bezier(.2,.7,.2,1)`. Sin aspect-ratio (altura natural de la foto). Reveal: el contenedor `.team-wall`. Tilt: no.

### 4.12 `.jobcard` (oferta de empleo)

**(a) DOM literal** — `site/pages/jobs.html:L161-L174`:

```html
<a class='jobcard reveal' href='/pages/jobs/studentische-assistenz'>
  <div class="jobcard__top">
    <span class="jobcard__ico" aria-hidden="true">🎬</span>
    <span class="jobcard__tag">Werkstudium · Sommerjob</span>
  </div>
  <h2 class="jobcard__title">Studentische Assistenz for Content Creation &amp; Geschäftsführung</h2>
  <span class="jobcard__gender">(m/w/d)</span>
  <div class="jobcard-meta"><span class="jobcard-meta__chip">Wien (Schwedenplatz) &amp; Homeoffice</span>
<span class="jobcard-meta__chip">Hybrid</span>
<span class="jobcard-meta__chip">20–40 h/Woche, flexibel</span>
<span class="jobcard-meta__chip jobcard-meta__chip--salary">from € 1.273,50 brutto/Monat</span></div>
  <p class="jobcard__teaser">Zur Unterstützung unseres wachsenden Companys suchen wir …</p>
  <span class="jobcard__link">Stelle ansehen <span aria-hidden="true">→</span></span>
</a>
```

Icono = emoji en texto. Título es `<h2>`.

**(b) CSS** (`L5538-L5628`, `L5807-L5811`):

```css
.jobcard{
  position:relative;
  display:flex;
  flex-direction:column;
  background:var(--color-bg);
  border:1px solid var(--color-border);
  border-radius:20px;
  padding:28px 26px 24px;
  overflow:hidden;
  transition:transform .2s,box-shadow .2s,border-color .2s}
.jobcard::after{ display:none}
.jobcard::before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  height:4px;
  width:100%;
  background:linear-gradient(90deg,var(--brand-green),var(--brand-lime));
  transform:scaleX(0);
  transform-origin:left;
  transition:transform .25s}
.jobcard:hover{
  transform:translateY(-5px);
  box-shadow:0 22px 50px rgba(6,24,39,.13);
  border-color:transparent}
.jobcard:hover::before{ transform:scaleX(1)}
.jobcard__top{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px}
.jobcard__ico{ font-size:2rem; line-height:1}
.jobcard__tag{
  background:rgba(26,165,133,.10);
  color:var(--brand-green-dark);
  font-weight:800;
  font-size:.68rem;
  text-transform:uppercase;
  letter-spacing:.05em;
  padding:5px 11px;
  border-radius:50px;
  text-align:right}
.jobcard__title{ font-size:1.22rem; line-height:1.3; margin:0; color:var(--color-title)}
.jobcard__gender{ display:block; color:var(--color-sub-title); font-size:.84rem; font-weight:600; margin-top:5px}
.jobcard-meta{ display:flex; flex-wrap:wrap; gap:7px; margin:16px 0 14px}
.jobcard-meta__chip{
  background:var(--color-bg-soft);
  border:1px solid var(--color-border);
  color:var(--color-title);
  font-size:.76rem;
  font-weight:600;
  padding:5px 11px;
  border-radius:50px}
.jobcard-meta__chip--salary{ background:rgba(26,165,133,.10); border-color:transparent; color:var(--brand-green-dark); font-weight:800}
.jobcard__teaser{ color:var(--color-text); font-size:.92rem; line-height:1.55; margin:0 0 20px; flex-grow:1}
.jobcard__link{
  display:inline-flex;
  align-items:center;
  gap:7px;
  color:var(--brand-green-dark);
  font-weight:800;
  font-size:.9rem;
  text-transform:uppercase;
  letter-spacing:.03em}
.jobcard__link span{ transition:transform .2s}
.jobcard:hover .jobcard__link span{ transform:translateX(4px)}
```

Tres micro-animaciones en hover: elevación −5 px, barra superior de 4 px que crece de izquierda a derecha (`scaleX 0→1`, `.25s`) y flecha que se desplaza 4 px. `border-color:transparent` en hover (el borde desaparece bajo la sombra).

**(f) Rejilla** `.jobs-grid` (`L5534-L5537`, `L5789`): `repeat(3,1fr) gap:24px` → `≤900px: 1fr`.

**(g) Badges**: `.jobcard__tag` (verde, uppercase `.68rem`, arriba a la derecha junto al emoji) y chips `.jobcard-meta__chip` (gris con borde) + `--salary` (verde sin borde).

### 4.13 `.job-other` (otras ofertas, fila compacta)

**(a) DOM literal** — `site/pages/jobs/sdr-sales.html:L198-L201`:

```html
<a class='job-other' href='/pages/jobs/studentische-assistenz'>
  <span class="job-other__ico" aria-hidden="true">🎬</span>
  <span><strong>Studentische Assistenz for Content Creation &amp; Geschäftsführung</strong><small>Werkstudium · Sommerjob</small></span>
</a>
```

**(b) CSS** (`L5747-L5781`, `L5795`):

```css
.job-others{ display:grid; grid-template-columns:repeat(2,1fr); gap:16px}
.job-other{
  display:flex;
  align-items:center;
  gap:14px;
  background:var(--color-bg);
  border:1px solid var(--color-border);
  border-radius:14px;
  padding:18px 20px;
  transition:border-color .18s,transform .18s,box-shadow .18s}
.job-other::after{ display:none}
.job-other:hover{
  border-color:var(--brand-green);
  transform:translateY(-3px);
  box-shadow:0 14px 34px rgba(26,165,133,.13)}
.job-other__ico{ font-size:1.6rem; flex-shrink:0}
.job-other strong{ display:block; color:var(--color-title); font-size:.98rem; line-height:1.3}
.job-other small{ display:block; color:var(--brand-green-dark); font-weight:700; font-size:.74rem; text-transform:uppercase; letter-spacing:.04em; margin-top:4px}
@media(max-width:900px){ .job-others{ grid-template-columns:1fr} }
```

Única sombra hover teñida de verde: `rgba(26,165,133,.13)`. Reveal: sí. Tilt: no.

### 4.14 `.sp-disc` (disciplina deportiva, estilo "sport")

**(a) DOM literal** — `site/pages/sport.html:L154-L161`:

```html
<a class='sp-disc' href='/categories/padel-tennis-covers'>
  <div class="sp-disc__media"><picture><source type="image/webp" srcset="../assets/images/padel-court-05-800.webp 800w, ../assets/images/padel-court-05-1200.webp 1200w, ../assets/images/padel-court-05.webp 2000w"><img src="../assets/images/padel-court-05.jpg" alt="Padel" loading="lazy" decoding="async"></picture></div>
  <div class="sp-disc__body">
    <h3>Padel</h3>
    <p>Stützenfreie Shelters for 1–4 Courts. Konstante Bedingungen, kein Wind, ganzjährig ausgebucht.</p>
    <span class="sp-disc__cta">Entdecken →</span>
  </div>
</a>
```

**(b) CSS** (`L4360-L4413`, `L4532-L4534`):

```css
.sp-disciplines{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px}
@media (max-width:1000px){ .sp-disciplines{ grid-template-columns:repeat(2,1fr)} }
@media (max-width:820px){  .sp-disciplines{ grid-template-columns:1fr} }
.sp-disc{
  display:flex;
  flex-direction:column;
  background:#fff;
  border:1px solid #000;
  border-radius:16px;
  overflow:hidden;
  text-decoration:none;
  transition:box-shadow .25s,transform .25s}
.sp-disc:hover{
  transform:translateY(-4px);
  box-shadow:7px 7px 0 var(--sport-lime),7px 7px 0 1px #000}
.sp-disc__media{ aspect-ratio:4/3; overflow:hidden; border-bottom:1px solid #000}
.sp-disc__media img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s}
.sp-disc:hover .sp-disc__media img{ transform:scale(1.06)}
.sp-disc__body{ padding:24px}
.sp-disc__body h3{
  font-family:'Clash Display',var(--font-family);   /* Clash Display NO se carga */
  font-weight:600;
  text-transform:uppercase;
  font-size:1.5rem;
  color:#000;
  margin:0 0 10px}
.sp-disc__body p{ color:#323232; font-size:.98rem; margin:0 0 16px; line-height:1.5}
.sp-disc__cta{ font-weight:800; text-transform:uppercase; letter-spacing:.05em; font-size:.82rem; color:#000}
.sp-disc:hover .sp-disc__cta{ box-shadow:inset 0 -.5em 0 var(--sport-lime)}
```

Estética "neo-brutalista": borde negro 1 px, sombra dura desplazada 7 px en lima `#e3fc03` con contorno negro de 1 px, y subrayado grueso lima (`inset 0 -.5em`) en el CTA. Sin tilt ni reveal.

### 4.15 `.mega-item` (ítem del mega-menú)

**(a) DOM literal** — `site/categories/fabric-buildings.html:L57-L60`:

```html
<a class='mega-item' href='/categories/storage-tents'>
  <img src="../assets/images/rundbogenhalle-12x24-01.jpg" alt="" aria-hidden="true" loading="lazy">
  <span><strong>Arched Storage Tents</strong><small>11 Größen · permit-free*</small></span>
</a>
```

**(b) CSS** (`L4549-L4604`, `L4637-L4641`):

```css
.site-nav__mega{ left:-24px; width:min(720px,calc(100vw - 48px)); display:grid; grid-template-columns:1fr 1fr .8fr; gap:6px; padding:16px}
.site-nav__mega-col--sport{ background:linear-gradient(160deg,rgba(6,24,39,.05),rgba(126,199,0,.09)); border-radius:12px}
.site-nav__mega .mega-item{ display:flex; align-items:center; gap:12px; padding:8px; border-radius:10px}
.site-nav__mega .mega-item:hover{ background:rgba(26,165,133,.08)}
.site-nav__mega-col--sport .mega-item:hover{ background:rgba(126,199,0,.14)}
.site-nav__mega .mega-item img{ width:58px; height:44px; object-fit:cover; border-radius:8px; flex-shrink:0}
.site-nav__mega .mega-item span{ display:flex; flex-direction:column; line-height:1.25}
.site-nav__mega .mega-item strong{ font-weight:700; color:var(--color-title); font-size:.9rem}
.site-nav__mega .mega-item small{ color:var(--color-sub-title); font-size:.75rem; font-weight:500}
.site-nav__mega .mega-item:hover strong{ color:var(--brand-green-dark)}
@media (max-width:900px){ .site-nav__mega .mega-item img{ width:46px; height:36px} .site-nav__mega .mega-item small{ font-size:.78rem} }
```

Sin transición declarada (cambio de fondo instantáneo). Sin tilt ni reveal.

### 4.16 `.faq-item` (`<details>` acordeón)

**(a) DOM** — `site/pages/faq.html:L141`:

```html
<details class="faq-item"><summary>What sizes are available for each model?</summary><div style="padding:10px 0;color:var(--color-sub-title);line-height:1.6">…</div></details>
```

**(b) CSS** (`L2418-L2449`):

```css
.faq-list{ display:flex; flex-direction:column; gap:10px}
.faq-item{ border:1px solid var(--color-border); border-radius:10px; padding:16px 20px; background:#fff; transition:border-color .2s}
.faq-item[open]{ border-color:var(--brand-green)}
.faq-item summary{ cursor:pointer; font-weight:700; color:var(--color-title); font-size:1rem; list-style:none; display:flex; justify-content:space-between; align-items:center; gap:12px}
.faq-item summary::after{ content:"+"; color:var(--brand-green); font-size:1.6rem; font-weight:400}
.faq-item[open] summary::after{ content:"–"}
.faq-item p{ margin:12px 0 0; color:var(--color-text)}
```

Estado "activo" = atributo `[open]` nativo, borde verde. Sin animación de apertura (no hay transición de altura).

### 4.17 Tarjetas definidas solo en CSS (sin uso en las 78 páginas)

Se incluyen porque Claude Design puede querer usarlas (blog, equipo, descargas, pasos) y ya tienen especificación.

**`.blog-card`** (`L2470-L2517`): igual receta que `.case-card` pero media `aspect-ratio:16/9` y **sin zoom** de imagen (`img{width:100%;height:100%;object-fit:cover}` sin transition). Body `padding:22px; gap:10px`; `__meta .78rem 700 sub-title`; `h3 1.15rem`; `p .92rem color-text flex:1`; `__cta` verde 800 uppercase `.05em .78rem`. Rejilla `.blog-grid` `repeat(3,1fr) gap:24px` → ≤900: 2 → ≤560: 1. Está en las listas de **tilt y reveal** del JS. Relacionado `.blog-related` (`L2522-L2550`): fila `flex gap:12px` con `img 70×70 radius 6px`, borde, radio 10, `padding:10px`, hover solo `border-color` (`.15s`).

**`.team-card`** (`L2584-L2631`): `padding:22px; text-align:center; transition:border-color .2s,transform .2s`; hover `border-color:var(--brand-green); transform:translateY(-2px)` (sin sombra); `__media 96×96 border-radius:50% overflow:hidden background:soft margin:0 auto 14px`; `h3 1.05rem`; `__role` verde 800 `.82rem` uppercase `.05em`; `__region` sub-title `.82rem`; `p .88rem`. Rejilla `.team-grid repeat(4,1fr) gap:20px` → ≤900: 2 → ≤560: 1. Reveal sí, tilt no.

**`.choose-card`** (`L5056-L5126`): selector de "mundo" (industria/sport). `border-radius:18px`; `transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease`; hover `translateY(-4px)`, `box-shadow:0 18px 44px rgba(6,24,39,.13)`, `border-color:#cdd8d3`; media `16/10`, img `transition:transform .45s ease`, hover `scale(1.04)`; body `padding:clamp(20px,2.4vw,30px)`; `__eyebrow .72rem 800 uppercase .12em sub-title`; `h2 clamp(1.35rem,2vw,1.75rem)`; `__cta .85rem` verde → hover verde oscuro; `--sport{box-shadow:inset 0 4px 0 0 var(--brand-lime)}` (línea superior lima) y eyebrow verde; en hover, `.choose-card--sport:hover{box-shadow:inset 0 4px 0 0 var(--brand-lime),0 18px 44px rgba(6,24,39,.13)}` (`L5118-L5119`): la línea lima inset se **combina** con la sombra elevada estándar en el mismo `box-shadow` (no son dos propiedades separadas; en Tailwind hay que pasarlas como un único valor arbitrario, p.ej. `shadow-[inset_0_4px_0_0_var(--brand-lime),0_18px_44px_rgba(6,24,39,.13)]`, o se pierde el inset). Rejilla `.choose-cards 1fr 1fr; gap:clamp(16px,2.5vw,28px); max-width:1080px` → ≤760: `1fr; max-width:460px`.

**`.download-card`** (`L2699-L2721`): `padding:24px; text-align:center`; `__icon font-size:2.6rem` (emoji); `h3 1.1rem`; `p .92rem min-height:54px`. Rejilla `.download-grid repeat(2,1fr) gap:20px` → ≤700: 1. Sin hover. Reveal sí.

**`.how-step`** (`L3206-L3238`): `padding:28px; text-align:center`; `__num 56×56 border-radius:50% background:linear-gradient(135deg,var(--brand-green),var(--brand-green-deep)) color:#fff font-size:1.5rem 800`; `h3 1.05rem`; `p .92rem`. Rejilla `.how-steps repeat(3,1fr) gap:24px` → ≤700: 1. Sin hover. Reveal sí.

**`.cert-item`** (`L2628-L2645`): `padding:18px 22px; border-radius:10px`; `strong .95rem block`; `p .85rem`. Rejilla `.cert-grid repeat(3,1fr) gap:16px` → ≤900: `1fr 1fr` → ≤560: 1. Sin hover. Reveal sí.

**`.video-testi`** (`L2950-L3020`): receta estándar + media `16/9 background:#000`, `img opacity:.85`, botón `__play 72×72 circle background:rgba(26,165,133,.92) box-shadow:0 10px 30px rgba(0,0,0,.3) transition:transform .2s,background .2s`; hover `.video-testi__play:hover{background:var(--brand-green);transform:translate(-50%,-50%) scale(1.1)}` (`L2991-L2993`) — el hover **repite** `translate(-50%,-50%)` junto al `scale`, porque el botón está centrado con `transform` (`top:50%;left:50%`); en Tailwind, `hover:scale-110` solo, sin `hover:-translate-x-1/2 hover:-translate-y-1/2` (o sin fijar el `transform` completo en una utilidad arbitraria), descentra el botón. `__duration` abajo-derecha `background:rgba(0,0,0,.72) border-radius:4px .78rem 700`. Rejilla `repeat(3,1fr) gap:20px` → ≤900: 2 → ≤560: 1.

**`.testimonial`** (`L711-L739`): `padding:28px`; `__quote 1rem italic color-title mb 20`; `__author flex gap 12` con `img 48×48 circle`. Rejilla `.testimonials repeat(3,1fr) gap:24px` → ≤900: 1. Sin hover.

**`.rb-alt-card`** (`L1410-L1431`): fila `flex space-between; padding:10px 14px; border-radius:10px; transition:border-color .15s`; hover borde verde. **`.glossary-entry`** (`L2571-L2583`): `scroll-margin-top:100px; background:#fff`; `h3` verde oscuro `1.1rem`. **`.photo-gallery a`** (`L380-L395`): `aspect-ratio:4/3; border-radius:14px; box-shadow:0 2px 6px rgba(0,0,0,.08); cursor:zoom-in; transition:transform .25s ease,box-shadow .25s ease`; hover `translateY(-4px)` + `--shadow-card`. **`.cat-chip`** (`L396-L410`): `padding:14px 22px; border:2px solid; border-radius:14px; font-weight:700; transition:all .2s ease`; hover borde verde + `translateY(-2px)` + sombra.

**`.agro-feature__video`** (`L5845-L5972`, incluye el `@media (max-width:860px)` de reajuste): tarjeta-vídeo del bloque agro, misma receta mecánica que el resto (radio, aspect-ratio, hover lift + sombra, zoom de imagen), sin uso en las 78 páginas (`grep -rl "agro-feature" site/` vacío). `border-radius:20px; overflow:hidden; box-shadow:0 30px 70px -20px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08); aspect-ratio:16/9; background:#04101b; transition:transform .35s ease,box-shadow .35s ease` (`L5894-L5902`); `img{transition:transform .5s ease}` (`L5903-L5908`); hover `.agro-feature__video:hover{transform:translateY(-4px);box-shadow:0 40px 90px -20px rgba(0,0,0,.78),0 0 0 1px rgba(26,165,133,.4)}` + `:hover img{transform:scale(1.04)}` (`L5909-L5913`). Botón `.agro-feature__play`: círculo `78×78` centrado (`transform:translate(-50%,-50%)`), `background:rgba(26,165,133,.92)`, `box-shadow:0 10px 30px rgba(0,0,0,.5)`, `transition:transform .3s ease,background .3s ease` (`L5914-L5927`); hover (disparado por `:hover` del contenedor) `transform:translate(-50%,-50%) scale(1.08); background:var(--brand-green)` (`L5928-L5930`). `.agro-feature__badge` — píldora "en directo", única en el código: `padding:7px 13px; border-radius:999px; background:rgba(4,16,27,.72); backdrop-filter:blur(6px); font-size:.78rem; font-weight:700` con `::before{width:7px;height:7px;border-radius:50%;background:#ff3b3b;box-shadow:0 0 0 4px rgba(255,59,59,.25)}` (pulso rojo, `L5936-L5957`).

---

## 5. Badges y píldoras: catálogo

| Clase | Fondo | Texto | Padding | Radio | Fuente | Dónde | Línea |
|---|---|---|---|---|---|---|---|
| `.product-card__badge` | `rgba(26,165,133,.10)` | `#12755e` | `4px 10px` | `999px` | 800 · `.78rem` · `letter-spacing:.02em` | cuerpo de product-card, tras `__meta` | `L1015` |
| `.product-card__badge--alt` | `#f6f8f7` | `#151719` | ídem | ídem | ídem | segunda píldora (superficie) | `L1024` |
| `.sport-world .product-card__badge` | `#e3fc03` | `#000` | ídem | ídem | ídem | product-card en páginas sport | `L4749` |
| `.review__hall` | `rgba(26,165,133,.10)` | `#12755e` | `4px 10px` | `50px` | 800 · `.72rem` · `.03em` · nowrap | pie de reseña, derecha | `L2021` |
| `.jobcard__tag` | `rgba(26,165,133,.10)` | `#12755e` | `5px 11px` | `50px` | 800 · `.68rem` · uppercase · `.05em` | cabecera jobcard, derecha | `L5576` |
| `.jobcard-meta__chip` | `#f6f8f7` + borde `1px #e2e2e2` | `#151719` | `5px 11px` | `50px` | 600 · `.76rem` | fila de chips bajo el título | `L5602` |
| `.jobcard-meta__chip--salary` | `rgba(26,165,133,.10)`, borde transparente | `#12755e` | ídem | ídem | 800 | mismo | `L5807` |
| `.collection-card__label span` | — | `#7ec700` | — | — | 800 · `.8rem` · uppercase · `.08em` | eyebrow sobre imagen | `L578` |
| `.case-hero__eyebrow` | `rgba(26,165,133,.12)` | `#12755e` | `6px 14px` | `999px` | 800 · `.8rem` · uppercase · `.06em` | hero de proyecto (solo CSS) | `L2153` |
| `.sport-world .section__eyebrow` | `#e3fc03` | `#000` | `6px 13px` | `50px` | 800 · `.8rem` · uppercase · `.12em` | eyebrows de sección sport | `L4735` |
| `.filter-pill` / `.is-active` | `#fff` / `#1aa585` | `#151719` / `#fff` | `8px 16px` | `50px` | 700 · `.85rem` | filtro (sin uso) | `L4676-L4692` |
| `.padel-badge` | `#e3fc03` sólido + borde `1px solid #000` | `#000` | `7px 15px` | `50px` | 800 · uppercase · `.1em` · `.78rem` | variante sport (sin uso en páginas) | `L328-L338` |
| `.agro-feature__badge` | `rgba(4,16,27,.72)` + `backdrop-filter:blur(6px)` | `#fff` | `7px 13px` | `999px` | 700 · `.78rem` | única badge "en vivo" (pulso rojo `::before`, sin uso en páginas) | `L5936-L5957` |

**Ninguna badge se superpone a la imagen**: todas van en el cuerpo de texto (excepción: `.agro-feature__badge`, posicionada sobre el vídeo, ver §4.17). No hay badges de "nuevo", "oferta" ni descuento en el código.

---

## 6. Rejillas: resumen

| Rejilla | Base | ≤1100px | ≤1000px | ≤900px | ≤820px | ≤760/720px | ≤700px | ≤560px | Líneas |
|---|---|---|---|---|---|---|---|---|---|
| `.product-grid` | `repeat(4,1fr)` gap 24 | 3 | — | 2 | — | — | — | 1 | `L584`, `L890`, `L922`, `L943` |
| `.features` | `repeat(4,1fr)` gap 24 | 2 | — | — | — | — | — | 1 | `L464`, `L894`, `L947` |
| `.kategorien`/`.collections` | `repeat(2,1fr)` gap 24 | — | — | `.collections` 1 | — | 1 (≤720) | — | — | `L533`, `L543`, `L926` |
| `.calc-grid` | `repeat(3,1fr)` gap 24 | 2 | — | — | — | — | — | 1 | `L1160`, `L1540`, `L1610` |
| `.case-grid` | `repeat(3,1fr)` gap 24 | 2 | — | — | — | — | — | 1 | `L2076`, `L2314`, `L2328` |
| `.reviews-grid` | `repeat(3,1fr)` gap 20 | 2 | — | — | — | — | — | 1 | `L1980`, `L2312`, `L2326` |
| `.trust-bar__grid` | `repeat(4,1fr)` gap 24 | — | — | `1fr 1fr` gap 20 | — | — | — | 1 | `L3438`, `L3455`, `L3460` |
| `.team-wall` | `column-count:3` gap 14 | — | — | 2 | — | — | — | 2 (≤480, gap 10) | `L5425`, `L5456`, `L5460` |
| `.jobs-grid` | `repeat(3,1fr)` gap 24 | — | — | 1 | — | — | — | — | `L5534`, `L5789` |
| `.job-others` | `repeat(2,1fr)` gap 16 | — | — | 1 | — | — | — | — | `L5747`, `L5795` |
| `.sp-disciplines` | `repeat(4,1fr)` gap 18 | — | 2 | — | 1 | — | — | — | `L4360`, `L4365`, `L4532` |
| `.blog-grid` | `repeat(3,1fr)` gap 24 | — | — | 2 | — | — | — | 1 | `L2470`, `L2552`, `L2557` |
| `.team-grid` | `repeat(4,1fr)` gap 20 | — | — | 2 | — | — | — | 1 | `L2584`, `L2647`, `L2653` |
| `.cert-grid` | `repeat(3,1fr)` gap 16 | — | — | `1fr 1fr` | — | — | — | 1 | `L2628`, `L2649`, `L2655` |
| `.choose-cards` | `1fr 1fr` gap `clamp(16px,2.5vw,28px)` max 1080 | — | — | — | — | 1 (≤760, max 460) | — | — | `L5056`, `L5123` |
| `.download-grid` | `repeat(2,1fr)` gap 20 | — | — | — | — | — | 1 | — | `L2699`, `L2717` |
| `.how-steps` | `repeat(3,1fr)` gap 24 | — | — | — | — | — | 1 | — | `L3206`, `L3236` |
| `.video-testi-grid` | `repeat(3,1fr)` gap 20 | — | — | 2 | — | — | — | 1 | `L2950`, `L3014`, `L3018` |

Contenedor: `.container{max-width:1280px;margin:0 auto;padding:0 24px}` (`L67-L70`). Sección: `.section{padding:72px 0}` → ≤560: `48px 0` (`L269`, `L1626`); `.section--soft{background:#f6f8f7}`; `.section__head{text-align:center;max-width:720px;margin:0 auto 48px}` (`L453`); `.section__eyebrow` verde 800 uppercase `.12em .8rem` (`L457`).

---

## 7. Réplica con shadcn/ui (Next.js 15 App Router + Tailwind 3.4)

### 7.1 Instalación y tokens

```bash
npx shadcn@latest add card badge button aspect-ratio
```

`card` y `aspect-ratio` se instalan porque los pide el mapeo (§7.2), pero **no se importan** en los esqueletos de tarjeta-enlace (§7.4/§7.5, ver nota en §7.2): el `Card` que genera shadcn es un `<div>` fijo sin `asChild`/polimorfismo (no envuelve con Radix `Slot`), y toda tarjeta de la referencia es un `<a>`/`Link` entero, no un `<div>`. Quedan instalados por si se usan en una tarjeta que sí sea un `<div>` (p. ej. `.review`, que no es enlace) o si más adelante se parchea `ui/card.tsx` para aceptar `asChild`.

El repo usa **Tailwind 3.4, no 4**: los tokens van en `tailwind.config.ts` (`theme.extend`), no en `@theme`. Los valores arbitrarios (`duration-[400ms]`, `ease-[cubic-bezier(.2,.7,.2,1)]`, `shadow-[…]`, `aspect-[4/3]`) funcionan en 3.4.

```ts
// tailwind.config.ts (extracto)
theme: {
  extend: {
    colors: {
      marca: {
        verde: '#1aa585',        // --brand-green
        'verde-oscuro': '#12755e', // --brand-green-dark
        'verde-profundo': '#007a4a',
        lima: '#7ec700',
        oscuro: '#061827',
      },
      titulo: '#151719',
      texto: '#535353',
      borde: '#e2e2e2',
      suave: '#f6f8f7',
    },
    borderRadius: { tarjeta: '12px' },
    boxShadow: {
      tarjeta: '0 2px 6px rgba(6,24,39,.06), 0 8px 24px rgba(6,24,39,.06)',
      calc: '0 20px 40px rgba(6,24,39,.14)',
      job: '0 22px 50px rgba(6,24,39,.13)',
      insignia: '0 4px 14px rgba(6,24,39,.1)',
    },
    fontFamily: { sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'] },
    keyframes: { fadeUp: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } } },
    animation: { 'fade-up': 'fadeUp .6s ease both' },
  },
},
```

Fuente: `next/font/google` con `Figtree({ subsets:['latin'], weight:'variable', variable:'--font-figtree' })` sustituye el `<link>` de Google Fonts. Para el mundo "sport" no cargar `Clash Display` (la referencia tampoco lo hace); si se quiere, `next/font/local`.

Equivalencias Tailwind 3.4 de los valores literales:

| Original | Tailwind |
|---|---|
| `translateY(-4px)` | `-translate-y-1` (0.25rem = 4px) |
| `translateY(-5px)` / `-3px` / `-2px` | `-translate-y-[5px]` / `-translate-y-[3px]` / `-translate-y-0.5` |
| `scale(1.04)` / `1.05` / `1.06` | `scale-[1.04]` / `scale-105` / `scale-[1.06]` |
| `transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease` | `transition-[transform,box-shadow,border-color] duration-[250ms] ease-[ease]` (border-color queda a 250 ms; para 200 ms exactos, CSS propio) |
| `transition:transform .4s ease` (img) | `transition-transform duration-[400ms] ease-[ease]` |
| `cubic-bezier(.2,.7,.2,1)` | `ease-[cubic-bezier(.2,.7,.2,1)]` |
| `aspect-ratio:4/3` / `16/10` / `16/9` | `aspect-[4/3]` / `aspect-[16/10]` / `aspect-video` |
| `border-radius:12px` / `999px` | `rounded-tarjeta` (o `rounded-[12px]`) / `rounded-full` |
| `rgba(26,165,133,.10)` | `bg-marca-verde/10` |
| `min-height:2.6em` | `min-h-[2.6em]` |
| `letter-spacing:.02em` / `.04em` / `.12em` | `tracking-[.02em]` / `tracking-[.04em]` / `tracking-[.12em]` |
| `will-change:transform; transform-style:preserve-3d` | `will-change-transform [transform-style:preserve-3d]` |

### 7.2 Mapeo por tarjeta

shadcn `Card` por defecto es `rounded-xl border bg-card text-card-foreground shadow` (div). Hay que neutralizar `shadow` y fijar radio/borde/overflow. Las tarjetas de la referencia son `<a>` enteros; en Next se recomienda `Link` como raíz con las clases de `Card` (o `Card` con un `Link` "estirado" `after:absolute after:inset-0` sobre el título). Los esqueletos siguientes usan `Link` raíz.

**Nota de implementación** (resuelve la tensión entre esta tabla y el código de §7.4/§7.5): como toda la tarjeta es un `<Link>`/`<a>`, y `Card`/`AspectRatio` de shadcn son `<div>` sin `asChild`, los esqueletos **no importan** `Card`, `CardContent`, `CardFooter` ni `AspectRatio` como componentes — replican sus clases Tailwind directamente sobre `<div>` dentro del `Link` raíz (`tarjetaVariants` = clases de `Card`; `relative aspect-[4/3] overflow-hidden` = clases de `AspectRatio`; `flex flex-1 flex-col p-5` = clases de `CardContent`). La columna "shadcn" de la tabla describe la **equivalencia conceptual** (qué primitivo shadcn inspira cada bloque), no un import literal; la columna "Clases clave" es la que sí se usa tal cual.

| Referencia | shadcn | Clases clave |
|---|---|---|
| `.product-card` | clases de `Card` sobre `Link` (no el componente) + clases de `AspectRatio ratio={4/3}` sobre `div` + clases de `CardContent` sobre `div` + `Badge` ×2 + `Button` (como `span`) | `group flex flex-col overflow-hidden rounded-tarjeta border border-borde bg-white shadow-none transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:shadow-tarjeta hover:border-marca-verde` |
| `.product-card__media img` | `next/image` `fill` `sizes` | `object-cover transition-transform duration-[400ms] ease-[ease] group-hover:scale-[1.04]` |
| `.case-card` | clases de `Card` sobre `Link` + clases de `AspectRatio 4/3` sobre `div` + clases de `CardContent` sobre `div` + clases de `CardFooter` sobre `div` | igual receta; `CardContent` `p-[22px] flex flex-col gap-2.5 flex-1`; `CardFooter` `pt-3.5 border-t border-borde text-[.82rem]` |
| `.collection-card` | `Link` + `AspectRatio 16/10` + overlay | `relative block overflow-hidden rounded-tarjeta text-white aspect-[16/10] after:absolute after:inset-0 after:bg-gradient-to-b after:from-marca-oscuro/0 after:from-40% after:to-marca-oscuro/85`; img `group-hover:scale-105 duration-[400ms]` |
| `.calc-card` | `Card` (como `Link`) + icono + `CardContent` | `flex flex-col gap-3 p-7 ... hover:shadow-calc`; variante brand: `bg-white/[.08] border-white/[.18] text-white hover:bg-white/[.14]` |
| `.feature` | `Card` + `Collapsible` (shadcn) o `<details>` nativo | `p-7 hover:-translate-y-1 hover:shadow-tarjeta`; icono `size-14 rounded-[14px] bg-gradient-to-br from-marca-verde to-marca-verde-profundo` |
| `.review` | `Card` + `CardHeader` (estrellas + fecha) + `CardContent` + `CardFooter` | `p-[22px] gap-3.5`; sin hover; `Badge variant="hall"` |
| `.rating-badge` | `Badge` grande o `Link` propio | `inline-flex items-center gap-3 rounded-full bg-white/[.92] px-[18px] py-2.5 font-bold shadow-insignia hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(6,24,39,.15)]` |
| `.jobcard` | `Card` (como `Link`) + `Badge variant="tag"` + `Badge variant="chip"` | `relative rounded-[20px] px-[26px] pt-7 pb-6 hover:-translate-y-[5px] hover:shadow-job hover:border-transparent before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-marca-verde before:to-marca-lima before:origin-left before:scale-x-0 before:transition-transform before:duration-[250ms] hover:before:scale-x-100` |
| `.job-other` | `Card` fila | `flex items-center gap-3.5 rounded-[14px] px-5 py-[18px] transition-[border-color,transform,box-shadow] duration-[180ms] hover:border-marca-verde hover:-translate-y-[3px] hover:shadow-[0_14px_34px_rgba(26,165,133,.13)]` |
| `.sp-disc` | `Card` variante `sport` | `rounded-2xl border-black hover:shadow-[7px_7px_0_#e3fc03,7px_7px_0_1px_#000]`; img `group-hover:scale-[1.06] duration-500` |
| `.team-wall__item` | `figure` en `columns-3 gap-3.5` | `mb-3.5 break-inside-avoid overflow-hidden rounded-2xl bg-[#eef1f3] shadow-[0_8px_26px_rgba(6,24,39,.10)] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(6,24,39,.18)]`; img `duration-[600ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105` |
| `.mega-item` | `NavigationMenu` (shadcn) `Link` | `flex items-center gap-3 rounded-[10px] p-2 hover:bg-marca-verde/[.08]`; img `h-11 w-[58px] rounded-lg object-cover` |
| `.faq-item` | `Accordion` (shadcn) o `<details>` | `rounded-[10px] border border-borde bg-white px-5 py-4 data-[state=open]:border-marca-verde` |

### 7.3 Variantes con `cva`

```tsx
// components/ui/tarjeta.tsx
import { cva, type VariantProps } from 'class-variance-authority'

export const tarjetaVariants = cva(
  'group relative flex flex-col overflow-hidden bg-white border border-borde text-titulo shadow-none will-change-transform [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-[250ms] ease-[ease]',
  {
    variants: {
      variante: {
        producto: 'rounded-tarjeta hover:-translate-y-1 hover:shadow-tarjeta hover:border-marca-verde max-[560px]:rounded-[10px]',
        caso:     'rounded-tarjeta hover:-translate-y-1 hover:shadow-tarjeta hover:border-marca-verde',
        calc:     'rounded-tarjeta gap-3 p-7 hover:-translate-y-1 hover:shadow-calc hover:border-marca-verde',
        feature:  'rounded-tarjeta p-7 duration-200 hover:-translate-y-1 hover:shadow-tarjeta',
        review:   'rounded-tarjeta gap-3.5 p-[22px]',
        job:      'rounded-[20px] bg-white px-[26px] pt-7 pb-6 duration-200 hover:-translate-y-[5px] hover:shadow-job hover:border-transparent',
        sport:    'rounded-2xl border-black hover:-translate-y-1 hover:shadow-[7px_7px_0_#e3fc03,7px_7px_0_1px_#000]',
      },
    },
    defaultVariants: { variante: 'producto' },
  },
)
export type TarjetaVariants = VariantProps<typeof tarjetaVariants>
```

Extensión de `Badge` (editar `components/ui/badge.tsx` generado por shadcn, añadir variantes):

```tsx
const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-transparent font-extrabold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        // globotent
        producto: 'bg-marca-verde/10 text-marca-verde-oscuro px-2.5 py-1 text-[.78rem] tracking-[.02em]',
        alt:      'bg-suave text-titulo px-2.5 py-1 text-[.78rem] tracking-[.02em]',
        hall:     'bg-marca-verde/10 text-marca-verde-oscuro px-2.5 py-1 text-[.72rem] tracking-[.03em] whitespace-nowrap',
        tag:      'bg-marca-verde/10 text-marca-verde-oscuro px-[11px] py-[5px] text-[.68rem] uppercase tracking-[.05em]',
        chip:     'bg-suave border-borde text-titulo px-[11px] py-[5px] text-[.76rem] font-semibold',
        salario:  'bg-marca-verde/10 text-marca-verde-oscuro px-[11px] py-[5px] text-[.76rem]',
        sport:    'bg-[#e3fc03] text-black px-2.5 py-1 text-[.78rem] tracking-[.02em]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)
```

### 7.4 Esqueleto TSX: `TarjetaProducto`

```tsx
// components/tarjetas/tarjeta-producto.tsx  (Server Component; el tilt va en el wrapper cliente)
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { tarjetaVariants } from '@/components/ui/tarjeta'
import { TiltLink } from '@/components/tarjetas/tilt-link'

type BadgeItem = { texto: string; variante?: 'producto' | 'alt' }

type Props = {
  href: string
  titulo: string
  meta: string
  imagen: { src: string; alt: string }
  badges: BadgeItem[]   // orden libre; la referencia usa 2 (dimensiones 'producto' + superficie 'alt'), pero admite 0..N
  cta?: string
}

export function TarjetaProducto({ href, titulo, meta, imagen, badges, cta = 'Ver detalles' }: Props) {
  return (
    <TiltLink href={href} className={cn(tarjetaVariants({ variante: 'producto' }))}>
      {/* .product-card__media : aspect 4/3, fondo suave, overflow hidden */}
      <div className="relative aspect-[4/3] overflow-hidden bg-suave">
        <Image
          src={imagen.src}
          alt={imagen.alt}
          fill
          sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, (max-width:1100px) 33vw, 25vw"
          className="object-cover transition-transform duration-[400ms] ease-[ease] group-hover:scale-[1.04]"
        />
      </div>
      {/* .product-card__body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 min-h-[2.6em] text-[1.05rem] font-bold leading-[1.15] text-titulo">{titulo}</h3>
        <p className="mb-4 flex-1 text-[.85rem] text-texto">{meta}</p>
        {badges.length > 0 && (
          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {badges.map((b, i) => (
              <Badge key={i} variant={b.variante ?? 'producto'}>{b.texto}</Badge>
            ))}
          </div>
        )}
        {/* .product-card__cta = span con clases de botón, margin-top:auto */}
        <span className={cn(buttonVariants({ variant: 'default' }), 'mt-auto h-11 rounded-full px-7 text-[.85rem] font-extrabold uppercase tracking-[.04em] bg-marca-verde hover:bg-marca-verde-oscuro')}>
          {cta}
        </span>
      </div>
    </TiltLink>
  )
}
```

`Link` raíz + `TiltLink` (ver 7.6) evita anidar `<a>` dentro de `<a>`; el CTA es un `span` como en la referencia. `badges` es un array (no dos campos fijos `dimensiones`/`superficie`) para que productos de Pavivasa con otro número de especificaciones no fuercen el contrato de la referencia; el caso por defecto sigue siendo 2 badges (dimensiones + superficie), igual que el original.

### 7.5 Esqueleto TSX: `TarjetaCaso`

```tsx
// components/tarjetas/tarjeta-caso.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { tarjetaVariants } from '@/components/ui/tarjeta'
import { TiltLink } from '@/components/tarjetas/tilt-link'

type Props = {
  href: string
  imagen: { src: string; alt: string }
  localidad: string     // .case-card__loc  ("📍 Sollana, Valencia")
  anio: string          // .case-card__year
  titulo: string        // .case-card__title
  resumen: string       // .case-card__teaser
  acabado: string       // .case-card__hall  ("Hormigón impreso 180 m²")
  cta?: string          // .case-card__cta
}

export function TarjetaCaso({ href, imagen, localidad, anio, titulo, resumen, acabado, cta = 'Ver proyecto →' }: Props) {
  return (
    <TiltLink href={href} className={cn(tarjetaVariants({ variante: 'caso' }))}>
      <div className="relative aspect-[4/3] overflow-hidden bg-suave">
        <Image src={imagen.src} alt={imagen.alt} fill sizes="(max-width:560px) 100vw, (max-width:1100px) 50vw, 33vw"
               className="object-cover transition-transform duration-[400ms] ease-[ease] group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-[22px]">
        <div className="flex justify-between text-[.78rem] font-bold tracking-[.03em] text-texto">
          <span>{localidad}</span>
          <span className="font-extrabold text-marca-verde">{anio}</span>
        </div>
        <h3 className="m-0 text-[1.15rem] font-extrabold leading-[1.15] text-titulo">{titulo}</h3>
        <p className="m-0 flex-1 text-[.92rem] leading-[1.5] text-texto">{resumen}</p>
        <div className="flex items-center justify-between gap-2.5 border-t border-borde pt-3.5 text-[.82rem]">
          <span className="font-semibold text-texto">{acabado}</span>
          <span className="whitespace-nowrap text-[.76rem] font-extrabold uppercase tracking-[.04em] text-marca-verde">{cta}</span>
        </div>
      </div>
    </TiltLink>
  )
}
```

### 7.6 Tilt: hook `useTilt` + wrapper `TiltLink` (`'use client'`)

Réplica del bloque `main.js:L16-L26` con dos mejoras: guarda `prefers-reduced-motion` (la referencia no la tiene) y `matchMedia` evaluado una vez con listener (la referencia lo consulta en cada `mousemove`).

```tsx
// hooks/use-tilt.ts
'use client'
import { useEffect, useRef } from 'react'

type Opciones = { maxDeg?: number; perspective?: number; liftPx?: number }

export function useTilt<T extends HTMLElement>({ maxDeg = 3, perspective = 900, liftPx = 4 }: Opciones = {}) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const coarse = window.matchMedia('(pointer: coarse)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMove = (e: MouseEvent) => {
      if (coarse.matches || reduce.matches) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5   // [-0.5, 0.5]
      const y = (e.clientY - r.top) / r.height - 0.5
      // orden idéntico al original: translateY → perspective → rotateX → rotateY
      el.style.transform = `translateY(-${liftPx}px) perspective(${perspective}px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [maxDeg, perspective, liftPx])
  return ref
}
```

```tsx
// components/tarjetas/tilt-link.tsx
'use client'
import Link, { type LinkProps } from 'next/link'
import { useTilt } from '@/hooks/use-tilt'

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }

export function TiltLink({ children, ...props }: Props) {
  const ref = useTilt<HTMLAnchorElement>()
  return <Link ref={ref} {...props}>{children}</Link>
}
```

Notas: la clase `transition-[transform,…] duration-[250ms]` de `tarjetaVariants` es la que suaviza el seguimiento del ratón (igual que en la referencia). Con `maxDeg = 3` la rotación máxima es ±1.5°. El `hover:-translate-y-1` de Tailwind queda anulado por el inline style mientras hay `mousemove`, exactamente como en el original.

### 7.7 Reveal: componente `Revelar` (`'use client'`)

Réplica de `main.js:L3-L15` + `L3386-L3398`. Se aplica como **wrapper** de la tarjeta, no sobre la tarjeta, para que el `transform` del reveal no colisione con el del hover/tilt (colisión que sí existe en la referencia, ver §3.3). En SSR no se oculta nada (igual que la referencia, donde `.reveal` la añade el JS).

```tsx
// components/revelar.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = { children: React.ReactNode; className?: string; as?: 'div' | 'li' | 'figure' | 'section' }

export function Revelar({ children, className, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  // 'idle' = SSR/antes de hidratar (visible), 'oculto' = esperando, 'visible' = ya cruzó el umbral
  const [estado, setEstado] = useState<'idle' | 'oculto' | 'visible'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEstado('oculto')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setEstado('visible'); io.unobserve(e.target) }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as any}
      className={cn(
        'transition-[opacity,transform] duration-[600ms] ease-[ease] motion-reduce:transition-none',
        estado === 'oculto' ? 'opacity-0 translate-y-[18px]' : 'opacity-100 translate-y-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
```

Uso en una rejilla (equivalente a `.product-grid`):

```tsx
<div className="grid grid-cols-1 gap-6 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1101px]:grid-cols-4">
  {productos.map((p) => (
    <Revelar key={p.href}><TarjetaProducto {...p} /></Revelar>
  ))}
</div>
```

Breakpoints: la referencia usa `max-width` 1100/900/560; en Tailwind 3.4 se replican con `min-[561px]`, `min-[901px]`, `min-[1101px]` o definiendo `screens` en `tailwind.config.ts` (`sm: '561px', md: '901px', lg: '1101px'`).

### 7.8 Rejillas: equivalencias

| Referencia | Tailwind 3.4 |
|---|---|
| `.product-grid` | `grid gap-6 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1101px]:grid-cols-4` |
| `.case-grid`, `.calc-grid` | `grid gap-6 grid-cols-1 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-3` |
| `.reviews-grid` | `grid gap-5 grid-cols-1 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-3` |
| `.features` | `grid gap-6 grid-cols-1 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-4` |
| `.kategorien` | `grid gap-6 grid-cols-1 min-[721px]:grid-cols-2` |
| `.team-wall` | `columns-3 gap-3.5 max-[900px]:columns-2 max-[480px]:gap-2.5` |
| `.jobs-grid` | `grid gap-6 grid-cols-1 min-[901px]:grid-cols-3` |
| `.sp-disciplines` | `grid gap-[18px] grid-cols-1 min-[821px]:grid-cols-2 min-[1001px]:grid-cols-4` |
| `.blog-grid` (§4.17) | `grid gap-6 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3` |
| `.team-grid` (§4.17) | `grid gap-5 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-4` |
| `.cert-grid` (§4.17) | `grid gap-4 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3` |
| `.choose-cards` (§4.17) | `grid grid-cols-1 min-[761px]:grid-cols-2 gap-[clamp(16px,2.5vw,28px)] max-w-[1080px] max-[760px]:max-w-[460px]` |
| `.download-grid` (§4.17) | `grid gap-5 grid-cols-1 min-[701px]:grid-cols-2` |
| `.how-steps` (§4.17) | `grid gap-6 grid-cols-1 min-[701px]:grid-cols-3` |
| `.video-testi-grid` (§4.17) | `grid gap-5 grid-cols-1 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3` |

### 7.9 Accesibilidad y detalles a no perder

- Todas las tarjetas-enlace deben tener un `focus-visible` explícito (la referencia no lo tiene): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca-verde focus-visible:ring-offset-2`.
- `Revelar` y `useTilt` respetan `prefers-reduced-motion`; la referencia solo lo hace en el reveal (CSS) y no en el tilt.
- Imágenes: la referencia usa `<picture>` con webp 800/1200/2000 w y `loading="lazy" decoding="async"`; en Next basta `next/image` con `sizes`.
- El emoji `📍` de `.case-card__loc` y los emojis de `.jobcard__ico` son texto: sustituir por iconos `lucide-react` (`MapPin`) si se quiere consistencia.

---

## 8. Dudas y afirmaciones no confirmadas

1. **Colisión `.reveal.is-visible{transform:none}` vs `:hover{transform:translateY(-4px)}`** (§3.3): deducida por especificidad (0,2,0) y orden en el CSS (`L3390` posterior a `L596`, `L2089`, `L1182`, `L474`). No verificada en navegador; el JS del tilt enmascara el efecto en product/case/calc. Igual con la pérdida de la transición de `opacity` por `L3399`.
2. ~~`.review__hall` vs `.review__meta span`~~ — **resuelto, no es una duda**: la especificidad CSS es determinística y no depende del navegador. `.review__meta span` (0,1,1) gana siempre a `.review__hall` (0,1,0), así que `color:#535353` / `font-size:.8rem` prevalecen sobre `#12755e` / `.72rem`. Ver §4.6(g).
3. Las 4 tarjetas de "Experience & trust" de la home (`index.html:L509-L525`) usan estilos inline (`text-align:left`, rejilla `auto-fit minmax(240px,1fr)`) no presentes en el CSS.
4. `.collection-card` sin imagen en `calculators.html`: el fondo real (transparente + degradado) depende del fondo de la sección; no verificado visualmente.
5. `'Clash Display'`: se afirma que no se carga porque no hay `@font-face` en `main.pretty.css` ni `<link>`/`preload` en `index.html` o `sport.html` (grep). Si el sitio la cargara desde un CSS externo no espejado, cambiaría el aspecto del mundo sport.
6. El `main.js` espejado es `assets/js/main.min.js?v=c0f0756b` (`index.html:L664`); se asume que la versión legible del espejo equivale a la minificada servida.
7. No se ha comprobado con navegador ningún valor renderizado (alturas, tamaños de fuente calculados, comportamiento del `min-height:2.6em`).
