import type { Article } from '../schemas/article.ts'

/**
 * Real blog articles from pavivasa.com (2023-2024), edited to informal
 * Spanish ("tú") and without typos. The stone-effect article's original
 * body is in Romanian: kept as a `pending` block instead of inventing a
 * translation.
 */
export const articles = [
  {
    slug: { es: 'hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios' },
    title: { es: 'Hormigón impreso en Dénia: la solución ideal para embellecer tus espacios' },
    excerpt: { es: 'Qué es, qué ventajas tiene y dónde se usa el hormigón impreso en la Marina Alta.' },
    service: 'hormigon-impreso',
    date: 'Junio 2024',
    dateIso: '2024-06-01',
    image: {
      label: { es: 'Foto · impreso en Dénia · sustituye a las 7 fotos de 2024 sin alt' },
      src: '/img/impreso-jardin-ladrillo.jpg',
      alt: { es: 'Acceso de vivienda en hormigón impreso con molde de ladrillo en espiga, junto a un muro de piedra' },
    },
    body: [
      {
        type: 'paragraph',
        text: {
          es: 'El hormigón impreso se ha convertido en una opción cada vez más popular para la decoración y pavimentación de exteriores en Dénia. No solo ofrece una estética atractiva: también aporta una durabilidad y resistencia excepcionales.',
        },
      },
      { type: 'heading', id: 'que-es', text: { es: 'Qué es el hormigón impreso' } },
      {
        type: 'paragraph',
        text: {
          es: 'Es una técnica que consiste en estampar moldes y aplicar colorantes sobre el hormigón fresco para crear texturas y patrones que imitan materiales naturales como piedra, ladrillo, madera o pizarra. Permite personalizar el acabado con una amplia variedad de estilos y colores.',
        },
      },
      { type: 'heading', id: 'ventajas', text: { es: 'Ventajas' } },
      {
        type: 'orderedList',
        items: [
          {
            title: { es: 'Estética versátil.' },
            text: { es: 'Replica piedra natural, madera o adoquín y se adapta a cualquier estilo.' },
          },
          {
            title: { es: 'Durabilidad y resistencia.' },
            text: { es: 'Aguanta el clima, el tráfico peatonal y de vehículos y el desgaste general.' },
          },
          {
            title: { es: 'Fácil mantenimiento.' },
            text: { es: 'Limpieza regular y un sellador ocasional; sin juntas donde crezca maleza.' },
          },
          { title: { es: 'Rapidez de instalación.' }, text: { es: 'Menos interrupciones que otros pavimentos.' } },
        ],
      },
      {
        type: 'projectCallout',
        slug: 'hormigon-impreso-denia',
        title: { es: 'Obra real en Dénia · 2017' },
        lines: [
          { es: 'Piedra inglesa · gris mate y crema' },
          { es: 'HM20 · 10 cm · árido 12 mm' },
          { es: 'Mallazo 20×30 · fibra PP · 4 kg color/m²' },
        ],
      },
      { type: 'heading', id: 'aplicaciones', text: { es: 'Aplicaciones en Dénia' } },
      {
        type: 'paragraph',
        text: {
          es: 'Entradas de vehículos, terrazas y patios, contornos de piscina (superficie antideslizante), jardines y senderos, plazas y áreas comerciales con alto tráfico peatonal.',
        },
      },
      { type: 'heading', id: 'instalacion', text: { es: 'Instalación' } },
      {
        type: 'paragraph',
        text: {
          es: 'Para un resultado óptimo hace falta experiencia: desde la preparación de la base hasta la aplicación de selladores protectores. Un instalador profesional te asesora sobre los mejores patrones y colores para tu proyecto.',
        },
      },
    ],
    closing: { es: '¿Tienes un patio o una entrada en la Marina Alta?' },
  },
  {
    slug: { es: 'hormigon-fratasado-fino-decorativo-viviendas' },
    title: { es: 'Hormigón fratasado fino decorativo en viviendas' },
    excerpt: { es: 'Superficie continua y sin juntas para interiores y exteriores: durabilidad, mantenimiento y color.' },
    service: 'hormigon-pulido',
    date: 'Junio 2024',
    dateIso: '2024-06-01',
    image: {
      label: { es: 'Foto · fratasado en vivienda · sustituye a las 3 fotos de 2024' },
      src: '/img/pulido-porche-vigas.jpg',
      alt: { es: 'Porche de vivienda con vigas de madera y suelo de hormigón fratasado fino' },
    },
    body: [
      {
        type: 'paragraph',
        text: {
          es: 'El hormigón fratasado fino decorativo se ha convertido en una de las opciones más populares para interiores y exteriores de vivienda. Da un acabado elegante y moderno, y además tiene ventajas prácticas para cualquier tipo de hogar.',
        },
      },
      { type: 'heading', id: 'que-es', text: { es: 'Qué es el hormigón fratasado fino' } },
      {
        type: 'paragraph',
        text: {
          es: 'Es una técnica de acabado que consiste en alisar y pulir el hormigón fresco con una llana o fratás. Se obtiene una superficie lisa, uniforme y continua. Con pigmentos y aditivos se personaliza para adaptarse a cualquier estilo de decoración.',
        },
      },
      { type: 'heading', id: 'beneficios', text: { es: 'Beneficios' } },
      {
        type: 'orderedList',
        items: [
          {
            title: { es: 'Durabilidad y resistencia.' },
            text: {
              es: 'Al ser una superficie continua y sin juntas es menos propensa a grietas y desgaste. Ideal para zonas de mucho paso: salones, cocinas y patios.',
            },
          },
          {
            title: { es: 'Fácil mantenimiento.' },
            text: { es: 'Basta una limpieza regular con agua y jabón neutro. La superficie lisa evita que se acumulen polvo y suciedad.' },
          },
          {
            title: { es: 'Estética y versatilidad.' },
            text: {
              es: 'Se pigmenta en una gran variedad de colores, del estilo más rústico al más moderno, y el acabado pulido realza cualquier espacio.',
            },
          },
        ],
      },
      { type: 'heading', id: 'aplicaciones', text: { es: 'Aplicaciones en viviendas' } },
      {
        type: 'paragraph',
        text: {
          es: 'Se aplica tanto en interiores como en exteriores: suelos, paredes y encimeras dentro de casa; patios, terrazas, contornos de piscina y fachadas fuera.',
        },
      },
      { type: 'heading', id: 'instalacion', text: { es: 'Instalación' } },
      {
        type: 'paragraph',
        text: {
          es: 'Para un acabado de calidad hacen falta profesionales con experiencia: el proceso exige precisión para lograr una superficie uniforme y duradera, y hay que tener en cuenta la preparación del soporte, las condiciones climáticas y el tiempo de secado.',
        },
      },
    ],
    closing: { es: '¿Un interior o una terraza en pulido?' },
  },
  {
    slug: { es: 'brillo-elegancia-explorando-hormigon-pulido' },
    title: { es: 'Brillo y elegancia: explorando el hormigón pulido' },
    excerpt: { es: 'Cómo se pule el hormigón y por qué se usa en viviendas, exposiciones y locales.' },
    service: 'hormigon-pulido',
    date: 'Agosto 2023',
    dateIso: '2023-08-22',
    image: {
      label: { es: 'Foto · pulido · sustituye a la foto de WhatsApp de 2023 (1024 px)' },
      src: '/img/pulido-interior-loft3.jpg',
      alt: { es: 'Interior con suelo de hormigón pulido brillante que refleja la luz de las ventanas' },
    },
    body: [
      {
        type: 'paragraph',
        text: {
          es: 'En la construcción y el diseño de interiores, la búsqueda de soluciones que combinen estética y funcionalidad es constante. Una técnica que ha ganado protagonismo es el hormigón pulido: en Valencia ha encontrado terreno fértil, con una apariencia sofisticada y contemporánea que combina belleza y durabilidad.',
        },
      },
      { type: 'heading', id: 'proceso', text: { es: 'El arte del hormigón pulido' } },
      {
        type: 'paragraph',
        text: {
          es: 'Pulir el hormigón consiste en tratar la superficie hasta obtener un acabado liso, brillante y reflectante. Se pule mecánicamente con herramientas abrasivas de distintos granos hasta revelar su belleza natural: una superficie que a menudo recuerda al mármol o al terrazo, con la resistencia y durabilidad del hormigón.',
        },
      },
      { type: 'heading', id: 'valencia', text: { es: 'El pulido en Valencia' } },
      {
        type: 'paragraph',
        text: {
          es: 'Desde residencias privadas hasta espacios comerciales, diseñadores y arquitectos valencianos han adoptado el pulido para añadir sofisticación. La técnica sirve tanto en interiores como en exteriores, lo que da cohesión estética a todo tipo de entornos.',
        },
      },
      { type: 'heading', id: 'aplicaciones', text: { es: 'Aplicaciones' } },
      {
        type: 'paragraph',
        text: {
          es: 'Suelos de salas de exposición, encimeras de cocina, recepciones de hotel: el pulido transforma el hormigón en una superficie refinada y brillante que ha dejado marca en la arquitectura de la ciudad.',
        },
      },
    ],
    closing: { es: '¿Un local, una exposición, una vivienda?' },
  },
  {
    slug: { es: 'hormigon-desactivado-piedra-vista' },
    title: { es: 'Hormigón desactivado con piedra vista' },
    excerpt: {
      es: 'Estética natural, agarre y bajo mantenimiento: el árido visto en caminos, accesos, terrazas y piscinas.',
    },
    service: 'hormigon-lavado',
    date: 'Junio 2024',
    dateIso: '2024-06-01',
    image: {
      label: { es: 'Foto · árido visto · sustituye a las 6 fotos de 2024' },
      src: '/img/desactivado-muestras2.jpg',
      alt: { es: 'Detalle de hormigón desactivado con la piedra vista, en dos tonos separados por una junta' },
    },
    body: [
      {
        type: 'pending',
        text: {
          es: 'Cuerpo pendiente · el artículo original está en rumano y hay que reescribirlo en castellano. Secciones del original: qué es el hormigón desactivado · beneficios (estética natural, durabilidad, seguridad antideslizante, mantenimiento sencillo) · aplicaciones (caminos y senderos, accesos de vehículos y garajes, terrazas, entornos de piscina) · conclusión.',
        },
      },
    ],
    closing: { es: '¿Un camino, una rampa, el borde de la piscina?' },
  },
] as const satisfies readonly Article[]
