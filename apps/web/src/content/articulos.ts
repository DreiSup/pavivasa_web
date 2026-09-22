import type { Articulo } from '@/lib/tipos'

/**
 * Artículos reales del blog de pavivasa.com (2023-2024), editados al tuteo y sin erratas.
 * El de piedra vista tiene el cuerpo original en rumano: queda pendiente de reescribir.
 */
export const articulos: Articulo[] = [
  {
    slug: 'hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios',
    titulo: 'Hormigón impreso en Dénia: la solución ideal para embellecer tus espacios',
    entradilla: 'Qué es, qué ventajas tiene y dónde se usa el hormigón impreso en la Marina Alta.',
    servicio: 'hormigon-impreso',
    fecha: 'Junio 2024',
    fechaIso: '2024-06-01',
    imagen: {
      etiqueta: 'Foto · impreso en Dénia · sustituye a las 7 fotos de 2024 sin alt',
      src: '/img/impreso-jardin-ladrillo.jpg',
      alt: 'Acceso de vivienda en hormigón impreso con molde de ladrillo en espiga, junto a un muro de piedra',
    },
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'El hormigón impreso se ha convertido en una opción cada vez más popular para la decoración y pavimentación de exteriores en Dénia. No solo ofrece una estética atractiva: también aporta una durabilidad y resistencia excepcionales.',
      },
      { tipo: 'h2', id: 'que-es', texto: 'Qué es el hormigón impreso' },
      {
        tipo: 'p',
        texto:
          'Es una técnica que consiste en estampar moldes y aplicar colorantes sobre el hormigón fresco para crear texturas y patrones que imitan materiales naturales como piedra, ladrillo, madera o pizarra. Permite personalizar el acabado con una amplia variedad de estilos y colores.',
      },
      { tipo: 'h2', id: 'ventajas', texto: 'Ventajas' },
      {
        tipo: 'ol',
        items: [
          { titulo: 'Estética versátil.', texto: 'Replica piedra natural, madera o adoquín y se adapta a cualquier estilo.' },
          {
            titulo: 'Durabilidad y resistencia.',
            texto: 'Aguanta el clima, el tráfico peatonal y de vehículos y el desgaste general.',
          },
          {
            titulo: 'Fácil mantenimiento.',
            texto: 'Limpieza regular y un sellador ocasional; sin juntas donde crezca maleza.',
          },
          { titulo: 'Rapidez de instalación.', texto: 'Menos interrupciones que otros pavimentos.' },
        ],
      },
      {
        tipo: 'obra',
        slug: 'hormigon-impreso-denia',
        titulo: 'Obra real en Dénia · 2017',
        lineas: ['Piedra inglesa · gris mate y crema', 'HM20 · 10 cm · árido 12 mm', 'Mallazo 20×30 · fibra PP · 4 kg color/m²'],
      },
      { tipo: 'h2', id: 'aplicaciones', texto: 'Aplicaciones en Dénia' },
      {
        tipo: 'p',
        texto:
          'Entradas de vehículos, terrazas y patios, contornos de piscina (superficie antideslizante), jardines y senderos, plazas y áreas comerciales con alto tráfico peatonal.',
      },
      { tipo: 'h2', id: 'instalacion', texto: 'Instalación' },
      {
        tipo: 'p',
        texto:
          'Para un resultado óptimo hace falta experiencia: desde la preparación de la base hasta la aplicación de selladores protectores. Un instalador profesional te asesora sobre los mejores patrones y colores para tu proyecto.',
      },
    ],
    cierre: '¿Tienes un patio o una entrada en la Marina Alta?',
  },
  {
    slug: 'hormigon-fratasado-fino-decorativo-viviendas',
    titulo: 'Hormigón fratasado fino decorativo en viviendas',
    entradilla:
      'Superficie continua y sin juntas para interiores y exteriores: durabilidad, mantenimiento y color.',
    servicio: 'hormigon-pulido',
    fecha: 'Junio 2024',
    fechaIso: '2024-06-01',
    imagen: {
      etiqueta: 'Foto · fratasado en vivienda · sustituye a las 3 fotos de 2024',
      src: '/img/pulido-porche-vigas.jpg',
      alt: 'Porche de vivienda con vigas de madera y suelo de hormigón fratasado fino',
    },
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'El hormigón fratasado fino decorativo se ha convertido en una de las opciones más populares para interiores y exteriores de vivienda. Da un acabado elegante y moderno, y además tiene ventajas prácticas para cualquier tipo de hogar.',
      },
      { tipo: 'h2', id: 'que-es', texto: 'Qué es el hormigón fratasado fino' },
      {
        tipo: 'p',
        texto:
          'Es una técnica de acabado que consiste en alisar y pulir el hormigón fresco con una llana o fratás. Se obtiene una superficie lisa, uniforme y continua. Con pigmentos y aditivos se personaliza para adaptarse a cualquier estilo de decoración.',
      },
      { tipo: 'h2', id: 'beneficios', texto: 'Beneficios' },
      {
        tipo: 'ol',
        items: [
          {
            titulo: 'Durabilidad y resistencia.',
            texto: 'Al ser una superficie continua y sin juntas es menos propensa a grietas y desgaste. Ideal para zonas de mucho paso: salones, cocinas y patios.',
          },
          {
            titulo: 'Fácil mantenimiento.',
            texto: 'Basta una limpieza regular con agua y jabón neutro. La superficie lisa evita que se acumulen polvo y suciedad.',
          },
          {
            titulo: 'Estética y versatilidad.',
            texto: 'Se pigmenta en una gran variedad de colores, del estilo más rústico al más moderno, y el acabado pulido realza cualquier espacio.',
          },
        ],
      },
      { tipo: 'h2', id: 'aplicaciones', texto: 'Aplicaciones en viviendas' },
      {
        tipo: 'p',
        texto:
          'Se aplica tanto en interiores como en exteriores: suelos, paredes y encimeras dentro de casa; patios, terrazas, contornos de piscina y fachadas fuera.',
      },
      { tipo: 'h2', id: 'instalacion', texto: 'Instalación' },
      {
        tipo: 'p',
        texto:
          'Para un acabado de calidad hacen falta profesionales con experiencia: el proceso exige precisión para lograr una superficie uniforme y duradera, y hay que tener en cuenta la preparación del soporte, las condiciones climáticas y el tiempo de secado.',
      },
    ],
    cierre: '¿Un interior o una terraza en pulido?',
  },
  {
    slug: 'brillo-elegancia-explorando-hormigon-pulido',
    titulo: 'Brillo y elegancia: explorando el hormigón pulido',
    entradilla: 'Cómo se pule el hormigón y por qué se usa en viviendas, exposiciones y locales.',
    servicio: 'hormigon-pulido',
    fecha: 'Agosto 2023',
    fechaIso: '2023-08-22',
    imagen: {
      etiqueta: 'Foto · pulido · sustituye a la foto de WhatsApp de 2023 (1024 px)',
      src: '/img/pulido-interior-loft3.jpg',
      alt: 'Interior con suelo de hormigón pulido brillante que refleja la luz de las ventanas',
    },
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'En la construcción y el diseño de interiores, la búsqueda de soluciones que combinen estética y funcionalidad es constante. Una técnica que ha ganado protagonismo es el hormigón pulido: en Valencia ha encontrado terreno fértil, con una apariencia sofisticada y contemporánea que combina belleza y durabilidad.',
      },
      { tipo: 'h2', id: 'proceso', texto: 'El arte del hormigón pulido' },
      {
        tipo: 'p',
        texto:
          'Pulir el hormigón consiste en tratar la superficie hasta obtener un acabado liso, brillante y reflectante. Se pule mecánicamente con herramientas abrasivas de distintos granos hasta revelar su belleza natural: una superficie que a menudo recuerda al mármol o al terrazo, con la resistencia y durabilidad del hormigón.',
      },
      { tipo: 'h2', id: 'valencia', texto: 'El pulido en Valencia' },
      {
        tipo: 'p',
        texto:
          'Desde residencias privadas hasta espacios comerciales, diseñadores y arquitectos valencianos han adoptado el pulido para añadir sofisticación. La técnica sirve tanto en interiores como en exteriores, lo que da cohesión estética a todo tipo de entornos.',
      },
      { tipo: 'h2', id: 'aplicaciones', texto: 'Aplicaciones' },
      {
        tipo: 'p',
        texto:
          'Suelos de salas de exposición, encimeras de cocina, recepciones de hotel: el pulido transforma el hormigón en una superficie refinada y brillante que ha dejado marca en la arquitectura de la ciudad.',
      },
    ],
    cierre: '¿Un local, una exposición, una vivienda?',
  },
  {
    slug: 'hormigon-desactivado-piedra-vista',
    titulo: 'Hormigón desactivado con piedra vista',
    entradilla: 'Estética natural, agarre y bajo mantenimiento: el árido visto en caminos, accesos, terrazas y piscinas.',
    servicio: 'hormigon-lavado',
    fecha: 'Junio 2024',
    fechaIso: '2024-06-01',
    imagen: {
      etiqueta: 'Foto · árido visto · sustituye a las 6 fotos de 2024',
      src: '/img/desactivado-muestras2.jpg',
      alt: 'Detalle de hormigón desactivado con la piedra vista, en dos tonos separados por una junta',
    },
    cuerpo: [
      {
        tipo: 'pendiente',
        texto:
          'Cuerpo pendiente · el artículo original está en rumano y hay que reescribirlo en castellano. Secciones del original: qué es el hormigón desactivado · beneficios (estética natural, durabilidad, seguridad antideslizante, mantenimiento sencillo) · aplicaciones (caminos y senderos, accesos de vehículos y garajes, terrazas, entornos de piscina) · conclusión.',
      },
    ],
    cierre: '¿Un camino, una rampa, el borde de la piscina?',
  },
]
