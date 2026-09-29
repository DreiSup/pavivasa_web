# Contexto del proyecto (verificado 2026-09-29)

Mapa del código para no reinspeccionar en cada tarea. Reglas de diseño/contenido/técnica: `CLAUDE.md`.
Si cambia algo estructural, actualizar este fichero en el mismo commit.

## Estado verificado

- `npx tsc --noEmit`, `npm run lint` y `npm run build`: **limpios, sin warnings** (43 páginas estáticas).
- Stack: Next 15.5 (App Router) · React 19 · Tailwind 3 · zod. Sin más dependencias.
- `node_modules` no viene en el repo: `npm install` antes de build/lint.
- First Load JS: compartido 103 kB; home 117 kB, `/proyectos` 116 kB, `/blog` 114 kB, resto 107–112 kB.
  **Presupuesto de CLAUDE.md = 100 KB → ya superado por el bloque compartido** (React + Next; probable que no sea evitable).

## Rutas (todo SSG)

| Ruta | Fichero | Datos |
|---|---|---|
| `/` | `app/page.tsx` | `content/home.ts`, `lib/datos.ts` |
| 7 servicios `/hormigon-impreso/` … `/alicatados/` | `app/[servicio]/page.tsx` (plantilla única) | `content/servicios.ts` |
| `/proyectos/` + 15 fichas | `app/proyectos/…` | `content/proyectos.json` |
| `/blog/` + 4 artículos | `app/blog/…` | `content/articulos.ts` |
| `/empresa/`, `/presupuesto/` | `app/empresa`, `app/presupuesto` | `lib/config.ts` |
| legales (aviso, privacidad, cookies) | `app/*/page.tsx` + `PlantillaLegal` | `lib/legal/*.md` |
| `/llms.txt`, `/llms-full.txt`, `/ai/*.md`, `/ai/servicios/<id>.md` (Markdown para IA/GEO/AEO) | `app/llms.txt`, `app/llms-full.txt`, `app/ai/…` (route handlers estáticos) + `lib/ai.ts` | generado desde `content/` y `lib/config.ts`; sin copy propio |
| `sitemap.xml`, `robots.txt`, 404, OG image | `app/sitemap.ts`, `robots.ts`, `not-found.tsx`, `opengraph-image.jpg` | |

Servicios: impreso, pulido, lavado, microcemento, autonivelantes, caucho, alicatados (`lib/tipos.ts`: `ORDEN_SERVICIOS`, `RUTA_SERVICIO`, `NOMBRE_SERVICIO`).
Ficheros de `/ai/`: se añaden en `ARCHIVOS_AI` (lib/ai.ts) y en el mapa de `app/ai/[archivo]/route.ts`. Omiten lo pendiente (FAQ sin respuesta, artículo sin indexar: `ARTICULOS_SIN_INDEXAR` en `lib/datos.ts`) y marcan `[pendiente de confirmar]`. No van al sitemap.
Añadir ruta estática nueva ⇒ añadirla a `rutasEstaticas` en `app/sitemap.ts`.

## Dónde se toca cada cosa

- **NAP / claims / redes / IDs de analítica:** `lib/config.ts` (env vacía = no definida). Tel. `627 66 31 46`, Calle Blasco Ibáñez 16, 46430 Sollana. WhatsApp = mismo móvil salvo `NEXT_PUBLIC_WHATSAPP`.
  Teléfono y WhatsApp se normalizan a 9 cifras (quita espacios/puntos/guiones/paréntesis y +34, 0034 o 34); si la variable no da 9 cifras se usa el valor por defecto, y todos los campos de `nap` se derivan de ahí con un único formateador (sin +34 duplicado). La variable se pone sin prefijo.
- **Tokens:** `tailwind.config.ts` + `app/globals.css` (mismos valores en los dos). La paleta de Tailwind está reemplazada: solo existen los colores del config.
- **Fuentes:** `app/fuentes.ts` (Big Shoulders / Barlow / Overpass Mono).
- **Navegación:** `components/layout/Cabecera.tsx` (`enlaces`), `Pie.tsx`, `MenuMovil.tsx`, `BarraMovil.tsx` (única sombra).
- **Formulario:** UI en `components/secciones/FormularioPresupuesto.tsx`; servidor en `app/presupuesto/actions.ts` (zod, honeypot `empresa_web`, 3 envíos/IP/hora en memoria, foto JPG/PNG ≤ 4 MB, Resend + Telegram, Meta CAPI en `lib/meta-capi.ts`). Solo `estado: 'enviado'` cuenta como conversión.
- **Consentimiento y scripts:** `components/layout/Consentimiento.tsx` (localStorage `pv-consentimiento`); clics tel:/wa.me medidos en `EventosGlobales.tsx`; eventos siempre por `lib/eventos.ts`.
- **SEO/JSON-LD:** `lib/schema.tsx` (nodo de negocio único con `@id`, `areaServed` solo Valencia y Alicante, FAQPage solo con respuestas, sin AggregateRating). OG declarado solo en `app/layout.tsx`.
- **Redirecciones 301 de WordPress y noindex del artículo de piedra vista:** `next.config.ts` (con `trailingSlash`, cada `source` lleva barra final).
- **Componentes:** `ui/` (Boton, Campo, Chip, Seccion…), `datos/` (DatoPendiente, TablaFichaTecnica, FichaObra…), `contenido/` (BloquePosicion, Tarjetas), `secciones/` (FAQ, Acordeon, Filtros, Legal…).
- Client components (solo con estado real): Cabecera, MenuMovil, Consentimiento, EventosGlobales, FormularioPresupuesto, FormularioConEspacio, FiltrosProyectos, ListaArticulos, SubmenuServicio, IndiceAnclas, `useSeccionActiva`.

## Contenido y datos pendientes (no inventar)

- FAQ: `FAQ_HOME` y las de cada servicio tienen preguntas **sin respuesta** (se pintan con `DatoPendiente`; el FAQPage JSON-LD queda fuera hasta que haya respuestas).
- Artículo `hormigon-desactivado-piedra-vista`: cuerpo pendiente (original en rumano), `noindex` por cabecera y fuera del sitemap.
- Horario, NIF, logos Kit Digital/UE (bloque con trama en `Pie.tsx`), m² y año de obra (`anioFoto` siempre pendiente), cobertura de 6 provincias («por confirmar»), textos legales.
- Fichas técnicas: solo hay datos reales de 3 obras de impreso; `ficha: {}` en varias obras.

## Imágenes

- `public/img/` tiene 81 ficheros; **todas las referencias existen** (sin rotas). Toda foto sin `src` se pinta como `BloquePosicion` (trama + etiqueta).
- **45 fotos están en `public/img/` pero sin usar** (revisadas una a una el 2026-09-29): `impreso-*` sueltas (patios, porches, terrazas, caminos, piscinas), `pulido-*` sueltas (porches, terrazas, interiores, pasarela, patio), `desactivado-*` (camino beige, texturas marrones), `microcemento-pared-*` y `microcemento-bano-lavabos1`, `caucho-parque-acuatico/tobogan`, `pista-deportiva-roja1/2` (impreso rojo, no caucho), `solera-industrial-mallazo1/2`, `trabajadores1/3.png`, `camino.png`.
- **Huecos de foto vacíos: 2**, ambos `imagenHero` en `content/servicios.ts`: autonivelantes («autonivelante · sin obra documentada») y alicatados («alicatado · sin obra documentada»). Ninguna foto sin usar muestra un autonivelante ni un alicatado como sujeto (`pulido-interior-loft2` tiene un banco de trencadís, pero el sujeto es un suelo pulido), así que quedan vacíos hasta que haya fotos reales. Los demás huecos (proyectos, home, artículos, servicios) ya tienen foto. Bloque con trama restante que no es foto: mapa en `app/empresa/page.tsx` y logos en `Pie.tsx`.
- Las fotos sin usar podrían servir de galería secundaria en proyectos con una sola imagen, pero no se sabe a qué obra pertenece cada una: no asignar sin confirmación.
- `hormigon-impreso-calpe` usa `portada.png` como única imagen.

## Desviaciones detectadas frente a CLAUDE.md / puntos a revisar

1. **Márgenes por elemento** (regla: solo flex/grid + `gap`): `mt-`/`my-`/`mb-`/`-mx-lat-movil` en `app/blog/[slug]/page.tsx` (54, 69, 107), `app/page.tsx` (131), `app/not-found.tsx` (34), `app/[servicio]/page.tsx` (107), `Pie.tsx` (`mt-2`, `mt-3`, `mt-4`), `BarraConfianza`, etc. (`m-0` y `mt-auto` en flex son inocuos.)
2. **JS inicial > 100 KB** (ver arriba).
3. `next.config.ts` fija `bodySizeLimit: '12mb'` con comentario «foto de hasta 10 MB», pero `actions.ts` y el formulario limitan a **4 MB** (tope de Vercel 4,5 MB). Comentario desactualizado.
4. Proyecto `hormigon-pulido-alicante` está en **Benissa** (slug engañoso; hay otro `hormigon-pulido-benissa`). Los slugs son URL heredadas de WordPress: no renombrar sin redirección.
5. Rate limit por IP en memoria: en serverless no es fiable entre instancias.
6. `next lint` está deprecado (avisa que desaparece en Next 16).

## Flujo de trabajo

`npm run dev` · `npm run lint` · `npx tsc --noEmit` · `npm run build` (sin warnings antes de cada commit).
Rama de trabajo de esta sesión: `claude/sweet-hypatia-ijbfry`.
