"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

type Tour = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  availableSpots: number;
};

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/admin/tours");
        if (!res.ok) throw new Error("Error al obtener tours");
        const data = await res.json();
        setTours(
          Array.isArray(data)
            ? data.filter((t: Tour) => t.availableSpots > 0)
            : []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section className="py-16 bg-gray-50 ">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Descubre y reserva tus tours favoritos 🌍
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Encuentra experiencias únicas y vive nuevas aventuras con{" "}
          <span className="font-semibold text-blue-700">TourTickets</span>.
          Compra fácilmente tus tiquetes para destinos increíbles.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tours.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 text-lg">
          No hay tours disponibles actualmente.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-1">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col"
              onClick={() => router.push(`/tour/${tour.id}`)}
            >
              <div className="relative w-full h-52 overflow-hidden">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow p-5">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {tour.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {tour.description}
                  </p>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-lg font-bold text-blue-700">
                    ${tour.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cupos disponibles:{" "}
                    <span className="font-medium text-gray-700">
                      {tour.availableSpots}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
