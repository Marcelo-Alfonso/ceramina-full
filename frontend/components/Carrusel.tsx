'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, Palette, BookOpen } from 'lucide-react';

interface SlideData {
  id: number;
  bgImage: string;
  badge: string;
  title: string;
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  icon: React.ReactNode;
}

const FALLBACK_IMAGE = '/ceraminalogopequeno.png';

export default function HeroCarousel({ images }: { images?: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideData[] = [
    {
      id: 1,
      bgImage: images && images[0] ? images[0] : FALLBACK_IMAGE,
      badge: 'Colección Exclusiva',
      title: 'Descubre piezas únicas hechas a mano',
      description: 'Explora nuestros productos hechos a mano con dedicación y detalles artesanales.',
      primaryBtnText: 'Ver Productos',
      primaryBtnHref: '/productos',
      secondaryBtnText: 'Destacados',
      secondaryBtnHref: '/productos_destacados',
      icon: <Sparkles className="w-6 h-6 text-[#e7c3cf]" />,
    },
    {
      id: 2,
      bgImage: images && images[1] ? images[1] : FALLBACK_IMAGE,
      badge: 'Diseños Únicos',
      title: 'Haz realidad tu idea personalizada',
      description: 'Creamos figuras y accesorios a tu medida. Revisa nuestra galería e inspírate para tu próximo pedido.',
      primaryBtnText: 'Pide el Tuyo',
      primaryBtnHref: '/contacto',
      secondaryBtnText: 'Galería',
      secondaryBtnHref: '/galeria',
      icon: <Palette className="w-6 h-6 text-[#e7c3cf]" />,
    },
    {
      id: 3,
      bgImage: images && images[2] ? images[2] : FALLBACK_IMAGE,
      badge: 'Aprende y Cuida',
      title: 'Guía y consejos para porcelana fría',
      description: 'Aprende las mejores técnicas para trabajar el material y los cuidados necesarios para preservar tus piezas.',
      primaryBtnText: 'Consejos',
      primaryBtnHref: '/cuidados',
      secondaryBtnText: 'Guía',
      secondaryBtnHref: '/cuidados#guia',
      icon: <BookOpen className="w-6 h-6 text-[#e7c3cf]" />,
    },
  ];

  // Función para avanzar a la siguiente diapositiva de forma segura
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // 1. El temporizador automático se reinicia cada vez que 'currentSlide' cambia
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    // Limpia el intervalo anterior cada vez que el usuario cambia de slide manualmente o pasa el tiempo
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide]);

  return (
    // Contenedor principal del carrusel, se puede cambiar el color destellante cambiando el bg y la altura
    <section className="relative mt-16  w-full h-[91vh] min-h-[550px] overflow-hidden bg-[#f5eae8]">
        {/* se recorre la lista de slides para ingresar las vistas */}
        {slides.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
                // Se controla la animación mediante opacidad y z-index
                <div
                key={slide.id}
                className={`flex mt-1 absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
                >
                    {/* Fondo del slider */}
                    <div className="absolute inset-0 w-full h-full">
                        {/* Se inserta la imagen de fondo*/}
                        <Image
                        src={slide.bgImage}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover object-center"
                        />
                        {/* Capa degradada para aplicar filtro */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2c221e]/90 via-[#2c221e]70 to-[#2c221e]/50" />
                    </div>
                    {/* Contenido del slider */}
                    <div className="relative z-20 max-w-7xl mx-auto h-full px-6 flex justify-center items-center">
                        {/* Animación del contenido del slider */}
                        <div
                            className={` flex flex-col items-center justify-center max-w-3xl text-white space-y-6 transition-all duration-700 ease-out transform ${
                            isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            {/* Etiqueta de caracteristica */}
                            <div className="inline-flex w-fit items-center gap-2 px-5 py-2 rounded-full bg-[#c54c74]/30 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                            {slide.icon}
                            <span>{slide.badge}</span>
                            </div>

                            {/* Título del slider */}
                            <h1 className="font-roboto ml-7 mr-7 font-[500] text-4xl sm:text-5xl text-center md:text-6xl lg:text-7xl leading-tight text-[#FAF6F0]">
                            {slide.title}
                            </h1>

                            {/* Descripción del slider */}
                            <p className="font-roboto font-[500] ml-7 mr-7 text-center text-[16px] sm:text-xl  md:text-2xl lg:text-2xl text-white/90 leading-relaxed">
                            {slide.description}
                            </p>

                            {/* Botones de acción */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                {/* Botón principal */}
                                <Link
                                    href={slide.primaryBtnHref}
                                    className="px-6 py-3.5 bg-[#c54c74]/75 hover:bg-[#c54c74]/90 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-[#2c221e]/30 flex items-center justify-center text-sm md:text-base"
                                >
                                    {slide.primaryBtnText}
                                </Link>
                                {/* Botón secundario */}
                                <Link
                                    href={slide.secondaryBtnHref}
                                    className="px-6 py-3.5 bg-[#c54c74]/30 hover:bg-[#c54c74]/40 backdrop-blur-md text-white border border-white/30 rounded-2xl font-semibold transition-colors flex items-center justify-center text-sm md:text-base"
                                >
                                    {slide.secondaryBtnText}
                                </Link>
                            </div>
                        </div>
                    </div>
            </div>
            );
        })}

        {/* Botones de navegación */}
        {/* Botón Izquierdo */}
        <button
        onClick={() => {
            prevSlide();
        }}
        aria-label="Diapositiva anterior"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 lg:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-105"
        >
        <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
        </button>

        {/* Botón Derecho */}
        <button
        onClick={() => {
            nextSlide();
        }}
        aria-label="Siguiente diapositiva"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 lg:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all hover:scale-105"
        >
        <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
        </button>

      {/* Indicadores inferiores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-[#E6B9B3]'
                : 'w-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}