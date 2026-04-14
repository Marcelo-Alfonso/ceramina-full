export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="bg-white text-gray-900 min-h-screen">
        {children}
      </main>
  );
}