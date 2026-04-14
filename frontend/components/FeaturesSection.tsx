import { Sparkles, Palette, Clock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: 'Hecho a Mano',
      description: 'Cada pieza de porcelana fría es modelada individualmente con cuidado artesanal.',
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      title: 'Personalizable',
      description: 'Adaptamos colores y diseños para crear piezas únicas que cuenten tu historia.',
      icon: <Palette className="w-8 h-8" />,
    },
    {
      title: 'Larga Duración',
      description: 'Utilizamos barnices y acabados de alta calidad para una belleza que perdura.',
      icon: <Clock className="w-8 h-8" />,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#FDFBF7] to-[#F8F4ED] py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-4xl md:text-5xl font-serif text-[#756C64]">
            Nuestra Esencia
          </h3>
          <div className="h-1 w-12 bg-[#FFA195] mx-auto rounded-full" />
          <p className="text-[#A7B39B] max-w-lg mx-auto font-serif font-semibold">
            Transformamos la porcelana fría en recuerdos eternos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-10 bg-white rounded-[2.5rem] border border-[#E6B9B3]/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-[#F8F4ED] text-[#FFA195] group-hover:bg-[#FFA195] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              
              <h4 className="text-xl font-serif text-[#756C64] mb-3 group-hover:text-[#FFA195] transition-colors">
                {feature.title}
              </h4>
              
              <p className="text-[#756C64]/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}