import type { Project } from '../schemas/project.ts'

/** Real projects from pavivasa.com, unchanged from Spanish. What the current site doesn't give (some execution data, most `district`s) stays `undefined`. */
export const projects = [
  {
    slug: { es: 'hormigon-impreso-denia' },
    title: { es: 'Piedra inglesa, gris mate y crema' },
    longTitle: { es: 'Piedra inglesa en gris mate y crema para una vivienda en urbanización' },
    service: 'hormigon-impreso',
    town: 'Dénia',
    province: 'Alicante',
    spaceType: { es: 'Vivienda en urbanización' },
    model: { es: 'Piedra inglesa' },
    color: { es: 'Gris mate y crema' },
    photoYear: 2017,
    executionSpecs: {
      concrete: { es: 'HM20' },
      thickness: { es: '10 cm' },
      aggregate: { es: '12 mm' },
      mesh: { es: '20×30 · 4 mm' },
      fiber: { es: 'Polipropileno' },
      colorDosage: { es: '4 kg/m²' },
    },
    brief: [
      {
        es: 'Pavimento exterior de una vivienda en una urbanización de Dénia (Alicante). La tendencia del hormigón impreso sigue creciendo en urbanizaciones y unifamiliares: lejos de ser una moda pasajera, cada día presupuestamos trabajos de este tipo.',
      },
    ],
    execution: [
      {
        es: 'Hormigón HM20 con 10 cm de espesor y árido de 12 mm, con mallazo de 20×30 y 4 mm y fibra de polipropileno, complementado con 4 kg de color por metro cuadrado.',
      },
      {
        es: 'En la misma vivienda conviven dos acabados: piedra inglesa en gris mate y piedra inglesa en crema. El cliente quedó contento con el resultado y con el trato durante la obra; para nosotros, eso es lo que se convierte en nuevos trabajos recomendados.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · vista general del pavimento · dos acabados' },
        src: '/img/impreso-piscina-olivo.jpg',
        alt: { es: 'Vista general del pavimento de hormigón impreso con los dos acabados, junto a la piscina y el olivo' },
      },
      {
        label: { es: '02 · gris mate' },
        src: '/img/impreso-patio-gris.jpg',
        alt: { es: 'Zona pavimentada con piedra inglesa en gris mate' },
      },
      {
        label: { es: '03 · crema' },
        src: '/img/impreso-patio-ocre.jpg',
        alt: { es: 'Zona pavimentada con piedra inglesa en tono crema bajo el porche' },
      },
      {
        label: { es: '04 · detalle molde' },
        src: '/img/impreso-textura-piedra.jpg',
        alt: { es: 'Detalle del molde de piedra inglesa sobre el hormigón impreso' },
      },
    ],
    featured: true,
  },
  {
    slug: { es: 'hormigon-impreso-moraira' },
    title: { es: 'Manteado, gris y marrón' },
    longTitle: { es: 'Manteado en gris y marrón para un chalé con jardín y piscina' },
    service: 'hormigon-impreso',
    town: 'Moraira',
    province: 'Alicante',
    spaceType: { es: 'Chalé con jardín y piscina' },
    model: { es: 'Manteado' },
    color: { es: 'Gris y marrón' },
    photoYear: 2016,
    executionSpecs: {
      concrete: { es: 'HM20' },
      thickness: { es: '12 cm' },
      aggregate: { es: '12 mm' },
      finish: { es: 'Mate' },
    },
    brief: [
      {
        es: 'Chalé unifamiliar con jardín y piscina en una urbanización de Moraira. Un pavimento que diera al conjunto un toque vanguardista sin restar protagonismo a la piscina.',
      },
    ],
    execution: [
      {
        es: 'Hormigón impreso modelo manteado en gris y marrón, con 12 cm de espesor de hormigón HM20, árido de 12 mm y acabado mate.',
      },
      {
        es: 'El impreso es una de las técnicas decorativas de exterior con más auge: la gama de texturas y colores permite un pavimento atractivo, de fácil mantenimiento y fácil personalización, tanto para renovar suelos como para construir un pavimento nuevo.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · chalé con piscina · manteado' },
        src: '/img/impreso-patio-olivo.jpg',
        alt: { es: 'Chalé con jardín y piscina pavimentado en hormigón impreso manteado en gris y marrón' },
      },
      {
        label: { es: '02 · entrada' },
        src: '/img/impreso-camino-ladera1.jpg',
        alt: { es: 'Acceso al chalé en hormigón impreso manteado de tono marrón' },
      },
    ],
    featured: true,
  },
  {
    slug: { es: 'hormigon-impreso-calpe-2' },
    title: { es: 'Sillería grande, arena' },
    longTitle: { es: 'Sillería grande en arena con juntas de dilatación de 5×5' },
    service: 'hormigon-impreso',
    town: 'Calpe',
    province: 'Alicante',
    spaceType: { es: 'Pavimento exterior' },
    model: { es: 'Sillería grande' },
    color: { es: 'Arena' },
    photoYear: 2021,
    executionSpecs: {
      concrete: { es: 'HM25' },
      thickness: { es: '10 cm' },
      aggregate: { es: '12 mm' },
      mesh: { es: 'Sí' },
      fiber: { es: 'Polipropileno' },
      expansionJoints: { es: '5×5 m' },
    },
    brief: [{ es: 'Pavimento exterior de hormigón impreso en Calpe.' }],
    execution: [
      {
        es: 'Hormigón impreso en color arena y modelo sillería grande, con 10 cm de espesor de hormigón HM25, árido de 12 mm, mallazo y fibra de polipropileno, con juntas de dilatación de 5×5 y acabado impreso.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · sillería grande arena · original de móvil, 300 px' },
        src: '/img/impreso-piscina-ocre.jpg',
        alt: { es: 'Pavimento exterior de hormigón impreso con molde de sillería grande en color arena junto a la piscina' },
      },
    ],
    featured: true,
  },
  {
    slug: { es: 'hormigon-pulido-xabia' },
    title: { es: 'Fratasado, crema 117' },
    longTitle: { es: '120 m² de hormigón pulido en crema 117 para una residencia en urbanización' },
    service: 'hormigon-pulido',
    town: 'Xàbia',
    province: 'Alicante',
    spaceType: { es: 'Residencia en urbanización' },
    model: { es: 'Fratasado' },
    color: { es: 'Crema 117' },
    surfaceArea: 120,
    photoYear: 2016,
    executionSpecs: {},
    brief: [{ es: 'Residencia en una urbanización de Xàbia, en la costa norte de la provincia de Alicante, en la comarca de la Marina Alta.' }],
    execution: [
      {
        es: '120 metros de pavimentación de hormigón pulido (fratasado) en color crema 117, elegido por el cliente. Este pavimento destaca por la variedad de colores disponibles y, sobre todo, por su dureza y su resistencia a las manchas y a las condiciones climatológicas.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · pavimento pulido crema 117 · sin foto de obra en la web actual' },
        src: '/img/pulido-piscina-jardin.jpg',
        alt: { es: 'Hormigón pulido en tono crema alrededor de la piscina de una residencia con palmeras' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-pulido-alicante' },
    title: { es: 'Fratasado, 117 crema marfil' },
    longTitle: { es: 'Hormigón pulido en 117 crema marfil: interior, exterior y contorno de piscina' },
    service: 'hormigon-pulido',
    town: 'Benissa',
    province: 'Alicante',
    district: 'Urbanización Montemar la Viña',
    spaceType: { es: 'Unifamiliar: interior, exterior y piscina' },
    model: { es: 'Fratasado' },
    color: { es: '117 crema marfil' },
    photoYear: 2017,
    executionSpecs: {},
    brief: [
      {
        es: 'Vivienda unifamiliar en la urbanización Montemar la Viña, en Benissa. Un mismo pavimento continuo para el interior, el exterior y el contorno de la piscina.',
      },
    ],
    execution: [
      {
        es: 'Hormigón pulido (fratasado) en color 117, crema marfil, en el interior y el exterior de la vivienda y alrededor de la piscina. El resultado es muy vanguardista y el cliente quedó satisfecho.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · pulido crema marfil · interior' },
        src: '/img/pulido-interior-acristalado.jpg',
        alt: { es: 'Interior de la vivienda con suelo de hormigón pulido en crema marfil' },
      },
      {
        label: { es: '02 · contorno de piscina' },
        src: '/img/pulido-piscina-gris.jpg',
        alt: { es: 'Contorno de piscina en hormigón pulido junto a la vivienda' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-pulido-daimus' },
    title: { es: 'Nave industrial, 2000 m²' },
    longTitle: { es: '2000 m² de hormigón pulido en una nave industrial con muelle de carga' },
    service: 'hormigon-pulido',
    town: 'Daimús',
    province: 'Valencia',
    spaceType: { es: 'Nave industrial con muelle de carga' },
    model: { es: 'Pulido' },
    surfaceArea: 2000,
    photoYear: 2016,
    executionSpecs: {},
    brief: [
      {
        es: 'Nave industrial en Daimús, en la comarca de La Safor. El encargo incluía el muelle de carga y descarga y otros trabajos de construcción para terminar la estructura interior.',
      },
    ],
    execution: [
      {
        es: '2000 metros de pavimentación de hormigón pulido. Nos dedicamos a este tipo de pavimentación desde hace más de 15 años: durabilidad, resistencia y bajo coste lo hacen idóneo para soleras y naves industriales.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · nave industrial · pulido' },
        src: '/img/solera-pista-cubierta.jpg',
        alt: { es: 'Solera de hormigón pulido en el interior de una nave industrial con estructura metálica' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-lavado-valencia-godella' },
    title: { es: 'Árido visto 12 mm, gris' },
    longTitle: { es: 'Hormigón lavado gris con árido de 12 mm y piedra vista para un jardín' },
    service: 'hormigon-lavado',
    town: 'Godella',
    province: 'Valencia',
    spaceType: { es: 'Jardín de vivienda' },
    model: { es: 'Valencia aserras' },
    color: { es: 'Gris' },
    photoYear: 2017,
    executionSpecs: { aggregate: { es: '12 mm · piedra vista' } },
    brief: [{ es: 'Jardín de una vivienda en Godella (Valencia).' }],
    execution: [
      { es: 'Hormigón lavado (árido visto) en color gris con árido de 12 mm y piedra vista, modelo valencia aserras.' },
      {
        es: 'Además de su belleza, este hormigón mejora mucho el agarre: por eso se usa en aceras, plazas, zonas transitables y jardines. Su facilidad de ejecución respecto al hormigón convencional lo convierte en una alternativa más económica.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · panorámica del jardín' },
        src: '/img/desactivado-paso-lateral.jpg',
        alt: { es: 'Paso lateral del jardín ejecutado en hormigón lavado con árido visto' },
      },
      {
        label: { es: '02 · detalle del pavimento' },
        src: '/img/desactivado-muestras1.jpg',
        alt: { es: 'Detalle del árido visto del hormigón lavado, con dos granulometrías separadas por una junta' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-impreso-calpe' },
    title: { es: 'Piedra inglesa, gris medio' },
    longTitle: { es: 'Piedra inglesa en gris medio para una urbanización de Calpe' },
    service: 'hormigon-impreso',
    town: 'Calpe',
    province: 'Alicante',
    spaceType: { es: 'Urbanización' },
    model: { es: 'Piedra inglesa' },
    color: { es: 'Gris medio' },
    photoYear: 2016,
    executionSpecs: {},
    brief: [{ es: 'Urbanización en Calpe, en la costa norte de la provincia de Alicante, en la comarca de la Marina Alta.' }],
    execution: [
      {
        es: 'Pavimento de hormigón impreso en color gris medio y modelo piedra inglesa, ambos a elección del cliente. Este pavimento destaca por la variedad de diseños y, sobre todo, por su dureza y su resistencia a las manchas y a las condiciones climatológicas.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · piedra inglesa gris medio' },
        src: '/img/portada.png',
        alt: { es: 'Patio de una vivienda en urbanización pavimentado con piedra inglesa en gris medio' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-impreso-benissa' },
    title: { es: 'Adoquín belga, gris oscuro' },
    longTitle: { es: 'Adoquín belga en gris oscuro sobre un terreno con fuerte desnivel' },
    service: 'hormigon-impreso',
    town: 'Benissa',
    province: 'Alicante',
    district: 'Urbanización Monte Mar',
    spaceType: { es: 'Urbanización · terreno con desnivel' },
    model: { es: 'Adoquín belga' },
    color: { es: 'Gris oscuro' },
    photoYear: 2016,
    executionSpecs: {},
    brief: [
      { es: 'Urbanización Monte Mar, en Benissa. El terreno tenía un fuerte desnivel, que se rellenó para evitar la acumulación de agua en algunas zonas.' },
    ],
    execution: [{ es: 'Pavimento de hormigón impreso en color gris oscuro y modelo adoquín belga, ambos a elección del cliente.' }],
    images: [
      {
        label: { es: 'Foto principal · adoquín belga · desnivel' },
        src: '/img/impreso-rampa-adoquin.jpg',
        alt: { es: 'Rampa de acceso en hormigón impreso con molde de adoquín belga sobre terreno con desnivel' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-impreso-lliria' },
    title: { es: 'Sillería, color 107' },
    longTitle: { es: 'Sillería en color 107 para una urbanización de Llíria' },
    service: 'hormigon-impreso',
    town: 'Llíria',
    province: 'Valencia',
    spaceType: { es: 'Urbanización' },
    model: { es: 'Sillería' },
    color: { es: '107' },
    photoYear: 2016,
    executionSpecs: {},
    brief: [{ es: 'Urbanización en Llíria, capital de la comarca del Camp de Túria (Valencia).' }],
    execution: [{ es: 'Pavimento de hormigón impreso en color 107 y modelo sillería, ambos a elección del cliente.' }],
    images: [
      {
        label: { es: 'Foto principal · sillería color 107' },
        src: '/img/impreso-patio-chalet.jpg',
        alt: { es: 'Pavimento de hormigón impreso con molde de sillería en una vivienda de urbanización' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-impreso-montaberner' },
    title: { es: 'Piedra inglesa, gris muy oscuro' },
    longTitle: { es: 'Piedra inglesa en gris muy oscuro con otros trabajos de construcción' },
    service: 'hormigon-impreso',
    town: 'Montaverner',
    province: 'Valencia',
    spaceType: { es: 'Con otros trabajos de construcción' },
    model: { es: 'Piedra inglesa' },
    color: { es: 'Gris muy oscuro' },
    photoYear: 2016,
    executionSpecs: {},
    brief: [
      { es: "Montaverner, en la comarca de la Vall d'Albaida (Valencia). El proyecto incluyó otros trabajos de construcción necesarios para ejecutar el pavimento correctamente." },
    ],
    execution: [
      { es: 'Pavimento de hormigón impreso modelo piedra inglesa en color gris muy oscuro, elegidos por el cliente. La estampación puede imitar adoquines, piedra, baldosas o pizarras.' },
    ],
    images: [
      {
        label: { es: 'Foto principal · piedra inglesa gris muy oscuro' },
        src: '/img/impreso-patio-losa-gris.jpg',
        alt: { es: 'Patio pavimentado con piedra inglesa en gris muy oscuro' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-pulido-benissa' },
    title: { es: 'Pulido, crema 117' },
    longTitle: { es: 'Hormigón pulido en crema 117 con mallazo, fibra y 4 kg de color por m²' },
    service: 'hormigon-pulido',
    town: 'Benissa',
    province: 'Alicante',
    district: 'Urbanización Monte Mar',
    spaceType: { es: 'Urbanización' },
    model: { es: 'Pulido' },
    color: { es: 'Crema 117' },
    photoYear: 2016,
    executionSpecs: { mesh: { es: 'Sí' }, fiber: { es: 'Polipropileno' }, colorDosage: { es: '4 kg/m²' } },
    brief: [{ es: 'Urbanización Monte Mar, en Benissa, en el noreste de la provincia de Alicante.' }],
    execution: [
      { es: 'Pavimento de hormigón pulido en color crema 117, a elección del cliente, ejecutado con mallazo y fibra de polipropileno y 4 kg de color por metro cuadrado.' },
    ],
    images: [
      {
        label: { es: 'Foto principal · pulido crema 117' },
        src: '/img/pulido-acceso-cipreses.jpg',
        alt: { es: 'Acceso en hormigón pulido color crema entre cipreses, en una vivienda de urbanización' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'hormigon-pulido-ribarroja-del-turia' },
    title: { es: 'Nave industrial, color natural' },
    longTitle: { es: 'Hormigón pulido en color natural para una nave industrial' },
    service: 'hormigon-pulido',
    town: 'Riba-roja de Túria',
    province: 'Valencia',
    spaceType: { es: 'Nave industrial' },
    model: { es: 'Pulido' },
    color: { es: 'Natural' },
    photoYear: 2016,
    executionSpecs: { mesh: { es: 'Sí' }, fiber: { es: 'Polipropileno' } },
    brief: [{ es: 'Nave industrial en Riba-roja de Túria, en la comarca del Camp de Túria (Valencia).' }],
    execution: [
      { es: 'Pavimento de hormigón pulido en color natural, a elección del cliente, con mallazo y fibra de polipropileno.' },
      {
        es: 'Pavimentamos naves industriales desde hace más de 15 años: durabilidad, resistencia y bajo coste hacen del pulido el pavimento idóneo para soleras y obra industrial.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · nave industrial · pulido natural' },
        src: '/img/pulido-explanada-gris.jpg',
        alt: { es: 'Explanada de hormigón pulido en color natural en una nave industrial' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'microcemento-en-moraira' },
    title: { es: 'Baño completo, gris claro' },
    longTitle: { es: 'Cuarto de baño completo en microcemento gris claro' },
    service: 'microcemento',
    town: 'Moraira',
    province: 'Alicante',
    spaceType: { es: 'Cuarto de baño completo' },
    model: { es: 'Microcemento' },
    color: { es: 'Gris claro' },
    executionSpecs: {},
    brief: [{ es: 'Cuarto de baño completo en una urbanización de Moraira, núcleo del término municipal de Teulada (Alicante).' }],
    execution: [
      {
        es: 'Microcemento en color gris claro, a elección del cliente. El microcemento abarca desde suelos a paredes, zonas de estar, piscinas, baños, cocinas o muebles, y es resistente al agua y a las altas temperaturas.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · baño en microcemento gris claro · sin foto en la web actual' },
        src: '/img/microcemento-bano-banera.jpg',
        alt: { es: 'Bañera y paramentos del cuarto de baño revestidos en microcemento gris claro' },
      },
    ],
    featured: false,
  },
  {
    slug: { es: 'microcemento-en-alicante' },
    title: { es: 'Reforma de baño' },
    longTitle: { es: 'Reforma completa de baño en microcemento con color elegido por diseñador' },
    service: 'microcemento',
    town: 'Alicante',
    province: 'Alicante',
    spaceType: { es: 'Reforma completa de baño' },
    model: { es: 'Microcemento' },
    color: { es: 'A elección del diseñador' },
    photoYear: 2016,
    executionSpecs: {},
    brief: [
      {
        es: 'Reforma completa de baño en Alicante. El cliente eligió modelo y color con el asesoramiento de un diseñador; en los últimos años los diseñadores nos piden muchos trabajos de microcemento por su belleza, elegancia, modernidad y rapidez de ejecución.',
      },
    ],
    execution: [
      {
        es: 'Al no ser necesario eliminar el material existente, se abaratan costes y tiempos y se evitan las molestias del desescombro. El microcemento es resistente al agua y a las altas temperaturas.',
      },
    ],
    images: [
      {
        label: { es: 'Foto principal · ducha en microcemento' },
        src: '/img/microcemento-ducha.jpg',
        alt: { es: 'Ducha revestida en microcemento continuo tras la reforma completa del baño' },
      },
    ],
    featured: false,
  },
] as const satisfies readonly Project[]
