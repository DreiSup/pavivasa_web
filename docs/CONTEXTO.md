# Contexto del proyecto (monorepo)

Mapa del código para no reinspeccionar en cada tarea. Reglas: `CLAUDE.md`. Arquitectura completa: `ARCHITECTURE.md`.
Si cambia algo estructural, actualizar este fichero en el mismo commit.
Rama plana `main` integrada en `integracion/monorepo-main`. Rutas planas antiguas (`app/`, `lib/`, `components/` en la raíz) ya no existen.

## Estado y comandos

Monorepo pnpm 9.15.9 + Turborepo, Node >=22.6. Next 15.5 · React 19 · Tailwind 3 · zod. `pnpm install` antes de nada.

- `pnpm content:validate` · `pnpm lint` · `pnpm typecheck` · `pnpm build` (vía turbo; `prebuild` de `apps/web` corre `check-env`).
- `pnpm verify` (checks a-j, `scripts/verify/`) · `pnpm verify:secrets`.
- Sin warnings antes de cada commit.

## Rutas (todo en `apps/web/src/app/`)

| Ruta | Fichero |
|---|---|
| `/` | `page.tsx` |
| 7 servicios (impreso, pulido, lavado, microcemento, autonivelantes, caucho, alicatados) | `[servicio]/page.tsx` (plantilla única) |
| `/proyectos/` + fichas | `proyectos/page.tsx`, `proyectos/[slug]/` |
| `/blog/` + artículos | `blog/page.tsx`, `blog/[slug]/` |
| `/empresa/`, `/presupuesto/` | `empresa/`, `presupuesto/` (`actions.ts` = Server Action del formulario) |
| Legales | `aviso-legal/`, `politica-de-privacidad/`, `politica-de-cookies/` (textos en `packages/content/src/legal/*.md`) |
| `/llms.txt`, `/llms-full.txt`, `/ai/[archivo]`, `/ai/servicios/[archivo]` | `llms.txt/route.ts`, `llms-full.txt/route.ts`, `ai/…/route.ts` + `src/lib/ai.ts` |
| sitemap, robots, 404, OG | `sitemap.ts`, `robots.ts`, `not-found.tsx`, `opengraph-image.jpg` |

`/llms.txt` y `/ai/*` son Markdown para IA (GEO/AEO), generado desde el contenido y la config, sin copy propio. Ficheros registrados en `ARCHIVOS_AI` (`src/lib/ai.ts`). Omiten lo pendiente (FAQ sin respuesta, artículos sin indexar: `ARTICULOS_SIN_INDEXAR` en `src/lib/datos.ts`). No van al sitemap.

## Dónde se toca cada cosa

- **NAP / claims (fuente):** `packages/content/src/data/business.ts` y `claims.ts`. Overrides por env en `@site/config` (`NEXT_PUBLIC_TELEFONO`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_DIRECCION`). Adaptadores legacy: `apps/web/src/lib/config/{nap,claims}.ts` (no renombrar su API).
- **Teléfono:** `normalizePhone` en `packages/content/src/queries/business.ts` lo deja en 9 cifras (quita espacios, puntos, guiones, paréntesis y +34/0034/34). Si no da 9 cifras se usa el valor por defecto (vacío = por defecto). La variable se pone sin +34; `tel:` y formato internacional se derivan de ahí.
- **URL canónica:** `https://www.pavivasa.com` (`packages/config/src/site.ts`). Vercel redirige el dominio sin www. Si existe `NEXT_PUBLIC_SITE_URL` manda sobre el valor por defecto y debe llevar www. Nunca escribir el host a mano.
- **Remitente del email de presupuesto:** dominio raíz (sin `www.`), derivado de `sitio.url` en `app/presupuesto/actions.ts`.
- **SEO / JSON-LD / sitemap / robots:** `@site/seo` (`packages/seo/src`); adaptador `src/lib/schema.tsx`. Sin `AggregateRating`.
- **Contenido:** `@site/content` (`packages/content/src/data`), adaptadores en `apps/web/src/content` y `src/lib/datos.ts`.
- **Analítica / consentimiento / atribución:** `@site/tracking`; UI en `components/layout/Consentimiento.tsx`; eventos por `src/lib/eventos.ts`.
- **Env vars:** esquemas en `packages/config/src/env.schema.ts` y `server-env.schema.ts`, más `globalEnv` de `turbo.json`.
- **Hero de la Home (carrusel automático):** `components/home/HeroPestanas.tsx` (`'use client'`). Zoom lento (`animate-zoom-lento-a`/`-b`, 7 s, ×1.06; dos copias idénticas porque cambiar de nombre es lo que reinicia el zoom al reactivar una foto) y fundido (`duration-fundido`, 1.2 s) definidos en `tailwind.config.ts`; los cambios en esa config exigen reiniciar `next dev`. Los tres textos van apilados en una celda de grid para que la altura no varíe (solo el activo es `<h1>`); el botón de pausa está arriba a la derecha porque en la fila de pestañas no cabe en móvil (por eso el contenido lleva `pt-16` en móvil). El zoom solo arranca tras hidratar (`listo`): si arrancara con el HTML del servidor, su `animationend` podría perderse con una hidratación lenta y el carrusel se quedaría parado. El cambio a la siguiente foto lo dispara el `animationend` del zoom (no un temporizador JS), así el botón de pausa (`animation-play-state`) congela zoom y cambio a la vez. Con `prefers-reduced-motion` no hay zoom, cambio automático ni botón. Si cambias la duración del fundido, actualiza también `FUNDIDO_MS` en el componente.
- **Tokens / fuentes:** `apps/web/tailwind.config.ts`, `src/app/globals.css`, `src/app/fuentes.ts`.
- **Redirecciones 301 / noindex:** `apps/web/next.config.ts` (`source` con barra final).
- **Zona congelada:** `apps/web/src/app/**` y `src/components/**` hasta el rediseño (ver `CLAUDE.md`).

## Cambios traídos de main

- Kit Digital eliminado del sitio y del README.
- Franja de confianza (`components/layout/BarraConfianza.tsx`) muestra «Comunidad Valenciana». La cobertura de 6 provincias sigue pendiente de confirmar (`empresa/page.tsx`, `presupuesto/page.tsx` la marcan «por confirmar»).

## Vercel (proyecto `pavivasa-web`, prescrito en README, no verificado)

Root Directory `apps/web` con «Include files outside the Root Directory»; Build Command `cd ../.. && pnpm turbo run build --filter=web`; Ignored Build Step `npx turbo-ignore web`; `ENABLE_EXPERIMENTAL_COREPACK=1`; Node 22.x (mínimo >=22.6); pnpm 9.15. Sin overrides antiguos de npm.

## Pendientes de contenido (no inventar)

- Fotos de modelos y colores del hormigón impreso: hasta tenerlas, la sección «Catálogo / Modelos y colores» de la Home está oculta (`app/page.tsx`; el componente `components/home/SeccionCatalogo.tsx` se conserva para reactivarla). La sección equivalente de las páginas de servicio (`SeccionMuestrario`) sigue visible.
- FAQ: 18 de 29 respuestas redactadas (home + 7 servicios, `packages/content/src/data/{home,services}.ts`). Son hechos técnicos genéricos sacados de resúmenes de búsqueda, sin fichas abiertas: contrastar con fabricantes/normativa. Siguen pendientes las 11 que dependen de Pavivasa: plazo de obra (home), solera/suelo existente (home, impreso), cobertura de municipios (home, alicatados), plazo de reforma de baño (microcemento), combinar lavado con impreso, y las 5 de garantía de 10 años (home, impreso, pulido, microcemento; la web no define su alcance). Sin `FAQPage` JSON-LD todavía (`schemaFAQ` no tiene llamadores).
- Artículo `hormigon-desactivado-piedra-vista`: cuerpo pendiente (original en rumano), noindex.
- WhatsApp, horario, NIF, textos legales, fotos originales a 2400 px, cobertura de 6 provincias.
- Email/NIF/razón social de los legales en conflicto con `business.ts` (ver README).

## Desviaciones conocidas vigentes

1. Rate limit del formulario por IP en memoria: no fiable entre instancias serverless.
2. `next lint` deprecado (desaparece en Next 16).
3. Slug `hormigon-pulido-alicante` corresponde a una obra en Benissa; son URL heredadas, no renombrar sin redirección.
4. Presupuesto de JS inicial de 100 KB: no verificado en el monorepo; medir tras `pnpm build`.
5. Márgenes por elemento en páginas/componentes (regla: flex/grid + gap) no auditados tras la migración; zona congelada.
6. CI nunca ejecutado en un runner real; config de Vercel sin aplicar (ver `ARCHITECTURE.md`).
