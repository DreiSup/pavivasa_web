# 07 — Interacciones y sistema de movimiento (globotent.com)

Referencia de la capa de comportamiento de https://globotent.com/ para (1) Claude Design, que diseñará Pavivasa inspirándose en esta web, y (2) Claude Code, que la implementará en Next.js 15 App Router + Tailwind 3.4 + shadcn/ui.

Fuentes analizadas (espejo local, sin navegador):

| Fuente | Ruta | Notas |
|---|---|---|
| JS completo | `scratchpad/globotent/main.js` (742 líneas, 30 225 B) | Idéntico byte a byte a `main.min.remote.js` (mismo tamaño, mismos hooks). Se carga como `<script src="assets/js/main.min.js?v=c0f0756b" defer>` (home.html L664). |
| CSS completo | `scratchpad/globotent/main.pretty.css` (6156 líneas) | Formateado desde `main.css` (125 019 B). |
| HTML | `scratchpad/globotent/site/**` (78 páginas) | Único JS inline en `<head>`: cargador GTM diferido (idéntico en las 78 páginas). No hay más `<script>` inline que JSON-LD. |
| Service worker | `https://globotent.com/sw.js` (curl) | Ver módulo M25. |

Convención: los identificadores (clases, `data-*`, funciones, ms, px, easings) se citan literales. Donde algo no aparece en el código se dice "no está en el código".

---

## 0. Índice

1. Arquitectura del JS: un IIFE, módulos consecutivos, carga `defer`
2. Módulos JS uno a uno (M01–M33), con código literal
3. Catálogo completo de `transition:` del CSS
4. Catálogo completo de `@keyframes` y dónde se aplican
5. Reglas literales de `@media (prefers-reduced-motion: reduce)` y `(hover: none)`
6. Principios del sistema de movimiento (deducidos)
7. Código muerto en el .com: hooks sin markup
8. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui
9. Afirmaciones verificables y dudas

---

## 1. Arquitectura del JS

- **Un solo archivo**, `assets/js/main.min.js`, cargado con `defer` al final del `<body>` (home.html L664). No hay `type="module"`, no hay bundler, no hay dependencias salvo las que se inyectan bajo demanda (three.js, model-viewer).
- Todo vive dentro de **un IIFE** `(function(){ 'use strict'; … })();` (L1–L719) más **un segundo IIFE** independiente para el vídeo de fondo (L720–L742). Dentro del primero, los módulos son bloques consecutivos sin separación formal; cada uno empieza con un `document.querySelector(...)` y se autodesactiva con `if (!el) return;` o `if (el) { … }`. **No hay `DOMContentLoaded`**: al ir con `defer`, el DOM ya está parseado.
- **Detección de capacidades** usada de forma recurrente:
  - `'IntersectionObserver' in window` (M01, M19, M22, M33)
  - `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (M03, M04, M05, M29, M33)
  - `window.matchMedia('(pointer: coarse)').matches` (M02, M16, M18)
  - `window.matchMedia('(min-width:901px)').matches` (M18)
  - `document.startViewTransition` (M06)
  - `navigator.connection.saveData` (M33)
  - `'serviceWorker' in navigator && location.protocol === 'https:'` (M25)
- **Estado en `sessionStorage`** (nunca `localStorage`): claves `globotent_exit_shown` (M18), `globotent_config` (M26), `maint-dismissed` (M31).
- **Limpieza**: prácticamente ninguna. Los listeners se registran una vez por carga de página (sitio MPA: cada navegación recarga todo). Solo se desconectan observers puntuales (`io.unobserve` en M01, `obs.disconnect()` en M22, `io.disconnect()` en M33). Los `setInterval` se paran con `clearInterval` en `stop()` (M04, M05, M29) y con `visibilitychange`.
- **GTM inline en `<head>`** (no en main.js): carga `gtm.js?id=GTM-MR5F4PQR` en el primer evento de `['scroll','mousemove','touchstart','keydown','pointerdown']` (`{passive:true, once:true}`) **o a los 4000 ms** (`setTimeout(G,4000)`), lo que ocurra antes. El comentario HTML lo explica: "deferred bis 1. Interaktion or 4s (Performance; lädt GA4+Meta+Clarity via Container)".

```js
// home.html L13 (literal, idéntico en las 78 páginas)
window.dataLayer=window.dataLayer||[];(function(){var L=false;function G(){if(L)return;L=true;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MR5F4PQR');}var E=['scroll','mousemove','touchstart','keydown','pointerdown'];function F(){G();}E.forEach(function(e){window.addEventListener(e,F,{passive:true,once:true});});setTimeout(G,4000);})();
```

---

## 2. Módulos JS uno a uno

Formato de cada ficha: **Disparador** · **Contrato DOM** · **Valores** · **Reducción de movimiento / puntero / visibilidad** · **Almacenamiento** · **Limpieza** · **Presencia en el .com** (inventario por grep sobre las 78 páginas) · **Código literal**.

### M01 · Reveal al hacer scroll (IntersectionObserver) — L3–L15

- **Disparador**: carga de página; entrada de cada elemento en el viewport.
- **Contrato DOM**: 19 selectores objetivo: `.section__head, .product-card, .case-card, .feature, .calc-card, .review, .blog-card, .team-card, .team-wall, .cert-item, .prose-block, .collection-card, .how-step, .timeline li, .press-item, .download-card, .three-d-cta, .jobcard, .job-other`. El JS **añade** la clase `reveal` (por eso el HTML no la trae) y, al intersectar, añade `is-visible`.
- **Valores**: `threshold: 0.12`, `rootMargin: '0px 0px -60px 0px'` (el elemento debe asomar 12 % y estar 60 px por encima del borde inferior). Una sola vez: `io.unobserve(e.target)`.
- **CSS asociado** (L3383–L3398 pretty): `.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}` → `.reveal.is-visible{opacity:1;transform:none}`. **No hay stagger** (retardo escalonado): todos los hermanos visibles a la vez aparecen a la vez.
- **Reduced motion**: solo en CSS: `@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}`. El JS no consulta la preferencia.
- **Sin IO**: si no existe `IntersectionObserver`, no se añade `reveal` → contenido visible sin animar (progresivo correcto).
- **Riesgo — excepción real**: en `site/pages/jobs.html` (L161, L175, L188) el marcado ya trae `class='jobcard reveal'` **horneado en el HTML**, no añadido por JS. Sin JS, esas 3 `.jobcard` quedan en `opacity:0` (invisibles) — salvo que el usuario tenga `prefers-reduced-motion:reduce`, que las rescata vía `@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}`. Para el resto de selectores el patrón sí es "bien diseñado" (la clase la pone el JS, por eso el HTML no la trae), pero `.jobcard` es una excepción real verificada, no un caso teórico.
- **Presencia en el .com**: objetivos existentes: `.section__head` (11 páginas), `.product-card` (43), `.feature` (index, 8 apariciones), `.collection-card` (4), `.review` (2), `.case-card`/`.calc-card`/`.team-wall`/`.press-item`/`.three-d-cta` (index), `.jobcard` (jobs.html), `.job-other` (3 páginas de empleo). **Sin markup en el .com**: `.blog-card`, `.team-card`, `.cert-item`, `.prose-block`, `.how-step`, `.timeline li`, `.download-card`.
- **Nota**: `.press-item` recibe `reveal` **y** está dentro de la marquesina `press-scroll` (M-CSS); la transición de opacidad .6s del reveal convive con `.press-item{opacity:.65}` → al hacerse visible pasa a `opacity:1` según `.reveal.is-visible`, que pisa el `.65` (mayor especificidad por dos clases).

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

### M02 · Tilt 3D de tarjetas — L16–L26

- **Disparador**: `mousemove` / `mouseleave` sobre cada tarjeta.
- **Contrato DOM**: `.product-card, .case-card, .calc-card, .blog-card`.
- **Valores**: coordenadas normalizadas `x,y ∈ [-0.5, 0.5]`; `transform = translateY(-4px) perspective(900px) rotateX(-y*3 deg) rotateY(x*3 deg)` → rotación máxima **±1.5°** por eje. Al salir: `el.style.transform = ''` (vuelve al `:hover` CSS o al reposo).
- **CSS asociado** (L3399–L3402): `.product-card,.case-card,.calc-card,.blog-card{will-change:transform;transform-style:preserve-3d;transition:transform .25s ease,box-shadow .25s ease,border-color .2s ease}` — esta regla **sobrescribe** las transiciones .2s definidas antes para las mismas clases (aparece más tarde en la hoja). Como el `transform` inline cambia en cada `mousemove`, la transición .25s hace que el tilt vaya "suavizado" (lag) en vez de seguir al ratón 1:1.
- **Puntero**: `if (window.matchMedia('(pointer: coarse)').matches) return;` dentro del handler (se evalúa en cada evento, no una vez).
- **Reduced motion**: no está en el código (no se consulta).
- **Conflicto**: el `transform` inline pisa el `:hover{transform:translateY(-4px)}` CSS mientras el ratón está encima; al salir se borra el inline y vuelve el CSS. El `translateY(-4px)` está duplicado en el JS para mantener la elevación.
- **Presencia**: `.product-card` en 43 páginas (50 apariciones `<a class='product-card'`), `.case-card` y `.calc-card` en index. `.blog-card` no está en el .com.

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

### M03 · Parallax del fondo del hero — L27–L33

- **Disparador**: `scroll` (`{passive:true}`).
- **Contrato DOM**: `.hero__bg`.
- **Valores**: `translateY(scrollY * 0.25)` (factor **0.25**). CSS: `.hero__bg{will-change:transform;transition:transform .05s linear}` (L3419–L3421) — la transición de 50 ms lineal suaviza el salto entre eventos de scroll.
- **Reduced motion**: el listener **no se registra** si `(prefers-reduced-motion: reduce)` (comprobado una vez al cargar).
- **Sin rAF ni throttle**: escribe `style.transform` en cada evento `scroll`.
- **Presencia en el .com**: **0 páginas**. Los heros del .com usan `.page-hero__bg` (72 páginas), `.sp-hero__bg` (sport.html) y `.cine-hero__bg` (index); ninguno lleva `.hero__bg`. **Módulo inerte en este dominio** (probablemente activo en globotent.de/.es con otra plantilla; no verificable aquí).

```js
const heroBgs = document.querySelectorAll('.hero__bg');
if (heroBgs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
window.addEventListener('scroll', () => {
const t = `translateY(${window.scrollY * 0.25}px)`;
heroBgs.forEach(bg => { bg.style.transform = t; });
}, { passive: true });
}
```

### M04 · Hero slider con dots — L34–L63

- **Disparador**: carga; `setInterval`; click en dots; `mouseenter/mouseleave`; `visibilitychange`.
- **Contrato DOM**: contenedor `[data-hero-slider]`; hijos `[data-hero-slide]` (capa de texto), `[data-hero-bg]` (fondos), `[data-hero-dot]` (botones). Estado: clase `is-active` en los tres grupos + `aria-selected="true|false"` en dots. Solo arranca si `count > 1`.
- **Valores**: `DELAY = 6000` ms. Índice circular `(i + count) % count`.
- **CSS asociado** (`.hero__bg--slide`/`.is-active`/`heroSlideIn`: L3937–L3950 pretty; `.hero__dot` + reduced-motion: L3985–L4029 pretty): `.hero--slider .hero__bg--slide{opacity:0;transition:opacity .9s ease;z-index:0}` / `.is-active{opacity:1}`; `.hero--slider .hero__slide.is-active{display:block;animation:heroSlideIn .7s cubic-bezier(.16,.84,.44,1)}`; `.hero__dot{width:40px;height:5px;border-radius:999px;background:rgba(255,255,255,.32);transition:background .3s,transform .3s}` / `.hero__dot.is-active{background:var(--brand-green,#1aa585);transform:scaleY(1.4)}` / `.hero__dot:focus-visible{outline:2px solid #fff;outline-offset:3px}`.
- **Reduced motion**: `reduce` se lee una vez; `start()` no crea el intervalo si `reduce` → el slider queda **estático en el slide 0** pero los dots siguen funcionando (click → `show(n)`). CSS: `@media (prefers-reduced-motion:reduce){.hero--slider .hero__slide.is-active{animation:none}.hero--slider .hero__bg--slide{transition:none}}`.
- **Hover**: `mouseenter` → `stop()`, `mouseleave` → `start()`.
- **Visibilidad**: `document.hidden ? stop() : start()`.
- **Presencia en el .com**: **0 páginas** (`data-hero-slider` no existe). Inerte.

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
dots.forEach((d, n)  => {
const on = n === idx;
d.classList.toggle('is-active', on);
d.setAttribute('aria-selected', on ? 'true' : 'false');
});
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

### M05 · Cine-hero (hero cinematográfico con pestañas) — L64–L99

- **Disparador**: carga; `setInterval`; click en pestañas; `mouseenter/mouseleave`; `visibilitychange`.
- **Contrato DOM**: contenedor `[data-cine-hero]`; fondos `[data-cine-bg]` (en el .com son `<picture class="cine-hero__bg">`); pestañas `[data-cine-tab]` (`<button class="cine-tab" role="tab">`) que llevan el contenido en atributos: `data-h1`, `data-sub`, `data-eyebrow`, `data-cta`, `data-href`, `data-world`; destinos `[data-cine-h1]`, `[data-cine-sub]`, `[data-cine-eyebrow]`, `[data-cine-cta]`. Estado: `is-active` en bg y tab, `aria-selected`, clase `is-sport` en el contenedor cuando `data-world === 'sport'`, y clase `is-swap` (reinicio de animación con `void el.offsetWidth`) en h1 y sub. Arranca solo si `n >= 2`.
- **Valores**: `DELAY = 5500` ms. Cambio de texto por `textContent` (no hay cross-fade de texto: se reemplaza y se reproduce `cineSwap` .5s).
- **CSS asociado** (L5981–L6156): `.cine-hero__bg{opacity:0;transition:opacity 1.1s ease}` / `.is-active{opacity:1}`; `.cine-hero__bg.is-active img{animation:cineZoom 8s ease-out both}` (Ken Burns 1.04→1.12); `.cine-hero__h1.is-swap,.cine-hero__sub.is-swap{animation:cineSwap .5s ease both}`; `.cine-hero__kicker{transition:color .4s ease}`; `.cine-tab{transition:color .3s ease,border-color .3s ease;border-top:2px solid transparent}` / `.is-active{color:#fff;border-top-color:var(--brand-green)}`; variante sport: `.cine-hero.is-sport .cine-tab.is-active{border-top-color:#e3fc03}`, kicker `#e3fc03`, botón primario `#e3fc03`/hover `#eaff3a`.
- **Reduced motion**: JS: `start()` retorna sin crear intervalo (no auto-rota; las pestañas siguen funcionando). CSS (L6149–L6156): `.cine-hero__bg{transition:opacity .01s}`, `.cine-hero__bg.is-active img{animation:none}`, `.cine-hero__h1.is-swap,.cine-hero__sub.is-swap{animation:none}`.
- **Hover**: pausa en `mouseenter`, reanuda en `mouseleave`. **Visibilidad**: para/arranca con `document.hidden`.
- **Nota de importancia**: el primer `show()` **no se llama al cargar**: el HTML ya trae el primer bg y tab con `is-active`; el JS solo arranca el intervalo. El primer cambio ocurre a los 5.5 s.
- **Accesibilidad**: `role="tablist"`/`role="tab"`/`aria-selected` en el HTML; no hay `aria-live` en h1/sub; no hay navegación por teclado entre pestañas más allá del `click` nativo de `<button>`.
- **Presencia**: solo `site/index.html` (4 pestañas en el markup).

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

Markup literal de una pestaña (home.html L141):

```html
<button type="button" class="cine-tab is-active" data-cine-tab role="tab" aria-selected="true" data-world="industrie" data-eyebrow="Industry &amp; Agriculture" data-h1="Agricultural buildings for farms" data-sub="Clear-span arch buildings for machinery, hay and livestock — permit-free*, assembled in days with certified Eurocode engineering." data-cta="View agricultural halls →" data-href="categories/storage-tents.html"><span class="cine-tab__no">01</span><span class="cine-tab__name">Agriculture</span></button>
```

### M06 · View Transitions entre páginas (MPA) — L100–L117

- **Disparador**: `click` delegado en `document` sobre `a[href]`.
- **Excluye**: `href` vacío, `#…`, `tel:`, `mailto:`, `http…` (externos y absolutos) y `target="_blank"`.
- **Mecanismo**: `e.preventDefault()` → `document.startViewTransition(() => { window.location.href = a.href; })`. Es decir, captura el snapshot de la página vieja y navega; el navegador aplica `::view-transition-old(root)` antes de descargar. `AbortError` se ignora (doble clic rápido). Si `startViewTransition` lanza, navega a pelo.
- **CSS asociado** (L3403–L3418): `@view-transition{navigation:auto}` (activa transiciones cross-document nativas en navegadores que las soportan, sin JS); `::view-transition-old(root){animation:vt-fade-out .18s ease forwards}`; `::view-transition-new(root){animation:vt-fade-in .28s ease forwards}`; `@keyframes vt-fade-out{to{opacity:0;transform:translateY(-10px)}}`; `@keyframes vt-fade-in{from{opacity:0;transform:translateY(10px)}}`.
- **Reduced motion**: no está en el código (ni JS ni CSS para `::view-transition-*`).
- **Efecto secundario**: al interceptar TODOS los clics internos, rompe cmd/ctrl+clic para abrir en pestaña nueva (no comprueba `e.metaKey/ctrlKey/button`).
- **Presencia**: todas las páginas.

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
t.finished.catch(err => {
if (err && err.name === 'AbortError') return; // schnell-klick beim Navigieren — kein Schaden
console.warn('view-transition:', err);
});
} catch (err) {
window.location.href = a.href;
}
});
}
```

### M07 · Contador "en vivo" — L118–L137

- **Contrato DOM**: `[data-live-counter]` (lee el número objetivo de `textContent`, default `500`).
- **Valores**: arranca en `max(100, target - 80)`; sube de 1 en 1 cada `40 + random*80` ms (40–120 ms) tras un retardo inicial de `600` ms; después, cada `12000` ms incrementa +1 con probabilidad 30 % (`Math.random() > 0.7`) — **sin límite**: el número sigue creciendo indefinidamente por encima del objetivo.
- **Reduced motion / visibilidad**: no está en el código.
- **Presencia**: **0 páginas** en el .com.
- **Valoración**: es prueba social simulada (el número no viene de datos). Descartar para Pavivasa.

```js
const counter = document.querySelector('[data-live-counter]');
if (counter) {
const target = parseInt(counter.textContent) || 500;
let current = Math.max(100, target - 80);
counter.textContent = current;
const step = () => {
if (current < target) {
current += 1;
counter.textContent = current;
setTimeout(step, 40 + Math.random() * 80);
}
};
setTimeout(step, 600);
setInterval(() => {
if (Math.random() > 0.7) {
current += 1;
counter.textContent = current;
}
}, 12000);
}
```

### M08 · Carga de nieve por geolocalización — L138–L163

- **Contrato DOM**: `#weather-snow` y `[data-weather-loc]`; requiere `navigator.geolocation`.
- **Valores**: tabla fija de 6 regiones DACH (`lat/lng/label/snow`), vecino más cercano por `Math.hypot`; `getCurrentPosition` con `{ timeout: 3000 }`; fallo silencioso (default "Wien").
- **Presencia**: **0 páginas**. Sin relación con Pavivasa.

```js
const snowEl = document.getElementById('weather-snow');
const locEl = document.querySelector('[data-weather-loc]');
if (snowEl && locEl && navigator.geolocation) {
const LOCS = [
{lat:47, lng:9, label:'Schweizer Mittelland', snow:'1,00 kN/m²'},
{lat:47, lng:11, label:'Tirol / Bayern Süd', snow:'1,45 kN/m²'},
{lat:48, lng:16, label:'Wien Region', snow:'1,15 kN/m²'},
{lat:50, lng:10, label:'Mitteldeutschland', snow:'0,85 kN/m²'},
{lat:52, lng:13, label:'Berlin Region', snow:'0,65 kN/m²'},
{lat:53, lng:10, label:'Norddeutschland', snow:'0,65 kN/m²'},
];
navigator.geolocation.getCurrentPosition(
pos => {
const { latitude: la, longitude: lo } = pos.coords;
let best = LOCS[0], bestD = 1e9;
LOCS.forEach(l => {
const d = Math.hypot(l.lat - la, l.lng - lo);
if (d < bestD) { bestD = d; best = l; }
});
snowEl.textContent = best.snow;
locEl.textContent = '(' + best.label + ')';
},
() => {}, // silent fail → Default bleibt Wien
{ timeout: 3000 }
);
}
```

### M09 · Fallback del vídeo de hero — L164–L170

- **Contrato DOM**: `[data-hero-video]` (un `<video>`).
- **Valores**: oculta el vídeo (`display:none`) en `error` o si `readyState === 0` a los **2500 ms**. CSS: `.hero__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}` y `.hero__video+.hero__bg{z-index:0}`.
- **Presencia**: **0 páginas**.

```js
const heroVid = document.querySelector('[data-hero-video]');
if (heroVid) {
heroVid.addEventListener('error', () => heroVid.style.display = 'none');
setTimeout(() => {
if (heroVid.readyState === 0) heroVid.style.display = 'none';
}, 2500);
}
```

### M10 · Formulario en dos etapas (form-expand) — L171–L186

- **Contrato DOM**: botón `[data-form-expand]` dentro de un `<form>` que contiene `.form-stage-2[hidden]`.
- **Mecanismo**: click → `stage2.hidden = false` y oculta el botón. Además, **auto-expande** cuando el usuario ha enfocado **2 campos distintos** (`focus` con `{once:true}` por campo, contador `focusedFields >= 2`).
- **CSS**: `.form-expand-btn{border:1px dashed var(--color-border);transition:background .2s,border-color .2s}` / `:hover{background:rgba(26,165,133,.06);border-color:var(--brand-green)}`. No hay animación de despliegue (aparece de golpe).
- **Presencia**: **0 páginas**.

```js
document.querySelectorAll('[data-form-expand]').forEach(btn => {
const form = btn.closest('form');
const stage2 = form && form.querySelector('.form-stage-2');
if (!stage2) return;
btn.addEventListener('click', () => {
stage2.hidden = false;
btn.style.display = 'none';
});
let focusedFields = 0;
form.querySelectorAll('input, select').forEach(f => {
f.addEventListener('focus', () => {
focusedFields++;
if (focusedFields >= 2 && stage2.hidden) { stage2.hidden = false; btn.style.display = 'none'; }
}, { once: true });
});
});
```

### M11 · Cabecera con sombra al hacer scroll — L187–L193

- **Contrato DOM**: `.site-header`; clase `is-scrolled`.
- **Valores**: umbral `window.scrollY > 8` px; `{passive:true}`; se evalúa también al cargar (`onScroll()`).
- **CSS** (L~120): `.site-header{position:sticky;top:0;z-index:50;background:#fff;transition:box-shadow .2s ease}` / `.site-header.is-scrolled{box-shadow:var(--shadow-header)}` con `--shadow-header:0 2px 16px rgba(6,24,39,.08)`.
- **Presencia**: todas.

```js
const header = document.querySelector('.site-header');
const onScroll = () => {
if(!header) return;
header.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();
```

### M12 · Menú móvil (burger) — L194–L222

- **Contrato DOM**: `.burger` (botón con `aria-expanded`) y `.site-nav`; clase `is-open` en ambos. Enlaces con clase `site-nav__main` **no** cierran el menú (son cabeceras de desplegable, ver M16).
- **Cierra con**: scroll de más de **12 px** mientras está abierto; clic fuera (`document` click que no esté dentro de `nav` ni `burger`); `Escape`; clic en cualquier enlace del menú salvo `.site-nav__main`.
- **CSS** (L~890–L910, en `@media (max-width:900px)`): `.site-nav{position:fixed;top:80px;left:0;right:0;background:#fff;flex-direction:column;…;transform:translateY(-200%);transition:transform .25s ease;max-height:calc(100vh - 80px);overflow-y:auto}` / `.site-nav.is-open{transform:none}` + `.site-nav.is-open{box-shadow:0 8px 24px rgba(6,24,39,.18)}`. Burger: `.burger span{width:26px;height:3px;transition:transform .2s ease,opacity .2s ease}`; `.burger.is-open span:nth-child(1){transform:translateY(8px) rotate(45deg)}`, `:nth-child(2){opacity:0}`, `:nth-child(3){transform:translateY(-8px) rotate(-45deg)}` (morph a X).
- **No hay**: bloqueo de scroll del body, focus-trap, `inert`.
- **Presencia**: todas.

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

### M13 · Galería de producto: miniaturas → imagen principal — L223–L236

- **Contrato DOM**: `[data-gallery-main] img` y `[data-gallery-thumb]` con atributo `data-src`; clase `is-active` en la miniatura activa.
- **Mecanismo**: click → `mainImg.src = data-src`. Sin transición de imagen (cambio en seco). CSS: `.gallery__thumb{aspect-ratio:1/1;border:2px solid transparent;transition:border-color .15s ease}` / `.is-active,:hover{border-color:var(--brand-green)}`.
- **Presencia**: **0 páginas** (`data-gallery-main`, `data-gallery-thumb`, `data-src` no existen en el .com). Por tanto M17 (lightbox) tampoco tiene fuentes.

```js
const mainImg = document.querySelector('[data-gallery-main] img');
const thumbs = document.querySelectorAll('[data-gallery-thumb]');
if(mainImg && thumbs.length){
thumbs.forEach(t => {
t.addEventListener('click', () => {
const src = t.getAttribute('data-src');
if(src){
mainImg.src = src;
thumbs.forEach(x => x.classList.remove('is-active'));
t.classList.add('is-active');
}
});
});
}
```

### M14 · Selector de idioma — L237–L251

- **Contrato DOM**: `.lang-switch` con botón `.lang-switch__current[aria-expanded]` y menú `.lang-switch__menu`; clase `is-open`.
- **Cierra con**: clic fuera, `Escape`. `e.stopPropagation()` en el botón para que el click no cierre inmediatamente.
- **CSS**: `.lang-switch__menu{opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s;z-index:100}` / `.lang-switch.is-open .lang-switch__menu{opacity:1;visibility:visible;transform:translateY(0)}`; chevron `.lang-switch__current svg{transition:transform .2s}` / `[aria-expanded="true"] svg{transform:rotate(180deg)}`.
- **Presencia**: todas (78). Irrelevante para Pavivasa (monolingüe).

```js
const langSwitch = document.querySelector('.lang-switch');
const langBtn = langSwitch && langSwitch.querySelector('.lang-switch__current');
if(langSwitch && langBtn){
const close = () => {
langSwitch.classList.remove('is-open');
langBtn.setAttribute('aria-expanded','false');
};
langBtn.addEventListener('click', e => {
e.stopPropagation();
const open = langSwitch.classList.toggle('is-open');
langBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', e => { if(!langSwitch.contains(e.target)) close(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
}
```

### M15 · Scroll suave a anclas con offset — L252–L263

- **Contrato DOM**: todo `a[href^="#"]` con id existente.
- **Valores**: `window.scrollTo({ top: el.offsetTop - 90, behavior:'smooth' })` → **offset 90 px** (altura de cabecera sticky 80 px + margen). Además `html{scroll-behavior:smooth}` global (L1 del CSS) y `.glossary-entry{scroll-margin-top:100px}` (única regla `scroll-margin` del CSS).
- **Reduced motion**: no está en el código (ni `scroll-behavior` condicionado).
- **Presencia**: todas.

```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
const id = a.getAttribute('href');
if(id.length > 1){
const el = document.querySelector(id);
if(el){
e.preventDefault();
window.scrollTo({ top: el.offsetTop - 90, behavior:'smooth' });
}
}
});
});
```

### M16 · Desplegables de navegación en móvil (acordeón) — L264–L285

- **Contrato DOM**: `.site-nav__group.has-dropdown > .site-nav__main`; clase `is-open` en el grupo; el JS añade `role="button"` y `aria-expanded` al enlace.
- **Condición móvil**: `window.innerWidth <= 900 || matchMedia('(pointer: coarse)').matches` (evaluada en cada toggle). En escritorio no intercepta (el enlace navega y el dropdown abre por `:hover` CSS).
- **Mecanismo**: `click` y `touchend` (`{passive:false}`) con `preventDefault` + `stopPropagation` + `stopImmediatePropagation` (para que M12 no cierre el menú); acordeón exclusivo (cierra los otros `.is-open`).
- **CSS escritorio**: `.site-nav__dropdown{opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .18s,transform .18s,visibility .18s;z-index:80}` / `.has-dropdown:hover .site-nav__dropdown, .has-dropdown.is-open .site-nav__dropdown{opacity:1;visibility:visible;transform:translateY(0)}`; chevron `.site-nav__chev{transition:transform .15s}` → `rotate(180deg)` en hover/is-open.
- **CSS móvil** (`@media (max-width:900px)`): `.site-nav__dropdown{position:static;display:none;opacity:1;visibility:visible;…}` / `.has-dropdown.is-open>.site-nav__dropdown{display:block !important;background:var(--color-bg-soft);border-radius:8px;padding:6px 8px;margin:6px 0 12px}` (sin animación en móvil, `display` en seco); pseudo `::after{content:"▾";transition:transform .2s ease}` → `rotate(180deg)`.
- **Presencia**: todas (2 grupos `has-dropdown` en home).

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

### M17 · Lightbox (+ photo-gallery) — L286–L344

- **Contrato DOM**: `[data-lightbox]` con `.lightbox__img`, `.lightbox__counter`, `.lightbox__close`, `.lightbox__nav--prev`, `.lightbox__nav--next`. Fuentes: `[data-gallery-thumb][data-src]` (galería de producto) y, si existe `[data-photo-gallery]`, sus `[data-lightbox-trigger]` (usa el `href`). Abre al clicar `[data-gallery-main]` (busca la posición por nombre de archivo: `current.endsWith(s.split('/').pop())`).
- **Mecanismo**: `lightbox.hidden = false` + `document.body.style.overflow = 'hidden'` (bloquea scroll). Cierra: botón, clic en el fondo (`e.target === lightbox`), `Escape`. Navega: botones, `ArrowLeft/ArrowRight`, swipe en la imagen con umbral **50 px** (`touchstart/touchend`). Contador `"i / n"`.
- **CSS**: `.lightbox{position:fixed;inset:0;background:rgba(6,24,39,.92);z-index:1000;padding:48px}` / `[hidden]{display:none}`; `.lightbox__close{width:48px;height:48px;font-size:42px;transition:background .2s}`; `.lightbox__nav{width:56px;height:56px;font-size:32px;background:rgba(255,255,255,.08);transition:background .2s}` / `:hover{background:rgba(255,255,255,.2)}`; `.lightbox__counter{bottom:20px;background:rgba(0,0,0,.5);padding:8px 16px;border-radius:50px}`. **Sin animación de apertura/cierre** (toggle de `hidden`). Sin focus-trap ni `role="dialog"`.
- **Presencia**: el markup `<div class="lightbox" data-lightbox hidden>` está en **las 78 páginas** (footer común), pero **no hay ningún trigger** (`data-gallery-thumb`, `data-lightbox-trigger`, `data-photo-gallery` = 0) → `srcList` vacío → `show()` retorna → **nunca se abre en el .com**.

```js
const lightbox = document.querySelector('[data-lightbox]');
if (lightbox) {
const lbImg = lightbox.querySelector('.lightbox__img');
const lbCounter = lightbox.querySelector('.lightbox__counter');
const lbClose = lightbox.querySelector('.lightbox__close');
const lbPrev = lightbox.querySelector('.lightbox__nav--prev');
const lbNext = lightbox.querySelector('.lightbox__nav--next');
const thumbs = Array.from(document.querySelectorAll('[data-gallery-thumb]'));
let srcList = thumbs.map(t => t.getAttribute('data-src')).filter(Boolean);
let idx = 0;
const show = (i) => {
if (!srcList.length) return;
idx = (i + srcList.length) % srcList.length;
lbImg.src = srcList[idx];
lbCounter.textContent = (idx + 1) + ' / ' + srcList.length;
lightbox.hidden = false;
document.body.style.overflow = 'hidden';
};
const hide = () => {
lightbox.hidden = true;
document.body.style.overflow = '';
};
const galleryMain = document.querySelector('[data-gallery-main]');
if (galleryMain && srcList.length) {
galleryMain.addEventListener('click', () => {
const current = galleryMain.querySelector('img').src;
const pos = srcList.findIndex(s => current.endsWith(s.split('/').pop()));
show(pos >= 0 ? pos : 0);
});
}
lbClose.addEventListener('click', hide);
lbPrev.addEventListener('click', () => show(idx - 1));
lbNext.addEventListener('click', () => show(idx + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) hide(); });
document.addEventListener('keydown', e => {
if (lightbox.hidden) return;
if (e.key === 'Escape') hide();
if (e.key === 'ArrowLeft') show(idx - 1);
if (e.key === 'ArrowRight') show(idx + 1);
});
let startX = 0;
lbImg.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
lbImg.addEventListener('touchend', e => {
const dx = e.changedTouches[0].clientX - startX;
if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
});
const gallery = document.querySelector('[data-photo-gallery]');
if (gallery) {
const triggers = Array.from(gallery.querySelectorAll('[data-lightbox-trigger]'));
const gSrcList = triggers.map(a => a.getAttribute('href'));
triggers.forEach((a, i) => {
a.addEventListener('click', e => {
e.preventDefault();
srcList = gSrcList;
show(i);
});
});
}
}
```

Markup literal (home.html L584–L590):

```html
<div class="lightbox" data-lightbox hidden>
  <button class="lightbox__close" aria-label="Close">&times;</button>
  <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">‹</button>
  <img class="lightbox__img" alt="Enlarged shelter view" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
  <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">›</button>
  <div class="lightbox__counter"></div>
</div>
```

CSS de `.photo-gallery` (existe aunque no se use en el .com): `.photo-gallery a{aspect-ratio:4/3;border-radius:14px;cursor:zoom-in;transition:transform .25s ease,box-shadow .25s ease}` / `:hover{transform:translateY(-4px);box-shadow:var(--shadow-card)}`; `.photo-gallery img{transition:transform .35s ease}` / `a:hover img{transform:scale(1.04)}`.

### M18 · Exit-intent popup — L345–L369

- **Disparador**: `mouseout` en `document` con `e.clientY <= 0 && !e.relatedTarget` (el cursor sale por el borde superior de la ventana).
- **Condiciones para activarse**: `[data-exit-popup]` existe, **no** es dispositivo táctil (`'ontouchstart' in window || navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches`), `sessionStorage.globotent_exit_shown` no está, y `matchMedia('(min-width:901px)').matches`.
- **Mecanismo**: `hidden=false` → `requestAnimationFrame` → `is-visible` (para que la transición CSS arranque desde el estado inicial). Cierre: `[data-exit-close]` (dos botones), `.exit-popup__backdrop`, `Escape`; `is-visible` fuera → `setTimeout(300)` → `hidden=true` (espera a la transición).
- **Almacenamiento**: `sessionStorage.setItem('globotent_exit_shown','1')` al mostrar → **una vez por sesión de pestaña**.
- **CSS**: `.exit-popup{position:fixed;inset:0;z-index:100;opacity:0;transition:opacity .3s;pointer-events:none}` / `.is-visible{opacity:1;pointer-events:auto}` / `[hidden]{display:none}`; `.exit-popup__backdrop{background:rgba(6,24,39,.72)}`; `.exit-popup__box{max-width:520px;border-radius:16px;padding:40px 32px;box-shadow:0 30px 60px rgba(0,0,0,.3);transform:scale(.94);transition:transform .3s}` / `.is-visible .exit-popup__box{transform:scale(1)}`.
- **Reduced motion**: no está en el código.
- **Presencia**: **78 páginas** (markup en el footer común; `role="dialog" aria-labelledby="exit-title"`, sin focus-trap).

```js
const isTouchDevice =
'ontouchstart' in window ||
navigator.maxTouchPoints > 0 ||
window.matchMedia('(pointer: coarse)').matches;
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

### M19 · Botón flotante WhatsApp: se oculta sobre el footer — L370–L376

- **Contrato DOM**: `.wa-fab` y `.site-footer`; clase `is-hidden`.
- **Valores**: `IntersectionObserver` sobre el footer con `threshold: 0.05` → `is-hidden` mientras el footer está ≥5 % visible.
- **CSS**: `.wa-fab{position:fixed;bottom:24px;right:24px;z-index:45;background:#25D366;padding:12px 18px;border-radius:50px;box-shadow:0 8px 24px rgba(37,211,102,.35);transition:transform .2s,box-shadow .2s,background .2s}` / `:hover{background:#1ebe5c;transform:translateY(-2px);box-shadow:0 14px 30px rgba(37,211,102,.45)}` / `.is-hidden{opacity:0;transform:translateY(20px);pointer-events:none}`. **Nota**: `opacity` no está en la lista de `transition` del `.wa-fab`, así que el fundido es en seco; solo el `transform` anima. `body.is-product-detail .wa-fab{display:none}` → oculto en las **36 páginas de producto** (que tienen `<body class="is-product-detail">`).
- **Presencia**: 78 páginas.

```js
const waFab = document.querySelector('.wa-fab');
const footerEl = document.querySelector('.site-footer');
if (waFab && footerEl && 'IntersectionObserver' in window) {
new IntersectionObserver(entries => {
entries.forEach(e => waFab.classList.toggle('is-hidden', e.isIntersecting));
}, { threshold: 0.05 }).observe(footerEl);
}
```

### M20 · Disponibilidad simulada — L377–L386

- **Contrato DOM**: `[data-avail]`, `#avail-slots`, `#avail-recent`.
- **Valores**: hash `h` = suma de `charCodeAt` de `location.pathname`; `slotCount = 1 + (h % 4)` (1–4); texto "reciente" de una lista fija de 6 strings en alemán indexada por `h % 6`. **Determinista por URL, no real**. CSS: `.avail-banner__dot{width:9px;height:9px;background:#7ec700;animation:pulse 1.8s ease-in-out infinite}`.
- **Presencia**: **0 páginas**. Descartar (prueba social falsa).

```js
const avail = document.querySelector('[data-avail]');
if (avail) {
const slots = document.getElementById('avail-slots');
const recent = document.getElementById('avail-recent');
const h = Array.from(location.pathname).reduce((a,c)=>a+c.charCodeAt(0),0);
const slotCount = 1 + (h % 4);
if (slots) slots.textContent = slotCount;
const recentChoices = ['vor 12 min','vor 47 min','vor 2 h','vor 6 h','heute Morgen','gestern'];
if (recent) recent.textContent = recentChoices[h % recentChoices.length];
}
```

### M21 · Comparador antes/después — L387–L407

- **Contrato DOM**: `[data-before-after]` con `.before-after__handle` y `.before-after__after` (la imagen "después"). Imágenes `pointer-events:none`.
- **Mecanismo**: arrastre (`mousedown/touchstart` en el handle → `dragging=true`; `mousemove/touchmove` en `document`; `mouseup/touchend` en `document`) y **clic directo** sobre el contenedor o una `IMG`. `pct` acotado 0–100; `handle.style.left = pct%`; `after.style.clipPath = inset(0 0 0 pct%)`.
- **CSS**: `.before-after{aspect-ratio:16/9;border-radius:12px;user-select:none;touch-action:pan-y}` (permite scroll vertical, captura horizontal); `.before-after__after{clip-path:inset(0 0 0 50%)}` (reposo al 50 %); `.before-after__handle{left:50%;width:4px;background:#fff;cursor:ew-resize;transform:translateX(-50%)}` con botón central `44px` redondo `↔` y `box-shadow:0 4px 14px rgba(0,0,0,.25)`; etiquetas `.before-after__label` píldoras `rgba(6,24,39,.75)`; `.before-after__notice` con `backdrop-filter:blur(4px)` que en `≤720px` se saca fuera del cuadro. **Sin transición** en `left`/`clip-path` (sigue al puntero 1:1).
- **Accesibilidad**: sin teclado, sin `role="slider"`, sin `aria-valuenow`. No está en el código.
- **Presencia**: `site/index.html`.

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
box.addEventListener('click', e => {
if (e.target === box || e.target.tagName === 'IMG') update(e.clientX);
});
});
```

Markup literal (home.html L380–L387):

```html
<div class="before-after" data-before-after>
  <img src="assets/images/globotent-vorher.webp" alt="Site before installation of the Globotent shelter" class="before-after__before">
  <img src="assets/images/globotent-nachher.webp" alt="Site with installed Globotent arched shelter" class="before-after__after">
  <div class="before-after__label before-after__label--before">Before</div>
  <div class="before-after__label before-after__label--after">After</div>
  <div class="before-after__handle"><div>↔</div></div>
  <div class="before-after__notice">Real Globotent project · We create your personalised 3D rendering within 24 h based on your photo</div>
</div>
```

### M22 · Visor 3D (three.js bajo demanda) — L408–L516

- **Contrato DOM**: `.threed-viewer` con `.threed-viewer__canvas`, `data-hall-w/l/h/type` (defaults 6/12/4/'arch'), chips `.threed-viewer__controls .chip[data-color]`.
- **Carga**: `IntersectionObserver` con `rootMargin: '200px'` → inyecta `https://unpkg.com/three@0.158.0/build/three.min.js` y luego `OrbitControls.js`; fallo → mensaje de error en alemán. Sin IO → carga inmediata.
- **Escena**: fondo `0x0f1d28` si `document.documentElement.dataset.theme === 'dark'`, si no `0xf6f8f7`; cámara `PerspectiveCamera(50, …, 0.1, 200)` en `(l*1.2, h*1.5, l*1.3)`; suelo `CircleGeometry(max(l,w)*1.6, 64)` color `0xe2e8d6`; nave extruida con color inicial `#1aa585`, tres perfiles (`arch`/`gable`/`shed`); puerta `0xc9c9c9`; `AmbientLight(0xffffff,0.65)` + `DirectionalLight(0xffffff,0.8)`; `OrbitControls` con `enableDamping`, `minDistance = max(w,l)*0.6`, `maxDistance = max(w,l)*3`, `maxPolarAngle = π/2 - 0.05`. Loop `requestAnimationFrame` permanente (no se detiene al perder visibilidad).
- **Presencia**: **0 páginas**. (`data-theme` tampoco existe en ninguna página: no hay modo oscuro real.)
- Código literal: L408–L516 de main.js (109 líneas; se descarta para Pavivasa — ver §8.3 — pero se transcribe aquí por completitud, igual que M23).

```js
const threedRoot = document.querySelector('.threed-viewer');
if (threedRoot) {
const loadScript = src => new Promise((res, rej) => {
const s = document.createElement('script');
s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
});
let loaded = false;
const bootstrap3D = () => {
if (loaded) return; loaded = true;
loadScript('https://unpkg.com/three@0.158.0/build/three.min.js').then(() => {
loadScript('https://unpkg.com/three@0.158.0/examples/js/controls/OrbitControls.js').then(() => init3D());
}).catch(() => {
threedRoot.innerHTML = '<p style="padding:40px;text-align:center;color:#888">3D-Ansicht konnte nicht geladen werden.</p>';
});
};
if ('IntersectionObserver' in window) {
const obs = new IntersectionObserver(es => {
es.forEach(e => { if (e.isIntersecting) { bootstrap3D(); obs.disconnect(); } });
}, { rootMargin: '200px' });
obs.observe(threedRoot);
} else {
bootstrap3D();
}
function init3D() {
const canvasWrap = threedRoot.querySelector('.threed-viewer__canvas');
const w = parseFloat(threedRoot.dataset.hallW) || 6;
const l = parseFloat(threedRoot.dataset.hallL) || 12;
const h = parseFloat(threedRoot.dataset.hallH) || 4;
const type = threedRoot.dataset.hallType || 'arch';
let color = '#1aa585';
const scene = new THREE.Scene();
scene.background = new THREE.Color(document.documentElement.dataset.theme === 'dark' ? 0x0f1d28 : 0xf6f8f7);
const camera = new THREE.PerspectiveCamera(50, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 200);
camera.position.set(l * 1.2, h * 1.5, l * 1.3);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
canvasWrap.appendChild(renderer.domElement);
const ground = new THREE.Mesh(
new THREE.CircleGeometry(Math.max(l, w) * 1.6, 64),
new THREE.MeshLambertMaterial({ color: 0xe2e8d6 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
const hall = new THREE.Group();
let planeMat = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide, shininess: 8 });
const wallH = type === 'gable' ? h * 0.7 : (type === 'shed' ? h * 0.8 : h * 0.55);
const frontShape = new THREE.Shape();
if (type === 'arch') {
frontShape.moveTo(-w/2, 0);
frontShape.lineTo(-w/2, wallH);
frontShape.absarc(0, wallH, w/2, Math.PI, 0, true);
frontShape.lineTo(w/2, 0);
} else if (type === 'gable') {
frontShape.moveTo(-w/2, 0);
frontShape.lineTo(-w/2, wallH);
frontShape.lineTo(0, h);
frontShape.lineTo(w/2, wallH);
frontShape.lineTo(w/2, 0);
} else {
frontShape.moveTo(-w/2, 0);
frontShape.lineTo(-w/2, wallH);
frontShape.lineTo(w/2, wallH + (h - wallH) * 0.5);
frontShape.lineTo(w/2, 0);
}
const extrudeSettings = { depth: l, bevelEnabled: false };
const hallBody = new THREE.Mesh(new THREE.ExtrudeGeometry(frontShape, extrudeSettings), planeMat);
hallBody.position.z = -l / 2;
hall.add(hallBody);
const doorW = w * 0.3, doorH = wallH * 0.75;
const door = new THREE.Mesh(
new THREE.PlaneGeometry(doorW, doorH),
new THREE.MeshPhongMaterial({ color: 0xc9c9c9 })
);
door.position.set(0, doorH / 2, -l / 2 + 0.02);
hall.add(door);
scene.add(hall);
scene.add(new THREE.AmbientLight(0xffffff, 0.65));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(10, 20, 10);
scene.add(dir);
const ctrl = new THREE.OrbitControls(camera, renderer.domElement);
ctrl.target.set(0, h / 2, -l / 2);
ctrl.enableDamping = true;
ctrl.minDistance = Math.max(w, l) * 0.6;
ctrl.maxDistance = Math.max(w, l) * 3;
ctrl.maxPolarAngle = Math.PI / 2 - 0.05;
ctrl.update();
const onResize = () => {
camera.aspect = canvasWrap.clientWidth / canvasWrap.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
};
window.addEventListener('resize', onResize);
threedRoot.querySelectorAll('.threed-viewer__controls .chip').forEach(btn => {
btn.addEventListener('click', () => {
threedRoot.querySelectorAll('.threed-viewer__controls .chip').forEach(b => b.classList.remove('is-active'));
btn.classList.add('is-active');
planeMat.color.set(btn.dataset.color);
});
});
function animate() {
requestAnimationFrame(animate);
ctrl.update();
renderer.render(scene, camera);
}
animate();
}
}
```

### M23 · AR con `<model-viewer>` — L517–L551

- **Contrato DOM**: `[data-ar-btn]` y `[data-ar-viewer]`.
- **Carga**: al hacer clic, inyecta `https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js` (`type="module"`), espera **300 ms** y llama `arViewer.activateAR()`. Textos de estado en alemán. Error → botón deshabilitado con `opacity:.6`.
- **Presencia**: **0 páginas**. Descartar.

```js
const arBtn = document.querySelector('[data-ar-btn]');
const arViewer = document.querySelector('[data-ar-viewer]');
if (arBtn && arViewer) {
let mvLoaded = false;
arBtn.addEventListener('click', () => {
arBtn.textContent = '3D-Modell lädt…';
const afterLoad = () => {
arViewer.style.display = 'block';
if (typeof arViewer.activateAR === 'function') {
try { arViewer.activateAR(); } catch (e) {}
}
arBtn.textContent = 'AR geöffnet – scrollen Sie nach unten';
};
if (!mvLoaded) {
const s = document.createElement('script');
s.type = 'module';
s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
s.onload = () => { mvLoaded = true; setTimeout(afterLoad, 300); };
s.onerror = () => {
arBtn.disabled = true;
arBtn.textContent = '3D-Modell wird aktuell produziert';
arBtn.style.opacity = '.6';
};
document.head.appendChild(s);
} else {
afterLoad();
}
});
arViewer.addEventListener('error', () => {
arViewer.style.display = 'none';
arBtn.disabled = true;
arBtn.textContent = '3D-Modell wird aktuell produziert';
arBtn.style.opacity = '.6';
});
}
```

### M24 · Vídeo-testimonio: póster → `<video>` — L552–L558

- **Contrato DOM**: `.video-testi__play[data-video-src]`; reemplaza el `innerHTML` del padre por `<video controls autoplay playsinline …>`.
- **CSS**: `.video-testi__play{width:72px;height:72px;border-radius:50%;background:rgba(26,165,133,.92);transition:transform .2s,background .2s}` / `:hover{transform:translate(-50%,-50%) scale(1.1)}`.
- **Presencia**: **0 páginas**.

```js
document.querySelectorAll('.video-testi__play').forEach(btn => {
btn.addEventListener('click', () => {
const media = btn.parentElement;
const src = btn.dataset.videoSrc;
media.innerHTML = `<video controls autoplay playsinline style="width:100%;height:100%;object-fit:cover" src="${src}"></video>`;
});
});
```

### M25 · Service worker — L559–L561

- Registra `/sw.js` solo en `https:`; errores silenciados. **El `sw.js` real (curl) es auto-desinstalador**: en `install` hace `skipWaiting()`, en `activate` borra todas las caches, `self.registration.unregister()` y recarga los clientes; `fetch` es no-op. Comentario: "selbst-deaktivierend während aktive Entwicklung". Es decir, hoy **no hay PWA funcional** (solo `manifest.webmanifest` con `display:standalone`, `theme_color:#1aa585`).

```js
if ('serviceWorker' in navigator && location.protocol === 'https:') {
navigator.serviceWorker.register('/sw.js').catch(() => {});
}
```

### M26 · Prefill del RFQ desde configurador — L562–L576

- **Condición**: `location.pathname.endsWith('request-for-quote.html')` y `sessionStorage.globotent_config`.
- **Mecanismo**: escribe `'[Konfigurator-Auswahl]\n' + prefilled` en `textarea[name="anmerkungen"]`, inserta un banner inline (estilos en `cssText`: `background:rgba(26,165,133,.10);border-left:4px solid #1aa585;border-radius:8px`) antes de `form.form-grid` y borra la clave.
- **Presencia**: en el .com la página es `request-a-quote.html` (no `request-for-quote.html`) y **nada escribe `globotent_config`** (no hay configurador en main.js) → inerte.

```js
if (window.location.pathname.endsWith('request-for-quote.html')) {
const prefilled = sessionStorage.getItem('globotent_config');
if (prefilled) {
const note = document.querySelector('textarea[name="anmerkungen"]');
if (note) {
note.value = '[Konfigurator-Auswahl]\n' + prefilled + '\n\n';
const banner = document.createElement('div');
banner.style.cssText = 'margin-bottom:24px;padding:14px 18px;background:rgba(26,165,133,.10);border-left:4px solid #1aa585;border-radius:8px;font-size:.92rem';
banner.innerHTML = '<strong>✓ Ihre Konfiguration wurde übernommen.</strong> Die Details stehen im Anmerkungsfeld — ergänzen Sie Ihre Kontaktdaten, wir melden uns binnen 24h.';
const form = document.querySelector('form.form-grid');
if (form && form.parentElement) form.parentElement.insertBefore(banner, form);
sessionStorage.removeItem('globotent_config');
}
}
}
```

### M27 · Swipe en la galería de producto — L577–L597

- **Contrato DOM**: `[data-gallery-main]`, su `img`, `[data-gallery-thumb][data-src]`.
- **Valores**: umbral **50 px** horizontal (`touchstart/touchend`), índice circular. Mantiene su propio `gCurrentIdx` (no sincronizado con M13 si el usuario clica una miniatura).
- **Presencia**: **0 páginas**.

```js
const galleryMain = document.querySelector('[data-gallery-main]');
const galleryImg = galleryMain && galleryMain.querySelector('img');
const galleryThumbs = document.querySelectorAll('[data-gallery-thumb]');
if (galleryMain && galleryImg && galleryThumbs.length) {
let gStartX = 0;
let gCurrentIdx = 0;
galleryMain.addEventListener('touchstart', e => { gStartX = e.touches[0].clientX; }, { passive: true });
galleryMain.addEventListener('touchend', e => {
const dx = e.changedTouches[0].clientX - gStartX;
if (Math.abs(dx) > 50) {
gCurrentIdx = (gCurrentIdx + (dx < 0 ? 1 : -1) + galleryThumbs.length) % galleryThumbs.length;
const t = galleryThumbs[gCurrentIdx];
const src = t.getAttribute('data-src');
if (src) {
galleryImg.src = src;
galleryThumbs.forEach(x => x.classList.remove('is-active'));
t.classList.add('is-active');
}
}
});
}
```

### M28 · Tracking: dataLayer, campos ocultos Meta CAPI, clics de contacto — L598–L651

- **`dlPush(obj)`** envuelve `window.dataLayer.push`. **`genEventId()`** usa `crypto.randomUUID()` o `'ev-' + Date.now() + '-' + random`. Se expone `window.gtEventId`.
- **Campos ocultos** añadidos a `form[data-netlify]`: `event_id`, `fbp` (cookie `_fbp`), `fbc` (cookie `_fbc` o derivado de `?fbclid=` como `fb.1.<ts>.<fbclid>`), `event_source_url`, `client_user_agent`. `ecUserData(form)` normaliza `email` (lowercase), `telefon` (solo `[0-9+]`), `vorname/nachname` o divide `name` por espacios — **definida pero nunca llamada** en main.js.
- **Clics** (listener en fase de captura): `wa.me|api.whatsapp.com|whatsapp` → `whatsapp_click`; `tel:` → `phone_click`; `mailto:` → `email_click`.
- **Presencia**: `form[data-netlify]` = **0** en el .com (los formularios son `<form action='../pages/thank-you' method='POST' class='form-grid' name='kontakt|angebot-rfq|downloads|3d-vorschau'>`); el tracking de clics sí actúa en todas las páginas.

```js
window.dataLayer = window.dataLayer || [];
function dlPush(obj){ try { window.dataLayer.push(obj); } catch (e) {} }
function genEventId(){
try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
return 'ev-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}
function getCookie(n){
var m = document.cookie.match('(?:^|; )' + n.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)');
return m ? decodeURIComponent(m[1]) : '';
}
function fbcFromUrl(){
var m = location.search.match(/[?&]fbclid=([^&]+)/);
return m ? ('fb.1.' + Date.now() + '.' + decodeURIComponent(m[1])) : '';
}
function addHidden(form, name, value){
if (!value) return;
var i = document.createElement('input');
i.type = 'hidden'; i.name = name; i.value = value;
form.appendChild(i);
}
function ecUserData(form){
var v = function(sel){ var el = form.querySelector(sel); return el && el.value ? el.value.trim() : ''; };
var email = v('[name="email"]').toLowerCase();
var phone = v('[name="telefon"]').replace(/[^0-9+]/g, '');   // E.164-nah; ohne Leerzeichen/Klammern
var first = v('[name="vorname"]'), last = v('[name="nachname"]');
if (!first && !last) {                                       // Formulare mit einem einzigen "name"-Feld (z.B. kontakt)
var full = v('[name="name"]');
if (full) { var p = full.split(/\s+/); first = p.shift() || ''; last = p.join(' '); }
}
var ud = {};
if (email) ud.email = email;
if (phone) ud.phone_number = phone;
if (first || last) ud.address = { first_name: first || undefined, last_name: last || undefined };
return ud;
}
(function(){
var eid = genEventId();
try { window.gtEventId = eid; } catch (e) {}
document.querySelectorAll('form[data-netlify]').forEach(function(form){
addHidden(form, 'event_id', eid);
addHidden(form, 'fbp', getCookie('_fbp'));
addHidden(form, 'fbc', getCookie('_fbc') || fbcFromUrl());
addHidden(form, 'event_source_url', location.href);
addHidden(form, 'client_user_agent', navigator.userAgent);
});
})();
document.addEventListener('click', function(e){
var a = e.target.closest && e.target.closest('a');
if (!a) return;
var href = a.getAttribute('href') || '';
if (/wa\.me|api\.whatsapp\.com|whatsapp/i.test(href)) dlPush({ event: 'whatsapp_click' });
else if (href.indexOf('tel:') === 0) dlPush({ event: 'phone_click' });
else if (href.indexOf('mailto:') === 0) dlPush({ event: 'email_click' });
}, true);
```

### M29 · Lead-slider (mosaico con auto-rotación) — L652–L680

- **Contrato DOM**: `[data-lead-slider]` con `.lead-slide` y `.lead-dot`; el JS **crea** los botones `.lead-arrow.lead-arrow--prev/--next` (`‹`/`›`, `aria-label` en alemán) y los añade al slider.
- **Valores**: intervalo **3800 ms**; arranque escalonado `setTimeout(start, idx * 1900)` (comentario: "zwei Slider zeitlich versetzt": dos sliders desfasados 1.9 s). `paused` en hover; click en dot/flecha → `show`, `stop()`, y reanuda si no está en pausa.
- **CSS**: `.lead-slide{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .6s ease,visibility .6s}` / `.is-active{opacity:1;visibility:visible}` (cross-fade); `.lead-dot{width:7px;height:7px;background:rgba(255,255,255,.5);transition:background .3s,transform .3s}` / `.is-active{background:#fff;transform:scale(1.3)}`; `.lead-arrow{width:38px;height:38px;background:rgba(0,0,0,.42);backdrop-filter:blur(3px);opacity:.85;transition:background .2s,opacity .2s,transform .2s}` / `:hover{background:#000;opacity:1;transform:translateY(-50%) scale(1.08)}`; `@media (hover:none){.lead-arrow{opacity:1}}` (única regla `hover:none` del CSS).
- **Reduced motion**: `var reduceMotion` (L652, global al IIFE) → `start()` no arranca; la navegación manual sigue.
- **Visibilidad**: `visibilitychange` → stop / start si no pausado.
- **Presencia**: **0 páginas** en el .com.

```js
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-lead-slider]').forEach(function(slider, idx){
var slides = slider.querySelectorAll('.lead-slide');
var dots = slider.querySelectorAll('.lead-dot');
if (slides.length < 2) return;
var i = 0, timer = null, paused = false;
function show(n){
slides[i].classList.remove('is-active'); if (dots[i]) dots[i].classList.remove('is-active');
i = (n + slides.length) % slides.length;
slides[i].classList.add('is-active'); if (dots[i]) dots[i].classList.add('is-active');
}
function start(){ if (timer || paused || reduceMotion) return; timer = setInterval(function(){ show(i + 1); }, 3800); }
function stop(){ clearInterval(timer); timer = null; }
slider.addEventListener('mouseenter', function(){ paused = true; stop(); });
slider.addEventListener('mouseleave', function(){ paused = false; start(); });
dots.forEach(function(d, k){ d.addEventListener('click', function(e){ e.preventDefault(); show(k); stop(); if (!paused) start(); }); });
function mkArrow(dir){
var b = document.createElement('button');
b.type = 'button';
b.className = 'lead-arrow lead-arrow--' + (dir < 0 ? 'prev' : 'next');
b.setAttribute('aria-label', dir < 0 ? 'Vorheriges Bild' : 'Nächstes Bild');
b.innerHTML = dir < 0 ? '‹' : '›';
b.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); show(i + dir); stop(); if (!paused) start(); });
slider.appendChild(b);
}
mkArrow(-1); mkArrow(1);
document.addEventListener('visibilitychange', function(){ if (document.hidden) stop(); else if (!paused) start(); });
setTimeout(start, idx * 1900);   // zwei Slider zeitlich versetzt
});
```

### M30 · Filtros de catálogo por anchura — L681–L705

- **Contrato DOM**: `[data-filter-bar]` con `.filter-pill[data-w]` y `[data-filter-count]`; el grid es el **siguiente hermano** que cumpla `[data-filter-grid]`; tarjetas `.product-card[data-w]`.
- **Mecanismo**: `display:none` / `''` en seco (sin animación de layout); contador `"n Modell(e)"` (alemán). Arranca con `apply('all')`.
- **CSS**: `.filter-pill{border-radius:50px;padding:8px 16px;transition:background .18s,border-color .18s,color .18s}` / `:hover{border-color:var(--brand-green);color:var(--brand-green)}` / `.is-active{background:var(--brand-green);border-color:var(--brand-green);color:#fff}`; variante `.sport-world .filter-pill.is-active{background:var(--sport-lime);border-color:#000;color:#000}`.
- **Presencia**: `data-filter-bar` **0 páginas**; `sport.html` sí lleva `data-w='20|25|14'` en sus `.product-card` pero sin barra → inerte.

```js
document.querySelectorAll('[data-filter-bar]').forEach(function(bar){
var grid = bar.nextElementSibling;
while (grid && !(grid.matches && grid.matches('[data-filter-grid]'))) grid = grid.nextElementSibling;
if (!grid) return;
var cards = grid.querySelectorAll('.product-card');
var pills = bar.querySelectorAll('.filter-pill');
var countEl = bar.querySelector('[data-filter-count]');
function apply(w){
var n = 0;
cards.forEach(function(c){
var show = (w === 'all' || c.getAttribute('data-w') === w);
c.style.display = show ? '' : 'none';
if (show) n++;
});
if (countEl) countEl.textContent = n + (n === 1 ? ' Modell' : ' Modelle');
}
pills.forEach(function(p){
p.addEventListener('click', function(){
pills.forEach(function(x){ x.classList.remove('is-active'); });
p.classList.add('is-active');
apply(p.getAttribute('data-w'));
});
});
apply('all');
});
```

### M31 · Banner de mantenimiento — L706–L718

- **Contrato DOM**: `#maint-banner` con `[data-maint-time]` y `.maint-banner__x`.
- **Valores**: hora mostrada = `Date.now() - 5*60000` (hace 5 min) formateada `Stand dd.mm.yyyy, hh:mm Uhr`; **auto-cierre a 14000 ms** (`dismiss(false)`, no recuerda); botón × → `dismiss(true)` → `sessionStorage.maint-dismissed='1'` (no vuelve a salir en la sesión); animación: clase `is-hiding` + `setTimeout(remove, 500)`.
- **CSS**: `.maint-banner{position:fixed;top:92px;left:12px;z-index:40;background:#061827;border-left:4px solid var(--brand-lime);border-radius:10px;transition:opacity .5s ease,transform .5s ease}` / `.is-hiding{opacity:0;transform:translateY(-8px);pointer-events:none}`.
- **Presencia**: **0 páginas**.

```js
(function(){
var b = document.getElementById('maint-banner'); if (!b) return;
try { if (sessionStorage.getItem('maint-dismissed')) { b.remove(); return; } } catch (e) {}
var t = b.querySelector('[data-maint-time]');
if (t) {
var d = new Date(Date.now() - 5 * 60000), p = function(n){ return n < 10 ? '0' + n : '' + n; };
t.textContent = 'Stand ' + p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ', ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ' Uhr';
}
function dismiss(remember){ if (remember) { try { sessionStorage.setItem('maint-dismissed', '1'); } catch (e) {} } b.classList.add('is-hiding'); setTimeout(function(){ b.remove(); }, 500); }
var x = b.querySelector('.maint-banner__x');
if (x) x.addEventListener('click', function(){ dismiss(true); });
setTimeout(function(){ dismiss(false); }, 14000);   // blendet sich nach 14 s von selbst aus
})();
```

### M32 · (cierre del IIFE principal) — L719

### M33 · Vídeo de fondo perezoso según conexión — L720–L742 (IIFE independiente)

- **Contrato DOM**: `video[data-bg-video]` con el mp4 en el atributo (no en `<source>`): en el .com `<video class="home-montage__bg" muted loop playsinline preload="none" poster="assets/images/reitplatz-aufbau-poster.jpg" data-bg-video="assets/video/reitplatz-aufbau.mp4">`.
- **Condiciones para NO cargar**: `(prefers-reduced-motion: reduce)` → solo póster; `navigator.connection.saveData` (o `webkitConnection`/`mozConnection`) → solo póster. **No** mira `effectiveType` (2g/3g).
- **Carga**: `IntersectionObserver` `rootMargin: '200px'` → crea `<source type="video/mp4">`, `autoplay=muted=true`, `load()`, `play().catch(noop)`; marca `dataset.loaded` para no repetir; `io.disconnect()`. Sin IO → carga inmediata.
- **CSS**: `.home-montage__bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}` (sin transición de aparición).
- **Presencia**: `site/index.html`. (sport.html tiene otro `<video class="sp-video__media" autoplay muted loop playsinline preload="none">` **sin** `data-bg-video`, gestionado por atributos nativos.)

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
} else {
load();
}
})();
```

### Módulos citados en el encargo que NO son JS

`loadbar`, `logo-pulse`, `jobsPulse`, `wghtFlex`, `quizFade`, `fadeUp`, `pulse`, `press-scroll`, `heroSlideIn`, `cineZoom`, `cineSwap`, `vt-fade-in/out` son **`@keyframes` CSS puros** (sección 4). No hay JS que los controle salvo el toggle de clases (`is-active`, `is-swap`). `.splash` (pantalla de carga con `logo-pulse` + `loadbar`) tiene CSS (`.splash.is-done{opacity:0;pointer-events:none}`) pero **no hay JS que añada `is-done` ni markup `.splash` en ninguna página**: huérfano.

---

## 3. Catálogo completo de `transition:` (CSS)

88 declaraciones en `main.css` (incluye duplicados por redefinición). Orden de aparición en la hoja. `ease` implícito cuando no se indica easing (valor por defecto de CSS).

| Selector | Propiedades → duración / easing |
|---|---|
| `.btn` | `background .18s ease, color .18s ease, border-color .18s ease, transform .18s ease` |
| `.site-header` | `box-shadow .2s ease` |
| `.site-nav a::after` | `transform .2s ease` |
| `.burger span` (×2, redefinida) | `transform .2s ease, opacity .2s ease` |
| `.cat-chip` | `all .2s ease` |
| `.photo-gallery a` | `transform .25s ease, box-shadow .25s ease` |
| `.photo-gallery img` | `transform .35s ease` |
| `.feature` | `transform .2s ease, box-shadow .2s ease` |
| `.collection-card img` | `transform .4s ease` |
| `.product-card` | `transform .2s ease, box-shadow .2s ease, border-color .2s ease` (**pisada** después por la regla conjunta .25s) |
| `.product-card__media img` | `transform .4s ease` |
| `.gallery__thumb` | `border-color .15s ease` |
| `.form-expand-btn` | `background .2s, border-color .2s` |
| `@media (max-width:900px) .site-nav` | `transform .25s ease` |
| `.site-header__phone` | `border-color .2s, background .2s, color .2s` |
| `.site-nav__chev` | `transform .15s` |
| `.site-nav__dropdown` | `opacity .18s, transform .18s, visibility .18s` |
| `.lightbox__close` | `background .2s` |
| `.lightbox__nav` | `background .2s` |
| `.mobile-sticky-cta__call` | `background .2s` |
| `.calc-card` | `transform .2s, box-shadow .2s, border-color .2s` (pisada, ver abajo) |
| `.calc-viz__tab` | `all .18s` |
| `.m-row__remove` | `background .15s` |
| `.m-check__row` | `opacity .2s` |
| `.rb-mode-tab` | `all .15s` |
| `.rb-alt-card` | `border-color .15s` |
| `.chip` | `all .15s` |
| `@media (max-width:900px) .site-nav__group.has-dropdown>.site-nav__main::after` | `transform .2s ease` |
| `.lang-switch__current` | `border-color .2s, background .2s` |
| `.lang-switch__current svg` | `transform .2s` |
| `.lang-switch__menu` | `opacity .15s, transform .15s, visibility .15s` |
| `.lang-switch__menu a` | `background .15s` |
| `.wa-fab` | `transform .2s, box-shadow .2s, background .2s` (sin `opacity`) |
| `.color-chip` | `all .15s` |
| `.bau-light` | `background .3s, box-shadow .3s, transform .3s` |
| `.rating-badge` | `transform .2s, box-shadow .2s` |
| `.rating-dist__bar>div` | `width .3s` |
| `.case-card` | `transform .2s, box-shadow .2s, border-color .2s` (pisada) |
| `.case-card__media img` | `transform .4s` |
| `.case-hall-card` | `background .2s` |
| `.faq-item` | `border-color .2s` |
| `.blog-card` | `transform .2s, box-shadow .2s, border-color .2s` (pisada) |
| `.blog-related` | `border-color .15s` |
| `.team-card` | `border-color .2s, transform .2s` |
| `.exit-popup` | `opacity .3s` |
| `.exit-popup__box` | `transform .3s` |
| `.video-testi` | `transform .2s, box-shadow .2s, border-color .2s` |
| `.video-testi__play` | `transform .2s, background .2s` |
| `.quiz__progress-bar` | `width .4s ease` |
| `.quiz__options button` | `all .15s` |
| `.preview-tool__dropzone` | `background .2s, border-color .2s` |
| `.splash` | `opacity .5s ease` |
| `.reveal` | `opacity .6s ease, transform .6s ease` |
| `@media (prefers-reduced-motion:reduce) .reveal` | `none` |
| `.product-card,.case-card,.calc-card,.blog-card` (L3399, **gana** sobre las individuales) | `transform .25s ease, box-shadow .25s ease, border-color .2s ease` |
| `.hero__bg` | `transform .05s linear` |
| `.press-item` | `opacity .2s` |
| `.contact-action` | `background .15s, border-color .15s` |
| `.hero--slider .hero__bg--slide` | `opacity .9s ease` |
| `.hero__dot` | `background .3s, transform .3s` |
| `@media (prefers-reduced-motion:reduce) .hero--slider .hero__bg--slide` | `none` |
| `.site-nav__sports::after` | `transform .25s` |
| `.world-panel` | `flex-grow .55s cubic-bezier(.2,.7,.3,1)` |
| `.world-panel__bg` | `transform .7s ease` |
| `.sp-disc` | `box-shadow .25s, transform .25s` |
| `.sp-disc__media img` | `transform .5s` |
| `.filter-pill` | `background .18s, border-color .18s, color .18s` |
| `.choose-card` | `transform .25s ease, box-shadow .25s ease, border-color .25s ease` |
| `.choose-card__media img` | `transform .45s ease` |
| `.lead-slide` | `opacity .6s ease, visibility .6s` |
| `.lead-dot` | `background .3s, transform .3s` |
| `.lead-arrow` | `background .2s, opacity .2s, transform .2s` |
| `.maint-banner` | `opacity .5s ease, transform .5s ease` |
| `.team-wall__item` | `transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s ease` |
| `.team-wall__item img` | `transform .6s cubic-bezier(.2,.7,.2,1)` |
| `.jobs-value` | `transform .2s, box-shadow .2s` |
| `.jobcard` | `transform .2s, box-shadow .2s, border-color .2s` |
| `.jobcard::before` | `transform .25s` |
| `.jobcard__link span` | `transform .2s` |
| `.job-other` | `border-color .18s, transform .18s, box-shadow .18s` |
| `.agro-feature__video` | `transform .35s ease, box-shadow .35s ease` |
| `.agro-feature__video img` | `transform .5s ease` |
| `.agro-feature__play` | `transform .3s ease, background .3s ease` |
| `.cine-hero__bg` | `opacity 1.1s ease` |
| `.cine-hero__kicker` | `color .4s ease` |
| `.cine-tab` | `color .3s ease, border-color .3s ease` |
| `@media (prefers-reduced-motion:reduce) .cine-hero__bg` | `opacity .01s` |

### 3.1 Estados hover asociados (qué cambia al pasar el ratón)

| Selector | Estado hover (literal) |
|---|---|
| `.btn--primary:hover` | `background:var(--brand-green-dark);color:#fff;transform:translateY(-1px)` |
| `.btn--secondary:hover` | `background:var(--brand-green);color:#fff;border-color:var(--brand-green)` |
| `.btn--lime:hover` | `background:var(--brand-lime-hover);color:var(--brand-dark)` |
| `.btn--ghost-light:hover` | `background:#fff;color:var(--brand-green-deep)` |
| `.site-nav a:hover::after` | `transform:scaleX(1)` (subrayado 2 px `var(--brand-green)` desde `transform-origin:left`) |
| `.product-card:hover` / `.case-card:hover` / `.blog-card:hover` | `transform:translateY(-4px);box-shadow:var(--shadow-card);border-color:var(--brand-green)` |
| `.product-card:hover .product-card__media img` / `.case-card:hover .case-card__media img` | `transform:scale(1.04)` |
| `.calc-card:hover` | `transform:translateY(-4px);box-shadow:0 20px 40px rgba(6,24,39,.14);border-color:var(--brand-green)` |
| `.section--brand .calc-card:hover` | `background:rgba(255,255,255,.14);transform:translateY(-3px)` |
| `.feature:hover` | `transform:translateY(-4px);box-shadow:var(--shadow-card)` |
| `.collection-card:hover img` | `transform:scale(1.05)` |
| `.cat-chip:hover` | `border-color:var(--brand-green);color:var(--brand-green-dark);transform:translateY(-2px);box-shadow:var(--shadow-card)` |
| `.team-card:hover` | `border-color:var(--brand-green);transform:translateY(-2px)` |
| `.team-wall__item:hover` | `transform:translateY(-4px);box-shadow:0 16px 40px rgba(6,24,39,.18)` + `img{transform:scale(1.05)}` |
| `.choose-card:hover` | `transform:translateY(-4px);box-shadow:0 18px 44px rgba(6,24,39,.13);border-color:#cdd8d3` + `img scale(1.04)` |
| `.sp-disc:hover` | `transform:translateY(-4px);box-shadow:7px 7px 0 var(--sport-lime),7px 7px 0 1px #000` + `img scale(1.06)` |
| `.jobcard:hover` | `transform:translateY(-5px);box-shadow:0 22px 50px rgba(6,24,39,.13);border-color:transparent` + `::before{transform:scaleX(1)}` (barra superior 4 px gradiente) + `.jobcard__link span{transform:translateX(4px)}` |
| `.job-other:hover` | `border-color:var(--brand-green);transform:translateY(-3px);box-shadow:0 14px 34px rgba(26,165,133,.13)` |
| `.jobs-value:hover` | `transform:translateY(-4px);box-shadow:0 18px 44px rgba(6,24,39,.10)` |
| `.wa-fab:hover` | `background:#1ebe5c;transform:translateY(-2px);box-shadow:0 14px 30px rgba(37,211,102,.45)` |
| `.rating-badge:hover` | `transform:translateY(-2px);box-shadow:0 10px 24px rgba(6,24,39,.15)` |
| `.video-testi__play:hover` / `.agro-feature__video:hover .agro-feature__play` | `scale(1.1)` / `scale(1.08)` + `background:var(--brand-green)` |
| `.agro-feature__video:hover` | `transform:translateY(-4px);box-shadow:0 40px 90px -20px rgba(0,0,0,.78),0 0 0 1px rgba(26,165,133,.4)` + `img scale(1.04)` |
| `.press-strip__logos:hover` | `animation-play-state:paused` |
| `.press-item:hover` | `opacity:1` (desde `.65`) |
| `.lightbox__close:hover` / `.lightbox__nav:hover` | `background:rgba(255,255,255,.1)` / `rgba(255,255,255,.2)` |
| `.hero__dot:hover` | `background:rgba(255,255,255,.6)` |
| `.lead-arrow:hover` | `background:#000;opacity:1;transform:translateY(-50%) scale(1.08)` |
| `.cine-tab:hover` | `color:#fff` |
| `.quiz__options button:hover` | `border-color:var(--brand-green);transform:translateY(-1px);box-shadow:0 6px 14px rgba(26,165,133,.1)` |

**Sin estados `:active`** en todo el CSS (solo `.preview-tool canvas:active{cursor:grabbing}`). **`:focus-visible`** solo en 4 sitios: `.lang-switch__menu a`, `.contact-action`, `.hero__dot` (`outline:2px solid #fff;outline-offset:3px`), `.site-nav__sports::after`. (`.sport-world .gallery__thumb` **no** usa `:focus-visible`: su `outline:2px solid var(--sport-lime);outline-offset:-2px` — main.pretty.css L4902-4905 — se dispara con `.is-active,:hover`, no con foco por teclado; es un borde de estado permanente, se documenta en la tabla de arriba, no aquí.) El `outline:none` de `.field input:focus,.field select:focus,.field textarea:focus` (L853) **sí tiene sustituto**: `border-color:var(--brand-green)` + `box-shadow:0 0 0 3px rgba(26,165,133,.15)` (anillo verde de 3px) — pero es `:focus`, no `:focus-visible`, así que también se activa con clic de ratón. Recomendar `:focus-visible` en Pavivasa por esa razón (indicador solo por teclado), no por ausencia de sustituto.

Variables que alimentan las transiciones: `--shadow-card:0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)`; `--shadow-header:0 2px 16px rgba(6,24,39,.08)`; `--radius:12px`; `--button-corner:50px`; `--brand-green:#1aa585`; `--brand-green-dark:#12755e`; `--brand-lime:#7ec700`; `--brand-lime-hover:#84d814`; `--brand-dark:#061827`; `--color-border:#e2e2e2`.

### 3.2 Orden de apilamiento (z-index)

Consolidado de los `z-index` de elementos de UI fijos/pegajosos citados por módulo en la sección 2 (`grep -n "z-index" main.pretty.css` da 38 apariciones en total; la mayoría son capas internas de un componente — p. ej. fondo/imagen 0/1/2 dentro de una tarjeta — sin relevancia de apilamiento global; la tabla siguiente cubre los elementos `position:fixed|sticky` que sí compiten por capa):

| Selector | z-index | Capa / contexto | Módulo |
|---|---|---|---|
| `.site-header` | 50 | cabecera `sticky` | M11 |
| `.site-nav__dropdown` | 80 | desplegable desktop | (M16, variante desktop) |
| `.lang-switch__menu` | 100 | desplegable idioma | M14 |
| `.exit-popup` | 100 | overlay pantalla completa | M18 |
| `.wa-fab` | 45 | botón flotante WhatsApp | M19 |
| `.lightbox` | 1000 | overlay pantalla completa | M17 |
| `.maint-banner` | 40 | banner fijo | M31 |
| `.mobile-sticky-cta` | 40 | CTA fijo — **sin markup en el .com** (código muerto, ver §7) | — |
| `.splash` | 2000 | pantalla de carga — **sin markup en el .com** (código muerto, ver §7) | — |
| `.site-nav` (móvil, `@media max-width:900px`) | **sin `z-index` declarado** (main.pretty.css L898-914; usa `position:fixed` sin capa explícita, apilamiento por orden de DOM) | menú móvil | M12 |
| `.burger` | **sin `z-index` declarado** (main.pretty.css L165, L3683) | botón hamburguesa | M12 |

**Colisión real**: `.lang-switch__menu` y `.exit-popup` comparten `z-index:100`. No está en el código qué pasa si ambos se muestran a la vez (no hay `z-index` diferenciador ni lógica que los coordine); en la práctica el exit-popup solo dispara en desktop con `mouseout` hacia arriba de la ventana, así que la colisión con el selector de idioma (que vive en la cabecera) es improbable pero no está descartada por CSS. En Pavivasa, si se replican overlays similares, asignar capas explícitas y no reutilizar el mismo número.

---

## 4. Catálogo completo de `@keyframes`

13 keyframes. Cuerpos literales y aplicación.

| # | Nombre | Cuerpo literal | Se aplica en | `animation:` |
|---|---|---|---|---|
| 1 | `fadeUp` | `from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none}` | `.fade-up` (clase utilitaria; **0 usos en el .com**) | `fadeUp .6s ease both` |
| 2 | `pulse` | `0%,100%{box-shadow:0 0 0 0 rgba(126,199,0,.6)} 50%{box-shadow:0 0 0 8px rgba(126,199,0,0)}` | `.avail-banner__dot` (0 usos) | `pulse 1.8s ease-in-out infinite` |
| 3 | `quizFade` | `from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none}` | `.quiz__step.is-active` (0 usos; no hay JS de quiz en main.js) | `quizFade .3s ease` |
| 4 | `logo-pulse` | `0%,100%{opacity:.6;transform:scale(.96)} 50%{opacity:1;transform:scale(1)}` | `.splash__logo img` (0 usos) | `logo-pulse 1.4s ease-in-out infinite` |
| 5 | `loadbar` | `0%{width:0;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0;margin-left:100%}` | `.splash__bar-fill` (0 usos) | `loadbar 1.2s ease-in-out infinite` |
| 6 | `vt-fade-out` | `to{opacity:0;transform:translateY(-10px)}` | `::view-transition-old(root)` (todas las páginas) | `vt-fade-out .18s ease forwards` |
| 7 | `vt-fade-in` | `from{opacity:0;transform:translateY(10px)}` | `::view-transition-new(root)` (todas) | `vt-fade-in .28s ease forwards` |
| 8 | `press-scroll` | `from{transform:translateX(0)} to{transform:translateX(-50%)}` | `.press-strip__logos` (index; lista duplicada con `aria-hidden="true"` para el bucle; `width:max-content`; `mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)`; `:hover{animation-play-state:paused}`) | `press-scroll 40s linear infinite` |
| 9 | `wghtFlex` | `from{font-variation-settings:"wght" 700;letter-spacing:-.02em} to{font-variation-settings:"wght" 900;letter-spacing:0}` | `.hero h1` (**0 usos**: no hay `.hero` en el .com, solo `.page-hero`/`.cine-hero`/`.sp-hero`) — respira el peso de la fuente variable Figtree | `wghtFlex 6s ease-in-out infinite alternate` |
| 10 | `heroSlideIn` | `from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none}` | `.hero--slider .hero__slide.is-active` (0 usos) | `heroSlideIn .7s cubic-bezier(.16,.84,.44,1)` |
| 11 | `jobsPulse` | `0%,100%{opacity:1} 50%{opacity:.35}` | `.jobs-hero__count::before` (`content:"●"`, `color:var(--brand-lime)`; jobs.html) | `jobsPulse 2s infinite` (easing por defecto `ease`) |
| 12 | `cineZoom` | `from{transform:scale(1.04)} to{transform:scale(1.12)}` | `.cine-hero__bg.is-active img` (index) — Ken Burns; se reinicia en cada cambio de pestaña porque la clase `is-active` se quita/pone | `cineZoom 8s ease-out both` |
| 13 | `cineSwap` | `from{opacity:0;transform:translateY(11px)} to{opacity:1;transform:none}` | `.cine-hero__h1.is-swap, .cine-hero__sub.is-swap` (index; reinicio forzado con `void el.offsetWidth`) | `cineSwap .5s ease both` |

Otros `animation` sin keyframes propios: ninguno. `animation-play-state:paused` solo en `.press-strip__logos:hover`.

---

## 5. Reglas literales de reducción de movimiento y `hover:none`

Tres bloques `@media (prefers-reduced-motion:reduce)` (L3393, L4023, L6149 del pretty) y, por separado, uno `@media (hover:none)` (L5284). Literal:

```css
@media (prefers-reduced-motion:reduce){
  .reveal{
  opacity:1;
  transform:none;
  transition:none}
}
```

```css
@media (prefers-reduced-motion:reduce){
  .hero--slider .hero__slide.is-active{
  animation:none}
.hero--slider .hero__bg--slide{
  transition:none}
}
```

```css
@media (prefers-reduced-motion:reduce){
  .cine-hero__bg{
  transition:opacity .01s}
.cine-hero__bg.is-active img{
  animation:none}
.cine-hero__h1.is-swap,.cine-hero__sub.is-swap{
  animation:none}
}
```

```css
@media (hover:none){
  .lead-arrow{
  opacity:1}
}
```

**Qué NO cubre la reducción de movimiento (no está en el código)**: `press-scroll` (marquesina infinita 40 s), `wghtFlex`, `jobsPulse`, `pulse`, `logo-pulse`/`loadbar`, `fadeUp`, `quizFade`, `::view-transition-*`, el tilt 3D (M02), el `scroll-behavior:smooth` global, el parallax por CSS (`.hero__bg` transition) y todas las elevaciones hover. En JS sí se respeta en: M03 (parallax), M04, M05, M29 (auto-rotación) y M33 (vídeo de fondo).

Detección de puntero/táctil: `(pointer: coarse)` en M02 (tilt), M16 (acordeón móvil) y M18 (exit popup, junto con `ontouchstart`/`maxTouchPoints`). Breakpoint de "móvil" en JS: `innerWidth <= 900` (M16) y `min-width:901px` (M18), coherente con el `@media (max-width:900px)` del CSS.

---

## 6. Principios del sistema de movimiento (deducidos)

1. **Micro-interacciones cortas y uniformes**: 0.15 s (chips, thumbs, tabs pequeños), 0.18 s (botones `.btn`, dropdown, pills), 0.2 s (la gran mayoría: tarjetas, header, burger, nav underline, fab), 0.25 s (tarjetas con tilt, nav móvil, `choose-card`). Easing casi siempre `ease` (explícito o por defecto). Solo dos curvas personalizadas: `cubic-bezier(.2,.7,.2,1)` (team-wall) / `cubic-bezier(.2,.7,.3,1)` (world-panel) y `cubic-bezier(.16,.84,.44,1)` (heroSlideIn). Nada de `spring`.
2. **Zoom de imagen dentro de tarjeta, más lento que la tarjeta**: la tarjeta sube en .2–.25 s y la imagen hace `scale(1.04–1.06)` en .4–.6 s. Es el patrón "lift + zoom" repetido en `.product-card`, `.case-card`, `.collection-card`, `.choose-card`, `.sp-disc`, `.team-wall__item`, `.photo-gallery`, `.agro-feature__video`.
3. **Elevación estándar `translateY(-4px)`** (−2 px para chips/badges/botones pequeños, −1 px para `.btn--primary`, −5 px para `.jobcard`) + sombra `var(--shadow-card)` + `border-color:var(--brand-green)`. La marca se manifiesta en hover por el borde verde.
4. **Entradas por scroll**: un único patrón `opacity 0→1` + `translateY(18px→0)` en .6 s ease, sin stagger, una sola vez, disparado con 12 % de visibilidad y −60 px de margen. Los keyframes `fadeUp` (14 px), `heroSlideIn` (16 px), `cineSwap` (11 px), `quizFade` (8 px) son la misma idea con distancias 8–18 px.
5. **Capas de fondo lentas**: cross-fade de fondos 0.9–1.1 s; Ken Burns 8 s `ease-out` de 1.04→1.12; parallax 0.25×; vídeo de fondo perezoso y silenciado. Todo lo "cinematográfico" es lento (≥0.9 s) y todo lo "de interfaz" es rápido (≤0.3 s).
6. **Overlays**: 0.3 s (exit popup: opacidad + `scale(.94→1)`), 0.15–0.18 s (menús). El lightbox no anima (toggle de `hidden`).
7. **Ritmo de auto-rotación**: 3.8 s (lead-slider), 5.5 s (cine-hero), 6 s (hero-slider); pausa en hover, pausa en pestaña oculta, desactivado con reduced-motion pero manteniendo control manual.
8. **Ambient loops** muy discretos: marquesina 40 s lineal, latido de un punto 1.8–2 s, respiración del peso tipográfico 6 s alterno. Ninguno respeta reduced-motion.
9. **Sin animación de layout**: filtros, acordeones móviles, form-expand y galería cambian `display`/`hidden`/`src` en seco.
10. **Rendimiento**: `will-change:transform` solo en tarjetas tilt y `.hero__bg`; listeners `passive:true` en scroll/touch; carga diferida por IO con `rootMargin:'200px'` para three.js y vídeo; GTM diferido a la primera interacción o 4 s.
11. **Detección**: reduced-motion evaluado **una vez** al cargar (no reactivo a cambios); `(pointer: coarse)` evaluado en cada evento en el tilt.

---

## 7. Código muerto en el .com (hooks sin markup)

Inventario por grep en las 78 páginas del espejo:

| Módulo | Hook | Páginas | Estado |
|---|---|---|---|
| M03 parallax | `.hero__bg` | 0 (los heros son `.page-hero__bg`, `.sp-hero__bg`, `.cine-hero__bg`) | inerte |
| M04 hero-slider | `[data-hero-slider]` | 0 | inerte |
| M07 live-counter | `[data-live-counter]` | 0 | inerte |
| M08 weather | `#weather-snow` | 0 | inerte |
| M09 hero-video | `[data-hero-video]` | 0 | inerte |
| M10 form-expand | `[data-form-expand]` | 0 | inerte |
| M13/M27 galería | `[data-gallery-main]`, `[data-gallery-thumb]` | 0 | inerte |
| M17 lightbox | `[data-lightbox]` 78 / triggers 0 | markup en todas, nunca se abre | inerte |
| M20 avail | `[data-avail]` | 0 | inerte |
| M22 3D | `.threed-viewer` | 0 | inerte |
| M23 AR | `[data-ar-btn]` | 0 | inerte |
| M24 video-testi | `.video-testi__play` | 0 | inerte |
| M26 prefill | ruta `request-for-quote.html` | la página es `request-a-quote.html` | inerte |
| M28 hidden fields | `form[data-netlify]` | 0 | inerte (el click tracking sí funciona) |
| M29 lead-slider | `[data-lead-slider]` | 0 | inerte |
| M30 filtros | `[data-filter-bar]` | 0 (sport.html tiene `data-w` en cards, sin barra) | inerte |
| M31 maint-banner | `#maint-banner` | 0 | inerte |
| CSS `.splash`, `.fade-up`, `.hero h1` (wghtFlex), `.quiz__*`, `.mobile-sticky-cta`, `.world-panel`, `.choose-card`, `.blog-card`, `.team-card`, `.timeline`, `.how-step` | — | 0 | CSS sin uso en el .com |

**Activos en el .com**: M01 reveal, M02 tilt, M05 cine-hero (index), M06 view transitions, M11 header, M12 burger, M14 lang-switch, M15 anclas, M16 acordeón nav, M18 exit-popup, M19 wa-fab, M21 before-after (index), M25 SW (auto-desinstala), M28 click tracking, M33 bg-video (index), más el GTM inline.

Peso: 30 KB de JS sin minificar real (el "min" no está minificado: `main.min.remote.js` es idéntico a `main.js`), de los cuales la mitad larga es código inerte en este dominio.

---

## 8. Traducción a Next.js 15 / Tailwind 3.4 / shadcn/ui

### 8.1 Qué es CSS puro (Tailwind utilities o `globals.css`) — cero JS

| Patrón Globotent | Implementación Pavivasa |
|---|---|
| Lift + zoom de tarjeta | Contenedor: `group transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:shadow-card hover:border-primary`. Imagen: `transition-transform duration-[400ms] group-hover:scale-[1.04]`. `motion-reduce:transition-none motion-reduce:hover:translate-y-0`. |
| Botones `.btn` | Extender `buttonVariants` de shadcn con `transition-[background-color,color,border-color,transform] duration-[180ms] hover:-translate-y-px`. Radio `rounded-full` (`--button-corner:50px`), altura 44/56 px (`h-11`/`h-14`). |
| Subrayado nav `scaleX(0→1)` | `relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100`. |
| Burger → X | Tres `<span>` con `transition-[transform,opacity] duration-200`, dentro de un `<button>` trigger con clase `group` (Radix pone `data-state` en el trigger, no en los hijos, así que los spans necesitan `group-data-[state=open]:…` para reaccionar). Réplica literal de M12 (`.burger.is-open span:nth-child(1/2/3)`): span 1 `group-data-[state=open]:translate-y-2 group-data-[state=open]:rotate-45`; span 2 `group-data-[state=open]:opacity-0`; span 3 `group-data-[state=open]:-translate-y-2 group-data-[state=open]:-rotate-45`. |
| Dropdown escritorio | shadcn `NavigationMenu` (Radix) ya anima; ajustar a `duration-[180ms]` y `translate-y-[-6px]`. |
| Marquesina prensa | `@keyframes press-scroll{to{transform:translateX(-50%)}}` en `globals.css`, `animate-[press-scroll_40s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none`, lista duplicada `aria-hidden`, `[mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]`. |
| Punto latiendo | `animate-pulse` de Tailwind (2 s) o keyframe `pulse` de Globotent (box-shadow 0→8 px) en `tailwind.config` `keyframes`. |
| Ken Burns del hero | `@keyframes cineZoom{from{transform:scale(1.04)}to{transform:scale(1.12)}}` + `animate-[cineZoom_8s_ease-out_both] motion-reduce:animate-none`. |
| Entrada `cineSwap`/`fadeUp` | Keyframes en `tailwind.config`; aplicar con `key={idx}` para reiniciar (sustituye al truco `void el.offsetWidth`). |
| Cross-fade de fondos | `transition-opacity duration-[1100ms] ease-out data-[active=true]:opacity-100 opacity-0 motion-reduce:duration-0`. |
| Header con sombra | Ver 8.2 (necesita 1 listener) **o** sin JS: `position:sticky` + `animation-timeline: scroll()` (Chromium; progresivo). Recomendado: componente cliente mínimo. |
| Scroll a anclas con offset | Sin JS: `html{scroll-behavior:smooth}` (`motion-safe:scroll-smooth` en `<html>`) + `scroll-mt-[90px]` (o `scroll-pt-[90px]` en `html`) en las secciones. Elimina M15 entero. |
| View transitions entre rutas | Next 15 App Router: `experimental.viewTransition: true` en `next.config` + `<ViewTransition>` de React (canary) **o** `next-view-transitions`. Alternativa sin coste: `@view-transition{navigation:auto}` no aplica a navegación SPA. Definir `::view-transition-old(root){animation:vt-fade-out .18s ease forwards}` / `::view-transition-new(root){animation:vt-fade-in .28s ease forwards}` en `globals.css` y envolver en `@media (prefers-reduced-motion:no-preference)`. Decisión pendiente del presupuesto JS: si no se adopta, no se pierde nada esencial. |
| Reveal al scroll (opción sin JS) | `@supports (animation-timeline: view())` → `.reveal{animation:fadeUp .6s ease both;animation-timeline:view();animation-range:entry 12% entry 40%}`; fuera de soporte, visible sin animar. Cubre Chromium/Safari 26+; Firefox aún no (según estado de la plataforma; verificar). Si se quiere paridad total, ver 8.2. |
| Comparador antes/después (estado inicial) | `clip-path:[inset(0_0_0_50%)]`, `touch-action:pan-y`, `select-none`, `aspect-video`, `rounded-xl`. La interacción sí es JS (8.2). |

Tokens de movimiento propuestos para `tailwind.config.ts` (derivados de la sección 6). **Deben ir anidados bajo `theme.extend`**, no bajo `theme` a secas: en Tailwind 3.4, `theme.extend` hace merge profundo con el tema por defecto, mientras que una clave puesta directamente bajo `theme` (p. ej. `theme.keyframes`) **reemplaza entera** esa sección — se perderían `spin`/`ping`/`bounce`/etc. de fábrica:

```ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      transitionDuration: { 150:'150ms', 180:'180ms', 200:'200ms', 250:'250ms', 300:'300ms', 400:'400ms', 600:'600ms', 900:'900ms', 1100:'1100ms' },
      transitionTimingFunction: { 'out-soft':'cubic-bezier(.2,.7,.2,1)', 'hero':'cubic-bezier(.16,.84,.44,1)' },
      keyframes: {
        fadeUp:{ from:{opacity:'0',transform:'translateY(14px)'}, to:{opacity:'1',transform:'none'} },
        cineZoom:{ from:{transform:'scale(1.04)'}, to:{transform:'scale(1.12)'} },
        cineSwap:{ from:{opacity:'0',transform:'translateY(11px)'}, to:{opacity:'1',transform:'none'} },
        'press-scroll':{ from:{transform:'translateX(0)'}, to:{transform:'translateX(-50%)'} },
        pulseRing:{ '0%,100%':{boxShadow:'0 0 0 0 hsl(var(--accent) / .6)'}, '50%':{boxShadow:'0 0 0 8px hsl(var(--accent) / 0)'} },
      },
      boxShadow: { card:'0 2px 6px rgba(6,24,39,.06),0 8px 24px rgba(6,24,39,.06)', header:'0 2px 16px rgba(6,24,39,.08)' },
    },
  },
} satisfies Config
```

(Los colores de sombra son los de Globotent; sustituir por los tokens de Pavivasa del doc 01. `pulseRing` usa `hsl(var(--accent) / alfa)` — la convención de color por defecto de shadcn/ui en Tailwind 3.x, con `--accent` declarado como triplete `H S% L%` en `globals.css` — para ser consistente con el resto de tokens de color de shadcn; si Pavivasa declarase `--accent` en canales RGB en vez de HSL, usar `rgb(var(--accent) / .6)` en su lugar, pero no mezclar ambas convenciones en el mismo proyecto.)

### 8.2 Componentes cliente mínimos (`'use client'`)

Lista cerrada. Cada uno es pequeño y sin dependencias externas salvo shadcn/Radix ya presentes.

| Componente | Sustituye a | Contrato y valores a conservar | Notas de implementación |
|---|---|---|---|
| `<SiteHeader>` (solo la parte interactiva: `useScrolled` + `Sheet`/`Collapsible` móvil) | M11, M12, M16 | umbral `scrollY > 8`; nav móvil `translateY(-200%)→0` .25s; cierra con Escape, clic fuera, scroll >12 px, clic en enlace; acordeón exclusivo; breakpoint 900 px | `useEffect` con `scroll` passive + `useSyncExternalStore` opcional. Menú móvil con shadcn `Sheet` (side="top") o `Collapsible`; Radix aporta focus-trap y `aria-expanded`, que Globotent no tiene. |
| `<Reveal>` | M01 | `threshold:0.12`, `rootMargin:'0px 0px -60px 0px'`, una vez, `opacity 0→1 + translateY(18px→0)` .6s ease, `motion-reduce` → visible sin transición | Un solo `IntersectionObserver` compartido vía contexto o hook `useReveal(ref)`. **Regla dura**: nunca emitir `opacity-0`/`data-reveal` (ni ninguna clase que oculte el contenido) en el HTML que sirve el servidor — Globotent mismo lo incumple en 3 `.jobcard` de `jobs.html` (ver M01, "Riesgo"), que quedan invisibles sin JS. Renderizar SIEMPRE el contenido visible en el marcado inicial y aplicar el estado oculto solo tras montar en cliente (`useEffect`/hidratación), no como clase estática en JSX. Alternativa sin JS en 8.1. |
| `<CineHero>` | M05 | `DELAY 5500`; pausa en hover y `document.hidden`; `motion-reduce` → sin auto-rotación; pestañas `role="tab"` + `aria-selected`; cross-fade 1.1 s; Ken Burns 8 s; `cineSwap` .5s con `key={idx}` | Contenido de pestañas como array tipado (no `data-*`). Añadir `aria-live="polite"` al h1 o evitar cambiar el h1 (mejor: h1 fijo y cambiar solo sub/CTA por SEO). Radix `Tabs` es opcional; con `<button>` basta. Contrato de datos (réplica de los 6 `data-*` de M05 — `data-world/eyebrow/h1/sub/cta/href` — `data-world` solo tiene `'industrie'` o `'sport'` en el .com): `type CineTab = { world: 'industrie' &#124; 'sport'; eyebrow: string; h1: string; sub: string; cta: string; href: string }`. |
| `<BeforeAfter>` | M21 | `clip-path:inset(0 0 0 pct%)`, handle `left:pct%`, 0–100, arrastre + clic; `touch-action:pan-y` | Implementar con **Pointer Events** (`onPointerDown/Move/Up` + `setPointerCapture`) en vez de mouse+touch. Añadir `<input type="range">` visualmente oculto o `role="slider"` + flechas de teclado (Globotent no lo tiene). Contrato de props (réplica del markup de M21 — imágenes antes/después + etiquetas + aviso): `type BeforeAfterProps = { beforeSrc: string; afterSrc: string; beforeAlt: string; afterAlt: string; beforeLabel?: string; afterLabel?: string; notice?: string }`. |
| `<BgVideo>` | M33 | `rootMargin:'200px'`; no cargar si `prefers-reduced-motion` o `connection.saveData`; `muted playsInline loop preload="none" poster` | `useEffect` + IO; `src` se añade dinámicamente. Peso del mp4 fuera del bundle. |
| `<WhatsAppFab>` | M19 | IO sobre `<footer>` con `threshold:0.05` → oculto (`opacity-0 translate-y-5 pointer-events-none`); oculto en páginas de producto/servicio si se desea | Añadir `transition-opacity` (Globotent olvidó `opacity` en la lista). Tracking `whatsapp_click` en `onClick` (M28). |
| `<Lightbox>` (solo si Pavivasa tiene galerías de obra) | M13, M17, M27 | Escape, ←/→, swipe 50 px, contador "i / n", fondo `rgba(6,24,39,.92)`, `padding:48px`, botones 56 px | shadcn `Dialog` (Radix) da focus-trap, `role="dialog"` y bloqueo de scroll gratis. Cargar con `next/dynamic` para no meterlo en el bundle inicial. `next/image` para las fuentes. |
| `<FilterBar>` (solo si hay catálogo filtrable) | M30 | pills `is-active`, contador, `display:none` en seco | `useState` + `searchParams` (URL compartible). Opcional `View Transitions` de React para animar el reflow. |
| `<TrackLinks>` (o dentro de Analytics) | M28 (solo clics) | `wa.me|whatsapp` → `whatsapp_click`; `tel:` → `phone_click`; `mailto:` → `email_click` | Un listener delegado en `document` en fase de captura, dentro de un componente `<Analytics/>` cliente; GTM con `@next/third-parties/google` (`GoogleTagManager`) y estrategia diferida. |
| `<Tilt>` (opcional) | M02 | `perspective(900px)`, ±1.5°, `translateY(-4px)`, ignorar `(pointer: coarse)`, `transition-transform duration-250` | **Recomendación: no implementar.** Coste bajo pero valor estético marginal y es un handler `mousemove` por tarjeta. Si se quiere "wow" en tarjetas, el lift+zoom CSS basta. |

Todo lo demás de la página (heros interiores, tarjetas, secciones, footer) son **Server Components sin JS**.

### 8.3 Qué se descarta para Pavivasa y por qué

| Módulo | Motivo |
|---|---|
| M03 parallax `.hero__bg` | Inerte incluso en Globotent; listener `scroll` sin rAF; efecto prescindible. Si se quiere profundidad en el hero, Ken Burns CSS (8.1) sin JS. |
| M04 hero-slider, M29 lead-slider | Inertes en el .com; carruseles auto-rotativos penalizan LCP y accesibilidad. Pavivasa usa el `<CineHero>` (una sola instancia) o un hero estático. |
| M06 view transitions JS | En Next el router es SPA: el patrón `location.href` no aplica. Ver 8.1 para la variante nativa; decisión por presupuesto JS. |
| M07 live-counter, M20 avail | Prueba social simulada (números aleatorios/deterministas por URL). Descartado por honestidad y por riesgo reputacional; si se quieren cifras, que sean reales y estáticas (SSR). |
| M08 weather/geolocation | Específico de cargas de nieve DACH; sin sentido para pavimentos en Valencia; pide permiso de geolocalización. |
| M09 hero-video fallback, M24 video-testi | Sin markup en el .com. Si Pavivasa usa vídeo de fondo, `<BgVideo>` ya cubre el fallback con `poster`. |
| M10 form-expand | Sin uso; los formularios de Pavivasa se hacen con shadcn `Form` + `react-hook-form`/`zod` y progressive disclosure con `Collapsible` si hace falta. |
| M14 lang-switch | Pavivasa es monolingüe (español). |
| M15 scroll a anclas | Sustituido por `scroll-behavior` + `scroll-margin-top` (CSS). |
| M17 lightbox | **Condicional**: solo si hay galería de obras. En Globotent está muerto. |
| M18 exit-popup | Interrupción agresiva; `sessionStorage`; no funciona en móvil (que será la mayoría del tráfico local). Sustituir por CTA sticky en móvil (`.mobile-sticky-cta` también existe en el CSS de Globotent pero sin uso) o banda CTA al final. |
| M22 three.js, M23 model-viewer | 600 KB+ de terceros desde unpkg/google; sin relación con hormigón impreso. |
| M25 service worker | Hoy es auto-desinstalador; Next no necesita SW para caché estática (Vercel/CDN). No implementar PWA. |
| M26 prefill RFQ | No hay configurador. |
| M28 campos ocultos Meta CAPI | Solo si Pavivasa hace Meta Ads con CAPI vía Netlify; en Next se haría en el Route Handler del formulario (server-side), no en el cliente. |
| M30 filtros | Solo si hay catálogo con ≥8 ítems filtrables; para pavimentos probablemente basta una grid por tipo (impreso/pulido/…) con pestañas SSR o anclas. |
| M31 maint-banner | Operativo interno. |
| CSS huérfano (`.splash`, `wghtFlex`, `.quiz`, `.world-panel`, `.bau-light`, `.preview-tool`) | Sin markup; `wghtFlex` requiere fuente variable y anima `font-variation-settings` (caro en repaint); `.splash` es una pantalla de carga, anti-patrón para LCP. |

Presupuesto de JS: con la lista 8.2 el JS propio de cliente queda en ~6 componentes pequeños (header, reveal, hero, before-after, bg-video, fab) más analytics; lightbox y filtros solo bajo demanda con `next/dynamic`. No se añade ninguna librería de animación (ni framer-motion ni GSAP): todo lo que Globotent hace se cubre con transiciones/keyframes CSS y `IntersectionObserver`.

### 8.4 Mejoras de accesibilidad respecto al original (a aplicar en Pavivasa)

- Todos los overlays con Radix (`Dialog`/`Sheet`): focus-trap, `aria-modal`, Escape, restauración de foco — Globotent no tiene ninguno.
- `:focus-visible` global en `globals.css` (Globotent solo lo define en 4 selectores; su único `outline:none` de formulario sí tiene sustituto visual, pero es `:focus` en vez de `:focus-visible` — ver §3.1).
- `motion-reduce:` en TODAS las animaciones ambient (marquesina, latidos, Ken Burns), no solo en reveal/hero.
- Comparador con teclado (`role="slider"`, `aria-valuenow`, flechas).
- Pestañas del hero con navegación por flechas (Radix `Tabs`) y sin cambiar el `<h1>` (SEO + `aria-live`).
- Enlaces: no interceptar clics con modificadores (M06 rompe cmd+clic).

---

## 9. Afirmaciones verificables y dudas

### 9.1 Afirmaciones (para verificación por otro agente)

Ver el objeto estructurado devuelto por este agente; resumen:

- `main.js` = 742 líneas / 30 225 B, idéntico a `main.min.remote.js`; un IIFE (L1–L719) + un IIFE para `data-bg-video` (L720–L742).
- Reveal: 19 selectores, `threshold: 0.12`, `rootMargin: '0px 0px -60px 0px'`, `.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}`.
- Tilt: `perspective(900px)`, ±1.5° (`x*3`, `-y*3` con x,y ∈ [−.5,.5]), `translateY(-4px)`, salta con `(pointer: coarse)`.
- Parallax: `scrollY * 0.25`; `.hero__bg{will-change:transform;transition:transform .05s linear}`; 0 páginas con `.hero__bg` en el .com.
- Hero-slider `DELAY = 6000`; cine-hero `DELAY = 5500`; lead-slider `3800` ms con desfase `idx * 1900`.
- View transitions: `vt-fade-out .18s ease forwards` (`translateY(-10px)`), `vt-fade-in .28s ease forwards` (`translateY(10px)`), `@view-transition{navigation:auto}`.
- Exit popup: `mouseout` con `clientY <= 0 && !relatedTarget`, `min-width:901px`, no táctil, `sessionStorage['globotent_exit_shown']`, transición .3s, `scale(.94→1)`; markup en 78 páginas.
- WhatsApp FAB: IO sobre `.site-footer` `threshold: 0.05`; `.wa-fab` `#25D366`, `bottom:24px;right:24px;z-index:45`; oculto por `body.is-product-detail` (36 páginas).
- Before/after: `clip-path:inset(0 0 0 pct%)`, reposo 50 %, `touch-action:pan-y`, handle 4 px con botón 44 px.
- Lightbox: swipe 50 px, `z-index:1000`, `padding:48px`, `rgba(6,24,39,.92)`; sin triggers en el .com.
- Header: `is-scrolled` si `scrollY > 8`; nav móvil `translateY(-200%)`, `.25s ease`, se cierra con scroll > 12 px.
- Anclas: `offsetTop - 90`, `behavior:'smooth'`; `html{scroll-behavior:smooth}`.
- 13 `@keyframes`; 88 declaraciones `transition`; 3 bloques `prefers-reduced-motion:reduce`; 1 bloque `hover:none`.
- `press-scroll 40s linear infinite`, `cineZoom 8s ease-out both` (1.04→1.12), `cineSwap .5s ease both`, `wghtFlex 6s ease-in-out infinite alternate` (wght 700→900), `jobsPulse 2s infinite`, `pulse 1.8s ease-in-out infinite`.
- bg-video: no carga con reduced-motion ni `connection.saveData`; IO `rootMargin:'200px'`.
- GTM `GTM-MR5F4PQR` diferido a primera interacción o 4000 ms.
- `sw.js` remoto se auto-desinstala (borra caches + `unregister()`).
- `sessionStorage` claves: `globotent_exit_shown`, `globotent_config`, `maint-dismissed`.

### 9.2 Dudas / no confirmado

- No he ejecutado el sitio en navegador: el comportamiento real (p. ej. si el `transition .25s` sobre `transform` hace el tilt visiblemente "laggy", o si el `is-visible` del reveal pisa el `opacity:.65` de `.press-item`) se deduce del CSS, no se ha observado.
- `main.js` local es idéntico al remoto del .com, pero los dominios .de/.es/.pt podrían servir plantillas con los hooks "muertos" activos (`.hero__bg`, `data-lead-slider`, `data-filter-bar`, galería). No verificado.
- El presupuesto de JS concreto del proyecto Pavivasa no está en las fuentes que se me han dado; la sección 8 asume "mínimo cliente" y lo cuantifica en componentes, no en KB.
- Soporte de `animation-timeline: view()` en Firefox a fecha de hoy: no verificado; lo marco como progresivo.
- `'Clash Display'` (usado en `.world-panel__h2--sport`, `.sp-disc__body h3` y 5 reglas más — 7 bloques de regla en total: L4163, L4216, L4240, L4318, L4395, L4428, L4464 de main.pretty.css; el de L4240 es un selector compuesto de 4 partes, `.sport-world h1,.sport-world h2,.sport-world h3,.sport-world .padel-h1`, así que son 10 selectores individuales) **no tiene `@font-face` ni `<link>`**: no se carga y cae a `var(--font-family)` (Figtree). Afecta a estilo, no a movimiento, pero se cita por el encargo.
- `ecUserData()` está definida y nunca se llama en `main.js`; puede que la use el JS de GTM. No verificable aquí.
- `data-theme="dark"` se lee en el visor 3D pero ninguna página lo declara; no hay modo oscuro.
