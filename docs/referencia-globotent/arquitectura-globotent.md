# Arquitectura frontend de globotent.com — referencia para el diseño de Pavivasa

Documento único y autocontenido. No hace falta abrir ningún otro archivo de esta carpeta para diseñar
la web de Pavivasa a partir de él: cada sección trae sus valores literales. Los archivos `01-fundamentos.md`
a `12-otros.md` son la extracción detallada de la que sale cada afirmación, citados al final de cada
sección por si algo necesita más profundidad o más contexto de código.

Rastreo del sitio origen: 2026-09-18. Fuente: espejo local completo de https://globotent.com/ (78 páginas,
un CSS de 6156 líneas formateadas, un JS de 742 líneas). Fuente del negocio: `brief-claude-design.md`
(ficha de Pavivasa, copy real, 15 obras documentadas, reglas de construcción del esqueleto Next.js ya
existente). Todo hex, clase, `data-*`, px, ms y easing es literal del código; nada traducido.

---

## 0. Cómo leer esto

**Para qué sirve.** Este documento describe la ARQUITECTURA FRONTEND de globotent.com — mecanismo, no
solo apariencia — para que sirva de inspiración a un sistema visual **nuevo** para Pavivasa (hormigón
impreso y pulido, Sollana, Valencia). No es una plantilla a clonar: cada sección dice qué mecanismo
conservar, qué valores sustituir y qué no copiar en absoluto.

**Dos lectores.**
- **Claude Design** diseña la web nueva de Pavivasa. Lee este documento junto con `brief-claude-design.md`
  (el brief de negocio: ficha de empresa, 15 obras, arquitectura fija del esqueleto Next.js, reglas de
  construcción no negociables, contenido real). El encargo exacto está en la §12.
- **Claude Code** implementa lo que Claude Design entregue, en Next.js 15 App Router + Tailwind 3.4 +
  shadcn/ui, sobre el repo `DreiSup/pavivasa_web`, que **ya existe** (tiene `app/layout.tsx`, `lib/schema.tsx`,
  `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts` — no se parte de cero). Cada componente trae, donde
  aplica, una subsección **"Traducción a Next/Tailwind/shadcn"**.

**Convenciones de esta síntesis.**
- Los valores son los **efectivos** (tras la cascada CSS), no siempre los primeros declarados. Globotent
  tiene varias reglas tardías que anulan a las base (p. ej. el botón normal declara 44px pero un
  `min-height:48px` posterior gana siempre → el valor efectivo, y el que se documenta aquí, es 48px). Cuando
  hay un defecto de código (una `calc()` inválida, un token muerto, una cascada contradictoria), se dice
  explícitamente y se marca como "no copiar", no se transcribe como si fuera intencional.
- "No está en el código" significa exactamente eso: no se ha inventado nada que no esté verificado en el
  CSS, el HTML o el JS de globotent.com.
- Cada sección termina con **"→ Detalle en:"**, la referencia a los archivos 01-12 de esta carpeta.
- El copy y los datos de Pavivasa que aparecen aquí (obras, cifras, texto) son siempre literales de
  `brief-claude-design.md`; donde un dato de Pavivasa está pendiente de confirmar, se marca **[pendiente]**.

**Restricción de negocio que atraviesa todo el documento.** El brief fija reglas de construcción **no
negociables** para Pavivasa (`brief-claude-design.md` §7, bloque 3): tokens con nombres fijos (`fondo`,
`fondo-alt`, `tinta`, `tinta-media`, `pigmento`, `pigmento-hover`, `acero`, `sobre-tinta`, `error`), tres
familias tipográficas (display / texto / mono para datos de obra), escala cerrada de 9 pasos
(12/14/16/20/26/34/46/64/88px, sin valores intermedios), **esquinas a 0**, **una sola sombra** en toda la
web (la de la barra fija de móvil), objetivo táctil 44px, cero fotos de stock de personas, un único
teléfono. Estas reglas **priman sobre cualquier valor literal de globotent** citado más abajo. Donde
globotent usa radio 12px/16px/50px/999px o dos sombras (`--shadow-card`, `--shadow-header`), esos números
se documentan para entender el mecanismo (qué radio va en qué contexto, cuándo aparece sombra), no como
valores a copiar: en Pavivasa, todo eso se resuelve a `0` y a la única sombra permitida. Esto se repite en
cada sección para que no haga falta memorizarlo.

→ Detalle en: `01-fundamentos.md` (metodología, líneas 1-9); `brief-claude-design.md` §7.

---

## 1. Identidad y principios del sistema

Qué hace que globotent.com "se sienta" como se siente, en siete mecanismos concretos:

1. **Radios consistentes por tamaño de elemento, nunca por sección.** `12px` es el radio por defecto de
   cajas medianas (tarjetas, `cta-band`, `three-d-cta`), `16px` en cajas más grandes o "premium" (muro de
   equipo, exit-popup, tarjetas del mundo sport), `10px` en inputs y radios pequeños, `50px`/`999px` en
   todo lo que es píldora (botones, badges, chips, eyebrows con fondo). No hay un cuarto radio suelto: la
   escala es corta y se repite. — **Para Pavivasa**: la misma disciplina de "un radio por rol, no por
   sección" se traduce en "0 en todos los roles" (brief §7-3); lo que se conserva es la idea de sistema
   cerrado, no los números.
2. **Una sola sombra que solo aparece en hover, nunca en reposo.** Las tarjetas no tienen sombra estática;
   la sombra (`--shadow-card`) es el premio del hover, junto con `translateY(-4px)` y un borde que pasa a
   verde de marca. La cabecera solo gana sombra al hacer scroll (`.is-scrolled`, `scrollY > 8`). Nada tiene
   sombra "porque sí". — Para Pavivasa esto encaja exactamente con "una sola sombra en toda la web, la de
   la barra fija de móvil" (brief §7-3): ni siquiera esa única sombra permitida debería aparecer en reposo
   en una tarjeta; el patrón correcto es feedback de interacción vía color de borde y `translate-y`, sin
   sombra en absoluto salvo la barra móvil.
3. **El verde de marca (`#1aa585`) se manifiesta en la interacción, no en el fondo.** Casi ninguna sección
   tiene fondo verde sólido (solo dos: `.section--brand`, el gradiente de calculadoras, y `.cta-band`, la
   banda de cierre). El resto del sitio es blanco / gris muy claro / navy oscuro, y el verde aparece en
   bordes de hover, subrayados, eyebrows, precios, CTA. Es un acento de interacción, no un color de
   superficie. — Para Pavivasa, el "pigmento" del brief debería seguir la misma disciplina: aparece en el
   CTA primario y en el estado activo, nunca como fondo de sección salvo en el cierre (regla del acento,
   brief §7-3: "por pantalla, un CTA primario y el estado activo. Nunca como texto pequeño sobre fondo
   claro").
4. **Eyebrows (kickers) en mayúsculas, verde, tracking positivo, sobre cada cabecera de sección.** El
   patrón `.section__eyebrow` (`.8rem`, 800, `letter-spacing:.12em`, `#1aa585`, `margin-bottom:8px`) se
   repite 18 veces en el espejo completo y ancla visualmente cada bloque: eyebrow → h2 → párrafo, siempre
   en ese orden, centrado por defecto. — Este es uno de los mecanismos con más valor para copiar en
   Pavivasa: da ritmo y jerarquía sin necesitar imágenes.
5. **Píldoras (`border-radius:50px`/`999px`) para todo lo interactivo o etiquetado**: botones, badges de
   producto, chips de idioma, eyebrows con fondo, el botón de WhatsApp, el rating badge. La forma píldora
   es la firma visual más repetida del sitio (33 usos de `--radius` + docenas de píldoras sueltas). — Para
   Pavivasa esto se resuelve a rectángulos de esquina 0 (brief), pero el patrón "todo lo interactivo lleva
   la misma forma, sea botón o etiqueta" se conserva.
6. **Fotografía a sangre con degradado de lectura, nunca texto sobre foto sin scrim.** Todo bloque con foto
   de fondo (hero, `page-hero`, `collection-card`, `home-montage`) lleva un degradado oscuro (base
   `rgba(6,24,39,…)` o, en el hero, `rgba(8,16,24,…)`) calculado para que el texto quede legible sin perder
   la foto. Nunca hay texto plano sobre imagen sin ese tratamiento. — Para Pavivasa, con **cero fotos de
   personas** y fotografía real de obra pendiente de catalogar, este mecanismo se aplica igual sobre las
   fotos de obra que sí hay, y sobre `BloquePosicion` mientras no las haya.
7. **Movimiento como confirmación, no como espectáculo — excepto en el hero.** Casi toda la interfaz se
   mueve en 0.15-0.3s con `ease` (botones, tarjetas, header, menús): es feedback, no coreografía. La única
   excepción deliberada es el hero de home (`.cine-hero`), que es lento y cinematográfico (crossfade 1.1s,
   zoom 8s, rotación cada 5.5s): el sitio reserva el "espectáculo" para un único elemento y lo mantiene
   contenido a él. — Para Pavivasa: mismo principio, aplicado a un hero propio (§8) con imágenes de obra en
   vez de imágenes de nave/pádel.

→ Detalle en: `01-fundamentos.md` §1-§3 (tokens y tipografía); `04-tarjetas.md` §0, §3 (mecanismos
transversales de tarjeta); `07-interacciones-y-movimiento.md` §6 (principios de movimiento); `brief-claude-design.md`
§7 (reglas de construcción de Pavivasa).

---

## 2. Tokens (tabla completa)

### 2.1 Tokens de globotent (referencia — para entender el mecanismo)

| Token | Valor | Rol |
|---|---|---|
| `--brand-green` | `#1aa585` | Verde de marca: CTA primario, bordes hover, eyebrows, precios, subrayado nav |
| `--brand-green-dark` | `#12755e` | Hover del primario; texto sobre tintes verdes (badges) |
| `--brand-green-deep` | `#007a4a` | Extremo oscuro de gradientes (`.feature__icon`, `.cta-band`) |
| `--brand-lime` | `#7ec700` | Acento secundario: `.btn--lime`, cifras sobre fondo oscuro, hover de enlaces de pie |
| `--brand-dark` | `#061827` | Fondo oscuro: `.section--dark`, pie, `.trust-bar` |
| `--brand-navy` | `#0f1428` | **Token muerto**: declarado, 0 usos con `var()` en todo el CSS. No replicar un token sin uso. |
| `--color-title` | `#151719` | Color de `h1`-`h5`, títulos de tarjeta, nav |
| `--color-text` / `--color-sub-title` | `#535353` (mismo valor, dos roles semánticos) | Cuerpo de párrafo / metadatos y captions |
| `--color-link` | `#222222` | Solo `a` base y enlaces de la columna "Tools" del mega menú |
| `--color-border` | `#e2e2e2` | Borde estándar de tarjetas, inputs, separadores |
| `--color-bg` | `#ffffff` | Fondo base |
| `--color-bg-soft` | `#f6f8f7` | Secciones alternas, placeholders de media, cajas de datos |
| `--radius` | `12px` | Radio estándar de tarjeta/caja mediana (33 usos) |
| `--shadow-card` | `0 2px 6px rgba(6,24,39,.06), 0 8px 24px rgba(6,24,39,.06)` | Sombra de **hover** de tarjeta (nunca en reposo) |
| `--shadow-header` | `0 2px 16px rgba(6,24,39,.08)` | Sombra de cabecera solo cuando `scrollY > 8` |
| `--button-corner` | `50px` | Radio píldora de `.btn` |
| `--button-font-weight` / `--button-text-transform` | `800` / `uppercase` | Tipografía de todos los botones |
| `--button-normal-height` | `44px` declarado, **48px efectivo** (ver nota) | Alto de botón |
| `--button-large-height` | `56px` | Alto de `.btn--lg` |
| `--button-medium-height` | `56px` | **Token muerto**: declarado, 0 usos. |
| `--font-family` | `'Figtree',system-ui,-apple-system,sans-serif` | Única familia realmente cargada |
| `--container` | `1280px` | Ancho máximo de `.container` |
| `--touch-target-min` | `48px` | Área táctil mínima aplicada a botones, inputs, enlaces de cabecera/pie |
| `--sport-lime` | `#e3fc03` | Sub-marca "sport" — **no aplica a Pavivasa**, ver §11 |

**Defectos de código que no hay que reproducir**: `--brand-navy` y `--button-medium-height` son tokens
declarados y nunca consumidos (código muerto); `.btn{min-height:var(--touch-target-min)}` se declara fuera
de cualquier `@media`, así que un botón "normal" mide en realidad **48px**, no los 44px que sugiere su
propio token — si se define un sistema de alturas de botón, hay que decidir el valor efectivo (48px) y
declararlo así desde el principio, no dejar que una regla tardía lo cambie por accidente. `.container`
(`max-width:1280px`) queda anulado más tarde por una regla `.section,.container{max-width:100%}`: si se
quiere un contenedor con tope real, hay que asegurarse de que ninguna regla posterior lo pise.

### 2.2 Tokens de Pavivasa (nombres fijos del brief — valores a decidir por Claude Design)

El brief exige estos nombres exactos (`brief-claude-design.md` §7, bloque 3) y dice explícitamente
"elige tú los valores": Claude Design rellena la columna Valor; nada de esto se puede tomar de globotent
porque Pavivasa necesita una identidad **distinta** de Pavimentos Albufera (misma empresa, otra marca) y
de globotent.

| Token Pavivasa | Rol equivalente en globotent | Restricción |
|---|---|---|
| `fondo` | `--color-bg` | Base clara |
| `fondo-alt` | `--color-bg-soft` | Secciones alternas |
| `tinta` | `--color-title` | Texto principal / fondo oscuro de franjas (rol doble, como `--brand-dark` en globotent) |
| `tinta-media` | `--color-text` / `--color-sub-title` | Texto secundario |
| `pigmento` | `--brand-green` | Acento único: CTA primario + estado activo, nunca texto pequeño sobre claro |
| `pigmento-hover` | `--brand-green-dark` | Hover del acento |
| `acero` | (sin equivalente directo) | Secundario frío — Globotent no tiene un segundo acento no-verde; Pavivasa sí lo pide explícitamente |
| `sobre-tinta` | `#fff`/`#dfe7ea` sobre `--brand-dark` | Texto sobre fondo oscuro |
| `error` | (sin equivalente: globotent no tiene estado de error visible) | Validación de formulario |

Reglas de valor que **sí** son no negociables (brief §7-3), aunque los tokens estén vacíos: esquinas a 0
en todo; una sola sombra en toda la web (la de `BarraMovil`); escala tipográfica cerrada
`12/14/16/20/26/34/46/64/88px`, nada intermedio (a diferencia de globotent, que usa `clamp()` fluido en 44
sitios — ver §3 y §10); tres familias (display / texto / mono, con la mono en versalitas y suelo de 10px
para datos de obra: m², espesor, color, modelo, municipio, año); objetivo táctil 44px; contraste AA; un
CTA primario y el estado activo por pantalla, nunca acento como texto pequeño sobre fondo claro; cero
fotos de stock de personas (`BloquePosicion` con trama diagonal donde falte foto real); dato sin confirmar
= `DatoPendiente`, entre corchetes y atenuado, nunca maquillado; un solo teléfono y una sola dirección en
todo el sitio.

**Nota — ya existe una columna "Valor" en el repo, no está vacía**: `tailwind.config.ts:6-7` declara estos
nueve tokens como "Valores del sistema visual de Pavivasa (Claude Design, sept. 2026): paleta fría
gris-verde, acento 'pigmento' óxido de hierro, secundario 'acero'", con hex concretos
(`tailwind.config.ts:16-24`): `fondo #EDEFEC` · `fondo-alt #DCE0DB` · `tinta #141A18` · `tinta-media
#5A645F` · `pigmento #B2462A` · `pigmento-hover #8F3620` · `acero #45606E` · `sobre-tinta #F2F4F0` ·
`error #C4161C` — ya referenciados en los componentes (`components/layout/`, `components/ui/`, etc.).
Git confirma que un encargo a Claude Design ya se ejecutó y se fusionó: `1539f5e` "Implementa el diseño de
Claude Design: sistema visual y 9 pantallas" (2026-09-02), `4475714` (merge), con trabajo posterior encima
hasta `257ff7f` (2026-09-16, fotos reales de obra, SEO, integridad de conversión). Si este encargo nuevo a
Claude Design debe **reemplazar** esos valores o **respetarlos** es una decisión de negocio que este
documento no resuelve — se deja abierta explícitamente para que la confirme quien encargue el trabajo,
no se asume en ningún sentido.

**Nota sobre el conflicto de radios**: el precedente inmediato de Pavivasa, Pavimentos Albufera (misma
empresa, otra marca), usa exactamente "esquinas a 0" y comparte la sección 3 de reglas de construcción. Si
en algún momento se decide que Pavivasa adopte radios curvos al estilo globotent, eso sería una
**desviación explícita** de una regla que el propio brief marca como "no negociable" — no una opción libre
de diseño — y debería confirmarse con el negocio antes de construirse (ver README, "Cómo usar con Claude
Code", para cómo documentar ese tipo de cambio si llegara a decidirse).

→ Detalle en: `01-fundamentos.md` §1 (los dos bloques `:root`, con línea exacta de cada token);
`brief-claude-design.md` §7 bloque 3.

---

## 3. Tipografía (escala completa)

### 3.1 Carga de fuentes en globotent (mecanismo, no a copiar tal cual)

Figtree (Google Fonts, variable, pesos 300-900, `font-display:swap`) se carga en las 78 páginas con el
patrón no-bloqueante `<link rel="preload" as="style"…><link rel="stylesheet" media="print"
onload="this.media='all'">` + `<noscript>`. Es la **única** fuente que realmente se ve: `'Clash Display'`
aparece en 7 reglas CSS (secciones "sport") pero el sitio **no tiene ningún `@font-face`** para ella; solo
existe un `<link>` a Fontshare en las 14 páginas `body.sport-world`, y ahí sirve pesos 500/600/700 (nunca
800). Consecuencia verificable: en la home, el bloque `.world-block--sport .world-block__head h3` pide
Clash Display pero su `<body>` no es `sport-world` → cae a Figtree. Una fuente declarada sin `@font-face`
ni `<link>` correspondiente no se carga, cae al fallback: esto es exactamente el error a no copiar si
Pavivasa elige una familia "display" (brief §7-3) — hay que servirla de verdad (self-host o Google
Fonts/Fontshare con el `<link>` en cada página que la usa), no solo declararla en CSS.

### 3.2 Escala real de globotent (para ver el mecanismo de jerarquía)

Base: `body{font-family:Figtree;font-weight:400;line-height:1.5;color:#535353}`.
`h1-h5{font-weight:800;line-height:1.15;color:#151719}`. Jerarquía por contexto (valor **efectivo**, con
su `clamp()` cuando lo tiene):

| Rol | Tamaño | Peso | Line-height | Tracking |
|---|---|---|---|---|
| H1 hero home (`.cine-hero__h1`) | `clamp(2.1rem,5.1vw,4rem)` → móvil `clamp(1.95rem,8.4vw,2.7rem)` | 800 | 1.03 | -.02em |
| H1 genérico (`h1`, heros interiores) | `clamp(2rem,4.2vw,3.6rem)` | 800 | 1.15 | -.01em |
| H2 de sección | `clamp(1.6rem,2.8vw,2.4rem)` | 800 | 1.15 | -.01em |
| H3 base | `1.25rem` fijo | 800 | 1.15 | — |
| Título de tarjeta grande (case/blog) | `1.15rem` | 800 | — | — |
| Título de tarjeta producto | `1.05rem` | 700 | — | — |
| Precio / cifra grande | `1.15-3.8rem` según contexto | 800 | 1 | — |
| Párrafo base | `1rem` | 400 | 1.5 | — |
| Párrafo de tarjeta | `.88-.95rem` | 400 | 1.5 | — |
| Meta / caption | `.72-.85rem` | 600-700 | — | .02-.05em |
| Eyebrow (kicker) | `.7-.85rem` | 800 | — | .1-.14em, uppercase |
| Small legal | `12px` | 400 | 1.4 | — |
| CTA de texto en mayúsculas | `.72-.82rem` | 800 | — | .04-.05em |

Estadística: los cinco tamaños más usados son todos sub-1rem (`.85rem`, `.78rem`, `.95rem`, `.82rem`,
`.9rem`) — el sitio vive en texto de apoyo denso, 12.5-15px. Pesos: 800 domina (títulos, eyebrows,
botones, precios), 700 en nav/labels, 600 en metadatos con énfasis, 400 en cuerpo. Line-height: títulos
hero entre 0.98-1.08, cuerpo 1.5-1.55, prosa larga 1.6-1.7. `text-transform:uppercase` en 65+ apariciones;
nunca `capitalize` ni `lowercase`.

### 3.3 Escala cerrada de Pavivasa (obligatoria, `brief-claude-design.md` §7 bloque 3)

`12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88 px`. Nada intermedio: **sin `clamp()` fluido** como en
globotent (44 usos allí). Mapeo del rol de globotent al escalón cerrado más próximo, a decidir por
contexto de breakpoint (móvil 390 / escritorio 1440), no por interpolación continua:

| Rol (mecanismo de globotent) | Escalón Pavivasa sugerido (móvil → escritorio) |
|---|---|
| H1 hero | 46 → 64 u 88 (el propio brief permite hasta 88 si el hero lo pide) |
| H1 genérico interior | 34 → 46 |
| H2 de sección | 26 → 34 |
| H3 / título de tarjeta | 20 → 20-26 |
| Cuerpo | 16 |
| Meta / caption / dato de obra (mono) | 12-14, mono en versalitas, suelo 10px |
| Eyebrow | 12-14, uppercase, tracking abierto (heredar el mecanismo, no el tamaño) |

El patrón de jerarquía por **peso y tracking** (800 en titulares/eyebrows/botones, 400 en cuerpo, tracking
positivo en mayúsculas pequeñas, tracking negativo en títulos grandes) es el mecanismo que sí conviene
conservar de globotent; lo que cambia es la escala numérica, que pasa de continua (`clamp`) a discreta (9
pasos). El patrón "eyebrow" en sí — kicker en mayúsculas, color de acento, sobre cada cabecera de sección —
se traduce directamente a `AntetituloSeccion` (componente ya nombrado en el brief, §7 bloque 2).

→ Detalle en: `01-fundamentos.md` §3 completo (carga de fuentes, jerarquía por contexto, inventario de
`font-size`, todos los `clamp()`, `font-weight`/tracking/line-height, patrón eyebrow con tabla de 14
variantes); `brief-claude-design.md` §7 bloque 3.

---

## 4. Layout, container, ritmo, rejillas

### 4.1 Container y ritmo vertical

```css
.container{max-width:1280px;margin:0 auto;padding:0 24px}
.section{padding:72px 0}              /* ≤560px: 48px 0 */
.section--tight{padding:48px 0}       /* ≤560px: 32px 0 */
.section--soft{background:#f6f8f7}
.section--brand{background:linear-gradient(135deg,#1aa585 0%,#138d70 100%);color:#fff}
```

Ritmo: casi toda sección lleva 72px de padding vertical (48px en móvil ≤560px); las cuatro secciones sin
`.section` (hero, `home-montage`, `trust-bar`, `press-strip`) definen su propio padding porque son
"especiales" (fondo a sangre, franja de datos, marquesina). Fondos alternan sin repetir dos oscuros
seguidos (ver la tabla de §6); el verde de marca (`.section--brand`) aparece una sola vez en toda la home.

**Cabecera de sección** (patrón repetido 18 veces en el sitio completo):
```html
<div class="section__head"><div class="section__eyebrow">…</div><h2>…</h2><p>…</p></div>
```
`.section__head{text-align:center;max-width:720px;margin:0 auto 48px}`. Variante alineada a la izquierda
con contenedor a 920px (usada en bloques de credenciales/técnica). Medidas de copy observadas: eyebrow
10-26 caracteres, h2 21-44, párrafo 54-242 (mediana ≈115).

### 4.2 Rejillas de tarjetas — tabla de columnas por breakpoint

Todas usan `display:grid;grid-template-columns:repeat(n,1fr)`. Notación: escritorio → colapsos (breakpoint
`max-width` real, no aproximado):

| Rejilla | Escritorio | 1100px | 900px | 560px | gap |
|---|---|---|---|---|---|
| `.product-grid` | 4 | 3 | 2 | 1 | 24px |
| `.features` | 4 | 2 | — | 1 | 24px |
| `.case-grid` | 3 | 2 | — | 1 | 24px |
| `.calc-grid` | 3 | 2 | — | 1 | 24px |
| `.reviews-grid` | 3 | 2 | — | 1 | 20px |
| `.trust-bar__grid` | 4 | — | 2 (gap 20) | 1 | 24→20px |
| `.kategorien` (2 col base) | 2 | — | — | 1 (en ≤720px) | 24px |
| `.team-wall` (CSS columns) | 3 | — | 2 | 2 (gap 10, en ≤480px) | 14px |
| `.jobs-grid`/`.jobs-values` | 3 | — | 1 | — | 22-24px |
| `.job-others` | 2 | — | 1 | — | 16px |

Container efectivo para contenido de texto (about-us, empresa, FAQ, legales): `max-width:820px`. Para
bloques de "credenciales" (Experience & trust, Technical knowledge en la home): `max-width:920px` con
cabecera a la izquierda, no centrada — cambio de ritmo deliberado frente al resto de la home.

### 4.3 Traducción a Next/Tailwind

`<Section tone="default|soft|brand|dark" padding="normal|tight">` → `py-[72px] max-[560px]:py-12` (usar
variante arbitraria `max-[560px]:`, no `sm:`, porque el corte real es 560px y Tailwind `sm` por defecto es
640px — ver §10). `<Container className="mx-auto max-w-[1280px] px-6">`. `<SectionHead eyebrow h2 p
align="center|left">` → `mx-auto mb-12 max-w-[720px] text-center`. Rejillas: `grid-cols-4
max-[1100px]:grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1` para `.product-grid`, y análogo
por fila de la tabla de arriba — **no** unificar todas las rejillas en el mismo breakpoint: cada una
colapsa donde el original la colapsa, y agruparlas bajo un solo corte pierde decisiones de diseño reales
del original (p. ej. `.case-grid` pasa a 2 columnas en 1100px, no en 1024px como haría el `lg:` de
Tailwind).

→ Detalle en: `05-secciones-home.md` §0.1-§0.2 (container y ritmo); `08-responsive.md` §3.8 (tabla
completa de rejillas, con todas las que no se usan en el espejo marcadas "(0)"); `06-plantillas-interiores.md`
§3.4 (contenedores de prosa).

---

## 5. Componentes

Cada componente: estructura → valores → estados → traducción. Las tarjetas llevan detalle especial porque
son el elemento que más se repite y el que más "vende" el sistema visual.

### 5.1 Botones (`.btn`)

```css
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;
  height:44px /* declarado; min-height:48px tardío gana siempre → 48px EFECTIVO */;
  padding:0 28px;border-radius:50px;font-weight:800;text-transform:uppercase;
  font-size:.85rem;letter-spacing:.04em;border:2px solid transparent;
  transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease}
.btn--lg{height:56px;padding:0 36px;font-size:.95rem}
```

| Variante | Fondo | Texto | Borde | Hover |
|---|---|---|---|---|
| `--primary` | `#1aa585` | `#fff` | — | fondo `#12755e` + `translateY(-1px)` |
| `--secondary` | transparente | `#151719` | `#151719` | fondo `#1aa585`, texto `#fff` |
| `--lime` | `#7ec700` | `#061827` | — | fondo `#84d814` |
| `--ghost-light` | transparente | `#fff` | `#fff` | fondo `#fff`, texto `#007a4a` |

`--primary` es el único CTA que aparece más de una vez por pantalla en globotent (dentro de cada
`product-card`) — **no replicar eso en Pavivasa**: el brief exige un solo CTA primario por pantalla. Altura
efectiva siempre 48px (objetivo táctil), independientemente del alto "normal" declarado — decisión a
tomar desde el principio en Pavivasa, no dejar que una regla táctil tardía la fije por accidente.
`--lime` en globotent es exclusivamente el botón de cierre final (máximo contraste para el último clic) —
mecanismo a conservar: reservar el tono más saturado del acento para un único CTA de cierre por página.

**Traducción**: extender `buttonVariants` de shadcn con `rounded-none` (brief), `h-12` (48px), `uppercase
font-extrabold tracking-[.04em] text-[.85rem]`, `transition-[background-color,color,border-color,transform]
duration-[180ms] hover:-translate-y-px`.

### 5.2 Eyebrows / kickers

Patrón canónico: `.8rem`, 800, uppercase, `letter-spacing:.12em`, color de acento, `margin-bottom:8px`,
siempre precediendo un H2. Variantes con fondo-píldora (`padding:6px 14px;border-radius:999px`) cuando van
sobre imagen o dentro de una tarjeta compacta. Labels-caps emparentados con el mismo ADN pero sin ser
eyebrow (metadatos de tabla, encabezados de columna de nav): mismo tracking positivo, tamaño algo menor
(`.68-.78rem`).

**Traducción**: `<AntetituloSeccion>` (nombre ya fijado por el brief) — `text-[14px] font-extrabold
uppercase tracking-[.12em] text-pigmento mb-2`; variante píldora con `bg-pigmento/10 px-3.5 py-1.5`
(esquina 0 en vez de 999px).

### 5.3 Badges / pills

`.product-card__badge`: `padding:4px 10px;background:rgba(26,165,133,.10);color:#12755e;font-weight:800;
font-size:.78rem;border-radius:999px`. Variante `--alt` (gris, para el dato secundario): fondo
`--color-bg-soft`. Dos badges por tarjeta de producto, siempre en el mismo orden: dato principal (verde) +
dato secundario (gris). El "año" de `.case-card` usa el mismo peso visual pero como texto suelto, no
píldora (`color:#1aa585;font-weight:800`, sin fondo).

**Traducción**: shadcn `Badge variant="secondary"` con `rounded-none` (brief), tipografía mono-versalitas
para datos de obra (m², espesor, color, modelo — regla del brief §7-3), no la Figtree de globotent.

### 5.4 Tarjetas — anatomía común

Mecanismo transversal (`04-tarjetas.md` §0, §3): fondo blanco, borde `1px solid #e2e2e2`, radio 12px, sin
sombra en reposo. Hover: `translateY(-4px)` + `--shadow-card` + borde verde, con `transition:transform
.25s ease,box-shadow .25s ease,border-color .2s ease` — esta regla específica (línea 3399 del CSS) gana
sobre las declaraciones individuales de cada tarjeta y unifica el timing. Imagen interior con
`overflow:hidden` en el contenedor y `scale(1.04-1.06)` en la propia `<img>`, con transición más lenta que
el bloque (`.4-.6s` vs `.2-.25s` del bloque) — el patrón "lift + zoom, el zoom más lento que el lift" es la
firma de movimiento más repetida del sitio.

**Tilt 3D** (`.product-card, .case-card, .calc-card, .blog-card`): en cada `mousemove` (guarda
`pointer:coarse` evaluada por evento, no al iniciar), `transform:translateY(-4px)
perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg)` con `x,y ∈ [-0.5,0.5]` → rotación máxima ±1.5°
por eje; `mouseleave` limpia el estilo inline. El estilo inline gana siempre a la clase `:hover`.
**Recomendación para Pavivasa: no implementarlo** — coste bajo pero valor estético marginal, es un
`mousemove` por tarjeta, y colisiona con el reveal (ver punto siguiente); el lift+zoom por CSS ya aporta el
"wow" necesario. Ver §9 y §11.

**Reveal al hacer scroll**: `IntersectionObserver` (`threshold:0.12`, `rootMargin:'0px 0px -60px 0px'`),
dispara una vez, añade `.is-visible` a `opacity:0;transform:translateY(18px)` → `opacity:1;transform:none`
en `.6s ease`. Regla dura para la implementación: **nunca** renderizar el contenido oculto en el HTML/SSR
inicial (globotent mismo lo rompe en 3 `.jobcard` con `class='jobcard reveal'` en el propio markup: sin
JS, esas tarjetas quedan invisibles). Renderizar siempre visible en servidor y aplicar el estado oculto
solo tras montar en cliente.

#### 5.4.1 `.product-card` — la tarjeta más repetida (50 instancias en el espejo)

```html
<a class='product-card' href='…'>
  <div class="product-card__media"><picture>…</picture></div>
  <div class="product-card__body">
    <h3 class="product-card__title">…</h3>
    <p class="product-card__meta">…</p>
    <div class="product-card__badges"><span class="product-card__badge">…</span><span class="product-card__badge product-card__badge--alt">…</span></div>
    <span class="btn btn--primary product-card__cta">View details</span>
  </div>
</a>
```
`__media{aspect-ratio:4/3;background:#f6f8f7}`; `__body{padding:20px}`; `__title{font-size:1.05rem;
font-weight:700;min-height:2.6em}` (reserva 2 líneas para igualar alturas); `__meta{font-size:.85rem;
flex:1}` (empuja badges+CTA al fondo); `__cta{margin-top:auto}`. Toda la tarjeta es un `<a>`; el CTA es un
`<span>` con clase de botón, no un enlace anidado (evita `<a>` dentro de `<a>`).

**Mapeo a Pavivasa**: rejilla de los **7 servicios** del brief. Título = nombre del servicio; meta = frase
literal de su página (el brief trae una por servicio); badges = aplicaciones reales o, si el servicio no
tiene obra documentada (autonivelantes, caucho, alicatados — brief §6), literal "sin obra documentada" en
vez de inventar un dato. Los 3 servicios fuertes (impreso, pulido, microcemento) destacados visualmente
(p. ej. ocupando más ancho o yendo primero).

#### 5.4.2 `.case-card` — tarjeta de proyecto/obra

```html
<a class='case-card' href='…'>
  <div class="case-card__media">…</div>
  <div class="case-card__body">
    <div class="case-card__meta"><span class="case-card__loc">📍 …</span><span class="case-card__year">…</span></div>
    <h3 class="case-card__title">…</h3>
    <p class="case-card__teaser">…</p>
    <div class="case-card__footer"><span class="case-card__hall">…</span><span class="case-card__cta">Read →</span></div>
  </div>
</a>
```
Anatomía: **meta (lugar · año) → título → teaser → pie (modelo · CTA)**, teaser en `flex:1` para alinear
pies entre tarjetas de distinta longitud de texto. `__year` en verde 800 hace de etiqueta (no hay píldora
de badge aquí). Hover idéntico al de `.product-card`.

**Aviso importante para no copiar un defecto**: en globotent, 2 de las 3 `.case-card` de la home reutilizan
el mismo archivo de imagen que tarjetas `.product-card` (mismo nombre de fichero, mismo `srcset`) en vez de
fotografía real de la obra — presentan un render de producto como si fuera una foto de caso. **Para
Pavivasa esto es exactamente lo que no se puede hacer**: el brief exige `BloquePosicion` (trama diagonal,
etiqueta "PENDIENTE · ORIGINAL A 2400 PX") mientras no haya foto real de esa obra concreta, nunca una foto
de otro contexto reetiquetada.

**Mapeo a Pavivasa**: `TarjetaProyecto` con esta misma anatomía — meta en mono/versalitas (`municipio ·
año`, año como `DatoPendiente` porque el brief solo tiene la fecha de la foto, no el año de obra
confirmado), título = técnica + municipio, teaser = frase real de la obra (el brief trae 15, usar mínimo
las 6 con ficha técnica: Dénia, Moraira, Calpe 2021, Benissa pulido, Riba-roja, Godella), pie =
`EtiquetaTecnica` (modelo · color) + "Ver obra →".

#### 5.4.3 `.collection-card` — imagen a sangre con label superpuesta

```css
.collection-card{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:16/10;color:#fff}
.collection-card img{position:absolute;inset:0;object-fit:cover;transition:transform .4s ease}
.collection-card::after{background:linear-gradient(180deg,rgba(6,24,39,0) 40%,rgba(6,24,39,.85) 100%)}
.collection-card:hover img{transform:scale(1.05)}
.collection-card__label{position:absolute;left:24px;right:24px;bottom:20px}   /* span eyebrow + h3 */
```
Sin borde, sin sombra, sin elevación: el único hover es el zoom de la foto. El `span` (eyebrow "Category")
va **antes** del `h3` dentro de la label. Es el patrón para tarjetas grandes de navegación por categoría.

**Mapeo a Pavivasa**: exactamente el patrón para **"¿Qué quieres pavimentar?"**, la sección de 6 espacios
del brief (entrada de garaje · porche/terraza · contorno de piscina · interior de vivienda · patio/jardín ·
nave/parking/local), con `BloquePosicion` en vez de foto hasta que existan.

#### 5.4.4 `.calc-card` — tarjeta "de vidrio" sobre fondo de marca

```css
.calc-card{display:flex;flex-direction:column;gap:12px;border-radius:12px;padding:28px}
.section--brand .calc-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18)}
.calc-card__icon{width:72px;height:72px;border-radius:16px;background:rgba(26,165,133,.12)}
```
Icono SVG inline 48×36 dentro de una caja de 72×72 con fondo tintado. En `.section--brand` el patrón es
"vidrio": fondo blanco al 8%, borde blanco al 18%, y el hover CSS puro sube a 14% + `translateY(-3px)` —
pero como esta tarjeta también tiene tilt JS, con ratón normal lo que se ve siempre es `-4px` + rotación
3D (el estilo inline gana); el `-3px` de CSS solo se ve con puntero táctil.

**Mapeo a Pavivasa**: no hay calculadoras (brief: "sin FAQ, sin proceso de trabajo explicado" en la web
actual, y el brief nuevo no pide herramientas interactivas), pero el patrón de "3 tarjetas de vidrio sobre
fondo de acento" sirve para el bloque de **garantía 10 años** (icono + "10 años de garantía" + "mantenimiento
y reparación en caso de que lo necesite" + CTA a presupuesto) o para el **muestrario de modelos y colores**
(`MuestraAcabado`, con los modelos y colores reales del brief: piedra inglesa, sillería, adoquín belga,
manteado; gris medio/oscuro/mate, crema, arena, 107, 117).

#### 5.4.5 `.feature` — ventaja con icono y desplegable nativo

```html
<div class="feature">
  <div class="feature__icon"><img alt="" role="presentation" aria-hidden="true"></div>
  <h3>…</h3><p>…</p>
  <details class="feature__more"><summary>More info</summary><p>…</p></details>
</div>
```
`__icon{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#1aa585,#007a4a)}`,
icono PNG pasado a blanco con `filter:brightness(0) invert(1)`. El desplegable es `<details>` nativo
(`::-webkit-details-marker{display:none}` + icono custom "i"/"−" en `::before`) — sin JS propio.

**Mapeo a Pavivasa**: el bloque "Why Globotent?" (4 razones) se adapta a los 4 claims verificables del
brief (15+ años, garantía 10 años con mantenimiento, 30% clientes repiten, empresas/particulares/profesionales),
con el "more info" conteniendo la frase literal de garantía. Si se usa `<details>` nativo en vez de un
`Accordion` de Radix, recordar `[&::-webkit-details-marker]:hidden` para no duplicar el marcador del
navegador con el icono custom.

#### 5.4.6 `.review` / `.rating-badge` — **documentado por mecanismo, no usar en Pavivasa**

Estructura y valores están en `04-tarjetas.md` §4.6 y `05-secciones-home.md` §2.12 para quien necesite el
mecanismo exacto de una futura sección de reseñas reales. **Hoy no aplica**: el brief es explícito
("Reseñas / testimonios: ninguno"; "Sin `AggregateRating`; sin testimonios inventados"; "cero valoraciones
con estrellas" en la lista de prohibiciones). Ver §11.

#### 5.4.7 `.jobcard` / `.job-meta` — reutilizable para ficha de obra y ficha de servicio

Aunque el bloque de empleo no está en la arquitectura fija de Pavivasa, dos de sus piezas son directamente
reutilizables:

- **Barra superior que "se dibuja" en hover**: `::before{position:absolute;inset-x:0;top:0;height:4px;
  background:linear-gradient(90deg,verde,lima);transform:scaleX(0);transform-origin:left;transition:.25s}`
  → `scaleX(1)` en hover. Mecanismo de acento superior reutilizable en `TarjetaProyecto` o en la ficha de
  servicio.
- **`.job-meta` — grid de datos clave con separador de color**: `grid-template-columns:repeat(4,1fr);
  gap:1px;background:var(--color-border);border:1px solid border;border-radius:14px` (las celdas
  individuales llevan `background:#fff`, así el `gap:1px` sobre fondo de borde dibuja líneas finas entre
  celdas sin usar `border` en cada una) — colapsa a 2 columnas en ≤900px, 1 en ≤680px. Es exactamente el
  mecanismo para `FichaObra` (barra lateral etiqueta/valor: técnica, modelo, color, espesor, hormigón,
  árido, mallazo, fibra, dosificación, municipio, m², año) y para `TablaFichaTecnica`.

**Traducción**: `before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left
before:scale-x-0 before:bg-gradient-to-r before:from-pigmento before:to-acero
group-hover:before:scale-x-100 before:transition-transform` para la barra; `grid grid-cols-4 gap-px
bg-border max-[900px]:grid-cols-2 max-[680px]:grid-cols-1` para la grid de datos, con esquina 0.

### 5.5 Cabecera y navegación

Estructura: `header.site-header > .container.site-header__bar > logo + nav.site-nav + .site-header__cta`.

| Propiedad | Valor |
|---|---|
| Posición | `position:sticky;top:0;z-index:50` — no se compacta nunca. **Gotcha de `overflow-x`**: si se usa `overflow-x:hidden` para evitar scroll horizontal en móvil, aplicarlo en `body`, no en `html` (o usar `overflow-x:clip` en `html`) — en `html` desactivaría este `sticky` al convertir `html` en contenedor de scroll. Globotent lo resuelve así: `html,body{overflow-x:hidden}` + `html{overflow-x:clip}` tardío que gana sobre `hidden` en `html`, dejando `body` en `hidden` (`01-fundamentos.md` §7.4). |
| Alto | `80px` fijo en todos los anchos |
| Fondo | `#fff` siempre, sin variante transparente sobre el hero |
| Sombra | Solo con `.is-scrolled` (`scrollY > 8px`, listener `passive`) — `--shadow-header` |
| Nav escritorio | `gap:24px`, enlaces 700/`.95rem`, subrayado `::after` 2px que crece `scaleX(0→1)` en `.2s ease` desde la izquierda |
| Desplegables escritorio | Solo `:hover` CSS (sin JS); mega menú "Products" en grid `1fr 1fr .8fr`, 720px, miniaturas 58×44px |
| Menú móvil (≤900px) | El propio `.site-nav` se convierte en panel `position:fixed;top:80px` que baja con `translateY(-200%)→none` en `.25s ease`; sin overlay oscuro, sin bloqueo de scroll del body; se cierra con scroll >12px, clic fuera, Escape o clic en enlace |
| Burger | 48×48px, 3 barras de 3px → X (`translateY(±8px) rotate(±45deg)`, `.2s ease`) |
| CTA de cabecera | Oculto en ≤900px |
| Teléfono | Píldora con número (>900px) → círculo solo-icono 48px (481-900px) → oculto (≤480px, coexiste con la barra fija) |

**Mapeo a Pavivasa** (brief §7 bloque 2, componente `Cabecera`, ya nombrado): logo + 4-5 enlaces (los
servicios, con dropdown si se agrupan los 7) + teléfono + botón "Pedir presupuesto"; "se compacta al hacer
scroll" — nota: esto **difiere** de globotent, que no se compacta, solo gana sombra; si el brief pide
compactación real (cambio de alto), es una decisión propia de Pavivasa, no una copia de globotent. Burger →
`MenuMovil` (panel a pantalla completa, según el brief, no el panel superior parcial de globotent).

**Logo**: sin vectorial original todavía (`brief-claude-design.md` §6: "PNG-07/PNG-06/PNG-16 — pedir
original vectorial"). Hasta que llegue, el logo de `Cabecera` y `Pie` es un wordmark de texto "PAVIVASA" en
la familia display elegida, sin isotipo — no se marca como `DatoPendiente` (es para datos, no para una
pieza de marca a dibujar) ni como `BloquePosicion` (es solo para fotos).

**Accesibilidad — foco y skip link, ya resuelto en el repo**: el repo de Pavivasa ya tiene skip link
(`app/layout.tsx:57-58`, `href="#contenido"` → `<main id="contenido">`) y una regla global
`:focus-visible` (`app/globals.css:73-75`: `outline:2px solid var(--acero); outline-offset:3px` sobre
`:where(a, button, input, select, textarea, summary, [tabindex])`) — **más completa que la de globotent**,
que no tiene ninguna regla global de foco, solo 4 excepciones puntuales por componente (`09-pie-y-globales.md`
§15). No requiere cambios; solo falta añadir `tabIndex={-1}` a `<main>` para que el salto de foco funcione
de verdad (`09-pie-y-globales.md` §22.7).

### 5.6 Formularios

Patrón común a los 4 formularios de globotent (contacto, presupuesto, 3D, descargas):

```css
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:720px}   /* ≤900: 1fr */
.field label{font-weight:700;font-size:.9rem;margin-bottom:6px}
.field input,select,textarea{padding:12px 14px;border:1px solid #e2e2e2;border-radius:10px;font-size:16px}
.field input:focus{outline:none;border-color:#1aa585;box-shadow:0 0 0 3px rgba(26,165,133,.15)}
.consent-row{display:flex;gap:10px;align-items:flex-start;font-size:.9rem}
.form-trust{grid-column:1/-1;text-align:center;font-size:.82rem;color:sub-title}
```
`font-size:16px` en inputs es obligatorio para evitar el zoom automático de iOS — conservar en Pavivasa. El
foco visible es `:focus`, no `:focus-visible` (se activa también con clic de ratón) — **mejora
recomendada para Pavivasa**: usar `:focus-visible` para que el anillo solo aparezca por teclado.
Honeypot: `<p class="hp-field" hidden><input name="bot-field"></p>` (oculto por el atributo `hidden`, sin
CSS propio) — patrón antispam simple, conservable.

**Mapeo a Pavivasa** (`FormularioPresupuesto`, brief §7 bloque 2 y 4): corto (nombre, teléfono, qué quieres
pavimentar) en la home; completo (+ email, superficie m², municipio, mensaje, foto, casilla de privacidad)
en `/presupuesto/`. Casilla de privacidad **obligatoria y visible** (globotent la tiene; la web actual de
Pavivasa no — el brief lo marca como algo a corregir). Sin promesa de plazo de respuesta (globotent dice
"Response within 24h"; el brief prohíbe explícitamente prometer plazos: pintar como `DatoPendiente`).

### 5.7 Pie de página

```css
.site-footer{background:#061827;color:#9eb3bd;padding:64px 80px 96px 0;margin-top:80px}
.site-footer__grid{grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px}   /* ≤900: 1fr 1fr · ≤560: 1fr */
.site-footer h4{color:#fff;font-size:.95rem;uppercase;letter-spacing:.08em}
.site-footer a{color:#9eb3bd}  a:hover{color:#7ec700}
```
Estructura: logo+párrafo | columna de categorías | columna de herramientas | columna corporativa+legales,
más una barra inferior de copyright+NAP y una franja de disclaimer. Contraste verificado (WCAG 2.1, gamma
sRGB): `#9eb3bd` sobre `#061827` ≈ 8.25:1 (AA/AAA). **Defecto de código a no copiar**: el NAP de la barra inferior es texto plano,
sin `<a href="tel:">`/`mailto:"` (el CSS los prevé pero el HTML no los usa) — en Pavivasa, enlazar de
verdad. El `padding-right:80px`/`padding-bottom:96px` reserva espacio para un WhatsApp FAB y una barra
sticky que en la práctica ya se ocultan/no existen en esas zonas — no replicar un hueco sin propósito.

**Mapeo a Pavivasa**: `Pie` (brief §7 bloque 2 y §5 PIE) — logo · dirección · teléfono (`tel:` real) ·
email (`mailto:` real) · lista de 7 servicios · Aviso legal / Política de privacidad / Política de
cookies / **"Configurar cookies"** (enlace que globotent no tiene — ver §5.12 Consentimiento y analítica) ·
"PROYECTO WEB FINANCIADO POR LA UNIÓN EUROPEA – NEXTGENERATIONEU" con logos · © 2026 Pavivasa.
Un único NAP, no dos direcciones/teléfonos como en el footer de globotent frente a su cabecera (que sí
coinciden, pero el principio "un solo dato de contacto en todo el sitio" es regla del brief §7-3).

### 5.8 FAQ (acordeón)

`<details class="faq-item">` nativo, sin JS: `border:1px solid #e2e2e2;border-radius:10px;padding:16px
20px`, `[open]{border-color:#1aa585}`, `summary::after{content:"+"}` → `"–"` cuando abierto. Sin animación
de apertura, solo transición del borde. Sin JSON-LD `FAQPage` (mejora recomendable).

**Mapeo a Pavivasa**: acordeón de FAQ en home (4-5 preguntas) y submenú de servicio; **respuestas como
`DatoPendiente`** allí donde el brief no trae contenido real (el brief es explícito: "SIN respuesta
inventada: deja la respuesta como DatoPendiente"). Añadir JSON-LD `FAQPage` cuando las respuestas sean
reales.

### 5.9 Comparador antes/después (condicional)

Mecanismo: dos imágenes superpuestas, la de "después" recortada con `clip-path:inset(0 0 0 X%)`; el asa se
mueve con `left:X%`; arrastre vía `mousedown`/`touchstart` + `mousemove`/`touchmove` en `document` (sigue
el puntero fuera de la caja); clic directo en la caja también salta a esa posición. Sin teclado, sin
`role="slider"` en el original — mejora recomendada: superponer un `Slider` de Radix transparente para dar
teclado y ARIA gratis.

**Mapeo a Pavivasa**: solo aplicable si el cliente entrega pares de fotos antes/después de una obra
concreta; hoy no existen (brief §4: 77 fotos sin catalogar, ≤1024px). Reservar el componente con dos
`BloquePosicion` o no incluirlo en el primer lanzamiento.

### 5.10 Botón flotante de contacto móvil

Globotent usa `.wa-fab` (WhatsApp, `#25D366`, `bottom:24px;right:24px`, oculto cuando el pie entra en
pantalla vía `IntersectionObserver threshold:0.05`). **Para Pavivasa**, el componente equivalente ya está
nombrado en el brief: `BarraMovil`, una barra fija inferior en móvil con **dos** botones (Llamar /
WhatsApp), no un único FAB — WhatsApp va como `DatoPendiente` porque no existe en la web actual del
cliente (brief §1: "WhatsApp: no existe enlace ni mención").

### 5.11 Pila de `z-index`

`Cabecera`, `MenuMovil`, `BarraMovil` y `Consentimiento` son todos elementos fijos/sticky que aparecen a
la vez (§12.1) y necesitan apilarse sin conflicto.

**Referencia de mecanismo — pila completa de globotent** (`09-pie-y-globales.md` §20):

| `z-index` | Selector | Existe en HTML |
|---|---|---|
| 2000 | `.splash` | No |
| 1000 | `.lightbox` | Sí (78) |
| 100 | `.exit-popup` | Sí (78) |
| 100 | `.lang-switch__menu` | Sí (78) |
| 80 | `.site-nav__dropdown` | Sí |
| 50 | `.site-header` (sticky) | Sí |
| 45 | `.wa-fab` | Sí (78; oculto en 36) |
| 40 | `.mobile-sticky-cta` / `.maint-banner` | No |

**Conflicto real en globotent, a no repetir**: `.lang-switch__menu` (`z-index:100`) vive dentro del
contexto de apilamiento de `.site-header` (`z-index:50`, creado por `position:sticky`+`z-index`), así que
en la práctica **nunca** supera al `.exit-popup` (100, en la raíz del documento) pese a compartir el mismo
número — un `z-index` idéntico no garantiza el mismo nivel real si vive dentro de un contexto de
apilamiento distinto.

**Valores ya existentes en el repo de Pavivasa** (verificado por grep, `09-pie-y-globales.md` §22.5b):
`BarraMovil.tsx:7` → `z-20`; `Consentimiento.tsx:75` → `z-[25]`; skip link de `app/layout.tsx:58` →
`focus:z-50`. **Regla para cualquier overlay nuevo** (exit-popup opcional, modal de calculadora, etc.):
situarse conscientemente respecto a estos tres — p. ej. un overlay de página por encima de `z-[25]`
(Consentimiento) y por encima de `focus:z-50` (para no quedar bajo el skip link enfocado), y un FAB de
escritorio por debajo de ambos — nunca reutilizar un número sin comprobar en qué contexto de apilamiento
vive, para no reproducir el conflicto `lang-switch`/`exit-popup` de arriba.

### 5.12 Consentimiento y analítica

**Lo que hace mal globotent** (`09-pie-y-globales.md` §13): no hay banner de cookies, CMP ni Consent Mode
en ninguna de las 78 páginas. El GTM `GTM-MR5F4PQR` se carga inline en el `<head>` de las 78 páginas,
diferido hasta el primero de `['scroll','mousemove','touchstart','keydown','pointerdown']` o
`setTimeout(…, 4000)` — es decir, **analítica sin consentimiento previo**, solo retrasada unos segundos.
Existe además una capa `dataLayer`/Meta Conversions API (email, teléfono, nombre — `js:597-651`) que en
producción no hace nada porque ningún formulario servido lleva `data-netlify` (0/78). Sí hay un checkbox
`.consent-row` obligatorio ("He leído la Política de Privacidad y la acepto") en los 3 formularios
(contacto, presupuesto, 3D) — eso es consentimiento de tratamiento de datos del formulario, no de
analítica/publicidad.

**Lo que `Consentimiento.tsx` de Pavivasa debe garantizar** (ya nombrado en el brief, `CLAUDE.md:31`
"Analítica y publicidad solo tras consentimiento"): bloquear GTM/GA/Meta hasta que el usuario acepte (no
solo retrasarlos); guardar la decisión de forma persistente (cookie de 1.ª parte o `localStorage`, no
volver a preguntar en cada visita); y exponer un enlace **"Configurar cookies"** en el pie — que globotent
no tiene (su pie solo enlaza a la política de privacidad, sin control de preferencias ni enlace a política
de cookies). Pavivasa ya tiene la ruta `/politica-de-cookies/` lista para enlazar (ver §5.7).

→ Detalle en: `04-tarjetas.md` (tarjetas, completo); `02-cabecera-y-navegacion.md` (cabecera, completo);
`06-plantillas-interiores.md` §8 (formularios), §9 (FAQ); `05-secciones-home.md` §2.9 (before/after), §2.16
(pie); `09-pie-y-globales.md` §7-§10 (pie y WhatsApp con CSS completo), §13 (cookies/consentimiento/analítica),
§20 y §22.5b (z-index), §15 y §22.7 (skip link y foco).

---

## 6. Gramática de secciones de la home

### 6.1 Orden, propósito y por qué (globotent)

| # | Sección | Función | Por qué aquí |
|---|---|---|---|
| 1 | Hero cinematográfico | Promesa + segmentación + CTA doble + prueba social compacta | Abre con foto grande, deja elegir sin scroll |
| 2 | 4 razones (Why Globotent) | Responde a la objeción principal | Justo después de la promesa |
| 3 | Vídeo de proceso | Prueba de proceso ("lo montamos nosotros") | Corte oscuro tras dos bloques claros; demuestra en vez de afirmar |
| 4 | Muro de equipo (10 fotos) | Prueba humana | Humaniza antes de vender |
| 5 | Categorías (2 mundos) | Oferta, nivel 1 | Primera bifurcación, fondo suave |
| 6 | Productos destacados | Oferta, nivel 2 | Del "qué" al "cuál" |
| 7 | Franja de cifras técnicas | Datos duros | Cierra la oferta sin pedir clic |
| 8 | Marquesina de prensa | Autoridad externa | Prueba de terceros, ligera |
| 9 | Lead magnet (3D + antes/después) | Oferta de bajo compromiso | Para quien no está listo para presupuesto |
| 10 | Calculadoras | Autoservicio | Segunda oferta de bajo compromiso |
| 11 | Proyectos de referencia | Prueba de resultado | Obra terminada, para quien ya sabe qué quiere |
| 12 | Reseñas | Prueba social extensa | Refuerza la cifra del hero |
| 13 | Credenciales (CIF, sede, fundador, garantía) | Objeción "¿quién hay detrás?" | Para el que compara proveedores |
| 14 | Conocimiento técnico | Educación + puente a FAQ | Reduce dudas antes del cierre |
| 15 | Banda de cierre | Pedir presupuesto | Único botón lima de la página |
| F | Pie | Navegación completa + NAP | — |

Patrón: **promesa → razones → prueba de proceso/personas → oferta (categorías, productos) → datos →
autoridad → lead magnets → prueba de resultado/social → credenciales → educación → cierre**. Alternancia
de fondo: nunca dos secciones oscuras seguidas; el verde de marca (fondo sólido) aparece una sola vez.

### 6.2 Mapeo completo a la home de Pavivasa

Base: brief §1 (15 años, garantía 10 años + mantenimiento, 30% repiten, 7 servicios, contacto único) y la
arquitectura fija de la pantalla 02 HOME (brief §7 bloque 4). No se inventa copy nuevo: solo se reutilizan
tipos de contenido ya existentes en el brief.

| Sección Globotent | Decisión | Sección Pavivasa | Contenido real |
|---|---|---|---|
| Hero cinematográfico (4 mundos) | Adaptar | Hero con titular + 2 CTA (Pedir presupuesto / Ver proyectos) | Tabs = 3 servicios fuertes (impreso · pulido · microcemento); imágenes `BloquePosicion`; sin rating badge; kicker "Expertos en pavimentos de hormigón" |
| 4 razones + "more info" | Adaptar | Bloque de razones / fusionable con BarraConfianza | 15 años · garantía 10 años con mantenimiento · 30% repiten · empresas/particulares/profesionales |
| Vídeo de montaje | No aplica (sin vídeo) | Opcional: banda oscura "garantía 10 años" con `BloquePosicion` | Texto literal de garantía |
| Muro de equipo (10 fotos de personas) | No aplica | Reservar como "muro de obras" pendiente de catalogar | 77 fotos de `/proyectos/`; `BloquePosicion` mientras tanto |
| Categorías 16:10 | Conservar patrón | "¿Qué quieres pavimentar?" (6 espacios) | Garaje · porche/terraza · piscina · interior · patio/jardín · nave/parking/local |
| Cabecera de bloque (h3 + "ver todo") | Conservar | Cabecera "Servicios" | Enlace a cada página de servicio |
| Productos destacados | Adaptar | Servicios (7, 3 fuertes destacados) | Título = servicio; meta = frase literal; badges = aplicaciones reales o "sin obra documentada" |
| Franja de cifras | Conservar | `BarraConfianza` (componente fijo del esqueleto) | MÁS DE 15 AÑOS · 10 AÑOS DE GARANTÍA · cobertura · MÁS DEL 30% REPITEN |
| Marquesina de prensa | No aplica | — | Sin prensa ni logos de cliente; Kit Digital va en el pie |
| 3D + antes/después | No aplica hoy | Reservar `AntesDespues` para cuando existan pares de fotos | — |
| Calculadoras (fondo de marca) | No aplica (sin herramientas) | Reutilizar el tono para "Garantía 10 años" o muestrario | `MuestraAcabado` con modelos/colores reales |
| Proyectos de referencia | Conservar | 3 `TarjetaProyecto` destacadas | Dénia (impreso), Calpe 2021 (impreso), Daimús (pulido, nave 2000m²) u otras; año `DatoPendiente` |
| Reseñas | No aplica | — | Cero reseñas; prohibido inventar; sin `AggregateRating` |
| Credenciales | Adaptar | Bloque "empresa" corto | Sede Sollana, equipo/maquinaria/moldes, 15 años, garantía; los 5 valores completos van a `/empresa/` |
| Conocimiento técnico | Adaptar | FAQ en acordeón + ficha técnica | HM20/HM25, 10-12cm, árido 12mm, mallazo 20×30, fibra, 4kg color/m², HA-25 EHE-08, clase 3 Rd>45 |
| Banda de cierre | Adaptar | Formulario corto + llamada | `FormularioPresupuesto variant="corto"`; botón "Enviar y que me llamen"; sin plazo |
| Pie | Conservar | `Pie` | NAP único, 7 servicios, legales, NEXTGENERATIONEU, © 2026 Pavivasa |
| `wa-fab` | Sustituir | `BarraMovil` (Llamar / WhatsApp `DatoPendiente`) | Teléfono 627 66 31 46 |
| Exit popup, marquesina, GTM diferido | No aplica al diseño | — | — |

Orden propuesto para Pavivasa (misma lógica promesa→razones→oferta→prueba→datos→cierre): **Hero →
BarraConfianza → ¿Qué quieres pavimentar? (6) → Servicios (7) → Obras destacadas (3) → Muestrario de
modelos y colores → Garantía 10 años → FAQ → Formulario corto → Pie.** Es la lista de la pantalla 02 del
brief; lo que aporta este documento es la **gramática** (cabecera eyebrow+h2+p, rejillas de 3/4, tarjeta
imagen-con-label, franja oscura de cifras, CTA único de cierre) y los **gestos** (zoom 1.04-1.05 en 0.4s al
hover, reveal 18px/0.6s, hero con crossfade+zoom+rotación).

Restricciones del brief que cambian la traducción literal: esquinas a 0 (nada de radio 12px/50px); una
sola sombra en toda la web; nada de estrellas, reseñas ni logos de cliente; nada de fotos de personas ni de
stock; un solo CTA primario por pantalla (globotent pone `btn--primary` en cada tarjeta de producto — no
replicar eso).

→ Detalle en: `05-secciones-home.md` §1 (inventario de las 15 secciones + footer, con línea de HTML),
§2.1-§2.16 (cada sección con markup/CSS/JS literal), §3 (tabla narrativa completa), §4 (mapeo a Pavivasa,
fuente de la tabla de arriba).

---

## 7. Plantillas interiores (con mapeo a las rutas de Pavivasa)

### 7.1 `page-hero` — cabecera universal de interiores (76/78 páginas)

```css
.page-hero{position:relative;min-height:320px;display:flex;align-items:flex-end;color:#fff;background:#061827}
.page-hero__bg{position:absolute;inset:0;background-size:cover;background-position:center}
.page-hero__bg::after{background:linear-gradient(180deg,rgba(6,24,39,.45),rgba(6,24,39,.8))}
```
Contenido: `breadcrumbs` → `h1` → `p` opcional (`max-width:680px`, color `#dfe7ea`). Sin JS, sin `<picture>`
(fondo por `background-image` inline en globotent — en Pavivasa, usar `next/image fill` con
`priority`). Variantes: estándar con imagen; sin imagen (fondo plano oscuro, para legales); centrada con
botones (thank-you); con eyebrow y CTA (jobs). **No hay JSON-LD `BreadcrumbList`** pese a que el
`breadcrumbs` visual es universal — añadirlo en Pavivasa es mejora recomendable.

**Mapeo a Pavivasa**: `PageHero` universal para todas las rutas interiores (`/hormigon-impreso/`,
`/empresa/`, `/presupuesto/`, `/proyectos/`, `/blog/`, legales), con imagen real de obra o
`BloquePosicion`, y el mismo patrón breadcrumb → h1 → lead.

### 7.2 Plantilla de SERVICIO → rutas `/hormigon-impreso/`, `/hormigon-pulido/`, `/hormigon-lavado/`, `/microcemento/`, `/autonivelantes/`, `/pavimentos-de-caucho/`, `/alicatados/`

Esqueleto de la categoría en globotent (idéntico en las 5): `page-hero` → sección de argumento con lista de
6 `<li>` → sección alterna con rejilla de tarjetas → `cta-band` de cierre. Sin tabla, sin FAQ, sin filtros
en el original (categorías de globotent no tienen ficha técnica en tabla; eso vive en la plantilla de
PRODUCTO, §7.3).

**Mapeo a Pavivasa**: la pantalla 03 SERVICIO del brief pide más que la categoría de globotent — junta el
patrón de categoría (argumento + lista de aplicaciones) con el de producto (tabla técnica) y el de
proyecto (obras de esa técnica): hero → `SubmenuServicio` con anclas (qué es, dónde se usa, modelos y
colores, ficha técnica, obras, FAQ, presupuesto) → `TablaFichaTecnica` con los datos literales del brief →
listas de aplicaciones reales → obras de esa técnica (`TarjetaProyecto` filtradas) → CTA. El
`SubmenuServicio` con anclas fijas no tiene equivalente directo en globotent (que no usa sub-navegación
dentro de página); es una pieza propia del esqueleto de Pavivasa.

### 7.3 Plantilla de PRODUCTO (globotent) → no existe como ruta propia en Pavivasa, pero aporta 2 mecanismos

Globotent tiene fichas de producto individuales (`/products/*.html`) que Pavivasa no replica como ruta
(no hay "modelos" vendibles uno a uno). Dos piezas de esa plantilla sí son reutilizables:

- **Layout de galería + info** (`grid-template-columns:1.2fr 1fr;gap:56px`, imagen a la izquierda,
  acciones a la derecha) → reutilizable en `FichaObra` (galería de obra + `FichaObra` lateral).
- **Tabla técnica con estilos consistentes** (`th` alineado a la izquierda, filas con `border-bottom`) →
  `TablaFichaTecnica`, con "Sistema / Espesor / Acabado / Uso" en vez de ancho/largo/alto.

### 7.4 Plantilla de PROYECTOS → rutas `/proyectos/` y `/proyectos/[slug]/`

Índice de globotent (`reference-projects.html`): en el espejo EN es un placeholder de texto sin rejilla
real (defecto del propio sitio, no algo a copiar: la home sí tiene la rejilla de `case-card`, la página de
listado no). **Para Pavivasa, el índice SÍ debe tener la rejilla real** (es una ruta con propósito
explícito en el brief: filtros por técnica/municipio/año).

Detalle de proyecto (`projects/[slug].html`): estructura narrativa fija **reto → solución → resultado**
(3 `h2`+`p` dentro de `.container[max-width:820px]`), cierre con CTA "A project similar to yours?" →
presupuesto, y JSON-LD `Article`. CSS latente para un detalle más rico (`.case-hero` grid 2 columnas,
`.case-stats`, `.case-gallery`) existe en el CSS pero sin markup en el espejo — se documenta como
mecanismo disponible, no como algo ya probado en producción.

**Mapeo a Pavivasa**:
- `/proyectos/` = `PageHero` + `FiltrosProyectos` (escritorio: fila de chips fija; móvil: botón "Filtrar"
  que abre hoja inferior — el filtro de globotent, `.filter-bar`/`.filter-pill`, existe en CSS con este
  mismo aspecto de píldoras pero está inerte en el sitio real; el **patrón visual** sí es válido, la
  **lógica** de filtrado hay que construirla de cero) + rejilla de `TarjetaProyecto` + `EstadoVacio`.
- `/proyectos/[slug]/` (pantalla 05, ficha de Dénia como ejemplo del brief) = galería (`BloquePosicion`
  21:9 + 4 miniaturas) + título + "El encargo" y "La ejecución" con texto real + `FichaObra` lateral fija
  (técnica, modelo, color, espesor, hormigón, árido, mallazo, fibra, dosificación de color, municipio,
  m² `[pendiente]`, año `[pendiente]`) + obras similares. La estructura narrativa reto→solución→resultado
  de globotent se adapta a "El encargo" → "La ejecución" (2 bloques, no 3, según el brief).

### 7.5 Plantilla de EMPRESA → ruta `/empresa/`

`about-us.html`: `page-hero` → 3 bloques de prosa alternando fondo (`.section`/`--soft`/`.section`) con
`container[max-width:820px]` → cita del fundador en `<blockquote>` con `border-left:4px solid verde` →
`cta-band` transparente sobre fondo de marca. `team.html`: prosa simple, sin tarjetas (el CSS de
`.team-card`/`.team-grid` existe pero sin uso).

**Mapeo a Pavivasa**: texto real del brief §5 (empresa: trayectoria, equipo/maquinaria/moldes, 5 valores
con titular en mayúsculas), zona de trabajo (lista de municipios con obra documentada), `BloquePosicion`
para foto de equipo (nunca stock, nunca foto de personas reales sin permiso). Sin cita de fundador (no hay
dato de fundador en el brief de Pavivasa — no inventar uno).

### 7.6 Plantilla de CONTACTO/PRESUPUESTO → ruta `/presupuesto/`

`contact.html`: `.contact-grid` (2 columnas) con `.contact-action` (icono + label + teléfono/email en
píldora clicable, `min-height:64px`) + formulario de 1 columna. `request-a-quote.html`: formulario de 2
columnas con selects (tipo de estructura, país) — sin visor 3D real pese a que el CSS lo prevé.

**Mapeo a Pavivasa** (pantalla 07): formulario completo a un lado, columna fija con teléfono, WhatsApp
`[pendiente]` y `EtiquetaTecnica` con los 4 claims (15 años, garantía 10 años+mantenimiento, 30% repiten,
empresas/particulares/profesionales); estados inicial / error de teléfono / enviando / enviado. Campos
del brief: nombre y apellidos, teléfono, email, qué quieres pavimentar (7 opciones), superficie m²,
municipio, mensaje, foto, casilla de privacidad.

### 7.7 Plantilla de BLOG → rutas `/blog/` y `/blog/[slug]/`

No hay plantilla de blog real en el espejo EN (los artículos viven fuera del alcance de esta dimensión,
documentados en el brief de Pavivasa directamente: 4 artículos, uno con el cuerpo en rumano por error de
la web actual — corregir, no replicar).

**Mapeo a Pavivasa** (pantalla 08): índice con `TarjetaArticulo` (mismo patrón de card con imagen+meta+título+
teaser de `.case-card`/`.blog-card`, que sí existe en CSS aunque sin uso: `.blog-card` hereda exactamente
la anatomía de `.case-card`) y artículo con `Prose` de 68 caracteres de ancho de lectura (`max-w-[68ch]`,
convención tipográfica estándar, no específica de globotent).

### 7.8 Plantillas LEGALES → `/aviso-legal/`, `/politica-de-privacidad/`, `/politica-de-cookies/`

`page-hero` sin imagen, sin breadcrumbs, solo `h1`. Cuerpo: `h2`+`p` dentro de `container[max-width:820px]`,
sin CTA final, sin fecha de última actualización (defecto a corregir: añadir fecha en Pavivasa).

### 7.9 Plantilla 404

**No está en el código**: globotent no tiene una 404 propia. `curl -I` a una ruta inexistente devuelve
`404` servido por la plantilla por defecto de Netlify (tarjeta genérica "Page not found", sin cabecera, sin
pie, sin logo, sin enlaces al sitio) — no hay nada que extraer de globotent para esta pantalla. Lo que sí
está en el código y es un patrón hermano útil es `thank-you.html` (confirmación de envío, no error, pero
misma familia de "página de una sola pantalla sin oferta"): `page-hero` sin imagen, centrado, `h1` +
`p[max-width:600px]` + fila de hasta 3 `btn--lg` (`display:flex;gap:14px;flex-wrap:wrap;justify-content:center`)
como únicas acciones. **Recomendación por analogía** (no extracción, porque no hay 404 real que citar):
para Pavivasa, `PageHero` sin imagen + mensaje + un único CTA de vuelta a home, siguiendo esa misma
estructura de una sola pantalla sin oferta secundaria.

→ Detalle en: `06-plantillas-interiores.md` completo (categoría §4, producto §5, proyectos §6, empresa §7,
formularios §8, FAQ §9, reseñas §10, empleo §11 —no aplica a Pavivasa—, legales §12, herramientas §13).

---

## 8. Hero cinematográfico (mecanismo y temporización completos)

Solo la home de globotent usa este hero (`.cine-hero`); es el único elemento del sitio donde el movimiento
es protagonista en vez de feedback (ver §1, principio 7). Aplica al hero de la home de Pavivasa.

### 8.1 Estructura

```
section.cine-hero[data-cine-hero]        position:relative; isolation:isolate; overflow:hidden;
                                           display:flex; align-items:flex-end
├── div.cine-hero__stage                  absolute inset:0; z-index:0
│   ├── picture.cine-hero__bg.is-active   capa 1 (fetchpriority="high")
│   ├── picture.cine-hero__bg × 3         resto (loading="lazy"), apiladas por orden DOM, sin z-index propio
├── div.cine-hero__scrim                  absolute inset:0; z-index:1 (degradado doble)
└── div.container.cine-hero__inner        relative; z-index:2
    ├── p.eyebrow (kicker cambia con la tab + meta fijo)
    ├── h1 (cambia con la tab)
    ├── p.sub (cambia con la tab)
    ├── div.actions → btn primario (cambia texto+href) + btn ghost-light (fijo)
    ├── rating (NO aplica a Pavivasa)
    └── div.tabs[role=tablist] → N botones role=tab
```

### 8.2 Mecanismo, paso a paso

1. Las N `<picture>` están apiladas (`position:absolute;inset:0`) con `opacity:0`; solo la `.is-active`
   está a `opacity:1`. El cambio entre capas es un **crossfade de 1.1s** (`transition:opacity 1.1s ease`),
   simultáneo en la saliente y la entrante porque ambas cambian de clase en el mismo tick de JS.
2. La `<img>` de la capa activa arranca `animation:cineZoom 8s ease-out both` →
   `scale(1.04)→scale(1.12)` (Ken Burns, solo escala, sin desplazamiento). Como el intervalo de rotación es
   de **5500ms** (menor que los 8000ms del zoom), la foto sigue haciendo zoom cuando entra el siguiente
   crossfade — el zoom nunca llega a completarse en rotación automática, solo si el usuario detiene el
   avance (hover) se congela en 1.12 (`animation-fill-mode:both`).
3. `setInterval(DELAY=5500)` avanza a la siguiente pestaña. Al cambiar, el JS reescribe `textContent` de
   eyebrow/h1/sub/CTA desde `data-*` de la pestaña, cambia el `href` del CTA, y relanza una animación de
   entrada (`cineSwap`, 0.5s, fade + `translateY(11px)→0`) sobre h1 y sub mediante un reflow forzado
   (`el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap')`, porque quitar y
   volver a poner la misma clase en el mismo tick no reinicia una animación CSS por sí solo).
4. Pausa con `mouseenter` sobre todo el hero, reanuda con `mouseleave` (intervalo nuevo completo, no
   recuerda el tiempo restante). Pausa también con la pestaña oculta (`visibilitychange`).
5. Clic en una pestaña: `show(k)` inmediato + reinicio del temporizador.
6. `prefers-reduced-motion:reduce` (evaluado una sola vez al cargar): sin auto-avance, sin zoom, sin swap;
   las pestañas siguen funcionando por clic.

### 8.3 Valores exactos

```css
.cine-hero{min-height:min(calc(100svh - 80px),780px)}      /* 80px = alto del header */
.cine-hero__scrim{background:
  linear-gradient(100deg,rgba(8,16,24,.94) 0%,rgba(8,16,24,.74) 40%,rgba(8,16,24,.34) 70%,rgba(8,16,24,.08) 100%),
  linear-gradient(0deg,rgba(8,16,24,.66) 0%,rgba(8,16,24,0) 46%)}
.cine-hero__h1{font-size:clamp(2.1rem,5.1vw,4rem);line-height:1.03;letter-spacing:-.02em;max-width:17ch;
  text-shadow:0 2px 34px rgba(0,0,0,.55)}
.cine-hero__sub{font-size:clamp(1.02rem,1.45vw,1.2rem);max-width:56ch;color:rgba(255,255,255,.92)}
@keyframes cineZoom{from{transform:scale(1.04)}to{transform:scale(1.12)}}
@keyframes cineSwap{from{opacity:0;transform:translateY(11px)}to{opacity:1;transform:none}}
.cine-hero__tabs{border-top:1px solid rgba(255,255,255,.2)}
.cine-tab{flex:1 1 0;padding:18px 6px 0;border-top:2px solid transparent;color:rgba(255,255,255,.74)}
.cine-tab.is-active{color:#fff;border-top-color:var(--acento)}
```
Móvil (`≤760px`): `min-height:min(92svh,700px)`; `h1{font-size:clamp(1.95rem,8.4vw,2.7rem);max-width:none}`;
botones `flex:1 1 100%` (apilados a ancho completo); pestañas en 2×2 (`flex:1 1 42%`).

### 8.4 Diagrama temporal (auto-avance sin interacción, ciclo de 4 pestañas = 22s)

```
t(s)  0                    5.5                  11.0                 16.5                 22.0
      │ crossfade 1.1s ├─┤                    │                    │                    │
CAPA1 ●zoom 1.04→≈1.109 │fade-out             │                    │                    │
CAPA2                    │fade-in→zoom 1.04→≈1.109│fade-out         │                    │
CAPA3                                          │fade-in→zoom…       │fade-out            │
CAPA4                                                                │fade-in→zoom…
TEXTO SSR (tab1)         │swap .5s│ tab2      │swap .5s│ tab3       │swap .5s│ tab4
```
Cada capa hace zoom durante ≈5.5s reales (se interrumpe en ≈1.109 de 1.12), no los 8s completos, salvo que
el usuario pause con hover, caso en el que sí llega a 1.12 y se congela ahí.

### 8.5 Traducción a Next/Tailwind/shadcn

`<CineHero slides={{eyebrow,h1,sub,cta:{label,href},image}[]} delayMs={5500}>` (client component). Cada
slide: `next/image fill sizes="100vw"`, `priority` solo en la primera, resto `loading="lazy"`. Contenedor
`relative isolate overflow-hidden flex items-end min-h-[min(calc(100svh-80px),780px)]
max-[760px]:min-h-[min(92svh,700px)]`. Capa: `absolute inset-0 transition-opacity duration-[1100ms]
data-[active=true]:opacity-100 opacity-0`; `<img>` interior con `data-[active=true]:animate-cine-zoom
motion-reduce:animate-none`, y para reiniciar el zoom al reactivar una capa, remontarla con
`key={`${i}-${activationCount}`}` (contador de estado propio, incrementado cada vez que esa capa se
activa). Texto con `key={idx}` para relanzar `animate-cine-swap` en vez del truco de reflow. Tabs: shadcn
`Tabs` (Radix) da `role=tablist/tab`, `aria-selected` y navegación por flechas gratis — mejora sobre el
original, que no tiene teclado en las pestañas. Temporizador: `useEffect` con `setInterval`, limpiar en
`onMouseEnter`, `visibilitychange` y `useReducedMotion`.

**Para Pavivasa**: 3-4 pestañas = los servicios fuertes (impreso · pulido · microcemento, más lavado si se
quiere), rotando hacia sus rutas de servicio; imágenes `BloquePosicion` mientras no haya fotografía de obra
a 2400px real; **sin** rating badge (brief: sin reseñas); kicker fijo "Expertos en pavimentos de hormigón".
Con esquinas a 0 (no aplica al hero en sí, que no tiene radio, pero sí a los botones dentro de él).

→ Detalle en: `03-hero-cinematografico.md` completo (markup literal, CSS línea por línea, JS línea por
línea, diagrama temporal con matices de interacción, variantes legadas sin uso — parallax, slider con
puntos — no copiar de ahí).

---

## 9. Sistema de movimiento e interacción

### 9.1 Tabla de duraciones y easings (las más repetidas)

| Duración | Easing | Dónde |
|---|---|---|
| `.15s` | `ease` (implícito) | chips, thumbs, tabs pequeños |
| `.18s` | `ease` | botones `.btn`, dropdown, pills |
| `.2s` | `ease` | **la gran mayoría**: tarjetas base, header, burger, nav underline, FAB |
| `.25s` | `ease` | tarjetas con tilt (regla unificadora L3399), nav móvil, `choose-card` |
| `.4s`-`.6s` | `ease` / `cubic-bezier(.2,.7,.2,1)` | zoom de imagen dentro de tarjeta (más lento que el lift del bloque) |
| `.6s` | `ease` | reveal al hacer scroll |
| `.9s`-`1.1s` | `ease` | crossfade de fondos (hero, sliders legados) |
| `8s` | `ease-out` | Ken Burns del hero |
| `40s` | `linear infinite` | marquesina de prensa (no aplica a Pavivasa) |

Solo tres curvas personalizadas en todo el sitio: `cubic-bezier(.2,.7,.2,1)` (muro de fotos),
`cubic-bezier(.2,.7,.3,1)` (paneles de mundo, sin uso real) y `cubic-bezier(.16,.84,.44,1)` (slider legado,
sin uso real). Todo lo demás es `ease` explícito o implícito. Nada de `spring`.

### 9.2 Principios de movimiento (para replicar el mecanismo, no cada número)

1. **Micro-interacciones cortas y uniformes** (0.15-0.3s, casi siempre `ease`): feedback, no espectáculo.
2. **Lift + zoom, el zoom más lento que el lift**: la tarjeta sube en 0.2-0.25s, la imagen hace zoom en
   0.4-0.6s. Patrón repetido en 6+ componentes distintos.
3. **Elevación estándar `translateY(-4px)`** (−2px chips/badges, −1px botón primario, −5px `.jobcard`) +
   sombra + borde de acento. — Para Pavivasa, sin sombra (regla del brief): la elevación se comunica solo
   con `translate-y` + color de borde.
4. **Entradas por scroll**: un único patrón, `opacity 0→1` + `translateY(18px→0)` en 0.6s `ease`, sin
   stagger, disparado una vez con 12% de visibilidad y −60px de margen respecto al borde inferior.
5. **Capas de fondo lentas** (≥0.9s): todo lo "cinematográfico" (crossfade, Ken Burns, parallax legado) es
   lento; todo lo "de interfaz" es rápido (≤0.3s). Esta separación es la regla de oro del sistema.
6. **Overlays**: 0.15-0.3s (menús, popups). Sin animación de layout en filtros/acordeones (cambian
   `display`/`hidden` en seco).
7. **Detección de reduced-motion evaluada una sola vez al cargar** (no reactiva a cambios en vivo);
   `(pointer:coarse)` sí se evalúa en cada evento donde aplica (tilt).

### 9.3 Qué se conserva para Pavivasa

- El patrón lift + zoom (sin sombra: solo `translate-y` + `border-color`).
- El reveal al hacer scroll, con la regla dura de nunca ocultar contenido en el HTML servido (ver §5.4).
- Las duraciones cortas (0.15-0.3s) para toda micro-interacción de interfaz.
- El hero cinematográfico como único punto "lento" del sitio (§8).
- `prefers-reduced-motion` respetado en **todas** las animaciones ambient, no solo en reveal/hero (mejora
  sobre el original, que no lo respeta en marquesina, respiración de peso tipográfico, ni exit-popup).

### 9.4 Qué se descarta

| Mecanismo de globotent | Motivo para no implementarlo en Pavivasa |
|---|---|
| Tilt 3D (`perspective(900px)`, ±1.5°) | Coste (handler `mousemove` por tarjeta) alto frente a valor estético marginal; además colisiona con el reveal (el estilo inline del tilt anula el `translateY` del hover CSS en tarjetas ya reveladas — un defecto de cascada documentado, no un rasgo a preservar). El lift+zoom por CSS ya aporta suficiente feedback |
| Parallax de scroll del hero legado | Inerte incluso en globotent (0 páginas lo usan); listener sin `requestAnimationFrame` |
| Carruseles auto-rotativos fuera del hero (`hero-slider`, `lead-slider`) | Inertes en el .com; penalizan LCP y accesibilidad; el `CineHero` (una sola instancia) basta |
| View Transitions entre páginas (MPA) | El patrón `location.href` de globotent no aplica en un router SPA de Next; si se quiere el efecto, usar la API nativa de transiciones de React/Next bajo `prefers-reduced-motion:no-preference`, como decisión de presupuesto de JS, no como copia literal |
| Marquesina de prensa | No hay prensa ni logos de cliente en Pavivasa |
| Animación de peso variable (`wghtFlex`) | Cara en repaint (anima `font-variation-settings`); además ya está muerta en el propio globotent (0 páginas) |

→ Detalle en: `07-interacciones-y-movimiento.md` §3 (catálogo completo de 88 `transition:`), §4 (13
`@keyframes` completos), §6 (principios deducidos), §8.3 (tabla módulo a módulo de qué se descarta y por
qué, con más detalle que la tabla de arriba).

---

## 10. Responsive (tabla de colapsos)

### 10.1 Filosofía de breakpoints de globotent

Todo el sitio es **desktop-first** (`@media (max-width:…)`, nunca `min-width` como media feature): los
estilos base son de escritorio y las media queries solo restan/recolocan. 75 bloques `@media` con 16
valores de `max-width` distintos (1100, 1000, 900, 880, 860, 820, 780, 768, 760, 720, 700, 680, 600, 560,
520, 480px) — no hay un sistema unificado de 4-5 breakpoints, cada componente colapsa donde su propio
contenido lo necesita.

### 10.2 Cortes estructurales principales

| Corte | Qué cambia |
|---|---|
| **900px** | Corte estructural mayor: burger aparece, nav pasa a panel fijo, dropdowns a acordeón, CTA de cabecera se oculta, la mayoría de rejillas de 4→3→2 pasan por aquí, teléfono de cabecera pasa a icono circular |
| **1100px** | Rejillas de 4→3 o 3→2 (product-grid, case-grid, calc-grid, reviews-grid) |
| **760px** | Corte propio del hero cinematográfico (no coincide con ningún otro corte del sitio) |
| **560px** | "Todo a 1 columna": última rejilla que quedaba en 2 pasa a 1; `.section` de 72px a 48px de padding |
| **480px** | Teléfono de cabecera se oculta del todo; botones que envuelven texto |

### 10.3 Tabla de colapso de cabecera/nav (referencia completa en §5.5)

| Elemento | >900px | 481-900px | ≤480px |
|---|---|---|---|
| `.site-header__bar` | 80px alto (constante en todos los anchos) | = | = |
| Logo | 56px alto | = | 42px (corte real: ≤600px) |
| Nav | en línea, `gap:24px` | panel fijo `top:80px`, `translateY(-200%)→0` | = |
| Burger | oculto | 48×48px visible | = |
| Teléfono | píldora con número | círculo 48px solo icono | oculto |
| CTA primario | visible | oculto | oculto |

### 10.4 Objetivo táctil

`--touch-target-min:48px` en botones, inputs, enlaces de cabecera/pie (el brief de Pavivasa pide 44px, un
paso más permisivo — usar 44px como mínimo consistente en toda la interfaz, no mezclar 44 y 48 como hace
globotent en distintos sitios).

### 10.5 Divergencia importante entre globotent y Pavivasa: fluido vs. discreto

Globotent usa `clamp()` en 44 sitios para tipografía y espaciado fluido (interpolación continua entre un
mínimo y un máximo según el viewport). **El brief de Pavivasa prohíbe esto explícitamente**: "Escala
tipográfica cerrada: 12/14/16/20/26/34/46/64/88px. Nada intermedio." Esto significa que, donde globotent
interpola continuamente (p. ej. `h1{font-size:clamp(2rem,4.2vw,3.6rem)}`), Pavivasa debe usar **pasos
discretos por breakpoint** (p. ej. `text-[34px] md:text-[46px]`, saltando entre dos valores fijos de la
escala, sin punto intermedio). Es la divergencia de sistema más relevante de toda la síntesis: el
*mecanismo* de "el texto se adapta al viewport" se conserva, pero la *técnica* cambia de continua a
escalonada.

### 10.6 Traducción a Tailwind — mapa de breakpoints

**No redefinir `theme.screens`**: shadcn/ui usa los nombres por defecto (`sm`/`md`/`lg`/`xl`/`2xl` =
640/768/1024/1280/1536) dentro de sus propios primitives (`Dialog`, `AlertDialog`…); sobrescribirlos rompe
el responsive de esos componentes sin avisar. En su lugar, variantes arbitrarias `max-[Npx]:` por cada
corte real de globotent que se quiera preservar con fidelidad:

| Corte globotent | Clase Tailwind |
|---|---|
| 1100px | `max-[1100px]:` |
| 900px | `max-[900px]:` |
| 760px (solo hero) | `max-[760px]:` |
| 560px | `max-[560px]:` |
| 480px | `max-[480px]:` |
| `(hover:none)` | `theme.extend.screens.touch = {raw:'(hover:none)'}` |
| `prefers-reduced-motion:reduce` | `motion-reduce:` (nativo de Tailwind) |
| `pointer:coarse` (JS) | hook `useMediaQuery('(pointer: coarse)')` |

Alternativa más simple (aceptable para diseño, no para réplica fiel de globotent): aproximar 560→`sm`
(640), 900→`lg` (1024), 1100→`xl` (1280) — compatible con shadcn porque no toca `theme.screens`, pero
desplaza el corte del burger 124px y el de "1 columna" 80px respecto al original; usarlo solo si la
fidelidad exacta a globotent no importa (que es probablemente el caso para Pavivasa, cuyo sistema visual
es propio desde el principio).

→ Detalle en: `08-responsive.md` completo (§0 resumen ejecutivo, §1-§2 inventario literal de los 75
bloques `@media`, §3 comportamiento por componente escritorio→tablet→móvil, §3.8 tabla completa de
rejillas, §4 los 44 `clamp()`, §11.1 mapa de breakpoints recomendado con el código de `tailwind.config.ts`).

---

## 11. Qué NO copiar

Lista explícita de mecanismos presentes en el código de globotent que **no** deben trasladarse a Pavivasa,
con el motivo de cada uno.

| Mecanismo | Motivo |
|---|---|
| **Sub-marca "globotent SPORTS"** (`--sport-lime:#e3fc03`, `'Clash Display'`, bordes `1px solid #000`, radio 16px, 14 páginas con `body.sport-world`) | Pavivasa tiene **una sola línea de negocio** (pavimentos de hormigón); no hay justificación para un segundo sistema visual dentro del mismo sitio. El mecanismo en sí (una clase de contexto que reescribe descendientes para una sub-sección) es interesante técnicamente pero no tiene para qué existir aquí |
| **Rating badge / `AggregateRating` / "4.96 de 127 reseñas"** | El brief es explícito: "Reseñas / testimonios: ninguno"; "Sin `AggregateRating`; sin testimonios inventados"; prohibido "valoraciones con estrellas". Además, en el propio globotent el JSON-LD de reseñas está en alemán mientras el texto visible está en inglés — ni siquiera es un dato limpio en el original |
| **`review[]` dentro del JSON-LD `LocalBusiness`** (6 `Review` con autor anonimizado — "Markus H.", "Carlos M."…—, las 6 puntuadas `ratingValue:"5"`, `reviewBody` en alemán que no coincide con el texto visible en inglés de la página) | Es el gemelo en datos estructurados del rating badge visual, y el más fácil de copiar sin querer: el repo de Pavivasa ya tiene `lib/schema.tsx` con un helper `schemaNegocioLocal()`, así que al rellenarlo es tentador imitar la forma completa de globotent, incluido el array de reseñas. **Ni `review[]` ni `aggregateRating` deben aparecer nunca en el `LocalBusiness` de Pavivasa** (brief §6: "Inventar reseñas, testimonios, valoraciones con estrellas… " está en la lista explícita de prohibiciones) — el `LocalBusiness`/`Organization` de Pavivasa se queda en los campos mínimos (nombre, dirección, teléfono, `sameAs`) hasta que existan reseñas reales que citar |
| **`avail-banner` (disponibilidad simulada)** | Calcula "1-4 huecos" y un "hace X min" **falsos y deterministas** a partir de un hash de la URL (`1 + hash(pathname) % 4`). Es escasez fabricada. El brief prohíbe inventar cifras; esto es el ejemplo más claro de lo que no hacer |
| **Exit-intent popup** | Interrupción agresiva basada en `mouseout` con `clientY<=0`; no funciona en móvil (que será la mayoría del tráfico de Pavivasa); no está en la arquitectura fija del brief. Sustituir por CTA sticky en móvil (`BarraMovil`) o banda de cierre al final |
| **Visor 3D (Three.js) y AR (`<model-viewer>`)** | 600KB+ de librerías de terceros cargadas desde CDN externo, sin relación con hormigón impreso/pulido; en el propio globotent están completamente inertes (0 páginas los usan) |
| **Tilt 3D en tarjetas** | Ver §9.4: coste/beneficio bajo y colisiona con el reveal |
| **Muro de fotos de personas** (`team-wall`, 10 fotos de equipo) | El brief prohíbe fotos de stock de personas. Si Pavivasa quiere humanizar la marca, tendría que ser con fotos reales del propio equipo, expresamente autorizadas — no un patrón a activar por defecto |
| **Selector de idioma** (`lang-switch`, banderas CSS) | Pavivasa es monolingüe en español; la web actual de Pavivasa tiene un plugin de traducción automática (gtranslate) que el propio brief identifica como problema a corregir, no a imitar con un sistema más sofisticado |
| **`'Clash Display'` sin `@font-face`** | Documentado en §3.1: fuente declarada que nunca se carga. Si Pavivasa elige una familia display, debe servirla de verdad |
| **`top:calc(100%+10px)` y otras `calc()` sin espacios** | CSS inválido (el navegador descarta la declaración entera); defecto de escritura, no un valor de diseño |
| **Tokens muertos** (`--brand-navy`, `--button-medium-height`) | Declarar tokens que ningún componente usa genera deuda sin beneficio |
| **Marquesina de prensa** (`press-strip`, logos de medios) | Pavivasa no tiene menciones de prensa ni logos de cliente (brief: "Certificaciones / marcas: ninguna") |
| **`.mobile-sticky-cta`, `.splash` (pantalla de carga), `.maint-banner`** | Los tres existen solo en CSS/JS, en 0 de las 78 páginas de globotent — ni siquiera el propio sitio los usa. Una pantalla de carga (`.splash`) es además un antipatrón para LCP |
| **Filtro de catálogo sin disparador** (`data-filter-bar` inerte) | El patrón visual de píldoras de filtro sí es reutilizable (ver §7.4), pero la implementación de globotent nunca conecta el disparador con la lógica — construir la lógica de filtrado de cero, no asumir que copiando el CSS ya funciona |
| **Promesas de plazo** ("within 24 hours" en 3D preview, exit-popup, CTA final) | El brief prohíbe explícitamente prometer plazos de respuesta no confirmados |
| **Reutilizar la foto de un producto como si fuera la foto de una obra** (`case-card` #1 y #3 de la home comparten archivo con `product-card` #1 y #4) | Defecto verificado en el propio código de globotent: presenta un render de producto como si fuera una foto de caso real. Para Pavivasa esto sería directamente engañoso; usar `BloquePosicion` mientras no exista foto real de esa obra concreta |
| **`btn--primary` repetido en cada tarjeta de una misma rejilla** | El brief exige un solo CTA primario por pantalla; globotent pone un botón primario dentro de cada una de las 4 `product-card` de la home |
| **Contenido mezclado en varios idiomas dentro de la misma página** (footer/JSON-LD en alemán sobre una web servida en inglés) | Síntoma de que el espejo EN es una traducción parcial; no es un patrón de internacionalización a imitar |
| **NAP en texto plano sin `tel:`/`mailto:`** en el pie | El CSS lo prevé pero el HTML no lo usa — defecto de implementación, no de diseño; en Pavivasa, enlazar siempre |
| **Foco visible solo con `:focus` (no `:focus-visible`) en el único lugar donde sí hay anillo** | Se activa también con clic de ratón, no solo con teclado; usar `:focus-visible` en Pavivasa |

→ Detalle en: `05-secciones-home.md` §5 (cosas del código que conviene no copiar, sección home); §11
(esta tabla) sintetiza además hallazgos de `01-fundamentos.md` §1.3-§1.4 (sub-marca sport, fallbacks
inconsistentes), `07-interacciones-y-movimiento.md` §7-§8.3 (código muerto y qué se descarta), `09-pie-y-globales.md`
§5-§6, §11, §14.2-§14.5 (AggregateRating, reviews, avail-banner, exit-popup, splash, maint-banner con CSS
completo); `brief-claude-design.md` §6 ("LO QUE NO PUEDES HACER").

---

## 12. Encargo a Claude Design

### 12.1 Pantallas a diseñar

Las nueve pantallas de la arquitectura fija del brief (`brief-claude-design.md` §7 bloque 4), cada una en
**móvil 390px y escritorio 1440px** (las dos anchuras normativas, ninguna es opcional):

1. **01 SISTEMA** — lámina de tokens (con los nombres fijos de §2.2) y los componentes de §5, con sus
   estados: hover, activo, deshabilitado, error, pendiente (`DatoPendiente`).
2. **02 HOME** — hero con titular y dos CTA (Pedir presupuesto / Ver proyectos); `BarraConfianza`; "¿Qué
   quieres pavimentar?" con los 6 espacios; servicios (los 7, con los 3 fuertes destacados); obras
   destacadas (3 `TarjetaProyecto` con datos reales de §4 del brief); muestrario de modelos y colores
   (`MuestraAcabado` con modelos y colores reales); garantía 10 años; FAQ (acordeón, 4-5 preguntas **sin**
   respuesta inventada: `DatoPendiente`); formulario corto; pie.
3. **03 SERVICIO** (hormigón impreso como ejemplo) — hero, `SubmenuServicio` con anclas (qué es, dónde se
   usa, modelos y colores, ficha técnica, obras, FAQ, presupuesto), `TablaFichaTecnica` con los datos
   literales del brief §3/§4, listas de aplicaciones reales, obras de esa técnica, CTA.
4. **04 PROYECTOS** — índice con `FiltrosProyectos` (escritorio: fila de chips fija; móvil: botón "Filtrar"
   que abre hoja inferior), rejilla de `TarjetaProyecto`, `EstadoVacio`.
5. **05 FICHA DE OBRA** (Dénia) — galería (`BloquePosicion` 21:9 + 4 miniaturas), título, "El encargo" y
   "La ejecución" con el texto real, `FichaObra` lateral fija con: técnica, modelo, color, espesor,
   hormigón, árido, mallazo, fibra, dosificación de color, municipio, m² `[pendiente]`, año `[pendiente]`;
   obras similares.
6. **06 EMPRESA** — texto real de §5 del brief, cinco valores, zona de trabajo (lista de municipios con
   obra), `BloquePosicion` para foto de equipo (nunca stock).
7. **07 PRESUPUESTO** — formulario completo a un lado, columna fija con teléfono, WhatsApp `[pendiente]`, y
   `EtiquetaTecnica` con los cuatro claims; estados: inicial, error de teléfono, enviando, enviado.
8. **08 BLOG** — índice y artículo (`TarjetaArticulo`, ancho de lectura 68 caracteres).
9. **09 LEGAL + 404.**

`Cabecera`, `MenuMovil`, `BarraMovil`, `Consentimiento` y `Pie` aparecen en las pantallas **02-09**; en la
**01 SISTEMA** (una lámina de tokens/componentes, no una página navegable), `Cabecera` y `Pie` se muestran
como componentes de la lámina con sus estados, no como marco de página.

### 12.2 Restricciones (no negociables)

- **Copy solo del brief** (`brief-claude-design.md`, especialmente §5 CONTENIDO REAL). Nada inventado: sin
  cifras, testimonios, valoraciones con estrellas, logos de cliente, precios por m², plazos de respuesta,
  horarios, años concretos de fundación ni número de obras que no estén en el brief.
- **Datos pendientes entre corchetes** y atenuados (`DatoPendiente`), nunca maquillados como si fueran
  reales.
- **Cero fotos de stock de personas.** Donde falte foto real, `BloquePosicion` con trama diagonal y la
  etiqueta "PENDIENTE · ORIGINAL A 2400 PX".
- **Un solo teléfono** (+34 627 66 31 46) **y una sola dirección** (Calle Blasco Ibáñez 16, Sollana) en
  todo el sitio.
- **Identidad propia, distinta de Pavimentos Albufera** (misma empresa, otra marca, misma dirección y
  teléfono): no reutilizar su paleta (fondo `#E9EAE6`, tinta `#1B1E1C`, acento ocre `#D9A441`) ni sus
  tipografías (Archivo Expanded + Instrument Sans + Martian Mono) — brief §7 bloque 1. Sí se comparten las
  reglas de construcción de §7 bloque 3 (tokens con esos nombres, tres familias, escala cerrada, esquinas
  a 0, una sombra).
- **Esquinas a 0, una sola sombra** (la de `BarraMovil`), **escala tipográfica cerrada** de 9 pasos, **un
  CTA primario y un estado activo por pantalla** — nunca el acento como texto pequeño sobre fondo claro.
- **Valores literales siempre; nada de adjetivos sin número.** Cada decisión de tipografía, espaciado,
  color o tiempo de transición debe poder citarse como un valor concreto, siguiendo el estándar que este
  mismo documento aplica sobre globotent.

### 12.3 Qué tiene que entregar

Un **único lienzo HTML navegable** (el "canvas con artboards" que pide el brief, `brief-claude-design.md`
§7 bloque 1), no un PDF ni una descripción textual de la pantalla. Dentro de ese lienzo: 9 artboards
verticales, uno por pantalla (01 SISTEMA a 09 LEGAL+404, en ese orden), y dentro de cada artboard **las dos
anchuras normativas visibles a la vez, lado a lado** — 390px (móvil) y 1440px (escritorio) — no dos
entregas separadas ni una sola anchura con la otra "implícita". Cada artboard lleva su número y nombre
como rótulo (p. ej. "02 · HOME"), igual que hace explícito el propio brief al enumerarlas. La lámina de
sistema (pantalla 01) precede a las ocho pantallas de contenido y no se funde con ninguna de ellas.

### 12.4 Recordatorio de mecanismo (resumen de las secciones 1-11 de este documento)

Al diseñar cada pantalla, el sistema de globotent que vale la pena traer es el **mecanismo**, no los
números: cabecera eyebrow→h2→párrafo sobre cada sección; rejillas de tarjetas con lift+zoom en hover, sin
sombra en reposo; badges de dos niveles (dato principal + dato secundario); reveal al hacer scroll con
contenido siempre visible en el HTML servido; hero con temporización lenta como único punto "cinematográfico"
del sitio; alternancia de fondo entre secciones sin repetir dos oscuros seguidos; un botón lima/acento
saturado reservado para el único CTA de cierre. Los números (radio 12px, dos sombras, tipografía fluida,
verde `#1aa585`) no se copian: los sustituye el sistema propio de Pavivasa definido en §2.2 y §3.3, no
negociable según el brief.

→ Detalle en: `brief-claude-design.md` §7 completo (prompt íntegro con arquitectura fija, reglas de
construcción, pantallas a entregar, contenido real y prohibiciones) — este documento no repite ese texto,
lo complementa.

---

## 13. Rendimiento y assets

Sección para Claude Code (no aporta al diseño visual): tres mecanismos verificados de
`10-assets-y-rendimiento.md` directamente aplicables a `next/image` y a los iconos propios de Pavivasa.

### 13.1 Anti-CLS: reserva de espacio por `aspect-ratio`, no por `width`/`height` HTML

Censo sobre las 79 páginas del espejo: de **788** etiquetas `<img>`, solo **1** lleva `width=`/`height=`
HTML explícitos (`site/pages/sport.html:131`). Regla base global:
```css
img{max-width:100%;display:block;height:auto}
```
La reserva de espacio se hace casi siempre por `aspect-ratio` en el **contenedor** CSS. Tabla de
selectores con `aspect-ratio` declarado (18 selectores únicos, `10-assets-y-rendimiento.md` §5.3):

| Selector | `aspect-ratio` | Tipo de tarjeta |
|---|---|---|
| `.photo-gallery a` | `4/3` | Galería |
| `.collection-card` | `16/10` | Colección |
| `.product-card__media` | `4/3` | Producto |
| `.gallery__main` | `4/3` | Galería (principal) |
| `.gallery__thumb` | `1/1` | Galería (miniatura) |
| `.calc-viz__canvas` | `8/5` (→ `4/3` en `≤560px`) | Calculadora |
| `.case-card__media` | `4/3` | Caso |
| `.case-hero__media` | `4/3` | Caso (hero) |
| `.case-gallery__item` | `4/3` | Caso (galería) |
| `.blog-card__media` | `16/9` | Blog |
| `.before-after` | `16/9` | Comparador |
| `.threed-viewer__canvas` | `16/9` | Visor 3D |
| `.video-testi__media` | `16/9` | Vídeo testimonio |
| `.quiz__result-media` | `1` | Resultado quiz |
| `.compare-img-wrap` | `4/3` | Comparador |
| `.sp-disc__media` | `4/3` | Sub-marca sport |
| `.choose-card__media` | `16/10` | Tarjeta de elección |
| `.agro-feature__video` | `16/9` | Vídeo feature |

Cada contenedor combina esto con `img{width:100%;height:100%;object-fit:cover}` (26 declaraciones
`object-fit:cover` en total, ninguna con otro valor). **Excepción real**: `.team-wall` (masonry
`column-count:3`) no tiene `aspect-ratio` — sin reserva de espacio, puede causar CLS.

**→ Traducción a Next/Tailwind/shadcn**: Tailwind 3.4 trae `aspect-ratio` como utilidad core desde 3.0 —
no hace falta el plugin `@tailwindcss/aspect-ratio` ni el componente `AspectRatio` de shadcn/ui (Radix).
`aspect-[4/3]`, `aspect-[16/10]`, `aspect-[16/9]`, `aspect-square` cubren la tabla; combinar con `next/image
fill` + `object-cover` en el contenedor con el `aspect-*` aplicado, replicando el mismo mecanismo (reserva
por CSS del contenedor, no por atributos de la imagen) para cada `TarjetaProyecto`/`TarjetaArticulo`/
`MuestraAcabado` de Pavivasa.

### 13.2 Aviso: el `preload` no siempre coincide con el recurso realmente pintado

`10-assets-y-rendimiento.md` §5.2 verifica, en la muestra de páginas interiores, que el `<link rel=preload>`
del `<head>` **no coincide** con el recurso que realmente pinta `.page-hero__bg` como fondo en la mayoría
de los casos muestreados (7 de 8 páginas de `site/projects/` con el mismo fichero pero formato distinto,
p. ej. precarga `.webp` y se pinta `.jpg`/`.png`; 1 caso con fichero base distinto). En un caso
verificado con `curl -sI`, el `.webp` precargado es incluso **más pesado** que el `.jpg` que se pinta
(`hero_banner_1.webp` 200 180 B vs. `hero_banner_1.jpg` 197 332 B) — la precarga no solo apunta al recurso
equivocado, sino que en ese caso concreto adelanta la descarga del archivo más grande.

**Lección para Pavivasa**: al fijar `priority`/`sizes` en `next/image` para el elemento LCP de cada
plantilla (hero de home, `page-hero` de interiores), verificar explícitamente qué imagen es la que Next.js
sirve realmente en ese breakpoint/densidad — no asumir que el formato o el fichero declarado como
prioritario es el que se pinta, para no repetir esta discrepancia.

### 13.3 Sin librería de iconos: 4 SVG inline a mano

Censo `grep` sobre las 78 páginas + `home.html`: solo **4 formas de SVG inline** en todo el sitio
(teléfono, WhatsApp, estrella, y 3 variantes de icono de calculadora — geometría con `<rect>`/`<circle>`/
`<line>`, sin librería). Chevrons, flechas y cierres son glifo de texto Unicode (`▾`, `→`, `‹`/`›`,
`&times;`) o `content` CSS, no SVG. Globotent no usa Feather, Lucide, Heroicons ni ningún paquete de
iconos — todo pegado a mano (`10-assets-y-rendimiento.md` §7).

**Relevante para Pavivasa**: `CLAUDE.md:27` del repo también prohíbe librerías de iconos ("Sin librerías de
animación, iconos ni formularios"). Este es el precedente directo: construir los iconos propios de
Pavivasa (teléfono, WhatsApp, estrella si se usan reseñas, sello de calidad/garantía, check) como
componentes SVG inline a mano, igual que hace globotent, en vez de instalar un paquete.

→ Detalle en: `10-assets-y-rendimiento.md` completo (imágenes, LCP/CLS, iconos, vídeo, fuentes, bundle,
service worker).
