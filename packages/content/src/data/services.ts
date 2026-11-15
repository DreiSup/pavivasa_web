import type { Service } from '../schemas/service.ts'

/**
 * Real copy for each service (pavivasa.com, Sept. 2026), unchanged from
 * Spanish. `seoTitle`, `headingPlace` and `guide` come from the SEO pass of
 * 2026-11-15, written only from the real projects, articles and service
 * copy already in this package. Array order is the site's menu order (`01`..`08`); the three
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
    seoTitle: { es: 'Hormigón impreso en Valencia y Alicante: patios y piscinas' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
      {
        question: { es: '¿Cuánto cuesta el metro cuadrado de hormigón impreso?' },
        answer: {
          es: 'No publicamos precios porque cada obra es distinta: cuentan los metros, el estado del terreno, el espesor que pide el uso (no es lo mismo una entrada de garaje que un patio) y el molde y el color que elijas. Dinos los metros y qué quieres hacer y te damos presupuesto sin compromiso.',
        },
      },
    ],
    guide: {
      kicker: { es: 'Cómo se hace' },
      title: { es: 'Moldes y color sobre el hormigón fresco' },
      intro: {
        es: 'Hacer hormigón impreso es estampar moldes y aplicar colorantes sobre el hormigón recién extendido, antes de que fragüe. Así la superficie imita piedra, ladrillo, madera o pizarra, con las mismas prestaciones que una solera de hormigón.',
      },
      blocks: [
        {
          title: { es: 'Cinco moldes que ya hemos puesto en obra' },
          paragraphs: [
            {
              es: 'La piedra inglesa es el que más se repite: en gris mate y crema en una [vivienda de Dénia](/proyectos/hormigon-impreso-denia/), en gris medio en una [urbanización de Calpe](/proyectos/hormigon-impreso-calpe/) y en gris muy oscuro en [Montaberner](/proyectos/hormigon-impreso-montaberner/). La sillería la hicimos en color 107 en una [urbanización de Llíria](/proyectos/hormigon-impreso-lliria/), y la sillería grande, en arena, junto a la [piscina de otra obra de Calpe](/proyectos/hormigon-impreso-calpe-2/).',
            },
            {
              es: 'En un terreno con desnivel de Benissa el cliente eligió el [adoquín belga en gris oscuro](/proyectos/hormigon-impreso-benissa/), y en un chalé de Moraira, el [manteado en gris y marrón](/proyectos/hormigon-impreso-moraira/) con acabado mate. La carta completa de moldes y colores te la enseñamos en la visita.',
            },
          ],
        },
        {
          title: { es: 'Espesor y armado según el uso' },
          paragraphs: [
            {
              es: 'En las obras que tenemos documentadas el espesor va de 10 a 12 cm, con hormigón HM20 o HM25 y árido de 12 mm. Según el caso se añade mallazo, fibra de polipropileno, 4 kg de color por metro cuadrado y juntas de dilatación cada 5×5 m. El detalle de cada obra está en la ficha técnica de esta página.',
            },
          ],
        },
        {
          title: { es: 'Patios, piscinas y también paredes' },
          paragraphs: [
            {
              es: 'En una vivienda con jardín sirve para el patio, la terraza, los caminos y el contorno de la piscina. El mismo sistema, con los mismos moldes y colores, se aplica en vertical para revestir muros y fachadas. Si prefieres ver la piedra real del árido y una superficie rugosa, mira el [hormigón lavado](/hormigon-lavado/).',
            },
          ],
        },
      ],
    },
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
      es: 'Hormigón pulido para el interior de casa, terrazas, piscinas, garajes y naves en Valencia y Alicante: brillo o mate, en color, con obras reales y ficha técnica.',
    },
    seoTitle: { es: 'Hormigón pulido en Valencia y Alicante: viviendas y naves' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
      {
        question: { es: '¿Cuánto cuesta el metro cuadrado de hormigón pulido?' },
        answer: {
          es: 'No publicamos precios: no cuesta lo mismo un salón que una nave de 2000 m². Cuentan los metros, el estado del soporte, el armado que pide el uso y el color y el acabado, brillo o mate. Dinos los metros y para qué es el suelo y te damos presupuesto sin compromiso.',
        },
      },
    ],
    guide: {
      kicker: { es: 'Cómo es' },
      title: { es: 'Pulir el hormigón: brillo, color y la dureza de siempre' },
      intro: {
        es: 'Pulir el hormigón es trabajar su superficie con abrasivos mecánicos de distintos granos hasta dejarla lisa, brillante y capaz de reflejar la luz. El aspecto recuerda al mármol o al terrazo; la resistencia y la durabilidad siguen siendo las del hormigón.',
      },
      blocks: [
        {
          title: { es: 'En casa: dentro, fuera y alrededor de la piscina' },
          paragraphs: [
            {
              es: 'Cada vez se pide más en viviendas, y no solo dentro. En una [unifamiliar de Benissa](/proyectos/hormigon-pulido-alicante/) hicimos un mismo pavimento continuo en 117 crema marfil para el interior, el exterior y el contorno de la piscina, y en una [residencia de Xàbia](/proyectos/hormigon-pulido-xabia/) pavimentamos 120 m² en crema 117. En otra urbanización de Benissa, [Monte Mar](/proyectos/hormigon-pulido-benissa/), el pulido en crema 117 lleva mallazo, fibra de polipropileno y 4 kg de color por metro cuadrado.',
            },
          ],
        },
        {
          title: { es: 'En naves, garajes y locales' },
          paragraphs: [
            {
              es: 'Es el pavimento habitual en naves y muelles de carga: en [Daimús](/proyectos/hormigon-pulido-daimus/) pavimentamos 2000 m² de una nave con muelle de carga y descarga, y en [Riba-roja de Túria](/proyectos/hormigon-pulido-ribarroja-del-turia/) otra nave en color natural, con mallazo y fibra. También lo eligen salas de exposición, recepciones y locales comerciales, por el acabado refinado que deja.',
            },
          ],
        },
        {
          title: { es: 'Brillo o mate, y en color' },
          paragraphs: [
            {
              es: 'El acabado brillo refleja más la luz; el mate es más sobrio. El hormigón admite multitud de colores: en obra lo hemos hecho en crema 117, en 117 crema marfil y en natural. Fuera de casa, además del aspecto, cuenta que no resbale: {{cómo dejáis el pulido en exterior y junto a la piscina (grado de pulido, tratamiento antideslizante, clase de resbaladicidad)}}.',
            },
          ],
        },
        {
          title: { es: 'Pulido o fratasado' },
          paragraphs: [
            {
              es: 'El pulido trabaja la superficie con abrasivos hasta sacarle brillo; el [hormigón fratasado](/hormigon-fratasado/) se alisa con llana mientras el hormigón está fresco y deja un suelo liso y continuo. Las obras de Benissa y Xàbia de arriba llevan acabado fratasado.',
            },
          ],
        },
      ],
    },
    cta: { es: '¿Una nave, un garaje, un interior? Dinos los metros y te llamamos.' },
    flagship: true,
  },
  {
    id: 'hormigon-fratasado',
    slug: { es: 'hormigon-fratasado' },
    number: '03',
    name: { es: 'Hormigón fratasado' },
    shortName: { es: 'Fratasado' },
    summary: {
      es: 'Un suelo liso, continuo y sin juntas para dentro y fuera de casa: salón, cocina, patio, terraza y contorno de piscina.',
    },
    description: {
      es: 'Hormigón fratasado fino para viviendas en Valencia y Alicante: un suelo liso y continuo, en color, para salones, cocinas, patios, terrazas y piscinas.',
    },
    seoTitle: { es: 'Hormigón fratasado para viviendas en Valencia y Alicante' },
    headingPlace: { es: 'en Valencia y Alicante' },
    intro: {
      es: 'El fratasado fino deja el hormigón liso, uniforme y sin juntas, y se tiñe del color que elijas. Lo hacemos en viviendas, dentro y fuera: del salón y la cocina al patio, la terraza y el borde de la piscina.',
    },
    introMobile: {
      es: 'Suelo de hormigón liso, uniforme y sin juntas, en color, dentro y fuera de casa.',
    },
    heroImage: {
      label: { es: 'Foto · suelo de hormigón fratasado en vivienda · pendiente de obra' },
    },
    about: {
      title: { es: 'Hormigón fresco alisado a llana' },
      paragraphs: [
        {
          es: 'Fratasar es alisar y pulir la superficie del hormigón mientras todavía está fresco, con una llana o fratás, hasta dejarla lisa, uniforme y continua. Con pigmentos y aditivos en la masa se ajusta el color al estilo de la casa, del más rústico al más actual.',
        },
        {
          es: 'Al no tener juntas, el suelo sufre menos grietas y menos desgaste, y la superficie lisa no deja que se acumulen el polvo y la suciedad: se limpia con agua y jabón neutro. Por eso funciona en las zonas de la casa por las que más se pasa.',
        },
      ],
    },
    applications: [
      { es: 'Salones y cocinas' },
      { es: 'Suelos y paredes de interior' },
      { es: 'Encimeras' },
      { es: 'Patios y terrazas' },
      { es: 'Contornos de piscina' },
      { es: 'Fachadas' },
    ],
    advantages: [
      { es: 'Superficie continua y sin juntas' },
      { es: 'Menos grietas y desgaste' },
      { es: 'Limpieza con agua y jabón neutro' },
      { es: 'No acumula polvo' },
      { es: 'Pigmentable en muchos colores' },
      { es: 'Interior y exterior' },
    ],
    models: [],
    colors: [{ es: 'Crema 117' }, { es: '117 crema marfil' }],
    faq: [
      {
        question: { es: '¿En qué se diferencia el fratasado del hormigón pulido?' },
        answer: {
          es: 'En el momento y en la herramienta. El fratasado se hace con el hormigón todavía fresco: se alisa con llana o fratás hasta dejar una superficie lisa y continua. El pulido trabaja la superficie del hormigón con abrasivos mecánicos de distintos granos hasta dejarla brillante y reflectante. Si no tienes claro cuál te conviene, te lo explicamos en la visita.',
        },
      },
      {
        question: { es: '¿El fratasado sirve para el salón o la cocina?' },
        answer: {
          es: 'Sí. Es una de sus aplicaciones en vivienda: un suelo continuo, sin juntas, que aguanta bien el paso diario y se limpia con agua y jabón neutro. En Benissa hicimos un mismo pavimento fratasado para el interior, el exterior y el contorno de la piscina de una vivienda unifamiliar.',
        },
      },
      { question: { es: '¿Resbala fuera de casa o junto a la piscina?' } },
      { question: { es: '¿Qué tratamiento o sellado lleva al terminar?' } },
      {
        question: { es: '¿Qué colores hay?' },
        answer: {
          es: 'El hormigón se pigmenta, así que hay mucha variedad. Los que tenemos documentados en obra son el crema 117 y el 117 crema marfil; la carta completa te la enseñamos en la visita.',
        },
      },
      {
        question: { es: '¿Cuánto cuesta el metro cuadrado de hormigón fratasado?' },
        answer: {
          es: 'No publicamos precios, porque depende de cada casa: los metros, cómo esté el terreno o el soporte y el color que elijas. Dinos los metros y la estancia o la zona exterior y te damos presupuesto sin compromiso.',
        },
      },
    ],
    guide: {
      kicker: { es: 'Fratasado fino' },
      title: { es: 'Así queda un suelo de hormigón fratasado' },
      intro: {
        es: 'El hormigón fratasado es hormigón fresco alisado con llana o fratás hasta que la superficie queda lisa, uniforme y sin juntas. Teñido con pigmentos, sirve de suelo continuo para casi toda la vivienda, dentro y fuera.',
      },
      blocks: [
        {
          title: { es: 'Cómo lo hacemos' },
          paragraphs: [
            {
              es: 'Para que el acabado quede uniforme y dure hace falta oficio: hay que preparar bien el soporte, contar con el tiempo que haga el día de la obra y respetar el secado. {{herramienta con la que fratasáis (a mano o con fratasadora mecánica), espesor y tipo de hormigón}}.',
            },
          ],
        },
        {
          title: { es: 'Dentro de casa' },
          paragraphs: [
            {
              es: 'En el interior se usa en suelos, paredes y encimeras. Para el salón o la cocina tiene sentido: sin juntas hay menos grietas y menos desgaste, y la superficie lisa se limpia con agua y jabón neutro. {{tratamiento o sellado que aplicáis al fratasado de interior}}.',
            },
          ],
        },
        {
          title: { es: 'Fuera: patio, terraza y piscina' },
          paragraphs: [
            {
              es: 'Fuera se pone en patios, terrazas, contornos de piscina y fachadas. Tenemos dos obras documentadas con acabado fratasado: una [vivienda unifamiliar de Benissa](/proyectos/hormigon-pulido-alicante/), con el mismo pavimento en 117 crema marfil dentro, fuera y alrededor de la piscina, y una [residencia de Xàbia](/proyectos/hormigon-pulido-xabia/) con 120 m² en crema 117. En el borde de la piscina importa que no resbale: {{cómo dejáis el fratasado en exterior y junto a la piscina (acabado antideslizante, clase de resbaladicidad)}}.',
            },
          ],
        },
        {
          title: { es: 'El color' },
          paragraphs: [
            {
              es: 'Con pigmentos en la masa el suelo puede ir en muchos colores, del tono más rústico al más moderno. En obra lo tenemos hecho en crema 117 y en 117 crema marfil. {{qué colores ofrecéis en fratasado además de los dos cremas}}.',
            },
          ],
        },
        {
          title: { es: 'Frente al pulido y al impreso' },
          paragraphs: [
            {
              es: 'Los tres parten de hormigón. El fratasado se alisa en fresco con llana hasta quedar liso y continuo; el [hormigón pulido](/hormigon-pulido/) se trabaja con abrasivos de distintos granos hasta sacarle brillo; el [hormigón impreso](/hormigon-impreso/) lleva un molde que copia piedra, ladrillo o madera.',
            },
          ],
        },
      ],
    },
    cta: { es: '¿Un salón, una terraza, el borde de la piscina? Dinos los metros y te llamamos.' },
    flagship: false,
  },
  {
    id: 'hormigon-lavado',
    slug: { es: 'hormigon-lavado' },
    number: '04',
    name: { es: 'Hormigón lavado' },
    shortName: { es: 'Lavado' },
    summary: { es: 'Árido visto, antideslizante. Rampas, salidas de parking, entornos de piscina.' },
    description: {
      es: 'Hormigón lavado o árido visto: pavimentos rugosos, antideslizantes y muy resistentes al desgaste para rampas, salidas de parking, entornos de piscina y zonas peatonales.',
    },
    seoTitle: { es: 'Hormigón lavado antideslizante en Valencia y Alicante' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
      text: { es: 'Especificación del hormigón lavado que ejecutamos.' },
      lines: [
        { label: { es: 'Hormigón' }, value: { es: 'HA-25 · cono blando' } },
        { label: { es: 'Árido' }, value: { es: 'Seleccionado según acabado' } },
        { label: { es: 'Fibra' }, value: { es: 'Polipropileno' } },
        { label: { es: 'Aditivado' }, value: { es: 'Sí · pigmentable en masa' } },
        // EHE-08 was repealed by the Código Estructural (Real Decreto 470/2021,
        // in force since 10-11-2021). HA-25 keeps the same designation under it.
        { label: { es: 'Resistencia' }, value: { es: 'HA-25 según Código Estructural' } },
        { label: { es: 'Superficie' }, value: { es: 'Antideslizante clase 3 · Rd > 45 · áridos de machaqueo' } },
      ],
    },
    faq: [
      { question: { es: '¿Qué tamaño de árido conviene para una rampa?' }, answer: { es: 'Para una rampa conviene un árido de machaqueo (triturado) de tamaño medio o grueso, mejor que el canto rodado, que resbala más. Lo importante es que el pavimento alcance clase 3 de resbaladicidad (Rd > 45), que el CTE pide en exteriores. El tamaño final depende de la pendiente y del acabado que busques.' } },
      { question: { es: '¿Se puede combinar con hormigón impreso en la misma obra?' } },
      { question: { es: '¿Qué mantenimiento necesita?' }, answer: { es: 'El hormigón lavado necesita poco mantenimiento: basta con limpiarlo con agua y detergente suave y, en zonas con más tránsito, pasar la hidrolimpiadora de vez en cuando. Si se quiere reavivar el color del árido y facilitar la limpieza, se puede aplicar un sellador protector, normalmente cada varios años según el uso y la exposición.' } },
    ],
    guide: {
      kicker: { es: 'Dónde y con qué árido' },
      title: { es: 'Un pavimento que agarra porque deja la piedra a la vista' },
      intro: {
        es: 'El hormigón lavado deja al descubierto el árido de la masa: la superficie queda rugosa y antideslizante, y por eso va donde se pisa mojado o en pendiente, como rampas, salidas de parking y entornos de piscina.',
      },
      blocks: [
        {
          title: { es: 'Árido visto de 12 mm en Godella' },
          paragraphs: [
            {
              es: 'En el [jardín de una vivienda de Godella](/proyectos/hormigon-lavado-valencia-godella/) lo hicimos en gris, con árido de 12 mm y piedra vista, modelo valencia aserras. El color y el tamaño de la piedra los decide el árido que se elige: {{carta de áridos con la que trabajáis (tamaños y colores)}}.',
            },
          ],
        },
        {
          title: { es: 'HA-25 y superficie de clase 3' },
          paragraphs: [
            {
              es: 'Lo ejecutamos con hormigón HA-25 según el Código Estructural, de cono blando, con fibra de polipropileno y aditivado, pigmentable en masa. Con áridos de machaqueo la superficie llega a la clase 3 de resbaladicidad (Rd > 45), la que el Código Técnico de la Edificación pide en exteriores.',
            },
          ],
        },
        {
          title: { es: 'Lavado o impreso' },
          paragraphs: [
            {
              es: 'El [hormigón impreso](/hormigon-impreso/) imita la piedra con un molde y color sobre la superficie; el lavado enseña la piedra real del árido y deja una textura rugosa. Son dos acabados distintos para dos usos distintos.',
            },
          ],
        },
      ],
    },
    cta: { es: '¿Una rampa, un vial, el borde de la piscina? Dinos los metros y te llamamos.' },
    flagship: false,
  },
  {
    id: 'microcemento',
    slug: { es: 'microcemento' },
    number: '05',
    name: { es: 'Microcemento decorativo' },
    shortName: { es: 'Microcemento' },
    summary: {
      es: 'Renueva suelos, paredes, baños y cocinas sin retirar el material existente. Ahorro de tiempo y de obra.',
    },
    description: {
      es: 'Microcemento decorativo en baños, cocinas, suelos y paredes. Renovación completa sin retirar el material existente, con ahorro económico y de tiempo.',
    },
    seoTitle: { es: 'Microcemento en Valencia y Alicante: baños y cocinas' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
    guide: {
      kicker: { es: 'Obras' },
      title: { es: 'Renovar el baño sin levantar el azulejo' },
      intro: {
        es: 'El microcemento se aplica sobre lo que ya tienes —azulejo, suelo o pared— y lo cubre con un revestimiento continuo. Sin retirar el material de antes no hay desescombro, y eso ahorra tiempo y obra al renovar un baño o una cocina.',
      },
      blocks: [
        {
          title: { es: 'Dos baños que hemos reformado' },
          paragraphs: [
            {
              es: 'En [Moraira](/proyectos/microcemento-en-moraira/) revestimos un cuarto de baño completo en gris claro, el color que eligió el cliente. En [Alicante](/proyectos/microcemento-en-alicante/) hicimos la reforma completa de un baño con el modelo y el color que el cliente eligió asesorado por un diseñador: en los últimos años son muchos los diseñadores que nos piden microcemento.',
            },
          ],
        },
        {
          title: { es: 'Microcemento u hormigón pulido' },
          paragraphs: [
            {
              es: 'El microcemento sirve para renovar sin quitar lo que hay. Si el suelo es nuevo y lo que buscas es un pavimento continuo de hormigón, mira el [hormigón pulido](/hormigon-pulido/).',
            },
          ],
        },
      ],
    },
    cta: { es: '¿Un baño, una cocina, un suelo entero? Dinos los metros y te llamamos.' },
    flagship: true,
  },
  {
    id: 'autonivelantes',
    slug: { es: 'autonivelantes' },
    number: '06',
    name: { es: 'Autonivelantes' },
    shortName: { es: 'Autonivelantes' },
    summary: { es: 'Morteros decorativos, lisos o antideslizantes, con bomba propia.' },
    description: {
      es: 'Morteros autonivelantes decorativos: lisos o antideslizantes, industriales o decorativos, con maquinaria propia de bombeo y adaptados al Código Técnico de la Edificación.',
    },
    seoTitle: { es: 'Morteros autonivelantes en Valencia y Alicante' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
    number: '07',
    name: { es: 'Pavimentos de caucho' },
    shortName: { es: 'Caucho' },
    summary: { es: 'Parques infantiles y zonas deportivas. EN 1176 y EN 1177.' },
    description: {
      es: 'Pavimentos de caucho para parques infantiles y zonas deportivas: EPDM o SBR, espesor según la altura crítica de caída del equipo de juego, normas EN 1176 y EN 1177.',
    },
    seoTitle: { es: 'Suelo de caucho para parques infantiles (EN 1177)' },
    headingPlace: { es: 'en Valencia y Alicante' },
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
    number: '08',
    name: { es: 'Alicatados' },
    shortName: { es: 'Alicatados' },
    summary: { es: 'Baños, cocinas, piscinas y terrazas en la provincia de Valencia.' },
    description: {
      es: 'Alicatados en toda la provincia de Valencia: baños, cocinas, piscinas y terrazas, desde reformas residenciales hasta obras comerciales.',
    },
    seoTitle: { es: 'Alicatados en Valencia: baños, cocinas, piscinas y terrazas' },
    headingPlace: { es: 'en la provincia de Valencia' },
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
