
/**
 * #F8F4ED (Blanco Porcelana) -> Fondos neutros
 * #E6B9B3 (Rosa Pastel Artesanal) -> Detalles delicados
 * #A7B39B (Verde Salvia Botánico) -> Acentos suaves
 * #756C64 (Marrón Arcilla Tostada) -> Contraste / ancla
 * #FFA195 (Rojo pastel) -> Resaltar texto
 */

import HeroCarousel from '@/components/Carrusel';
import ProductsSectionHero from '@/components/ProductsSectionHero';
import PersonalizadosHero from '@/components/PersonalizadosHero';
import SeccionConsejosYCuidadosCTA from '@/components/ConsejosHero';
import FeaturesSection from '@/components/FeaturesSection';
import Prewarm from '@/components/Prewarm';

const heroImages = [
    '/productos_carrusel.webp', // Imagen para los productos
    '/personalizado_carrusel.webp', // Imagen para la sección de pedidos personalizados
    '/nosotros.jpeg', // Imagen para la sección de consejos y guía
  ];
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f3f4] font-sans">
      <main>
        <Prewarm />
        <HeroCarousel images={heroImages}/>
        <ProductsSectionHero />
        <PersonalizadosHero />
        <SeccionConsejosYCuidadosCTA/>
        <FeaturesSection />
      </main>
    </div>
  );
}