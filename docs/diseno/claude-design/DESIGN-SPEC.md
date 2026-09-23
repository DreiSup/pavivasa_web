# Pavivasa — nuevo diseño (Claude Design) · especificación para implementar

Fuente: proyecto Claude Design "Proyecto web Globotent" (b3af4475…), pantallas **01 Sistema** y **02 Home**.
Referencia visual exacta de la home: `02 Home.dc.html` (estilos inline = valores exactos). Esta hoja resume 01 Sistema y fija las decisiones del orquestador.
La carpeta `_ds/safa-liquid-glass…` del proyecto es de OTRO producto: ignorarla.

## 1. Tokens — MISMOS NOMBRES, VALORES NUEVOS

Cambiar solo valores en `apps/web/tailwind.config.ts` y en las variables CSS de `apps/web/src/app/globals.css`. Los nombres (`fondo`, `tinta`…) NO cambian.

| token | antes | NUEVO | uso |
|---|---|---|---|
| fondo | #EDEFEC | **#F3EFE7** | fondo principal |
| fondo-alt | #DCE0DB | **#E7E0D3** | fondos alternos, superficies |
| tinta | #141A18 | **#211D18** | texto, franjas oscuras |
| tinta-media | #5A645F | **#6B6255** | texto secundario |
| pigmento | #B2462A | **#C1440E** | acento: CTA principal y estado activo (1 por pantalla) |
| pigmento-hover | #8F3620 | **#9A3609** | hover del acento |
| acero | #45606E | **#2F4A52** | secundario frío: antetítulos, franja de confianza, foco técnico |
| sobre-tinta | #F2F4F0 | **#F6F1E8** | texto sobre oscuro |
| error | #C4161C | **#B3261E** | validación |

- Todos los `rgba(20,26,24,…)` (tinta antigua) de sombra y tramas → `rgba(33,29,24,…)`. Sombra de la barra móvil: `0 -6px 20px rgba(33,29,24,.35)` (única sombra del sitio).
- Trama de BloquePosicion: `repeating-linear-gradient(135deg, rgba(33,29,24,.1) 0 1px, transparent 1px 14px)` sobre `fondo-alt`.
- `viewport.themeColor` en `app/layout.tsx` → `#F3EFE7`. `::selection` → fondo pigmento, texto sobre-tinta.
- Reglas que se mantienen: `border-radius: 0` en todo; una sola sombra (BarraMovil); escala tipográfica cerrada 12/14/16/20/26/34/46/64/88; un solo acento por pantalla.

## 2. Tipografía

`apps/web/src/app/fuentes.ts` (next/font/google, autoalojado, `display: 'swap'`, mismas variables CSS `--font-display`, `--font-sans`, `--font-mono`):
- display: **Big Shoulders Display** 500/700/800/900 (antes igual) — titulares, cifras, wordmark `PAVIVASA` (800).
- sans: **Work Sans** 400/500/600/700 (antes Barlow) — texto, labels, botones, navegación.
- mono: **Space Mono** 400/700 (antes Overpass Mono) — solo datos de obra (m², espesor, modelo), antetítulos; siempre versalitas/uppercase; suelo 10 px.

## 3. Componentes (01 Sistema) — medidas

| componente | especificación |
|---|---|
| Boton primario | h 48 (hero/banda 52), px 28, bg pigmento, texto sobre-tinta, Work Sans 700 14px uppercase tracking .04em; hover pigmento-hover; activo pigmento-hover; deshabilitado bg tinta/14 texto tinta-media |
| Boton contorno | transparente, borde 2px tinta, texto tinta; hover borde+texto pigmento; activo relleno tinta + texto sobre-tinta. Sobre fondo oscuro: borde/texto sobre-tinta |
| Boton tinta | bg tinta, texto sobre-tinta (p. ej. "Enviar y que me llamen", h 52, ancho completo) |
| Campo | label 14px 600 encima (mb 6); input h 48, px 14, bg fondo, borde 1.5px tinta/30, 16px; foco: borde pigmento + `box-shadow:0 0 0 3px rgba(193,68,14,.18)` sin outline (es foco, no sombra de elevación); error: borde error + mensaje Space Mono 12 color error; deshabilitado bg tinta/6 texto tinta-media borde tinta/14 |
| Chip | h 34, px 16, borde 1px tinta/30, 14px 600; activo bg pigmento texto sobre-tinta 700; hover borde+texto acero |
| Casilla | 20×20, borde 2px tinta; marcada bg tinta con check sobre-tinta |
| AntetituloSeccion | Space Mono 12, uppercase, tracking .1em–.14em, 700, color acero, mb 10 |
| EnlaceEtiqueta | Work Sans 14 700 uppercase tracking .04em, color acero |
| EtiquetaTecnica | bloque tinta, p 20; rótulo Space Mono 10 tracking .1em sobre-tinta/60; líneas Space Mono 12 uppercase sobre-tinta |
| FichaObra | borde 1px tinta/20; rótulo Space Mono 10; filas 14px `etiqueta (tinta-media) … valor (600)` separadas por borde tinta/14, padding 12×16 |
| DatoPendiente | texto tinta-media en *cursiva* entre corchetes, p. ej. `[pendiente]` |
| TablaFichaTecnica | 14px; cabecera 700 con borde inferior 2px tinta; filas con borde tinta/14; primera columna tinta-media |
| BloquePosicion | trama sobre fondo-alt; etiqueta Space Mono 11 uppercase tinta-media centrada ("Pendiente · original a 2400 px" o la etiqueta del dato) |
| MuestraAcabado | cuadrado 1:1 + nombre 12–14px |
| EstadoVacio | borde tinta/20, p 24; título 16 600; texto 14 tinta-media; enlace "Quitar filtros" subrayado 700 |
| TarjetaProyecto | imagen 4:3; meta Space Mono 12 uppercase tinta-media (`Municipio · año`); título 20 600/700; teaser 14 tinta-media; ficha Space Mono 12 uppercase acero; "Ver obra →" 14 700 |
| TarjetaArticulo | igual estructura; meta = técnica; "Leer más →" |
| BarraConfianza | franja acero, py 32 (40–56 en Sistema), grid auto-fit min 180; cifra Big Shoulders 800 26px sobre-tinta; rótulo Space Mono 12 uppercase sobre-tinta/75. Cobertura sin confirmar = DatoPendiente en cursiva opacidad .75 |
| Cabecera | sticky, bg fondo, borde inferior tinta/14; alto 72 (56 al hacer scroll, SIN sombra); wordmark `PAVIVASA` Big Shoulders 800 26; nav 14px 600 gap 28: Empresa · Servicios · Proyectos · Contacto; a la derecha teléfono 14 700 + botón "Presupuesto" (h 44, px 22, pigmento, uppercase 14 700) |
| MenuMovil | ≤ breakpoint: botón hamburguesa 44×44 con borde tinta/30 (2 barras 20×2); panel bajo la cabecera con enlaces 16px 600, py 14, separadores tinta/10 |
| BarraMovil | solo móvil, fija abajo, h 64, dos mitades: "Llamar" (bg tinta) y "WhatsApp" (enlace real wa.me); la única sombra |
| Consentimiento | franja tinta fija abajo; texto 14; botones h 40–44 uppercase 12–13 700: Rechazar (contorno sobre-tinta) y Aceptar (pigmento en Sistema) |
| Pie | bg tinta, texto sobre-tinta; grid 4 columnas auto-fit min 180: (1) wordmark 24 + dirección + teléfono · email (14, sobre-tinta/70); (2) "Servicios" (rótulo Space Mono 11 uppercase sobre-tinta/50) con los 7 enlaces; (3) "Legal" con los 3 enlaces + botón "Configurar cookies"; (4) hueco "Logos Kit Digital · pendiente" (BloquePosicion oscuro 160×48); línea final `© <año> Pavivasa` 12px sobre-tinta/50 con borde superior |

## 4. Home (02 Home) — secciones en orden

Contenedor `max-width:1280px`, padding lateral 20px, secciones `py clamp(48px,8vw,80px)`. Móvil ≤ 860px en el diseño (se acepta el breakpoint `md` existente si simplifica). H2 34px desktop / 26px móvil; H1 64 / 46.

1. **Cabecera** (global).
2. **Hero con pestañas** (`min-height: clamp(480px,64vw,620px)`, contenido abajo): foto a sangre + degradado `linear-gradient(100deg, rgba(33,29,24,.9) 0%, rgba(33,29,24,.62) 45%, rgba(33,29,24,.22) 100%)`; eyebrow Space Mono 14 uppercase 700 + "Expertos en pavimentos de hormigón" Space Mono 12 sobre-tinta/65; H1 Big Shoulders 800; subtítulo 20px sobre-tinta/92 max 52ch; botones "Pedir presupuesto" (primario h 52 → `#formulario`) y "Ver proyectos" (contorno claro → `/proyectos/`); abajo, fila de 3 pestañas (Impreso · Pulido · Microcemento) con borde superior 2px pigmento en la activa, texto 14 700 uppercase. Textos por pestaña (copy del diseño, aprobado por el usuario):
   - Impreso — eyebrow "Hormigón impreso" — H1 "Suelos de hormigón impreso a tu medida" — sub "Revestimiento de fachadas y muros, recubrimiento de piscinas, patios, terrazas y jardines." — foto `/img/impreso-piscina-madera2.jpg`
   - Pulido — "Hormigón pulido" — "Suelos de hormigón pulido, dentro y fuera" — "Naves industriales, garajes, terrazas, piscinas e interiores. Durabilidad, impermeabilidad y bajo mantenimiento." — `/img/pulido-interior-loft1.jpg`
   - Microcemento — "Microcemento decorativo" — "Microcemento decorativo, sin retirar lo que ya tienes" — "Renueva suelos, paredes, baños y cocinas con un acabado elegante y un ahorro de tiempo importante." — sin foto → trama oscura (`#5A645F` + trama sobre-tinta/8) salvo que @site/content tenga una foto real de microcemento (usarla si existe).
3. **BarraConfianza** (franja acero, 4 cifras: +15 AÑOS / De oficio · 10 AÑOS / De garantía con mantenimiento · [Zona a confirmar] / Cobertura declarada · +30% / De clientes repiten) — valores desde los claims de @site/content.
4. **"¿Qué quieres pavimentar?"** — antetítulo "¿Por dónde empezamos?"; grid auto-fit min 260, gap 16; 6 tarjetas 4:3 con foto, degradado inferior `rgba(33,29,24,0) 45% → .85`, nombre 16 700 sobre-tinta abajo-izquierda; cada una enlaza a `#formulario`. Datos: `home.spaces` de @site/content.
5. **Servicios** (`id="servicios"`, bg fondo-alt) — antetítulo "Lo que hacemos"; grid min 240 gap 16; tarjeta bg fondo p 24: nombre 20 700, resumen 14 tinta-media, "Ver servicio →" 14 700; las 3 insignia (flagship) con borde 2px tinta, el resto 1px tinta/25. Datos: servicios de @site/content (nombre, resumen, ruta, flagship).
6. **Obras destacadas** — antetítulo "Obra real"; grid min 280 gap 24; TarjetaProyecto × 3 con los proyectos destacados de @site/content (foto real si existe, si no BloquePosicion); meta `Municipio (Provincia) · [año pendiente]`; título `Técnica — Modelo`; teaser; ficha técnica en Space Mono acero (valores reales de executionSpecs); "Ver obra →" a la ficha.
7. **Modelos y colores** (bg fondo-alt) — antetítulo "Catálogo"; chips de modelos (h 36, bg fondo); rejilla de colores min 120 gap 2 con cuadrado 1:1 + nombre 12 tinta-media. **Los HEX del diseño son orientativos (no hay dato real)**: pintar el cuadrado como BloquePosicion/trama con el nombre, NO publicar colores inventados. Datos: `home.printedModels`, `home.projectColors`.
8. **Banda de garantía** (bg acero, centrada, max 680): título Big Shoulders 800 "10 años de garantía en todos nuestros trabajos"; texto 16 sobre-tinta/85 **en tuteo**: "También te hacemos el mantenimiento y la reparación de tu pavimento si lo necesitas."; botón contorno claro "Pedir presupuesto" → `#formulario`.
9. **FAQ** (max 800) — antetítulo "Preguntas frecuentes"; H2 "¿Tienes dudas?"; filas con borde inferior tinta/16, pregunta 16 600, icono `+`/`−` Space Mono 20; respuesta sin confirmar = DatoPendiente "[Respuesta pendiente de confirmar]". Usar `<details>/<summary>` (todo en el HTML, funciona sin JS), primera abierta.
10. **Formulario** (`id="formulario"`, bg fondo-alt, max 640) — antetítulo "Sin compromiso"; H2 "Pide tu presupuesto"; texto "Te llamamos para concretar los detalles de tu pavimento."; campos: Nombre y apellidos (ancho completo), Teléfono + Municipio (2 columnas), "¿Qué quieres pavimentar?" (select con los espacios + Otro), casilla privacidad, botón tinta ancho completo "Enviar y que me llamen"; nota "Plazo de respuesta: [pendiente de confirmar]". **Reutilizar `FormularioPresupuesto`** (misma Server Action, honeypot, consentimiento, atribución, eventos) — solo cambia presentación.
11. **Pie** (global). 12. **Consentimiento** y **BarraMovil** (globales).

## 5. Decisiones del orquestador (vinculantes)

1. Texto legal del banner: se mantiene el aprobado ("Usamos cookies propias para que la web funcione y, si aceptas, cookies de medición y publicidad de Google y Meta." + enlace Política de cookies). Solo cambia el estilo. Toda la lógica de consentimiento, Consent Mode, retirada, atribución, eventos y formulario queda IGUAL (mismos nombres de campo, eventos, claves de storage).
2. Enlaces internos siempre a URL final: "Contacto" → `/presupuesto/` (no `/contacto/`, que es una redirección). Botón "Presupuesto" de la cabecera → `/presupuesto/`. En la home, los CTA internos → `#formulario`.
3. WhatsApp: enlace real (`whatsappHref` del negocio), texto "WhatsApp". Nada de "[pendiente]" en WhatsApp.
4. Un solo `<h1>` por página: el de la pestaña activa (SSR con la primera).
5. Ningún dato inventado: cifras, fichas, colores, años → @site/content; lo que falta → DatoPendiente/BloquePosicion.
6. Los componentes nuevos de la home pueden leer **@site/content directamente** (API en inglés, locale 'es'); el resto de páginas sigue con los adaptadores. Nombres de componentes del frontend en español (como el resto del frontend).
7. Imágenes con `next/image`; `priority` solo en la foto del hero; `sizes` correctos. JS inicial ≤ 100 KB: la única pieza cliente nueva es el selector de pestañas del hero.
8. Accesibilidad: objetivo táctil ≥ 44 px, foco visible, contraste AA, pestañas con `role="tablist"`/`aria-selected`, `prefers-reduced-motion`.
