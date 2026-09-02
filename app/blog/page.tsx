import type { Metadata } from 'next'
import ListaArticulos from '@/components/secciones/ListaArticulos'
import { articulos } from '@/lib/datos'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Sobre hormigón, sin rodeos: impreso, pulido, lavado y microcemento explicados por quien los ejecuta.',
  alternates: { canonical: '/blog/' },
}

export default function Blog() {
  return <ListaArticulos articulos={articulos} />
}
