# Pavivasa — investigación de pavivasa.com y contexto para Claude Design

Fecha de rastreo: 2 de septiembre de 2026. Fuente: pavivasa.com renderizada con JavaScript
(extractor Nimble, perfil de navegación desde España) más fragmentos de buscador para cotejar.
Todo el texto entrecomillado o en bloque es literal de la web, con sus erratas. Lo que no está
en la web se marca como **[pendiente]** y no debe inventarse.

---

## 1. Ficha de empresa

| Campo | Valor literal en la web | Fuente |
|---|---|---|
| Nombre comercial | Pavivasa | logo, título, pie |
| Nombre en redes | "Pavivasa Hormigón Impreso y Pulido" | Facebook |
| Persona de contacto | Gabriel (no aparece el apellido en la web; sí en email y handles) | email, redes |
| Dirección | Calle Blasco Ibañez, 16, Sollana (46430) Valencia (España) | pie de todas las páginas, /contacto/, /empresa/ |
| Teléfono | +34 627 66 31 46 (único en toda la web) | cabecera, pie, contacto |
| Email | gabriel.pavivasa@gmail.com (único) | pie, contacto |
| WhatsApp | no existe enlace ni mención | — |
| Horario | no aparece en ninguna página | — |
| Facebook | facebook.com/GabrielPavivasa | cabecera y pie |
| X / Twitter | twitter.com/GabrielPavivasa | cabecera y pie |
| Instagram | instagram.com/gabrielpavivasa.es | cabecera y pie |
| Trayectoria | "más de 15 años" (home, servicios, obras) y "15 años de trayectoria empresarial" (empresa) | |
| Garantía | "10 años de garantía en todos nuestros trabajos" + "mantenimiento y reparación en caso de que lo necesite" | todas las páginas de servicio, sello garantia.png |
| Fidelización | "mas del 30% de nuestros trabajos son clientes para los que ya hemos trabajado anteriormente" | /empresa/ |
| Cobertura declarada | "Valencia, Castellón, Alicante, Murcia, Albacete y Almería, trabajamos sobre todo en zonas como Xàbia, Calpe, Dénia, Alcoy, Sant Joan, San Vicent del Raspeig, Gandia, Moraira, Ontinyent" | /empresa/ |
| Cobertura en Facebook | "Valencia, Gandía, Jávea, Teulada, Benisa, Calpe, Alicante, San Juan de Alicante y Alfás del Pí" | snippet de Facebook |
| Cliente objetivo | "empresas, particulares y profesionales del sector"; "empresarios, propietarios y visionarios" | home, empresa |
| Tipos de obra | "propiedades residenciales, complejos comerciales e instalaciones deportivas" | empresa |
| Precios | no se publica ningún precio ni rango | — |
| Reseñas / testimonios | ninguno en la web; solo frases propias ("el cliente muy satisfecho") en dos obras | — |
| Certificaciones / marcas | ninguna | — |
| Financiación | "PROYECTO WEB FINANCIADO POR LA UNIÓN EUROPEA – NEXTGENERATIONEU" (Kit Digital), con logotipos en el pie | pie |
| Copyright | "© 2024 todos los derechos reservados" | pie |
| Legales | Aviso Legal (/aviso-legal), Política de Privacidad (/politica-de-privacidad), Política de cookies (/politica-de-cookies-ue/) | pie |

**Relación con Pavimentos Albufera.** Misma dirección (Calle Blasco Ibáñez 16, Sollana) y mismo
teléfono 627 66 31 46 que aparecen en el pie de pavimentos-albufera.com, y el pie de Albufera
enlaza a las redes de GabrielPavivasa. Son dos marcas del mismo negocio. Eso condiciona el
diseño: Pavivasa **no debe parecer un clon** de Albufera aunque comparta esqueleto técnico.

**Sede.** Sollana está en la Ribera Baixa (Valencia), pero la web se orienta a la Marina Alta
(Alicante): Dénia, Xàbia, Calpe, Moraira, Benissa. Diez de las quince obras documentadas están
en la provincia de Alicante; las otras cinco, en la de Valencia.

---

## 2. La web actual: tecnología y arquitectura

- WordPress + Elementor, rediseño de septiembre de 2024 (fecha de subida de logos y galería),
  con contenido de obra de 2016-2021 arrastrado de la web anterior (`nuevo.pavivasa.com` aparece
  aún en rutas de imagen).
- Plugin gtranslate con banderas es/en/de/fr (traducción automática, sin contenido propio).
- Banner de cookies Complianz: "Aceptar · Denegar · Ver preferencias · Guardar preferencias".
- Ninguna página tiene meta description. Títulos con patrón "X – Pavivasa". El title de la home
  tiene errata: "Pavimentos de Hormigo Impreso".
- Registro: **usted** en toda la web ("le ofrecemos", "su hogar"), salvo la página de alicatados y
  los tres artículos de 2024, que usan **tú**.

### Menú principal (literal)
Pavivasa · Empresa · Servicios ▾ (Pavimentos de hormigón impreso · Pavimentos de hormigón pulido ·
Pavimentos de hormigón lavado · Microcemento decorativo · Autonivelantes · Pavimentos de caucho ·
Alicatados en Valencia) · Proyectos · Contacto · botón **Presupuestos** · iconos Facebook, X,
Instagram · selector de idioma.

### Inventario de URLs

| URL | Tipo | Estado |
|---|---|---|
| / | Home | OK |
| /empresa/ | Empresa | OK |
| /contacto/ | Contacto con formulario | OK |
| /presupuesto/ | "Presupuesto": mismo bloque de contacto, sin formulario detectado | Débil |
| /proyectos/ | Galería de 77 fotos sin texto ni datos | Débil |
| /servicios/pavimentos-de-hormigon-impreso/ | Servicio | OK |
| /servicios/pavimentos-de-hormigon-pulido/ | Servicio | OK |
| /servicios/pavimentos-de-hormigon-lavado/ | Servicio | OK |
| /servicios/microcemento-decorativo/ (= /microcemento-decorativo/) | Servicio | OK, párrafos pegados de pulido |
| /servicios/autonivelantes/ (= /morteros-autonivelantes/) | Servicio | Copy pegado de pulido y microcemento |
| /servicios/pavimentos-de-caucho/ (= /pavimentos-caucho/) | Servicio | Copy pegado de alicatados y pulido |
| /servicios/alicatados-en-valencia/ | Servicio (nuevo 2024) | Copy pegado de pulido |
| /category/hormigon-impreso/ | Listado blog (6 entradas) | OK |
| /category/hormigon-pulido/ · /category/hormigon-lavado/ · /category/microcemento/ · /category/uncategorized/ | Listados blog (6 · 1 · 2 · 4 entradas) | OK |
| /hormigon-impreso-{denia,moraira,lliria,calpe,benissa,montaberner,calpe-2}/ | Fichas de obra 2016-2021 | OK |
| /hormigon-impreso-ontinyent/ · /casa-en-la-playa-denia/ | Enlazadas desde el blog | 404 |
| /hormigon-pulido-{xabia,alicante,benissa,daimus,ribarroja-del-turia}/ | Fichas de obra | OK |
| /hormigon-lavado-valencia-godella/ (= /hormigon-lavado) | Ficha de obra | OK |
| /microcemento-en-{moraira,alicante}/ | Fichas de obra | OK |
| /hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios/ | Artículo 2024 | OK |
| /hormigon-impreso-ondara-la-opcion-ideal-para-embellecer-tu-hogar/ | Artículo 2024 (indexado) | 404 |
| /hormigon-fratasado-fino-decorativo-viviendas-la-revolucion-diseno-funcionalidad/ | Artículo 2024 | OK |
| /hormigon-desactivado-piedra-vista-estetica-funcionalidad-solo-material/ | Artículo 2024 | OK, **cuerpo en rumano** |
| /brillo-elegancia-explorando-hormigon-pulido/ | Artículo 2023 | OK |
| /aviso-legal · /politica-de-privacidad · /politica-de-cookies-ue/ | Legales | No extraídas (texto de plantilla) |

Duplicados con dos rutas para el mismo contenido: /hormigon-impreso-benissa/ ≈ /hormigon-impreso,
/hormigon-pulido-alicante/ ≈ /hormigon-pulido/, /hormigon-lavado-valencia-godella/ ≈ /hormigon-lavado,
más los tres de servicios indicados arriba. Todos deberán resolverse con 301 en la web nueva.

### Estructura repetida de cada página de servicio
1. H1 + subtítulo de una frase.
2. "PAVIMENTOS DURADEROS Y DE CALIDAD": 2–3 párrafos.
3. Un H2 de argumento ("GAMA DE COLORES Y DISEÑOS", "ASEQUIBILIDAD, BELLEZA, VERSATILIDAD Y
   DUREZA", "CUIDADO DEL MICROCEMENTO"…).
4. Bloque "EL HORMIGÓN X — UNA DE LAS OPCIONES DECORATIVAS MAS RESISTENTES EN LA ACTUALIDAD"
   con cuatro listas de iconos (aplicaciones · diseño · garantía · resistencia) y botón
   "Visitar Proyectos".
5. "10 AÑOS DE GARANTÍA EN TODOS NUESTROS TRABAJOS" con sello.
6. Un H2 de cierre.
7. Rejilla "Servicios Pavivasa" de 8 tarjetas (7 servicios + "Tu presupuesto") **con texto
   Lorem ipsum sin sustituir en producción**.
8. Pie: "PAVIMENTOS DURADEROS Y DE CALIDAD" + botones Presupuesto / Llamanos + logos
   NextGenerationEU + lista de servicios + NAP + legales.

Ninguna página de servicio lleva fotografía de obra. Solo logos, el sello de garantía y los
logotipos del Kit Digital.

---

## 3. Copy literal por página (lo aprovechable)

### Home
- Antetítulo: "EXPERTOS EN PAVIMENTOS DE HORMIGÓN". H1: "Pavimentos de hormigón".
- "Le ofrecemos toda clase de servicios en pavimentos y pavimentos de hormigón, pavimentos de
  hormigón impreso, revestimientos, estructuras y pavimentos de hormigón pulido, hormigón lavado,
  microcementos, autonivelantes, pavimentos de caucho."
- "PAVIMENTOS Y REVESTIMIENTOS DE HORMIGÓN — Ejecución y conservación de toda clase de pavimentos,
  recubrimientos y estructuras de hormigon, somos expertos en colocación, mantenimiento, ejecución
  y montaje con mas de 15 años de experiencia en el área profesional de edificación y obra civil,
  nuestra actividad principal es la realización de pavimentaciones y recubrimientos de hormigón
  impreso, hormigón pulido, hormigón lavado y microcementos, realizamos trabajos para empresas,
  particulares y profesionales del sector."
- Tres tarjetas 01/02/03 con el mismo texto repetido: "Pavimentos de hormigón impreso,
  revestimiento de paredes, recubrimiento de piscinas y todo lo que pueda imaginar."
- "ESPECIALISTAS EN HORMIGÓN IMPRESO Y HORMIGÓN PULIDO — Nuestros años de experiencia junto a la
  calidad y la perfección de nuestros acabados han sido el motor de nuestra empresa todos estos
  años, adquiriendo una excelente confianza en nuestros clientes que nos ha permitido ofrecerles
  una marca de calidad superior a precios justos y competentes, nuestro secreto no es otro que el
  trabajo duro, la auto-superación y la pasión en cada detalle de lo que hacemos."
- Lista: Soleras de hormigón pulido · Piscinas de hormigón · Patios y Terrazas · Cimentaciones y
  estructuras de viviendas unifamiliares · Revestimiento de fachadas y muros · Elementos de fincas
  como pasos, badenes, cunetas etc.
- "PAVIMENTOS DE HORMIGÓN GARANTIZADOS — La calidad de nuestros trabajos es inmejorable, pero no
  nos vamos a quedar ahi, le ofrecemos 10 años de garantia en todos nuestros trabajos y le
  proporcinamos el mantenimiento de los mismos, somos una empresa seria, queremos que vuelva a
  contratarnos en el futuro."

### Empresa
- H1 "Empresa", H2 "Pavimentos de hormigón Valencia".
- "Somos una empresa dedicada a los pavimentos de hormigón impreso, pulido, decorativo y obras
  industriales, contamos con una gran trayectoria que durante más de 15 años ha servido a
  empresarios, propietarios y visionarios, en la realización de obras de construcción de éxito en
  toda la región. Contamos con un excelente y dinámico equipo de profesionales altamente
  cualificados para asegurar la consecución en la construcción de su obra."
- "Tenemos especial experiencia y capacidad en la construcción de propiedades residenciales,
  complejos comerciales e instalaciones deportivas. […] disponemos de un equipo de trabajadores
  especializados, la maquinaria necesaria para su ejecución y todos los utensilios y moldes que
  permiten una correcta realización de la obra. Nuestra oficina principal se encuentra en Sollana
  Calle Blasco ibañez 16, Valencia. Ofrecemos nuestros servicios en Valencia, Castellón, Alicante,
  Murcia, Albacete y Almería […]"
- "Nuestro punto fuerte es el pavimento de hormigón impreso, hormigón pulido y el microcemento
  decorativo".
- "Experiencia — Esta empresa es el resultado de la experiencia de 15 años de trayectoria
  empresarial y un estudio continuo de los procesos de ejecución en pavimentación y revestimientos
  de hormigón, lo cual nos ha dado la posibilidad de poder ofrecerle una calidad y precio
  excepcional en todos nuestros proyectos."
- Cinco valores con titular en mayúsculas:
  - "SOMOS CLAROS Y LEGALES — Le asesoramos y le ofrecemos un trato claro, directo y
    personalizado, involucrándonos en su proyecto como si fuera nuestro, recuerde siempre que su
    satisfacción es lo mas importante para nosotros y es lo que nos define como empresa."
  - "CREEMOS EN LO QUE HACEMOS — Queremos ser los mejores, y eso lo demostramos en cada metro
    construido, en cada proyecto terminado, en cada detalle de lo que hacemos, nos apasiona
    nuestro trabajo y por eso luchamos cada dia, para ser los mejores en nuestro sector."
  - "ALTO NIVEL DE SATISFACCIÓN Y CONFIANZA — Construimos relaciones a largo plazo con todos
    nuestros clientes, ya sean grandes o pequeños, mas del 30% de nuestros trabajos son clientes
    para los que ya hemos trabajado anteriormente, por eso confiamos en nuestro trabajo, porque
    sabemos que somos lideres en confianza y satisfacción."
  - "CALIDAD Y GARANTÍA — La calidad de nuestros trabajos es inmejorable, pero no nos vamos a
    quedar ahí, le ofrecemos 10 años de garantía de todos nuestros trabajos y le proporcionamos el
    mantenimiento de los mismos, somos una empresa seria y de confianza, queremos que vuelva a
    contratarnos en el futuro."
  - "PAVIMENTOS DE HORMIGÓN DE CONFIANZA — Hoy queremos llegar aun mas lejos ofreciendo nuestros
    servicios a través de esta pagina web, porque sabemos lo difícil que es mantener la confianza
    de los clientes y la mayoría de los nuestros siguen solicitando nuestros servicios después de
    muchos años […]"

### Servicio: hormigón impreso
- Subtítulo: "Pavimentos de hormigón impreso, revestimiento de fachadas y muros, recubrimiento de
  piscinas, patios, terrazas, jardines o paseos son solo algunas de las posibilidades que nos
  ofrece este tipo de cimentación."
- Argumento vertical: "Realizamos trabajos en hormigón impreso sobre cualquier tipo de superficie
  ya sea horizontal o vertical […] la posibilidad de trasladar el sistema de los pavimentos de
  hormigón impreso a los parámetros verticales […] revestimientos de hormigón impreso en paredes
  y muros".
- "destacan por su durabilidad, impermeabilidad y una alta gama de colores y diseños […] al ser
  impermeable, soporta el ataque de ácidos y manchas de grasa o aceite, además puede utilizarse
  en zonas muy castigadas por el tránsito, como aceras, parques, rampas, recintos feriales, etc…
  Estos factores, sumados al casi nulo mantenimiento, explican que triunfe en las viviendas con
  jardín, desplazando a los pavimentos tradicionales."
- "GAMA DE COLORES Y DISEÑOS — Ponemos a su disposición una gran variedad de moldes y una carta
  de colores muy extensa […] la estampación puede imitar adoquines, piedra, baldosas o pizarras
  entre otros tipos de textura".
- Listas: Fincas y pasos · Calles y paseos · Patios y terrazas · Piscinas y jardines · Badenes y
  cunetas · Revestimiento de muros · Revestimiento de fachadas / Diseños personalizados · Amplia
  gama de colores · Amplia gama de modelos / Garantía de 10 años · Elegancia y durabilidad · Bajo
  coste de mantenimiento / No se agrieta · No se deforma · Resistente y muy duradero.
- "PRESTACIONES DEL HORMIGÓN IMPRESO — proporcionan las mismas prestaciones que una solera de
  hormigón pero con la ventaja de aportar un aspecto más decorativo y elegante […]".
- Modelos y colores citados en obras: piedra inglesa, adoquín belga, sillería, manteado;
  gris medio, gris oscuro, gris muy oscuro, gris mate, marrón, crema, color 107, color 117.

### Servicio: hormigón pulido
- "ideales tanto para suelos industriales, como para terrazas, piscinas, jardines y zonas de
  interior" · "destacan por su durabilidad, impermeabilidad, precio y su bajo mantenimiento".
- "aparcamientos, naves industriales, almacenes, garajes, patios, terrazas y jardines, zonas
  interiores y centros comerciales […] en los ultimos años, gracias a las nuevas tecnicas de
  acabado se usa tambien a nivel domestico o particular".
- "extremadamente duraderos ya que se integran directamente al hormigón, no se astillan ni
  generan grietas […] acabado en multitud de colores brillo o mate".
- "económico, de fácil colocación, resistente, impermeable, duradero […] soporta el ataque de
  ácidos y manchas de grasa y aceite".
- Listas: Patios y jardines · Parkings y garajes · Naves industriales · Centros comerciales ·
  Salas y exposiciones · Pabellones deportivos / Resistente y duradero · Amplia gama de colores ·
  Bajo coste de mantenimiento / Garantía de 10 años · Elegancia y durabilidad · Completamente
  impermeable / No se astilla · No se agrieta · No se deforma.
- En las obras se llama indistintamente "pulido" y "fratasado".

### Servicio: hormigón lavado (árido visto)
- "Gracias a las distintas clases de áridos, granulometrías y colores obtenemos una amplia
  variedad de atractivos y resistentes acabados."
- "rugosos, antideslizantes y muy resistentes al desgaste y a la acción de los agentes
  atmosféricos, siendo muy adecuados, para salidas de parkings, urbanizaciones, rampas".
- "zonas peatonales, entornos de piscinas, viales de tráfico rodado ligero, calles de parques,
  zonas de recreo".
- Ficha técnica literal: "hormigón HA-25 con un cono blando y árido seleccionado según el acabado
  deseado, reforzado con fibra de polipropileno y aditivado […] puede ser pigmentado en masa. La
  resistencia a compresión y flexo-tracción estándar […] HA-25 según la instrucción EHE-08. La
  terminación de árido descubierto genera una superficie antideslizante de la clase 3 Rd>45 para
  el caso de áridos de machaqueo."
- "Somos especialistas en dar un toque diferente tanto dentro como fuera de su hogar — Nos
  dedicamos a realizar pavimentos de hormigón desde hace más de 15 años, antes de iniciar nuestro
  trabajo preparamos el terreno para la ejecución de la solera […] cuidamos mucho la preparación
  del soporte".

### Servicio: microcemento decorativo
- "La tendencia a utilizar microcemento va en aumento en los últimos años debido a su estética
  vanguardista y de calidad."
- "renovamos por completo suelos, paredes, baños, cocinas o revestimientos de su hogar con un
  ahorro económico y de tiempo muy importante, ya que no se debe retirar el material existente".
- "CUIDADO DEL MICROCEMENTO — agua y jabón neutro con un PH entre 6 y 9 […] mopa o fregona […]
  cera de autobrillo […] no utilizar elementos de limpieza abrasivos, como disolventes o ácidos".
- "DURABILIDAD — material sintético para revestir todo tipo de superficies […] mucho más durable
  y resistente que el cemento común […] difícil de corroer, agrietar y resquebrajar".
- Listas: Vigas · Baños · Suelos · Cocinas · Paredes · Bañeras / Moderno y creativo · Flexible y
  económico / "Decorativo y elegente" (sic) · Bajo coste de mantenimiento / No se agrieta ni deforma ·
  Resistente y muy duradero. Titular: "UNA DE LAS OPCIONES DECORATIVAS MAS UTILIZADAS POR LOS
  DISEÑADORES".

### Servicio: autonivelantes
- H2 "Morteros autonivelantes decorativos". Contenido propio: maquinaria ("bombas impulsoras de
  autonivelante"), aditivos (superfluidificantes, reductores de retracción, aireantes,
  modificadores de viscosidad), "tiempo mínimo de secado es de más de 24 horas", "no se nivelan
  ellos solos, sino que es necesario alisarlos manualmente".
- "El pavimento autonivelante decorativo es una apuesta decidida por la arquitectura creativa,
  inspirada en acabados cromáticos naturales […] de planimetría, lisos o antideslizantes,
  industriales o decorativos, flexibles, conductores y alimentarios […] adaptados al código
  técnico de la edificación".

### Servicio: pavimentos de caucho
- H2 "Pavimentos de caucho para parques infantiles". Contenido propio: SBR reciclado + capa de
  SBR coloreado in situ, EPDM vulcanizado, espesores según el HIC del equipo de juego, normas
  **EN 1176 y EN 1177**. "solución limpia y segura para la creación de zonas lúdicas infantiles y
  zonas deportivas […] minimizar los riesgos de lesiones producidos por las caídas de los niños".

### Servicio: alicatados en Valencia
- "Ofrecemos nuestro servicio de alicatados en toda la provincia de Valencia, abarcando tanto
  proyectos de renovación residencial como grandes obras comerciales […] desde baños y cocinas
  hasta espacios exteriores como piscinas y terrazas."
- Pilares: Variedad de diseños · Durabilidad y resistencia · Acabados profesionales ·
  Asesoramiento personalizado, cada uno con una frase.
- "MATERIALES DE CALIDAD — desde cerámicas y porcelanas hasta azulejos de diseño […] acabados
  resistentes a la humedad y al desgaste".

### Contacto y presupuesto
- "Si lo prefiere puede llamarnos al +34 627 66 31 46 o enviarnos un mail a
  gabriel.pavivasa@gmail.com". Bloque: Ubicación · Llamanos · Correo.
- Formulario: Nombre* · Correo Electronico* · Teléfono* · Asunto* · Mensaje* · "Enviar Petición".
  Sin casilla de privacidad visible, sin mapa, sin horario, sin WhatsApp.
- /presupuesto/ repite el bloque de contacto y el párrafo de empresa; no tiene formulario propio.

---

## 4. Obras documentadas en la web (datos literales de cada entrada)

Todas las entradas están firmadas por "admin", sin fecha visible. La fecha se deduce de la ruta
de subida de la foto. Cuando un dato no está en el texto se deja en blanco: **no inventar**.

| Slug | Técnica | Municipio (provincia) | Tipo de espacio | Modelo | Color | Datos técnicos literales | m² | Foto (año) |
|---|---|---|---|---|---|---|---|---|
| hormigon-impreso-denia | Impreso | Dénia (Alicante) | Vivienda en urbanización | Piedra inglesa | Gris mate y crema (dos acabados en la misma vivienda) | HM20, 10 cm, árido 12 mm, mallazo 20×30 y 4 mm, fibra de polipropileno, 4 kg color/m² | — | 2017-10, 4 fotos |
| hormigon-impreso-moraira | Impreso | Moraira (Alicante) | Chalé unifamiliar con jardín y piscina | Manteado | Gris y marrón | HM20, 12 cm, árido 12 mm, acabado mate | — | 2016-12, 2 fotos |
| hormigon-impreso-lliria | Impreso | Llíria (Valencia) | Urbanización | Sillería | Color 107 | — | — | 2016-10, 1 foto |
| hormigon-impreso-calpe | Impreso | Calpe (Alicante) | Urbanización | Piedra inglesa | Gris medio | — | — | 2016-10, 1 foto |
| hormigon-impreso-benissa | Impreso | Benissa, urb. Monte Mar (Alicante) | Urbanización con fuerte desnivel, relleno para evitar acumulación de agua | Adoquín belga | Gris oscuro | — | — | 2016-10, 1 foto |
| hormigon-impreso-montaberner | Impreso | Montaverner (Valencia, Vall d'Albaida) | Incluye "otro tipo de trabajos de construcción" | Piedra inglesa | Gris muy oscuro | — | — | 2016-10, 1 foto |
| hormigon-impreso-calpe-2 | Impreso | Calpe (Alicante) | — | Sillería grande | Arena | HM25, 10 cm, árido 12 mm, mallazo y fibra de polipropileno, juntas de dilatación 5×5 | — | 2021-01, 1 foto de móvil |
| hormigon-pulido-xabia | Pulido (fratasado) | Xàbia (Alicante) | Residencia en urbanización | — | Crema 117 | — | 120 | 2016-10 (foto de listado) |
| hormigon-pulido-alicante | Pulido (fratasado) | Benissa, urb. Montemar la Viña (Alicante) | Unifamiliar: interior, exterior y contorno de piscina | — | 117 crema marfil | — | — | 2017-02, 2 fotos |
| hormigon-pulido-benissa | Pulido | Benissa, urb. Monte Mar (Alicante) | — | — | Crema 117 | Mallazo, fibra de polipropileno, 4 kg color/m² | — | 2016-10 |
| hormigon-pulido-ribarroja-del-turia | Pulido | Riba-roja de Túria (Valencia) | Nave industrial | — | Natural | Mallazo y fibra de polipropileno | — | 2016-10 |
| hormigon-pulido-daimus | Pulido | Daimús (Valencia, La Safor) | Nave industrial con muelle de carga y descarga | — | — | — | 2000 | 2016-10, 1 foto |
| hormigon-lavado-valencia-godella | Lavado (árido visto) | Godella (Valencia) | Jardín de vivienda | "valencia aserras" | Gris | Árido 12 mm, piedra vista | — | 2017-05, 2 fotos |
| microcemento-en-moraira | Microcemento | Moraira / Teulada (Alicante) | Cuarto de baño completo | — | Gris claro | — | — | sin foto |
| microcemento-en-alicante | Microcemento | Alicante (sin municipio) | Reforma completa de baño | — | "a elección del diseñador" | — | — | 2016-10, 1 foto (ducha) |

Resumen: 15 obras, de 2016 a 2021, en 11 municipios. Las URLs de Ontinyent y "casa en la
playa Denia" que aún enlaza el propio blog devuelven 404. Seis con datos técnicos de ejecución
(espesor, hormigón, árido, mallazo, fibra, dosificación de color). Dos con superficie. Ninguna
con año explícito ni con nombre de cliente. Fotos originales pequeñas (máximo 1024 px).

**Modelos de impreso citados:** piedra inglesa (×3), sillería, sillería grande, adoquín belga,
manteado. **Colores citados:** gris medio, gris oscuro, gris muy oscuro, gris mate, gris, marrón,
crema, arena, natural, 107, 117 (crema marfil). "Valencia aserras" aparece como modelo de lavado.

**Artículos divulgativos (no obras):** "Hormigón Impreso en Denia: La Solución Ideal para
Embellecer tus Espacios" (2024), "Hormigón Fratasado Fino Decorativo en Viviendas" (2024),
"Hormigón Desactivado con Piedra Vista" (2024, **con el cuerpo íntegro en rumano**), "Brillo y Elegancia: Explorando el
Hormigón Pulido" (2023). Los tres de 2024 usan "tú" y redacción genérica sin datos de Pavivasa. El artículo de
Ondara que indexa el buscador devuelve 404.

**Galería /proyectos/:** 77 fotografías subidas en septiembre de 2024 con nombre
"galeria-pavivasa (N)", sin pie, sin municipio, sin técnica, sin fecha. Es el material visual
más reciente pero no está catalogado. Habrá que pedir al cliente que identifique cada foto.

---

## 5. Auditoría de la web actual (lo que el rediseño debe corregir)

1. **Lorem ipsum en producción.** La rejilla "Servicios Pavivasa" de todas las páginas de servicio
   lleva el mismo texto de relleno latino en las 8 tarjetas.
2. **Copy pegado entre servicios.** Caucho arranca con el párrafo de alicatados; alicatados y
   autonivelantes llevan el subtítulo de pulido; microcemento, autonivelantes y caucho repiten el
   párrafo "extremadamente duraderos" de pulido; la obra de Denia termina pidiendo presupuesto de
   "hormigón lavado"; Moraira microcemento garantiza "hormigón pulido".
3. **Sin fotografía de obra en ninguna página de servicio.** Solo logos y el sello de garantía.
4. **/proyectos/ es una galería muda** de 77 fotos sin datos, y las 15 fichas de obra con datos
   viven en el blog, sin enlace desde Proyectos ni desde el menú.
5. **/presupuesto/ no tiene formulario propio**: repite el bloque de contacto.
6. **Sin meta description en ninguna página.** Title de la home con errata ("Hormigo").
7. **Erratas y ortografía**: "ipermeabilidad", "garantia", "proporcinamos", "ahi", "estensa",
   "varidad", "trransforma", "vanguardirta", "elegente", "os alicatados", "Correo Electronico".
8. **Registro mezclado**: usted en el 90 %, tú en alicatados y artículos 2024.
9. **Sin WhatsApp, sin horario, sin mapa, sin casilla de privacidad en el formulario.**
10. **Traducción automática a 4 idiomas** (gtranslate) sin contenido propio.
11. **Duplicados de URL** para el mismo contenido (seis pares) y tres URLs 404 aún indexadas o enlazadas desde el propio blog.
12. **Comentarios de WordPress abiertos** en las entradas ("Deja un comentario").
13. **Imágenes**: sin alt en las de 2024, nombres de archivo genéricos, tamaños ≤ 1024 px, rutas
    aún apuntando a nuevo.pavivasa.com.
14. **Sin prueba social**: cero reseñas, cero testimonios con nombre, cero logos de cliente.
15. **Sin precios ni rangos**, sin FAQ, sin proceso de trabajo explicado.
16. **Un artículo publicado en rumano** ("Hormigón Desactivado con Piedra Vista": título en
    castellano, cuerpo entero en rumano, en la categoría Uncategorized).
17. **Marca doble con Pavimentos Albufera**: misma dirección y teléfono. Riesgo de que Google
    las trate como duplicados si las dos webs comparten también diseño y copy.

---

## 6. Datos que hay que confirmar con el cliente antes de diseñar en firme

| Dato | Estado | Cómo tratarlo en el diseño |
|---|---|---|
| Teléfono definitivo | Solo aparece 627 66 31 46 en Pavivasa; Albufera muestra otros tres | Un único número, con `<DatoPendiente>` hasta confirmar |
| WhatsApp | No existe en la web | Reservar el CTA; enlazar al 627 si el cliente confirma |
| Email profesional | Solo gmail | Reservar dominio @pavivasa.com; mostrar el gmail mientras tanto |
| Horario | No existe | No pintar horario inventado |
| Años de trayectoria | "más de 15 años" en 2016 y en 2024 a la vez | Pedir año de fundación real |
| Cobertura real | Web: 6 provincias; Facebook: 9 municipios alicantinos | Decidir zona prioritaria (Marina Alta vs. Ribera/Valencia) |
| Servicios que se mantienen | Autonivelantes, caucho y alicatados tienen cero obra documentada | Confirmar si siguen ofreciéndose |
| Reseñas | Ninguna en la web | Sin `AggregateRating`; sin testimonios inventados |
| Fotos de la galería | 77 sin datos | Pedir municipio, técnica y año de cada una |
| Relación con Pavimentos Albufera | No se explica en ninguna web | Decidir si se menciona |
| Kit Digital | Logos obligatorios durante el periodo de subvención | Confirmar si siguen siendo obligatorios en la web nueva |
| Logo | PNG-07 / PNG-06 / PNG-16 (variantes) | Pedir original vectorial |

---

## 7. Prompt para Claude Design

Copiar íntegro el bloque siguiente. Está escrito para que Claude Design no necesite nada más:
lleva la arquitectura fija (los huesos del esqueleto ya construido en el repositorio
`DreiSup/pavivasa_web`), el contenido real de la empresa y las reglas de lo que no puede inventar.

```text
Diseña la web de PAVIVASA, empresa de pavimentos de hormigón de Sollana (Valencia), como un
canvas con artboards móvil (390 px) y escritorio (1440 px). La web se va a construir sobre un
esqueleto Next.js ya existente, así que la ARQUITECTURA DE PÁGINAS Y COMPONENTES ES FIJA; lo que
tienes que decidir es el sistema visual y la composición de cada pantalla. Todo el copy que uses
debe salir de la sección CONTENIDO REAL de este prompt. Lo que no esté ahí no existe: no
inventes cifras, testimonios, reseñas, precios, horarios, nombres de clientes ni fotos de
personas.

=====================================================================
1. LA EMPRESA (datos literales de pavivasa.com, septiembre 2026)
=====================================================================
- Nombre: Pavivasa. Gestor: Gabriel. Sede: Calle Blasco Ibañez, 16, Sollana (46430) Valencia.
- Teléfono único: +34 627 66 31 46. Email: gabriel.pavivasa@gmail.com. No hay WhatsApp ni
  horario publicados: si diseñas un botón de WhatsApp, píntalo como pendiente de confirmar.
- Redes: facebook.com/GabrielPavivasa · x.com/GabrielPavivasa · instagram.com/gabrielpavivasa.es
- Qué hace: "pavimentos de hormigón impreso, pulido, decorativo y obras industriales".
  Punto fuerte declarado: "el pavimento de hormigón impreso, hormigón pulido y el microcemento
  decorativo".
- Siete servicios en el menú actual, en este orden: Pavimentos de hormigón impreso ·
  Pavimentos de hormigón pulido · Pavimentos de hormigón lavado · Microcemento decorativo ·
  Autonivelantes · Pavimentos de caucho · Alicatados en Valencia.
- Claims verificables en la web: "más de 15 años de experiencia" · "10 años de garantía en
  todos nuestros trabajos" con "mantenimiento y reparación en caso de que lo necesite" ·
  "mas del 30% de nuestros trabajos son clientes para los que ya hemos trabajado
  anteriormente" · "trabajamos para empresas, particulares y profesionales del sector".
- Cobertura declarada: "Valencia, Castellón, Alicante, Murcia, Albacete y Almería, trabajamos
  sobre todo en zonas como Xàbia, Calpe, Dénia, Alcoy, Sant Joan, San Vicent del Raspeig,
  Gandia, Moraira, Ontinyent". La obra documentada está sobre todo en la Marina Alta
  (Dénia, Xàbia, Calpe, Moraira, Benissa) y en la provincia de Valencia (Llíria, Godella,
  Riba-roja, Daimús, Montaverner).
- Cliente objetivo prioritario: particular con vivienda unifamiliar, jardín y piscina en
  urbanización. Segundo: empresa con nave industrial (pulido). Tercero: reforma de baño o
  cocina (microcemento).
- Conversión objetivo: llamada telefónica y formulario de presupuesto.
- Registro: tuteo ("tú"), frases cortas, sin "usted". La web actual mezcla ambos.
- Pie obligatorio mientras dure la subvención: "PROYECTO WEB FINANCIADO POR LA UNIÓN EUROPEA –
  NEXTGENERATIONEU" con los logotipos del Kit Digital.
- Pavivasa comparte dirección y teléfono con otra marca del mismo dueño, Pavimentos Albufera,
  cuya web usa fondo claro cálido (#E9EAE6), tinta casi negra (#1B1E1C), acento ocre (#D9A441),
  tipografías Archivo Expanded + Instrument Sans + Martian Mono y esquinas a 0. PAVIVASA NO
  PUEDE PARECER UN CLON: elige otra paleta y otras familias tipográficas. Sí conserva las
  reglas de construcción de la sección 3.

=====================================================================
2. ARQUITECTURA FIJA (huesos del esqueleto)
=====================================================================
Rutas (con barra final):
  /                          Home
  /hormigon-impreso/         Servicio (plantilla de servicio; misma para los 7)
  /hormigon-pulido/  /hormigon-lavado/  /microcemento/  /autonivelantes/
  /pavimentos-de-caucho/  /alicatados/
  /proyectos/                Índice de obras con filtros (técnica · municipio · año)
  /proyectos/[slug]/         Ficha de obra
  /empresa/                  Empresa
  /presupuesto/              Formulario + llamada + WhatsApp
  /blog/  /blog/[slug]/      Artículos
  /aviso-legal/  /politica-de-privacidad/  /politica-de-cookies/   Plantilla legal
  404

Componentes que ya existen y hay que dibujar (mismos nombres):
  layout/    Cabecera (logo, 4-5 enlaces, teléfono, botón "Pedir presupuesto"; se compacta al
             hacer scroll) · MenuMovil (panel a pantalla completa) · Pie · BarraMovil (barra
             fija inferior en móvil con dos botones: Llamar / WhatsApp) · Migas ·
             Consentimiento (banner de cookies con Rechazar / Aceptar) · BarraConfianza
             (franja de datos: años, garantía, zona, fidelización)
  ui/        Boton (primario / contorno / tinta) · Campo de formulario · Chip de filtro ·
             AntetituloSeccion · EnlaceEtiqueta · EstadoVacio ("sin resultados")
  datos/     DatoPendiente (un dato sin confirmar se ve entre corchetes y atenuado) ·
             EtiquetaTecnica (bloque oscuro monoespaciado con los datos de una obra) ·
             FichaObra (barra lateral con filas etiqueta/valor) · TablaFichaTecnica
  contenido/ BloquePosicion (rectángulo con trama diagonal que sustituye a toda foto que aún no
             existe; lleva la etiqueta "PENDIENTE · ORIGINAL A 2400 PX") · TarjetaProyecto ·
             TarjetaArticulo · MuestraAcabado (muestra cuadrada de modelo + color)
  secciones/ FormularioPresupuesto (corto: nombre, teléfono, qué quieres pavimentar; completo:
             + email, superficie m², municipio, mensaje, foto, casilla privacidad) · Acordeon
             de FAQ · SubmenuServicio (anclas fijas dentro de la página de servicio) ·
             FiltrosProyectos · PlantillaLegal

=====================================================================
3. REGLAS DE CONSTRUCCIÓN (no negociables, vienen del esqueleto)
=====================================================================
- Define tokens con ESTOS nombres y elige tú los valores: fondo, fondo-alt, tinta, tinta-media,
  pigmento (acento), pigmento-hover, acero (secundario frío), sobre-tinta (texto sobre oscuro),
  error. Nada fuera de la paleta.
- Tres familias: una display para titulares, una de texto, una monoespaciada para datos de
  obra (m², espesor, color, modelo, municipio, año) que siempre van en mono, en versalitas,
  como etiqueta de especificación. Suelo de la mono: 10 px.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88 px. Nada intermedio.
- Esquinas a 0. Una sola sombra en toda la web: la de la barra fija de móvil.
- Regla del acento: por pantalla, un CTA primario y el estado activo. Nunca como texto pequeño
  sobre fondo claro.
- Objetivo táctil 44 px, foco visible, contraste AA.
- Cero fotos de stock de personas. Donde falte foto real, BloquePosicion con trama.
- Un dato sin confirmar (horario, WhatsApp, año de fundación, m² de una obra) se pinta con
  DatoPendiente: [entre corchetes] y atenuado. No lo maquilles.
- Un solo teléfono y una sola dirección en todo el sitio.

=====================================================================
4. PANTALLAS A ENTREGAR (móvil 390 y escritorio 1440, las dos normativas)
=====================================================================
01 SISTEMA — lámina de tokens y los componentes anteriores, con estados (hover, activo,
   deshabilitado, error, pendiente).
02 HOME — hero con titular y dos CTA (Pedir presupuesto / Ver proyectos); BarraConfianza;
   "¿Qué quieres pavimentar?" con 6 espacios (entrada de garaje, porche/terraza, contorno de
   piscina, interior de vivienda, patio/jardín, nave/parking/local); servicios (los 7, con los
   3 fuertes destacados); obras destacadas (3 TarjetaProyecto con datos reales de la sección 5);
   muestrario de modelos y colores (MuestraAcabado con los modelos y colores reales);
   garantía 10 años; FAQ (acordeón, 4-5 preguntas SIN respuesta inventada: deja la respuesta
   como DatoPendiente); formulario corto; pie.
03 SERVICIO (hormigón impreso como ejemplo) — hero, SubmenuServicio con anclas (qué es,
   dónde se usa, modelos y colores, ficha técnica, obras, FAQ, presupuesto), TablaFichaTecnica
   con los datos literales de la sección 5, listas de aplicaciones reales, obras de esa técnica,
   CTA.
04 PROYECTOS — índice con FiltrosProyectos (escritorio: fila de chips fija; móvil: botón
   "Filtrar" que abre hoja inferior), rejilla de TarjetaProyecto, EstadoVacio.
05 FICHA DE OBRA (Dénia) — galería (BloquePosicion 21:9 + 4 miniaturas), título, "El encargo"
   y "La ejecución" con el texto real, FichaObra lateral fija con: técnica, modelo, color,
   espesor, hormigón, árido, mallazo, fibra, dosificación de color, municipio, m²
   [pendiente], año [pendiente]; obras similares.
06 EMPRESA — texto real de la sección 5, cinco valores, zona de trabajo (lista de municipios
   con obra), BloquePosicion para foto de equipo (nunca stock).
07 PRESUPUESTO — formulario completo a la izquierda/derecha, columna fija con teléfono,
   WhatsApp [pendiente], y EtiquetaTecnica con los cuatro claims; estados: inicial, error de
   teléfono, enviando, enviado.
08 BLOG — índice y artículo (TarjetaArticulo, ancho de lectura 68 caracteres).
09 LEGAL + 404.
Cabecera, MenuMovil, BarraMovil, Consentimiento y Pie aparecen en todas.

=====================================================================
5. CONTENIDO REAL (usa esto, literal o ligeramente editado al tuteo)
=====================================================================
HOME / MARCA
- "Expertos en pavimentos de hormigón" · "Especialistas en hormigón impreso y hormigón pulido"
- "Ejecución y conservación de toda clase de pavimentos, recubrimientos y estructuras de
  hormigón […] más de 15 años de experiencia en el área profesional de edificación y obra
  civil […] realizamos trabajos para empresas, particulares y profesionales del sector."
- "Nuestros años de experiencia junto a la calidad y la perfección de nuestros acabados han
  sido el motor de nuestra empresa […] una marca de calidad superior a precios justos y
  competentes, nuestro secreto no es otro que el trabajo duro, la auto-superación y la pasión
  en cada detalle de lo que hacemos."
- Qué hacen (lista literal): Soleras de hormigón pulido · Piscinas de hormigón · Patios y
  terrazas · Cimentaciones y estructuras de viviendas unifamiliares · Revestimiento de fachadas
  y muros · Elementos de fincas como pasos, badenes, cunetas.
- Garantía: "La calidad de nuestros trabajos es inmejorable, pero no nos vamos a quedar ahí,
  le ofrecemos 10 años de garantía en todos nuestros trabajos y le proporcionamos el
  mantenimiento de los mismos, somos una empresa seria, queremos que vuelva a contratarnos en
  el futuro."
- Datos para BarraConfianza: MÁS DE 15 AÑOS DE OFICIO · 10 AÑOS DE GARANTÍA CON MANTENIMIENTO ·
  VALENCIA, CASTELLÓN, ALICANTE, MURCIA, ALBACETE Y ALMERÍA (cobertura declarada, pendiente de
  confirmar) · MÁS DEL 30 % DE CLIENTES REPITEN.

EMPRESA
- "Somos una empresa dedicada a los pavimentos de hormigón impreso, pulido, decorativo y obras
  industriales, contamos con una gran trayectoria que durante más de 15 años ha servido a
  empresarios, propietarios y visionarios […] Contamos con un excelente y dinámico equipo de
  profesionales altamente cualificados […]"
- "Tenemos especial experiencia y capacidad en la construcción de propiedades residenciales,
  complejos comerciales e instalaciones deportivas […] disponemos de un equipo de trabajadores
  especializados, la maquinaria necesaria para su ejecución y todos los utensilios y moldes
  que permiten una correcta realización de la obra."
- "Esta empresa es el resultado de la experiencia de 15 años de trayectoria empresarial y un
  estudio continuo de los procesos de ejecución en pavimentación y revestimientos de hormigón."
- Cinco valores: SOMOS CLAROS Y LEGALES ("trato claro, directo y personalizado,
  involucrándonos en su proyecto como si fuera nuestro") · CREEMOS EN LO QUE HACEMOS ("lo
  demostramos en cada metro construido, en cada proyecto terminado") · ALTO NIVEL DE
  SATISFACCIÓN Y CONFIANZA ("más del 30% de nuestros trabajos son clientes para los que ya
  hemos trabajado anteriormente") · CALIDAD Y GARANTÍA (10 años + mantenimiento) ·
  PAVIMENTOS DE HORMIGÓN DE CONFIANZA ("la mayoría de los nuestros siguen solicitando
  nuestros servicios después de muchos años").

SERVICIO: HORMIGÓN IMPRESO
- "Pavimentos de hormigón impreso, revestimiento de fachadas y muros, recubrimiento de
  piscinas, patios, terrazas, jardines o paseos."
- Argumento propio: también en vertical ("revestimientos de hormigón impreso en paredes y
  muros" con la misma gama de colores y texturas).
- "destacan por su durabilidad, impermeabilidad y una alta gama de colores y diseños […]
  soporta el ataque de ácidos y manchas de grasa o aceite, además puede utilizarse en zonas
  muy castigadas por el tránsito, como aceras, parques, rampas, recintos feriales […] casi
  nulo mantenimiento […] triunfa en las viviendas con jardín".
- "la estampación puede imitar adoquines, piedra, baldosas o pizarras".
- Aplicaciones: Fincas y pasos · Calles y paseos · Patios y terrazas · Piscinas y jardines ·
  Badenes y cunetas · Revestimiento de muros · Revestimiento de fachadas.
- Ventajas: Diseños personalizados · Amplia gama de colores · Amplia gama de modelos ·
  Garantía de 10 años · Bajo coste de mantenimiento · No se agrieta · No se deforma.
- Modelos con obra documentada: piedra inglesa, sillería, sillería grande, adoquín belga,
  manteado. Colores con obra: gris medio, gris oscuro, gris muy oscuro, gris mate, marrón,
  crema, arena, 107, 117.
- Ficha técnica real (obra de Dénia): hormigón HM20 · espesor 10 cm · árido 12 mm · mallazo
  20×30 · fibra de polipropileno 4 mm · 4 kg de color por m². (Calpe 2021: HM25, 10 cm,
  juntas de dilatación 5×5. Moraira: HM20, 12 cm, acabado mate.)

SERVICIO: HORMIGÓN PULIDO
- "ideales tanto para suelos industriales, como para terrazas, piscinas, jardines y zonas de
  interior" · "durabilidad, impermeabilidad, precio y bajo mantenimiento".
- "aparcamientos, naves industriales, almacenes, garajes, patios, terrazas y jardines, zonas
  interiores y centros comerciales […] gracias a las nuevas técnicas de acabado se usa también
  a nivel doméstico".
- "se integran directamente al hormigón, no se astillan ni generan grietas […] acabado en
  multitud de colores brillo o mate" · "soporta el ataque de ácidos y manchas de grasa y
  aceite".
- Aplicaciones: Patios y jardines · Parkings y garajes · Naves industriales · Centros
  comerciales · Salas y exposiciones · Pabellones deportivos.
- Ventajas: Resistente y duradero · Amplia gama de colores · Bajo coste de mantenimiento ·
  Garantía de 10 años · Completamente impermeable · No se astilla · No se agrieta · No se
  deforma.
- Obras: Xàbia 120 m² crema 117; Benissa unifamiliar interior+exterior+piscina 117 crema
  marfil; Benissa Monte Mar crema 117 con mallazo, fibra y 4 kg color/m²; Riba-roja nave
  industrial color natural; Daimús nave industrial 2000 m² con muelle de carga.

SERVICIO: HORMIGÓN LAVADO (ÁRIDO VISTO)
- "Gracias a las distintas clases de áridos, granulometrías y colores obtenemos una amplia
  variedad de atractivos y resistentes acabados."
- "rugosos, antideslizantes y muy resistentes al desgaste y a la acción de los agentes
  atmosféricos […] salidas de parkings, urbanizaciones, rampas".
- "zonas peatonales, entornos de piscinas, viales de tráfico rodado ligero, calles de parques,
  zonas de recreo".
- Ficha técnica literal: hormigón HA-25, cono blando, árido seleccionado según acabado, fibra
  de polipropileno, aditivado, pigmentable en masa; resistencia HA-25 según EHE-08;
  superficie antideslizante clase 3 Rd>45 (áridos de machaqueo).
- "antes de iniciar nuestro trabajo preparamos el terreno para la ejecución de la solera […]
  cuidamos mucho la preparación del soporte".
- Obra: Godella, jardín de vivienda, gris, árido 12 mm piedra vista, modelo "valencia
  aserras".

SERVICIO: MICROCEMENTO DECORATIVO
- "renovamos por completo suelos, paredes, baños, cocinas o revestimientos de su hogar con un
  ahorro económico y de tiempo muy importante, ya que no se debe retirar el material
  existente".
- Cuidado: "agua y jabón neutro con un PH entre 6 y 9 […] mopa o fregona […] cera de
  autobrillo […] no utilizar disolventes o ácidos, esponjas, lijas ni cepillos metálicos".
- "material sintético […] mucho más durable y resistente que el cemento común […] difícil de
  corroer, agrietar y resquebrajar" · "resistente al agua y a las altas temperaturas".
- Dónde: Vigas · Baños · Suelos · Cocinas · Paredes · Bañeras. "una de las opciones decorativas
  más utilizadas por los diseñadores".
- Obras: baño completo en Moraira gris claro; reforma completa de baño en Alicante con color
  elegido por diseñador.

SERVICIO: AUTONIVELANTES
- "Morteros autonivelantes decorativos". Maquinaria propia: "bombas impulsoras de
  autonivelante". Aditivos: superfluidificantes, reductores de retracción, aireantes,
  modificadores de viscosidad. "tiempo mínimo de secado es de más de 24 horas". "no se nivelan
  ellos solos, sino que es necesario alisarlos manualmente".
- "apuesta decidida por la arquitectura creativa, inspirada en acabados cromáticos naturales
  […] lisos o antideslizantes, industriales o decorativos, flexibles, conductores y
  alimentarios […] adaptados al código técnico de la edificación". Sin obra documentada.

SERVICIO: PAVIMENTOS DE CAUCHO
- "Pavimentos de caucho para parques infantiles". "solución limpia y segura para la creación
  de zonas lúdicas infantiles y zonas deportivas […] minimizar los riesgos de lesiones
  producidos por las caídas de los niños desde los equipos de juego".
- Sistemas: EPDM vulcanizado o SBR reciclado + capa de SBR coloreado in situ; espesor según el
  HIC del equipo de juego; normas EN 1176 y EN 1177. Sin obra documentada.

SERVICIO: ALICATADOS EN VALENCIA
- "servicio de alicatados en toda la provincia de Valencia, tanto proyectos de renovación
  residencial como grandes obras comerciales […] desde baños y cocinas hasta espacios
  exteriores como piscinas y terrazas".
- Pilares: Variedad de diseños · Durabilidad y resistencia · Acabados profesionales ·
  Asesoramiento personalizado. Materiales: "desde cerámicas y porcelanas hasta azulejos de
  diseño". Sin obra documentada.

OBRAS PARA TARJETAS Y FICHAS (15; usa mínimo las 6 con datos técnicos)
- Dénia · impreso · piedra inglesa gris mate y crema · HM20 10 cm árido 12 mm mallazo 20×30
  fibra 4 mm 4 kg color/m² · vivienda en urbanización · 2017
- Moraira · impreso · manteado gris y marrón · HM20 12 cm árido 12 mm mate · chalé con jardín
  y piscina · 2016
- Calpe · impreso · sillería grande arena · HM25 10 cm árido 12 mm mallazo fibra juntas 5×5 ·
  2021
- Calpe · impreso · piedra inglesa gris medio · urbanización · 2016
- Benissa (Monte Mar) · impreso · adoquín belga gris oscuro · terreno con desnivel · 2016
- Llíria · impreso · sillería color 107 · urbanización · 2016
- Montaverner · impreso · piedra inglesa gris muy oscuro · 2016
- Xàbia · pulido · crema 117 · 120 m² · residencia en urbanización · 2016
- Benissa (Montemar la Viña) · pulido · 117 crema marfil · interior, exterior y piscina · 2017
- Benissa (Monte Mar) · pulido · crema 117 · mallazo, fibra, 4 kg color/m² · 2016
- Riba-roja de Túria · pulido · natural · nave industrial · 2016
- Daimús · pulido · 2000 m² · nave industrial con muelle de carga · 2016
- Godella · lavado · gris árido 12 mm · jardín · 2017
- Moraira · microcemento · gris claro · baño completo
- Alicante · microcemento · baño completo
(Los años vienen de la fecha de la foto; píntalos como DatoPendiente. Ninguna obra tiene foto a
2400 px: usa BloquePosicion en todas.)

FORMULARIO DE PRESUPUESTO (campos del esqueleto)
Nombre y apellidos* · Teléfono* · Email · ¿Qué quieres pavimentar?* (Entrada de garaje ·
Porche o terraza · Contorno de piscina · Interior de vivienda · Patio o jardín · Nave, parking
o local · Otro) · Superficie aproximada en m² · Municipio* · Cuéntanos algo más · Sube una foto
del espacio · Acepto la política de privacidad*. Botón: "Enviar y que me llamen". Estado
enviado: "Recibido" + resumen de lo pedido. Sin prometer plazo de respuesta: DatoPendiente.

PIE
Logo · dirección · teléfono · email · lista de 7 servicios · Aviso legal · Política de
privacidad · Política de cookies · "PROYECTO WEB FINANCIADO POR LA UNIÓN EUROPEA –
NEXTGENERATIONEU" con logos · © 2026 Pavivasa.

=====================================================================
6. LO QUE NO PUEDES HACER
=====================================================================
- Inventar reseñas, testimonios, valoraciones con estrellas, logos de clientes, precios por
  m², plazos de respuesta, horarios, años concretos de fundación o número de obras.
- Usar fotos de personas, ni de stock de obra. Toda imagen es BloquePosicion hasta que
  lleguen originales.
- Reutilizar la paleta o las tipografías de Pavimentos Albufera.
- Mantener el Lorem ipsum, el "usted" ni las erratas de la web actual.
- Añadir colores, tamaños de letra, radios o sombras fuera de las reglas de la sección 3.
```
