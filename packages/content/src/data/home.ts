import type { HomeContent } from '../schemas/home.ts'

export const home = {
  hero: {
    label: { es: 'Foto hero · contorno de piscina · piedra inglesa crema (Dénia)' },
    src: '/img/impreso-piscina-madera2.jpg',
    alt: {
      es: 'Contorno de piscina pavimentado en hormigón impreso con acabado madera en tono terracota, junto a un seto de cipreses',
    },
  },
  heroTabs: [
    {
      serviceId: 'hormigon-impreso',
      tabLabel: { es: 'Impreso' },
      eyebrow: { es: 'Hormigón impreso' },
      title: { es: 'Suelos de hormigón impreso a tu medida' },
      subtitle: { es: 'Revestimiento de fachadas y muros, recubrimiento de piscinas, patios, terrazas y jardines.' },
      image: {
        label: { es: 'Foto hero · contorno de piscina · piedra inglesa crema (Dénia)' },
        src: '/img/impreso-piscina-madera2.jpg',
        alt: {
          es: 'Contorno de piscina pavimentado en hormigón impreso con acabado madera en tono terracota, junto a un seto de cipreses',
        },
      },
    },
    {
      serviceId: 'hormigon-pulido',
      tabLabel: { es: 'Pulido' },
      eyebrow: { es: 'Hormigón pulido' },
      title: { es: 'Suelos de hormigón pulido, dentro y fuera' },
      subtitle: { es: 'Naves industriales, garajes, terrazas, piscinas e interiores. Durabilidad, impermeabilidad y bajo mantenimiento.' },
      image: {
        label: { es: 'Foto · interior · pulido o microcemento' },
        src: '/img/pulido-interior-loft1.jpg',
        alt: { es: 'Interior de vivienda tipo loft con suelo de hormigón pulido continuo' },
      },
    },
    {
      serviceId: 'microcemento',
      tabLabel: { es: 'Microcemento' },
      eyebrow: { es: 'Microcemento decorativo' },
      title: { es: 'Microcemento decorativo, sin retirar lo que ya tienes' },
      subtitle: { es: 'Renueva suelos, paredes, baños y cocinas con un acabado elegante y un ahorro de tiempo importante.' },
      image: {
        label: { es: 'Foto · baño en microcemento gris claro · Moraira' },
        src: '/img/microcemento-bano-lavabos2.jpg',
        alt: { es: 'Baño revestido en microcemento gris claro con encimera continua y dos lavabos' },
      },
    },
  ],
  /** "¿Qué quieres pavimentar?" — same order as the quote form's dropdown. */
  spaces: [
    {
      name: { es: 'Entrada de garaje' },
      image: {
        label: { es: 'Foto · entrada de garaje · impreso' },
        src: '/img/impreso-camino-oscuro.jpg',
        alt: { es: 'Entrada de vehículos en hormigón impreso gris oscuro junto a la fachada blanca de una vivienda' },
      },
    },
    {
      name: { es: 'Porche o terraza' },
      image: {
        label: { es: 'Foto · terraza · impreso' },
        src: '/img/impreso-porche-rojo.jpg',
        alt: { es: 'Porche con pavimento de hormigón impreso en rojo, con jardinera de piedra y plantas' },
      },
    },
    {
      name: { es: 'Contorno de piscina' },
      image: {
        label: { es: 'Foto · contorno de piscina · piedra inglesa' },
        src: '/img/impreso-piscina-madera1.jpg',
        alt: { es: 'Borde de piscina en hormigón impreso con acabado madera en tono claro' },
      },
    },
    {
      name: { es: 'Interior de vivienda' },
      image: {
        label: { es: 'Foto · interior · pulido o microcemento' },
        src: '/img/pulido-interior-loft1.jpg',
        alt: { es: 'Interior de vivienda tipo loft con suelo de hormigón pulido continuo' },
      },
    },
    {
      name: { es: 'Patio o jardín' },
      image: {
        label: { es: 'Foto · patio · impreso o lavado' },
        src: '/img/impreso-jardin-sombrilla.jpg',
        alt: { es: 'Jardín con pavimento de hormigón impreso en tono marrón, sombrilla y zona de estar' },
      },
    },
    {
      name: { es: 'Nave, parking o local' },
      image: {
        label: { es: 'Foto · nave · pulido' },
        src: '/img/pulido-explanada-gris.jpg',
        alt: { es: 'Explanada exterior de hormigón pulido en gris ante una edificación' },
      },
    },
  ],
  otherSpaceLabel: { es: 'Otro' },
  faq: [
    { question: { es: '¿Cuánto tarda una obra de hormigón impreso?' } },
    { question: { es: '¿Se puede pavimentar sobre una solera existente?' } },
    { question: { es: '¿Qué mantenimiento necesita el hormigón impreso?' } },
    { question: { es: '¿Cubrís mi municipio?' } },
    { question: { es: '¿Qué incluye la garantía de 10 años?' } },
  ],
  printedModels: [
    { es: 'Piedra inglesa' },
    { es: 'Sillería' },
    { es: 'Sillería grande' },
    { es: 'Adoquín belga' },
    { es: 'Manteado' },
  ],
  projectColors: [
    { es: 'Gris medio' },
    { es: 'Gris oscuro' },
    { es: 'Gris muy oscuro' },
    { es: 'Gris mate' },
    { es: 'Marrón' },
    { es: 'Crema' },
    { es: 'Arena' },
    { es: 'Natural' },
    { es: '107' },
    { es: '117 crema marfil' },
  ],
} satisfies HomeContent
