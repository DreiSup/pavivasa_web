import { aiArticulos, aiEmpresa, aiProyectos, aiServicios } from '@/lib/ai'
import { texto } from '@/lib/respuesta-texto'

export const dynamic = 'force-static'
export const dynamicParams = false

const archivos: Record<string, () => string> = {
  'empresa.md': aiEmpresa,
  'servicios.md': aiServicios,
  'proyectos.md': aiProyectos,
  'articulos.md': aiArticulos,
}

export const generateStaticParams = () => Object.keys(archivos).map((archivo) => ({ archivo }))

export async function GET(_: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params
  const generar = archivos[archivo]
  return generar ? texto(generar()) : texto('No encontrado', 404)
}
