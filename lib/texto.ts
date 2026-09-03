const PALABRAS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince']

/** "Siete obras, seis municipios": números pequeños en letra para titulares. */
export function enPalabras(n: number, femenino = true) {
  if (n < 0 || n >= PALABRAS.length) return String(n)
  if (n === 1 && !femenino) return 'un'
  return PALABRAS[n]
}

export function capitalizar(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function plural(n: number, singular: string, pluralForma: string) {
  return n === 1 ? singular : pluralForma
}
