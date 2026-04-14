import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/ceramina_fria/", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      ) 
    },
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/profile.php?id=61582209081428", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 0-1-1h-3z"/></svg>
      ) 
    },
    { 
      name: "YouTube", 
      href: "https://www.youtube.com/@Ceramina-fria", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z"/><path d="m10 15 5-3-5-3z"/></svg>
      ) 
    }
  ];

  return (
    <footer className="bg-[#756C64] text-[#F8F4ED] pt-14 pb-12 border-t border-[#E6B9B3]/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif tracking-[0.2em] uppercase">Ceramina</h3>
            <p className="text-sm text-[#F8F4ED]/60 leading-relaxed max-w-xs mx-auto md:mx-0 font-light">
              Modelando historias únicas en porcelana fría desde Arica. Cada pieza es un reflejo de delicadeza y amor por lo artesanal.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFA195]">Mapa del Sitio</h4>
            <nav className="flex flex-col space-y-3 text-sm text-[#F8F4ED]/80 font-medium">
              <Link href="/productos" className="hover:text-[#FFA195] transition-colors inline-block">Colección Completa</Link>
              <Link href="/nosotros" className="hover:text-[#FFA195] transition-colors inline-block">Nuestra Esencia</Link>
              <Link href="/contacto" className="hover:text-[#FFA195] transition-colors inline-block">Habla con nosotros</Link>
            </nav>
          </div>
          <div className="space-y-6 text-center md:text-right">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFA195]">Comunidad Ceramina</h4>
            <div className="flex justify-center md:justify-end gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#F8F4ED]/5 rounded-2xl hover:bg-[#FFA195] hover:text-white transition-all duration-500 transform hover:-translate-y-1.5 border border-[#F8F4ED]/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-[#F8F4ED]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#A7B39B] font-medium text-center md:text-left">
            &copy; {currentYear} Ceramina &bull; Inspiración Artesanal en cada detalle
          </p>
          <div className="flex gap-8 text-[9px] uppercase tracking-[0.25em] text-[#A7B39B] font-medium">
            <Link href="/privacidad" className="hover:text-[#F8F4ED] transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-[#F8F4ED] transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}