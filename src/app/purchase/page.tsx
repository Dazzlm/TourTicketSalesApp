"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { swal } from "@/utils/swal";
import PurchaseSummary from "@/components/PurchaseSummary";
import BuyerForm from "@/components/BuyerForm";

type Tour = {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  availableSpots: number;
  capacity?: number;
};

type Form = {
  cedula: string;
  name: string;
  email: string;
};

export default function PurchasePage() {
  const search = useSearchParams();
  const router = useRouter();

  const tourId = Number(search.get("tourId") || "");
  const quantityFromQuery = Number(search.get("quantity") || 1);

  const [tour, setTour] = useState<Tour | null>(null);
  const [fetchingTour, setFetchingTour] = useState(false);

  const [form, setFormState] = useState<Form>({
    cedula: "",
    name: "",
    email: "",
  });
  const [user, setUser] = useState<any | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [quantity] = useState(quantityFromQuery || 1);

  const setForm = (patch: Partial<Form>) =>
    setFormState((s) => ({ ...s, ...patch }));

  useEffect(() => {
    if (!tourId) return;
    const load = async () => {
      setFetchingTour(true);
      try {
        const res = await fetch(`/api/tours/${tourId}`);
        if (!res.ok) throw new Error("No se pudo obtener el tour");
        const data = await res.json();
        setTour(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingTour(false);
      }
    };
    load();
  }, [tourId]);

  const total = +(tour ? tour.price * quantity : 0).toFixed(2);

  const handleSearchUser = async () => {
    if (!form.cedula.trim()) {
      swal.info("Atención", "Ingrese la cédula");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?cedula=${encodeURIComponent(form.cedula)}`
      );
      const body = await res.json().catch(() => null);

      if (res.ok) {
        const found = body?.data ?? body?.user ?? body ?? null;
        if (found && (found.id || found.cedula || found.name)) {
          setUser(found);
          setForm({ name: found.name ?? "", email: found.email ?? "" });
          swal.success("Usuario encontrado", { timer: 900 });
        } else {
          setUser(null);
          setForm({ name: "", email: "" });
          swal.info(
            "Usuario no encontrado",
            "Puedes crear uno con nombre y email."
          );
        }
      } else if (res.status === 404) {
        setUser(null);
        setForm({ name: "", email: "" });
        swal.info(
          "Usuario no encontrado",
          "Puedes crear uno con nombre y email."
        );
      } else {
        const msg = body?.message || "Error buscando usuario";
        swal.error("Error", msg);
      }
    } catch (err) {
      swal.error("Error", "Error de red");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!form.cedula.trim() || !form.email.trim() || !form.name.trim()) {
      swal.info(
        "Atención",
        "Completa cédula, nombre y correo para crear usuario."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula: form.cedula,
          email: form.email,
          name: form.name,
        }),
      });

      const body = await res.json().catch(() => null);

      if (res.ok) {
        const created = body?.data ?? body?.user ?? body ?? null;
        if (created && (created.id || created.cedula)) {
          setUser(created);
          setForm({
            name: created.name ?? form.name,
            email: created.email ?? form.email,
          });
          swal.success("Usuario creado con éxito", { timer: 900 });
        } else {
          setUser({ cedula: form.cedula, name: form.name, email: form.email });
          swal.success("Usuario creado (respuesta inesperada del servidor).", {
            timer: 900,
          });
        }
      } else {
        const msg = body?.message || "Error creando usuario";
        swal.error("Error", msg);
      }
    } catch (err) {
      swal.error("Error", "Error de red al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!form.cedula.trim()) {
      swal.info("Atención", "Debes buscar/crear un usuario primero");
      return;
    }
    if (!tour) {
      swal.info("Atención", "Tour no disponible");
      return;
    }

    const html = `
      <p><strong>Tour:</strong> ${tour.title}</p>
      <p><strong>Cantidad:</strong> ${quantity}</p>
      <p><strong>Total:</strong> $${total.toLocaleString()}</p>
      <p><strong>Usuario:</strong> ${form.name || form.cedula} ${
      form.email ? ` — ${form.email}` : ""
    }</p>
      <p style="margin-top:.6rem;color:#6b7280;font-size:0.9rem">¿Deseas confirmar la compra por <strong>$${total.toLocaleString()}</strong>?</p>
    `;
    const confirm = await swal.confirmPurchase(html);
    if (!confirm.isConfirmed) {
      await swal.info("Compra cancelada");
      router.push("/");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = "/api/tickets/new";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          quantity,
          cedula: form.cedula,
          email: form.email,
          name: form.name,
          total,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = body?.message || "Error procesando compra";
        swal.error("Error", message);
        return;
      }

      const ticketId = body?.ticket?.id ?? null;

      if (ticketId) {
        await swal.showResultWithTicket(ticketId);
        router.push("/");
      }
    } catch (err) {
      swal.error("Error", "Error de red al pagar");
    } finally {
      setLoading(false);
    }
  };

  const canPay =
    !loading && form.cedula.trim() !== "" && user && typeof user === "object";

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          Finalizar compra
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Resumen de la compra</h2>
            <PurchaseSummary
              tour={tour}
              quantity={quantity}
              fetching={fetchingTour}
              total={total}
            />
          </section>

          <section className="bg-white rounded-2xl p-6 shadow">
            <BuyerForm
              form={form}
              setForm={setForm}
              user={user}
              loading={loading}
              onSearch={handleSearchUser}
              onCreate={handleCreateUser}
              onPay={handlePay}
              canPay={canPay}
              onBack={() => {
                if (!tourId) router.push("/");
                else router.push(`/tour/${tourId}`);
              }}
              quantity={quantity}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
