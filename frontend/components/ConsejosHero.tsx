import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SeccionConsejosYCuidadosCTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 bg-[#f6f3f4]">
      <div className="bg-[#ffffff] p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[#756C64]/5 border border-[#d473ad]/20 space-y-10">
        
        {/* Encabezado */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[#c54c74] font-medium tracking-widest uppercase text-sm">Aprende y Cuida</span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#370630]">Todo sobre la Porcelana Fría</h2>
          <p className="text-[#000000]/80 font-serif text-sm sm:text-base">
            Descubre los mejores secretos para dar tus primeros pasos modelando y aprende cómo mantener tus accesorios y figuritas siempre impecables.
          </p>
        </div>

        {/* Tarjetas de Navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1: Consejos */}
          <div className="bg-white p-8 rounded-3xl border border-[#d473ad]/20 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#d473ad]/10 text-[#a33a79] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-[#370630]">Consejos para Empezar</h3>
                <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
                  Evita frustraciones iniciales: descubre por qué la masa tradicional es tu mejor aliada, la importancia de un buen mat de silicona y cómo dominar las formas básicas.
                </p>
              </div>
            </div>

            <Link
              href="/consejos" // O ancla hacia la sección en la misma página si prefieres (#consejos)
              className="inline-flex items-center justify-between w-full bg-[#d473ad]/10 hover:bg-[#d473ad]/20 text-[#370630] font-medium text-sm px-5 py-3.5 rounded-2xl transition-all"
            >
              <span>Ver guía para principiantes</span>
              <ArrowRight className="w-4 h-4 text-[#a33a79]" />
            </Link>
          </div>

          {/* Tarjeta 2: Cuidados */}
          <div className="bg-white p-8 rounded-3xl border border-[#d473ad]/20 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#d473ad]/10 text-[#a33a79] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-[#370630]">Cuidados de tus Piezas</h3>
                <p className="text-xs sm:text-sm text-[#000000] leading-relaxed">
                  Aprende las recomendaciones esenciales de limpieza, protección contra la humedad y cómo almacenar tus aros, llaveros o collares para que duren años como el primer día.
                </p>
              </div>
            </div>

            <Link
              href="/cuidados"
              className="inline-flex items-center justify-between w-full bg-[#d473ad]/10 hover:bg-[#d473ad]/20 text-[#370630] font-medium text-sm px-5 py-3.5 rounded-2xl transition-all"
            >
              <span>Ver recomendaciones de cuidado</span>
              <ArrowRight className="w-4 h-4 text-[#a33a79]" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}