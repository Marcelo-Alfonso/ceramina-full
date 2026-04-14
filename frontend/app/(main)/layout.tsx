import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Ceramina",
  description: "Tienda de figuras hechas con porcelana fría",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-white text-gray-900 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
