"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center bg-slate-50 px-4 py-40">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center">
          <div className="mb-8">
            <h1
              className="text-8xl font-extrabold text-blue-600 leading-none"
              aria-hidden
            >
              404
            </h1>
          </div>

          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Página no encontrada
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Lo sentimos — no pudimos encontrar la página que buscas. Tal vez la
            URL está mal escrita o la página fue movida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 px-6 py-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <ArrowLeftCircle className="w-6 h-6 text-blue-600" />
              Volver
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Home className="w-6 h-6" />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
