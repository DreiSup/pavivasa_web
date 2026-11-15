# Páginas de zona (`/zonas/<municipio>/`)

Encargo del dueño del 2026-11-15 (levantamiento de la congelación del frontend solo para SEO).
Criterio tomado de la receta que ya se aplicó en la web hermana, adaptado a lo que hay aquí; el
texto es propio de Pavivasa (cero frases de 8+ palabras compartidas con la otra marca, comprobado).

## Qué es una zona legítima (y no una doorway page)

1. **Dos o más obras documentadas** en el municipio (`packages/content/src/data/projects.ts`). Con
   una sola obra la zona repetiría la ficha de la obra con otro título. Lo exige el esquema Zod.
2. Title y H1 = **la técnica hecha allí + municipio** («Hormigón impreso en Calpe»). `content:validate`
   comprueba que `services` es exactamente el conjunto de técnicas de sus obras.
3. **Texto propio** (`lead`, `body`, `description`) escrito desde los datos de esas obras: modelo,
   color, urbanización, ficha de ejecución. Prueba: si quitas el nombre del pueblo y el párrafo vale
   para otro, es relleno. Sin FAQ de plantilla.
4. **Enlazada**: cada obra enlaza a su zona («Hormigón impreso en Calpe →»), la zona enlaza a sus
   obras y a su servicio.
5. **Sin foto confirmada del municipio → `noindex, follow`**, fuera del sitemap y sin enlaces desde
   el servicio ni desde otras zonas. Se indexa al rellenar `confirmedPhoto` en el dato: sitemap,
   enlaces entre zonas y `indexableServiceAreasFor()` (para el servicio) salen solos.

## Zonas creadas

| Zona | Obras | Estado |
|---|---|---|
| `/zonas/calpe/` — Hormigón impreso en Calpe | `hormigon-impreso-calpe-2` (sillería grande, arena, HM25 10 cm, juntas 5×5), `hormigon-impreso-calpe` (piedra inglesa, gris medio, urbanización) | `noindex` hasta tener foto confirmada |
| `/zonas/benissa/` — Hormigón pulido e impreso en Benissa | `hormigon-pulido-alicante` (Montemar la Viña), `hormigon-pulido-benissa`, `hormigon-impreso-benissa` (Monte Mar) | `noindex` hasta tener foto confirmada |

### Por qué las dos están en `noindex`

Las fotos que enseñan hoy las obras de Calpe y Benissa **no son de esas obras**: son de la mediateca
común de las dos marcas, asignadas a ojo.

- `img/impreso-piscina-ocre.jpg` (Calpe 2) es idéntica píxel a píxel a la foto que la otra marca
  publica como obra de **Moraira** (sillería grande, color 113 «dorado», serie WhatsApp del
  2021-07-23). La propia etiqueta del dato dice que el original de Calpe 2 era una foto de móvil de
  300 px (subida en 2021-01), y el color que se ve es ocre, no arena.
- `img/portada.png` (Calpe, obra de 2016) es la misma casa de la serie del 2021-07-23 que la otra
  marca archiva como **Carlet** (sillería gris). La foto de la obra de Calpe en la web antigua era
  `uploads/2016/10/pavimento-hormigon-impreso-calpe.jpg`, de 1024 px, y no está en el repo.
- Benissa: `impreso-rampa-adoquin.jpg`, `pulido-acceso-cipreses.jpg` y `pulido-interior-acristalado.jpg`
  también salen de la mediateca común sin atribución a Benissa.

Publicar una página indexable «Hormigón impreso en Calpe» encima de esas fotos sería afirmar algo
que no podemos sostener, y además duplicaría una imagen que la otra marca usa para otro municipio.
El mismo patrón afecta a casi todas las fotos de `projects.ts` (Dénia y Moraira llevan fotos que la
otra marca atribuye a su obra de Moraira C-113): no se ha tocado aquí, es un asunto de contenido
para el dueño.

## Municipios descartados

| Municipio | Obras | Por qué no |
|---|---|---|
| Moraira | 2 (impreso manteado; baño de microcemento) | La otra marca ya tiene `/zonas/moraira/` «Hormigón impreso en Moraira», y la foto principal de la obra de impreso es una de las suyas de Moraira: canibalización directa. La de microcemento, sola, es una obra (y su foto es de la mediateca, nombre de archivo de Castellón). No hay contenido real que la diferencie |
| Dénia | 1 | Una obra, y es la misma obra (piedra inglesa gris mate y crema, HM20, 10 cm) que la otra marca publica en su `/zonas/denia/` |
| Xàbia, Llíria, Montaverner, Alicante | 1 cada una | Una sola obra, de texto corto: la zona repetiría la ficha |
| Daimús, Riba-roja de Túria | 1 cada una | Una obra, nave industrial (no es el público de particulares de Pavivasa); Riba-roja además está en la otra marca |
| Godella | 1 | Una obra; la otra marca tiene `/zonas/godella/` con hormigón lavado |

## Calpe frente a Calpe 2 (y las dos de pulido en Benissa)

Search Console daba URLs «Duplicada: Google eligió otra canónica». Causa encontrada: el `<title>` de
la ficha de obra era solo `Técnica en Municipio`, así que `hormigon-impreso-calpe` y
`hormigon-impreso-calpe-2` compartían «Hormigón impreso en Calpe | Pavivasa», y lo mismo
`hormigon-pulido-benissa` y `hormigon-pulido-alicante` (que está en Benissa). Ahora el title añade el
titular corto de la obra (modelo y color, ya en el dato): «Hormigón impreso en Calpe: sillería
grande, arena» / «…: piedra inglesa, gris medio». Las dos entradas `duplicate-title` de
`scripts/verify/known-issues.json` se han retirado porque ya no se reproducen. Descripciones, H1 y
cuerpos ya eran distintos.

## Lo que tiene que aportar el dueño

1. **Una foto real de cualquiera de las dos obras de Calpe** (vale la de 2016 de la web antigua o la
   de 2021) → se rellena `confirmedPhoto` y `/zonas/calpe/` pasa a indexable. Igual para Benissa.
2. **Confirmar de dónde son** `impreso-piscina-ocre.jpg` y `portada.png` (¿Calpe o Moraira/Carlet?).
   Si no son de Calpe, deberían salir de las fichas de Calpe (y la de Calpe 2 sale en la portada,
   es destacada).
3. **Calpe 2**: color «arena» frente a lo que se ve (ocre); y si el hormigón fue HM25 o HA-25 (lleva
   mallazo). No se ha cambiado: es el dato tal como lo publicó la web antigua.
4. **Calpe 2**: tipo de espacio real (hoy «Pavimento exterior», genérico) y si fue para un particular.
5. Si quiere FAQ local, preguntas reales de clientes de la zona. Sin eso, no hay FAQ.

## Cuando una zona pase a indexable

- Añadir en la plantilla de servicio un bloque «Dónde lo hemos hecho» con
  `indexableServiceAreasFor(servicio.id)` (`apps/web/src/lib/service-areas.ts`), ancla `zona.heading`.
  No se ha tocado la plantilla de servicio a propósito: hoy no saldría ningún enlace.
- Crear el índice `/zonas/` cuando haya dos o más zonas indexables (hoy sería una página vacía);
  entonces la miga «Proyectos» de la zona puede pasar a «Zonas».
- Search Console: Inspección de URL → Solicitar indexación.
