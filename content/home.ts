import type { Pregunta } from '@/lib/tipos'

/** Seis espacios de "¿Qué quieres pavimentar?". Mismo orden que el desplegable del formulario. */
export const ESPACIOS = [
  { nombre: 'Entrada de garaje', foto: 'Foto · entrada de garaje · impreso' },
  { nombre: 'Porche o terraza', foto: 'Foto · terraza · impreso' },
  { nombre: 'Contorno de piscina', foto: 'Foto · contorno de piscina · piedra inglesa' },
  { nombre: 'Interior de vivienda', foto: 'Foto · interior · pulido o microcemento' },
  { nombre: 'Patio o jardín', foto: 'Foto · patio · impreso o lavado' },
  { nombre: 'Nave, parking o local', foto: 'Foto · nave · pulido' },
] as const

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
