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
      { question: { es: '¿Cuánto tarda en poder pisarse y en poder aparcar?' } },
      { question: { es: '¿Qué mantenimiento necesita?' } },
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
      { question: { es: '¿Sirve el pulido para el interior de una vivienda?' } },
      { question: { es: '¿Qué diferencia hay entre acabado brillo y mate?' } },
      { question: { es: '¿Cuánto aguanta el paso de carretillas y camiones?' } },
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
      { question: { es: '¿Qué tamaño de árido conviene para una rampa?' } },
      { question: { es: '¿Se puede combinar con hormigón impreso en la misma obra?' } },
      { question: { es: '¿Qué mantenimiento necesita?' } },
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
      { question: { es: '¿Se puede aplicar sobre los azulejos del baño?' } },
      { question: { es: '¿Cuánto dura la reforma de un baño?' } },
      { question: { es: '¿Resbala en una ducha?' } },
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
      label: { es: 'Foto · solera industrial en proceso de alisado · sin obra de autonivelante documentada' },
      src: '/img/solera-industrial-mallazo1.jpg',
      alt: { es: 'Solera industrial en fase de alisado a máquina, con mallazo metálico visible en primer plano y nave industrial al fondo' },
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
      { question: { es: '¿Sobre qué soporte se puede aplicar un autonivelante?' } },
      { question: { es: '¿Cuánto tarda en poder pisarse?' } },
      { question: { es: '¿Qué espesor lleva?' } },
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
      es: 'Pavimentos de caucho para parques infantiles y zonas deportivas: EPDM o SBR, espesor según el HIC del equipo de juego, normas EN 1176 y EN 1177.',
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
          es: 'Trabajamos con dos sistemas: EPDM vulcanizado, o SBR reciclado con una capa de SBR coloreado ejecutada in situ. El espesor se calcula según el HIC (altura crítica de caída) del equipo de juego.',
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
      { es: 'Espesor según el HIC' },
      { es: 'EN 1176 y EN 1177' },
      { es: 'Colores in situ' },
      { es: 'Limpio y seguro' },
    ],
    models: [],
    colors: [],
    faq: [
      { question: { es: '¿Qué diferencia hay entre EPDM y SBR?' } },
      { question: { es: '¿Cómo se calcula el espesor?' } },
      { question: { es: '¿Se puede instalar sobre un pavimento existente?' } },
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
      label: { es: 'Foto · banco revestido en mosaico de azulejo · sin obra de alicatado documentada' },
      src: '/img/pulido-interior-loft2.jpg',
      alt: { es: 'Suelo pulido reflectante junto a un banco y un muro revestidos en mosaico de azulejo blanco y negro, con un horno de obra al fondo' },
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
      { question: { es: '¿Podéis alicatar sobre el azulejo antiguo?' } },
      { question: { es: '¿Qué material conviene en el exterior?' } },
    ],
    cta: { es: 'Cuéntanos el espacio y te llamamos.' },
    flagship: false,
  },
] as const satisfies readonly Service[]
