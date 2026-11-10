"use client"
import React, { useState } from 'react';
import { Clock, DollarSign, ShieldCheck, Send, Upload, AlertCircle, MessageCircle } from 'lucide-react';

export default function PersonalizadosPage() {
  const [entregaType, setEntregaType] = useState('despacho');
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string | null>(null);

  // Función para validar la imagen (puedes avisarle al usuario que la foto se enviará directo en el chat)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewImageName(null);
      return;
    }

    setImageError(null);

    if (!file.type.startsWith('image/')) {
      setImageError('Por favor selecciona un archivo de imagen válido.');
      e.target.value = '';
      setPreviewImageName(null);
      return;
    }

    setPreviewImageName(file.name);
  };



  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const name = formData.get('user_name') as string;
      const phone = formData.get('user_phone') as string;
      const accessory = formData.get('accessory_type') as string;
      const deliveryType = formData.get('delivery_type') as string;
      const address = formData.get('delivery_address') as string;
      const approxSize = formData.get('approx_size') as string;
      const message = formData.get('message') as string;

      const deliveryText = deliveryType === 'despacho' 
        ? `Despacho a domicilio (${address || 'No especificada'})` 
        : 'Retiro en Agustín Edwards 1961, Arica';

      // Creamos el texto de manera limpia
      const text = [
        "*Nueva Solicitud de Pedido Personalizado*",
        "",
        `*Nombre:* ${name}`,
        `*Celular:* ${phone}`,
        `*Accesorio:* ${accessory}`,
        `*Entrega:* ${deliveryText}`,
        `*Tamaño aprox:* ${approxSize || 'No especificado'}`,
        "",
        "*Descripcion de la idea:*",
        message
      ].filter(Boolean).join("\n");

      const tuNumeroWhatsApp = '56986813194';

      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${tuNumeroWhatsApp}?text=${encodedText}`, '_blank');
    };

  return (
    <div className="max-w-5xl mx-auto pt-26 px-6 py-16 space-y-16">
      
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <span className="text-[#c54c74] font-medium tracking-widest uppercase text-sm">Creaciones a Medida</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#370630]">Pedidos Personalizados</h1>
        <p className="text-[#000000] font-[400] font-serif max-w-lg mx-auto">
          ¿Tienes una idea única en porcelana fría? Cuéntanos lo que imaginas y lo hacemos realidad para ti.
        </p>
      </div>

      {/* Sección Informativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-[#d473ad]/5 rounded-2xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#a33a79]" />
          </div>
          <h3 className="font-bold text-[16px] text-[#370630]">Tiempos de Elaboración</h3>
          <p className="text-xs text-[#370630]/80 leading-relaxed">
            Las piezas toman hasta <span className="font-bold text-[#370630]">10 días</span> de modelado y secado artesanal, más el tiempo de envío.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-[#d473ad]/5 rounded-2xl flex items-center justify-center text-[#756C64]">
            <DollarSign className="w-5 h-5 text-[#a33a79]" />
          </div>
          <h3 className="font-bold text-[16px] text-[#370630]">Costos Estimados</h3>
          <p className="text-xs text-[#370630]/80 leading-relaxed">
            Los valores rondan entre <span className="font-bold text-[#370630]">$3.000 y $15.000 CLP</span>, dependiendo del tamaño y los detalles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-[#d473ad]/5 rounded-2xl flex items-center justify-center text-[#756C64]">
            <ShieldCheck className="w-5 h-5 text-[#a33a79]" />
          </div>
          <h3 className="font-bold text-[16px] text-[#370630]">Garantía y Avances</h3>
          <p className="text-xs text-[#370630]/80 leading-relaxed">
            Se comienza tras transferir el <span className="font-bold text-[#370630]">50% de garantía</span>. Enviamos avances por WhatsApp durante el proceso.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#756C64]/5 border border-[#E6B9B3]/10">
        <div className="mb-8 border-b text-center border-[#F0EBE5] pb-4">
          <h2 className="text-3xl lg:text-5xl font-serif text-[#370630]">Formulario de Cotización</h2>
          <p className="text-base text-[#370630]/70 mt-1">Completa los datos y se abrirá WhatsApp con tu cotización lista para enviar.</p>
        </div>

        <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Nombre Completo</label>
              <input required name="user_name" type="text" placeholder="Ej. María González" className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Número de Celular (WhatsApp)</label>
              <input required name="user_phone" type="tel" placeholder="+56 9 1234 5678" className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Tipo de Accesorio</label>
              <select required name="accessory_type" defaultValue="" className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all">
                <option value="" disabled>Selecciona una opción</option>
                <option value="Aros">Aros</option>
                <option value="Llaveros">Llaveros</option>
                <option value="Collares">Collares</option>
                <option value="Worry Stones">Worry Stones</option>
                <option value="Charms">Charms</option>
                <option value="Figuritas">Figuritas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Tipo de Entrega</label>
              <select 
                name="delivery_type" 
                value={entregaType}
                onChange={(e) => setEntregaType(e.target.value)}
                className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all"
              >
                <option value="despacho">Despacho a domicilio</option>
                <option value="retiro">Retiro en Agustín Edwards 1961, Arica</option>
              </select>
            </div>
          </div>

          {entregaType === 'despacho' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Dirección de Despacho</label>
              <input required name="delivery_address" type="text" placeholder="Calle, número, depto / comuna o ciudad" className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Tamaño Aproximado (Opcional)</label>
            <input name="approx_size" type="text" placeholder="Ej. 5 cm de alto, tamaño llavero estándar, etc." className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#a33a79] outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#370630]/70 ml-2 uppercase">Descripción de tu Idea</label>
            <textarea required name="message" placeholder="Describe los colores, personaje, postura, expresiones o cualquier detalle que deseas que tenga tu pieza..." rows={5} className="w-full bg-[#d473ad]/5 text-[#000000] border-2 border-transparent rounded-3xl p-6 text-sm focus:border-[#a33a79] outline-none transition-all resize-none" />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#25D366] text-[14px] lg:text-[16px] text-white py-4 rounded-2xl font-bold hover:bg-[#20ba5a] transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <MessageCircle className="w-5 h-5" /> Enviar Pedido por WhatsApp
          </button>
        </form>
      </div>

    </div>
  );
}