
/**
 * #F8F4ED (Blanco Porcelana) -> Fondos neutros
 * #E6B9B3 (Rosa Pastel Artesanal) -> Detalles delicados
 * #A7B39B (Verde Salvia Botánico) -> Acentos suaves
 * #756C64 (Marrón Arcilla Tostada) -> Contraste / ancla
 * #FFA195 (Rojo pastel) -> Resaltar texto
 */

import HeroSection from '@/components/HeroSection';
import ProductsSectionHero from '@/components/ProductsSectionHero';
import FeaturesSection from '@/components/FeaturesSection';
import Prewarm from '@/components/Prewarm';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F4ED] font-sans">
      <main>
        <Prewarm />
        <HeroSection />
        <ProductsSectionHero />
        <FeaturesSection />
      </main>
    </div>
  );
}