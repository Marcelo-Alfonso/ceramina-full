import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from 'next/font/google';




export const metadata: Metadata = {
  title: "Ceramina | Productos hechos a mano con porcelana fría",
  description:
    "Descubre los productos y accesorios hechos a mano con porcelana fría de la tienda Ceramina en Arica. Con envíos a todo Chile y atención personalizada para pedidos especiales.",

  // Declaración explícita de iconos
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "Ceramina | Productos hechos a mano con porcelana fría",
    description:
      "Descubre los productos y accesorios hechos a mano con porcelana fría de la tienda Ceramina en Arica. Con envíos a todo Chile y atención personalizada para pedidos especiales.",
    url: "https://ceramina.cl",
    siteName: "Ceramina",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://ceramina.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ceramina | Tienda de figuras y accesorios hechos a mano con porcelana fría",
      },
    ],
  },
};

// Configuración de Roboto
const roboto = Roboto({
  weight: ['400', '500','600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto', // Variable CSS
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}