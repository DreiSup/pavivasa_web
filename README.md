# Pavivasa — web

Sitio de Pavivasa en Next.js 15 (App Router), React 19, Tailwind 3 y TypeScript,
en un monorepo pnpm + Turborepo. Misma arquitectura que pavimentos-albufera.com
(NAP único, formulario de presupuesto con Server Action, consentimiento RGPD,
tracking hacia GA4, Google Ads y Meta Pixel/CAPI por variables de entorno), con
el sistema visual y las nueve pantallas del canvas de Claude Design
(`docs/brief-claude-design.md` y `docs/anexo-extraccion-pavivasa-com.md` son su
origen). Ver `arquitectura-plantilla-monorepo.md` (fuera de este repo) para la
plantilla que sigue.

## Arranque

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # rellenar lo que haya
pnpm --filter web dev
```

## Comandos

```bash
pnpm dev                # turbo run dev
pnpm build              # turbo run build; debe pasar sin warnings antes de cada commit
pnpm lint               # turbo run lint
pnpm typecheck          # turbo run typecheck
pnpm content:validate   # valida packages/content con Zod (referencias, formas)
pnpm verify             # verificadores postbuild sobre apps/web/.next — ver scripts/verify/README.md
pnpm verify:secrets     # comprueba que ningún secreto de servidor llega a la salida pública (bundle cliente + HTML/RSC)
```

`verify` necesita un build previo (`pnpm --filter web build`); no construye
nada por sí mismo. `verify:secrets` sí construye por su cuenta: hace su
propio build con valores centinela para los secretos de servidor (leídos de
`scripts/verify/sentinels.mjs`, fuente única de esos valores) y luego
escanea — ver `scripts/verify/README.md`.

Gates antes de cada commit: `content:validate` → `lint` → `typecheck` →
`build` → `verify` (y `verify:secrets` si se tocó algo de tracking/env).

## Estructura

```
apps/web/                  Next.js — única app
  src/app/                 rutas: home, [servicio] (7), proyectos + [slug] (15), empresa,
                            presupuesto, blog + [slug] (4), legales, 404, sitemap, robots
  src/components/           layout · ui · datos · contenido · secciones (mismos nombres que el brief)
  src/content/, src/lib/    adaptadores legacy — ver "Adaptadores legacy" más abajo
  public/img/               fotos del negocio (@site/content las referencia por ruta /img/<archivo>)
packages/
  content/    @site/content   hechos del negocio: NAP, servicios, proyectos, artículos, home, FAQ
  seo/        @site/seo       JSON-LD, sitemap, robots, canonical/alternates
  tracking/   @site/tracking  consentimiento, atribución, eventos; subpath /server para Meta CAPI
  config/     @site/config    env público/servidor, URL del sitio, locales
scripts/verify/             verificadores postbuild permanentes (no confundir con el toolkit de
                            migración `buildcheck`, que solo existe en el scratchpad de la sesión)
```

Cada `packages/*` tiene su propio README con más detalle.

## Cómo añadir…

Todo el contenido real vive en `packages/content/src/data/*.ts` y se lee solo
a través de `packages/content/src/queries/*.ts` (nunca importar `data/`
directamente desde `apps/web`). Después de cualquier cambio de contenido:
`pnpm content:validate`.

- **Un servicio**: entrada en `data/services.ts` (en orden de menú) + entrada
  correspondiente en `data/service-catalog.ts` (los mantiene sincronizados
  `content:validate`, no se derivan uno de otro en runtime — ver el comentario
  de ese archivo).
- **Un proyecto**: entrada en `data/projects.ts`. `service` debe ser un
  `ServiceId` real. Solo rellenar los campos de `executionSpecs` que se sepan
  con certeza; nunca inventar un valor.
- **Un artículo**: entrada en `data/articles.ts`. El cuerpo son bloques
  tipados (`paragraph`, `heading`, `orderedList`, `projectCallout`,
  `pending`) — todavía no hay MDX.
- **Una foto**: el archivo va a `apps/web/public/img/` (no está congelado;
  solo `src/app/**` y `src/components/**` lo están); luego se referencia por
  ruta (`/img/<archivo>.jpg`) desde `src`/`alt` en el contenido. Mientras no
  haya `src`, la pieza se pinta como `BloquePosicion` (trama + etiqueta).

Todo campo de texto que lee el visitante es `Localized<T>` (`{ es, en?, fr?,
de? }`, `es` obligatorio) — ver "The `Localized<T>` rule" en el README de
`@site/content`.

## Variables de entorno

Ver `apps/web/.env.example` (todas las que lee el código, con comentario).
Resumen:

| Variable | Ámbito | Qué hace | Dónde se pone en Vercel |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | pública | Origen absoluto para canonical, sitemap, JSON-LD, `og:url`. Sin ella cae al valor fijo `https://pavivasa.com` en `@site/config/site.ts`. | Project → Settings → Environment Variables, entorno Production (y Preview si se quiere un dominio distinto ahí) |
| `NEXT_PUBLIC_TELEFONO` | pública | Sobrescribe el teléfono publicado en `@site/content`. Vacío = usa el de `business.ts`. | igual |
| `NEXT_PUBLIC_WHATSAPP` | pública | Número de WhatsApp del NAP. Aún no existe (pendiente del cliente); vacío se muestra como `DatoPendiente`. | igual |
| `NEXT_PUBLIC_DIRECCION` | pública | Sobrescribe la dirección publicada. | igual |
| `NEXT_PUBLIC_GA_ID` | pública | ID de GA4/Google tag (`G-…`). Sin valor, no se carga GA4. | igual |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | pública | ID de conversión de Google Ads (`AW-…`). | igual |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | pública | Label de conversión de Google Ads para el lead del formulario. | igual |
| `NEXT_PUBLIC_META_PIXEL_ID` | pública | ID numérico del Meta Pixel. | igual |
| `EMAIL_DESTINO` | servidor | Destino real del email del formulario de presupuesto (leído en `app/presupuesto/actions.ts`). Independiente del email público del NAP: si no se define, el envío cae a `nap.email` (el de `@site/content`), pero nunca al revés — el email público nunca cambia por esta variable. | igual, marcar "sensitive" |
| `RESEND_API_KEY` | servidor | API key de Resend para enviar el email del formulario. | igual, marcar "sensitive" |
| `TELEGRAM_BOT_TOKEN` | servidor | Token del bot de Telegram que recibe el aviso de lead. | igual, marcar "sensitive" |
| `TELEGRAM_CHAT_ID` | servidor | Chat de Telegram que recibe el aviso. | igual |
| `META_CAPI_ACCESS_TOKEN` | servidor | Token de Meta Conversions API (envío server-side, `@site/tracking/server`). | igual, marcar "sensitive" |
| `VERCEL_ENV` | la pone Vercel | La define Vercel automáticamente (`production`/`preview`/`development`); `check-env` la lee para avisar si falta `NEXT_PUBLIC_SITE_URL` en producción. No configurar a mano. | no aplica |

"Pública" = `NEXT_PUBLIC_*`, leída también en el navegador (Next.js la
inyecta en build solo si aparece como literal `process.env.NEXT_PUBLIC_X`).
"Servidor" = solo se lee en Server Actions/route handlers, nunca llega al
bundle cliente.

**Aplicación de `NEXT_PUBLIC_SITE_URL` en producción**: hoy, si falta en un
deploy con `VERCEL_ENV=production`, `check-env` (el `prebuild` de `apps/web`)
**avisa por consola** pero no rompe el build — cae al valor fijo del
fallback. Está así en espera de que el usuario decida si debe fallar el
build en ese caso; el interruptor de una línea está documentado en
`packages/config/scripts/check-env.ts` (`FAIL_IF_SITE_URL_MISSING_IN_PRODUCTION`).

**Formato inválido en una variable pública** (`NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, o
`NEXT_PUBLIC_SITE_URL` con una URL no absoluta): igual, **avisa por consola**
por defecto y no rompe un deploy de producción — interruptor de una línea en
`packages/config/scripts/check-env.ts` (`FAIL_ON_MALFORMED_PUBLIC_ENV`).
`server-env.schema.ts` no valida formato en los secretos de servidor hoy
(son opacos: este paquete no puede saber si un valor real es válido) — si
alguna vez se le añade una comprobación de formato, esa sí rompería el
build siempre, sin interruptor.

## Vercel — configuración del monorepo

Al conectar (o revisar) el proyecto `pavivasa-web` en el dashboard de Vercel:

1. **Root Directory** → `apps/web`.
2. **Include files outside the Root Directory** → activado (para que llegue
   `pnpm-lock.yaml`, `turbo.json`, `pnpm-workspace.yaml` y `tsconfig.base.json`
   de la raíz del monorepo).
3. **Build Command** → override manual a `cd ../.. && pnpm turbo run build --filter=web`
   (con Root Directory en `apps/web`, el Build Command por defecto de Vercel
   correría dentro de esa carpeta; hace falta subir a la raíz para invocar
   turbo). Así el build pasa por `turbo.json`, cuya tarea `build` depende de
   `content:validate` — con `pnpm --filter web build` a secas (sin turbo)
   `content:validate` **no** corre antes del build, así que el override de
   turbo es lo que hace que un dato de contenido inválido bloquee el deploy
   igual que bloquea CI. (`check-env` sí corre en ambos casos sin necesitar
   este override: está wireado como el `prebuild` de `apps/web`, y tanto
   `pnpm run build` como `turbo run build` disparan ese hook — turbo invoca
   cada tarea a través de `pnpm run`, no la reimplementa.) **Install
   Command** puede quedarse en el default (`pnpm install`); revisar que no
   queden overrides antiguos de cuando el repo era una app plana con npm
   (`npm install`/`npm run build`) — si están fijados a mano sobreviven a
   este cambio de Root Directory y rompen el build.
4. **Ignored Build Step** → `npx turbo-ignore web`: salta el build en un
   deploy cuyo commit no tocó `apps/web` ni ninguno de los `packages/*` de
   los que depende (turbo calcula el grafo de dependencias solo, no hace
   falta listar paths a mano).
5. **Corepack / versión de pnpm** → activar la variable de entorno
   `ENABLE_EXPERIMENTAL_COREPACK=1` en el proyecto para que Vercel use
   Corepack y respete la versión fijada en `packageManager`
   (`pnpm@9.15.9`) en vez de la que trae su imagen por defecto.
6. **Node.js Version** del proyecto → 22.x (mínimo real: `>=22.6`, igual que
   `engines.node` en el `package.json` raíz — `check-env` y
   `content:validate` corren con `node --experimental-strip-types`, una
   flag de Node ≥ 22.6).
7. Variables de entorno: las mismas que en local (tabla de arriba), sin
   cambios de nombre.

## CI

`.github/workflows/ci.yml` corre en cada push/PR: instala con
`--frozen-lockfile`, `content:validate`, `lint`, `typecheck`, `build`,
`verify`, y un segundo build + `verify:secrets` con valores centinela para
los secretos de servidor. No hay paso de deploy: Vercel despliega solo por
su integración de Git; para que un CI en rojo bloquee la promoción hace
falta configurarlo aparte (deployment gating en Vercel, o un check de
branch protection en GitHub) — ver el comentario final de `ci.yml`.

## Adaptadores legacy

`apps/web/src/lib/config/`, `src/lib/datos.ts`, `src/lib/tipos.ts`,
`src/lib/schema.tsx`, `src/lib/eventos.ts`, `src/lib/meta-capi.ts`,
`src/lib/consent-status.ts`, `src/lib/attribution.ts` y `src/content/*` son
adaptadores: mismas formas y valores en español que antes de la migración a
monorepo, pero ahora leyendo de `@site/content`, `@site/seo`,
`@site/tracking` y `@site/config` por debajo. Cada uno lleva el comentario
`legacy adapter, delete when the new design consumes @site/* directly` — se
borran cuando el rediseño consuma los paquetes `@site/*` directamente en vez
de pasar por estas capas de compatibilidad (`src/lib/texto.ts` es la
excepción: un helper puro de formato de texto, sin envolver ningún `@site/*`,
así que no lleva esa etiqueta). Hasta entonces, **no tocar**
`apps/web/src/app/**` ni `apps/web/src/components/**` (están congelados;
salida pública debe seguir siendo idéntica).

Dos de ellos — `src/lib/consent-status.ts` (`'aceptado'`/`'rechazado'`,
clave `pv-consentimiento`) y `src/lib/attribution.ts` (`pv-attribution` /
`pv-attribution-session`) — configuran las factorías genéricas de
`@site/tracking` con las claves y valores exactos que este sitio siempre ha
persistido. Se borrarán igual que el resto cuando el rediseño llegue, pero
lo que los sustituya tiene que configurar esas mismas factorías con esas
mismas claves y valores: cambiarlos invalida el consentimiento/atribución
guardado de un visitante recurrente.

## i18n

El contenido ya está localizado (`Localized<T>` en `@site/content`, con `es`
obligatorio y `en`/`fr`/`de` opcionales), pero solo `es` está publicado hoy
(`publishedLocales` en `@site/config`). El enrutado por idioma (`app/[locale]`,
`next-intl`, middleware) queda **deliberadamente fuera de esta migración**:
se hace en la fase de rediseño, junto con las rutas nuevas.

## Pendiente del cliente

WhatsApp (`NEXT_PUBLIC_WHATSAPP`), horario, fotos originales a 2400 px,
logotipos del Kit Digital, textos legales y NIF, respuestas de las FAQ,
confirmación de la cobertura por provincias y reescritura del artículo de
piedra vista (original en rumano).

## Pendientes técnicos conocidos

- **Email/NIF/razón social en conflicto**: `packages/content/src/legal/*.md`
  (textos legales sin verificar) dan un email (`pavialbufera@gmail.com`) y
  una razón social/NIF distintos de `packages/content/src/data/business.ts`
  (`gabriel.pavivasa@gmail.com`, sin NIF). No se resuelve solo: hace falta
  que el cliente confirme cuál es correcto — ver
  `packages/content/src/legal/README.md`.
- **FAQ sin respuesta**: las preguntas de `home.ts`/`services.ts` (`faq`)
  solo tienen `question`; no hay `answer` todavía, así que `@site/seo`'s
  `buildFaqJsonLd` no puede generar `FAQPage` real hasta que el cliente las
  redacte.
- **Cookie `pv-attribution` sin listar**: la política de cookies
  (`/politica-de-cookies/`) es hoy texto `[pendiente]` en su totalidad — no
  lista ninguna cookie real (`pv-consentimiento`, `pv-attribution`,
  `pv-attribution-session`, ni las de GA/Meta una vez haya consentimiento).
  Cuando se redacte el texto legal definitivo, `pv-attribution` tiene que
  quedar listada.
- **Títulos duplicados**: dos pares de proyectos con títulos generados
  idénticos — documentados con su `reason` en `scripts/verify/known-issues.json`,
  no corregidos aquí porque la salida pública debe permanecer byte-idéntica
  durante esta fase.
- **Nombres de evento en español, sin `locale`** (`clic_llamar`,
  `clic_whatsapp`, `envio_formulario` en `apps/web/src/lib/eventos.ts`,
  `components/layout/EventosGlobales.tsx` y
  `components/secciones/FormularioPresupuesto.tsx`): §8 de
  `arquitectura-plantilla-monorepo.md` pide los mínimos `phone_call`,
  `whatsapp_click`, `form_submit`, todos con `locale`. **Pendiente de que el
  cliente confirme** si los Key Events ya dados de alta en GA4/Google Ads
  usan los nombres en español actuales (entonces se corrige el documento) o
  los del documento en inglés (entonces se renombran, añadiendo `locale`) —
  renombrar sin esa confirmación rompería el Key Event/conversión ya
  configurado, un contrato externo. No se toca aquí: son
  `apps/web/src/components/**`, frontend congelado hasta el rediseño (un fix
  real ahí no tiene issue de `scripts/verify` que lo detecte, así que no
  encaja en `known-issues.json`; queda documentado aquí en su lugar). De
  paso, si se renombra: `variante` en el `params` de `envio_formulario` hoy
  es la variante del formulario (`corto`/`completo`), no la `variante` de
  A/B del §5 — decidir el nombre de ese parámetro a la vez que el de los
  eventos, para no colisionar cuando el A/B (§5) se implemente.
- **CI nunca ejecutado en un runner real**: `.github/workflows/ci.yml` no
  existe en `origin/main` y la rama de esta migración no está en `origin`
  todavía — todo lo que aquí se documenta como "verde" (`content:validate`,
  `lint`, `typecheck`, `build`, `verify`, `verify:secrets`) se ha probado en
  local, nunca dentro de la infraestructura real de Actions. Pendiente de
  que el cliente/usuario haga push (o abra PR) y confirme el job en verde
  ahí.
- **Configuración de Vercel sin aplicar ni probar**: la sección "Vercel —
  configuración del monorepo" de abajo es prescriptiva; nadie la ha
  aplicado todavía contra un proyecto Vercel real, y el Build Command exacto
  que Vercel ejecutaría (`cd ../.. && pnpm turbo run build --filter=web`,
  con Root Directory recortado) nunca se ha probado — solo se ha probado
  `pnpm --filter web build` directo. Pendiente de que el cliente/usuario lo
  aplique en el dashboard y dispare un deploy (o Preview) real.
- **Entrega real de Resend/Telegram sin probar**: `verify:secrets` usa
  valores centinela (`scripts/verify/sentinels.mjs`) precisamente para que
  la petición a Resend/Telegram falle (401/403) sin llegar al camino de
  éxito — comprueba que no hay fuga de secretos, no que el email o el
  aviso de Telegram lleguen de verdad. Pendiente de que el cliente/usuario
  rellene credenciales reales en un entorno de prueba y envíe el formulario
  una vez para confirmarlo end-to-end.
