import React from "react";

type Tour = {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  availableSpots: number;
  capacity?: number;
};

type Props = {
  tour: Tour | null;
  quantity: number;
  fetching?: boolean;
  total: number;
};

export default function PurchaseSummary({
  tour,
  quantity,
  fetching,
  total,
}: Props) {
  if (fetching)
    return <p className="text-sm text-gray-500">Cargando resumen...</p>;
  if (!tour)
    return <p className="text-sm text-gray-500">Tour no disponible.</p>;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={tour.imageUrl || "/placeholder.png"}
          alt={tour.title}
          className="w-full md:w-40 h-32 object-cover rounded"
        />
        <div className="flex-1">
          <p className="font-semibold text-lg">{tour.title}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-3">
            {tour.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-gray-500">Precio</div>
              <div className="font-bold">${tour.price.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500">Cantidad</div>
              <div className="font-bold">{quantity}</div>
            </div>

            <div>
              <div className="text-gray-500">Cupos disponibles</div>
              <div
                className={`${
                  tour.availableSpots > 0 ? "text-green-600" : "text-rose-600"
                } font-medium`}
              >
                {tour.availableSpots}
              </div>
            </div>

            <div className="text-right">
              <div className="text-gray-500">Total</div>
              <div className="text-indigo-600 font-extrabold text-lg">
                ${total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded">
        <h3 className="text-sm font-medium text-gray-700">Notas</h3>
        <p className="text-sm text-gray-500 mt-2">
          Verifica los datos antes de pagar. Si no hay cupos suficientes la
          compra será rechazada.
        </p>
      </div>
    </div>
  );
}
