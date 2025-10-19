
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'TourTickets',
  description: 'Compra y administra tus experiencias turísticas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] text-[#1E293B] min-h-screen">
        <Navbar />
        <main className="pt-24 max-w-6xl mx-auto px-6">{children}</main>
      </body>
    </html>
  );
}
