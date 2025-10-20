"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type TicketRow = {
  idTicker: number;
  name: string;
  cedula: string;
  tour: string;
  quantity: number;
  datePurchase: string | Date;
  total: number;
};

export default function AdminHistorialPage() {
  const router = useRouter();
  const [ticketIdFilter, setTicketIdFilter] = useState("");
  const [cedulaFilter, setCedulaFilter] = useState("");
  const [tickets, setTickets] = useState<TicketRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async (ticketId?: string, cedula?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (ticketId) params.append("ticketId", ticketId);
      if (cedula) params.append("cedula", cedula);

      const url = `/api/tickets${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url, { cache: "no-store" });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        Swal.fire("Error", body?.message || `Error ${res.status}`, "error");
        setTickets([]);
        return;
      }

      setTickets(body.data || []);
    } catch (err) {
      console.error("fetchTickets error:", err);
      Swal.fire("Error", "Error de red al obtener tickets", "error");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 sm:mb-0">
          Historial de Compras
        </h1>
        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          Volver
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-700 mb-1">ID Ticket</label>
            <input
              value={ticketIdFilter}
              onChange={(e) => setTicketIdFilter(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por ID"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-700 mb-1">Cédula</label>
            <input
              value={cedulaFilter}
              onChange={(e) => setCedulaFilter(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por cédula"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                fetchTickets(
                  ticketIdFilter.trim() || undefined,
                  cedulaFilter.trim() || undefined
                )
              }
              className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
            <button
              onClick={() => {
                setTicketIdFilter("");
                setCedulaFilter("");
                fetchTickets();
              }}
              className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer text-gray-700 font-medium px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {tickets === null ? (
        <p className="text-center py-12 text-gray-500">Cargando...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay registros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-left text-gray-700">
              <thead className="bg-blue-50 text-blue-700 uppercase text-sm sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Usuario</th>
                  <th className="px-4 py-3 font-semibold">Cédula</th>
                  <th className="px-4 py-3 font-semibold">Tour</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.idTicker}
                    className="border-t hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">{t.idTicker}</td>
                    <td className="px-4 py-3">{t.name}</td>
                    <td className="px-4 py-3">{t.cedula}</td>
                    <td className="px-4 py-3">{t.tour}</td>
                    <td className="px-4 py-3 text-right">{t.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      ${t.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(t.datePurchase).toLocaleString()}
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
