'use client';

import { useInViewAnimation } from '@/hooks/useInViewAnimation';
import Link from 'next/link';

export default function HeroSection() {
  const { ref, animate } = useInViewAnimation(false);
  const getAnimClasses = (delay: string) => {
    return `transition-all duration-1000 ease-out ${
      animate 
        ? `opacity-100 translate-y-0 ${delay}` 
        : "opacity-0 translate-y-8"
    }`;
  };

  return (
    <section 
      ref={ref} 
      className=" pt-26 pb-10 relative bg-gradient-to-b from-[#FDFBF7] via-[#F8F4ED] to-[#E2E1D5] min-h-[85vh] flex items-center justify-center text-center px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFA195]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#A7B39B]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-4xl z-10">      
        <p className={`text-[#FFA195] text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 ${getAnimClasses("delay-0")}`}>
          El Arte de la Porcelana Fría
        </p>

        <h1 className={`text-5xl sm:text-7xl font-serif text-[#756C64] mb-8 leading-[1.1] ${getAnimClasses("delay-150")}`}>
          Creaciones <span className="text-[#A7B39B] italic decoration-[#FFA195]/30">Delicadas</span><br />
          Hechas con el Corazón
        </h1>

        <p className={`text-[#756C64]/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed ${getAnimClasses("delay-300")}`}>
          En <span className="font-semibold text-[#756C64]">Ceramina</span>, cada pieza es una historia moldeada a mano en Arica, 
          capturando la belleza sutil y la esencia de lo artesanal.
        </p>

        <div className={getAnimClasses("delay-500")}>
          <Link href="/productos">
            <button className="group relative bg-[#756C64] text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl shadow-[#756C64]/20 hover:bg-[#5e5650] hover:-translate-y-1 active:scale-95">
              Explora la Colección
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};