import { CreateTicketDto } from "../dtos/ticket.dto";
import { UserService } from "./user.service";
import { TicketRepository } from "../repositories/ticket.repo";
import { TourService } from "./tour.service";
import { AppError } from "../errors/AppError";
import type { Ticket } from "@prisma/client";

export type ListTicket = {
  idTicker: number;
  name: string;
  cedula: string;
  tour: string;
  quantity: number;
  datePurchase: Date | null;
  total: number;
};

type Filters = { ticketId?: number; cedula?: string };

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof value === "object") {
    const v = value as { toNumber?: () => number; toString?: () => string };
    if (typeof v.toNumber === "function") {
      try {
        const n = v.toNumber();
        return typeof n === "number" && Number.isFinite(n) ? n : 0;
      } catch {

      }
    }
    if (typeof v.toString === "function") {
      const n = Number(v.toString());
      return Number.isFinite(n) ? n : 0;
    }
  }
  return 0;
}

export const TicketService = {
  createTicket: async (dto: CreateTicketDto) => {
    if (!dto.tourId || !dto.quantity || !dto.cedula) {
      throw new AppError("Parámetros inválidos", 400);
    }

    const tour = await TourService.getById(dto.tourId);
    if (!tour) {
      throw new AppError("Tour no encontrado", 404);
    }

    if (tour.availableSpots < dto.quantity) {
      throw new AppError("No hay suficientes cupos disponibles", 400);
    }

    const user = await UserService.findOrCreate({
      cedula: dto.cedula,
      name: dto.name,
      email: dto.email,
    });

    const price = Number(tour.price);
    const quantity = Number(dto.quantity);
    const total = dto.total ?? Number((price * quantity).toFixed(2));

    const ticket = await TicketRepository.create({
      userId: user.id,
      tourId: tour.id,
      quantity: dto.quantity,
      total,
    });

    await TourService.update(tour.id, {
      availableSpots: tour.availableSpots - dto.quantity,
    });

    return { ticket, user };
  },

  list: async (filters?: Filters): Promise<ListTicket[]> => {
    const tickets: (Ticket & {
      user?: { name?: string; cedula?: string };
      tour?: { title?: string };
    })[] = await TicketRepository.findAll(filters);

    const formatted: ListTicket[] = tickets.map((t) => ({
      idTicker: t.id,
      name: t.user?.name ?? "",
      cedula: t.user?.cedula ?? "",
      tour: t.tour?.title ?? "",
      quantity: t.quantity,
      datePurchase: t.createdAt ?? null,
      total: toNumber(t.total),
    }));

    return formatted;
  },
};