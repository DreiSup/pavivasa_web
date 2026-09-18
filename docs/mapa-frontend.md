# Pavivasa — mapa del frontend

Revisión de solo lectura del frontend completo, hecha con 12 agentes en paralelo (10 mapeadores de área,
una síntesis y un crítico de completitud) más una pasada de verificación directa sobre el código y el build.
Es el contexto de partida para la tanda de cambios de frontend. No se ha modificado ni una línea de la web.

**Estado del repositorio en el momento de la revisión:** rama `claude/magical-goodall-vji2mj`, HEAD `8a4b343`.

## Línea base medida

Ejecutado en este entorno, no inferido:

| Comprobación | Resultado |
|---|---|
| `npm run build` | Pasa. 39 páginas estáticas, sin warnings. |
| `npm run lint` | Pasa, sin warnings. Avisa de que `next lint` desaparece en Next 16. |
| First Load JS | 103 kB de base compartida; 117 kB en `/`, 116 en `/proyectos/`, 114 en `/blog/`. |
| Suelo del framework | 100,5 kB en `/robots.txt`, que no tiene ni un componente cliente. El código propio son 4-14 kB por ruta. |
| Fuentes | 324 kB en 17 ficheros woff2 (Big Shoulders variable, Barlow 400/500/600, Overpass Mono 400/500). |
| `public/img/` | 27 MB en 81 ficheros; 36 referenciados, 45 huérfanos (12,2 MB). Ninguna referencia rota. |
| Datos de obra | 15 obras: 11 con una sola imagen o ninguna, 9 con `ficha: {}`, 2 con `superficie`, 1 sin `anioFoto`. |

## Cómo está construido

**Arquitectura.** Next.js 15 con App Router, todo SSG. 19 ficheros en `app/`, 35 componentes, 4.167 líneas. Solo 11 ficheros llevan `'use client'`, y tres de ellos (Cabecera, Consentimiento, EventosGlobales) cuelgan del layout raíz, así que su JS se paga en las 16 rutas. Sin librerías más allá de next, react y zod; zod solo se importa desde un `'use server'`, así que no viaja al navegador. Los iconos son SVG inline y el spinner es CSS.

**Las cuatro capas, de dentro afuera.**

1. *Contenido* — `content/servicios.ts` (los 7 servicios completos), `content/proyectos.json` (15 obras), `content/articulos.ts` (4 artículos con cuerpo tipado por bloques), `content/home.ts` (datos de la home). La convención está escrita en `lib/tipos.ts:3`: «todo el contenido real vive en content/». La cumplen servicios, proyectos y artículos; no la cumplen la home ni empresa, cuyo copy redaccional está dentro del JSX.

2. *Modelo y acceso* — `lib/tipos.ts` define `ServicioId` y los cinco diccionarios (`TECNICA_CORTA`, `NOMBRE_SERVICIO`, `RUTA_SERVICIO`, `ORDEN_SERVICIOS`, `SERVICIOS_FUERTES`) que gobiernan qué existe y en qué orden. `lib/datos.ts` es la única puerta de lectura: ninguna página importa JSON directamente. `lib/config.ts` es el NAP único (teléfono, dirección, redes, claims, IDs de analítica) y nadie escribe un teléfono a mano. `lib/schema.tsx` fabrica el JSON-LD y `lib/eventos.ts` es el único punto de salida de eventos.

3. *Componentes* — tres familias. `ui/` son las primitivas (Boton, Chip, Campo, Seccion+CabeceraSeccion, AntetituloSeccion, EnlaceEtiqueta, EstadoVacio), todas con API por props booleanas y un `className` de escape. `datos/` son las piezas de dato (DatoPendiente, FichaObra, EtiquetaTecnica, TablaFichaTecnica). `contenido/` y `secciones/` son los bloques compuestos. `BloquePosicion` es la única puerta de entrada de cualquier imagen: con `src` pinta next/image, sin él una trama con la etiqueta de qué foto falta.

4. *Páginas* — cada una compone secciones y declara su propia metadata con canonical relativo y barra final (`trailingSlash: true`). Las rutas dinámicas siguen siempre el mismo patrón: `generateStaticParams` + `generateMetadata` + `notFound()`.

**Convenciones transversales.** El sistema visual vive en `tailwind.config.ts` (que *reemplaza* la paleta y la escala, no las extiende: fuera de esos tokens no existe ningún color ni tamaño) y en `app/globals.css` (mismas variables duplicadas, reset, foco global, radio 0, anclas). Tres familias por `next/font`. Un solo breakpoint en uso, `md` a 768 px, usado 529 veces; `sm`, `lg`, `xl` y `2xl` existen (el config no declara `screens`, así que los de Tailwind siguen activos) pero tienen 0 usos. El responsive de copy se resuelve duplicando texto con `hidden md:inline` / `md:hidden`: 112 apariciones. El tema oscuro no es una clase sino la prop `sobreOscuro` que cada primitiva traduce. Las alturas de cabecera se comparten entre CSS y JS por la variable `--cabecera-actual`, de la que cuelgan siete posiciones sticky y el scroll-margin de todas las anclas. Todo dato sin confirmar pasa por `<DatoPendiente>` y nunca se inventa.

**Dónde se toca cada cosa.** Un color o un tamaño: `tailwind.config.ts` *y* `globals.css` (y el themeColor del layout, y los data-URI). Un servicio: los cinco diccionarios de `lib/tipos.ts` + `content/servicios.ts` + la redirección. La navegación: tres sitios que hoy no comparten fuente. Un campo del formulario: cinco sitios (JSX, esquema zod, email, Telegram, resumen). Una foto: `content/*` más el `sizes` de `BloquePosicion`, que hoy es único para todo el sitio.

## Inventario de pantallas

### `/`
- **Fichero:** `app/page.tsx`
- **Secciones:** Hero a dos columnas (antetítulo + h1 + entradilla + 2 CTA | foto) → BarraConfianza (4 cifras) → ¿Qué quieres pavimentar? (6 espacios, grid-cols-6) → Servicios (3 fuertes en tarjetas + 4 resto en fila de 4) → Obras destacadas (3, duplicadas móvil/escritorio) → SeccionMuestrario (modelos + colores) → Garantía (bloque sobre tinta) → SeccionFAQ (5 preguntas) → Formulario corto
- **Copy:** Mixto: datos de content/home.ts (HERO_HOME, ESPACIOS, FAQ_HOME, MODELOS_IMPRESO, COLORES_OBRA) y lib/datos.ts; TODO el copy redaccional (titulares, antetítulos, párrafos, garantía, metadata) escrito a mano en el JSX, en 12 puntos

### `/[servicio]/ (7 rutas: hormigon-impreso, hormigon-pulido, hormigon-lavado, microcemento, autonivelantes, pavimentos-de-caucho, alicatados)`
- **Fichero:** `app/[servicio]/page.tsx`
- **Secciones:** Migas → Hero (antetítulo con nº y recuento de obras + h1 + intro dual + 2 CTA | foto sangrada) → SubmenuServicio pegajoso (4-7 anclas) → Qué es → Dónde se usa (listas en escritorio, chips en móvil) → [Muestrario si hay modelos o colores] → [Ficha técnica: tabla comparativa o especificación] → [Obras si las hay, duplicadas por breakpoint] → SeccionFAQ → LlamadaFinal
- **Copy:** content/servicios.ts íntegro vía lib/datos.ts (servicioPorId); las secciones opcionales y el array de anclas se derivan de la presencia de datos. Solo la composición de titulares es código (lib/texto.ts)

### `/proyectos/`
- **Fichero:** `app/proyectos/page.tsx`
- **Secciones:** Cabecera de servidor (h1 + recuento de obras y municipios) → <Suspense sin fallback> → FiltrosProyectos: barra fija de chips en escritorio / botón Filtrar + hoja inferior en móvil → rejilla de tarjetas o EstadoVacio
- **Copy:** lib/datos.ts (proyectos, municipiosConObra); recuentos calculados. El copy del subtítulo está en el JSX con variantes móvil/escritorio

### `/proyectos/[slug]/ (15 obras)`
- **Fichero:** `app/proyectos/[slug]/page.tsx`
- **Secciones:** Migas → Cabecera (EtiquetaProyecto + h1 tituloLargo) → Galería (foto principal 21:9 + tira de 4 miniaturas + contador móvil) → [Ficha de ejecución compacta, solo móvil] → Texto (El encargo / La ejecución) + EtiquetaTecnica + FichaObra lateral pegajosa con CTA → Obras similares (3, duplicadas por breakpoint)
- **Copy:** content/proyectos.json vía lib/datos.ts (proyectoPorSlug, proyectosSimilares); las filas de la ficha se componen en la página con spread condicional

### `/blog/`
- **Fichero:** `app/blog/page.tsx (delega en components/secciones/ListaArticulos.tsx, 'use client')`
- **Secciones:** Cabecera (antetítulo + h1 + chips mono de técnica) → rejilla de TarjetaArticulo a 2 columnas, o EstadoVacio (inalcanzable)
- **Copy:** content/articulos.ts vía lib/datos.ts; el array completo se serializa al cliente. Copy de cabecera en el JSX

### `/blog/[slug]/ (4 artículos)`
- **Fichero:** `app/blog/[slug]/page.tsx`
- **Secciones:** JSON-LD BlogPosting → Migas → Rejilla de 3 columnas: cabecera (técnica · fecha · autor pendiente + h1 + entradilla) → foto 21:9 a ancho completo → IndiceAnclas lateral pegajoso (solo escritorio) → cuerpo por bloques tipados (p / h2 / ol / obra / pendiente) → bloque de cierre con CTA
- **Copy:** content/articulos.ts: el cuerpo es un array de BloqueArticulo y la página lo pinta con un switch. Las anclas se derivan de los bloques h2

### `/empresa/`
- **Fichero:** `app/empresa/page.tsx`
- **Secciones:** Migas → Hero (antetítulo + h1 + párrafo dual) → Foto de equipo 21:9 → Experiencia (cabecera 400px + 2 párrafos duales) → Cinco valores (grid-cols-5 sobre fondo-alt) → Zona de trabajo (cabecera + chips de municipio + mapa pendiente) → LlamadaFinal oscura
- **Copy:** Único caso con el copy dentro del fichero: los 5 valores están en app/empresa/page.tsx:19-45 y los párrafos largos en :64-104, todos con variante móvil y escritorio. Solo NAP, claims y municipiosConObra vienen de lib/

### `/presupuesto/`
- **Fichero:** `app/presupuesto/page.tsx (+ FormularioConEspacio.tsx, 'use client')`
- **Secciones:** Migas → Rejilla [1fr_400px]: columna izquierda con antetítulo + h1 + CTA de teléfono en móvil + <Suspense> con FormularioPresupuesto completo | aside pegajosa con teléfono sobre tinta, WhatsApp pendiente, EtiquetaTecnica de claims y address → bloque compacto de claims solo en móvil
- **Copy:** lib/config.ts (nap, claims) y content/home.ts (NOMBRES_ESPACIOS para chips y select). El copy de la página está en el JSX con variantes duales

### `/aviso-legal/`
- **Fichero:** `app/aviso-legal/page.tsx (+ components/secciones/PlantillaLegal.tsx)`
- **Secciones:** Migas → Pestañas legales en móvil → Rejilla [320px_minmax(0,680px)]: aside con navegación legal + IndiceAnclas | columna con fecha de actualización, h1, ficha de titular (NAP) y 4 secciones, cada una como recuadro '[Texto legal pendiente]'
- **Copy:** La página solo declara título, ruta y la lista de 4 secciones; el NAP sale de lib/config.ts. No hay ni una línea de texto legal real. metadata noindex

### `/politica-de-privacidad/`
- **Fichero:** `app/politica-de-privacidad/page.tsx (+ PlantillaLegal)`
- **Secciones:** Idéntica a aviso-legal con 5 secciones declaradas, todas como recuadro pendiente
- **Copy:** Igual: solo títulos de sección más el NAP de lib/config.ts. metadata noindex, sin description propia (hereda la comercial del layout)

### `/politica-de-cookies/`
- **Fichero:** `app/politica-de-cookies/page.tsx (+ PlantillaLegal)`
- **Secciones:** Idéntica con 3 secciones declaradas, todas pendientes. Es el destino del enlace del banner de consentimiento y no ofrece ningún control para retirarlo
- **Copy:** Igual. metadata noindex, sin description propia

### `404 (app/not-found.tsx)`
- **Fichero:** `app/not-found.tsx`
- **Secciones:** Rejilla de 2 columnas sobre fondo-alt con trama: rótulo de error + h1 + párrafo + 2 botones | nav 'Quizá buscabas' con 3 atajos de servicio y el CTA de presupuesto en pigmento (oculta en móvil)
- **Copy:** Copy y lista de atajos escritos en el fichero (líneas 4-8). Sin export metadata: hereda el title por defecto y el canonical '/' del layout

### `Envoltorio común de todas las pantallas`
- **Fichero:** `app/layout.tsx + components/layout/*`
- **Secciones:** html lang=es con las 3 variables de fuente → JSON-LD de negocio local → enlace 'Saltar al contenido' → Cabecera (pegajosa, cliente) → main#contenido → Pie (sobre tinta) → BarraMovil (fija, 64 px, única sombra) → Consentimiento (cliente) → EventosGlobales (cliente). Las migas NO están aquí: las inserta cada página
- **Copy:** lib/config.ts (NAP, claims), lib/tipos.ts (servicios) y lib/schema.tsx. La navegación principal está duplicada en Cabecera, MenuMovil y Pie

Faltan en este inventario dos rutas del App Router que sí existen en el build: `/robots.txt`
(`app/robots.ts`) y `/sitemap.xml` (`app/sitemap.ts`). Se tratan como pantallas de pleno derecho en el lote G.

## Hallazgos verificados

48 hallazgos tras deduplicar entre las diez áreas y descartar los que no se sostuvieron al releer el código.

### Graves (15)

**1. El índice /proyectos/ no emite ni un enlace a ficha en el HTML estático** · `app/proyectos/page.tsx:27-29 y components/secciones/FiltrosProyectos.tsx:3,28` · _seo_

FiltrosProyectos es 'use client' y llama a useSearchParams(); al estar envuelto en <Suspense> SIN fallback, Next saca del prerender todo el subárbol. Verificado sobre el HTML ya generado en .next/server/app/proyectos.html: contiene el <h1>Proyectos</h1> y cero coincidencias de href="/proyectos/<slug>/" y cero apariciones de "Filtrar". Los 15 enlaces a las fichas, los chips, los recuentos y el estado vacío solo existen tras hidratar, y al no haber fallback el hueco es literalmente vacío (salto de layout completo). Es la página de prueba social del sitio y el principal repartidor de enlaces internos hacia las 15 fichas.

→ Convertir la página en server component que lea `searchParams`, filtrar con helpers de lib/datos.ts y renderizar la <ul> de TarjetaProyecto en servidor; dejar en cliente solo los controles (chips y hoja móvil). Como parche inmediato, pasar un `fallback` con la rejilla sin filtrar.

**2. El evento Lead se manda a Meta CAPI aunque el usuario rechace las cookies** · `app/presupuesto/actions.ts:163-173 y lib/meta-capi.ts:27-34` · _regla-proyecto_

Consentimiento.tsx solo controla los scripts del navegador (líneas 45-70): con 'rechazado' no cargan gtag ni el Pixel y registrarEvento queda en no-op. Pero la Server Action llama a enviarEventoCAPI incondicionalmente, sin consultar ninguna señal de consentimiento, y le pasa teléfono hasheado, email, IP, user-agent y las cookies _fbp/_fbc (actions.ts:171-172). Incumple la regla explícita de CLAUDE.md ('Analítica y publicidad solo tras consentimiento') y es envío de datos personales a un tercero sin base legal. La decisión vive solo en localStorage, así que el servidor hoy no puede leerla.

→ Escribir la decisión también como cookie de primera parte desde Consentimiento.tsx (o mandarla en un campo hidden del formulario) y envolver la llamada a enviarEventoCAPI en `if (consentimiento === 'aceptado')`. Sin consentimiento, no leer _fbp/_fbc.

**3. El honeypot devuelve un éxito indistinguible y dispara una conversión falsa en Ads y Meta** · `app/presupuesto/actions.ts:59-62 y components/secciones/FormularioPresupuesto.tsx:63-73` · _bug_

Cuando el campo trampa `empresa_web` viene relleno, la acción devuelve `{ estado: 'enviado', errores: {}, resumen: { nombre: '', telefono: '', espacio: '' } }`. El cliente no distingue ese éxito falso: el efecto de la línea 64 solo comprueba `estado.estado === 'enviado'` y dispara registrarEvento('envio_formulario', { metaEstandar: 'Lead', conversionAds: true }). Cada bot que ejecute JS cuenta como Lead en Meta y como conversión en Google Ads, ensuciando el CPA y entrenando el bidding automático. Además pinta 'Te llamaremos al ' con el teléfono vacío.

→ Devolver un estado distinguible (por ejemplo sin `resumen`) y condicionar el registrarEvento a `estado.resumen?.telefono`.

**4. Sin RESEND_API_KEY el lead se pierde en silencio y aun así se cuenta como conversión** · `app/presupuesto/actions.ts:101-133 y :175-185` · _bug_

Todo el envío de email está dentro de `if (apiKey)`. Si la variable no está puesta —o está vacía, que lib/config.ts:11 trata como indefinida— la acción se salta Resend, se salta también Telegram si faltan sus credenciales (líneas 136-138), y devuelve `estado: 'enviado'` con el resumen completo. El usuario ve 'Recibido.', se dispara el Lead y la conversión de Ads, y nadie recibe nada. Es un fallo mudo en el punto exacto donde el negocio pierde dinero y es trivial de provocar en un despliegue nuevo.

→ Si no hay ningún canal de entrega configurado (ni Resend ni Telegram), devolver `estado: 'error'` con el mensaje de fallback que ya existe, y permitir el modo silencioso solo cuando NODE_ENV !== 'production'.

**5. DatoPendiente se pinta a 2,91:1, muy por debajo de AA, y está en casi todas las pantallas** · `components/datos/DatoPendiente.tsx:23-24` · _accesibilidad_

Combina `text-tinta-media` (#5A645F) con `opacity-70`. Calculado: el color efectivo sobre fondo (#EDEFEC) es #868E89 y el ratio cae a 2,91:1; sobre fondo-alt (#DCE0DB), a 2,69:1. Se usa a 10 y 12 px, o sea texto pequeño, que exige 4,5:1. Sin la opacidad, tinta-media da 5,31:1 sobre fondo y 4,60:1 sobre fondo-alt, ambos correctos. Aparece en EtiquetaProyecto (el año de cada obra, TarjetaProyecto.tsx:12), la ficha de obra (m² y año), la firma del artículo (blog/[slug]/page.tsx:48), el acordeón de FAQ entero, BarraMovil.tsx:20, el aside de presupuesto y las tres legales. La variante sobreOscuro (opacity-60 sobre tinta) sí pasa: 6,42:1.

→ Quitar `opacity-70` de la rama clara y confiar el atenuado a los corchetes, la mono y las versalitas. Un solo fichero, efecto en todo el sitio.

**6. El anillo de foco global no es visible sobre los fondos oscuros (2,65:1)** · `app/globals.css:73-76` · _accesibilidad_

La regla global es `outline: 2px solid var(--acero)`. Acero (#45606E) sobre fondo claro da 5,76:1, correcto; sobre tinta (#141A18) da 2,65:1, por debajo del 3:1 que WCAG exige a un indicador de foco. Y los fondos tinta no son raros: el pie completo con ~20 enlaces (Pie.tsx:32), el menú móvil entero (MenuMovil.tsx:57), el banner de cookies (Consentimiento.tsx:75), la sección de garantía de la home (app/page.tsx:206), la ficha técnica de servicio (app/[servicio]/page.tsx:176), LlamadaFinal oscura y los enlaces dentro de EtiquetaTecnica (blog/[slug]/page.tsx:90). Quien navega con teclado pierde el foco al llegar al pie. Sobre-tinta sobre tinta daría 15,94:1.

→ Añadir en globals.css una regla para contexto oscuro (`.sobre-tinta :where(a,button,…):focus-visible { outline-color: var(--sobre-tinta) }`) y poner esa clase en los contenedores que ya llevan bg-tinta.

**7. Los campos del formulario anulan el foco global y lo sustituyen por un indicador de 1,09:1** · `components/ui/Campo.tsx:9` · _accesibilidad_

`claseInput` incluye `focus-visible:outline-none` y sustituye el anillo por un borde de 2 px en acero donde antes había 1 px en tinta-media. Calculado, el contraste entre acero (#45606E) y tinta-media (#5A645F) es de 1,09:1: el cambio de color es imperceptible y lo único que distingue el foco es un píxel de grosor. Esta clase la usan todos los inputs, selects y textareas del sitio (solo la consume FormularioPresupuesto), es decir, la pantalla de conversión entera. Es la única excepción a la regla global de globals.css:73-76, y el propio proyecto lo hace bien tres líneas más abajo, en el control de foto (FormularioPresupuesto.tsx:239, `has-[:focus-visible]:outline`).

→ Quitar `focus-visible:outline-none` y dejar actuar al foco global (acero sobre sobre-tinta da 6,02:1), manteniendo o no el engrosado de borde.

**8. --cabecera-actual se queda obsoleta al redimensionar y descuadra todo lo pegajoso** · `components/layout/Cabecera.tsx:45-48` · _bug_

El efecto lee `window.matchMedia('(max-width: 767px)').matches` una sola vez y escribe la variable como estilo inline en documentElement; sus dependencias son `[conScroll]`, sin listener de resize ni de matchMedia. Como es inline, pisa para siempre la media query de app/globals.css:25-30, que existe justamente para eso. Si se carga en móvil y se ensancha (rotación, redimensionado, devtools) sin hacer scroll, la variable se queda en 60 px con una cabecera de 72. De ella cuelgan el scroll-margin de todas las anclas (--ancla-offset, globals.css:22) y siete posiciones sticky: SubmenuServicio.tsx:14, FiltrosProyectos.tsx:116, app/blog/[slug]/page.tsx:57, app/proyectos/[slug]/page.tsx:161, app/presupuesto/page.tsx:46 y PlantillaLegal.tsx:58.

→ Suscribirse al MediaQueryList, o mejor: eliminar el efecto y resolver las tres alturas en CSS con la media query que ya existe más una clase o data-attribute en <html> para el estado compactado.

**9. Cero Open Graph, cero Twitter Card y ningún favicon en todo el sitio** · `app/layout.tsx:12-21` · _seo_

Verificado por grep sobre app/ y lib/: no hay ni una aparición de `openGraph`, `twitter` ni `icons`. Verificado también sobre el HTML generado (.next/server/app/index.html): solo sale `rel="canonical"`, ninguna etiqueta og: ni rel="icon". No existe app/icon.*, app/apple-icon.* ni favicon (el único fichero no-TS de app/ es globals.css, y public/ solo contiene img/). Consecuencia: cualquier enlace compartido por WhatsApp —el canal real de este negocio, que además publica Facebook, Instagram y X en lib/config.ts:39-43— sale sin imagen y sin título de tarjeta, teniendo 36 fotos reales conectadas.

→ Añadir openGraph y twitter en el layout más una imagen por defecto, sobrescribir openGraph.images en los tres generateMetadata dinámicos con la foto real, y crear app/icon.svg. Ojo: al sobrescribir `openGraph` en una ruta, Next no fusiona campo a campo; conviene un helper `lib/meta.ts`.

**10. Clave de React duplicada en la ficha de obra: dos filas etiquetadas 'Color'** · `app/proyectos/[slug]/page.tsx:64 y :70, consumidas por components/datos/FichaObra.tsx:34-35` · _bug_

El array `filas` mete `{ etiqueta: 'Color', valor: proyecto.color }` (línea 64) y `{ etiqueta: 'Color', valor: f.dosificacionColor, mono: true }` (línea 70); FichaObra las pinta con `key={fila.etiqueta}`. Comprobado sobre content/proyectos.json: dos obras tienen ambos campos, hormigon-impreso-denia (color 'Gris mate y crema' + dosificación '4 kg/m²') y hormigon-pulido-benissa (color 'Crema 117' + '4 kg/m²'). Además de la advertencia de clave duplicada —y CLAUDE.md exige que `npm run build` pase sin warnings—, el usuario ve dos filas rotuladas COLOR, una de las cuales dice '4 kg/m²', que no es un color.

→ Renombrar la segunda a 'Dosificación' y dar a FilaFicha una clave estable distinta del texto visible (`key={`${fila.etiqueta}-${i}`}`).

**11. La galería de la ficha de obra promete una interacción que no existe** · `app/proyectos/[slug]/page.tsx:97-114` · _bug_

En móvil se pinta un contador '1 / {n}' (línea 98) y debajo una tira de miniaturas donde la primera recibe `activo={i === 0}`, que en BloquePosicion.tsx:33 se traduce en `border-2 border-pigmento`, el lenguaje visual de 'seleccionada'. Pero las miniaturas son <figure> dentro de <li>: no hay onClick, ni Link, ni estado, ni swipe en todo el fichero. El usuario ve una selección activa y un contador de galería, toca y no pasa nada; con teclado no son enfocables. Encima la miniatura 0 repite exactamente la foto principal (el map recorre `proyecto.imagenes` completo, no `miniaturas`) y el borde en pigmento gasta el acento en algo que no es ni CTA ni estado real.

→ O se implementa (una isla cliente pequeña con índice, miniaturas como <button aria-pressed> y la principal cambiando), o se retiran el contador y el `activo` y se empieza la tira en la segunda imagen.

**12. Dos errores de validación muy probables se muestran en inglés** · `app/presupuesto/actions.ts:25-26 y :71-73` · _bug_

(1) `espacio: z.string().refine(...)`: en la variante completa ningún radio viene marcado por defecto (FormularioPresupuesto.tsx:201, defaultChecked solo si hay espacioPorDefecto), así que enviar sin elegir hace que la clave ni siquiera exista en el FormData; zod (v3.24) emite entonces un invalid_type con mensaje 'Required' y el texto del refine nunca se ejecuta. (2) `email: z.string().trim().email('Revisa el email.').optional().or(z.literal(''))` es una unión: si el email es inválido fallan las dos ramas y zod emite un invalid_union cuyo `message` es 'Invalid input'; el mensaje del .email() queda dentro de unionErrors y el bucle de las líneas 71-73 nunca lo lee. De propina, un email de solo espacios también falla, porque `.trim()` solo afecta a la primera rama.

→ Para `espacio`, usar `z.enum(...)` o `required_error`. Para `email`, sustituir la unión por un `.refine()` que acepte cadena vacía. Y añadir un fallback en el bucle de errores para cualquier mensaje ajeno.

**13. Una foto de más de 12 MB rompe el envío sin ningún mensaje** · `app/presupuesto/actions.ts:15,88 y next.config.ts:11` · _bug_

FOTO_MAX_BYTES son 10 MB y el error 'La foto pesa más de 10 MB' solo puede mostrarse si el request llega a ejecutarse, pero el techo real es `serverActions.bodySizeLimit: '12mb'`: por encima de eso Next rechaza el POST antes de entrar en la acción, useActionState no recibe estado de error y el formulario se queda colgado. No hay ninguna comprobación en cliente: el onChange de FormularioPresupuesto.tsx:249 solo guarda el nombre del fichero. Una foto de móvil moderna pasa de 12 MB con facilidad, y quien la sube es el lead más cualificado. Además el `accept` solo admite image/jpeg e image/png, y las fotos de iPhone son HEIC por defecto.

→ Validar tipo y tamaño en el onChange antes de enviar, y redimensionar en cliente con canvas (sin librerías) para que la subida baje de 1 MB; ajustar entonces bodySizeLimit y el copy 'hasta 10 MB'.

**14. El prefill ?espacio= no funciona sin JS y provoca un doble render del formulario** · `app/presupuesto/page.tsx:41-43 y app/presupuesto/FormularioConEspacio.tsx:8-9` · _bug_

FormularioConEspacio usa useSearchParams, lo que fuerza el render en cliente de ese subárbol; el HTML servido es siempre el fallback, o sea `<FormularioPresupuesto variante="completo" />` SIN espacioInicial. Consecuencias: (a) los seis enlaces de '¿Qué quieres pavimentar?' de la home prometen 'Cada opción abre el formulario ya rellenado' (app/page.tsx:79) y sin JS el formulario llega vacío; (b) con JS, React sustituye un árbol por otro al hidratar, así que lo tecleado en esa ventana se pierde y el foco salta; (c) el formulario completo se renderiza dos veces en el mismo paint.

→ Leer el parámetro en servidor: la página recibe `searchParams` y pasa `espacioInicial` directamente a FormularioPresupuesto, eliminando FormularioConEspacio y el Suspense.

**15. Todas las rutas superan el presupuesto de 100 KB, pero el suelo lo pone el framework** · `package.json y .next/app-build-manifest.json` · _rendimiento_

Medido sumando el gzip de los chunks JS que el manifiesto del build ya presente asigna a cada ruta: / = 114,4 KB · /proyectos/ = 113,5 · /blog/ = 111,6 · /layout = 110,8 · /[servicio]/ y /presupuesto/ = 109,7/109,6 · /blog/[slug]/ = 109,5 · /empresa/ y /proyectos/[slug]/ = 108,9 · legales = 104,5. Ninguna baja de 100 KB. Ahora bien, /robots.txt/route —que no tiene ni un componente cliente— ya son 100,5 KB: ese es el suelo de Next 15 + React 19. El código propio son 4 a 14 KB por ruta. El margen real está en los tres clientes que cuelgan del layout raíz y por tanto se pagan en las 16 rutas: Cabecera (194 líneas, importa MenuMovil estáticamente en la línea 9), Consentimiento y EventosGlobales.

→ Decidir con el usuario si se reformula la regla ('máximo N KB de JS propio por ruta') o se sube el techo. Del lado del código: partir Cabecera en cáscara de servidor más isla, cargar MenuMovil con next/dynamic y pasar el índice del blog a servidor.

### Medias (23)

**1. Un único `sizes` al 50vw para todas las imágenes del sitio** · `components/contenido/BloquePosicion.tsx:38` · _rendimiento_

El <Image fill> lleva `sizes="(min-width: 768px) 50vw, 100vw"` codificado y sin prop que lo sobreescriba; lo heredan los doce puntos de llamada. Es correcto para el hero de la home (rejilla de 2 columnas) y se queda corto para los heros a ancho completo del artículo y de empresa; pero está muy inflado para los 6 tiles de espacios en md:grid-cols-6 (app/page.tsx:82, ~208 px reales), las 3 tarjetas de servicio (app/page.tsx:110), las obras del servicio en md:grid-cols-4 (app/[servicio]/page.tsx:228), las tarjetas del índice en md:grid-cols-3 (FiltrosProyectos.tsx:243, ~430 px) y las 4 miniaturas de galería (app/proyectos/[slug]/page.tsx:102, ~330 px). Se descargan variantes de 3 a 6 veces más grandes de lo pintado, justo en las pantallas con más fotos.

→ Añadir una prop `sizes` con el valor actual por defecto y pasar el real desde cada llamador.

**2. Los separadores de la fila de servicios 'resto' no se pintan nunca** · `app/page.tsx:141-146` · _bug_

Cada servicio es un `<li className="contents">` con un ÚNICO <Link> dentro, y las clases del Link incluyen `last:border-b-0 md:last:border-r-0`. Como el Link es el único hijo de su <li> siempre cumple :last-child (display:contents no altera el árbol DOM), así que esas dos clases se aplican a los cuatro elementos: en móvil no hay ninguna línea entre servicios y en escritorio no hay ningún divisor vertical entre las cuatro columnas. Solo queda el border-t del <ul>. Nótese que dos líneas más abajo el mismo fichero ya resuelve el caso hermano con índice (`i === resto.length - 1`).

→ Mover los bordes al <li> (quitando `contents`) o sustituir los `last:` por lógica de índice, como ya se hace en la línea 145.

**3. El borde superior de la foto del hero en móvil está anulado por un !border-0 de la misma clase** · `app/page.tsx:65` · _bug_

El className es `… !border-0 border-t md:border-t-0 md:!border-l md:!border-l-tinta/[.12] border-t-tinta/[.12] md:p-2`. `!border-0` fija border-width:0 con importancia, así que `border-t` (1 px, sin importancia) nunca gana: en móvil la foto queda pegada al texto sin la línea que la clase pretende dibujar, y `border-t-tinta/[.12]` es código muerto. En escritorio sí funciona porque `md:!border-l` también lleva importancia. De paso, el `md:p-2` tampoco hace nada visible: la <Image fill> es absolute con inset:0 y cubre el relleno del figure.

→ Quitar `!border-0` y anular solo lo necesario (o declarar `!border-t`), y borrar `border-t-tinta/[.12]` y `md:p-2`.

**4. En la ficha compacta de móvil los m² salen siempre como '[pendiente]'** · `app/proyectos/[slug]/page.tsx:119-124` · _bug_

La línea 124 pinta `m² · {proyecto.superficie ?? '[pendiente]'}`, pero ese bloque solo se renderiza si `lineasMovil.length`, es decir, solo para las obras con `ficha` no vacía. Comprobado sobre content/proyectos.json: las únicas dos obras con `superficie` son hormigon-pulido-xabia (120) y hormigon-pulido-daimus (2000), y ambas tienen `ficha: {}`. Por tanto, en el 100 % de los casos en que esa línea aparece muestra '[pendiente]'. Además escribe los corchetes a mano en vez de usar <DatoPendiente>, duplicando la presentación del componente.

→ No emitir la línea de m² cuando no hay dato, o usar `<DatoPendiente pequeno sobreOscuro>`; y rellenar `superficie` en el JSON donde se conozca.

**5. El desplegable de la home llega preseleccionado con el primer espacio** · `components/secciones/FormularioPresupuesto.tsx:312` · _bug_

`defaultValue={espacioPorDefecto ?? NOMBRES_ESPACIOS[0]}` deja siempre marcado el primer espacio de content/home.ts. Como ese valor es válido para el servidor, quien no toca el desplegable envía un espacio que no ha elegido: sesgo sistemático en la única pregunta de cualificación del formulario corto, llamadas mal preparadas y estadísticas por espacio inservibles. La variante completa no tiene el problema porque ningún radio viene marcado.

→ Añadir una primera `<option value="" disabled>` tipo 'Elige el espacio' como valor por defecto y dejar que valide el servidor, que ya rechaza lo que no está en NOMBRES_ESPACIOS.

**6. Tres chips en pigmento a la vez en la hoja de filtros de móvil** · `components/secciones/FiltrosProyectos.tsx:93, 200, 213` · _regla-proyecto_

Los tres grupos llevan un chip de reset con `activo={!filtros.tecnica}`, `activo={!filtros.municipio}` y `activo={!filtros.anio}`, y Chip.tsx:25 pinta el activo no-mono como `bg-pigmento border-pigmento text-sobre-tinta`. Sin filtros puestos —el estado por defecto al abrir la hoja— los tres están activos simultáneamente; con filtros puestos siguen siendo tres, uno por grupo. Detrás queda además el chip 'Filtrar' de la barra (línea 161). CLAUDE.md fija 'un CTA primario y el estado activo por pantalla. Nada más'. El mismo exceso ocurre en /presupuesto/, donde conviven el botón primario (línea 296), el chip de espacio seleccionado (peer-checked:bg-pigmento, línea 20) y tres asteriscos de obligatorio en text-pigmento (Campo.tsx:48 y FormularioPresupuesto.tsx:189 y :283).

→ Que los chips de reset usen la variante `mono` (activa en tinta, Chip.tsx:25) o una variante neutra nueva, dejando el pigmento para el filtro realmente aplicado; y pintar los asteriscos en tinta-media o sustituirlos por la palabra 'obligatorio'.

**7. El pigmento como texto sobre fondo-alt se queda en 4,14:1** · `app/page.tsx:149 y components/ui/Campo.tsx:48` · _accesibilidad_

Calculado: pigmento (#B2462A) sobre fondo-alt (#DCE0DB) da 4,14:1, por debajo del 4,5:1 de AA para texto normal (sobre fondo sí pasa, 4,78:1). Ocurre en dos sitios reales: la lista de servicios 'resto' está dentro de una sección `bg-fondo-alt` (app/page.tsx:103) y su título hace `group-hover:text-pigmento` a text-16 en móvil; y los asteriscos de obligatorio de Campo caen sobre el `bg-fondo-alt` del formulario completo (FormularioPresupuesto.tsx:116). pigmento-hover (#8F3620) sobre fondo-alt daría 5,79:1.

→ Usar pigmento-hover cuando el fondo sea fondo-alt, o resolverlo de raíz al retirar el pigmento del hover genérico y de los asteriscos.

**8. El pigmento se ha convertido en el color de hover genérico del sitio** · `components/ui/EnlaceEtiqueta.tsx:25, components/contenido/TarjetaProyecto.tsx:49, components/contenido/TarjetaArticulo.tsx, components/layout/Migas.tsx:30, components/layout/Cabecera.tsx:82, app/page.tsx:90,93,127,131,149` · _regla-proyecto_

Solo en la home hay hover:text-pigmento o group-hover:text-pigmento en los 6 títulos de espacio, sus 6 subrayados, los 3 títulos de servicio fuerte y sus 3 'Ver servicio →', los 4 títulos del resto, las tarjetas de obra y los enlaces de etiqueta: alrededor de 35 elementos que pueden ponerse en pigmento. Se suma a los estados activos: en cualquier página de servicio conviven el CTA primario del hero (app/[servicio]/page.tsx:97), el ancla activa del submenú (SubmenuServicio.tsx:25) y el botón 'Servicios' de la cabecera con border-pigmento (Cabecera.tsx:110). Convertido en el hover por defecto, el acento deja de señalar nada.

→ Elegir un color de hover neutro (tinta, o acero) para títulos de tarjeta, migas y enlaces de etiqueta, y reservar el pigmento para el CTA primario y un único estado activo por pantalla. Se toca en cuatro componentes más cinco clases sueltas de app/page.tsx.

**9. Objetivos táctiles por debajo de 44 px en toda la navegación de texto** · `components/layout/Pie.tsx:55,64,70,97; components/layout/Migas.tsx:13; components/layout/MenuMovil.tsx:87; components/layout/Cabecera.tsx:164; app/page.tsx:185` · _accesibilidad_

Donde hay tokens (min-h-tactil en Chip, min-h-boton en Boton, min-h-campo en los inputs, el summary del acordeón) la regla se cumple. Falla justo en los enlaces de texto: el pie apila en móvil ~20 enlaces a text-14 (≈21 px de caja) con `gap-[10px]`, o sea ~31 px de paso; las migas van en mono text-d-12 (≈19 px) y aparecen en todas las páginas interiores; los tres servicios secundarios del menú móvil usan `py-[6px]` sobre text-16 (≈37 px); y el CTA de la cabecera se fuerza a `!min-h-[36px]` al hacer scroll (Cabecera.tsx:164), que además introduce dos valores arbitrarios fuera de los tokens. El EnlaceEtiqueta 'Ver los N proyectos' de app/page.tsx:185 es exclusivamente móvil y ronda los 24 px.

→ Añadir `min-h-tactil inline-flex items-center` a la constante `enlacePie` (Pie.tsx:25, arregla los cuatro grupos), al <Link> de Migas y a los secundarios del menú; usar min-h-tactil también en la cabecera compactada (cabe en 56 px); y dar una variante táctil a EnlaceEtiqueta.

**10. Los diálogos no devuelven el foco, y la hoja de filtros no lo atrapa** · `components/layout/MenuMovil.tsx:21-49 y components/secciones/FiltrosProyectos.tsx:72-84` · _accesibilidad_

MenuMovil hace bien lo difícil (bloquea el scroll, enfoca el botón de cierre, atrapa el Tab y cierra con Escape) pero no guarda document.activeElement ni lo restaura en la limpieza; como Cabecera desmonta el componente entero (Cabecera.tsx:191), al cerrar el foco vuelve al <body> y hay que recorrer el documento desde arriba. La hoja de filtros está peor: declara role="dialog" y aria-modal="true" (líneas 176-177) pero solo escucha Escape, sin trampa de foco, así que con Tab se sale a los chips y tarjetas de debajo mientras aria-modal miente al lector; tampoco restaura el foco al chip 'Filtrar'. Además los dos escriben `document.body.style.overflow` sin contador, así que si se cruzan, el primero en desmontarse desbloquea el scroll con el otro abierto.

→ Guardar y restaurar el elemento activo en ambos, reutilizar el bucle de Tab de MenuMovil en la hoja (o pasar los dos a <dialog> nativo con showModal()), y extraer un hook compartido useBloqueoScroll con contador.

**11. No hay forma de retirar el consentimiento una vez dado** · `components/layout/Consentimiento.tsx:28-35 y :72` · _regla-proyecto_

decidir() escribe 'aceptado' o 'rechazado' en localStorage y el banner solo se renderiza con estado 'pendiente', así que no vuelve a aparecer nunca. Ninguna otra parte del sitio lee ni borra la clave 'pv-consentimiento' (buscado en app/, components/ y lib/). La página de cookies existe y es un hueco pendiente, de modo que no hay ningún control detrás. El RGPD exige que retirar el consentimiento sea tan fácil como darlo. Además se guarda solo la cadena, sin fecha ni versión, así que no se puede caducar ni volver a preguntar cuando cambien los proveedores.

→ Guardar un JSON {valor, fecha, version} y exponer un control 'Cambiar preferencias de cookies' que borre la clave y reabra el banner, colocado en el pie y dentro de la política de cookies. Encaja con el arreglo del CAPI si la decisión pasa a cookie de primera parte.

**12. Desbordamiento horizontal en el artículo y en la 404 por pistas de rejilla fijas** · `app/blog/[slug]/page.tsx:45 y app/not-found.tsx:33` · _bug_

El artículo usa `md:grid-cols-[1fr_680px_1fr] md:gap-x-12` dentro de un contenedor con px-lat-desktop (48 px por lado): a 800 px de viewport el contenedor mide 704 px, pero la pista central fija son 680 px más 96 px de gaps, sin contar el min-content de las dos pistas 1fr (la izquierda lleva el índice de anclas, visible desde md). Hay scroll horizontal en las cuatro rutas de blog en tablet vertical, y no hay overflow-x:hidden en body. PlantillaLegal.tsx:57 ya resuelve el caso hermano bien, con `minmax(0,680px)`. En la 404, el <nav> lleva `w-[480px]` dentro de un `md:grid-cols-2 gap-16` que a 768 px solo dispone de ~304 px por columna, más un h1 a md:text-88 en la otra: desborda por debajo de ~1120 px.

→ Cambiar la pista central del artículo a `minmax(0, 680px)` y el ancho de la 404 a `w-full max-w-[480px]`, añadiendo `min-w-0` a las columnas.

**13. El layout editorial se estrangula entre 768 y ~1050 px: no hay breakpoint intermedio** · `components/secciones/SeccionMuestrario.tsx:31,49 y components/ui/Seccion.tsx (consumidores)` · _bug_

Verificado: tailwind.config.ts no declara `screens`, así que solo existen los breakpoints por defecto y el código usa exclusivamente `md` — 529 apariciones de `md:` en app/ y components/, cero de sm/lg/xl. El patrón dominante es `md:grid-cols-[400px_1fr] gap-6 md:gap-16` (7 usos). A 768 px el contenedor mide 672 px; restando 400 de pista y 64 de gap quedan 208 px para la columna derecha. En el muestrario esa columna lleva `md:grid-cols-10` para los colores con gap-3: nueve gaps de 12 px se comen 108 px y cada muestra queda en ~10 px de ancho, con su nombre en mono debajo. Lo mismo con `md:grid-cols-[1fr_400px]` en la ficha de obra y en presupuesto, donde la columna de texto principal cae a ~192 px con párrafos a md:text-20.

→ Abrir un breakpoint `lg` (1024 px) en tailwind.config.ts y mover a él las rejillas de dos columnas, dejando `md` en una sola. Son unas ocho declaraciones concentradas.

**14. El copy está duplicado en el DOM 112 veces con spans hidden/md:hidden, y casi todo vive en el JSX** · `app/page.tsx (23), app/[servicio]/page.tsx (22), app/empresa/page.tsx (17), app/proyectos/[slug]/page.tsx (9), app/presupuesto/page.tsx (7)` · _mantenibilidad_

Verificado por grep: 112 apariciones de `hidden md:*` / `md:hidden` en 21 ficheros. Ocultar bloques enteros es razonable; el problema son los que trocean una misma frase, como el párrafo de garantía de app/page.tsx:215-218 (cuatro spans alternos cuya continuidad depende de literales `{' '}`) o la entradilla del hero (líneas 45-46). Las dos versiones viajan siempre en el HTML. Y el copy redaccional no está en content/: los titulares, antetítulos, párrafos y el texto de garantía de la home están escritos a mano en app/page.tsx (12 puntos distintos), y los cinco valores y los cuatro párrafos largos de empresa están en app/empresa/page.tsx:19-45 y :91-104, contra la convención que declara lib/tipos.ts:3 ('Todo el contenido real vive en content/'), que servicios, proyectos y artículos sí cumplen.

→ Mover el copy a content/home.ts y content/empresa.ts con campos explícitos `movil` y `escritorio`, y pintar las variantes con un único componente (`<TextoResponsive>`) en vez de spans sueltos. Es el cambio que abarata todos los demás.

**15. La navegación principal está escrita tres veces y el menú móvil repite los servicios a mano** · `components/layout/Cabecera.tsx:13-17, components/layout/MenuMovil.tsx:10-15,93-97, components/layout/Pie.tsx:6-11, app/not-found.tsx:4-8` · _duplicacion_

El array `enlaces` de Cabecera está exportado pero no lo importa nadie: Pie.tsx:6-11 mantiene su propia copia (con /presupuesto/ añadido) y MenuMovil.tsx:93-97 una tercera. Además MenuMovil.tsx:10-15 repite a mano qué servicios son principales y cuáles secundarios en vez de derivarlo de SERVICIOS_FUERTES / ORDEN_SERVICIOS, y la línea 82 acorta 'Microcemento decorativo' con un ternario cuando TECNICA_CORTA ya devuelve 'Microcemento'. not-found.tsx:4-8 es una cuarta lista. Un servicio nuevo o renombrado aparece en escritorio y en el pie pero no en el menú móvil. El array vive además en un módulo 'use client', así que el pie (servidor) no podría importarlo sin arrastrar la cabecera.

→ Crear lib/navegacion.ts (sin 'use client') con los enlaces principales y los grupos del pie, y derivar los servicios del menú móvil de ORDEN_SERVICIOS/SERVICIOS_FUERTES y TECNICA_CORTA.

**16. La paleta está declarada en cuatro sitios sin fuente única** · `tailwind.config.ts:13-25, app/globals.css:6-15, app/layout.tsx:26 y los data-URI de app/globals.css:98,104,109` · _duplicacion_

Los nueve colores se repiten literalmente como hex en tailwind.config.ts y como custom properties en globals.css —el propio comentario de la línea 5 admite el problema ('cambiar en los dos sitios') sin resolverlo—, y además el themeColor de app/layout.tsx:26 repite '#EDEFEC' y los SVG en data-URI llevan %23F2F4F0 y %23141A18 URL-encoded. Hoy los valores coinciden, pero con una tanda grande de cambios de frontend es el punto donde se van a desincronizar, y el síntoma (la marca de la casilla o la flecha del selector con el color viejo) no lo ve nadie hasta mucho después.

→ Dejar globals.css como única fuente y que tailwind lea las variables. Ojo: hay usos de modificador de opacidad sobre tokens (bg-tinta/50, border-tinta/[.12]…), así que las variables deben guardarse como tripletas de canal y consumirse con `rgb(var(--x) / <alpha-value>)`. Los data-URI no admiten var(): documentarlos junto a la definición o pasarlos a mask con currentColor.

**17. La escala tipográfica cerrada se pisa con 49 interlineados arbitrarios** · `tailwind.config.ts:37-53 frente a app/page.tsx:41,76,127,167,209,241 y el resto de páginas` · _regla-proyecto_

Los tamaños sí respetan la escala: cero clases text-[Npx] en todo el código. Pero cada token de fontSize trae su lineHeight y el JSX lo sobrescribe casi siempre: contados por grep, 14 valores distintos de leading arbitrario y 49 apariciones (leading-[0.98] x12, leading-[1.1] x10, leading-[1.05] x7, leading-[0.95] x6, leading-[1.5] x5…). Varias son redundantes: el token 88 ya declara 0.95 y app/page.tsx:41 vuelve a escribir md:leading-[0.95]. El resultado es que la escala del config no describe lo que se ve y cada titular nuevo copia el interlineado del de al lado. Además hay tokens declarados que no usa nadie: max-w-lectura (0 usos, mientras el ancho de lectura se escribe a mano como 680px en dos plantillas y max-w-[640px] en otras dos) y los dos aspectRatio (0 usos, frente a aspect-[21/9] y aspect-[16/7] arbitrarios).

→ Fijar en los tokens el leading que de verdad se usa y borrar los modificadores arbitrarios; adoptar max-w-lectura, aspect-21/9 y aspect-16/7 o borrarlos del config.

**18. 32 márgenes por elemento dentro de contenedores que ya tienen gap** · `components/layout/Pie.tsx:53,62,68,92; components/secciones/PlantillaLegal.tsx:38,87,104; app/blog/[slug]/page.tsx:54,69,107; components/secciones/FiltrosProyectos.tsx:118,120,121,137; components/datos/EtiquetaTecnica.tsx:26,30; components/secciones/FormularioPresupuesto.tsx:187; app/not-found.tsx:34; components/layout/MenuMovil.tsx:74` · _regla-proyecto_

CLAUDE.md fija 'Layout siempre con flex/grid y gap. Nunca márgenes por elemento'. Contados por grep, 32 márgenes direccionales excluyendo los resets m-0. Descartando los usos legítimos (mx-auto de centrado, mt-auto de empuje, los -mx-lat-movil de sangrado a pantalla completa y el -mb-px de solape de borde de PlantillaLegal.tsx:46), quedan ~18 infracciones reales. Los casos más molestos: la barra de filtros ya es un flex con gap-2 y encima apila mr-2, mx-3, ml-4 y mr-2 para recolocar piezas; el <legend> del fieldset lleva mb-[10px] dentro de un fieldset con gap-[10px], y como un legend no participa del flex el espacio resultante no es evidente al leerlo; y los <h2> de PlantillaLegal y del artículo se separan con mt-3 md:mt-5 porque el gap de la columna es uniforme.

→ Agrupar cada bloque que necesita otro ritmo en su propio contenedor flex con su gap: en el pie, rótulo + enlaces por columna; en PlantillaLegal y el artículo, cada h2 con sus bloques; en FiltrosProyectos, cada faceta (rótulo + control) como subgrupo.

**19. 29 preguntas de FAQ sin respuesta, la primera abierta por defecto, y schemaFAQ sin usar** · `content/servicios.ts (24 preguntas), content/home.ts:65-71 (5), components/secciones/Acordeon.tsx:8,12 y lib/schema.tsx:37-50` · _seo_

Verificado: `grep -c 'respuesta:'` da 0 tanto en content/servicios.ts como en content/home.ts, frente a 24 y 5 `pregunta:`. Acordeon tiene `primeraAbierta = true` por defecto y SeccionFAQ no expone la prop, así que en la home y en las siete páginas de servicio lo primero que se ve al llegar a la sección FAQ es 'Respuesta: [pendiente · la redacta Gabriel]', además con el contraste de 2,91:1 del punto anterior. Y schemaFAQ está escrito, filtra correctamente las preguntas sin respuesta y devuelve null si no queda ninguna, pero ningún fichero lo importa: es código muerto que el día en que lleguen las respuestas seguirá sin emitirse salvo que alguien se acuerde.

→ Cablear `<JsonLd data={schemaFAQ(preguntas)} />` dentro de SeccionFAQ desde ya (la guarda de null lo hace seguro), pasar `primeraAbierta={false}` mientras ninguna pregunta tenga respuesta, y priorizar la redacción de las de impreso, pulido y microcemento.

**20. El canonical '/' del layout se hereda: cualquier página nueva se autocanonicaliza a la home** · `app/layout.tsx:20` · _seo_

El layout raíz declara `alternates: { canonical: '/' }` y Next hereda `alternates`, así que toda página que no declare el suyo dice que su versión canónica es la home. Hoy el daño es limitado porque las doce páginas reales declaran el suyo, pero es una trampa activa para cada ruta que se cree durante la tanda de cambios que viene. En la misma línea, app/sitemap.ts:7 mantiene `rutasEstaticas` a mano —el comentario lo reconoce—, de modo que una ruta nueva existe pero no entra en el sitemap.

→ Quitar `alternates` del layout (la home ya declara el suyo en app/page.tsx:23) y centralizar title/description/canonical/openGraph en un helper `lib/meta.ts` que ninguna página nueva pueda olvidar.

**21. content/proyectos.json se castea a Proyecto[] sin validar** · `lib/datos.ts:8` · _mantenibilidad_

`export const proyectos = proyectosJson as Proyecto[]` es una aserción: TypeScript no comprueba nada. Un `servicio` mal escrito pasa el build y luego NOMBRE_SERVICIO[proyecto.servicio] devuelve undefined, dejando el <title> y los titulares rotos; una `provincia` inválida o una imagen sin alt también cuelan. zod ya es dependencia del proyecto y el patrón existe en app/presupuesto/actions.ts. Con 15 obras y mucho contenido por delante, es la vía más probable de romper páginas en producción por un dato.

→ Definir el esquema zod de Proyecto y hacer que proyectosJson pase por `.parse()` en lib/datos.ts: al ser SSG, un dato malo falla en build, que es donde debe fallar.

**22. El resumen móvil de la ficha técnica pierde el nombre del parámetro y la tabla desaparece** · `components/datos/TablaFichaTecnica.tsx:11-17,38,43` · _bug_

La tabla completa vive en un `<div className="hidden md:block">`. En móvil se pinta en su lugar una <dl> con los valores de la PRIMERA columna únicamente, y el resto de columnas se comprimen en un párrafo generado: `notas` toma los valores de cada columna, los filtra, los recorta a los cuatro primeros con `.slice(0, 4)` y los une con ' · ' arrastrando solo el nombre de la obra, nunca `f.parametro`. Con los datos reales de impreso queda una frase del tipo 'Calpe: HM25 · 10 cm · 12 mm · Sí.', donde ese 'Sí' es el mallazo. La comparativa de tres obras es el contenido más diferenciador de las páginas de impreso y pulido, y en móvil —la mayoría del tráfico de un negocio local— no se ve.

→ Mantener una sola tabla, desplazable en horizontal en móvil con la primera columna fija; o, si se prefiere la <dl>, un selector de obra (chips) que repinte la misma lista con el nombre del parámetro.

**23. Las tres páginas legales no tienen ni una línea de texto legal** · `components/secciones/PlantillaLegal.tsx:14,83,94,102-111` · _regla-proyecto_

Cada sección declarada por aviso-legal (4), privacidad (5) y cookies (3) se pinta como un recuadro '[Texto legal pendiente]'. Ninguna de las tres pasa `ultimaActualizacion`, así que la línea de fecha siempre muestra '[pendiente]', y en la ficha de titular la razón social y el NIF también. Está marcado correctamente según la regla de DatoPendiente, pero un sitio con formulario de contacto y banner de cookies no puede publicarse así: la política de privacidad es la que legitima el tratamiento del formulario de presupuesto y la de cookies la que soporta el consentimiento. Además el tipo SeccionLegal solo admite título y nota: cuando llegue el texto real (párrafos, listas, la tabla de cookies) no cabrá.

→ Ampliar SeccionLegal con párrafos y listas antes de que llegue el texto —reutilizando el render de bloques del artículo— y bloquear el lanzamiento con estas tres páginas en el checklist.

### Menores (10)

**1. El scroll-spy recrea el IntersectionObserver en cada render** · `components/ui/useSeccionActiva.ts:32, components/secciones/SubmenuServicio.tsx:9, components/secciones/IndiceAnclas.tsx:8` · _rendimiento_

El efecto depende de `[ids]` y los dos consumidores le pasan `anclas.map((a) => a.id)`, un array nuevo en cada render. Como el hook llama a setActiva desde el callback del observer, el ciclo es: scroll → setActiva → render → nueva identidad de ids → cleanup, disconnect, observer nuevo y re-observar todos los elementos. En una página de servicio con siete anclas son siete observe/unobserve por cada cambio de sección, y el observer nuevo se queda sin sus entradas iniciales hasta el siguiente cruce de umbral, lo que puede hacer parpadear el ancla activa. Afecta al submenú de servicio, al índice del artículo y al de las tres legales.

→ Memorizar las ids en el consumidor con useMemo, o cambiar la dependencia del hook por `[ids.join('|')]`.

**2. Etiquetas y titulares generados que no cuadran con su contenido** · `app/[servicio]/page.tsx:66,250 y :65` · _bug_

Tres casos verificados contra content/servicios.ts. (1) `titulo={`Dudas sobre el ${servicio.nombreCorto.toLowerCase()}`}` produce 'Dudas sobre el autonivelantes' y 'Dudas sobre el alicatados', porque esos dos nombreCorto son plurales. (2) El ancla se llama siempre 'Ficha técnica' cuando conFicha es cierto, pero en microcemento el bloque que se pinta es `especificacion` con título 'Cuidado del microcemento': el usuario pulsa 'Ficha técnica' y aterriza en una tabla de mantenimiento. (3) El muestrario se anuncia como 'Modelos y colores' aunque hormigón pulido y microcemento tengan `modelos: []`, y en microcemento se pinta una única muestra de color dentro de una rejilla de cinco columnas.

→ Añadir al tipo Servicio un campo de titular de FAQ, derivar el texto del ancla de `fichaTecnica?.titulo ?? especificacion?.titulo`, y calcular antetítulo y ancla del muestrario según qué listas vengan llenas.

**3. Código muerto y props inertes repartidos por el sistema** · `components/ui/Boton.tsx:22, app/page.tsx:6, components/contenido/MuestraAcabado.tsx:5,20, components/layout/Logo.tsx:11, lib/schema.tsx:25` · _mantenibilidad_

Verificado uno a uno: la clase `btn-primario` de la variante primaria no existe en globals.css ni la genera Tailwind, y su única aparición en todo el repo es esa línea. `CabeceraSeccion` se importa en app/page.tsx y no se usa en sus 256 líneas (CLAUDE.md pide que el build pase sin warnings). La prop `activo` de MuestraAcabado, que reserva un uso del pigmento, no se pasa nunca: las diez apariciones de `activo=` son Chips y el BloquePosicion de las miniaturas. En Logo, `tamano === 'grande' ? 'text-26' : 'text-20'` colapsa 'medio' y 'pequeno' en el mismo valor, así que el `tamano={conScroll ? 'medio' : 'grande'}` de Cabecera.tsx:92 salta de 26 a 20 px de golpe y el valor 'medio' es código muerto. Y schemaServicio recibe un primer parámetro `servicio: ServicioId` que su cuerpo no referencia.

→ Borrar la clase y el import, decidir si `activo` se usa (marcar el modelo de la obra que se está viendo sería legítimo) o se retira, dar a 'medio' su propio escalón o eliminarlo del tipo, y reducir schemaServicio a `(servicio: Servicio)`.

**4. 27 MB en public/img, de los cuales 12 MB no los referencia nadie** · `public/img/` · _rendimiento_

Verificado: 81 ficheros y 27 MB en public/img; cruzando todas las rutas '/img/…' que aparecen en app/, components/, content/ y lib/ salen 36 referencias únicas, todas existentes (cero enlaces rotos), y quedan 45 ficheros huérfanos. Entre los más pesados del directorio están precisamente varios huérfanos (desactivado-paso-lateral.jpg, desactivado-camino-beige.jpg). next/image reoptimiza en ejecución, así que el usuario no baja el original, pero cada uno paga una transformación y el repositorio arrastra 27 MB. Al mismo tiempo, nueve de las quince obras tienen una sola foto y varias huérfanas encajan por técnica según su nombre.

→ Repartir las huérfanas útiles entre las obras con una sola foto, borrar el resto y reencodar los originales a 2400 px de ancho máximo (ninguna fuente debería pasar de 400 KB).

**5. El rate limit no protege nada y castiga al usuario legítimo** · `app/presupuesto/actions.ts:39-51 y :93-98` · _bug_

Cuatro problemas en veinte líneas, todos visibles en el código. El Map vive en el proceso: en serverless cada instancia tiene el suyo, así que el límite de 3/hora es decorativo. Nunca se purga: solo se filtran los timestamps de la IP que llega, las de IPs viejas se acumulan. La comprobación está en el paso 4, DESPUÉS de haber leído y codificado a base64 un fichero de hasta 10 MB (línea 89). Y el contador se consume antes de intentar el envío, así que un fallo de Resend gasta uno de los tres intentos y al tercero el usuario queda bloqueado una hora con un formulario que sí funcionaba. Con el fallback 'anonimo' de la línea 95, si no llega x-forwarded-for todos los visitantes comparten un cupo de tres.

→ Mover la comprobación antes de leer la foto, registrar el intento solo tras un envío correcto, purgar el Map, y con IP desconocida no aplicar límite en vez de agrupar a todo el mundo. Si se quiere que sirva de algo, almacén compartido.

**6. El teléfono que se manda a Meta CAPI va sin prefijo de país, y el token viaja en la URL** · `app/presupuesto/actions.ts:23,166 y lib/meta-capi.ts:29,37` · _bug_

El esquema normaliza el teléfono quitando el '34' inicial y deja nueve dígitos; ese es el valor que llega a enviarEventoCAPI y que hash() convierte en SHA-256. Meta exige E.164 sin '+', es decir con código de país: el hash de nueve dígitos no coincide con ningún perfil, así que el Lead llega con `ph` inútil y solo se puede atribuir por IP y user-agent. Se paga el coste de implementar CAPI sin obtener el beneficio. Aparte, el access token va como parámetro de query en la URL de graph.facebook.com (meta-capi.ts:37), donde acaba en logs de proxy y trazas de error; Meta lo acepta en el cuerpo precisamente por eso. Y `event_source_url` está escrito a mano como '/presupuesto/' (actions.ts:170), así que los leads del formulario corto de la home se atribuyen a la página equivocada.

→ Pasar `34${telefono}` al CAPI, mover el token al cuerpo JSON, y derivar la URL real del referer o de la variante.

**7. El desplegable de Servicios se abre y se cierra en el mismo toque en pantallas táctiles** · `components/layout/Cabecera.tsx:101-108` · _bug_

El <li> abre con onMouseEnter (línea 101) y el <button> alterna con onClick (línea 108). En un portátil o tablet táctil de 768 px o más —el menú es `hidden md:block`— un toque dispara primero mouseenter, que pone serviciosAbierto a true, y después click, que lo alterna a false: el desplegable se abre y se cierra en el mismo gesto y no hay forma de entrar en los siete servicios. En la misma zona, el botón de hamburguesa (líneas 177-187) lleva `aria-expanded` pero su onClick solo abre, y mientras el panel está abierto queda debajo de un `fixed inset-0`, así que anuncia un estado expandido sobre un control inalcanzable.

→ Abandonar el patrón hover y abrir solo con click/teclado (además es lo accesible), o ignorar el click cuando el puntero no sea fino. En el hamburguesa, cambiar aria-expanded por aria-haspopup="dialog".

**8. Filtro de precedencia frágil en la ficha de obra de móvil** · `app/proyectos/[slug]/page.tsx:77` · _mantenibilidad_

`filas.filter((r) => ['Técnica','Modelo','Color','Municipio','m²','Año'].includes(r.etiqueta) && !r.mono || ['m²'].includes(r.etiqueta))` mezcla && y || sin paréntesis. Funciona por accidente: se evalúa como `(incluida && !mono) || esM2`, y así descarta la fila 'Color' de dosificación (que es mono) y conserva la de proyecto.color, mientras la cláusula final rescata la fila 'm²' que `!r.mono` acababa de tirar. Es decir, depende de que existan dos filas con la misma etiqueta distinguidas solo por una bandera. Quien añada `mono: true` a Modelo o Municipio los perderá de la versión móvil sin entender por qué.

→ Marcar explícitamente las filas que van en móvil con una bandera propia en el objeto (`enMovil: true`) y filtrar por ella.

**9. El índice del blog es cliente entero y su estado vacío es inalcanzable** · `components/secciones/ListaArticulos.tsx:1,12-15,43 y app/blog/page.tsx:12` · _regla-proyecto_

Todo el índice —cabecera, h1, chips y rejilla— está dentro de un 'use client' para un filtro en memoria sobre cuatro artículos, y se le pasa el array `articulos` completo como prop, de modo que el cuerpo entero de los cuatro artículos viaja en el payload RSC sin pintarse (ListaArticulos solo usa slug, servicio, titulo, entradilla, fecha e imagen). Además `categorias` se deriva de los propios artículos, así que toda categoría seleccionable tiene al menos un artículo y `filtrados.length` nunca puede ser 0: el EstadoVacio de la línea 43 es código muerto. El equivalente de proyectos resuelve lo mismo con la URL, de modo que un filtro es enlazable; en el blog no.

→ Dejar cabecera y rejilla en servidor y leer el filtro de searchParams (o reducir el 'use client' a la fila de chips), y listar las categorías desde ORDEN_SERVICIOS como hace FiltrosProyectos, que vuelve el estado vacío alcanzable y útil.

**10. La ruta [servicio] atrapa cualquier URL de un segmento y la renderiza para dar 404** · `app/[servicio]/page.tsx:22-24` · _rendimiento_

Hay generateStaticParams con los siete ids, pero no se exporta `dynamicParams = false`; con el valor por defecto (true), cualquier ruta desconocida de un solo segmento —incluidas todas las de bots y escáneres— se renderiza bajo demanda en servidor hasta llegar a notFound(), en vez de resolverse como 404 estático. Lo mismo ocurre en las otras dos rutas dinámicas. En la misma línea, next.config.ts cubre servicios, fichas y artículos con 28 redirecciones cuyos destinos he comprobado que existen, pero no cubre las URLs /category/* del blog de WordPress.

→ Añadir `export const dynamicParams = false` en las tres rutas dinámicas y las redirecciones 301 de /category/* a /blog/.

## Lotes de cambio

Agrupación de todo el trabajo pendiente en lotes coherentes. `Choca con` marca los lotes que comparten
ficheros y por tanto **no pueden correr en paralelo** en la misma tanda de agentes.

### A · Servidor de conversión: consentimiento, entrega y validación

*Esfuerzo medio · impacto alto*

Que ningún lead se pierda en silencio, que no se cuenten conversiones falsas y que no se envíen datos personales a Meta sin consentimiento. Es el lote que más dinero mueve y no toca ni una línea de diseño.

- Propagar el consentimiento al servidor (cookie de primera parte desde Consentimiento.tsx) y condicionar enviarEventoCAPI a 'aceptado'
- Devolver un estado distinguible en el honeypot para que no dispare Lead ni conversión de Ads
- Devolver error cuando no hay ningún canal de entrega configurado en producción (hoy 'enviado' silencioso)
- Arreglar los dos mensajes de validación en inglés: z.enum para `espacio`, refine en vez de unión para `email`
- Añadir .max() a nombre y municipio, y colapsar saltos de línea en los campos que se interpolan en el asunto del email
- Rate limit: comprobar antes de leer la foto, registrar solo tras envío correcto, purgar el Map, no agrupar IPs desconocidas
- CAPI: teléfono en E.164 (34+9 dígitos), token en el cuerpo y no en la query, event_source_url real por variante
- Guardar el consentimiento con fecha y versión para poder caducarlo
- Ajustar bodySizeLimit para que quede por encima de FOTO_MAX_BYTES

**Ficheros:** `app/presupuesto/actions.ts`, `lib/meta-capi.ts`, `components/layout/Consentimiento.tsx`, `lib/eventos.ts`, `next.config.ts`

**Choca con:** B · Formulario en cliente: validación, foco y foto

### B · Formulario en cliente: validación, foco y foto

*Esfuerzo alto · impacto alto*

Reducir el abandono del formulario y hacerlo navegable con teclado y lector de pantalla. La pantalla de conversión es hoy la menos accesible del sitio.

- Extraer el esquema zod a lib/ y validar en el submit antes de subir el FormData con la foto
- Validar tipo y tamaño de la foto en el onChange y redimensionarla en cliente con canvas; añadir botón 'Quitar'
- Quitar focus-visible:outline-none de claseInput para que gane el foco global
- Que Campo inyecte aria-describedby a su control, y dar id y relación a los errores del fieldset de espacio y de privacidad
- Montar siempre el contenedor del error (vacío) para que aria-live anuncie, o usar role=alert
- Leer ?espacio= en servidor con searchParams y eliminar FormularioConEspacio y el Suspense
- Primera opción vacía y deshabilitada en el select del formulario corto
- Mover el foco al bloque de éxito y al error general; usar aria-disabled en vez de disabled en el botón que envía
- Retirar el pigmento de los asteriscos de obligatorio

**Ficheros:** `components/secciones/FormularioPresupuesto.tsx`, `components/ui/Campo.tsx`, `app/presupuesto/page.tsx`, `app/presupuesto/FormularioConEspacio.tsx`, `lib/esquema-presupuesto.ts (nuevo)`

**Choca con:** A · Servidor de conversión: consentimiento, entrega y validación, E · Color, foco y contraste, H · Imágenes: sizes por contexto y poda de public/img

### C · Índice de proyectos a servidor

*Esfuerzo medio · impacto alto*

Devolver al HTML estático los 15 enlaces a fichas (hoy invisibles para rastreadores y para el primer pintado), quitar el salto de layout y bajar el JS de la segunda ruta más pesada.

- Convertir la página en server component que lea searchParams y renderice la rejilla en servidor
- Dejar en cliente solo los controles (chips y hoja móvil)
- Trampa de foco y restauración del foco en la hoja móvil; hook compartido de bloqueo de scroll
- Quitar el pigmento de los tres chips de reset ('Todas', 'Todos')
- Sustituir los márgenes sueltos (mr-2, mx-3, ml-4) por subgrupos flex con su gap
- router.push en vez de replace para que Atrás deshaga un filtro
- Ordenar los municipios con localeCompare y rotular la opción vacía de año como 'Todos'
- Registrar el uso de filtros por registrarEvento

**Ficheros:** `app/proyectos/page.tsx`, `components/secciones/FiltrosProyectos.tsx`, `lib/datos.ts`

**Choca con:** G · SEO: metadatos, datos estructurados y sitemap, H · Imágenes: sizes por contexto y poda de public/img

### D · Ficha de obra: datos correctos y galería real

*Esfuerzo medio · impacto alto*

Arreglar los tres fallos verificados de la página que vende (clave duplicada, m² siempre pendiente, galería que no hace nada) y hacer legible la ficha en móvil.

- Renombrar la segunda fila 'Color' a 'Dosificación' y dar clave estable a FilaFicha
- No emitir la línea de m² sin dato, y usar DatoPendiente en vez de corchetes a mano
- Galería funcional (isla cliente con índice y miniaturas como button aria-pressed) o retirar contador y estado activo
- Sustituir el filtro con precedencia && / || por una bandera `enMovil` explícita en cada fila
- Una sola TarjetaProyecto responsive en lugar de duplicar por breakpoint (afecta también a home y servicio)
- Rellenar superficie y ficha donde se conozcan; repartir las fotos huérfanas entre las obras con una sola imagen

**Ficheros:** `app/proyectos/[slug]/page.tsx`, `components/datos/FichaObra.tsx`, `components/contenido/BloquePosicion.tsx`, `content/proyectos.json`

**Choca con:** C · Índice de proyectos a servidor, G · SEO: metadatos, datos estructurados y sitemap, H · Imágenes: sizes por contexto y poda de public/img, I · Bugs de maquetación puntuales

### E · Color, foco y contraste

*Esfuerzo medio · impacto alto*

Cerrar los tres fallos de contraste verificados con cálculo y dar una fuente única a la paleta antes de que empiecen los cambios de diseño.

- Quitar opacity-70 de DatoPendiente (2,91:1 → 5,31:1) en la rama clara
- Token de foco para contexto oscuro: clase .sobre-tinta en Pie, MenuMovil, LlamadaFinal oscura, banner y secciones tinta
- Retirar el pigmento del hover genérico (EnlaceEtiqueta, TarjetaProyecto, TarjetaArticulo, Migas, Cabecera) y dejarlo para el CTA y un estado activo por pantalla
- Usar pigmento-hover donde el acento cae sobre fondo-alt
- Fuente única de paleta: variables en canales rgb consumidas por Tailwind con <alpha-value>; documentar o convertir los data-URI
- Borrar la clase muerta btn-primario

**Ficheros:** `app/globals.css`, `tailwind.config.ts`, `components/datos/DatoPendiente.tsx`, `components/ui/Campo.tsx`, `app/layout.tsx`

**Choca con:** B · Formulario en cliente: validación, foco y foto, F · Cabecera, navegación y capas, J · Sistema tipográfico y tokens

### F · Cabecera, navegación y capas

*Esfuerzo alto · impacto alto*

Arreglar el bug de --cabecera-actual (que descuadra siete sticky y todas las anclas), unificar la navegación en un solo sitio y recortar el JS que se paga en las 16 rutas.

- Resolver las tres alturas de cabecera en CSS con la media query existente más una clase en <html>; eliminar el setProperty inline
- lib/navegacion.ts como fuente única para Cabecera, MenuMovil, Pie y los atajos del 404; derivar los servicios del menú móvil de ORDEN_SERVICIOS y TECNICA_CORTA
- Abrir el desplegable de Servicios solo con click/teclado; aria-haspopup en el hamburguesa
- Guardar y restaurar el foco al cerrar el menú móvil; marcar main/footer/barra con inert mientras está abierto
- min-h-tactil en los enlaces del pie (constante enlacePie), en las migas y en los secundarios del menú; min-h-tactil también en el CTA compactado
- Sustituir los mb/mt del pie y del menú por subgrupos con gap
- Partir Cabecera en cáscara de servidor + isla y cargar MenuMovil con next/dynamic
- Control visible de 'Cambiar preferencias de cookies' en el pie y en la política
- tabIndex y scroll-margin en #contenido para que el enlace de salto aterrice bien

**Ficheros:** `components/layout/Cabecera.tsx`, `components/layout/MenuMovil.tsx`, `components/layout/Pie.tsx`, `components/layout/Migas.tsx`, `lib/navegacion.ts (nuevo)`, `app/globals.css`, `app/layout.tsx`, `app/not-found.tsx`

**Choca con:** E · Color, foco y contraste, G · SEO: metadatos, datos estructurados y sitemap

### G · SEO: metadatos, datos estructurados y sitemap

*Esfuerzo medio · impacto alto*

Que un enlace compartido por WhatsApp muestre foto y título, que el sitio tenga favicon y que el marcado que ya está escrito se emita.

- openGraph y twitter en el layout más imagen por defecto; sobrescribir images con la foto real en las tres rutas dinámicas
- Helper lib/meta.ts para que ninguna página nueva pueda quedarse sin canonical ni sin og
- Icono del sitio (app/icon.svg y apple-icon) y logo de organización para el publisher del BlogPosting
- Quitar el canonical '/' heredable del layout
- Cablear schemaFAQ en SeccionFAQ (la guarda de null lo hace seguro desde hoy)
- @id en el negocio local y referenciarlo desde el provider de schemaServicio; reducir su firma a (servicio: Servicio)
- BlogPosting con image y dateModified; time con dateTime en las fechas
- JSON-LD propio de la ficha de obra (ImageObject + servicio acotado al municipio)
- Migas en /proyectos/ y /blog/, únicas páginas de segundo nivel sin ellas
- dynamicParams = false en las tres rutas dinámicas; redirecciones de /category/*; bloquear indexación fuera de producción
- Corregir la meta description de obra, que repite el tipo de espacio dos veces

**Ficheros:** `app/layout.tsx`, `lib/meta.ts (nuevo)`, `lib/schema.tsx`, `app/icon.svg (nuevo)`, `app/[servicio]/page.tsx`, `app/proyectos/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/proyectos/page.tsx`, `app/blog/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/secciones/SeccionFAQ.tsx`

**Choca con:** C · Índice de proyectos a servidor, D · Ficha de obra: datos correctos y galería real, F · Cabecera, navegación y capas, K · Contenido: copy a content/, FAQ y legales

### H · Imágenes: sizes por contexto y poda de public/img

*Esfuerzo bajo · impacto alto*

Dejar de servir imágenes de 3 a 6 veces más grandes de lo pintado en las pantallas con más fotos, y quitar 12 MB de ficheros que no usa nadie.

- Prop `sizes` en BloquePosicion con el valor actual por defecto y el real en cada uno de los 12 llamadores
- Borrar los 45 ficheros huérfanos y reencodar los originales a 2400 px / calidad 80
- Convertir portada.png (PNG usado como foto de obra) a JPEG
- Marcar los placeholders (trama, muestras, hueco de Kit Digital) como decorativos para que no se anuncien al lector de pantalla
- Limpiar las props muertas de los llamadores (aviso y sinAviso donde ya hay src)

**Ficheros:** `components/contenido/BloquePosicion.tsx`, `app/page.tsx`, `app/[servicio]/page.tsx`, `app/proyectos/[slug]/page.tsx`, `app/empresa/page.tsx`, `app/blog/[slug]/page.tsx`, `components/contenido/TarjetaProyecto.tsx`, `components/contenido/TarjetaArticulo.tsx`, `components/secciones/FiltrosProyectos.tsx`, `public/img/`

**Choca con:** B · Formulario en cliente: validación, foco y foto, C · Índice de proyectos a servidor, D · Ficha de obra: datos correctos y galería real, I · Bugs de maquetación puntuales, L · Responsive: breakpoint intermedio

### I · Bugs de maquetación puntuales

*Esfuerzo bajo · impacto medio*

Seis correcciones independientes y pequeñas, todas verificadas. Es el lote más barato y el más fácil de paralelizar si no coincide con otros en el mismo fichero.

- Separadores de la fila de servicios: mover los bordes al <li> o usar índice en vez de last:
- Quitar el !border-0 que anula el borde del hero móvil, y el md:p-2 que no hace nada
- Pista central del artículo a minmax(0, 680px) y w-full max-w-[480px] en la 404
- Logo: dar su propio escalón a 'medio' o eliminarlo del tipo
- Memorizar las ids del scroll-spy o usar dependencia estable en useSeccionActiva
- Borrar el import muerto de CabeceraSeccion en la home

**Ficheros:** `app/page.tsx`, `app/not-found.tsx`, `app/blog/[slug]/page.tsx`, `components/layout/Logo.tsx`, `components/ui/useSeccionActiva.ts`, `components/secciones/SubmenuServicio.tsx`, `components/secciones/IndiceAnclas.tsx`

**Choca con:** D · Ficha de obra: datos correctos y galería real, H · Imágenes: sizes por contexto y poda de public/img, J · Sistema tipográfico y tokens, K · Contenido: copy a content/, FAQ y legales, L · Responsive: breakpoint intermedio

### J · Sistema tipográfico y tokens

*Esfuerzo medio · impacto medio*

Que la escala del config describa lo que de verdad se ve, para que ajustar el ritmo de los titulares sea cambiar tres números y no buscar leading-[0.98] en doce ficheros.

- Fijar en los tokens de fontSize el leading y el tracking que de verdad se usan y borrar las 49 clases arbitrarias
- Adoptar max-w-lectura, aspect-21/9 y aspect-16/7 (hoy con 0 usos) o borrarlos del config
- Extraer una primitiva Rotulo para el patrón mono + versalitas + tracking, copiado en más de diez sitios y ya duplicado como componente local en Pie y FiltrosProyectos
- Prop `tamano` en Boton y retirar los cinco className='md:!px-8'
- Base de chip compartida entre Chip, claseChip del formulario y claseSelect de filtros
- Tokens para las medidas escritas a mano (altura del summary del acordeón, ritmo 'corto' de Seccion, escala de z-index)

**Ficheros:** `tailwind.config.ts`, `app/page.tsx`, `app/[servicio]/page.tsx`, `app/empresa/page.tsx`, `app/proyectos/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `components/ui/Seccion.tsx`, `components/ui/AntetituloSeccion.tsx`, `components/datos/EtiquetaTecnica.tsx`, `components/datos/FichaObra.tsx`

**Choca con:** E · Color, foco y contraste, I · Bugs de maquetación puntuales, K · Contenido: copy a content/, FAQ y legales, L · Responsive: breakpoint intermedio

### K · Contenido: copy a content/, FAQ y legales

*Esfuerzo alto · impacto alto*

Sacar el copy del JSX para que cada cambio de texto sea una línea de datos y no una edición de spans anidados. Es el habilitador de todo el trabajo de redacción que viene.

- Mover el copy de la home y de empresa a content/ con campos explícitos movil y escritorio
- Un único componente TextoResponsive en lugar de los spans hidden md:inline repartidos (112 apariciones)
- Redactar las 29 respuestas de FAQ (5 en home, 24 en servicios) y pasar primeraAbierta={false} mientras no las haya
- Campo de titular de FAQ por servicio ('Dudas sobre el autonivelantes'), ancla derivada del título real de la ficha, y muestrario rotulado según qué listas vengan llenas
- Ampliar SeccionLegal con párrafos y listas para que el texto legal quepa cuando llegue
- Componer la ubicación del hero desde lib/config.ts y leer los claims de empresa desde claims.repiten / claims.garantia
- Derivar el número de servicio del índice de ORDEN_SERVICIOS en vez de duplicarlo en el contenido

**Ficheros:** `content/home.ts`, `content/empresa.ts (nuevo)`, `content/servicios.ts`, `app/page.tsx`, `app/empresa/page.tsx`, `app/[servicio]/page.tsx`, `components/secciones/PlantillaLegal.tsx`, `lib/tipos.ts`, `components/secciones/Acordeon.tsx`

**Choca con:** G · SEO: metadatos, datos estructurados y sitemap, I · Bugs de maquetación puntuales, J · Sistema tipográfico y tokens, L · Responsive: breakpoint intermedio

### L · Responsive: breakpoint intermedio

*Esfuerzo medio · impacto alto*

Arreglar de raíz el rango 768-1050 px, donde el layout de escritorio entra entero en un contenedor que no le cabe (muestras de color de 10 px, columnas de texto de 192 px).

- Declarar `screens` con un lg a 1024 px en tailwind.config.ts
- Mover a lg las siete rejillas md:grid-cols-[400px_1fr], las dos md:grid-cols-[1fr_400px] y la del artículo, dejando md en una columna
- Cambiar las pistas fijas por minmax(0, …) y añadir min-w-0 donde haga falta
- Rejillas que no dependan del número exacto de elementos (hoy grid-cols-6, -10, -5, -3, -4 cableados al contenido)
- Tabla de ficha técnica única y desplazable en móvil, en vez de dos representaciones con contenido distinto

**Ficheros:** `tailwind.config.ts`, `components/secciones/SeccionMuestrario.tsx`, `components/secciones/SeccionFAQ.tsx`, `app/[servicio]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/proyectos/[slug]/page.tsx`, `app/presupuesto/page.tsx`, `app/empresa/page.tsx`

**Choca con:** H · Imágenes: sizes por contexto y poda de public/img, I · Bugs de maquetación puntuales, J · Sistema tipográfico y tokens, K · Contenido: copy a content/, FAQ y legales

### M · Validación de datos y barandillas de build

*Esfuerzo medio · impacto medio*

Convertir las reglas del proyecto y los errores de contenido en fallos de build, que es la única forma de que sobrevivan a una tanda grande de cambios.

- Esquema zod de Proyecto y .parse() en lib/datos.ts para sustituir el cast a ciegas
- Regla de lint que prohíba text-[Npx], leading-[…], tracking-[…] y los márgenes direccionales fuera de una lista corta de excepciones
- Comprobación del presupuesto de JS leyendo .next/app-build-manifest.json, con el umbral que decida el usuario
- Test de contraste sobre los pares de tokens de la paleta

**Ficheros:** `lib/datos.ts`, `lib/tipos.ts`, `content/proyectos.json`, `package.json`, `.eslintrc.json`

**Choca con:** C · Índice de proyectos a servidor, D · Ficha de obra: datos correctos y galería real, J · Sistema tipográfico y tokens

## Zonas delicadas

Sitios donde un cambio descuidado rompe algo que no se ve en el fichero editado.

### La variable --cabecera-actual
`components/layout/Cabecera.tsx:45-48, app/globals.css:17-30, tailwind.config.ts:58-63`

De ella cuelgan el scroll-margin de TODAS las anclas (vía --ancla-offset) y siete posiciones sticky: el submenú de servicio, la barra de filtros y cuatro asides. El valor vive a la vez en tokens de Tailwind, en variables CSS con media query y en un estilo inline que Cabecera escribe sobre documentElement y que pisa a los otros dos. Tocar uno solo de los tres descoloca el submenú o deja las anclas desplazadas, y el síntoma aparece en páginas que no se han editado.

### tailwind.config.ts reemplaza, no extiende
`tailwind.config.ts:11-53`

`colors`, `fontSize`, `borderRadius`, `boxShadow` y `fontFamily` están fuera de `extend`: fuera de esos tokens no existe nada. Una clase no declarada (text-base, text-sm, rounded-md) no genera CSS y no da error de build: el texto se queda al 16 px heredado del body y nadie se entera. Al revés, cambiar el NOMBRE de un token rompe el sitio entero de golpe.

### Los slugs son el contrato con las 301 de WordPress
`next.config.ts:27-62 y content/proyectos.json`

Los 15 slugs de obra y los 4 de artículo son destino de las 28 redirecciones de next.config.ts, cuyos destinos he comprobado uno a uno que existen. Renombrar un slug sin tocar la redirección deja el enlace histórico apuntando a un 404 y pierde el enlace entrante. Dos slugs ya no cuadran con su dato (hormigon-pulido-alicante tiene municipio Benissa; hormigon-impreso-montaberner declara Montaverner) y aun así no se pueden corregir sin añadir una segunda 301.

### Añadir o quitar un servicio
`lib/tipos.ts:6-57, components/layout/MenuMovil.tsx:10-15, app/not-found.tsx:4-8`

Hay que tocar a la vez ServicioId, TECNICA_CORTA, NOMBRE_SERVICIO, RUTA_SERVICIO y ORDEN_SERVICIOS, más content/servicios.ts y la redirección. TypeScript avisa de los Record pero no de que falte en ORDEN_SERVICIOS. Y además hay dos listas paralelas escritas a mano que no se derivan de nada: los servicios principales y secundarios del menú móvil, y los tres atajos del 404. Un servicio nuevo aparece en escritorio y en el pie pero no en el menú móvil.

### Añadir o quitar un campo del formulario
`components/secciones/FormularioPresupuesto.tsx:131-303 y app/presupuesto/actions.ts:18-37,76-91,112-121,145-151,178-184`

El campo se pierde en silencio si no se toca en los cinco sitios: el JSX, el esquema zod, el cuerpo del email de Resend, el aviso de Telegram y el resumen del estado de éxito. Si además es obligatorio solo en la variante completa, hay que añadirlo al bloque manual que comprueba `variante === 'completo'`, porque zod no distingue variantes. Y el campo hidden `variante` viene del cliente: mandando 'corto' desde /presupuesto/ se entrega un lead sin municipio y sin el consentimiento de privacidad.

### Renombrar un espacio de 'Qué quieres pavimentar'
`content/home.ts:11-62, app/page.tsx:82-86, components/secciones/FormularioPresupuesto.tsx:41,194,312`

NOMBRES_ESPACIOS alimenta a la vez los chips del formulario completo, el select del corto, el validador del servidor y los seis enlaces /presupuesto/?espacio= de la home. Si se renombra uno, los enlaces ya compartidos o indexados dejan de coincidir y el chip no se preselecciona: falla en silencio, sin error ni aviso. Además la rejilla de la home está cableada a seis columnas.

### Las rejillas están cuadradas al número exacto de elementos
`app/page.tsx:82,110,139,145; components/secciones/SeccionMuestrario.tsx:37,49; app/empresa/page.tsx:110,115`

md:grid-cols-6 para los seis espacios, md:grid-cols-3 para los tres servicios fuertes, md:grid-cols-4 para los cuatro del resto, md:grid-cols-5 para los cinco modelos y md:grid-cols-10 para los diez colores, md:grid-cols-5 para los cinco valores de empresa. Añadir o quitar un elemento deja la fila coja, y en varios casos el padding depende de la posición (i === 0 / i === length-1), así que hay que tocar dos cosas.

### Los `last:` y los `<li className="contents">`
`app/page.tsx:141-146,175; app/[servicio]/page.tsx:230; app/proyectos/[slug]/page.tsx:191; components/secciones/PlantillaLegal.tsx:103`

display:contents saca al <li> del árbol de cajas pero no del DOM, así que un hijo único siempre cumple :last-child: el patrón ya ha producido un bug real (los separadores de servicios que no se pintan) y el mismo `contents` se usa en otras cuatro rejillas para poder duplicar tarjetas por breakpoint. Además varios navegadores sacan del árbol de accesibilidad los elementos con display:contents, de modo que la lista puede no anunciarse.

### El foco global es :where() y cualquier componente lo pisa
`app/globals.css:73-76, components/ui/Campo.tsx:9, components/secciones/FormularioPresupuesto.tsx:20,239`

La regla tiene especificidad 0 a propósito, para permitir overrides. El precio es que un `outline-none` en un componente la anula sin dejar rastro: ya pasa en Campo, y el formulario ha tenido que reimplementar el foco dos veces por su cuenta (peer-focus-visible en los chips, has-[:focus-visible] en el control de foto). Un cambio global del estilo de foco no llega a los formularios.

### Los dos overlays escriben document.body.style.overflow sin contador
`components/layout/MenuMovil.tsx:22,46 y components/secciones/FiltrosProyectos.tsx:74,81`

El menú móvil y la hoja de filtros lo hacen cada uno por su cuenta. Si se abren y cierran en cruce, el primero en desmontarse restaura el scroll mientras el otro sigue abierto. Y poner overflow:hidden en body no bloquea el scroll en Safari iOS, que es medio tráfico de este sitio.

### El z-index depende de dónde vive el componente
`components/layout/Cabecera.tsx:86,191; components/layout/MenuMovil.tsx:57; components/secciones/FiltrosProyectos.tsx:173`

MenuMovil se renderiza como hijo del <header>, que es sticky z-30 y por tanto crea contexto de apilamiento: su z-40 vale 30 a nivel de página. Hoy funciona porque la barra fija es z-20 y el banner z-[25], pero la hoja de filtros es z-40 real y se pintaría por encima del menú. Los cinco valores (20, 25, 30, 40, 50) están sueltos por el código, dos como valores arbitrarios.

### Un solo breakpoint para 529 decisiones
`tailwind.config.ts (sin clave screens), app/globals.css:25-30, components/layout/Cabecera.tsx:46`

No hay `screens` declarado y el código usa exclusivamente `md`. Mover ese corte, o abrir uno nuevo, obliga a revisar también la media query de globals.css:25-30 (donde cambian --cabecera-actual y --submenu) y el matchMedia('(max-width: 767px)') escrito a mano en Cabecera.tsx:46. Los tres tienen que moverse a la vez.

### El `sizes` único de BloquePosicion
`components/contenido/BloquePosicion.tsx:38`

Es la única puerta de entrada de toda imagen del sitio y su `sizes` está codificado para el caso hero. Convertirlo en prop sin pasar el valor real desde los doce llamadores no cambia nada; cambiar el valor por defecto afecta a la vez a home, servicios, proyectos, blog y empresa.

## Correcciones del crítico

El crítico verificó 27 afirmaciones del mapa abriendo el código: las 27 se sostienen, y el `.next`
del que salen las medidas es fresco. Lo que sí corrigió:

### Lote L: «Declarar `screens` con un lg a 1024 px en tailwind.config.ts»

El diagnóstico (el estrangulamiento entre 768 y ~1050 px) es correcto y lo he reproducido leyendo las rejillas. La prescripción no. Verificado en tailwind.config.ts (76 líneas, leído entero): NO hay clave `screens` en ninguna parte, ni dentro ni fuera de `extend`. Eso significa que los breakpoints por defecto de Tailwind siguen activos: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. `lg:` YA funciona hoy sin tocar el config. Peor: este config declara `colors`, `borderRadius`, `boxShadow`, `fontFamily` y `fontSize` FUERA de `extend` (líneas 13, 26, 27, 32, 37), es decir reemplazando. Un agente que siga la instrucción al pie de la letra y añada `screens: { lg: '1024px' }` con ese mismo estilo BORRARÁ sm, md, xl y 2xl, y con md fuera las 529 clases `md:` del sitio dejan de generar CSS. El arreglo real es: no tocar el config y empezar a escribir `lg:` en las ocho rejillas.

### «Tres chips en pigmento a la vez… Detrás queda además el chip 'Filtrar' de la barra (línea 161)»

La parte central se sostiene y la he verificado: FiltrosProyectos.tsx:93, :200 y :213 son tres chips de reset con `activo={!filtros.tecnica}`, `activo={!filtros.municipio}` y `activo={!filtros.anio}`, y Chip.tsx:25-28 pinta el activo no-mono como `bg-pigmento border-pigmento text-sobre-tinta`. El añadido del cuarto chip es falso. La línea 161 es `<Chip activo={activos > 0} onClick={() => setHojaAbierta(true)} …>`: en el estado por defecto —sin filtros, que es justo el estado en el que los otros tres están activos— `activos` vale 0 y el chip 'Filtrar' NO es pigmento. Y cuando sí lo es (con filtros puestos) la hoja está cerrada, así que nunca coexiste con los otros tres. Son tres, no cuatro.

### La justificación «CLAUDE.md exige que `npm run build` pase sin warnings», usada para sostener la clave duplicada y el import muerto

Los dos defectos de código existen y los he confirmado uno a uno (clave duplicada 'Color' en app/proyectos/[slug]/page.tsx:64 y :70 consumidas por FichaObra.tsx:36 `key={fila.etiqueta}`; import sin usar en app/page.tsx:6 `import Seccion, { CabeceraSeccion }` con cero usos de CabeceraSeccion en las 256 líneas; parámetro `servicio` sin referenciar en lib/schema.tsx:27-37). Lo que no se sostiene es que hoy produzcan un warning de build. Verificado: tsconfig.json NO tiene `noUnusedLocals` ni `noUnusedParameters` (solo `strict: true`), así que el import y el parámetro no generan nada; y .eslintrc.json es literalmente `{"extends": "next/core-web-vitals"}`, que no activa `@typescript-eslint/no-unused-vars`. La clave duplicada es un warning de consola de React en render, no de build. Además nadie ha ejecutado `npm run build` ni `npm run lint` en esta revisión: la afirmación es una inferencia, no una observación.

### Los recuentos citados como verificados: «49 interlineados arbitrarios», «112 apariciones de hidden md:*», «32 márgenes direccionales»

Reproducidos con grep sobre app/ y components/: `leading-\[…\]` da 59 apariciones, no 49. `hidden md:[a-z-]+` más `md:hidden` da 111, no 112. Los márgenes direccionales excluyendo `m[trblxy]-0` dan 57 brutos, no 32 (el mapa dice haber descartado los legítimos, pero no dice cuáles ni deja la cuenta reproducible). La dirección de los tres hallazgos es correcta y los defectos son reales; el problema es que los lotes J y el de márgenes dicen «sustituir los 49» y «quedan ~18 infracciones reales», y un agente que cierre el lote cuando el contador llegue a cero dejará trabajo sin hacer. Los números no deben usarse como criterio de terminado.

### El arreglo propuesto para TablaFichaTecnica («tabla única, desplazable en horizontal en móvil») sobredimensiona el trabajo

El bug es real y lo confirmo: TablaFichaTecnica.tsx:11-17 construye `notas` con `f.valores[i+1]`, nunca con `f.parametro`, y lo recorta con `.slice(0, 4)`, de modo que en móvil se pierde el nombre del parámetro. Pero el arreglo ya está medio escrito: la línea 43 es `<div className="hidden md:block overflow-x-auto">`. El envoltorio de desplazamiento horizontal EXISTE. El cambio es quitar `hidden md:block` (y, si se quiere, fijar la primera columna), no construir un scroll nuevo. El lote lo lista como trabajo de rejilla responsive cuando son dos clases.

**Verificado por mi parte después:** `tailwind.config.ts` no declara `screens`, así que los breakpoints
por defecto de Tailwind siguen activos y `lg:` ya funciona hoy — hay 0 usos en el proyecto. Añadir
`screens` al estilo del resto del config (fuera de `extend`) borraría `md` y con él las 529 clases `md:`
del sitio. El lote L se hace escribiendo `lg:`, sin tocar el config.

**También verificado:** `npm run build` y `npm run lint` pasan limpios hoy. Los hallazgos que se
argumentaban sobre «warnings de build» (import muerto, parámetro sin usar, clave duplicada) son defectos
reales, pero hoy no emiten ningún warning: `tsconfig.json` no tiene `noUnusedLocals` y `.eslintrc.json`
es solo `next/core-web-vitals`. Si se quieren como puerta, hay que activarlos (lote M).

**Sobre los recuentos:** `leading-[…]` da 59 apariciones, no 49; `hidden md:*` más `md:hidden` da 111, no
112; los márgenes direccionales dan 57 en bruto. Los números sirven para dimensionar, no como criterio de
terminado: un agente que cierre el lote al llegar a cero dejará trabajo sin hacer.

## Huecos de cobertura

Categorías del frontend que ningún mapeador tocó. Hay que cerrarlas antes o durante la tanda.

### No existe ni un error.tsx, global-error.tsx ni loading.tsx en todo el proyecto, y ninguno de los diez mapeadores lo menciona

Verificado con find sobre app/: cero coincidencias de error.tsx, global-error.tsx, loading.tsx, template.tsx, opengraph-image.tsx, manifest.ts, icon.tsx y apple-icon.tsx. Es una categoría entera de pantallas sin diseñar. Hoy cualquier excepción en un componente de servidor —y hay vías abiertas: lib/datos.ts:8 castea el JSON sin validar, así que un `servicio` mal escrito hace que NOMBRE_SERVICIO[proyecto.servicio] sea undefined— pinta la pantalla de error por defecto de Next: sin cabecera, sin pie, sin la paleta, en inglés y con el aspecto de una app rota. Exactamente lo contrario de lo que vende un negocio de obra. El único notFound() está cubierto por app/not-found.tsx, que además no exporta metadata y hereda el canonical '/' del layout. Y con una tanda grande de cambios por delante, la probabilidad de que algo lance sube, no baja.

→ Añadir app/error.tsx y app/global-error.tsx con el mismo lenguaje visual que app/not-found.tsx (ambos son obligatoriamente 'use client', así que hay que contarlos en el presupuesto de JS), y decidir si hace falta loading.tsx en las rutas que pasen a dinámicas. Dar metadata propia a not-found.tsx. Meterlo en el mismo lote que el arreglo del canonical heredable (lote G).

### app/fuentes.ts no lo ha abierto nadie: cero menciones en el mapa completo

Es el fichero que gobierna las tres familias del sistema tipográfico —el sistema que el lote J quiere reformar— y nadie lo ha leído. Contiene una decisión con consecuencia medible: la línea 19 pone `adjustFontFallback: false` en la familia display, cuyo fallback declarado es `['Impact', 'Arial Narrow', 'sans-serif']` (línea 20), con el comentario «next/font aún no tiene métricas de esta familia». Sin ajuste de métricas, el h1 a 88 px de la home y los 64 px de cada titular se pintan primero en Impact y saltan al llegar Big Shoulders: es CLS sobre el elemento LCP de todas las páginas. Además el debate del presupuesto de rendimiento se ha librado entero sobre JS (114 KB, 100 KB de suelo) sin contar ni un byte de fuentes: aquí se cargan Big Shoulders variable con eje opsz, Barlow en tres pesos (400/500/600) y Overpass Mono en dos (400/500). Ninguna medición del mapa incluye eso.

→ Medir el peso real de los woff2 en .next/static/media y sumarlo al presupuesto antes de decidir el techo con el usuario. Evaluar bajar Barlow a dos pesos y definir un fallback con `size-adjust`/`ascent-override` a mano para la display, o aceptar el CLS explícitamente y documentarlo.

### next.config.ts no declara ninguna cabecera HTTP, y nadie lo ha mirado

Leído entero: solo `trailingSlash`, `images.formats`, `experimental.serverActions.bodySizeLimit` y 28 redirecciones. Cero `headers()`, cero `poweredByHeader: false`. No hay Content-Security-Policy, ni X-Content-Type-Options, ni Referrer-Policy, ni Permissions-Policy. Importa ahora y no después por una razón concreta: Consentimiento.tsx inyecta dos bloques de script en línea (`gtag-init` en la línea 48 y `meta-pixel` en la 58). El día que se añada una CSP habrá que darles nonce o hash, y eso obliga a tocar Consentimiento y probablemente a pasar a middleware. Decidirlo antes de reescribir ese componente en el lote A es mucho más barato que después. También afecta al Referrer-Policy, que es lo que determina qué referer recibe el CAPI, algo que el lote A quiere usar para derivar `event_source_url`.

→ Decidir si entra CSP en esta tanda. Si entra, resolverlo en el lote A junto con el consentimiento: nonce por petición vía middleware, y los scripts de terceros declarados explícitamente. Si no entra, añadir al menos las cabeceras que no rompen nada (X-Content-Type-Options, Referrer-Policy, poweredByHeader: false) y dejar escrito que la CSP queda pendiente.

### Cero estilos de impresión y cero previsión de `forced-colors` o `prefers-color-scheme`

Verificado por grep sobre app/, components/ y lib/: ni una aparición de `@media print`, `prefers-color-scheme`, `forced-colors` ni `dark:`. app/globals.css (135 líneas, leído entero) solo cubre `prefers-reduced-motion`. Imprimir es un caso real aquí: un presupuesto o una ficha de obra es justo lo que un cliente de reforma imprime o guarda en PDF para enseñárselo a su pareja o a su comunidad. Hoy al imprimir salen la cabecera pegajosa, la BarraMovil fija (z-20, y es el único elemento con sombra del sitio), el banner de cookies si está pendiente, y los bloques `bg-tinta` a página completa en negro. En modo de alto contraste de Windows el problema es el inverso: los fondos `bg-tinta` se pierden y todo el patrón `sobreOscuro` —que es como este sistema resuelve el tema oscuro, según su propio mapa mental— queda con texto claro sobre fondo del sistema. El mapa trata «tema oscuro» solo como la prop `sobreOscuro` y nunca sale del navegador en condiciones normales.

→ Una hoja de impresión corta en globals.css (ocultar cabecera, BarraMovil, banner, submenús y filtros; forzar fondos claros y mostrar las URL de los enlaces) y una pasada de `forced-colors: active` sobre los contenedores `bg-tinta` y sobre el foco. Cabe en el lote E, que ya toca globals.css y el foco.

### `--ancla-offset` suma `--submenu` también en las páginas que no tienen submenú

app/globals.css:22 define `--ancla-offset: calc(var(--cabecera-actual) + var(--submenu) + 24px)` y `--submenu` vale 48 px en móvil y 56 px desde 768 px (líneas 21 y 28), siempre, sin condición. La regla de la línea 92 aplica ese offset a TODO `[id^='seccion-']`. He inventariado los ids: son 'seccion-*' en app/[servicio]/page.tsx (7), en las tres legales vía PlantillaLegal (12 en total) y en el artículo, donde blog/[slug]/page.tsx:57 y :66 generan `seccion-${b.id}` para cada h2. Pero SubmenuServicio solo existe en /[servicio]/. Es decir: en el artículo y en las tres páginas legales, cada salto desde el índice de anclas deja el titular 56 px por debajo de donde debería, un hueco en blanco del tamaño de una barra que no está. El mapa marca `--cabecera-actual` como zona delicada y enumera las siete posiciones sticky que cuelgan de ella, pero nadie se ha fijado en que el otro sumando es incondicional. Si el lote F reescribe las alturas de cabecera en CSS sin ver esto, lo arrastra.

→ Separar el offset: `--ancla-offset` sin submenú por defecto y un `--ancla-offset` mayor solo bajo un contenedor o data-attribute de las páginas de servicio. Va en el lote F, en la misma edición que elimina el setProperty en línea de Cabecera.tsx:45-48.

### Nadie ha ejecutado `npm run build` ni `npm run lint`: todo lo que el mapa dice del build es inferencia sobre un directorio .next preexistente

He comprobado que ese .next es fiable —`find … -newer .next/app-build-manifest.json` sobre app/, components/, lib/, content/, tailwind.config.ts y next.config.ts devuelve cero ficheros, así que el build corresponde al código actual— y he reproducido sus mediciones: 114,2 KB gz en /, 113,2 en /proyectos/, 110,6 en /layout y 100,2 en /robots.txt/route, todas dentro de 0,2 KB de lo que afirma el mapa. Eso valida las cifras. Lo que NO valida es la puerta que CLAUDE.md pone antes de cada commit: «npm run build debe pasar sin warnings». Nadie sabe si pasa hoy. Y hay un riesgo concreto de herramienta: el proyecto trae eslint ^9 con un `.eslintrc.json` en formato antiguo, y next 15.5, donde `next lint` está en camino de desaparecer. Si `npm run lint` ya falla o avisa hoy, cada agente del ultracode va a creer que lo ha roto él.

→ Antes de repartir trabajo, ejecutar una vez `npm run build` y `npm run lint` y guardar la salida como línea base: qué warnings existen ya, y si lint arranca siquiera. Es la única medición que este informe no ha podido hacer por la restricción de solo lectura, y es la que convierte «sin warnings» en un criterio verificable en vez de en una aspiración.

### El lote C cambia el modo de render de /proyectos/ de estático a dinámico y no lo dice

El hallazgo es correcto y lo he verificado sobre el HTML: .next/server/app/proyectos.html tiene 49.944 bytes, contiene `Proyectos</h1>` y CERO coincidencias de `href="/proyectos/<slug>/"` y CERO de 'Filtrar'. Pero el arreglo propuesto —«convertir la página en server component que lea searchParams»— tiene una consecuencia que el plan no nombra: en Next 15, leer `searchParams` en una página la vuelve dinámica. Ese fichero proyectos.html deja de existir y la ruta pasa a renderizarse por petición. El propio mapa mental dice «Next.js 15 con App Router, todo SSG», y el sitio es una web local que probablemente vive en un plan estático. Es un cambio de arquitectura disfrazado de arreglo de SEO. Existe una tercera vía que nadie ha planteado: prerenderizar la rejilla completa sin filtrar en servidor y que el componente cliente solo oculte/reordene, con lo que se conservan los 15 enlaces en el HTML, el estático y el filtro enlazable por URL.

→ Antes de asignar el lote C, decidir explícitamente entre las tres opciones (dinámica con searchParams / estática con filtrado en cliente sobre una rejilla ya pintada / fallback en el Suspense como parche) y escribir cuál, porque la elección determina también si el sitio puede seguir exportándose estático. Nota: el Suspense hermano de /presupuesto/ SÍ tiene fallback y sí prerenderiza; lo he confirmado contra .next/server/app/presupuesto.html, que contiene name="nombre", name="telefono", name="municipio" y siete apariciones de name="espacio".

### El formulario sin JS no lo ha ejercitado nadie, y tiene `noValidate`

FormularioPresupuesto.tsx:115 pone `noValidate` en el <form>, mientras los inputs llevan `required` (líneas 136, 149, 177, 202). Con JS eso es coherente: la validación la hace el servidor y el comentario de las líneas 52-56 explica la decisión de enviar por transición para no vaciar el formulario. Sin JS el efecto es distinto y nadie lo ha mirado: `noValidate` también desactiva la validación nativa del navegador, así que un visitante sin JS envía el formulario vacío, hace un viaje completo al servidor y vuelve con los errores; y `evento_id` viaja vacío porque se genera en un useEffect (líneas 44-46), de modo que el Lead del Pixel y el del CAPI no se deduplican. El lote B da por bueno el camino sin JS («Sin JS, el atributo action sigue funcionando», comentario del propio código) sin haberlo recorrido. Es la pantalla que convierte.

→ Recorrer el formulario con JS desactivado antes de tocarlo: comprobar qué se ve tras un error, si se pierde lo tecleado, dónde aterriza el foco y qué pasa con la foto. Luego decidir si `noValidate` se mantiene (y se acepta el viaje al servidor) o se retira cuando no hay JS. Va en el lote B, como paso previo a todo lo demás.

### Cinco ficheros que el mapa nombra de pasada pero que nadie ha abierto: BarraConfianza, LlamadaFinal, EstadoVacio, lib/texto.ts y, del todo ausente, app/fuentes.ts

Al leerlos aparece al menos una infracción de las reglas del proyecto que nadie ha registrado. components/layout/BarraConfianza.tsx:4-8 escribe a mano las tres cifras de cabecera del negocio —'+15' / 'años de oficio', '10' / 'años de garantía con mantenimiento', '+30 %' / 'de clientes repiten'— cuando lib/config.ts:47-52 YA las guarda como `claims.anios`, `claims.garantia` y `claims.repiten`, con los mismos textos. Son dos fuentes de verdad para los números que el negocio usa como prueba, en el componente que los pinta en la home, y contra la convención que el propio mapa declara ('lib/config.ts es el NAP único… nadie escribe un teléfono a mano'). De propina, la línea 15 lleva `md:border-t-0` sin ningún `border-t` que cancelar: clase muerta. El mismo fichero solo se cita en el mapa como «BarraConfianza (4 cifras)» dentro del inventario de la home. Si cinco ficheros nombrados pero no leídos esconden esto, la cobertura real del mapa es menor que su apariencia.

→ Leer los cinco enteros (son 39, 37, 25, 16 y 35 líneas: quince minutos) y volcar lo que salga al lote K, que ya mueve copy a content/. En concreto, hacer que BarraConfianza derive sus textos de `claims`.

### El inventario de pantallas omite /robots.txt y /sitemap.xml, que son rutas del App Router

El manifiesto del build lista 16 entradas y entre ellas están `/robots.txt/route` y `/sitemap.xml/route`, generadas por app/robots.ts y app/sitemap.ts. El inventario de trece filas no las recoge. Importa porque el propio mapa las usa como prueba en dos sitios (el suelo de 100,5 KB se mide sobre /robots.txt/route, y el sitemap aparece en el lote G) y porque tienen un defecto real que solo está medio señalado: app/sitemap.ts:7 mantiene `rutasEstaticas` a mano con cinco rutas, sin las tres legales (correcto, son noindex) pero también sin ninguna garantía para rutas nuevas; y app/robots.ts:6 permite todo sin excluir nada, ni siquiera en preproducción. El manifiesto además distingue `/_not-found/page` de `/not-found`, dos entradas que el inventario resume en una fila de 404.

→ Añadir las dos rutas al inventario con su fichero y su fuente de datos, y tratarlas como pantallas de pleno derecho en el lote G (bloqueo de indexación fuera de producción, lastModified, y derivar rutasEstaticas de una lista compartida con lib/navegacion.ts, que el lote F va a crear igualmente).

### No hay ninguna red de seguridad automatizada, y el plan propone barandillas sin arnés donde colgarlas

Verificado: no existe .github/, no hay ningún fichero *.test.*, package.json declara exactamente cuatro scripts (dev, build, start, lint) y ninguna dependencia de test. El lote M propone una regla de lint contra clases arbitrarias, una comprobación del presupuesto de JS leyendo .next/app-build-manifest.json y un test de contraste, pero no hay dónde ejecutarlos ni nada que los dispare, y sobre todo no hay una instantánea del estado actual. Para «muchos cambios en el frontend» repartidos entre varios agentes en paralelo sobre 16 rutas, la ausencia de una línea base es el mayor riesgo del plan: doce lotes con conflictos declarados entre sí, todos editando app/page.tsx, tailwind.config.ts y globals.css, y ninguna forma de saber si el tercero rompió lo que arregló el primero.

→ Antes del primer lote, capturar una línea base reproducible y barata: el HTML generado de las 16 rutas (ya está en .next/server/app/, basta con copiarlo), la salida de build y lint, y el peso gz por ruta. Después de cada lote, un diff contra esa base contesta en segundos si una ruta perdió contenido o engordó. No requiere instalar nada.

### Nadie ha revisado los estados vacíos y los casos límite de los datos como conjunto

El mapa señala dos casos sueltos (el EstadoVacio inalcanzable del blog, los m² siempre pendientes) pero no ha inventariado la familia. Cruzando content/proyectos.json con el código: 9 de las 15 obras tienen una sola imagen, así que `miniaturas` queda vacío y toda la rama de galería de app/proyectos/[slug]/page.tsx:97-114 no se renderiza nunca en esas nueve fichas —el bug de la galería inerte solo se ve en 6 de 15, dato que cambia su prioridad—; una obra (microcemento-en-moraira) no tiene `anioFoto`, lo que la excluye del filtro de año y le cambia la etiqueta; 10 de 15 obras tienen `ficha: {}` y por tanto no pintan la ficha compacta de móvil. Además components/ui/EstadoVacio.tsx se usa en un solo sitio real y su rama `onAccion` en otro, y no existe ningún estado para «servicio sin obras» más allá de no renderizar la sección. Nadie ha probado un `tituloLargo` largo contra `text-balance`, ni un municipio largo contra el `grid-cols-[120px_1fr]` de FichaObra.tsx:38.

→ Hacer una pasada de datos, no de código: para cada componente que dependa de la forma del contenido, listar qué obras/artículos/servicios caen en cada rama y cuántos. Diez minutos de script sobre content/ que reordena las prioridades de los lotes C y D con números en vez de con impresiones.

De estos, cinco ya están cerrados en este documento (build y lint ejecutados, `app/fuentes.ts` y los
cuatro ficheros no leídos revisados, peso de fuentes medido, pasada de datos sobre `content/proyectos.json`).
Queda pendiente decidir sobre `error.tsx`, cabeceras HTTP y CSP, estilos de impresión y `forced-colors`,
el `--ancla-offset` que suma el submenú en páginas que no lo tienen, y recorrer el formulario sin JS.

**Encontrado al leer los ficheros que nadie había abierto:** `components/layout/BarraConfianza.tsx:4-8`
escribe a mano las tres cifras del negocio (`+15` años, `10` años de garantía, `+30 %` repiten) cuando
`lib/config.ts:47-52` ya las guarda como `claims.anios`, `claims.garantia` y `claims.repiten` con los
mismos textos. Dos fuentes de verdad para los números que el negocio usa como prueba. Va al lote K.

## Decisiones aparcadas

Cuatro decisiones que solo puedes tomar tú. Están pendientes a propósito: nada de la tanda arranca
hasta que las respondas.

### 1. ¿Por dónde empezamos?

- **Conversión (A+B)** — el embudo: consentimiento y CAPI, entrega del lead, honeypot, validación,
  accesibilidad del formulario. Lo que más dinero mueve y no toca ni una línea de diseño.
- **SEO y render (C+G+H)** — devolver los 15 enlaces de obra al HTML, Open Graph y favicon, canonical
  heredable, `sizes` de imagen y poda de 12 MB. Impacto alto, esfuerzo medio-bajo.
- **Diseño y accesibilidad (E+J+L)** — contrastes, foco, fuente única de paleta, escala tipográfica real
  y el rango 768-1050 px. El cimiento si vienen cambios visuales grandes.
- **Contenido (K+F)** — sacar el copy del JSX a `content/`, unificar la navegación, redactar las 29 FAQ.
  Habilita todo el trabajo de redacción posterior.

### 2. El índice `/proyectos/` no emite enlaces en el HTML. ¿Cómo lo arreglamos?

Determina si el sitio sigue siendo 100 % estático.

- **Rejilla en servidor, filtro en cliente** (mi recomendación) — se prerenderiza la rejilla completa sin
  filtrar y el componente cliente solo oculta y reordena. Conserva los 15 enlaces en el HTML, el estático
  y el filtro por URL.
- **Página dinámica con `searchParams`** — filtrado real en servidor, pero en Next 15 leer `searchParams`
  vuelve la ruta dinámica: `/proyectos/` deja de ser estático y se renderiza por petición.
- **Solo un `fallback` en el `Suspense`** — parche mínimo: quita el salto de layout, pero los enlaces
  siguen sin estar en el HTML para los rastreadores.

### 3. El acento `pigmento`

Hoy es el color de hover genérico (~35 elementos solo en la home) además del CTA y del estado activo.
Para volver a la regla de CLAUDE.md hay que elegir un hover neutro.

- **Tinta + subrayado** — el hover se queda en el color del texto y el subrayado de 2 px es la única
  señal. El pigmento queda solo para el CTA primario y el estado activo. Lo más fiel a la regla.
- **Acero** (`#45606E`) — más señal visual, pero introduce un segundo color de interacción.
- **Dejarlo como está** — se documenta como excepción consciente y no se toca.

Y en las páginas de servicio, ¿el acento se lo queda el submenú o la cabecera?

### 4. El presupuesto de JS

La regla de 100 KB es inalcanzable: el suelo de Next 15 + React 19 son 100,5 kB antes de escribir una
línea. Tu código propio son 4-14 kB por ruta.

- **Reformular como «N KB de código propio»** — mide solo lo tuyo, que es lo único sobre lo que decides.
- **Subir el techo a ~120 KB** — mantiene la métrica de First Load JS con un umbral realista.
- **Lote dedicado a recortar el suelo** — cáscara de servidor para la cabecera, carga diferida del menú
  móvil, revisar los tres componentes cliente que cuelgan del layout raíz y se pagan en las 16 rutas.

Aparte: el consentimiento y el CAPI (hoy se manda el Lead con teléfono, email e IP aunque el usuario
rechace), la casilla de privacidad del formulario corto, quién redacta las tres páginas legales y las 29
respuestas de FAQ, el filtro de año en `/proyectos/` (dato que el propio sitio marca como no confirmado)
y si la galería de la ficha de obra se hace funcional o se le quitan las señales.

