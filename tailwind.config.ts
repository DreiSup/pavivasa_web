import type { Config } from 'tailwindcss'

/**
 * Pavivasa — tokens de diseño.
 * Los NOMBRES de los tokens los usan todos los componentes: no cambiarlos.
 * Valores del sistema visual de Pavivasa (Claude Design, sept. 2026):
 * paleta fría gris-verde, acento "pigmento" óxido de hierro, secundario "acero".
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx,mdx}'],
  theme: {
    // Se reemplaza la paleta por defecto de Tailwind: solo existen estos colores.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      fondo: '#EDEFEC',
      'fondo-alt': '#DCE0DB',
      tinta: '#141A18',
      'tinta-media': '#5A645F',
      pigmento: '#B2462A',
      'pigmento-hover': '#8F3620',
      acero: '#45606E',
      'sobre-tinta': '#F2F4F0',
      error: '#C4161C',
    },
    borderRadius: { none: '0', DEFAULT: '0' },
    boxShadow: {
      none: 'none',
      // La única sombra del sitio: barra fija de móvil
      barra: '0 -6px 20px rgba(20,26,24,0.18)',
    },
    fontFamily: {
      display: ['var(--font-display)', 'Impact', 'system-ui', 'sans-serif'],
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      // Datos (monoespaciada, siempre en versalitas). 10 es el suelo absoluto.
      'd-10': ['10px', { lineHeight: '1.6', letterSpacing: '0.1em' }],
      'd-12': ['12px', { lineHeight: '1.6', letterSpacing: '0.08em' }],
      'd-14': ['14px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      // Texto
      12: ['12px', { lineHeight: '1.5' }],
      14: ['14px', { lineHeight: '1.5' }],
      16: ['16px', { lineHeight: '1.55' }],
      20: ['20px', { lineHeight: '1.45' }],
      // Display (Big Shoulders Display, sin tracking)
      26: ['26px', { lineHeight: '1.15' }],
      34: ['34px', { lineHeight: '1.1' }],
      46: ['46px', { lineHeight: '1.02' }],
      64: ['64px', { lineHeight: '1' }],
      88: ['88px', { lineHeight: '0.95' }],
    },
    extend: {
      minHeight: { tactil: '44px', campo: '48px', boton: '48px' },
      spacing: {
        'lat-movil': '20px',
        'lat-desktop': '48px',
        cabecera: '72px',
        'cabecera-scroll': '56px',
        'cabecera-movil': '60px',
        'barra-movil': '64px',
      },
      maxWidth: { lectura: '680px', contenido: '1344px' },
      transitionDuration: { cabecera: '150ms' },
      backgroundImage: {
        // Trama diagonal de BloquePosicion (toda foto que aún no existe)
        trama: 'repeating-linear-gradient(135deg, rgba(20,26,24,0.09) 0 1px, transparent 1px 14px)',
        'trama-suave': 'repeating-linear-gradient(135deg, rgba(20,26,24,0.06) 0 1px, transparent 1px 14px)',
        'trama-clara': 'repeating-linear-gradient(135deg, rgba(20,26,24,0.10) 0 1px, transparent 1px 12px)',
      },
      aspectRatio: { '21/9': '21 / 9', '16/7': '16 / 7' },
    },
  },
  plugins: [],
}

export default config
