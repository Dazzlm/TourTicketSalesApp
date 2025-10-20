import Link from "next/link";
import { Ticket, History } from "lucide-react";

export default function AdminPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Panel Administrativo
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Gestiona los tours disponibles y revisa el historial de compras desde
          este panel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link
          href="/admin/tours"
          className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
        >
          <div className="bg-blue-50 text-blue-600 rounded-full p-4 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Ticket size={42} />
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
            Gestionar Tours
          </h2>
          <p className="text-gray-500 text-sm max-w-[220px]">
            Crea, edita y elimina los tours disponibles para los usuarios.
          </p>
        </Link>
        <Link
          href="/admin/history"
          className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300"
        >
          <div className="bg-green-50 text-green-600 rounded-full p-4 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
            <History size={42} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Historial de Compras</h2>
          <p className="text-gray-400 text-sm">
            Consulta el historial de compras de los usuarios.
          </p>
        </Link>
      </div>
    </section>
  );
}
