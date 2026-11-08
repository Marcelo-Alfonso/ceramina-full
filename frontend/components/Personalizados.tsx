"use client"
import React, { useRef, useState } from 'react';
import { Clock, DollarSign, ShieldCheck, Send, Loader2, Upload, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function PersonalizadosPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [entregaType, setEntregaType] = useState('despacho');
  const [imageError, setImageError] = useState<string | null>(null);

  // Función para comprimir la imagen seleccionada antes de enviar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setImageError('Por favor selecciona un archivo de imagen válido.');
      e.target.value = '';
      return;
    }

    // Si pesa más de 5MB, avisamos o comprimimos fuertemente
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande (máximo 1000px de ancho/alto)
        const MAX_DIMENSION = 1000;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG comprimido con calidad 0.7 (70%)
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            
            // Verificar si quedó pesando menos de 800KB (ideal para EmailJS)
            if (blob.size > 800 * 1024) {
              setImageError('La imagen sigue siendo algo pesada, intenta con otra más ligera.');
              return;
            }

            // Opcional: Podrías reemplazar el archivo en el input o guardarlo en un estado
            console.log(`Imagen comprimida con éxito. Nuevo peso: ${(blob.size / 1024).toFixed(2)} KB`);
          },
          'image/jpeg',
          0.7 // Calidad de compresión (0.1 a 1.0)
        );
      };
    };
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);

    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        formRef.current?.reset();
        setEntregaType('despacho');
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setStatus(null), 6000);
      });
  };

  return (
    <div className="max-w-5xl mx-auto pt-26 px-6 py-16 space-y-16">
      
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <span className="text-[#A7B39B] font-medium tracking-widest uppercase text-sm">Creaciones a Medida</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#756C64]">Pedidos Personalizados</h1>
        <p className="text-[#756C64]/70 font-light italic max-w-lg mx-auto">
          ¿Tienes una idea única en porcelana fría? Cuéntanos lo que imaginas y lo hacemos realidad para ti.
        </p>
      </div>

      {/* Sección Informativa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#756C64]">
            <Clock className="w-5 h-5 text-[#D4A373]" />
          </div>
          <h3 className="font-bold text-[#4A443F]">Tiempos de Elaboración</h3>
          <p className="text-xs text-[#756C64]/80 leading-relaxed">
            Las piezas toman hasta <span className="font-bold text-[#4A443F]">10 días</span> de modelado y secado artesanal, más el tiempo de envío.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#756C64]">
            <DollarSign className="w-5 h-5 text-[#D4A373]" />
          </div>
          <h3 className="font-bold text-[#4A443F]">Costos Estimados</h3>
          <p className="text-xs text-[#756C64]/80 leading-relaxed">
            Los valores rondan entre <span className="font-bold text-[#4A443F]">$3.000 y $15.000 CLP</span>, dependiendo del tamaño y los detalles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6B9B3]/20 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#756C64]">
            <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
          </div>
          <h3 className="font-bold text-[#4A443F]">Garantía y Avances</h3>
          <p className="text-xs text-[#756C64]/80 leading-relaxed">
            Se comienza tras transferir el <span className="font-bold text-[#4A443F]">50% de garantía</span>. Enviamos avances por WhatsApp durante el proceso.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#756C64]/5 border border-[#E6B9B3]/10">
        <div className="mb-8 border-b border-[#F0EBE5] pb-4">
          <h2 className="text-2xl font-serif text-[#756C64]">Formulario de Cotización</h2>
          <p className="text-sm text-[#756C64]/70 mt-1">Completa los datos y te responderemos con el presupuesto detallado.</p>
        </div>

        <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Nombre Completo</label>
              <input required name="user_name" type="text" placeholder="Ej. Camila Soto" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Número de Celular (WhatsApp)</label>
              <input required name="user_phone" type="tel" placeholder="+56 9 1234 5678" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Tipo de Accesorio</label>
              <select required name="accessory_type" defaultValue="" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all text-[#756C64]">
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
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Tipo de Entrega</label>
              <select 
                name="delivery_type" 
                value={entregaType}
                onChange={(e) => setEntregaType(e.target.value)}
                className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all text-[#756C64]"
              >
                <option value="despacho">Despacho a domicilio</option>
                <option value="retiro">Retiro en local / presencial</option>
              </select>
            </div>
          </div>

          {entregaType === 'despacho' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Dirección de Despacho</label>
              <input required name="delivery_address" type="text" placeholder="Calle, número, depto / comuna o ciudad" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Tamaño Aproximado (Opcional)</label>
            <input name="approx_size" type="text" placeholder="Ej. 5 cm de alto, tamaño llavero estándar, etc." className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Descripción de tu Idea</label>
            <textarea required name="message" placeholder="Describe los colores, personaje, postura, expresiones o cualquier detalle que deseas que tenga tu pieza..." rows={5} className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-3xl p-6 text-sm focus:border-[#E6B9B3] outline-none transition-all resize-none" />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#D4A373]" /> Adjuntar Imagen de Referencia (Opcional)
            </label>
            <div className="bg-[#FDFBF7] border-2 border-dashed border-[#E6B9B3]/40 rounded-2xl p-6 text-center space-y-2">
              <p className="text-xs text-[#756C64]/80">
                Puedes adjuntar una foto o imagen de referencia (también puedes crearla antes con una IA como Midjourney o ChatGPT si te sirve para visualizarla).
              </p>
              <input 
                name="reference_image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="text-xs text-[#756C64] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#756C64] file:text-white hover:file:bg-[#5e5650] cursor-pointer" 
              />
              {imageError && (
                <p className="text-red-500 text-xs flex items-center justify-center gap-1 pt-2">
                  <AlertCircle className="w-3.5 h-3.5" /> {imageError}
                </p>
              )}
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#756C64] text-white py-4 rounded-2xl font-bold hover:bg-[#5e5650] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Solicitud de Cotización</>}
          </button>

          {status === 'success' && (
            <p className="text-green-600 text-center text-sm font-medium bg-green-50 py-3 rounded-xl border border-green-200">
              ¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto por WhatsApp o correo.
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-center text-sm font-medium bg-red-50 py-3 rounded-xl border border-red-200">
              Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.
            </p>
          )}
        </form>
      </div>

    </div>
  );
}