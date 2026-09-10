import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceramina | Productos hechos a mano",
  description:
    "Descubre los productos y accesorios hechos a mano de Ceramina en Arica.",

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
    title: "Ceramina | Productos hechos a mano",
    description:
      "Descubre los productos y accesorios hechos a mano de Ceramina en Arica.",
    url: "https://ceramina.cl",
    siteName: "Ceramina",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://ceramina.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ceramina | Productos hechos a mano",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}