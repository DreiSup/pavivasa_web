# CLAUDE.md — Pavivasa

Web de Pavivasa en Next.js 15 (App Router) + Tailwind. Esqueleto derivado de la
arquitectura de pavimentos-albufera.com. Ver `docs/` para la especificación cuando exista.

## Reglas de este proyecto

**Diseño**

- Tokens en `tailwind.config.ts` y `app/globals.css`. Cambiar valores, no nombres.
  No añadir colores fuera de la paleta.
- `border-radius: 0` en todo. Una sola sombra: la barra fija de móvil.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88.
- Tres familias: display, texto y datos (monoespaciada). Suelo de la mono: 10 px.
- Color de acento (`pigmento`): un CTA primario y el estado activo por pantalla. Nada más.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.

**Contenido**

- Copy solo del documento maestro. No inventar texto, datos, testimonios ni reseñas.
- Dato sin confirmar → `<DatoPendiente>`; se ve entre corchetes atenuados.
- Un solo teléfono y una sola dirección en todo el sitio, desde `lib/config.ts`.

**Técnica**

- Componentes de servidor por defecto. `'use client'` solo donde hay estado real.
- Presupuesto de JS inicial: 100 KB comprimido. Sin librerías de animación, iconos ni formularios.
- `trailingSlash: true` fijo.
- Sin `AggregateRating` mientras no haya reseñas verificables.
- 44 px de objetivo táctil, foco visible, contraste AA, `prefers-reduced-motion` respetado.
- Analítica y publicidad solo tras consentimiento (`components/layout/Consentimiento.tsx`).
- Todo evento sale por `registrarEvento` (`lib/eventos.ts`). Nunca `gtag`/`fbq` directos.

## Comandos

```bash
npm run dev
npm run build       # debe pasar sin warnings antes de cada commit
npm run lint
```
