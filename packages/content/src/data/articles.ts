import type { Article } from '../schemas/article.ts'

/**
 * Real blog articles from pavivasa.com (2023-2024), edited to informal
 * Spanish ("tú") and without typos. The stone-effect article's original
 * body is in Romanian: kept as a `pending` block instead of inventing a
 * translation.
 *
 * «Brillo y elegancia: explorando el hormigón pulido» (2023) no está aquí desde
 * el 2026-11-15: respondía a la misma búsqueda que `/hormigon-pulido/`, su
 * contenido se reescribió dentro de la guía de ese servicio y su URL redirige
 * allí con un 301 (`apps/web/next.config.ts`). Lo mismo, y por la misma razón,
 * con «Hormigón fratasado fino decorativo en viviendas» (2024): es la fuente
 * del texto de `/hormigon-fratasado/` y redirige allí.
 */
export const articles = [
  {
    slug: { es: 'hormigon-impreso-denia-la-solucion-ideal-embellecer-tus-espacios' },
    title: { es: 'Hormigón impreso en Dénia: la solución ideal para embellecer tus espacios' },
    excerpt: { es: 'Qué es, qué ventajas tiene y dónde se usa el hormigón impreso en la Marina Alta.' },
    service: 'hormigon-impreso',
    date: { es: 'Junio 2024' },
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
    slug: { es: 'hormigon-desactivado-piedra-vista' },
    title: { es: 'Hormigón desactivado con piedra vista' },
    excerpt: {
      es: 'Estética natural, agarre y bajo mantenimiento: el árido visto en caminos, accesos, terrazas y piscinas.',
    },
    service: 'hormigon-lavado',
    date: { es: 'Junio 2024' },
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
