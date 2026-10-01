import type { Service } from '../schemas/service.ts'

/**
 * Real copy for each service (pavivasa.com, Sept. 2026), unchanged from
 * Spanish. Array order is the site's menu order (`01`..`07`); the three
 * marked `flagship: true` (`hormigon-impreso`, `hormigon-pulido`,
 * `microcemento` — not necessarily contiguous in this order) are the
 * declared strongest offer. What the current site doesn't give (FAQ
 * answers, some execution data) stays `undefined` and is rendered as
 * pending data.
 */
export const services = [
  {
    id: 'hormigon-impreso',
    slug: { es: 'hormigon-impreso' },
    number: '01',
    name: { es: 'Hormigón impreso' },
    shortName: { es: 'Impreso' },
    summary: {
      es: 'Patios, terrazas, piscinas, jardines y paseos. También en vertical: fachadas y muros con la misma carta de moldes y colores.',
    },
    description: {
      es: 'Pavimentos de hormigón impreso en Valencia y Alicante: patios, terrazas, piscinas, jardines, fachadas y muros. Más de 15 años de oficio y 10 años de garantía.',
    },
    intro: {
      es: 'Pavimentos de hormigón impreso, revestimiento de fachadas y muros, recubrimiento de piscinas, patios, terrazas, jardines o paseos. Piedra, adoquín, baldosa o pizarra: el molde y el color los eliges tú.',
    },
    introMobile: {
      es: 'Patios, terrazas, piscinas, jardines, paseos, fachadas y muros. Piedra, adoquín, baldosa o pizarra: el molde y el color los eliges tú.',
    },
    heroImage: {
      label: { es: 'Foto · detalle molde piedra inglesa · Dénia' },
      src: '/img/impreso-textura-piedra.jpg',
      alt: { es: 'Detalle del molde de piedra inglesa marcado sobre hormigón impreso en tono terracota' },
    },
    about: {
      title: { es: 'Una solera de hormigón con acabado decorativo' },
      paragraphs: [
        {
          es: 'El hormigón impreso da las mismas prestaciones que una solera de hormigón, con la ventaja de un aspecto más decorativo y elegante. Destaca por su durabilidad, su impermeabilidad y una gama muy alta de colores y diseños. Al ser impermeable, soporta el ataque de ácidos y las manchas de grasa o aceite, y aguanta zonas muy castigadas por el tránsito: aceras, parques, rampas, recintos feriales.',
        },
        {
          es: 'Trabajamos en horizontal y en vertical: el mismo sistema, con la misma gama de colores, diseños y texturas, sirve para revestir paredes, muros y fachadas. Sumado al casi nulo mantenimiento, es lo que explica que triunfe en las viviendas con jardín, desplazando a los pavimentos tradicionales.',
        },
      ],
    },
    applications: [
      { es: 'Fincas y pasos' },
      { es: 'Calles y paseos' },
      { es: 'Patios y terrazas' },
      { es: 'Piscinas y jardines' },
      { es: 'Badenes y cunetas' },
      { es: 'Revestimiento de muros' },
      { es: 'Revestimiento de fachadas' },
    ],
    advantages: [
      { es: 'Diseños personalizados' },
      { es: 'Amplia gama de colores' },
      { es: 'Amplia gama de modelos' },
      { es: 'Garantía de 10 años' },
      { es: 'Bajo coste de mantenimiento' },
      { es: 'No se agrieta' },
      { es: 'No se deforma' },
    ],
    models: [
      { es: 'Piedra inglesa' },
      { es: 'Sillería' },
      { es: 'Sillería grande' },
      { es: 'Adoquín belga' },
      { es: 'Manteado' },
    ],
    colors: [
      { es: 'Gris medio' },
      { es: 'Gris oscuro' },
      { es: 'Gris muy oscuro' },
      { es: 'Gris mate' },
      { es: 'Marrón' },
      { es: 'Crema' },
      { es: 'Arena' },
      { es: '107' },
      { es: '117' },
    ],
    specSheet: {
      title: { es: 'Cómo lo ejecutamos' },
      text: {
        es: 'Datos reales de tres obras. Cada proyecto se dimensiona según el uso: no es lo mismo una entrada de garaje que un contorno de piscina.',
      },
      columns: [{ es: 'Dénia · vivienda' }, { es: 'Moraira · chalé y piscina' }, { es: 'Calpe · exterior' }],
      rows: [
        { parameter: { es: 'Hormigón' }, values: [{ es: 'HM20' }, { es: 'HM20' }, { es: 'HM25' }] },
        { parameter: { es: 'Espesor' }, values: [{ es: '10 cm' }, { es: '12 cm' }, { es: '10 cm' }] },
        { parameter: { es: 'Árido' }, values: [{ es: '12 mm' }, { es: '12 mm' }, { es: '12 mm' }] },
        { parameter: { es: 'Mallazo' }, values: [{ es: '20×30 · 4 mm' }, null, { es: 'Sí' }] },
        { parameter: { es: 'Fibra' }, values: [{ es: 'Polipropileno' }, null, { es: 'Polipropileno' }] },
        { parameter: { es: 'Dosificación de color' }, values: [{ es: '4 kg/m²' }, null, null] },
        { parameter: { es: 'Juntas de dilatación' }, values: [null, null, { es: '5×5 m' }] },
        {
          parameter: { es: 'Modelo · color' },
          values: [
            { es: 'Piedra inglesa · gris mate y crema' },
            { es: 'Manteado · gris y marrón · mate' },
            { es: 'Sillería grande · arena' },
          ],
        },
      ],
    },
    faq: [
      { question: { es: '¿Se puede poner impreso sobre un suelo que ya existe?' } },
      { question: { es: '¿Cuánto tarda en poder pisarse y en poder aparcar?' }, answer: { es: 'Normalmente se puede pisar a las 24-48 horas y circular con vehículos ligeros pasada una semana, aproximadamente. Son plazos orientativos: el clima, el espesor y la resina pueden alargarlos, y el curado completo del hormigón lleva unas 4 semanas. Conviene evitar mojar el pavimento los primeros días y respetar el plazo antes de aparcar.' } },
      { question: { es: '¿Qué mantenimiento necesita?' }, answer: { es: 'El hormigón impreso necesita poco mantenimiento: limpieza con agua y jabón neutro y renovar la resina de sellado cada 2 o 3 años, según el uso y la exposición. Esa resina protege el color y evita que penetren manchas y humedad. Si el agua ya no forma gotas sobre la superficie, es momento de revisar el sellado.' } },
      { question: { es: '¿Qué cubre la garantía de 10 años?' } },
    ],
    cta: { es: '¿Un patio, una entrada, una piscina? Dinos los metros y te llamamos.' },
    flagship: true,
  },
  {
    id: 'hormigon-pulido',
    slug: { es: 'hormigon-pulido' },
    number: '02',
    name: { es: 'Hormigón pulido' },
    shortName: { es: 'Pulido' },
    summary: {
      es: 'Naves, garajes y parkings; y cada vez más en interiores de vivienda. Impermeable, no se astilla ni agrieta, acabado brillo o mate.',
    },
    description: {
      es: 'Pavimentos de hormigón pulido para naves industriales, garajes, parkings, terrazas, piscinas e interiores de vivienda. Durabilidad, impermeabilidad y bajo mantenimiento.',
    },
    intro: {
      es: 'Pavimentos ideales tanto para suelos industriales como para terrazas, piscinas, jardines y zonas de interior. Durabilidad, impermeabilidad, precio y bajo mantenimiento, en acabado brillo o mate.',
    },
    introMobile: {
      es: 'Suelos industriales, terrazas, piscinas, jardines e interiores. Durabilidad, impermeabilidad, precio y bajo mantenimiento.',
    },
    heroImage: {
      label: { es: 'Foto · nave industrial · pulido natural · Riba-roja' },
      src: '/img/pulido-explanada-nave.jpg',
      alt: { es: 'Explanada de hormigón pulido en color natural ante una nave industrial blanca' },
    },
    about: {
      title: { es: 'Un pavimento continuo que se integra en el hormigón' },
      paragraphs: [
        {
          es: 'El hormigón pulido se usa en aparcamientos, naves industriales, almacenes, garajes, patios, terrazas y jardines, zonas interiores y centros comerciales. Gracias a las nuevas técnicas de acabado se usa también a nivel doméstico, con resultados muy vanguardistas.',
        },
        {
          es: 'Los tratamientos se integran directamente al hormigón: no se astillan ni generan grietas, y admiten un acabado en multitud de colores, brillo o mate. Soporta el ataque de ácidos y las manchas de grasa y aceite.',
        },
      ],
    },
    applications: [
      { es: 'Patios y jardines' },
      { es: 'Parkings y garajes' },
      { es: 'Naves industriales' },
      { es: 'Centros comerciales' },
      { es: 'Salas y exposiciones' },
      { es: 'Pabellones deportivos' },
    ],
    advantages: [
      { es: 'Resistente y duradero' },
      { es: 'Amplia gama de colores' },
      { es: 'Bajo coste de mantenimiento' },
      { es: 'Garantía de 10 años' },
      { es: 'Completamente impermeable' },
      { es: 'No se astilla' },
      { es: 'No se agrieta' },
      { es: 'No se deforma' },
    ],
    models: [],
    colors: [{ es: 'Crema 117' }, { es: '117 crema marfil' }, { es: 'Natural' }],
    specSheet: {
      title: { es: 'Cómo lo ejecutamos' },
      text: {
        es: 'Datos reales de tres obras de pulido, de la vivienda a la nave industrial. Lo que la web actual no detalla queda pendiente.',
      },
      columns: [{ es: 'Benissa · urbanización' }, { es: 'Riba-roja · nave' }, { es: 'Daimús · nave' }],
      rows: [
        { parameter: { es: 'Superficie' }, values: [null, null, { es: '2000 m²' }] },
        { parameter: { es: 'Mallazo' }, values: [{ es: 'Sí' }, { es: 'Sí' }, null] },
        { parameter: { es: 'Fibra' }, values: [{ es: 'Polipropileno' }, { es: 'Polipropileno' }, null] },
        { parameter: { es: 'Dosificación de color' }, values: [{ es: '4 kg/m²' }, null, null] },
        { parameter: { es: 'Color' }, values: [{ es: 'Crema 117' }, { es: 'Natural' }, null] },
        {
          parameter: { es: 'Uso' },
          values: [{ es: 'Exterior' }, { es: 'Nave industrial' }, { es: 'Nave con muelle de carga' }],
        },
      ],
    },
    faq: [
      { question: { es: '¿Sirve el pulido para el interior de una vivienda?' }, answer: { es: 'Sí, el hormigón pulido sirve para el interior de una vivienda: es un suelo continuo, con pocas juntas, fácil de limpiar y compatible con suelo radiante. Hemos ejecutado un pulido en el interior de una vivienda unifamiliar en Benissa (Alicante). Conviene prever juntas de retracción y tener en cuenta que es un material frío al tacto.' } },
      { question: { es: '¿Qué diferencia hay entre acabado brillo y mate?' }, answer: { es: 'La diferencia está en cuánta luz refleja el suelo: el acabado brillo es más reflectante y el mate es más sobrio, con menos reflejo. Depende del grado de pulido o del sellador aplicado. En exteriores y zonas húmedas, además del aspecto, hay que mirar la resbaladicidad: el CTE pide clase 3 en exteriores.' } },
      { question: { es: '¿Cuánto aguanta el paso de carretillas y camiones?' }, answer: { es: 'Un hormigón pulido bien diseñado soporta el paso de carretillas y camiones: es el pavimento habitual en naves y muelles de carga. Cuánto aguanta depende del espesor, del armado con mallazo y fibras, de la subbase y de las cargas puntuales, como estanterías o ruedas duras. Por eso no hay una cifra válida para todos los casos: se define según el uso previsto de cada obra.' } },
      { question: { es: '¿Qué cubre la garantía de 10 años?' } },
    ],
    cta: { es: '¿Una nave, un garaje, un interior? Dinos los metros y te llamamos.' },
    flagship: true,
  },
  {
    id: 'hormigon-lavado',
    slug: { es: 'hormigon-lavado' },
    number: '03',
    name: { es: 'Hormigón lavado' },
    shortName: { es: 'Lavado' },
    summary: { es: 'Árido visto, antideslizante. Rampas, salidas de parking, entornos de piscina.' },
    description: {
      es: 'Hormigón lavado o árido visto: pavimentos rugosos, antideslizantes y muy resistentes al desgaste para rampas, salidas de parking, entornos de piscina y zonas peatonales.',
    },
    intro: {
      es: 'Gracias a las distintas clases de áridos, granulometrías y colores obtenemos una amplia variedad de acabados atractivos y resistentes. Rugosos, antideslizantes y muy resistentes al desgaste y a los agentes atmosféricos.',
    },
    introMobile: {
      es: 'Árido visto: acabados rugosos, antideslizantes y muy resistentes al desgaste y a los agentes atmosféricos.',
    },
    heroImage: {
      label: { es: 'Foto · árido visto gris 12 mm · Godella' },
      src: '/img/desactivado-camino-gris.jpg',
      alt: { es: 'Acceso en hormigón lavado con árido visto de tono gris' },
    },
    about: {
      title: { es: 'Árido a la vista, agarre en el pie' },
      paragraphs: [
        {
          es: 'El hormigón lavado deja a la vista el árido de la masa. El resultado es un pavimento rugoso, antideslizante y muy resistente al desgaste y a la acción de los agentes atmosféricos: por eso se usa en salidas de parkings, urbanizaciones y rampas.',
        },
        {
          es: 'Antes de iniciar el trabajo preparamos el terreno para la ejecución de la solera. Cuidamos mucho la preparación del soporte: de ahí sale la mitad de la durabilidad del pavimento.',
        },
      ],
    },
    applications: [
      { es: 'Zonas peatonales' },
      { es: 'Entornos de piscina' },
      { es: 'Viales de tráfico rodado ligero' },
      { es: 'Calles de parques' },
      { es: 'Zonas de recreo' },
      { es: 'Salidas de parking y rampas' },
    ],
    advantages: [
      { es: 'Antideslizante' },
      { es: 'Muy resistente al desgaste' },
      { es: 'Aguanta los agentes atmosféricos' },
      { es: 'Garantía de 10 años' },
      { es: 'Variedad de áridos y colores' },
      { es: 'Más económico que el hormigón convencional' },
    ],
    models: [{ es: 'Valencia aserras' }],
    colors: [{ es: 'Gris' }],
    specList: {
      title: { es: 'Ficha técnica' },
      text: { es: 'Especificación literal del hormigón lavado que ejecutamos.' },
      lines: [
        { label: { es: 'Hormigón' }, value: { es: 'HA-25 · cono blando' } },
        { label: { es: 'Árido' }, value: { es: 'Seleccionado según acabado' } },
        { label: { es: 'Fibra' }, value: { es: 'Polipropileno' } },
        { label: { es: 'Aditivado' }, value: { es: 'Sí · pigmentable en masa' } },
        { label: { es: 'Resistencia' }, value: { es: 'HA-25 según EHE-08' } },
        { label: { es: 'Superficie' }, value: { es: 'Antideslizante clase 3 · Rd > 45 · áridos de machaqueo' } },
      ],
    },
    faq: [
      { question: { es: '¿Qué tamaño de árido conviene para una rampa?' }, answer: { es: 'Para una rampa conviene un árido de machaqueo (triturado) de tamaño medio o grueso, mejor que el canto rodado, que resbala más. Lo importante es que el pavimento alcance clase 3 de resbaladicidad (Rd > 45), que el CTE pide en exteriores. El tamaño final depende de la pendiente y del acabado que busques.' } },
      { question: { es: '¿Se puede combinar con hormigón impreso en la misma obra?' } },
      { question: { es: '¿Qué mantenimiento necesita?' }, answer: { es: 'El hormigón lavado necesita poco mantenimiento: basta con limpiarlo con agua y detergente suave y, en zonas con más tránsito, pasar la hidrolimpiadora de vez en cuando. Si se quiere reavivar el color del árido y facilitar la limpieza, se puede aplicar un sellador protector, normalmente cada varios años según el uso y la exposición.' } },
    ],
    cta: { es: '¿Una rampa, un vial, el borde de la piscina? Dinos los metros y te llamamos.' },
    flagship: false,
  },
  {
    id: 'microcemento',
    slug: { es: 'microcemento' },
    number: '04',
    name: { es: 'Microcemento decorativo' },
    shortName: { es: 'Microcemento' },
    summary: {
      es: 'Renueva suelos, paredes, baños y cocinas sin retirar el material existente. Ahorro de tiempo y de obra.',
    },
    description: {
      es: 'Microcemento decorativo en baños, cocinas, suelos y paredes. Renovación completa sin retirar el material existente, con ahorro económico y de tiempo.',
    },
    intro: {
      es: 'Renovamos por completo suelos, paredes, baños, cocinas o revestimientos de tu hogar con un ahorro económico y de tiempo muy importante: no hay que retirar el material existente.',
    },
    introMobile: { es: 'Suelos, paredes, baños y cocinas renovados sin retirar el material existente.' },
    heroImage: {
      label: { es: 'Foto · baño en microcemento gris claro · Moraira' },
      src: '/img/microcemento-bano-lavabos2.jpg',
      alt: { es: 'Baño revestido en microcemento gris claro con encimera continua y dos lavabos' },
    },
    about: {
      title: { es: 'Un material sintético más duro que el cemento común' },
      paragraphs: [
        {
          es: 'El microcemento es un material sintético mucho más durable y resistente que el cemento común: difícil de corroer, agrietar y resquebrajar, y resistente al agua y a las altas temperaturas. Es una de las opciones decorativas más utilizadas por los diseñadores.',
        },
        {
          es: 'Como no hay que eliminar el material existente, se abaratan los costes y los tiempos de trabajo y se evitan las molestias del desescombro y su posterior recogida.',
        },
      ],
    },
    applications: [
      { es: 'Baños' },
      { es: 'Cocinas' },
      { es: 'Suelos' },
      { es: 'Paredes' },
      { es: 'Bañeras' },
      { es: 'Vigas' },
    ],
    advantages: [
      { es: 'Sin retirar el material existente' },
      { es: 'Ahorro de tiempo y de obra' },
      { es: 'Resistente al agua' },
      { es: 'Resistente a las altas temperaturas' },
      { es: 'Difícil de agrietar' },
      { es: 'Garantía de 10 años' },
    ],
    models: [],
    colors: [{ es: 'Gris claro' }],
    specList: {
      title: { es: 'Cuidado del microcemento' },
      text: { es: 'Cómo se mantiene para que dure. Lo que no hay que hacer también cuenta.' },
      lines: [
        { label: { es: 'Limpieza' }, value: { es: 'Agua y jabón neutro · pH entre 6 y 9' } },
        { label: { es: 'Útiles' }, value: { es: 'Mopa o fregona' } },
        { label: { es: 'Protección' }, value: { es: 'Cera de autobrillo' } },
        { label: { es: 'Evitar' }, value: { es: 'Disolventes, ácidos, esponjas, lijas y cepillos metálicos' } },
      ],
    },
    faq: [
      { question: { es: '¿Se puede aplicar sobre los azulejos del baño?' }, answer: { es: 'Sí, normalmente el microcemento se puede aplicar sobre los azulejos del baño sin retirarlos, siempre que estén firmes, limpios y sin piezas sueltas. Se rellenan las juntas, se aplica una imprimación de agarre específica para superficies no absorbentes y, por lo general, una malla de fibra de vidrio antes de las capas de microcemento. Conviene valorar el estado del soporte antes de decidirlo.' } },
      { question: { es: '¿Cuánto dura la reforma de un baño?' } },
      { question: { es: '¿Resbala en una ducha?' }, answer: { es: 'Depende del acabado: el microcemento no es antideslizante por sí mismo, lo es el sistema con su sellador y su textura. En duchas conviene pedir un acabado antideslizante y comprobar su clase de resbaladicidad (Rd, ensayo UNE-ENV 12633). El CTE DB-SUA 1 pide, en zonas interiores húmedas con poca pendiente, clase 2 (Rd entre 35 y 45), y muchas guías recomiendan clase 3 (Rd mayor de 45) dentro de la ducha.' } },
      { question: { es: '¿Qué cubre la garantía de 10 años?' } },
    ],
    cta: { es: '¿Un baño, una cocina, un suelo entero? Dinos los metros y te llamamos.' },
    flagship: true,
  },
  {
    id: 'autonivelantes',
    slug: { es: 'autonivelantes' },
    number: '05',
    name: { es: 'Autonivelantes' },
    shortName: { es: 'Autonivelantes' },
    summary: { es: 'Morteros decorativos, lisos o antideslizantes, con bomba propia.' },
    description: {
      es: 'Morteros autonivelantes decorativos: lisos o antideslizantes, industriales o decorativos, con maquinaria propia de bombeo y adaptados al Código Técnico de la Edificación.',
    },
    intro: {
      es: 'Morteros autonivelantes decorativos. Una apuesta por la arquitectura creativa, inspirada en acabados cromáticos naturales: lisos o antideslizantes, industriales o decorativos, flexibles, conductores y alimentarios.',
    },
    introMobile: { es: 'Morteros decorativos lisos o antideslizantes, industriales o decorativos, con bomba propia.' },
    heroImage: {
      label: { es: 'Foto · suelo continuo pulido junto a cerramiento acristalado' },
      src: '/img/pulido-interior-acristalado.jpg',
      alt: { es: 'Suelo continuo liso y brillante en un interior con grandes ventanales acristalados' },
    },
    about: {
      title: { es: 'Un mortero que se bombea y se alisa a mano' },
      paragraphs: [
        {
          es: 'Contamos con maquinaria propia: bombas impulsoras de autonivelante. Los morteros llevan aditivos superfluidificantes, reductores de retracción, aireantes y modificadores de viscosidad. Pese al nombre, no se nivelan solos: hay que alisarlos manualmente.',
        },
        {
          es: 'El tiempo mínimo de secado es de más de 24 horas. Todos los acabados están adaptados al Código Técnico de la Edificación.',
        },
      ],
    },
    applications: [
      { es: 'Suelos industriales' },
      { es: 'Suelos decorativos' },
      { es: 'Zonas alimentarias' },
      { es: 'Pavimentos conductores' },
    ],
    advantages: [
      { es: 'Acabados lisos o antideslizantes' },
      { es: 'Flexibles' },
      { es: 'Conductores' },
      { es: 'Alimentarios' },
      { es: 'Adaptados al CTE' },
      { es: 'Bomba propia' },
    ],
    models: [],
    colors: [],
    faq: [
      { question: { es: '¿Sobre qué soporte se puede aplicar un autonivelante?' }, answer: { es: 'Un mortero autonivelante se aplica sobre un soporte firme, estable, limpio y libre de polvo, grasas y restos: normalmente soleras de hormigón o cemento y, según el producto, también anhidrita o baldosas cerámicas y piedra natural ya colocadas. Antes se prepara el soporte y se aplica la imprimación que indique la ficha del fabricante.' } },
      { question: { es: '¿Cuánto tarda en poder pisarse?' }, answer: { es: 'Depende del producto, del espesor y de la temperatura: algunos autonivelantes admiten tránsito peatonal a las pocas horas y otros a las 24 horas, y el tráfico con ruedas o el revestimiento posterior requieren más tiempo. En nuestros trabajos el tiempo mínimo de secado es de más de 24 horas. El plazo concreto lo marca la ficha del producto y las condiciones de la obra.' } },
      { question: { es: '¿Qué espesor lleva?' }, answer: { es: 'Depende del tipo de mortero y del soporte: un autonivelante cementoso de capa fina se aplica normalmente entre 2 y 10 mm, algunos de altas prestaciones llegan a 30 o 50 mm y los de anhidrita de capa gruesa parten de unos 35 mm. El espesor exacto lo marcan la ficha del producto y las irregularidades del soporte, por eso conviene medirlo en obra.' } },
    ],
    cta: { es: 'Cuéntanos el uso del suelo y te llamamos.' },
    flagship: false,
  },
  {
    id: 'pavimentos-de-caucho',
    slug: { es: 'pavimentos-de-caucho' },
    number: '06',
    name: { es: 'Pavimentos de caucho' },
    shortName: { es: 'Caucho' },
    summary: { es: 'Parques infantiles y zonas deportivas. EN 1176 y EN 1177.' },
    description: {
      es: 'Pavimentos de caucho para parques infantiles y zonas deportivas: EPDM o SBR, espesor según la altura crítica de caída del equipo de juego, normas EN 1176 y EN 1177.',
    },
    intro: {
      es: 'Una solución limpia y segura para crear zonas lúdicas infantiles y zonas deportivas: pavimentos que minimizan el riesgo de lesiones por caídas desde los equipos de juego.',
    },
    introMobile: { es: 'Zonas infantiles y deportivas seguras. EPDM o SBR, normas EN 1176 y EN 1177.' },
    heroImage: {
      label: { es: 'Foto · parque infantil · sin obra documentada' },
      src: '/img/caucho-parque-juegos.jpg',
      alt: { es: 'Pavimento continuo de caucho rojo en un parque infantil con balancín y tobogán' },
    },
    about: {
      title: { es: 'Amortiguación medida, no estimada' },
      paragraphs: [
        {
          es: 'Trabajamos con dos sistemas: EPDM vulcanizado, o SBR reciclado con una capa de SBR coloreado ejecutada in situ. El espesor se calcula según la altura crítica de caída del equipo de juego.',
        },
        {
          es: 'Todo el pavimento se ejecuta conforme a las normas EN 1176 y EN 1177 de equipamiento de áreas de juego y superficies amortiguadoras.',
        },
      ],
    },
    applications: [
      { es: 'Parques infantiles' },
      { es: 'Zonas deportivas' },
      { es: 'Patios de colegio' },
      { es: 'Zonas lúdicas' },
    ],
    advantages: [
      { es: 'Amortigua las caídas' },
      { es: 'Espesor según la altura de caída' },
      { es: 'EN 1176 y EN 1177' },
      { es: 'Colores in situ' },
      { es: 'Limpio y seguro' },
    ],
    models: [],
    colors: [],
    faq: [
      { question: { es: '¿Qué diferencia hay entre EPDM y SBR?' }, answer: { es: 'El EPDM es un caucho nuevo, con color propio y buena resistencia al sol; el SBR es caucho reciclado de neumático, más económico pero con peor resistencia a los rayos UV. En un pavimento de caucho continuo suele usarse SBR como capa base amortiguadora y EPDM como capa vista de color. La elección depende del uso, de la exposición al sol y del presupuesto.' } },
      { question: { es: '¿Cómo se calcula el espesor?' }, answer: { es: 'El espesor del pavimento de caucho se calcula según la altura crítica de caída que debe cubrir el equipo de juego, de acuerdo con la norma UNE-EN 1177: cuanto mayor es la altura desde la que se puede caer, más espesor hace falta. Ese valor lo acredita el ensayo del sistema elegido (criterio HIC), por lo que no existe una tabla única de espesores.' } },
      { question: { es: '¿Se puede instalar sobre un pavimento existente?' }, answer: { es: 'Sí, normalmente se puede instalar un pavimento de caucho continuo sobre un pavimento existente de hormigón o asfalto, siempre que la base sea firme, esté limpia y en buen estado. Si el soporte está suelto o deteriorado, hay que repararlo antes. También influyen la temperatura y que el soporte esté seco el día de la obra.' } },
    ],
    cta: { es: 'Cuéntanos el equipo de juego y la superficie, y te llamamos.' },
    flagship: false,
  },
  {
    id: 'alicatados',
    slug: { es: 'alicatados' },
    number: '07',
    name: { es: 'Alicatados' },
    shortName: { es: 'Alicatados' },
    summary: { es: 'Baños, cocinas, piscinas y terrazas en la provincia de Valencia.' },
    description: {
      es: 'Alicatados en toda la provincia de Valencia: baños, cocinas, piscinas y terrazas, desde reformas residenciales hasta obras comerciales.',
    },
    intro: {
      es: 'Servicio de alicatados en toda la provincia de Valencia, tanto en proyectos de renovación residencial como en grandes obras comerciales: desde baños y cocinas hasta espacios exteriores como piscinas y terrazas.',
    },
    introMobile: { es: 'Baños, cocinas, piscinas y terrazas en toda la provincia de Valencia.' },
    heroImage: {
      label: { es: 'Foto · revestimiento en mosaico de piezas cerámicas' },
      src: '/img/pulido-interior-loft2.jpg',
      alt: {
        es: 'Banco y peto revestidos con mosaico de piezas cerámicas blancas con junta oscura, sobre un suelo continuo brillante',
      },
    },
    about: {
      title: { es: 'Cerámica, porcelana y azulejo de diseño' },
      paragraphs: [
        {
          es: 'Trabajamos con materiales que van desde cerámicas y porcelanas hasta azulejos de diseño, con variedad de acabados para cada espacio.',
        },
        {
          es: 'Cuatro pilares: variedad de diseños, durabilidad y resistencia, acabados profesionales y asesoramiento personalizado para elegir el material adecuado.',
        },
      ],
    },
    applications: [{ es: 'Baños' }, { es: 'Cocinas' }, { es: 'Piscinas' }, { es: 'Terrazas' }, { es: 'Obra comercial' }],
    advantages: [
      { es: 'Variedad de diseños' },
      { es: 'Durabilidad y resistencia' },
      { es: 'Acabados profesionales' },
      { es: 'Asesoramiento personalizado' },
    ],
    models: [],
    colors: [],
    faq: [
      { question: { es: '¿Trabajáis fuera de la provincia de Valencia?' } },
      { question: { es: '¿Podéis alicatar sobre el azulejo antiguo?' }, answer: { es: 'Sí, en muchos casos se puede alicatar sobre el azulejo antiguo sin picarlo, siempre que esté bien adherido, sin piezas huecas ni fisuras, y limpio y desengrasado. Se coloca con adhesivo cementoso mejorado (C2), a menudo con imprimación de anclaje. Hay que contar con el grosor añadido en marcos y puertas; si hay piezas sueltas, es mejor retirarlas.' } },
      { question: { es: '¿Qué material conviene en el exterior?' }, answer: { es: 'En exterior conviene un azulejo de gres porcelánico con muy baja absorción de agua, apto para heladas si la zona lo requiere, y con acabado antideslizante de clase 3, que es lo que el CTE exige en suelos exteriores y junto a piscinas. El adhesivo debe ser cementoso mejorado (C2), y deformable (S1 o S2) en superficies muy expuestas al sol.' } },
    ],
    cta: { es: 'Cuéntanos el espacio y te llamamos.' },
    flagship: false,
  },
] as const satisfies readonly Service[]
