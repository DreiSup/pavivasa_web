'use client'

import { useSearchParams } from 'next/navigation'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'

/** Lee ?espacio= (viene de "¿Qué quieres pavimentar?") sin volver dinámica la página. */
export default function FormularioConEspacio() {
  const params = useSearchParams()
  return <FormularioPresupuesto variante="completo" espacioInicial={params.get('espacio') ?? undefined} />
}
