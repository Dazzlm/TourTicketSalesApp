"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Tour = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  capacity?: number;
  availableSpots: number;
};

export default function TourDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${id}`);
        if (!res.ok) throw new Error("Tour no encontrado");
        const data = await res.json();
        setTour(data);
        setQuantity(data.availableSpots > 0 ? 1 : 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!id) return <p className="text-center mt-10">ID inválido</p>;
  if (!tour) return <p className="text-center mt-10">Tour no encontrado</p>;

  const total = +(tour.price * quantity).toFixed(2);

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch min-h-[22rem]">
          <div className="md:w-1/2 w-full">
            <img
              src={tour.imageUrl}
              alt={tour.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{tour.title}</h2>
              <p className="text-gray-600 mb-4">{tour.description}</p>

              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className="text-lg font-semibold text-blue-700">
                    ${tour.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Precio por persona</p>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-green-300" />
                    <span className="font-medium">{tour.capacity ?? "—"}</span>
                    <span className="text-gray-500">capacidad</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium">{tour.availableSpots}</span>
                    <span className="text-gray-500">cupos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <label className="font-medium text-sm text-gray-700">
                Cantidad:
              </label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  aria-label="disminuir"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-blue-600 text-xl font-semibold hover:bg-blue-50 transition hover:cursor-pointer"
                >
                  −
                </button>

                <input
                  type="number"
                  min={1}
                  max={tour.availableSpots}
                  value={quantity}
                  onChange={(e) => {
                    const val = Math.max(
                      1,
                      Math.min(tour.availableSpots, Number(e.target.value) || 1)
                    );
                    setQuantity(val);
                  }}
                  className="w-20 text-center rounded-lg border border-gray-300 px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <button
                  aria-label="aumentar"
                  onClick={() =>
                    setQuantity((q) => Math.min(tour.availableSpots, q + 1))
                  }
                  className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-blue-600 text-xl font-semibold hover:bg-blue-50 transition hover:cursor-pointer"
                >
                  +
                </button>

                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-bold text-blue-700">
                    ${total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition flex-1 hover:cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/purchase?tourId=${tour.id}&quantity=${quantity}`
                    )
                  }
                >
                  Comprar
                </button>

                <button
                  className="px-5 py-2 border rounded bg-white hover:bg-gray-50 hover:cursor-pointer "
                  onClick={() => router.push("/")}
                >
                  Volver
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                <strong>Consejo:</strong> revisa la cantidad antes de confirmar.
                Si el tour se agota mientras realizas el proceso, el sistema
                validará los cupos al crear el tiquete.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900">Qué incluye</h3>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span> Transporte
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span> Guía experto
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span> Snacks y agua
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span> Seguro básico
          </li>
        </ul>

        <p className="mt-4 text-sm text-gray-500">
          Información adicional: los horarios y puntos de encuentro pueden
          variar. La confirmación final llegará al correo una vez se procese la
          compra.
        </p>
      </div>
    </section>
  );
}
