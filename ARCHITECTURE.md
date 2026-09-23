---
titulo: Arquitectura — Pavivasa
empresa: Pavivasa
dominio: pavivasa.com
repo: https://github.com/DreiSup/pavivasa_web
rama: monorepo-migration
stack: "Next.js 15 (App Router) + React 19 + Tailwind 3 + TypeScript + pnpm + Turborepo + Zod"
actualizado: 2026-09-23
estado: "migración a monorepo en curso; frontend de esta rama congelado (apps/web/src/app y src/components no se tocan aquí hasta el rediseño; el rediseño YA tiene código real en el worktree/rama diseno/nuevo-frontend, ver §1); branch no subida a origin"
fuente_de_verdad: "el código; este documento lo resume"
---

# Arquitectura — Pavivasa

> Para una IA: qué leer primero, reglas que no se rompen, dónde está cada cosa.

- **El código manda.** Si este documento, un README o `arquitectura-plantilla-monorepo.md` (fuera de este repo) dicen algo distinto de lo que hace el código, el código gana — la discrepancia debe documentarse, no "corregirse" silenciosamente en ningún lado.
- **`apps/web/src/app/**` y `apps/web/src/components/**` están congelados.** Salida pública byte-idéntica a la de antes de la migración. Un fix real ahí va a `scripts/verify/known-issues.json` con su `reason`, nunca al código, hasta que llegue el rediseño.
- **Contenido solo desde `@site/content`**, leído vía `packages/content/src/queries/*.ts` (o, desde `apps/web`, vía los adaptadores legacy de `src/lib/`) — nunca `data/*.ts` directo. No se inventa texto, dato ni cifra: lo no confirmado es `<DatoPendiente>` o un bloque `pending`.
- **Los subpaths server (`@site/config/server`, `@site/tracking/server`) nunca se importan desde un módulo alcanzable por un componente `'use client'`.** Los secretos de servidor solo salen de ahí.
- **Un export por fichero para todo módulo alcanzable desde cliente.** Dos funciones en el mismo fichero siguen arrastrando el árbol entero al bundle aunque solo se use una — hay que separar por *fichero*, no por función, y declarar `sideEffects` en el `package.json` correspondiente.
- **No renombrar contratos externos**: claves de `localStorage`/cookies (`pv-consentimiento`, `pv-attribution`, `pv-attribution-session`), nombres de eventos, nombres de variables de entorno, `trailingSlash: true`, los redirects 301, el `@id` `#negocio` del JSON-LD. Ver §10.
- **`NEXT_PUBLIC_*` se lee solo como literal exacto** (`process.env.NEXT_PUBLIC_X`, nunca `process.env[nombre]`) — es la única forma que Next sustituye en build para el bundle cliente.
- Antes de commitear: `pnpm content:validate && pnpm lint && pnpm typecheck && pnpm build && pnpm verify` (+ `pnpm verify:secrets` si se tocó tracking o env). Ver §11.

---

## 1. Resumen

Pavivasa es una empresa de pavimentos de hormigón impreso, pulido, lavado y microcemento en Valencia y Alicante (España). El repo es su sitio web de marketing/captación de leads: catálogo de 7 servicios, 15 obras realizadas, 4 artículos de blog y un formulario de presupuesto con entrega por email (Resend) y Telegram. Next.js 15 (App Router), 100% estático salvo el formulario (Server Action). El repo está en migración activa (rama `monorepo-migration`) de una app Next.js plana a un monorepo pnpm + Turborepo: la app se movió tal cual a `apps/web`, y la lógica reutilizable se está extrayendo a 4 paquetes `@site/*` (`content`, `config`, `seo`, `tracking`) consumidos hoy por `apps/web` a través de adaptadores legacy en español que se borrarán cuando llegue el rediseño visual. **El rediseño no es "sin código todavía"**: existe un segundo `git worktree` de este mismo repo en `.../pavivasa-diseno`, rama `diseno/nuevo-frontend`, con commits reales (ej. `2e9edd5`, `bd246a7`) que ya tocan la zona nominalmente congelada — `apps/web/src/app/{layout.tsx,fuentes.ts,globals.css}`, `apps/web/tailwind.config.ts`, 14 ficheros de `src/components/{contenido,datos,layout,ui}/**` y nuevos `docs/diseno/claude-design/*` (29 ficheros, ~2695 inserciones vs. `monorepo-migration`; `git diff --stat monorepo-migration...diseno/nuevo-frontend`). La rama `monorepo-migration` en sí sigue sin tocarse ahí — es un worktree/rama hermana, no un merge. CI en GitHub Actions existe pero nunca se ha ejecutado en un runner real porque la rama no está subida a `origin` (README.md:262-266).

### 1.1 Ramas / worktrees activos (no asumir que `monorepo-migration` es la única línea de trabajo)

| Rama | Último commit | Respecto a `monorepo-migration` | Qué es |
|---|---|---|---|
| `monorepo-migration` (actual) | `4f877f9` | — | Migración a monorepo pnpm/Turborepo en curso, sin subir a `origin` |
| `diseno/nuevo-frontend` | `2e9edd5` (2026-09-23-ish) | 0 commits detrás en log lineal; diverge — ver diff de arriba | Worktree separado en `.../pavivasa-diseno`; rediseño visual con código real, toca la zona "congelada" de esta rama |
| `fix/tracking-consent` | `95375a9` (2026-09-22) | 0 commits que `monorepo-migration` no tenga (`git log monorepo-migration..fix/tracking-consent` vacío) | Ya integrada/contenida en `monorepo-migration` o rama obsoleta — no hay commits exclusivos suyos |
| `main` | `9c3eabf` (2026-09-22) | 0 commits exclusivos sobre `monorepo-migration` | Rama base local, sin trabajo propio pendiente detectado |
| `origin/claude/magical-goodall-vji2mj` | `e48f8f6` (2026-09-18) | 1 commit no está en `monorepo-migration` | Rama remota con un commit propio ("Añade el mapa del frontend...") no incorporado aquí |
| `origin/diseno/pavivasa-web` | `1539f5e` (2026-09-02) | 0 commits exclusivos detectados | Remota, diseño anterior/paralelo |

Estos datos son solo `git log`/`git diff --stat` locales en el momento de escribir esto (2026-09-23) — pueden cambiar.

## 2. Mapa del repositorio

```
pavivasa/
├── package.json              # scripts raíz (turbo), único devDependency: turbo
├── pnpm-workspace.yaml        # workspaces: apps/*, packages/*
├── turbo.json                 # pipeline: transit / build / dev / lint / typecheck / content:validate
├── tsconfig.base.json         # config TS compartida (heredada por cada paquete/app)
├── .npmrc                     # auto-install-peers=true
├── .gitignore
├── README.md                  # estructura, comandos, env vars, Vercel, pendientes técnicos
├── CLAUDE.md                  # reglas de este proyecto (frontend congelado, contenido, técnica, env)
├── pnpm-lock.yaml
├── docs/
│   ├── brief-claude-design.md
│   ├── anexo-extraccion-pavivasa-com.md
│   └── referencia-globotent/
├── img/                        # 39M, IGNORADO por git — fotos originales/fuente
│   ├── NEW_LOGO.png
│   └── work/*.jpg               # lo servible vive en apps/web/public/img
├── scripts/verify/             # gate postbuild (ver §11)
├── apps/
│   └── web/                     # única app — Next.js 15
└── packages/
    ├── config/                  # env vars + config de sitio
    ├── content/                 # datos de negocio, esquemas Zod, queries
    ├── seo/                     # JSON-LD, sitemap, robots (sin dependencias declaradas)
    └── tracking/                 # GA4/Ads/Meta Pixel/CAPI, consentimiento, atribución
```

```
apps/web/
├── src/app/                    # rutas (App Router) — ver §6
│   ├── [servicio]/, blog/, blog/[slug]/, proyectos/, proyectos/[slug]/,
│   │   empresa/, presupuesto/, aviso-legal/, politica-de-cookies/,
│   │   politica-de-privacidad/, page.tsx (home), layout.tsx, fuentes.ts,
│   │   robots.ts, sitemap.ts, not-found.tsx, globals.css
│   └── apple-icon.png, favicon.ico, icon.png, opengraph-image.jpg (convención de fichero)
├── src/components/{layout,ui,datos,contenido,secciones}/
├── src/content/*  y src/lib/*   # ADAPTADORES LEGACY (API en español, ver §6)
├── public/img/                  # ~80 fotos/imágenes reales servidas en /img/<fichero>
└── next.config.ts, tailwind.config.ts, postcss.config.mjs, .eslintrc.json,
    tsconfig.json, .env.example
```

```
packages/config/                  packages/content/                 packages/seo/                    packages/tracking/
├── src/                          ├── src/                          ├── src/                          ├── src/
│   ├── index.ts (público)        │   ├── data/ (8 ficheros)         │   ├── canonical.ts               │   ├── index.ts (cliente)
│   ├── server.ts (secretos)      │   ├── queries/                   │   ├── index.ts                    │   ├── server.ts (subpath, secreto)
│   ├── env.ts / env.schema.ts    │   ├── schemas/ (*.ts + *.zod.ts) │   ├── json-ld/{business,service,   │   ├── attribution.ts
│   ├── server-env.schema.ts      │   ├── legal/ (3 .md, no leídos)  │   │   faq,article,breadcrumbs,     │   ├── click-ids.ts
│   └── site.ts                   │   └── index.ts                   │   │   area-served}.ts              │   ├── consent-mode.ts
└── scripts/check-env.ts                                              │   ├── robots.ts / routes.ts        │   ├── consent-storage.ts
                                   └── scripts/validate.ts             │   └── sitemap.ts                   │   ├── events.ts
                                                                                                              │   └── tracker-cookies.ts
```

Cada paquete tiene su propio `package.json`, `README.md` y `tsconfig.json`.

## 3. Stack y versiones

| Pieza | Versión | Fuente |
|---|---|---|
| Node.js (motor mínimo) | `>=22.6` (real local instalado: v22.21.1) | `package.json:6-8` |
| pnpm | `9.15.9` (`packageManager`) | `package.json:5` |
| Turborepo | `2.11.3` (único devDependency raíz) | `package.json:19` |
| Next.js | `15.5.22` | `apps/web/package.json:19` |
| React / React DOM | `19.0.0` | `apps/web/package.json:20-21` |
| TypeScript | `5.9.3` (apps/web y los 4 paquetes) | `apps/web/package.json:33` |
| Tailwind CSS | `3.4.19` | `apps/web/package.json:32` |
| ESLint / eslint-config-next | `9.39.5` / `15.5.22` | `apps/web/package.json:29-30` |
| PostCSS / Autoprefixer | `8.5.26` / `10.5.4` | `apps/web/package.json:31,28` |
| Zod | `3.25.76` (dependencia directa de `@site/config`, `@site/content` **y también de `apps/web`** — usada en `apps/web/src/app/presupuesto/actions.ts:3`; ausente en `@site/seo` y `@site/tracking`) | `apps/web/package.json:22` (deps propias de `apps/web`, no solo heredadas); `packages/config/package.json`; `packages/content/package.json` |
| @types/node | `22.20.1` | `apps/web/package.json:25` |
| target TS compartido | `ES2017`, `module: esnext`, `moduleResolution: bundler`, `strict: true`, `noEmit: true`, `erasableSyntaxOnly: true` | `tsconfig.base.json:1-17` |

CI (`.github/workflows/ci.yml`) fija Node 22 (`node-version: 22`) y usa `pnpm/action-setup@v6` sin versión explícita (lee `packageManager` del `package.json` — pasar ambas cosas es un error duro de esa action).

## 4. Capas y reglas de dependencia

```
┌─────────────────────────────────────────────────────────────────┐
│ apps/web/src/app/**  +  src/components/**   (CONGELADO)          │
│   Server/Client Components de Next. API en español heredada.     │
└───────────────────────────┬───────────────────────────────────────┘
                             │ importa
┌───────────────────────────▼───────────────────────────────────────┐
│ apps/web/src/lib/*  +  src/content/*        (ADAPTADORES LEGACY)  │
│   "legacy adapter, delete when the new design consumes @site/*    │
│    directly" — mismas formas/valores en español que antes         │
│   de migrar. Se borran cuando el rediseño consuma @site/* directo.│
│   Excepción: src/lib/texto.ts NO es adaptador (helper local puro,│
│   sin comentario "legacy adapter" — apps/web/src/lib/texto.ts:1-16)│
└───────┬──────────────┬──────────────┬──────────────┬──────────────┘
        │              │              │              │
   @site/content   @site/config   @site/seo     @site/tracking
   (Zod, sin React/Next) (Zod, sin React/Next) (puro, sin React/Next; (cliente: sin secretos;
                                                  sin dependencies)    server-only vía subpath)
```

Reglas verificadas en el código (no solo declaradas):

- **Ningún paquete `packages/*/src` importa `react` ni `next`** — confirmado con el regex correcto: `grep -rlE "from ['\"](react|next)" packages/*/src` no devuelve nada (exit 1). *(Ojo: `grep -rlE "from ['react'|'next']" packages/*/src` — con esa clase de caracteres mal escrita — sí devuelve ~50 ficheros, prácticamente todo `packages/*/src`, porque `['react'|'next']` es una clase de caracteres que matchea cualquier `from '...'`, no una alternancia. La afirmación de fondo es correcta; el comando citado originalmente no lo era.)* Son lógica pura (Zod, `fetch`, `node:crypto`), consumibles fuera de Next si hiciera falta.
- **Subpaths server, aislados por `exports` en `package.json`**: `@site/config` expone `"."` (`src/index.ts`, público) y `"./server"` (`src/server.ts`, secretos: `EMAIL_DESTINO`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `META_CAPI_ACCESS_TOKEN`). `@site/tracking` expone `"."` (cliente: eventos, consentimiento, atribución, cookies) y `"./server"` (Meta CAPI, `node:crypto`). Ningún módulo alcanzable por `'use client'` importa el subpath `/server` de ninguno de los dos.
- **Regla un-export-por-fichero** (encontrada empíricamente en fase 2, `packages/content/README.md:78-118`): un módulo que un componente `'use client'` importa por un solo valor, y que también exporta algo que solo necesita un componente de servidor, no se separa por función — se separa por **fichero**, con un `index.ts` reexportando cada pieza por su nombre (nunca `export * from`). Aplicada 4 veces: `content/queries/business.ts` vs `claims.ts`; `content/queries/home.ts` vs `space-names.ts`; `config/env.schema.ts` vs `env.ts`; `config/server-env.schema.ts` vs `server.ts`. Además hace falta declarar `"sideEffects"` en cada `package.json` (`false` en los 4 paquetes `@site/*`; `["**/*.css"]` en `apps/web`, porque sí importa hojas de estilo por su efecto) — sin eso el bundler no puede eliminar un módulo entero aunque nada use sus exports.
- **`@site/seo` no tiene `dependencies` en su `package.json`** (ni `zod` ni `@site/config`) — asimetría intencional frente a `content`/`config`/`tracking` (que sí declaran deps): es lógica pura sin validación propia ni acceso a contenido/config.

## 5. Paquetes

### `@site/config`

- **Responsabilidad**: variables de entorno (públicas y de servidor) y config de sitio (URL canónica, locales).
- **API pública** (`"."` → `src/index.ts`): `publicEnv` (8 lecturas literales de `NEXT_PUBLIC_*`, pasadas por `clean()` que convierte vacío/espacios a `undefined`); `site` (objeto con **solo** `url`); y, como **exports nombrados independientes** (no propiedades de `site`) — `defaultLocale: 'es'`, `supportedLocales: ['es','en','fr','de']`, `publishedLocales: ['es']`. *(`site.defaultLocale` sería `undefined`; el import correcto es `import { site, defaultLocale, supportedLocales, publishedLocales } from '@site/config'`.)*
- **Subpath `"./server"`** (`src/server.ts`): `serverEnv` — 5 lecturas planas (`EMAIL_DESTINO`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `META_CAPI_ACCESS_TOKEN`), mismo `clean()`. Import solo desde Server Actions/route handlers/`@site/tracking/server`.
- **Ficheros clave**: `env.schema.ts`/`server-env.schema.ts` (Zod, solo importados por `scripts/check-env.ts`) vs `env.ts`/`server.ts` (importan solo el *tipo* inferido, sin traer Zod al bundle cliente) — mismo patrón de separación que en `@site/content`. `site.ts`: `site.url = (publicEnv.NEXT_PUBLIC_SITE_URL ?? 'https://pavivasa.com').replace(/\/+$/, '')` — cae al hardcode en vez de fallar en producción (ver §14).
- **Scripts**: `check-env.ts` (`pnpm --filter @site/config run check-env`, corre como `prebuild` de `apps/web`, node nativo con `--experimental-strip-types`). Reglas: `FAIL_ON_MALFORMED_PUBLIC_ENV=false` y `FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION=false` — ambas hoy solo avisan, nunca rompen el build (`packages/config/scripts/check-env.ts:60,83-96`). No lee `.env*`, solo `process.env` real.

### `@site/content`

- **Responsabilidad**: única fuente de verdad de negocio (NAP, claims, servicios, proyectos, artículos, home) — hechos, no copy de diseño.
- **API pública** (`"."` único, sin subpaths): tipo `Localized<T> = { es: T; en?: T; fr?: T; de?: T }` (`es` obligatorio; nunca cae a `es` si falta otro idioma — el ítem entero se descarta); **tipos** TS (`Business`, `Claims`, `Question`, `ImageContent`, `Service`, `Project`, `Article`, `HomeContent`, vía `export type {...} from './schemas/index.ts'`, `packages/content/src/index.ts:38-61`) — **no** son objetos Zod en runtime, pese a venir de `schemas/*.ts`; los esquemas Zod reales viven aparte en los `*.zod.ts` hermanos y solo los importa `scripts/validate.ts` (nunca exportados en la API pública); datos (`data/*.ts`, 8 ficheros); queries (`queries/*.ts`, la única forma soportada de leer un dato `Localized`).
- **Ficheros clave**: `src/data/{business,claims,services,service-catalog,projects,articles,home,space-names}.ts`; `src/queries/{resolve,business,claims,services,projects,articles,home,space-names}.ts`; `src/schemas/*.ts` (tipos) + `*.zod.ts` (validación, solo usados por `scripts/validate.ts`); `src/legal/*.md` (3 ficheros, material fuente sin verificar, no leídos por ningún código — ver §14).
- **Reglas**: `resolveImage`/resto de resolvers *omiten* la clave (no la ponen a `undefined`) cuando el dato no existe, porque el RSC flight serializa distinto una clave ausente de una explícitamente `undefined` (`queries/resolve.ts:12-41`). Ningún resolver hace fallback silencioso a `es`.
- **Script**: `pnpm content:validate` → `node --experimental-strip-types scripts/validate.ts`, importa por ruta relativa (no `@site/content`, corre fuera de la resolución de webpack/Next). Ver checks en §7.

### `@site/seo`

- **Responsabilidad**: builders puros de JSON-LD, sitemap y robots a partir de datos que le pasa `apps/web` — nada de React ni Next, nada de `fetch`.
- **API pública**: `businessJsonLdId`, `buildLocalBusinessJsonLd`, `buildServiceJsonLd`, `buildFaqJsonLd`, `buildArticleJsonLd`, `buildBreadcrumbsJsonLd`, `deriveAreaServed`, `buildSitemapEntries`, `buildRobots`, `DEFAULT_ROUTES`, `buildCanonical`/`buildAlternates` (sin uso hoy, preparados para locales futuros). Barrel `index.ts` con reexports nombrados explícitos, nunca `export *`.
- **Ficheros clave**: `src/json-ld/{business,service,faq,article,breadcrumbs,area-served}.ts`, `src/robots.ts`, `src/routes.ts`, `src/sitemap.ts`, `src/canonical.ts`.
- **Reglas duras**: el orden de inserción de claves de cada builder es contrato — el toolkit de snapshot de la migración compara el `<script type="application/ld+json">` byte a byte, no un hash con claves ordenadas (`packages/seo/README.md:62-68`). `@id` del negocio: `${siteUrl}/#negocio` (español, deliberado — ver §14). `AI_CRAWLERS = ['GPTBot','OAI-SearchBot','ClaudeBot','PerplexityBot','Google-Extended','CCBot']`, cada uno con su propio grupo `allow: '/'` en `robots.txt` porque RFC 9309 hace que un user-agent con grupo propio ignore el grupo `*` por completo.

### `@site/tracking`

- **Responsabilidad**: GA4/Google Ads/Meta Pixel vía un único punto de salida (`trackEvent`), Consent Mode v2, atribución (click IDs + UTM), Meta Conversions API server-side.
- **API pública** (`"."`, cliente, sin secretos, `packages/tracking/src/index.ts`): `trackEvent`, `buildConsentBootstrapScript`, `buildMetaPixelScript`, `denyConsentUpdate`, `createConsentStore`, `DEFAULT_CONSENT_STORAGE_KEY`, `createAttributionTracker`, `DEFAULT_ATTRIBUTION_COOKIE`, `DEFAULT_ATTRIBUTION_SESSION_KEY`, `createTrackerCookieCleanup`, `DEFAULT_TRACKER_COOKIE_PREFIXES`, `isClickIdParam`, `redactClickIdsUnlessConsented`.
- **Subpath `"./server"`**: `sendMetaConversionEvent`, `buildFbcFallback`, tipo `ConversionEvent` — dentro de `packages/`, único importador de `node:crypto` y `@site/config/server`; a nivel de repo `@site/config/server` también lo importa directamente `apps/web/src/app/presupuesto/actions.ts:5` (para `serverEnv.EMAIL_DESTINO`), así que "único importador" solo es cierto con alcance `packages/*`.
- **Ficheros clave**: `src/events.ts` (único llamador real de `gtag`/`fbq`), `src/consent-mode.ts`, `src/consent-storage.ts` (clave `pv-consentimiento`, valores exactos `aceptado`/`rechazado`), `src/attribution.ts` (cookie `pv-attribution`, sessionStorage `pv-attribution-session`), `src/tracker-cookies.ts`, `src/click-ids.ts`, `src/server.ts`.
- **Reglas**: `sendMetaConversionEvent` no hace nada si `consentGranted` es falso (defensa en profundidad — el gate real está en quien la llama). Teléfono/email hasheados SHA-256 antes de mandarlos. `+34` se antepone solo si, tras limpiar el número, quedan exactamente 9 dígitos.

## 6. apps/web

### 6.1 Rutas

11 plantillas de ruta (`find apps/web/src/app -name "page.tsx"` → 11 ficheros: home, `[servicio]`, `blog`, `blog/[slug]`, `proyectos`, `proyectos/[slug]`, `empresa`, `presupuesto`, `aviso-legal`, `politica-de-cookies`, `politica-de-privacidad` — misma lista que la tabla de abajo). Un comentario del propio código (`apps/web/src/lib/schema.tsx:27`, `apps/web/src/app/layout.tsx:29`) cifra el total en **31 rutas**; esa cifra cuadra con estático(5) + servicios(7) + proyectos(15) + artículos(4) = 31 — **no incluye las 3 páginas legales**, que también existen, comparten `layout.tsx` (y por tanto el JSON-LD `LocalBusiness` global) y están todas en `noindex`. El total real de páginas publicadas es 34 (31 indexables potenciales + 3 legales noindex), de las cuales 1 artículo también es noindex (30 indexables reales).

| Ruta | Fichero | Datos (vía) | `generateStaticParams` | Indexable | JSON-LD |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | `@/lib/datos`, `@/content/home` | no (única) | sí | solo `LocalBusiness` global |
| `/[servicio]/` (7 slugs) | `src/app/[servicio]/page.tsx` | `@/lib/datos` → `@/content/servicios` | sí, `ORDEN_SERVICIOS`; `dynamicParams=false` | sí | `Service` (`schemaServicio`) |
| `/blog/` | `src/app/blog/page.tsx` | `@/lib/datos` → `@/content/articulos` | no (única) | sí | ninguno |
| `/blog/[slug]/` (4 slugs) | `src/app/blog/[slug]/page.tsx` | ídem | sí; `dynamicParams=false` | 3 de 4 (`hormigon-desactivado-piedra-vista` → `X-Robots-Tag: noindex, follow`, fuera del sitemap) | `BlogPosting` (`schemaArticulo`) + `BreadcrumbList` (Migas) |
| `/proyectos/` | `src/app/proyectos/page.tsx` | `@/lib/datos` | no (única) | sí | ninguno |
| `/proyectos/[slug]/` (15 slugs) | `src/app/proyectos/[slug]/page.tsx` | ídem → `@/content/proyectos` | sí; `dynamicParams=false` | sí | **ninguno** — sin `JsonLd`/`schema` import (ver §14, gap) |
| `/empresa/` | `src/app/empresa/page.tsx` | `@/lib/config`, `@/lib/datos` | no (única) | sí | `BreadcrumbList` (Migas) |
| `/presupuesto/` | `src/app/presupuesto/page.tsx` + `FormularioConEspacio.tsx` + `actions.ts` | — | no (única) | sí | `BreadcrumbList` (Migas) |
| `/aviso-legal/`, `/politica-de-cookies/`, `/politica-de-privacidad/` | `PlantillaLegal` compartida | — | no | **no** (`robots: {index:false}` explícito) | — |

`not-found.tsx`: 404 a medida con 3 atajos fijos (hormigon-impreso, hormigon-pulido, microcemento) + home/proyectos/presupuesto; sin fetch de datos.

### 6.2 Metadata files (convención de fichero, no generados por código)

`apple-icon.png` (1564B), `favicon.ico` (2389B), `icon.png` (4831B), `opengraph-image.jpg` (229037B, 1200×630, foto de obra real). No hay `icon.tsx`/`opengraph-image.tsx` dinámicos.

### 6.3 `layout.tsx`

Metadata global: `title.template = '%s | {nap.nombre}'`, `metadataBase = sitio.url`, un solo bloque `openGraph` compartido (deliberadamente sin `title`/`description`/`images`, porque Next sustituye `openGraph` entero por ruta, no lo fusiona — comentario en el propio fichero). `Viewport.themeColor = #EDEFEC`. Renderiza `JsonLd(schemaNegocioLocal())` global (`LocalBusiness`/`HomeAndConstructionBusiness` en todas las rutas). Monta `Cabecera`, `main`, `Pie`, `BarraMovil`, `Consentimiento`, `EventosGlobales`. 3 variables de fuente en `<html>` (`fuentes.ts`: `display`=Big Shoulders, `texto`=Barlow, `mono`=Overpass Mono).

### 6.4 Componentes (`src/components/`)

| Carpeta | Contenido |
|---|---|
| `layout/` | `Cabecera` (sticky, `'use client'`), `MenuMovil` (`'use client'`), `Pie`, `BarraMovil` (única sombra del sitio, token `barra`), `BarraConfianza`, `Logo`, `Migas` (server, sin `'use client'`; `BreadcrumbList` — ver §6.1), `Consentimiento` (`'use client'`, banner + scripts GA/Meta), `EventosGlobales` (`'use client'`, delegación global de clics `tel:`/`wa.me` + captura de atribución) — 9 ficheros en total (`ls apps/web/src/components/layout`) |
| `contenido/` | `BloquePosicion` (placeholder con trama diagonal cuando falta foto), `MuestraAcabado`, `TarjetaArticulo`, `TarjetaProyecto` (+ `EtiquetaProyecto`) |
| `datos/` | `DatoPendiente` (dato sin confirmar, nunca inventado), `EtiquetaTecnica`, `FichaObra`, `TablaFichaTecnica` |
| `secciones/` | `Acordeon` (`<details>`, sin JS), `FiltrosProyectos` (`'use client'`), `FormularioPresupuesto` (`'use client'`, `useActionState`), `IndiceAnclas`, `ListaArticulos`, `LlamadaFinal`, `PlantillaLegal`, `SeccionFAQ` (**no emite `FAQPage`** — ver §14), `SeccionMuestrario`, `SubmenuServicio` (`'use client'`) |
| `ui/` | `AntetituloSeccion`, `Boton` (3 variantes), `Campo`, `Chip`, `EnlaceEtiqueta`, `EstadoVacio`, `Seccion` (gutters 20px móvil/48px desktop, `max-width` 1344px), `useSeccionActiva` (scroll-spy) |

### 6.5 Adaptadores legacy (`src/lib/`, `src/content/`) — mapa API antigua → paquete

Todos marcados `legacy adapter, delete when the new design consumes @site/* directly` salvo `texto.ts`.

| Fichero legacy | Envuelve | Notas |
|---|---|---|
| `lib/datos.ts` | `@/content/{proyectos,servicios,articulos}` → `@site/content` | Exporta `proyectos`, `proyectoPorSlug`, `proyectosPorServicio`, `proyectosDestacados`, `proyectosSimilares`, `municipiosConObra`, `serviciosOrdenados`, `servicioPorId`, `articulos`, `articuloPorSlug`. Comentario: las páginas nunca deben importar JSON de contenido directamente. |
| `lib/tipos.ts` | `@site/content` (`getServiceCatalog('es')`) | Tipos en español idénticos a pre-migración + 5 constantes (`TECNICA_CORTA`, `NOMBRE_SERVICIO`, `RUTA_SERVICIO`, `ORDEN_SERVICIOS`, `SERVICIOS_FUERTES`) derivadas del catálogo ligero, no del contenido completo, para no arrastrar peso a componentes cliente. |
| `lib/config/{nap,claims}.ts` (+ `index.ts`) | `@site/content` (`resolveBusiness`, `getClaims`) + `@site/config` (`publicEnv`, `site`) | Split en 2 ficheros para que `claims.ts` (texto server-only) nunca se cuele en varios consumidores `'use client'` de `nap`/`sitio` (Cabecera, MenuMovil, Consentimiento). `actions.ts` **no** es uno de esos consumidores cliente — es Server Action (`'use server'`, `apps/web/src/app/presupuesto/actions.ts:1`) y su acceso a `@site/config/server` es un asunto server-only aparte, no relacionado con este split (comentario en `apps/web/src/lib/config/nap.ts:12-19`). |
| `lib/schema.tsx` | `@site/seo` | `schemaNegocioLocal`→`buildLocalBusinessJsonLd`, `schemaServicio`→`buildServiceJsonLd`, `schemaFAQ`→`buildFaqJsonLd` (sin llamadores), `schemaArticulo`→`buildArticleJsonLd`, `schemaMigas`→`buildBreadcrumbsJsonLd`. `JsonLd` (componente `<script>`) vive aquí, es el único React real del fichero. |
| `lib/attribution.ts` | `@site/tracking` (`createAttributionTracker`) | Cookie `pv-attribution`, sesión `pv-attribution-session`, gateado por `readConsentStatus()==='aceptado'`. |
| `lib/consent-status.ts` | `@site/tracking` (`createConsentStore`) | Clave `pv-consentimiento`, valores `aceptado`/`rechazado`. |
| `lib/eventos.ts` | `@site/tracking` (`trackEvent`) | `registrarEvento(nombre, opciones)` — único punto de salida hacia GA4/Ads/Meta. |
| `lib/meta-capi.ts` | `@site/tracking/server` | `enviarEventoCAPI`, server-only, llamado desde `actions.ts` con `consentGranted:true` siempre (gate ya aplicado por quien llama). |
| `lib/texto.ts` | — (helper local, **no** adaptador) | `enPalabras`, `capitalizar`, `plural` — sin comentario "legacy adapter", distinto de todos sus hermanos. |

### 6.6 `next.config.ts` (líneas exactas, 93 líneas totales)

| Bloque | Líneas | Qué hace |
|---|---|---|
| `outputFileTracingRoot` | 6 | Raíz del repo, no `apps/web` — monorepo |
| `transpilePackages` | 9 | `['@site/content','@site/config','@site/seo','@site/tracking']` — se consumen como TS fuente, sin build propio |
| `trailingSlash: true` | 11 | Fijo, "no cambiar" — una sola URL canónica por página |
| `images.formats` | 12-14 | `['image/avif','image/webp']`, sin `remotePatterns` |
| `experimental.serverActions.bodySizeLimit` | 15-19 | `'4300kb'` — deja margen sobre `FOTO_MAX_BYTES` (4 MiB) bajo el límite ~4.5 MB de Vercel |
| `headers()` | 27-34 | 1 regla: `/blog/hormigon-desactivado-piedra-vista/` → `X-Robots-Tag: noindex, follow` |
| `redirects()` | 35-90 | **31 redirects 301** (confirmado: `grep -c 'permanent:'` = 31), todos con barra final. Desglose que sí suma 31: 1 `/contacto/` → `/presupuesto/` (línea 39) + **7** rutas `/servicios/*` antiguas (`grep -c "source: '/servicios/"` = 7) + 1 alias de política de cookies + 3 alias de servicio en raíz + 15 fichas de obra en raíz → `/proyectos/<slug>/` + 4 artículos antiguos → `/blog/<slug>/` |

## 7. Modelo de contenido

### 7.1 Tipo transversal

`Localized<T> = { es: T; en?: T; fr?: T; de?: T }` — `es` obligatorio. `pickLocalized(valor, locale)` devuelve `valor.es` si `locale==='es'`, si no `valor[locale]` **sin fallback a `es`**. `pickLocalizedList` descarta cualquier ítem sin traducción para ese locale. Regla universal en todo el paquete: nunca se sustituye `es` quietamente por otro idioma — el campo queda `undefined` (omitido) o el ítem/servicio/proyecto/artículo entero se descarta.

### 7.2 Entidades

| Entidad | Campos | `Localized<T>` | Campos planos (no localizados) |
|---|---|---|---|
| `Business` | name, manager, email, phone?, whatsapp?, address?, town, postalCode, province, country, socials, whatsappMessage | solo `whatsappMessage` | resto (nombres propios/identificadores) |
| `Claims` | yearsExperience, warranty, repeatCustomers, declaredProvinces | los 3 primeros | `declaredProvinces` |
| `Question` (FAQ) | question, answer? | ambos | — |
| `ImageContent` | label, src?, alt? | label, alt | `src` (ruta de fichero) |
| `Service` (7 IDs fijos) | id, slug, number, name, shortName, summary, description, intro, introMobile, heroImage, about, applications, advantages, models, colors, specSheet?, specList?, faq, cta, flagship | la mayoría de texto | id, number, flagship |
| `Project` | slug, title, longTitle, service, town, province, district?, spaceType, model?, color?, surfaceArea?, photoYear?, executionSpecs (8 campos, todos `Localized` aunque técnicos, por uniformidad), brief, execution, images, featured | texto y specs | town, province (unión literal), surfaceArea, photoYear, featured |
| `Article` | slug, title, excerpt, service, date, dateIso, image, body (bloques tipados), closing | texto | dateIso, service, bloques `heading.id`/`projectCallout.slug` |
| `HomeContent` | hero, spaces (name+image), otherSpaceLabel, faq, printedModels, projectColors | texto | — |

Bloques de `Article.body`: `paragraph`, `heading` (con `id` ancla plano), `orderedList`, `projectCallout` (referencia por `slug` plano al proyecto — checado por `validate.ts`), `pending`. Sin MDX todavía.

### 7.3 Recuentos actuales (verificados en código)

| Dato | Cifra | Comprobación |
|---|---|---|
| Servicios | 7 (`hormigon-impreso`, `hormigon-pulido`, `hormigon-lavado`, `microcemento`, `autonivelantes`, `pavimentos-de-caucho`, `alicatados`) | `data/services.ts` + `data/service-catalog.ts` (7 entradas cada uno, mantenidas en sync a mano, validadas por `content:validate`) |
| Proyectos | 15 (3 `featured:true`) | `grep -c 'slug: {' packages/content/src/data/projects.ts` |
| Artículos | **4** (1 con `X-Robots-Tag: noindex`: `hormigon-desactivado-piedra-vista`) | `grep -c 'slug: {' packages/content/src/data/articles.ts` = 4 |
| FAQ en servicios | 24 preguntas (sin respuestas redactadas aún) | `grep -c 'question:' packages/content/src/data/services.ts` |
| FAQ en home | 5 preguntas | `data/home.ts` |
| Espacios (home) | 6 + `otherSpaceLabel` | `data/home.ts` |

### 7.4 Cómo añadir cada tipo (pasos)

| Tarea | Pasos |
|---|---|
| Nuevo servicio | Entrada en `data/services.ts` **y** entrada equivalente en `data/service-catalog.ts` → `pnpm content:validate`. **El orden de menú real en runtime NO sale de `services.ts`**: `ORDEN_SERVICIOS` (usado en Cabecera, Pie, `sitemap.ts` y `generateStaticParams` de `[servicio]`) se deriva del orden de `service-catalog.ts` vía `getServiceCatalog()` (`apps/web/src/lib/tipos.ts:39`, `ORDEN_SERVICIOS = catalogo.map(c => c.id)`). `content:validate` (`packages/content/scripts/validate.ts:88-104`) solo compara los **ids** de ambos ficheros (`Set`/`find` por id) y el conteo total — **nunca compara el orden** — así que reordenar uno sin el otro cambia el menú en silencio sin que ningún check lo detecte. |
| Nuevo proyecto | Entrada en `data/projects.ts`; `service` debe ser un `ServiceId` real; solo rellenar `executionSpecs` con datos ciertos, nunca inventar |
| Nuevo artículo | Entrada en `data/articles.ts`; bloques tipados (`paragraph`/`heading`/`orderedList`/`projectCallout`/`pending`, sin MDX); un `projectCallout.slug` debe apuntar a un proyecto real |
| Nueva foto | No hay paso documentado explícito: `src` debe ser una ruta relativa a `apps/web/public` — `content:validate` falla el build si el fichero no existe ahí; sin foto real, dejar `src`/`alt` sin definir para que la UI pinte `<BloquePosicion>` con el `label` |

`pnpm content:validate` (`packages/content/scripts/validate.ts`) corre siempre: (1) validación Zod de todas las entidades; (2) `service-catalog` y `space-names` sincronizados con sus fuentes; (3) integridad referencial (`service` de proyecto/artículo es un `ServiceId` real, `projectCallout.slug` existe); (4) slugs únicos por locale; (5) todo `src` de imagen referenciado existe bajo `apps/web/public`.

## 8. Flujos

### 8.1 Render/build

```
pnpm build (raíz)
  = turbo run build
      → build depende de [^build, ^transit, ^content:validate, content:validate]
        (content se valida con Zod ANTES de que Next construya con esos datos)
      → apps/web:build ejecuta `prebuild` (check-env) automáticamente
        (turbo invoca cada tarea vía `pnpm run <task>`, así que los hooks
        pre<script> de pnpm/npm se disparan igual que en local)
      → next build (SSG salvo /presupuesto, que tiene Server Action)
```
Con `pnpm --filter web build` a secas (sin turbo) **no** se garantiza que `content:validate` corra antes — solo la invocación vía turbo (o el Build Command de Vercel, ver §12) lo asegura.

`pnpm verify` (postbuild, no construye nada — necesita un `pnpm --filter web build` previo) recorre `apps/web/.next` con los checks a-j de §11. `pnpm verify:secrets` hace su **propio** build con valores centinela (`scripts/verify/sentinels.mjs`, mismos 5 nombres que `server-env.schema.ts`) y escanea `.next/static` + `.next/server/app` buscando nombres/valores de secreto — nunca construir esto con secretos reales.

### 8.2 Lead (formulario de presupuesto)

Server Action `enviarPresupuesto` (`app/presupuesto/actions.ts`), orden real: (1) honeypot `empresa_web` → si relleno, `estado:'descartado'` (misma pantalla de éxito, sin email/Telegram/CAPI); (2) `zod.safeParse` de campos de texto (teléfono → 9 dígitos españoles; `espacio` debe estar en `NOMBRES_ESPACIOS`; `marketing_consent` enum `aceptado`/`rechazado`, default y catch `rechazado`; IDs de clic con regex `^[\w.-]*$` máx 200; `source_page` regex `^/[\w/-]*$`); (3) chequeos manuales (municipio obligatorio en variante `completo`, checkbox de privacidad); (4) foto: JPG/PNG, máx 4 MiB (`FOTO_MAX_BYTES`, espejado en el cliente); (5) rate-limit 3/hora por IP (`x-forwarded-for`, `Map` en memoria de proceso — se resetea en cada redeploy; además, al no haber `vercel.json` ni override de runtime en el repo (`grep -rn "export const runtime" apps/web/src/app/presupuesto` no devuelve nada → build por defecto = funciones serverless de Node en Vercel), ese `Map` tampoco está garantizado a persistir/compartirse entre invocaciones concurrentes en instancias distintas — inferencia, no verificado en producción: el límite real probablemente es más débil que "3/hora"); (6) entrega por Resend (`to = serverEnv.EMAIL_DESTINO ?? nap.email`, 15s timeout) y/o Telegram (`sendMessage`, texto recortado a 4096 car. por `capTelegramText`, 8s timeout) — falla solo si **ambos** canales fallan o no están configurados; (7) si `marketing_consent==='aceptado'`, Meta CAPI (`enviarEventoCAPI`): hash SHA-256 de teléfono/email, `fbc` reconstruido como `fb.1.<ts>.<fbclid>` si no hay cookie `_fbc`, POST a `graph.facebook.com/v21.0/{pixelId}/events`, nunca bloquea el envío del lead.

Doble filtro GDPR de click-IDs: cliente (`FormularioPresupuesto.tsx`, antes de meterlos en `FormData`) **y** servidor (`redactClickIdsUnlessConsented`, defensa en profundidad ante una petición manipulada) — los UTM se envían siempre, no son identificadores.

Estados: `inicial | error | enviando | enviado | descartado`. Solo `enviado` dispara el evento de conversión cliente (`envio_formulario`, `metaEventId` = `crypto.randomUUID()` generado al montar el formulario, para deduplicar Pixel/CAPI).

### 8.3 Tracking / consentimiento

Nada de analítica/publicidad carga antes del consentimiento. `Consentimiento.tsx` lee `pv-consentimiento` en `localStorage`; si es `null`, abre el banner. Al aceptar: bootstrap Consent Mode v2 (`default` denied → `update` granted → `config`, en ese orden exacto) y carga `gtag.js` + Meta Pixel, cada uno solo si su ID de entorno existe. Al rechazar tras haber estado aceptado en esta pestaña: `denyConsentUpdate()` + `fbq('consent','revoke')` + borrado de cookies de tracking por prefijo (`_ga`,`_gid`,`_gcl`,`_fbp`,`_fbc`, en host actual y dominio registrable) + `location.reload()` (los scripts ya cargados no se pueden "desinyectar"). "Configurar cookies" reabre el banner sin desmontar los `<Script>` ya cargados (estados `estado`/`bannerOpen` separados a propósito).

Atribución: `captureLandingParams()` guarda click-IDs (`gclid`,`gbraid`,`wbraid`,`fbclid`) + UTM en `sessionStorage` (`pv-attribution-session`) al aterrizar; se promueve a cookie de primer toque `pv-attribution` (90 días, `SameSite=Lax`, `Secure` en https, **nunca se sobreescribe**) solo si ya hay consentimiento o al aceptarlo desde el banner.

Único punto de salida de eventos: `trackEvent` (`@site/tracking/events.ts`) — nadie en `apps/web` llama `gtag`/`fbq` directo. Eventos reales: `clic_llamar`, `clic_whatsapp` (delegados globalmente en `EventosGlobales.tsx` por `href`), `envio_formulario` (único con `variante` y con `adsConversion` si hay ID+label de Google Ads configurados).

### 8.4 SEO

`sitemap.ts` y `robots.ts` delegan enteramente en `@site/seo` (`buildSitemapEntries`, `buildRobots`) — ninguna regla vive en `apps/web`. `deriveAreaServed` calcula el `areaServed` del JSON-LD como el subconjunto de provincias declaradas que además tienen obra real (orden: declaradas primero, luego cualquier otra por primera aparición) — hoy reproduce exactamente `['Valencia','Alicante']`. `robots.txt` permite explícitamente a los 6 crawlers de IA listados en §5, con grupo propio cada uno (necesario por RFC 9309).

## 9. Entorno y configuración

| Variable | Tipo | Validación | Efecto si falta | Fuente |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | pública | URL absoluta si presente (opcional hoy) | Cae a `https://pavivasa.com` hardcodeado (`site.ts`); en `VERCEL_ENV=production` solo AVISA por consola, no rompe el build | `packages/config/src/env.schema.ts:18-33`, `site.ts:1-18` |
| `NEXT_PUBLIC_TELEFONO` | pública | libre | Usa el de `@site/content` (`business.ts`) | `.env.example:11` |
| `NEXT_PUBLIC_WHATSAPP` | pública | libre | Vacío hoy (no hay WhatsApp confirmado) → se muestra como `DatoPendiente` | `.env.example:13` |
| `NEXT_PUBLIC_DIRECCION` | pública | libre | Usa el de `@site/content` | `.env.example:14` |
| `NEXT_PUBLIC_GA_ID` | pública | regex `^(G\|GT\|UA)-[A-Za-z0-9-]+$` | No carga GA4 | `env.schema.ts` |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | pública | regex `^AW-\d+$` | No dispara conversión de Ads | `env.schema.ts` |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | pública | libre | Sin label, no se llama a `gtag('event','conversion',...)` | `env.schema.ts` |
| `NEXT_PUBLIC_META_PIXEL_ID` | pública | regex `^\d{5,20}$` | No carga Meta Pixel | `env.schema.ts` |
| `RESEND_API_KEY` | servidor | ninguna (opaco) | Email del lead no se envía (Telegram puede seguir funcionando) | `server-env.schema.ts:13-19` |
| `EMAIL_DESTINO` | servidor | ninguna | Cae a `nap.email` (email público del NAP) | `.env.example:19-22` |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | servidor | ninguna | Notificación Telegram no se envía | `.env.example:24-26` |
| `META_CAPI_ACCESS_TOKEN` | servidor | ninguna | `sendMetaConversionEvent` no hace nada | `.env.example:37-39` |
| `VERCEL_ENV` | la pone Vercel | — | Solo la lee `check-env` para decidir si avisar por `NEXT_PUBLIC_SITE_URL` ausente en producción | `.env.example:41-43` |

Reglas: `NEXT_PUBLIC_*` se lee solo como literal exacto (nunca `process.env[nombre]`) porque es la única forma que Next sustituye en build para el cliente. Los secretos de servidor solo se leen vía `@site/config/server`. **Toda variable nueva** que lea el código va a la vez a: el schema Zod correspondiente, `.env.example` (con comentario) y `globalEnv` de `turbo.json` — si no, turbo no invalida la cache al cambiar su valor.

## 10. Contratos externos — no renombrar

| Contrato | Valor exacto | Motivo |
|---|---|---|
| `trailingSlash` | `true` (fijo) | Una sola URL canónica por página; cambiarlo rompe todos los `source` de `redirects()` |
| Redirects 301 | 31 entradas en `next.config.ts` (líneas 38-89) | Enlaces/backlinks reales de la web WordPress anterior |
| Cookie de consentimiento | `localStorage['pv-consentimiento']` = `'aceptado'` \| `'rechazado'` | Cambiar invalida el consentimiento de visitantes recurrentes |
| Cookie/sesión de atribución | cookie `pv-attribution` (90 días) + `sessionStorage['pv-attribution-session']` | Mismo motivo |
| `@id` del negocio en JSON-LD | `${siteUrl}/#negocio` | Todo el resto de nodos JSON-LD lo referencia por `@id` |
| Nombres de campos del formulario (`FormData`) | `empresa_web`, `evento_id`, `variante`, `nombre`, `telefono`, `email`, `municipio`, `espacio`, `superficie`, `foto`, `mensaje`, `privacidad`, `marketing_consent`, `gclid`/`gbraid`/`wbraid`/`fbclid`, `utm_*`, `attribution_ts`, `source_page` | Contrato entre el componente cliente y la Server Action |
| Nombres de variables de entorno | los listados en §9 | Vercel ya está configurado con esos nombres exactos; renombrar rompe el proyecto ya desplegado |
| Nombres de eventos de conversión | `clic_llamar`, `clic_whatsapp`, `envio_formulario` (español, sin `locale`) | Posible colisión ya configurada en GA4/Google Ads Key Events — no renombrar sin confirmar primero (ver §14/§15) |

## 11. Calidad: comandos, gates, verificadores, CI, known-issues

**Comandos**: `pnpm install` · `cp apps/web/.env.example apps/web/.env.local` · `pnpm --filter web dev` (o `pnpm dev` = `turbo run dev`, todo el workspace, sin cache) · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm content:validate` · `pnpm verify` (necesita build previo) · `pnpm verify:secrets` (autocontenido).

**Gate antes de cada commit** (orden, `CLAUDE.md`): `content:validate → lint → typecheck → build → verify` (+ `verify:secrets` si se tocó tracking/env).

**Checks de `pnpm verify` (`scripts/verify/index.mjs` + `checks/*.mjs`)**:

| Check | Qué comprueba |
|---|---|
| a — sitemap+live | Toda página indexable prerenderizada está en `sitemap.xml`; toda URL del sitemap es una página real y devuelve 200 |
| b — live | Ningún `<a href>` interno lleva a 404/redirect |
| c — live | Todo redirect de `next.config.ts` resuelve a 200 en exactamente un salto |
| d — jsonld | Todo `ld+json` parsea; sin `AggregateRating`/`Review`; todo `@id` resuelve; campos obligatorios en `LocalBusiness`/`Service`/`BreadcrumbList`/`BlogPosting` |
| e — metadata | Un solo `<h1>`; `title`/`description` no vacíos y únicos; canonical absoluto con barra final; `og:url` presente |
| f — robots | `robots.txt` existe y referencia el sitemap; ningún crawler de IA listado está bloqueado (semántica RFC 9309 de coincidencia más larga) |
| g/h — images-cta | Todo `<img>` tiene `alt` (vacío = nota informacional) y dimensiones/`fill`; al menos un `tel:` y un `wa.me` por página |
| i — secrets-scan | Sin nombres/valores de secreto en `.next/static` ni `.next/server/app` (solo vía `verify:secrets`) |
| j — page-count | El nº de páginas indexables debe ser **al menos** el esperado a partir de `@site/content` (nunca cero, nunca por debajo); un build con *más* páginas indexables que las esperadas pasa igual — no exige igualdad (`scripts/verify/checks/page-count.mjs:65,72`) |

**`known-issues.json`**: allowlist por `(check, code, route, detail)`; lo que no coincide con una entrada sigue rompiendo el build. Hoy 2 entradas, ambas `metadata`/`duplicate-title`, por colisión de contenido pre-existente en `data/projects.ts`:
- `/proyectos/hormigon-impreso-calpe-2/` (dos obras distintas en Calpe con el mismo título generado)
- `/proyectos/hormigon-pulido-benissa/` (el proyecto `hormigon-pulido-alicante` tiene `town:'Benissa'`, colisiona con el proyecto real `hormigon-pulido-benissa`)

No se arreglan aún porque la salida pública debe seguir byte-idéntica durante la migración. Una entrada que deja de dispararse se reporta "stale": `index.mjs` solo informa; `secrets-scan.mjs` sí falla el run si una entrada `secrets` queda stale.

**CI** (`.github/workflows/ci.yml`, un solo job): `actions/checkout@v7` → `pnpm/action-setup@v6` (sin versión, lee `packageManager`) → `actions/setup-node@v7` (Node 22) → `pnpm install --frozen-lockfile` → `pnpm content:validate` → `pnpm lint` → `pnpm typecheck` → `pnpm --filter web build` → `pnpm verify` → `pnpm verify:secrets`. **Sin paso de deploy** — Vercel despliega por su integración Git propia; un CI en rojo no bloquea el despliegue salvo que se configure aparte (deployment gating de Vercel o branch protection de GitHub). **Nunca se ha ejecutado en un runner real**: la rama `monorepo-migration` no está subida a `origin` (README.md:262-266) — todo lo anterior está razonado, no verificado en verde.

## 12. Despliegue

Proyecto Vercel `pavivasa-web`. Todo lo siguiente está **prescrito en el README, no aplicado ni verificado** (README.md:131-177):

| Ajuste | Valor |
|---|---|
| Root Directory | `apps/web`, con "Include files outside the Root Directory" activado |
| Build Command (override manual) | `cd ../.. && pnpm turbo run build --filter=web` — necesario para que `content:validate` se ejecute antes del build (un `pnpm --filter web build` a secas se lo saltaría) |
| Ignored Build Step | `npx turbo-ignore web` |
| Corepack | `ENABLE_EXPERIMENTAL_COREPACK=1` (para que respete `packageManager: pnpm@9.15.9`) |
| Node.js Version | 22.x |
| Variables de entorno | mismas que local, mismos nombres, sin cambios; 4 marcadas "sensitive" en el README: `EMAIL_DESTINO`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `META_CAPI_ACCESS_TOKEN` (README.md:102-106). `TELEGRAM_CHAT_ID` es la única variable de servidor **sin** "sensitive". El README no documenta scoping Preview/Production de las `NEXT_PUBLIC_*` en Vercel — no hay fuente en el repo para eso. |
| Gate CI→deploy | No existe: Vercel despliega aunque CI no haya corrido o esté en rojo |

Entrega real de leads (Resend/Telegram con credenciales reales) **nunca probada de extremo a extremo** — `verify:secrets` solo prueba que valores centinela no se filtran, con peticiones que fallan a propósito (401/403).

## 13. Idiomas

Estado actual: solo `es` publicado (`publishedLocales: ['es']` en `@site/config/site.ts`); `supportedLocales` ya incluye `en`/`fr`/`de` a nivel de tipo, y todo el contenido ya es `Localized<T>`, pero no hay `app/[locale]/`, `next-intl` ni middleware de locale — deliberadamente aplazado a la fase de rediseño (§14/§15). `buildCanonical`/`buildAlternates` de `@site/seo` existen mas no se llaman desde ningún sitio en `apps/web` hoy.

## 14. Decisiones y desviaciones respecto a la plantilla

Referencia normativa: *arquitectura-plantilla-monorepo.md* (documento fuera de este repo). Su propio §15 ("Cómo quedó en la práctica") ya declara las desviaciones deliberadas; esta tabla las repite y añade las que no estaban documentadas ahí.

| Área | Plantilla dice | Código hace | Estado |
|---|---|---|---|
| `@id` del negocio (§7) | `<url>/#business` | `${siteUrl}/#negocio` (español) | Deliberado, "kept exactly" para igualar la web pre-migración. El comentario del código cita "§9" para justificarlo, pero en la numeración actual del documento §9 es "Configuración y entorno" — la referencia cruzada está desactualizada (debería ser §7). |
| Nombres de eventos (§8) | `phone_call`, `whatsapp_click`, `form_submit`, todos con `variante` y `locale` | `clic_llamar`, `clic_whatsapp`, `envio_formulario`, en español, sin `locale` en ninguno; solo `envio_formulario` lleva `variante` | Deliberado y documentado en README/§15, bloqueado hasta confirmar si GA4/Ads Key Events ya referencian los nombres en español |
| Atributos de tracking en enlaces (§8) | `data-cta="phone"|"whatsapp"` + `data-ubicacion` en cada `tel:`/`wa.me` | No implementado: `EventosGlobales.tsx` detecta por `href.startsWith('tel:')`/`href.includes('wa.me')`, sin esos atributos | No documentado en el repo como desviación explícita — gap real frente a §8 |
| `NEXT_PUBLIC_SITE_URL` en producción (§9) | Obligatoria; si falta, el build falla | Cae al hardcode `https://pavivasa.com`; `check-env` solo avisa (`FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION=false`) | Pendiente de decisión, autodocumentado en comentarios del propio código |
| Gate CI→deploy (§11) | "Vercel solo despliega si pasa" CI | Vercel despliega vía Git integration sin depender del resultado de CI | No implementado; no hay branch protection ni deployment gating configurados |
| Idiomas (§4 del plan) | `app/[locale]/` con next-intl en la fase de idiomas | Aplazado al rediseño; contenido ya multidioma, enrutado no | Deliberado, §15 |
| Adaptadores legacy en español (§13, "renombrado a inglés") | Identificadores nuevos en inglés | `apps/web/src/lib/*` y `src/content/*` mantienen su API en español intacta | Deliberado — se borran cuando el rediseño consuma `@site/*` directo |
| Artículos como MDX | (no explícito, pero es lo esperado a futuro) | Bloques tipados, sin MDX todavía | Deliberado, §15 |
| Lighthouse CI (§11) | Incluido en el gate de calidad | No implementado | Declarado como pendiente en el propio §15 |

Notas que **no** son discrepancias (evaluadas y descartadas): `engines.node >=22.6` es un suelo, no entra en conflicto con Node 22.x fijado en CI/Vercel; que `@site/seo` no declare `dependencies` es asimetría intencional (lógica pura), no un error.

## 15. Pendientes y decisiones abiertas

| Pendiente | Detalle | Fuente |
|---|---|---|
| Conflicto de identidad legal | `packages/content/src/legal/*.md` da email `pavialbufera@gmail.com`, razón social "GABRIEL CRISTINEL NEAMTU" y NIF `X9252734H`, ninguno presente en `data/business.ts` (email `gabriel.pavivasa@gmail.com`, sin NIF). Las páginas legales reales no leen esos `.md` (renderizan NAP de `business.ts` + bloques `[pendiente]`) — el dato vivo hoy es el de `business.ts`. Sin resolver, pendiente de confirmación del cliente | `packages/content/src/legal/README.md:11-21`; README.md:221-226 |
| FAQ sin respuestas | Todas las preguntas de servicios/home tienen `question` pero no `answer` → `buildFaqJsonLd` no puede emitir `FAQPage` real hasta que se redacten | README.md:227-230 |
| Política de cookies incompleta | `/politica-de-cookies/` es `[pendiente]`; no lista aún `pv-consentimiento`, `pv-attribution`, `pv-attribution-session` ni las cookies de GA/Meta | README.md:231-236 |
| Renombrado de eventos | Bloqueado hasta confirmar si GA4/Ads ya referencian los nombres en español; además `variante` hoy significa "variante de formulario" (corto/completo), no "variante de A/B", colisión de nombre a resolver a la vez | README.md:241-261 |
| CI nunca ejecutado en runner real | Rama no subida a `origin` | README.md:262-266 |
| Config de Vercel sin aplicar/probar | Toda la sección §12 de este documento es prescriptiva | README.md — sección Vercel |
| Entrega de leads sin probar end-to-end | Resend/Telegram nunca probados con credenciales reales | README.md — Pendientes técnicos |
| `NEXT_PUBLIC_SITE_URL` en producción | Decidir si debe hacer fallar el build (como pide la plantilla) o seguir avisando | `packages/config/src/site.ts:10-15` |
| Gap de JSON-LD en `/proyectos/[slug]/` | Única ruta de detalle de contenido sin structured data (`Service`/`Article` sí lo tienen); no documentado como intencional | `apps/web/src/app/proyectos/[slug]/page.tsx` |
| `schemaFAQ` código muerto | `buildFaqJsonLd`/`schemaFAQ` existen pero no tienen ningún llamador — `SeccionFAQ`/`Acordeon` renderizan visualmente sin emitir `FAQPage` | grep sin resultados en `apps/web/src` |

## 16. Cómo trabajar en este repo

| Tarea típica | Ficheros a tocar | Comando de verificación |
|---|---|---|
| Añadir proyecto | `packages/content/src/data/projects.ts` | `pnpm content:validate` |
| Añadir servicio | `packages/content/src/data/services.ts` + `data/service-catalog.ts` | `pnpm content:validate` |
| Cambiar teléfono/dirección | Nunca hardcodear: `packages/content/src/data/business.ts` (fuente) o `NEXT_PUBLIC_TELEFONO`/`NEXT_PUBLIC_DIRECCION` (override) | `pnpm build` |
| Cambiar copy del banner de cookies | `apps/web/src/components/layout/Consentimiento.tsx` — **está dentro de la zona congelada**: un fix real va a `scripts/verify/known-issues.json` con `reason`, no edición directa, hasta el rediseño | — |
| Añadir un redirect 301 | `apps/web/next.config.ts`, array `redirects()`, `source` con barra final | `pnpm verify` (check c) |
| Añadir variable de entorno | Schema Zod correspondiente (`packages/config/src/env.schema.ts` o `server-env.schema.ts`) + lectura en `env.ts`/`server.ts` + `apps/web/.env.example` + `globalEnv` de `turbo.json` | `pnpm build` |
| Cambiar un campo de JSON-LD | `packages/seo/src/json-ld/*.ts` — preservar orden exacto de claves (byte-identidad) y el `@id` `#negocio` | `pnpm verify` (check d) |
| Añadir una página nueva | `apps/web/src/app/**` está congelado — solo permitido como parte de/tras el rediseño; hasta entonces, cualquier fix real va a `known-issues.json` | — |
| Sustituir el frontend por el rediseño nuevo | `apps/web/src/app/**` y `src/components/**` dejan de estar congelados; se reconstruyen consumiendo `@site/content`/`@site/seo`/`@site/tracking`/`@site/config` directo; se borran los adaptadores legacy de `src/lib/` y `src/content/`; el nuevo diseño debe conservar las mismas claves/valores de consentimiento y atribución (§10); el enrutado de locale (`app/[locale]`, next-intl, middleware) se hace en esta misma fase. **Ya existe trabajo real en marcha**: worktree `.../pavivasa-diseno`, rama `diseno/nuevo-frontend` (ver §1.1) — revisar/coordinar con ese trabajo antes de empezar desde cero | `pnpm verify` completo + comparación de snapshot de build |

## 17. Referencias

- `README.md` — estructura, comandos, tabla de env vars, Vercel, pendientes técnicos
- `CLAUDE.md` — reglas del proyecto (frontend congelado, contenido, técnica, idioma del código, env)
- `packages/config/README.md`, `packages/content/README.md`, `packages/seo/README.md`, `packages/tracking/README.md`
- `apps/web/README.md`
- `scripts/verify/README.md` — detalle de checks a-j, `known-issues.json`, `verify:secrets`
- `docs/brief-claude-design.md`, `docs/anexo-extraccion-pavivasa-com.md`, `docs/referencia-globotent/`
- *arquitectura-plantilla-monorepo.md* (fuera de este repo) — plantilla normativa; su §15 es la lista canónica de desviaciones deliberadas
- *SEO-Local-Contexto-Claude-Code.md* (fuera de este repo) — reglas SEO heredadas (NAP único, anti-doorway, CWV)
- `migracion-monorepo/RUNBOOK.md` (fuera de este repo) — proceso de migración reutilizable
- Notas de Obsidian del negocio (contexto only, el repo es la fuente de verdad): carpeta `pavivasa` en el vault `Alexandrina`
