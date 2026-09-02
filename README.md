# Pavivasa — web

Sitio de Pavivasa en Next.js 15 (App Router), React 19, Tailwind 3 y TypeScript.
Misma arquitectura que pavimentos-albufera.com (NAP único, formulario de presupuesto con
Server Action, consentimiento RGPD, tracking hacia GA4, Google Ads y Meta Pixel/CAPI por
variables de entorno), con el sistema visual y las nueve pantallas del canvas de Claude Design
(`docs/brief-claude-design.md` y `docs/anexo-extraccion-pavivasa-com.md` son su origen).

## Arranque

```bash
npm install
cp .env.example .env.local   # rellenar lo que haya
npm run dev
npm run build                # debe pasar sin warnings antes de cada commit
npm run lint
```

## Estructura

```
app/          rutas: home, [servicio] (7), proyectos + [slug] (15), empresa, presupuesto,
              blog + [slug] (4), legales, 404, sitemap, robots
components/   layout · ui · datos · contenido · secciones (mismos nombres que el brief)
content/      proyectos.json, servicios.ts, articulos.ts, home.ts — todo el copy real
lib/          config (NAP y claims), tipos, datos, schema (JSON-LD), eventos, meta-capi, texto
```

## Sistema visual

- Tokens en `tailwind.config.ts` y `app/globals.css` (cambiar valores, no nombres): fondo
  `#EDEFEC`, fondo-alt `#DCE0DB`, tinta `#141A18`, tinta-media `#5A645F`, pigmento `#B2462A`,
  pigmento-hover `#8F3620`, acero `#45606E`, sobre-tinta `#F2F4F0`, error `#C4161C`.
- Familias: Big Shoulders (titulares), Barlow (texto), Overpass Mono (datos de obra, siempre
  en versalitas). Escala cerrada 12/14/16/20/26/34/46/64/88; mono a 10 solo en etiquetas.
- Radio 0 en todo. Una sola sombra: `BarraMovil`.
- Toda foto que aún no existe es un `BloquePosicion` con trama y la etiqueta de qué va ahí.
  Cuando llegue el original, se rellena `src` en el contenido y la trama desaparece.
- Todo dato que la web actual no da (horario, WhatsApp, m², años, NIF, textos legales,
  respuestas de FAQ) se pinta con `DatoPendiente`. No se inventa.

## Pendiente del cliente

WhatsApp (`NEXT_PUBLIC_WHATSAPP`), horario, fotos originales a 2400 px, logotipos del Kit
Digital, textos legales y NIF, respuestas de las FAQ, confirmación de la cobertura por
provincias y reescritura del artículo de piedra vista (original en rumano).
