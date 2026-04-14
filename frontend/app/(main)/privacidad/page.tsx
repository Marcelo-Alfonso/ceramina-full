export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-16 pt-28">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-[#756C64]">
            Política de Privacidad
          </h1>
          <p className="text-sm text-[#A7B39B] italic">
            Última actualización: Abril 2026
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#E6B9B3]/20 p-8 md:p-12 space-y-10 text-[#756C64]">

          <p className="text-sm leading-relaxed text-[#756C64]/80">
            En <strong>Ceramina</strong>, nos comprometemos a proteger la privacidad de nuestros usuarios y garantizar el correcto tratamiento de sus datos personales conforme a la legislación chilena vigente.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">1. Datos que recopilamos</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#756C64]/80">
              <li>Correo electrónico</li>
              <li>Dirección de envío</li>
              <li>Número de teléfono</li>
              <li>Datos de autenticación (contraseñas encriptadas)</li>
            </ul>
            <div className="bg-[#F8F4ED] p-4 rounded-xl text-xs text-[#756C64]/70">
              🔒 Las contraseñas son almacenadas de forma segura mediante procesos de encriptación.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">2. Finalidad del uso de los datos</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#756C64]/80">
              <li>Procesar y gestionar compras</li>
              <li>Enviar confirmaciones y notificaciones de pago</li>
              <li>Coordinar la entrega o retiro de productos</li>
              <li>Permitir el acceso a cuentas de usuario</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">3. Inicio de sesión con terceros</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Si el usuario inicia sesión mediante Google, se obtiene información básica como el correo electrónico, utilizada exclusivamente para autenticación. Este correo puede ser compartido con la pasarela de pago para el envío de comprobantes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">4. Procesamiento de pagos</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Los pagos son procesados de forma segura a través de plataformas externas. No almacenamos información financiera sensible. La comunicación se realiza mediante sistemas protegidos con claves privadas (API Keys).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">5. Almacenamiento local</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Utilizamos almacenamiento local del navegador para guardar productos en el carrito y generar identificadores únicos que previenen duplicación de transacciones. Estos datos no contienen información sensible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">6. Eliminación de datos</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Puedes solicitar la eliminación de tus datos personales en cualquier momento a través del formulario de contacto. Se eliminará toda la información asociada, salvo aquella necesaria por obligaciones legales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">7. Seguridad de la información</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Implementamos medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o alteración.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif">8. Cambios en esta política</h2>
            <p className="text-sm text-[#756C64]/80 leading-relaxed">
              Esta política puede actualizarse en cualquier momento. Recomendamos revisarla periódicamente.
            </p>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-serif">9. Contacto</h2>
            <p className="text-sm text-[#756C64]/80">
              Si tienes dudas sobre esta política o el uso de tus datos:
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