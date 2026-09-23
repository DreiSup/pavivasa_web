import AntetituloSeccion from '@/components/ui/AntetituloSeccion'
import Seccion from '@/components/ui/Seccion'
import FormularioPresupuesto from '@/components/secciones/FormularioPresupuesto'

/**
 * §4.10 Formulario: sección con antetítulo, H2, párrafo y FormularioPresupuesto corto.
 * Servidor (sin 'use client') — el formulario es cliente.
 */
export default function SeccionFormularioHome() {
  return (
    <Seccion id="formulario" className="bg-fondo-alt" interior="flex flex-col max-w-[640px]">
      <div className="flex flex-col gap-3 md:gap-4 mb-6">
        <AntetituloSeccion>Sin compromiso</AntetituloSeccion>
        <h2 className="font-display font-bold text-34 md:text-64 leading-[1.05] md:leading-none">
          Pide tu presupuesto
        </h2>
        <p className="text-16 text-tinta-media">
          Te llamamos para concretar los detalles de tu pavimento.
        </p>
      </div>

      <FormularioPresupuesto variante="corto" />
    </Seccion>
  )
}
