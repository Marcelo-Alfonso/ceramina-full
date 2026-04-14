"use client"
import React, { useRef, useState } from 'react';
import { Mail, MapPin, Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ContactoPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
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
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => setStatus(null), 5000);
      });
  };

  return (
    <div className="max-w-5xl mx-auto pt-26 px-6 py-16 space-y-16">
      <div className="text-center space-y-4">
        <span className="text-[#A7B39B] font-medium tracking-widest uppercase text-sm">Hablemos</span>
        <h1 className="text-5xl font-serif text-[#756C64]">Contacto</h1>
        <p className="text-[#756C64]/70 font-light italic max-w-md mx-auto">
          ¿Tienes una idea para una pieza única o alguna duda sobre el proceso?
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-4">
          <ContactCard 
            href="https://instagram.com/ceramina_fria"
            icon={<InstagramIcon />}
            label="Instagram"
            value="@ceramina_fria"
            color="bg-pink-50"
          />
          <ContactCard 
            href="mailto:ceraminafria@gmail.com"
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value="ceraminafria@gmail.com"
            color="bg-blue-50"
          />
          <div className="p-6 bg-white rounded-3xl border border-[#E6B9B3]/20 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-orange-50 rounded-2xl text-[#756C64]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#756C64]/50 uppercase font-bold tracking-wider">Ubicación</p>
              <p className="text-[#756C64] font-medium">Agustín Edwards 1961. Arica, Chile</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <form 
            ref={formRef} 
            onSubmit={sendEmail}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-[#756C64]/5 border border-[#E6B9B3]/10 space-y-6 relative overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Nombre</label>
                <input required name="user_name" type="text" placeholder="Ej. María García" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Email</label>
                <input required name="user_email" type="email" placeholder="tu@email.com" className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-2xl p-4 text-sm focus:border-[#E6B9B3] outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#756C64]/60 ml-2 uppercase">Mensaje</label>
              <textarea required name="message" placeholder="¿En qué puedo ayudarte?" rows={5} className="w-full bg-[#FDFBF7] border-2 border-transparent rounded-3xl p-6 text-sm focus:border-[#E6B9B3] outline-none transition-all resize-none" />
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#756C64] text-white py-4 rounded-2xl font-bold hover:bg-[#5e5650] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Enviar Mensaje</>}
            </button>

            {status === 'success' && <p className="text-green-600 text-center text-sm font-medium">¡Enviado con éxito!</p>}
            {status === 'error' && <p className="text-red-500 text-center text-sm font-medium">Error al enviar. Intenta de nuevo.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

interface ContactCardProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function ContactCard({ href, icon, label, value, color }: ContactCardProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group p-6 bg-white rounded-3xl border border-[#E6B9B3]/20 flex items-center gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className={`p-3 rounded-2xl text-[#756C64] transition-colors ${color} group-hover:bg-[#756C64] group-hover:text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#756C64]/50 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-[#756C64] font-medium">{value}</p>
      </div>
    </a>
  );
}