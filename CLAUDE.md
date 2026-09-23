# CLAUDE.md — Pavivasa

Monorepo pnpm + Turborepo. Web de Pavivasa en Next.js 15 (App Router) +
Tailwind, en `apps/web`, sobre paquetes `@site/*` (`content`, `seo`,
`tracking`, `config`). Ver `README.md` para estructura y comandos, y
`arquitectura-plantilla-monorepo.md` (fuera de este repo) para la plantilla
normativa que sigue todo esto.

## Reglas de este proyecto

**Frontend congelado**

- `apps/web/src/app/**` y `apps/web/src/components/**` no se tocan mientras
  no llegue el rediseño nuevo. La salida pública tiene que seguir siendo
  byte-idéntica a la de antes de esta fase. Un fix real ahí va a
  `scripts/verify/known-issues.json` con su `reason`, no al código.
- Los adaptadores legacy de `apps/web/src/lib/` y `src/content/` (marcados
  `legacy adapter, delete when the new design consumes @site/* directly`) se
  borran cuando el rediseño consuma `@site/*` directamente. Hasta entonces,
  mismas formas y valores en español que antes de migrar — no renombrar ni
  "limpiar" su API aunque parezca redundante.

**Diseño** (vigente hasta el rediseño; entonces lo reemplaza el nuevo canvas)

- Tokens en `apps/web/tailwind.config.ts` y `apps/web/src/app/globals.css`.
  Cambiar valores, no nombres. No añadir colores fuera de la paleta.
- `border-radius: 0` en todo. Una sola sombra: la barra fija de móvil.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88.
- Tres familias: display, texto y datos (monoespaciada). Suelo de la mono:
  10 px.
- Color de acento (`pigmento`): un CTA primario y el estado activo por
  pantalla. Nada más.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.

**Contenido**

- Copy solo de `@site/content` (`packages/content/src/data/*.ts`), leído a
  través de `src/queries/*.ts` — nunca `data/` directo, ni desde `apps/web`
  ni desde otro paquete. No inventar texto, datos, testimonios ni reseñas.
- Dato sin confirmar → `<DatoPendiente>` (se ve entre corchetes atenuados) o,
  en contenido tipado, un bloque `pending`.
- Un solo teléfono y una sola dirección en todo el sitio, resueltos por
  `resolveBusiness` (`@site/content`) + overrides de `@site/config`
  (`NEXT_PUBLIC_TELEFONO`/`NEXT_PUBLIC_DIRECCION`) — nunca hardcodeados en un
  componente.
- Todo campo de texto que lee el visitante (nombres, descripciones,
  preguntas/respuestas de FAQ, alt de imagen, prosa de artículo, claims,
  CTAs, copy de home) y todo slug de URL es `Localized<T>` (`{ es, en?, fr?,
  de? }`, `es` obligatorio). Ver el README de `@site/content` para las
  excepciones (identificadores, nombres propios, números/fechas, `src` de
  imagen).

**Técnica**

- Componentes de servidor por defecto. `'use client'` solo donde hay estado
  real.
- Presupuesto de JS inicial: 100 KB comprimido. Sin librerías de animación,
  iconos ni formularios.
- `trailingSlash: true` fijo (`apps/web/next.config.ts`).
- Sin `AggregateRating` mientras no haya reseñas verificables (lo comprueba
  `scripts/verify`, check `jsonld`).
- 44 px de objetivo táctil, foco visible, contraste AA,
  `prefers-reduced-motion` respetado.
- Analítica y publicidad solo tras consentimiento
  (`components/layout/Consentimiento.tsx`, `lib/consent-status.ts` sobre
  `@site/tracking`).
- Todo evento sale por `trackEvent` (`@site/tracking`, vía el adaptador
  `lib/eventos.ts`), único punto de salida — nunca `gtag`/`fbq` directos ni
  una llamada paralela a otro sistema de tracking desde el componente.

**Idioma del código** (§2 de `arquitectura-plantilla-monorepo.md`)

- Identificadores, nombres de archivo y comentarios de los paquetes
  (`packages/*`) y del código nuevo, en **inglés**. Contenido, copy y slugs
  de URL, en su idioma real (español hoy).
- Prosa de documentación para humanos (READMEs, este archivo) puede ir en
  español; los identificadores citados dentro se dejan tal cual están en el
  código.

**Regla de bundle: un export por archivo para módulos alcanzables desde
cliente** (encontrada en la fase 2, ver README de `@site/content` §"Client-
bundle rule")

- Un módulo importado por un componente `'use client'` para un solo valor,
  que también exporta algo que solo necesita un componente de servidor, no
  se separa por *función* (dos funciones en el mismo archivo siguen tirando
  del árbol entero) — se separa por **archivo**. Un `index.ts` reexporta
  cada pieza desde su propio módulo hermano.
- `"sideEffects"` declarado en cada `package.json` (`false` en los cuatro
  paquetes `@site/*`; `apps/web` necesita `["**/*.css"]` en vez de `false`
  porque sí importa hojas de estilo por su efecto) — sin eso, el bundler no
  puede eliminar un módulo entero aunque nada use sus exports.
- Nunca `export * from` en un paquete `@site/*` alcanzable desde cliente.
  Reexports nombrados explícitos siempre (`export { x } from './x.ts'`).

**Variables de entorno**

- `NEXT_PUBLIC_*` se lee **solo** como literal exacto
  (`process.env.NEXT_PUBLIC_X`), nunca dinámico
  (`process.env[nombre]`) — es la única forma que Next.js sustituye en build
  para el bundle cliente. Ver `packages/config/src/env.ts`.
- Secretos de servidor, solo a través de `@site/config/server` — nunca
  `process.env` directo fuera de ese paquete, y nunca desde un módulo que un
  componente `'use client'` pueda alcanzar. `EMAIL_DESTINO` (destino del
  lead) se lee solo en `app/presupuesto/actions.ts`; el email público del
  NAP (`lib/config/nap.ts`) sale solo de `@site/content`, sin override de
  entorno — son dos cosas distintas a propósito.
- Cualquier variable de entorno nueva que lea el código va también a
  `apps/web/.env.example` (con comentario) y a `globalEnv` en `turbo.json`.

## Comandos y gates antes de cada commit

```bash
pnpm content:validate   # Zod sobre packages/content
pnpm lint
pnpm typecheck
pnpm build               # turbo run build; debe pasar sin warnings
pnpm verify               # postbuild sobre el build de arriba: sitemap, JSON-LD, metadata,
                          # robots, imágenes/CTAs, enlaces
# verify:secrets necesita su PROPIO build con valores centinela para los
# secretos de servidor (sobrescribe el .next de arriba) — ver
# scripts/verify/README.md o el paso equivalente en .github/workflows/ci.yml
```

Si se tocó `apps/web/src/app/**` o `src/components/**` (solo permitido fuera
de esta fase de migración): comparar antes/después contra el snapshot de
build para confirmar que la salida pública no cambió.
