import React, { useState } from "react";

type Form = {
  cedula: string;
  name: string;
  email: string;
};

type Props = {
  form: Form;
  setForm: (f: Partial<Form>) => void;
  user:
    | undefined
    | null
    | { id?: number; cedula?: string; name?: string; email?: string };
  loading: boolean;
  onSearch: () => Promise<void>;
  onCreate: () => Promise<void>;
  onPay: () => Promise<void>;
  canPay: boolean;
  onBack: () => void;
  quantity: number;
};

export default function BuyerForm({
  form,
  setForm,
  user,
  loading,
  onSearch,
  onCreate,
  onPay,
  canPay,
  onBack,
  quantity,
}: Props) {
  const [errors, setErrors] = useState<{
    cedula?: string;
    email?: string;
    name?: string;
  }>({});

  const validateCedula = (value: string) => {
    if (!value.trim()) return "La cédula es obligatoria";
    if (!/^[0-9]+$/.test(value)) return "Solo se permiten números";
    if (value.length < 7) return "Debe tener al menos 7 dígitos";
    if (value.length > 10) return "No puede tener más de 10 dígitos";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "El email es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Formato de email no válido";
    return "";
  };

  const validateName = (value: string) => {
    if (!value.trim()) return "El nombre es obligatorio";
    if (value.length < 4) return "Debe tener al menos 4 caracteres";
    if (value.length > 50) return "No puede tener más de 50 caracteres";
    return "";
  };

  const handleSearch = async () => {
    const cedulaError = validateCedula(form.cedula);
    setErrors({ cedula: cedulaError });
    if (cedulaError) return;
    await onSearch();
  };

  const handleCreate = async () => {
    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const cedulaError = validateCedula(form.cedula);
    setErrors({ name: nameError, email: emailError, cedula: cedulaError });

    if (nameError || emailError || cedulaError) return;
    await onCreate();
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Datos del comprador</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Cédula
          </label>
          <div className="flex gap-2 mt-2">
            <input
              value={form.cedula}
              onChange={(e) => {
                setForm({ cedula: e.target.value });
                if (errors.cedula) setErrors({ ...errors, cedula: "" });
              }}
              className="w-full px-3 py-2 border rounded"
              placeholder="Ej: 12345678"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer"
              disabled={loading || !form.cedula.trim()}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
          {errors.cedula && (
            <p className="text-red-600 text-sm mt-1">{errors.cedula}</p>
          )}
        </div>

        {user === null && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-sm text-yellow-800 mb-2">
              Usuario no encontrado. Completa los datos y crea usuario:
            </p>

            <label className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm({ name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className="w-full px-3 py-2 border rounded mt-1"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}

            <label className="block text-sm font-medium text-slate-700 mt-3">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) => {
                setForm({ email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className="w-full px-3 py-2 border rounded mt-1"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 hover:cursor-pointer disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear y continuar"}
              </button>
            </div>
          </div>
        )}

        {user && typeof user === "object" && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="text-sm text-green-800">
              Usuario: <strong>{user.name || user.cedula}</strong> —{" "}
              {user.email || "sin email"}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-slate-600">
            Cantidad seleccionada: <strong>{quantity}</strong>
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onPay}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer hover:bg-blue-700 transition-colors duration-200"
            disabled={!canPay}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 border rounded hover:cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    </section>
  );
}
