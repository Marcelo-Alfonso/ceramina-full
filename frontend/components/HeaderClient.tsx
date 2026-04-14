'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function HeaderClient({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const navItems = [
    { href: '/productos', label: 'Colección' },
    { href: '/cuidados', label: 'Cuidados' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const headerBgClass = isOpen 
    ? 'bg-[#F8F4ED]' 
    : isScrolled 
      ? 'bg-white/90 backdrop-blur-md shadow-sm' 
      : 'bg-[#F8F4ED]';

  const CartButton = () => (
    <Link 
      href="/cart" 
      className="relative p-2 text-[#756C64] hover:text-[#FFA195] transition-colors group"
      onClick={closeMenu}
    >
      <ShoppingBag size={24} strokeWidth={1.5} />
      <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFA195] rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${headerBgClass} border-b border-[#E6B9B3]/20`}>
      
      <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-300 relative z-[110] ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        
        <Link href="/" className="group flex items-center space-x-3" onClick={closeMenu}>
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#E6B9B3]/50 bg-white transition-transform group-hover:rotate-12 flex items-center justify-center">
            <div className="relative w-[70%] h-[70%]">
              <Image
                src="/logo.png"
                alt="Ceramina logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
          <span className="text-2xl font-serif text-[#756C64] tracking-tighter">
            Ceramina
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#756C64] hover:text-[#FFA195] transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFA195] transition-all group-hover:w-full" />
            </Link>
          ))}
          
          <div className="h-6 w-[1px] bg-[#E6B9B3]/30 mx-2" />
          
          <div className="flex items-center gap-2">
            <CartButton />

            {!user ? (
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-[#756C64] hover:text-[#A7B39B] transition-colors ml-2">
                <User size={18} /> Entrar
              </Link>
            ) : (
              <div className="flex items-center gap-4 ml-2">
                <Link href="/dashboard" className="text-sm font-bold text-[#756C64] hover:text-[#FFA195]">
                  Mi Cuenta
                </Link>
                <LogoutButton />
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CartButton />
          <button
            className="p-2 text-[#756C64] hover:bg-[#E6B9B3]/20 rounded-xl transition-colors relative z-[110]"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-[#F8F4ED] z-[105] transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <nav className={`flex flex-col p-8 space-y-6 h-full transition-all duration-300 ${
          isScrolled ? 'pt-20' : 'pt-24'
        }`}>
          {navItems.map((item, index) => (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              onClick={closeMenu}
              className={`text-3xl font-serif text-[#756C64] transition-all duration-500 ${
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
              style={{ transitionDelay: `${isOpen ? index * 100 : 0}ms` }}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-6 border-t border-[#E6B9B3]/20">
            {!user ? (
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full py-4 bg-[#756C64] text-white rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-[#756C64]/20"
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