# 00 · README de esta carpeta

Referencia de la arquitectura frontend de https://globotent.com/, extraída para inspirar el diseño de la
web nueva de Pavivasa (hormigón impreso y pulido, Sollana, Valencia). Fecha de rastreo del sitio origen:
**2026-09-18**.

---

## 1. Qué es cada archivo, y para quién

| Archivo | Contenido | Para quién |
|---|---|---|
| **`arquitectura-globotent.md`** | El documento **único y autocontenido** que se pasa a Claude Design junto al brief de negocio. Mecanismo + valores literales de todo el sistema visual de globotent, con mapeo explícito a Pavivasa en cada sección: identidad, tokens, tipografía, layout, componentes (tarjetas con detalle especial, pila de z-index, consentimiento y analítica), gramática de la home, plantillas interiores, hero cinematográfico, movimiento, responsive, qué no copiar, el encargo exacto de pantallas a entregar, y rendimiento/assets para Claude Code. | **Claude Design** (adjunto principal, junto con `brief-claude-design.md`). También sirve de referencia técnica para Claude Code. |
| `01-fundamentos.md` | Tokens de `:root` (dos bloques + el sub-tema sport), colores fuera de tokens (hex y `rgba()` literales), carga de fuentes (Figtree real, 'Clash Display' nunca cargada), escala tipográfica completa, patrón "eyebrow". | Quien necesite el valor exacto y la línea de CSS de cualquier color, radio, sombra o tamaño de letra. |
| `02-cabecera-y-navegacion.md` | `.site-header`/`.site-nav` completos: markup, mega menú, menú móvil, burger, selector de idioma, comportamiento al hacer scroll, accesibilidad. | Quien implemente `Cabecera`/`MenuMovil`. |
| `03-hero-cinematografico.md` | El hero de la home (`.cine-hero`): markup, CSS y JS línea por línea, diagrama temporal, variantes legadas sin uso (parallax, slider con puntos — no copiar). | Quien implemente `CineHero`. |
| `04-tarjetas.md` | Las 25 familias de tarjeta del sitio (cuáles se usan y cuáles son CSS muerto), con DOM, CSS, estados, tilt y reveal de cada una. | Quien implemente cualquier `Tarjeta*`. |
| `05-secciones-home.md` | Las 15 secciones + pie de la home, una a una: markup, CSS, JS, copy medido, y la **tabla de mapeo completa a la home de Pavivasa** que se reutiliza en `arquitectura-globotent.md` §6. | Quien diseñe/implemente la home. |
| `06-plantillas-interiores.md` | Las plantillas de las 76 páginas interiores: categoría, producto, proyectos, empresa, formularios, FAQ, reseñas, empleo (no aplica a Pavivasa), legales, herramientas. Marca explícitamente qué componentes son "latentes" (CSS/JS sin markup real en el espejo). | Quien diseñe/implemente rutas interiores. |
| `07-interacciones-y-movimiento.md` | Los 33 módulos de `main.js` uno a uno, catálogo completo de `transition:` (88) y `@keyframes` (13), principios de movimiento deducidos, qué se descarta para Pavivasa y por qué. | Quien decida el sistema de movimiento/interacción. |
| `08-responsive.md` | Los 75 bloques `@media` literales, comportamiento por componente escritorio→tablet→móvil, mapa de breakpoints recomendado para Tailwind. | Quien implemente el responsive. |
| `09-pie-y-globales.md` | `<head>`, JSON-LD (incluido el `AggregateRating`/reseñas fabricadas — no aplica a Pavivasa), pie completo, WhatsApp flotante, exit-popup, accesibilidad global, `robots.txt`/`sitemap.xml`. | Quien implemente `Pie` y metadatos globales. |
| `10-assets-y-rendimiento.md` | Inventario de imágenes, convención de nombres, pistas de LCP/CLS, iconos SVG, vídeo, fuentes, bundle CSS/JS, service worker. | Claude Code, al optimizar assets (no aporta al diseño visual). |
| `11-inventario-clases.md` | Los 212 bloques BEM del CSS, cuáles tienen uso real (89) y cuáles son código muerto (123), inventario de `data-*`, de `id=`, y página→bloques que usa. Es el **crítico de huecos**: la pasada final que compara 01-10 contra el CSS/HTML/JS completos y señala qué faltaba documentar o qué estaba mal citado. | Referencia de auditoría; no hace falta leerlo para diseñar. |
| `12-otros.md` | Dos bloques menores que la pasada de huecos (§11) detectó sin documentar en 01-10: `.jobdetail-salary` y `.jobs-value__ico` (ambos de la sección de empleo, que no está en el alcance de Pavivasa, pero sus mecanismos de layout —wrapper de alineación, tarjeta de icono+texto— sí son reutilizables). | Referencia menor; consultar solo si se busca alguno de esos dos patrones concretos. |
| `capturas/` | Material de apoyo visual del rastreo (no es texto, no se referencia por línea). | Consulta puntual. |

**Regla de trazabilidad de todos los archivos 01-12**: cada afirmación cita el selector CSS, el atributo
`data-*`, la línea de `main.pretty.css`/`main.js`/`home.html` o la función de origen. Donde algo no está en
el código, el texto dice literalmente "no está en el código" — nada se ha inventado ni completado por
analogía con otros sitios.

---

## 2. Cómo se generó esta carpeta

1. **Espejo local completo de las 78 páginas** de https://globotent.com/ (verificado byte a byte contra el
   CSS servido en producción con `cmp`), más el sitemap, robots.txt y los assets citados, guardado en
   `scratchpad/globotent/` durante la sesión de rastreo (2026-09-18).
2. **Extracción por dimensiones** (`01-fundamentos.md` a `11-inventario-clases.md`): once pasadas
   independientes sobre el mismo espejo, cada una centrada en una capa del sistema (tokens/tipografía,
   cabecera, hero, tarjetas, secciones de home, plantillas interiores, interacción/movimiento, responsive,
   pie/globales, assets/rendimiento, inventario de clases). Cada dimensión cita línea de CSS/JS/HTML para
   cada valor que reporta.
3. **Crítico de huecos** (`11-inventario-clases.md`): pasada final que recorrió los 212 bloques BEM
   definidos en el CSS y los comparó contra lo documentado en 01-10, identificando qué bloques tienen uso
   real (89, sobre 78 páginas) frente a cuáles son CSS/JS sin markup (123 — código muerto o
   funcionalidades nunca conectadas, como el visor 3D, el filtro de catálogo o la disponibilidad
   simulada), y señalando defectos verificables por lógica del propio código (rutas que no coinciden,
   `data-*` huérfanos, cascadas contradictorias). El hallazgo de este crítico que quedó fuera de 01-10 —
   dos bloques del detalle de empleo (`.jobdetail-salary`, `.jobs-value__ico`) — se documentó aparte en
   `12-otros.md` en vez de reabrir los archivos ya cerrados.
4. **Síntesis para Claude Design** (`arquitectura-globotent.md`): lectura completa de los doce archivos más
   `brief-claude-design.md` (el brief de negocio de Pavivasa: ficha de empresa, 7 servicios, 15 obras
   documentadas, datos pendientes de confirmar, y el prompt de arquitectura fija ya escrito para Claude
   Design), condensados en un único documento autocontenido con mapeo Pavivasa en cada sección, valores
   *efectivos* (no los declarados sin resolver la cascada), y una lista explícita de qué no copiar.

---

## 3. Cómo usar con Claude Design

Adjuntar **dos** archivos al mensaje: `arquitectura-globotent.md` y `brief-claude-design.md`. No hace
falta adjuntar 01-12 (son la fuente detallada de `arquitectura-globotent.md`, no aportan nada que ese
documento no traiga ya resuelto).

**Prompt literal, listo para pegar:**

```text
Adjunto dos documentos:

1. arquitectura-globotent.md — la arquitectura frontend de globotent.com (mecanismo + valores exactos:
   tokens, tipografía, layout, componentes, gramática de secciones, plantillas, hero cinematográfico,
   movimiento, responsive, y qué NO copiar), con el mapeo a Pavivasa ya resuelto sección por sección.
2. brief-claude-design.md — el brief de negocio de Pavivasa: ficha de empresa, arquitectura fija de
   páginas y componentes (ya construida en Next.js), reglas de construcción no negociables, contenido
   real (15 obras documentadas, copy literal de cada servicio) y lo que no se puede inventar.

Usa arquitectura-globotent.md como referencia de sistema e inspiración de mecanismo (radios, sombras,
tipografía, ritmo de secciones, tarjetas, movimiento) — nunca copiando sus valores literales cuando el
brief los fija distinto (esquinas a 0, una sola sombra, escala tipográfica cerrada, paleta y tipografías
propias distintas de Pavimentos Albufera). Usa brief-claude-design.md como única fuente de copy, datos de
empresa y arquitectura de páginas.

Entrega exactamente lo que pide la sección 12 de arquitectura-globotent.md ("Encargo a Claude Design"):
una lámina de sistema (pantalla 01, tokens + componentes con sus estados) y las ocho pantallas restantes
(02 Home, 03 Servicio —hormigón impreso como ejemplo—, 04 Proyectos, 05 Ficha de obra —Dénia—, 06 Empresa,
07 Presupuesto, 08 Blog, 09 Legal+404), cada una en móvil 390px y escritorio 1440px, en HTML. Copy solo del
brief; datos pendientes entre corchetes y atenuados; cero fotos de stock de personas (BloquePosicion donde
falte foto real); un solo teléfono; identidad propia, distinta de Pavimentos Albufera. Valores literales
siempre, nada de adjetivos sin número.

Todo en un único lienzo HTML con 9 artboards verticales rotulados ("NN · NOMBRE"), cada uno con 390px y
1440px visibles a la vez, lado a lado — no 18 entregas separadas ni una anchura con la otra implícita.
Cabecera, MenuMovil, BarraMovil, Consentimiento y Pie aparecen en las 8 pantallas de contenido (02-09); en
la 01 SISTEMA, Cabecera y Pie se muestran como componentes de la lámina con sus estados, no como marco de
página.
```

---

## 4. Cómo usar con Claude Code

Una vez Claude Design entregue el sistema y las pantallas:

1. **Rama nueva desde `main`** del repo `DreiSup/pavivasa_web` (el repo ya existe: tiene `app/layout.tsx`
   con metadata/skip-link/`JsonLd`, `lib/schema.tsx`, `app/not-found.tsx`, `app/robots.ts`,
   `app/sitemap.ts` — no se parte de cero).
2. **Sustituir tokens y componentes**: volcar los valores de la lámina de sistema en los tokens ya
   nombrados por el brief (`fondo`, `fondo-alt`, `tinta`, `tinta-media`, `pigmento`, `pigmento-hover`,
   `acero`, `sobre-tinta`, `error`) y construir/actualizar los componentes de `layout/`, `ui/`, `datos/`,
   `contenido/` y `secciones/` que ya están nombrados en `brief-claude-design.md` §7 bloque 2.
3. **Instalar shadcn con Tailwind 3.4** siguiendo el mapa de breakpoints de `08-responsive.md` §11.1
   (variantes arbitrarias `max-[Npx]:`, sin redefinir `theme.screens` para no romper los primitives de
   shadcn) y las notas de traducción a Next/Tailwind/shadcn de cada sección de `arquitectura-globotent.md`.
4. **Respetar las reglas del `CLAUDE.md` del repo salvo las que el nuevo diseño cambie explícitamente.**
   Ejemplo del tipo de cambio que puede ocurrir: si el sistema de Claude Design decide un radio distinto de
   0 (`radio 0 → radios de globotent`) o más de una sombra (`una sombra → sombras de tarjeta`), ese cambio
   se documenta en el propio `CLAUDE.md`, no se aplica en silencio.

   **Aviso importante antes de aplicar ese tipo de cambio**: `brief-claude-design.md` §7 bloque 3 marca
   "esquinas a 0" y "una sola sombra en toda la web" como reglas **no negociables, vienen del esqueleto**
   — no como preferencias de diseño abiertas a discusión. `arquitectura-globotent.md` §2.1 documenta los
   radios y sombras de globotent (12/16/50/999px, dos sombras) solo como referencia de mecanismo, y su §2.2
   deja explícito que en Pavivasa esos valores se resuelven a 0 y a la única sombra permitida. Si Claude
   Design entrega un sistema que se desvía de esa regla "no negociable", es una decisión que debe
   confirmarse con el negocio antes de construirse — no basta con anotarla en `CLAUDE.md` y seguir
   adelante como si fuera una elección de diseño más.
5. **Verificar contra `arquitectura-globotent.md` §11** ("Qué NO copiar") antes de dar por cerrada
   cualquier pantalla: ninguna reseña/estrella, ningún dato de disponibilidad simulada, ninguna foto de
   stock de personas, ningún plazo de respuesta prometido sin confirmar, un solo teléfono en todo el sitio.
