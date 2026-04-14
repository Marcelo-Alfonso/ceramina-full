import React from 'react';
import { 
  Droplets, 
  Sparkles, 
  Sun, 
  Hammer, 
  MousePointer2, 
  Wind, 
  FlaskConical, 
  Box 
} from 'lucide-react';

const CUIDADOS = [
  {
    title: "Evitar agua y humedad",
    desc: "La porcelana fría no es resistente al agua. La exposición prolongada puede deteriorar o deformar la pieza.",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    title: "Uso en joyería",
    desc: "Retira tus accesorios antes de ducharte, entrar a la piscina o hacer ejercicio para evitar el sudor y el agua.",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Evitar calor y sol directo",
    desc: "El sol intenso puede resecar, decolorar o deformar la pieza con el tiempo. Mantenla en la sombra.",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    title: "Evitar golpes o caídas",
    desc: "Aunque son firmes, son piezas delicadas. Manipúlalas con amor y evita impactos fuertes.",
    icon: <Hammer className="w-5 h-5" />,
  },
  {
    title: "No aplicar presión",
    desc: "No sometas las piezas a peso excesivo en bolsos o cajas, ya que podrían quebrarse.",
    icon: <MousePointer2 className="w-5 h-5" />,
  },
  {
    title: "Limpieza adecuada",
    desc: "Usa únicamente un paño seco o ligeramente húmedo. Nunca sumerjas la pieza en líquidos.",
    icon: <Wind className="w-5 h-5" />,
  },
  {
    title: "Evitar químicos",
    desc: "Perfumes, alcohol y cremas pueden dañar irreparablemente el acabado y los colores.",
    icon: <FlaskConical className="w-5 h-5" />,
  },
  {
    title: "Almacenamiento",
    desc: "Guarda tus piezas en un lugar seco, fresco y protegido del polvo para que duren años.",
    icon: <Box className="w-5 h-5" />,
  },
];

export default function CuidadosPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFA] text-[#756C64] selection:bg-[#E6B9B3]/30">
      <div className="max-w-5xl mx-auto pt-28 px-6 py-16">
        
        {/* Header con diseño más aireado */}
        <header className="text-center space-y-6 mb-20">
          <div className="inline-block px-3 py-1 border border-[#E6B9B3] rounded-full text-[10px] uppercase tracking-widest mb-2">
            Guía de mantenimiento
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#5A524C]">
            Cuidados de las piezas
          </h1>
          <p className="max-w-xl mx-auto text-[#756C64]/70 italic font-light leading-relaxed">
            Cada pieza es modelada a mano con dedicación. 
            Sigue estos consejos para que tu tesoro artesanal perdure en el tiempo.
          </p>
        </header>

        {/* Grid de Cuidados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {CUIDADOS.map((item, index) => (
            <div 
              key={index}
              className="group relative bg-white p-8 rounded-2xl border border-[#E6B9B3]/10 shadow-[0_4px_20px_-4px_rgba(230,185,179,0.2)] hover:shadow-[0_10px_30px_-10px_rgba(230,185,179,0.4)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                {/* Icon Container */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FDF8F7] border border-[#E6B9B3]/30 flex items-center justify-center text-[#E6B9B3] group-hover:bg-[#E6B9B3] group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-serif text-xl text-[#5A524C]">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#756C64]/80">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Nota final */}
        <footer className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white border border-[#E6B9B3]/20 shadow-sm">
            <span className="text-sm italic">
              Siguiendo estos pasos, tus piezas lucirán como el primer día 
            </span>
            <span className="text-[#E6B9B3] animate-pulse">💛</span>
          </div>
        </footer>
      </div>
    </div>
  );
}