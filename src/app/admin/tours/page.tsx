"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import LoadingSpinner from "@/components/LoadingSpinner";

type Tour = {
  id: number;
  title: string;
  price: number;
  capacity: number;
  availableSpots: number;
};

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchTours() {
    try {
      const res = await fetch("/api/admin/tours", { cache: "no-store" });
      if (!res.ok) throw new Error("Error al obtener los tours");
      const data = await res.json();
      setTours(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los tours", "error");
    }
  }

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/tours/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar");
        setTours((prev) => prev?.filter((t) => t.id !== id) || []);
        Swal.fire("Eliminado", "El tour ha sido eliminado", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar el tour", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 sm:mb-0">
          Gestión de Tours
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/tours/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            + Nuevo Tour
          </Link>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>

      {tours === null ? (
        <LoadingSpinner />
      ) : tours.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay tours disponibles aún.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[68vh] overflow-y-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-left text-gray-700">
              <thead className="bg-blue-50 text-blue-700 uppercase text-sm sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Cupos</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tours.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">{t.title}</td>
                    <td className="px-4 py-3">${t.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {t.availableSpots}/{t.capacity}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/tours/${t.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                      >
                        Editar
                      </Link>
                      <button
                        disabled={loading}
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 font-medium hover:cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
