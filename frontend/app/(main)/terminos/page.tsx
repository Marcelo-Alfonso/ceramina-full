export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-16 pt-28">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-[#756C64]">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-[#A7B39B] italic">
            Última actualización: Abril 2026
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#E6B9B3]/20 p-8 md:p-12 space-y-10 text-[#756C64]">

          <p className="text-sm text-[#756C64]/80 leading-relaxed">
            El uso del sitio web de <strong>Ceramina</strong> implica la aceptación de los siguientes términos y condiciones. Te recomendamos leerlos detenidamente antes de realizar una compra.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">1. Identificación</h2>
            <p className="text-sm text-[#756C64]/80">
              Ceramina es un emprendimiento ubicado en Arica, Chile, dedicado a la creación y venta de productos artesanales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">2. Uso del sitio</h2>
            <p className="text-sm text-[#756C64]/80">
              El usuario se compromete a utilizar este sitio web de manera responsable, proporcionando información verídica y absteniéndose de realizar actividades ilícitas o que puedan afectar el funcionamiento del sistema.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">3. Productos</h2>
            <p className="text-sm text-[#756C64]/80">
              Cada pieza es artesanal y única, por lo que pueden existir ligeras variaciones en color, forma o detalles respecto a las imágenes mostradas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">4. Precios y pagos</h2>
            <p className="text-sm text-[#756C64]/80">
              Todos los precios están expresados en pesos chilenos (CLP). Los pagos son procesados de forma segura a través de Flow. El pedido se considera confirmado únicamente una vez aprobado el pago.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">5. Envíos y entregas</h2>
            <ul className="list-disc pl-5 text-sm space-y-2 text-[#756C64]/80">
              <li>Se ofrecen envíos dentro de Arica y opción de retiro en tienda.</li>
              <li>El costo de envío será informado durante el proceso de compra.</li>
              <li>El cliente es responsable de proporcionar una dirección correcta.</li>
              <li>Los tiempos de entrega pueden variar según condiciones externas.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">6. Responsabilidad del usuario</h2>
            <p className="text-sm text-[#756C64]/80">
              El usuario es responsable de entregar información correcta (dirección, correo y teléfono) y de estar disponible para recibir el pedido.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">7. Cambios y devoluciones</h2>
            <p className="text-sm text-[#756C64]/80">
              Debido a la naturaleza artesanal y personalizada de los productos, no se aceptan devoluciones, excepto en casos donde el producto llegue dañado. Cada caso será evaluado individualmente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">8. Uso y cuidado de los productos</h2>

            <div className="bg-[#F8F4ED] p-5 rounded-2xl text-sm text-[#756C64]/80 space-y-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>Evitar agua y humedad prolongada</li>
                <li>En joyería: quitar antes de ducha, piscina o ejercicio</li>
                <li>No exponer a sol o calor directo de forma prolongada</li>
                <li>Evitar golpes o caídas</li>
                <li>No someter a peso o presión</li>
                <li>Limpiar solo con paño seco o ligeramente húmedo</li>
                <li>Evitar químicos, perfumes o alcohol</li>
                <li>Guardar en lugar seco y fresco</li>
              </ul>
            </div>

            <p className="text-sm text-[#756C64]/80">
              Ceramina no se hace responsable por daños ocasionados por el uso inadecuado o por no seguir estas recomendaciones.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">9. Limitación de responsabilidad</h2>
            <p className="text-sm text-[#756C64]/80">
              Ceramina no se hace responsable por fallas externas al sistema, incluyendo problemas de conexión, errores en la pasarela de pago o situaciones fuera de control.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">10. Modificaciones</h2>
            <p className="text-sm text-[#756C64]/80">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">11. Legislación aplicable</h2>
            <p className="text-sm text-[#756C64]/80">
              Estos términos se rigen por las leyes de la República de Chile.
            </p>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-serif">12. Contacto</h2>
            <p className="text-sm text-[#756C64]/80">
              Para consultas sobre estos términos, puedes comunicarte a través de:
            </p>

            <a
              href="/contacto"
              className="inline-block mt-2 bg-[#756C64] hover:bg-[#5e5650] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Ir a contacto
            </a>
          </section>

        </div>
      </div>
    </div>
  )
}