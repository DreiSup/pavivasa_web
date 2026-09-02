# Pavivasa — web

Sitio de Pavivasa en Next.js 15 (App Router), React 19, Tailwind 3 y TypeScript.
Esqueleto mínimo funcional con la misma arquitectura que pavimentos-albufera.com:
NAP único, formulario de presupuesto con Server Action, consentimiento RGPD y
tracking hacia GA4, Google Ads y Meta Pixel/CAPI listo para conectar por variables de entorno.

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
app/          rutas (layout, home, presupuesto, proyectos, legales, sitemap, robots)
components/   layout · ui · datos · secciones
content/      JSON de contenido; las rutas dinámicas se generan de aquí
lib/          config (NAP), tipos, datos, schema (JSON-LD), eventos, meta-capi
```

Las reglas del proyecto están en `CLAUDE.md`. El documento de origen del esqueleto,
con el análisis del repositorio original y el motivo de cada decisión, está en
`docs/esqueleto-pavivasa.md` del repositorio de Pavimentos Albufera.
