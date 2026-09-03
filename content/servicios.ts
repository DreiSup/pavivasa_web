import type { Servicio, ServicioId } from '@/lib/tipos'

/**
 * Copy real de cada servicio, pasado al tuteo y sin erratas (pavivasa.com, sept. 2026).
 * Lo que la web no da (respuestas de FAQ, datos de obra de algunos servicios) se deja
 * vacío y se pinta como DatoPendiente.
 */
export const servicios: Record<ServicioId, Servicio> = {
  'hormigon-impreso': {
    id: 'hormigon-impreso',
    numero: '01',
    nombre: 'Hormigón impreso',
    nombreCorto: 'Impreso',
    resumen:
      'Patios, terrazas, piscinas, jardines y paseos. También en vertical: fachadas y muros con la misma carta de moldes y colores.',
    descripcion:
      'Pavimentos de hormigón impreso en Valencia y Alicante: patios, terrazas, piscinas, jardines, fachadas y muros. Más de 15 años de oficio y 10 años de garantía.',
    intro:
      'Pavimentos de hormigón impreso, revestimiento de fachadas y muros, recubrimiento de piscinas, patios, terrazas, jardines o paseos. Piedra, adoquín, baldosa o pizarra: el molde y el color los eliges tú.',
    introMovil:
      'Patios, terrazas, piscinas, jardines, paseos, fachadas y muros. Piedra, adoquín, baldosa o pizarra: el molde y el color los eliges tú.',
    imagenHero: { etiqueta: 'Foto · detalle molde piedra inglesa · Dénia' },
    queEs: {
      titulo: 'Una solera de hormigón con acabado decorativo',
      parrafos: [
        'El hormigón impreso da las mismas prestaciones que una solera de hormigón, con la ventaja de un aspecto más decorativo y elegante. Destaca por su durabilidad, su impermeabilidad y una gama muy alta de colores y diseños. Al ser impermeable, soporta el ataque de ácidos y las manchas de grasa o aceite, y aguanta zonas muy castigadas por el tránsito: aceras, parques, rampas, recintos feriales.',
        'Trabajamos en horizontal y en vertical: el mismo sistema, con la misma gama de colores, diseños y texturas, sirve para revestir paredes, muros y fachadas. Sumado al casi nulo mantenimiento, es lo que explica que triunfe en las viviendas con jardín, desplazando a los pavimentos tradicionales.',
      ],
    },
    aplicaciones: [
      'Fincas y pasos',
      'Calles y paseos',
      'Patios y terrazas',
      'Piscinas y jardines',
      'Badenes y cunetas',
      'Revestimiento de muros',
      'Revestimiento de fachadas',
    ],
    ventajas: [
      'Diseños personalizados',
      'Amplia gama de colores',
      'Amplia gama de modelos',
      'Garantía de 10 años',
      'Bajo coste de mantenimiento',
      'No se agrieta',
      'No se deforma',
    ],
    modelos: ['Piedra inglesa', 'Sillería', 'Sillería grande', 'Adoquín belga', 'Manteado'],
    colores: ['Gris medio', 'Gris oscuro', 'Gris muy oscuro', 'Gris mate', 'Marrón', 'Crema', 'Arena', '107', '117'],
    fichaTecnica: {
      titulo: 'Cómo lo ejecutamos',
      texto:
        'Datos reales de tres obras. Cada proyecto se dimensiona según el uso: no es lo mismo una entrada de garaje que un contorno de piscina.',
      columnas: ['Dénia · vivienda', 'Moraira · chalé y piscina', 'Calpe · exterior'],
      filas: [
        { parametro: 'Hormigón', valores: ['HM20', 'HM20', 'HM25'] },
        { parametro: 'Espesor', valores: ['10 cm', '12 cm', '10 cm'] },
        { parametro: 'Árido', valores: ['12 mm', '12 mm', '12 mm'] },
        { parametro: 'Mallazo', valores: ['20×30 · 4 mm', null, 'Sí'] },
        { parametro: 'Fibra', valores: ['Polipropileno', null, 'Polipropileno'] },
        { parametro: 'Dosificación de color', valores: ['4 kg/m²', null, null] },
        { parametro: 'Juntas de dilatación', valores: [null, null, '5×5 m'] },
        {
          parametro: 'Modelo · color',
          valores: ['Piedra inglesa · gris mate y crema', 'Manteado · gris y marrón · mate', 'Sillería grande · arena'],
        },
      ],
    },
    faq: [
      { pregunta: '¿Se puede poner impreso sobre un suelo que ya existe?' },
      { pregunta: '¿Cuánto tarda en poder pisarse y en poder aparcar?' },
      { pregunta: '¿Qué mantenimiento necesita?' },
      { pregunta: '¿Qué cubre la garantía de 10 años?' },
    ],
    cta: '¿Un patio, una entrada, una piscina? Dinos los metros y te llamamos.',
  },

  'hormigon-pulido': {
    id: 'hormigon-pulido',
    numero: '02',
    nombre: 'Hormigón pulido',
    nombreCorto: 'Pulido',
    resumen:
      'Naves, garajes y parkings; y cada vez más en interiores de vivienda. Impermeable, no se astilla ni agrieta, acabado brillo o mate.',
    descripcion:
      'Pavimentos de hormigón pulido para naves industriales, garajes, parkings, terrazas, piscinas e interiores de vivienda. Durabilidad, impermeabilidad y bajo mantenimiento.',
    intro:
      'Pavimentos ideales tanto para suelos industriales como para terrazas, piscinas, jardines y zonas de interior. Durabilidad, impermeabilidad, precio y bajo mantenimiento, en acabado brillo o mate.',
    introMovil:
      'Suelos industriales, terrazas, piscinas, jardines e interiores. Durabilidad, impermeabilidad, precio y bajo mantenimiento.',
    imagenHero: { etiqueta: 'Foto · nave industrial · pulido natural · Riba-roja' },
    queEs: {
      titulo: 'Un pavimento continuo que se integra en el hormigón',
      parrafos: [
        'El hormigón pulido se usa en aparcamientos, naves industriales, almacenes, garajes, patios, terrazas y jardines, zonas interiores y centros comerciales. Gracias a las nuevas técnicas de acabado se usa también a nivel doméstico, con resultados muy vanguardistas.',
        'Los tratamientos se integran directamente al hormigón: no se astillan ni generan grietas, y admiten un acabado en multitud de colores, brillo o mate. Soporta el ataque de ácidos y las manchas de grasa y aceite.',
      ],
    },
    aplicaciones: [
      'Patios y jardines',
      'Parkings y garajes',
      'Naves industriales',
      'Centros comerciales',
      'Salas y exposiciones',
      'Pabellones deportivos',
    ],
    ventajas: [
      'Resistente y duradero',
      'Amplia gama de colores',
      'Bajo coste de mantenimiento',
      'Garantía de 10 años',
      'Completamente impermeable',
      'No se astilla',
      'No se agrieta',
      'No se deforma',
    ],
    modelos: [],
    colores: ['Crema 117', '117 crema marfil', 'Natural'],
    fichaTecnica: {
      titulo: 'Cómo lo ejecutamos',
      texto:
        'Datos reales de tres obras de pulido, de la vivienda a la nave industrial. Lo que la web actual no detalla queda pendiente.',
      columnas: ['Benissa · urbanización', 'Riba-roja · nave', 'Daimús · nave'],
      filas: [
        { parametro: 'Superficie', valores: [null, null, '2000 m²'] },
        { parametro: 'Mallazo', valores: ['Sí', 'Sí', null] },
        { parametro: 'Fibra', valores: ['Polipropileno', 'Polipropileno', null] },
        { parametro: 'Dosificación de color', valores: ['4 kg/m²', null, null] },
        { parametro: 'Color', valores: ['Crema 117', 'Natural', null] },
        { parametro: 'Uso', valores: ['Exterior', 'Nave industrial', 'Nave con muelle de carga'] },
      ],
    },
    faq: [
      { pregunta: '¿Sirve el pulido para el interior de una vivienda?' },
      { pregunta: '¿Qué diferencia hay entre acabado brillo y mate?' },
      { pregunta: '¿Cuánto aguanta el paso de carretillas y camiones?' },
      { pregunta: '¿Qué cubre la garantía de 10 años?' },
    ],
    cta: '¿Una nave, un garaje, un interior? Dinos los metros y te llamamos.',
  },

  'hormigon-lavado': {
    id: 'hormigon-lavado',
    numero: '03',
    nombre: 'Hormigón lavado',
    nombreCorto: 'Lavado',
    resumen: 'Árido visto, antideslizante. Rampas, salidas de parking, entornos de piscina.',
    descripcion:
      'Hormigón lavado o árido visto: pavimentos rugosos, antideslizantes y muy resistentes al desgaste para rampas, salidas de parking, entornos de piscina y zonas peatonales.',
    intro:
      'Gracias a las distintas clases de áridos, granulometrías y colores obtenemos una amplia variedad de acabados atractivos y resistentes. Rugosos, antideslizantes y muy resistentes al desgaste y a los agentes atmosféricos.',
    introMovil:
      'Árido visto: acabados rugosos, antideslizantes y muy resistentes al desgaste y a los agentes atmosféricos.',
    imagenHero: { etiqueta: 'Foto · árido visto gris 12 mm · Godella' },
    queEs: {
      titulo: 'Árido a la vista, agarre en el pie',
      parrafos: [
        'El hormigón lavado deja a la vista el árido de la masa. El resultado es un pavimento rugoso, antideslizante y muy resistente al desgaste y a la acción de los agentes atmosféricos: por eso se usa en salidas de parkings, urbanizaciones y rampas.',
        'Antes de iniciar el trabajo preparamos el terreno para la ejecución de la solera. Cuidamos mucho la preparación del soporte: de ahí sale la mitad de la durabilidad del pavimento.',
      ],
    },
    aplicaciones: [
      'Zonas peatonales',
      'Entornos de piscina',
      'Viales de tráfico rodado ligero',
      'Calles de parques',
      'Zonas de recreo',
      'Salidas de parking y rampas',
    ],
    ventajas: [
      'Antideslizante',
      'Muy resistente al desgaste',
      'Aguanta los agentes atmosféricos',
      'Garantía de 10 años',
      'Variedad de áridos y colores',
      'Más económico que el hormigón convencional',
    ],
    modelos: ['Valencia aserras'],
    colores: ['Gris'],
    especificacion: {
      titulo: 'Ficha técnica',
      texto: 'Especificación literal del hormigón lavado que ejecutamos.',
      lineas: [
        { etiqueta: 'Hormigón', valor: 'HA-25 · cono blando' },
        { etiqueta: 'Árido', valor: 'Seleccionado según acabado' },
        { etiqueta: 'Fibra', valor: 'Polipropileno' },
        { etiqueta: 'Aditivado', valor: 'Sí · pigmentable en masa' },
        { etiqueta: 'Resistencia', valor: 'HA-25 según EHE-08' },
        { etiqueta: 'Superficie', valor: 'Antideslizante clase 3 · Rd > 45 · áridos de machaqueo' },
      ],
    },
    faq: [
      { pregunta: '¿Qué tamaño de árido conviene para una rampa?' },
      { pregunta: '¿Se puede combinar con hormigón impreso en la misma obra?' },
      { pregunta: '¿Qué mantenimiento necesita?' },
    ],
    cta: '¿Una rampa, un vial, el borde de la piscina? Dinos los metros y te llamamos.',
  },

  microcemento: {
    id: 'microcemento',
    numero: '04',
    nombre: 'Microcemento decorativo',
    nombreCorto: 'Microcemento',
    resumen: 'Renueva suelos, paredes, baños y cocinas sin retirar el material existente. Ahorro de tiempo y de obra.',
    descripcion:
      'Microcemento decorativo en baños, cocinas, suelos y paredes. Renovación completa sin retirar el material existente, con ahorro económico y de tiempo.',
    intro:
      'Renovamos por completo suelos, paredes, baños, cocinas o revestimientos de tu hogar con un ahorro económico y de tiempo muy importante: no hay que retirar el material existente.',
    introMovil: 'Suelos, paredes, baños y cocinas renovados sin retirar el material existente.',
    imagenHero: { etiqueta: 'Foto · baño en microcemento gris claro · Moraira' },
    queEs: {
      titulo: 'Un material sintético más duro que el cemento común',
      parrafos: [
        'El microcemento es un material sintético mucho más durable y resistente que el cemento común: difícil de corroer, agrietar y resquebrajar, y resistente al agua y a las altas temperaturas. Es una de las opciones decorativas más utilizadas por los diseñadores.',
        'Como no hay que eliminar el material existente, se abaratan los costes y los tiempos de trabajo y se evitan las molestias del desescombro y su posterior recogida.',
      ],
    },
    aplicaciones: ['Baños', 'Cocinas', 'Suelos', 'Paredes', 'Bañeras', 'Vigas'],
    ventajas: [
      'Sin retirar el material existente',
      'Ahorro de tiempo y de obra',
      'Resistente al agua',
      'Resistente a las altas temperaturas',
      'Difícil de agrietar',
      'Garantía de 10 años',
    ],
    modelos: [],
    colores: ['Gris claro'],
    especificacion: {
      titulo: 'Cuidado del microcemento',
      texto: 'Cómo se mantiene para que dure. Lo que no hay que hacer también cuenta.',
      lineas: [
        { etiqueta: 'Limpieza', valor: 'Agua y jabón neutro · pH entre 6 y 9' },
        { etiqueta: 'Útiles', valor: 'Mopa o fregona' },
        { etiqueta: 'Protección', valor: 'Cera de autobrillo' },
        { etiqueta: 'Evitar', valor: 'Disolventes, ácidos, esponjas, lijas y cepillos metálicos' },
      ],
    },
    faq: [
      { pregunta: '¿Se puede aplicar sobre los azulejos del baño?' },
      { pregunta: '¿Cuánto dura la reforma de un baño?' },
      { pregunta: '¿Resbala en una ducha?' },
      { pregunta: '¿Qué cubre la garantía de 10 años?' },
    ],
    cta: '¿Un baño, una cocina, un suelo entero? Dinos los metros y te llamamos.',
  },

  autonivelantes: {
    id: 'autonivelantes',
    numero: '05',
    nombre: 'Autonivelantes',
    nombreCorto: 'Autonivelantes',
    resumen: 'Morteros decorativos, lisos o antideslizantes, con bomba propia.',
    descripcion:
      'Morteros autonivelantes decorativos: lisos o antideslizantes, industriales o decorativos, con maquinaria propia de bombeo y adaptados al Código Técnico de la Edificación.',
    intro:
      'Morteros autonivelantes decorativos. Una apuesta por la arquitectura creativa, inspirada en acabados cromáticos naturales: lisos o antideslizantes, industriales o decorativos, flexibles, conductores y alimentarios.',
    introMovil: 'Morteros decorativos lisos o antideslizantes, industriales o decorativos, con bomba propia.',
    imagenHero: { etiqueta: 'Foto · autonivelante · sin obra documentada' },
    queEs: {
      titulo: 'Un mortero que se bombea y se alisa a mano',
      parrafos: [
        'Contamos con maquinaria propia: bombas impulsoras de autonivelante. Los morteros llevan aditivos superfluidificantes, reductores de retracción, aireantes y modificadores de viscosidad. Pese al nombre, no se nivelan solos: hay que alisarlos manualmente.',
        'El tiempo mínimo de secado es de más de 24 horas. Todos los acabados están adaptados al Código Técnico de la Edificación.',
      ],
    },
    aplicaciones: ['Suelos industriales', 'Suelos decorativos', 'Zonas alimentarias', 'Pavimentos conductores'],
    ventajas: [
      'Acabados lisos o antideslizantes',
      'Flexibles',
      'Conductores',
      'Alimentarios',
      'Adaptados al CTE',
      'Bomba propia',
    ],
    modelos: [],
    colores: [],
    faq: [
      { pregunta: '¿Sobre qué soporte se puede aplicar un autonivelante?' },
      { pregunta: '¿Cuánto tarda en poder pisarse?' },
      { pregunta: '¿Qué espesor lleva?' },
    ],
    cta: 'Cuéntanos el uso del suelo y te llamamos.',
  },

  'pavimentos-de-caucho': {
    id: 'pavimentos-de-caucho',
    numero: '06',
    nombre: 'Pavimentos de caucho',
    nombreCorto: 'Caucho',
    resumen: 'Parques infantiles y zonas deportivas. EN 1176 y EN 1177.',
    descripcion:
      'Pavimentos de caucho para parques infantiles y zonas deportivas: EPDM o SBR, espesor según el HIC del equipo de juego, normas EN 1176 y EN 1177.',
    intro:
      'Una solución limpia y segura para crear zonas lúdicas infantiles y zonas deportivas: pavimentos que minimizan el riesgo de lesiones por caídas desde los equipos de juego.',
    introMovil: 'Zonas infantiles y deportivas seguras. EPDM o SBR, normas EN 1176 y EN 1177.',
    imagenHero: { etiqueta: 'Foto · parque infantil · sin obra documentada' },
    queEs: {
      titulo: 'Amortiguación medida, no estimada',
      parrafos: [
        'Trabajamos con dos sistemas: EPDM vulcanizado, o SBR reciclado con una capa de SBR coloreado ejecutada in situ. El espesor se calcula según el HIC (altura crítica de caída) del equipo de juego.',
        'Todo el pavimento se ejecuta conforme a las normas EN 1176 y EN 1177 de equipamiento de áreas de juego y superficies amortiguadoras.',
      ],
    },
    aplicaciones: ['Parques infantiles', 'Zonas deportivas', 'Patios de colegio', 'Zonas lúdicas'],
    ventajas: ['Amortigua las caídas', 'Espesor según el HIC', 'EN 1176 y EN 1177', 'Colores in situ', 'Limpio y seguro'],
    modelos: [],
    colores: [],
    faq: [
      { pregunta: '¿Qué diferencia hay entre EPDM y SBR?' },
      { pregunta: '¿Cómo se calcula el espesor?' },
      { pregunta: '¿Se puede instalar sobre un pavimento existente?' },
    ],
    cta: 'Cuéntanos el equipo de juego y la superficie, y te llamamos.',
  },

  alicatados: {
    id: 'alicatados',
    numero: '07',
    nombre: 'Alicatados',
    nombreCorto: 'Alicatados',
    resumen: 'Baños, cocinas, piscinas y terrazas en la provincia de Valencia.',
    descripcion:
      'Alicatados en toda la provincia de Valencia: baños, cocinas, piscinas y terrazas, desde reformas residenciales hasta obras comerciales.',
    intro:
      'Servicio de alicatados en toda la provincia de Valencia, tanto en proyectos de renovación residencial como en grandes obras comerciales: desde baños y cocinas hasta espacios exteriores como piscinas y terrazas.',
    introMovil: 'Baños, cocinas, piscinas y terrazas en toda la provincia de Valencia.',
    imagenHero: { etiqueta: 'Foto · alicatado · sin obra documentada' },
    queEs: {
      titulo: 'Cerámica, porcelana y azulejo de diseño',
      parrafos: [
        'Trabajamos con materiales que van desde cerámicas y porcelanas hasta azulejos de diseño, con variedad de acabados para cada espacio.',
        'Cuatro pilares: variedad de diseños, durabilidad y resistencia, acabados profesionales y asesoramiento personalizado para elegir el material adecuado.',
      ],
    },
    aplicaciones: ['Baños', 'Cocinas', 'Piscinas', 'Terrazas', 'Obra comercial'],
    ventajas: ['Variedad de diseños', 'Durabilidad y resistencia', 'Acabados profesionales', 'Asesoramiento personalizado'],
    modelos: [],
    colores: [],
    faq: [
      { pregunta: '¿Trabajáis fuera de la provincia de Valencia?' },
      { pregunta: '¿Podéis alicatar sobre el azulejo antiguo?' },
      { pregunta: '¿Qué material conviene en el exterior?' },
    ],
    cta: 'Cuéntanos el espacio y te llamamos.',
  },
}
