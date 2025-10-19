'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type TourForm = {
  title: string;
  description: string;
  price: number;
  capacity: number;
  availableSpots: number;
  image: FileList;
};

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<TourForm>();

  const capacityValue = watch('capacity');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) {
    setPreviewUrl(null);
    return;
  }

  if (!file.type.startsWith('image/')) {

    setError('image', {
      type: 'manual',
      message: 'El archivo debe ser una imagen válida (JPEG, PNG, etc.)',
    });
    setPreviewUrl(null);
    return;
  }

  const maxSizeMB = 25;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    setError('image', {
      type: 'manual',
      message: `La imagen no puede superar los ${maxSizeMB} MB`,
    });
    setPreviewUrl(null);
    return;
  }

  clearErrors('image');
  const url = URL.createObjectURL(file);
  setPreviewUrl(url);
};

  const onSubmit = async (data: TourForm) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('capacity', String(data.capacity));
    formData.append('availableSpots', String(data.availableSpots));
    formData.append('image', data.image[0]);

    await fetch('/api/admin/tours', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);
    reset();
    setPreviewUrl(null);
    router.push('/admin/tours');
  };

  return (
    <section className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Crear Nuevo Tour
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Título</label>
          <input
            {...register('title', { required: 'El título es obligatorio' })}
            placeholder="Ej. Tour por el Guatapé"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Descripción</label>
          <textarea
            {...register('description', {
              required: 'La descripción es obligatoria',
              minLength: { value: 10, message: 'Debe tener al menos 10 caracteres' },
            })}
            placeholder="Describe brevemente el tour..."
            rows={4}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Precio</label>
          <input
            {...register('price', {
              required: 'El precio es obligatorio',
              valueAsNumber: true,
              min: { value: 1, message: 'Debe ser mayor que 0' },
            })}
            type="float"
            placeholder="Ej. 250000"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Capacidad</label>
            <input
              {...register('capacity', {
                required: 'La capacidad es obligatoria',
                valueAsNumber: true,
                min: { value: 1, message: 'Debe ser mayor que 0' },
              })}
              type="number"
              placeholder="Ej. 20"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Cupos disponibles
            </label>
            <input
              {...register('availableSpots', {
                required: 'Los cupos son obligatorios',
                valueAsNumber: true,
                min: { value: 0, message: 'Debe ser 0 o mayor' },
                validate: (value) =>
                  capacityValue === undefined ||
                  value <= capacityValue ||
                  'Los cupos no pueden superar la capacidad',
              })}
              type="number"
              placeholder="Ej. 15"
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.availableSpots && (
              <p className="text-red-500 text-sm mt-1">{errors.availableSpots.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Imagen</label>
          <input
            {...register('image', { required: 'Debes subir una imagen' })}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

          {previewUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-64 h-40 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin/tours')}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:cursor-pointer hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            type="submit"
            className={`px-6 py-2.5 rounded-lg hover:cursor-pointer font-medium text-white transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creando...' : 'Crear Tour'}
          </button>
        </div>
      </form>
    </section>
  );
}
