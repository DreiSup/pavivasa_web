import type { Imagen, Pregunta } from '@/lib/tipos'

/** Foto de apertura de la home: contorno de piscina en impreso, acabado madera. */
export const HERO_HOME: Imagen = {
  etiqueta: 'Foto hero · contorno de piscina · piedra inglesa crema (Dénia)',
  src: '/img/impreso-piscina-madera2.jpg',
  alt: 'Contorno de piscina pavimentado en hormigón impreso con acabado madera en tono terracota, junto a un seto de cipreses',
}

/** Seis espacios de "¿Qué quieres pavimentar?". Mismo orden que el desplegable del formulario. */
export const ESPACIOS: readonly { nombre: string; imagen: Imagen }[] = [
  {
    nombre: 'Entrada de garaje',
    imagen: {
      etiqueta: 'Foto · entrada de garaje · impreso',
      src: '/img/impreso-camino-oscuro.jpg',
      alt: 'Entrada de vehículos en hormigón impreso gris oscuro junto a la fachada blanca de una vivienda',
    },
  },
  {
    nombre: 'Porche o terraza',
    imagen: {
      etiqueta: 'Foto · terraza · impreso',
      src: '/img/impreso-porche-rojo.jpg',
      alt: 'Porche con pavimento de hormigón impreso en rojo, con jardinera de piedra y plantas',
    },
  },
  {
    nombre: 'Contorno de piscina',
    imagen: {
      etiqueta: 'Foto · contorno de piscina · piedra inglesa',
      src: '/img/impreso-piscina-madera1.jpg',
      alt: 'Borde de piscina en hormigón impreso con acabado madera en tono claro',
    },
  },
  {
    nombre: 'Interior de vivienda',
    imagen: {
      etiqueta: 'Foto · interior · pulido o microcemento',
      src: '/img/pulido-interior-loft1.jpg',
      alt: 'Interior de vivienda tipo loft con suelo de hormigón pulido continuo',
    },
  },
  {
    nombre: 'Patio o jardín',
    imagen: {
      etiqueta: 'Foto · patio · impreso o lavado',
      src: '/img/impreso-jardin-sombrilla.jpg',
      alt: 'Jardín con pavimento de hormigón impreso en tono marrón, sombrilla y zona de estar',
    },
  },
  {
    nombre: 'Nave, parking o local',
    imagen: {
      etiqueta: 'Foto · nave · pulido',
      src: '/img/pulido-explanada-gris.jpg',
      alt: 'Explanada exterior de hormigón pulido en gris ante una edificación',
    },
  },
]

export const NOMBRES_ESPACIOS = [...ESPACIOS.map((e) => e.nombre), 'Otro']

/** Preguntas de la home. Las respuestas las redacta Gabriel: hasta entonces, DatoPendiente. */
export const FAQ_HOME: Pregunta[] = [
  { pregunta: '¿Cuánto tarda una obra de hormigón impreso?' },
  { pregunta: '¿Se puede pavimentar sobre una solera existente?' },
  { pregunta: '¿Qué mantenimiento necesita el hormigón impreso?' },
  { pregunta: '¿Cubrís mi municipio?' },
  { pregunta: '¿Qué incluye la garantía de 10 años?' },
]

/** Modelos y colores con obra hecha (muestrario de la home). */
export const MODELOS_IMPRESO = ['Piedra inglesa', 'Sillería', 'Sillería grande', 'Adoquín belga', 'Manteado']
export const COLORES_OBRA = [
  'Gris medio',
  'Gris oscuro',
  'Gris muy oscuro',
  'Gris mate',
  'Marrón',
  'Crema',
  'Arena',
  'Natural',
  '107',
  '117 crema marfil',
]
