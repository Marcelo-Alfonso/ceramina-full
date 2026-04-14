import Image from 'next/image';

export default function NosotrosPage() {
  return (
    <div className="pt-26 max-w-5xl mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <p className="text-[10px] font-bold text-[#FFA195] uppercase tracking-[0.4em]">Desde el norte de Chile</p>
        <h1 className="text-4xl md:text-6xl font-serif text-[#756C64]">Nuestra Esencia</h1>
      </header>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-[#E6B9B3]/30 shadow-xl">
          <Image 
            src="/nosotros.jpeg" 
            alt="Nosotros" 
            fill 
            className="object-cover scale-75 opacity-90"
          />
        </div>
        <div className="space-y-6 text-[#756C64]">
          <h2 className="text-2xl font-serif italic">Modelando historias únicas</h2>
          <p className="leading-relaxed font-light">
            Ceramina nació en <strong>Arica</strong> como un espacio de calma y creatividad. Nos especializamos en el arte de la 
            <strong> porcelana fría</strong>, creando piezas que capturan momentos, emociones y la delicadeza de lo hecho a mano.
          </p>
          <p className="leading-relaxed font-light">
            Cada figura, desde nuestros icónicos girasoles hasta las piezas personalizadas, es modelada individualmente, 
            asegurando que no existan dos iguales en el mundo.
          </p>
          <div className="pt-4">
            <span className="px-6 py-2 bg-[#A7B39B]/10 text-[#A7B39B] rounded-full text-xs font-bold uppercase tracking-widest border border-[#A7B39B]/20">
              100% Artesanal
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}