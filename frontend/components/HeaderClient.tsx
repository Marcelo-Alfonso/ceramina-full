'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import LogoutButton from './LogoutButton';
import { createClient } from '@/lib/supabase/browser';

export default function HeaderClient({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState(initialUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Items de navegación
  const navItems = [
    { href: '/', label: 'Inicio' },    
    { href: '/productos', label: 'Colección' },
    { href: '/cuidados', label: 'Cuidados' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  // estilos de fondo del header según el estado del menú y el scroll
  const headerBgClass = isOpen 
    ? 'bg-[#fbdce5] shadow-none' 
    : isScrolled 
      ? 'bg-white/90 backdrop-blur-md shadow-sm' 
      : 'bg-[#fbdce5] shadow-none';


  // Botón del carrito de compras
  const CartButton = () => (
    <Link 
      href="/cart" 
      className="relative p-2 text-[#000000] hover:text-[#b9918c] transition-colors group"
      onClick={closeMenu}
    >
      <ShoppingBag size={24} strokeWidth={2} />
      <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFA195] rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );

  return (
    
    <header className={`fixed top-0 w-full z-[100] ${headerBgClass} border-b border-[#f9e6ec]/60`}>
    
      <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center relative z-[110] transition-all ${
        isScrolled && !isOpen ? 'py-2' : 'py-4'
      }`}>
        {/* Seccion logo */}
        <Link href="/" className="group flex items-center space-x-3" onClick={closeMenu}>
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#E6B9B3]/50 bg-white transition-transform group-hover:rotate-12 flex items-center justify-center">
            <div className="relative w-[70%] h-[70%]">
              <Image src="/logo.png" alt="Ceramina logo" width={28} height={28} priority className="object-contain" />
            </div>
          </div>
          <span className="text-2xl font-serif text-[#000000] tracking-tighter hover:text-[#b9918c]">
            Ceramina
          </span>
        </Link>
        {/* Seccion navegación */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-serif font-[400] text-[18px] text-[#000000] hover:text-[#b9918c] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#b9918c] transition-all group-hover:w-full" />
            </Link>
          ))}

          {/* Separador */}
          <div className="h-6 w-[1px] bg-[#E6B9B3] mx-2" />

          {/* Sección de usuario */}
          <div className="flex items-center gap-2">
            <CartButton />
            {!user ? (
              <Link href="/login" className="flex font-serif items-center gap-2 text-[17px] text-[#000000] hover:text-[#b9918c] transition-colors ml-2">
                <User size={18} /> Entrar
              </Link>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link href="/dashboard" className="font-serif text-[17px] text-[#000000] hover:text-[#b9918c]">
                  Mi Cuenta
                </Link>
                <LogoutButton />
              </div>
            )}
          </div>
        </nav>
        {/* Botones del menú móvil */}
        <div className="flex lg:hidden items-center gap-2">
          <CartButton />
          <button
            className="p-2 text-[#000000] hover:bg-[#E6B9B3]/20 rounded-xl transition-colors relative z-[110]"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

     {/* Menú móvil desplegable*/}
     <div
       className={`block lg:hidden fixed inset-0 bg-[#fbdce5] z-[105] transition-opacity duration-0 ease-out ${
         isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
       }`}
     >
       <nav className={`flex flex-col p-8 space-y-6 h-full justify-center ${
         isScrolled ? 'pt-20' : 'pt-24'
       }`}>
         {navItems.map((item, index) => (
           <Link
             key={`mobile-${item.href}`}
             href={item.href}
             onClick={closeMenu}
             className={`text-3xl w-full text-center font-serif text-[#000000] transition-all duration-0 ${
               isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
             }`}
             style={{ transitionDelay: `${isOpen ? index * 30 : 0}ms` }}
           >
             {item.label}
           </Link>
         ))}
         
         <div className="pt-6 border-t border-[#E6B9B3]/20">
           {!user ? (
             <Link
               href="/login"
               onClick={closeMenu}
               className="w-full py-4 bg-[#674c35] text-white rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-[#756C64]/20"
             >
               <User size={20} />
               Iniciar Sesión
             </Link>
           ) : (
             <div onClick={closeMenu} className="space-y-4">
               <Link href="/dashboard" className="block py-4 text-center border-2 border-[#756C64] text-[#756C64] rounded-2xl font-bold">
                 Mi Panel
               </Link>
               <LogoutButton />
             </div>
           )}
         </div>
       </nav>
     </div>
    </header>
  );
}