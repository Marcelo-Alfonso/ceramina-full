import Link from 'next/link';
import { Sparkles, Clock, Palette, ArrowRight } from 'lucide-react';

export default function PersonalizadosHero() {
  return (
    <section className="w-full py-12 md:py-20 bg-[#ffffff] flex justify-center flex-col items-center">

        <div className="text-center mb-10 space-y-4">
            {/* Ante titulo productos destacados */}
            <p className="text-[10px] font-bold text-[#c54c74] uppercase tracking-[0.4em]">Productos a pedido </p>
            {/* Titulo productos destacados */}
            <h3 className="text-4xl md:text-5xl font-serif text-[#370630] tracking-tight">
                Pedidos Personalizados
            </h3>
            {/* separador */}
            <div className="w-50 h-[1px] bg-[#370630] mx-auto mt-6" />
        </div>
    
      <div className="max-w-6xl mx-mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ffffff] rounded-3xl shadow-sm border border-[#c08cac71] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          
          {/* Columna de Imagen */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden bg-[#F3EFEA]">
            <img
              src="/figura_personalizada.webp" // Reemplaza por la ruta de tu imagen
              alt="Pedidos personalizados hechos a mano"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[14px] font-semibold text-[#000000] flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d473ad]" />
              <span>Hecho 100% a mano</span>
            </div>
          </div>

          {/* Columna de Contenido */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center">
            
            {/* Encabezado */}
            <div className="mb-6">

              <h2 className="text-2xl sm:text-4xl lg:text-4xl text-center font-bold text-[#370630] leading-tight">
                ¿Tienes una idea en mente? <br className="hidden sm:inline" />
                Hacemos tu pedido personalizado
              </h2>
            </div>

            <p className="text-[#000000] text-sm text-center sm:text-base mb-6 leading-relaxed">
              Transformamos tus ideas o personajes favoritos en piezas únicas. Puedes enviarnos una foto de referencia y describir los detalles que imaginas.
            </p>

            {/* Tags de Productos */}
            <div className="mb-6">
              <span className="text-xs font-medium text-[#2a0223] block mb-2.5">
                Creamos para ti:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Aros', 'Llaveros', 'Collares', 'Worry Stones', 'Charms', 'Figuritas'].map((item) => (
                  <span
                    key={item}
                    className="bg-[#d473ad]/5 text-[#000000] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#EBE7E1]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Detalles de Tiempo y Cotización */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-4 border-t border-[#F0EBE5]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#d473ad]/5 rounded-lg text-[#a33a79] shrink-0">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs lg:text-[13px] font-bold text-[#36072f] uppercase tracking-wide">
                    Cotización Rápida
                  </h4>
                  <p className="text-xs text-[#36072f] mt-0.5">
                    Evaluamos tu idea y te damos el precio justo antes de empezar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#d473ad]/5 rounded-lg text-[#a33a79] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs lg:text-[13px] font-bold text-[#36072f] uppercase tracking-wide">
                    Tiempo de Elaboración
                  </h4>
                  <p className="text-xs text-[#36072f] mt-0.5">
                    Máximo 10 días de modelado + tiempo de envío.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón para pedir pedido personalizado */}
            <div>
              <Link
                href="/personalizados"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#c54c74]/95 hover:bg-[#c54c74]/70 text-white font-medium text-sm lg:text-base text-center px-6 py-3.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>Solicitar mi pedido personalizado</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Botón para ver la galería de pedidos personalizados */}
            <div>
              <Link
                href="/galeria"
                className=" mt-3 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#627c73]/95 hover:bg-[#627c73]/70 text-white font-medium text-sm lg:text-base text-center px-6 py-3.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>Explora más ideas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}