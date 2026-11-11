import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen, Layers } from 'lucide-react';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ConsejosPorcelana() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-25 space-y-12">
      
      {/* Encabezado de la sección */}
      <div className="text-center space-y-4">
        <span className="text-[#c54c74] font-medium tracking-widest uppercase text-sm">Primeros Pasos</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#370630]">Consejos para Trabajar Porcelana Fría</h1>
        <p className="text-[#000000] font-[400] font-serif max-w-lg mx-auto">
          ¿Estás comenzando en este hermoso mundo artesanal? Aquí tienes los mejores consejos prácticos para dar tus primeros pasos sin frustraciones.
        </p>
      </div>

      {/* Tarjeta Principal de Consejos */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#756C64]/5 border border-[#d473ad]/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Columna de los 3 Puntos Clave */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Consejo 1 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#d473ad]/10 rounded-2xl text-[#a33a79] shrink-0 mt-1">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-[#370630] text-lg">1. Evita la masa casera y usa porcelana tradicional</h3>
              <p className="text-sm text-[#370630]/80 leading-relaxed">
                Al empezar, hacer masa casera puede ser muy complicado y frustrante. Entre las opciones del mercado (tradicional, flex o soft), la <strong className="text-[#a33a79]">porcelana tradicional</strong> es la más segura y estable para ir soltando las manos.
              </p>
            </div>
          </div>

          {/* Consejo 2 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#d473ad]/10 rounded-2xl text-[#a33a79] shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-[#370630] text-lg">2. Usa un tapete o mat de silicona</h3>
              <p className="text-sm text-[#370630]/80 leading-relaxed">
                Nunca trabajes la masa directamente sobre una mesa común. Lo ideal es conseguir un tapete de corte o un mat de silicona; esto evitará que se pegue y facilitará mucho tu área de trabajo.
              </p>
            </div>
          </div>

          {/* Consejo 3 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#d473ad]/10 rounded-2xl text-[#a33a79] shrink-0 mt-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-[#370630] text-lg">3. Menos herramientas, más formas básicas</h3>
              <p className="text-sm text-[#370630]/80 leading-relaxed">
                No necesitas gastar en muchas herramientas al inicio. Practicar formas básicas (esferas, cilindros y conos) es lo más importante, ya que absolutamente todas las figuras nacen de estas estructuras simples mientras descubres si te apasiona.
              </p>
            </div>
          </div>

        </div>

        {/* Columna de Enlace a Instagram y Siguiente Ruta */}
        <div className="lg:col-span-5 bg-[#d473ad]/5 p-8 rounded-3xl border border-[#d473ad]/20 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#c54c74] text-white rounded-2xl flex items-center justify-center shadow-md">
              <InstagramIcon />
            </div>
            <div>
              <h4 className="font-serif text-2xl text-[#370630]">¿Quieres verlos en acción?</h4>
              <p className="text-xs text-[#370630]/70 mt-1">
                Hablo a detalle sobre todas estas recomendaciones en un video especial en mi cuenta de Instagram. ¡Pásate a verlo!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Botón de Instagram */}
            <a
              href="https://www.instagram.com/p/DeSL2CFJlyB/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#c54c74] hover:bg-[#a33a79] text-white font-medium text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all duration-200"
            >
    
            <InstagramIcon />
    
              <span>Ver video en Instagram</span>
            </a>

            {/* Botón hacia /cuidados */}
            <Link
              href="/cuidados"
              className="flex items-center justify-center gap-2 w-full bg-white hover:bg-[#FAF8F5] text-[#370630] border border-[#d473ad]/30 font-medium text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 text-[#a33a79]" />
              <span>Ver cómo cuidar tus piezas</span>
              <ArrowRight className="w-4 h-4 text-[#a33a79]" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}