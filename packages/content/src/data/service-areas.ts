import type { ServiceArea } from '../schemas/service-area.ts'

/**
 * `/zonas/<slug>/` pages (added 2026-11-15, owner's SEO order). Criteria and
 * the towns left out are in `docs/seo-zonas.md`.
 *
 * Only towns with **two or more** documented jobs. Every sentence comes from
 * those jobs' own data in `projects.ts` (model, colour, district, execution
 * specs) plus the comarca. No m², years, prices or claims about the client
 * that the source doesn't give.
 *
 * Neither area has `confirmedPhoto`, so both pages are `noindex, follow` and
 * out of the sitemap. Reason: neither town has a photo of its own jobs. The
 * Calpe projects showed `impreso-piscina-ocre.jpg` (a Moraira job) and
 * `portada.png` (a house in Carlet); the owner confirmed both on 2026-11-16
 * and they were removed. Benissa's photos are stand-ins from the shared photo
 * library. Publishing an indexable
 * "Hormigón impreso en Calpe" page on top of those would state something we
 * can't back. As soon as the owner sends (or confirms) one real photo of a
 * job in the town, set `confirmedPhoto` and the page becomes indexable, enters
 * the sitemap and gets linked from its service page — nothing else to touch.
 */
export const serviceAreas = [
  {
    slug: { es: 'calpe' },
    town: 'Calpe',
    province: 'Alicante',
    region: 'Marina Alta',
    projects: ['hormigon-impreso-calpe-2', 'hormigon-impreso-calpe'],
    services: ['hormigon-impreso'],
    heading: { es: 'Hormigón impreso en Calpe' },
    description: {
      es: 'Hormigón impreso en Calpe: sillería grande color arena con juntas cada 5×5 m y piedra inglesa en gris medio para una urbanización. Dos obras reales.',
    },
    lead: {
      es: 'En Calpe tenemos documentadas dos obras de hormigón impreso que no comparten ni molde ni color: sillería grande en arena y piedra inglesa en gris medio.',
    },
    body: [
      {
        es: 'Calpe pertenece a la Marina Alta. De los dos trabajos que hemos hecho aquí, uno conserva su ficha de ejecución completa y del otro sabemos el molde, el color y que se hizo en una urbanización.',
      },
      {
        es: 'El de la ficha completa es un pavimento exterior en sillería grande, color arena: 10 cm de hormigón HM25 con árido de 12 mm, mallazo y fibra de polipropileno, y juntas de dilatación en paños de 5×5 m.',
      },
      {
        es: 'El de la urbanización lleva molde de piedra inglesa en gris medio. Tanto el molde como el color los decidió el propietario.',
      },
      {
        es: 'Puestas una al lado de la otra, las dos obras de Calpe sirven para comparar: es la misma técnica, pero el molde y el color elegidos en cada casa dan dos suelos que no se parecen.',
      },
    ],
  },
  {
    slug: { es: 'benissa' },
    town: 'Benissa',
    province: 'Alicante',
    region: 'Marina Alta',
    projects: ['hormigon-pulido-alicante', 'hormigon-pulido-benissa', 'hormigon-impreso-benissa'],
    services: ['hormigon-pulido', 'hormigon-impreso'],
    heading: { es: 'Hormigón pulido e impreso en Benissa' },
    description: {
      es: 'Hormigón pulido e impreso en Benissa: crema 117 dentro, fuera y alrededor de la piscina de una vivienda, y adoquín belga gris oscuro sobre un desnivel.',
    },
    lead: {
      es: 'Tres obras en dos urbanizaciones de Benissa: dos de hormigón pulido en color 117 y una de hormigón impreso en adoquín belga gris oscuro.',
    },
    body: [
      {
        es: 'Benissa está en la Marina Alta. Los tres trabajos que tenemos documentados aquí son en urbanizaciones: uno en Montemar la Viña y dos en Monte Mar.',
      },
      {
        es: 'En Montemar la Viña, una vivienda unifamiliar lleva el mismo hormigón pulido en 117 crema marfil en el interior, en el exterior y en el contorno de la piscina, sin cambiar de material al cruzar la puerta.',
      },
      {
        es: 'En Monte Mar repetimos el color 117 en pulido, esta vez dejando constancia de la ejecución: mallazo, fibra de polipropileno y 4 kg de color por metro cuadrado.',
      },
      {
        es: 'La tercera obra, también en Monte Mar, es de impreso con molde de adoquín belga en gris oscuro. La parcela tenía un desnivel fuerte, que se rellenó antes de pavimentar para que el agua no se quedara estancada en algunas zonas.',
      },
    ],
  },
] as const satisfies readonly ServiceArea[]
