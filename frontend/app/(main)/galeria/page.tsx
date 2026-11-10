"use client"
import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

// Estructura de tipo para las imágenes de la galería
interface GalleryItem {
  id: string;
  image: string;
  title: string;
}

export default function GaleriaPage() {
  // Definición de las imágenes de la galería
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      image: '/imagenes/Galeria1.webp',
      title: 'Pingus'
    },
    {
      id: '2',
      image: '/imagenes/Galeria2.webp', 
      title: 'Llavero de Sandwich'
    },
    {
      id: '3',
      image: '/imagenes/Galeria4.webp',
      title: 'Figuras de comida para escritorio'
    },
    {
      id: '4',
      image: '/imagenes/Galeria11.webp',
      title: 'Aros de galleta de jengibre'
    },
    {
      id: '5',
      image: '/imagenes/Galeria12.webp',
      title: 'Aros de regalos navideños'
    },
    {
      id: '6',
      image: '/imagenes/Galeria6.webp',
      title: 'Broches de empanadas'
    },
    {
      id: '7',
      image: '/imagenes/Galeria5.webp',
      title: 'Worry Stone de cerdito'
    },
    {
      id: '8',
      image: '/imagenes/Galeria8.webp',
      title: 'Aros de Pusheen con dona'
    },
    {
      id: '9',
      image: '/imagenes/Galeria9.webp',
      title: 'Llavero de Pochacco halloween'
    },
    {
      id: '10',
      image: '/imagenes/Galeria10.webp',
      title: 'Aros de murcielago'
    },
    {
      id: '11',
      image: '/imagenes/Galeria7.webp',
      title: 'Broches de choripan'
    },
    {
      id: '12',
      image: '/imagenes/Galeria3.webp',
      title: 'Collar trébol de cuatro hojas'
    },
  ];

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Función para abrir WhatsApp pidiendo una pieza similar
  const handleWhatsAppOrder = (itemTitle: string) => {
    const tuNumeroWhatsApp = '56986813194';
    const text = `Hola! Vi este trabajo en la galería de su web ("${itemTitle}") y me gustaría encargar uno parecido. ¿Me pueden dar más información?`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${tuNumeroWhatsApp}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto pt-26 px-6 py-16 space-y-12">
      
      {/* Encabezado */}
      <div className="text-center space-y-4">
        <span className="text-[#c54c74] font-medium tracking-widest uppercase text-sm">Nuestro Trabajo</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#370630]">Galería de Creaciones</h1>
        <p className="text-[#000000] font-[400] font-serif max-w-lg mx-auto">
          Aquí puedes explorar una recopilación de todas las piezas únicas que hemos creado a mano en porcelana fría. Haz clic en cualquiera para verla en detalle.
        </p>  
      </div>

      {/* Cuadrícula de la Galería (Solo imágenes limpias) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative bg-[#d473ad]/5 rounded-3xl overflow-hidden shadow-md border border-[#E6B9B3]/20 aspect-square cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {/* Efecto sutil al pasar el mouse por encima */}
            <div className="absolute inset-0 bg-[#370630]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-white/90 text-[#370630] text-xs font-bold px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
                Ver detalle
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Ampliada de la Imagen */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-xl w-full shadow-2xl relative border border-[#E6B9B3]/20 flex flex-col">
            
            {/* Botón Cerrar Modal */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white text-[#370630] rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagen Grande */}
            <div className="w-full h-80 sm:h-96 bg-[#d473ad]/10 overflow-hidden relative">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Contenido inferior del Modal */}
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div>
                <span className="text-xs font-bold text-[#c54c74] uppercase tracking-wider block mb-1">Pieza Exclusiva</span>
                <h3 className="text-2xl font-serif text-[#370630]">{selectedItem.title}</h3>
              </div>

              {/* Botón de WhatsApp */}
              <button 
                onClick={() => handleWhatsAppOrder(selectedItem.title)}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:bg-[#20ba5a] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Quiero uno parecido
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}