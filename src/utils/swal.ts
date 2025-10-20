import Swal from "sweetalert2";

export const swal = {
  async confirmPurchase(html: string) {
    return Swal.fire({
      title: "Confirmar pago",
      html,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar y pagar",
      cancelButtonText: "Cancelar",
    });
  },

  success(message: string, options?: { timer?: number; showConfirm?: boolean }) {
    return Swal.fire({
      icon: "success",
      title: message,
      timer: options?.timer ?? 1500,
      showConfirmButton: options?.showConfirm ?? false,
    });
  },

  info(title: string, text?: string) {
    return Swal.fire({ icon: "info", title, text });
  },

  error(title: string, text?: string) {
    return Swal.fire({ icon: "error", title, text });
  },

  showResultWithTicket(ticketId: string | number | null) {
      return Swal.fire({
        title: "Pago completado",
        html: `<p>Tu pago fue procesado correctamente.</p><p>ID del ticket: <strong>${ticketId}</strong></p>`,
        icon: "success",
        timer: 2200,
        showConfirmButton: false,
      });
  },
};