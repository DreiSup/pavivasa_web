# Estado SEO — puntos aprobados por el dueño

Fecha: 2026-11-15.

## Hechos

- **6. Redirección 301 `/category/hormigon-lavado/` → `/hormigon-lavado/`** en
  `apps/web/next.config.ts`. Era una URL de categoría de la web WordPress anterior que daba 404
  y seguía en Search Console (20 impresiones, 1 clic). `pnpm verify` (check c) confirma que
  resuelve en un salto a 200.
- **7. Ficha técnica de hormigón lavado** (`packages/content/src/data/services.ts`): «HA-25
  según EHE-08» pasa a «HA-25 según Código Estructural» (la EHE-08 la derogó el RD 470/2021).
  Misma redacción que en pavimentos-albufera. Era la única aparición de EHE-08 que llegaba a
  la web pública.

## 8. Contenido duplicado con pavimentos-albufera

Comparación por 8-gramas (secuencias de 8 palabras seguidas) de todos los textos de
`packages/content/src/data/*.ts` de pavivasa contra los de pavimentos-albufera.

Resultado: **no hay frases compartidas**, salvo:

- La descripción de la obra de Dénia: «piedra inglesa en gris mate y piedra inglesa en crema».
  En pavivasa está en la ficha de obra (`projects.ts`); en albufera, en el texto de la zona de
  Denia (`service-areas.ts`). Es una frase corta y descriptiva de los acabados.
- Los títulos de 3 artículos de blog, iguales en las dos webs. En albufera esos artículos están
  vacíos (sin cuerpo), y sus URLs viejas de WordPress ya redirigen 301 a páginas de servicio de
  albufera.

## Pendientes

- **9. Fecha de migración:** 06-10-2026, la misma que pavimentos-albufera (confirmada por el dueño el 15-11-2026). La caída de indexadas del 20 al 24-10 cae dos semanas después: es el relevo normal de URLs viejas por nuevas.
- **10 y 11.** Hechos en esta misma rama: títulos y guía en las páginas de servicio, pulido unificado en `/hormigon-pulido/`, servicio nuevo `/hormigon-fratasado/` y zonas de Calpe y Benissa (en `noindex` hasta tener foto real; ver `docs/seo-zonas.md`).
