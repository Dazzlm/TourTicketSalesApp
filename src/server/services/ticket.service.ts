
import { CreateTicketDto } from "../dtos/ticket.dto";
import { UserService } from "./user.service";
import { TicketRepository } from "../repositories/ticket.repo";
import { TourService } from "./tour.service";
import { AppError } from "../errors/AppError";

export type listTickets = {
  idTicker: number;
  name: string;
  cedula: string;
  tour: string;
  quantity: number;
  datePurchase: Date;
  total: number;
};

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

      const total = dto.total ?? Number((tour.price * dto.quantity).toFixed(2));

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

  list: async (filters?: { ticketId?: number; cedula?: string }): Promise<listTickets[]> => {
    const tickets = await TicketRepository.findAll(filters);
    const formatted: listTickets[] = tickets.map((t) => ({
      idTicker: t.id,
      name: t.user?.name ?? "",
      cedula: t.user?.cedula ?? "",
      tour: t.tour?.title ?? "",
      quantity: t.quantity,
      datePurchase: t.createdAt,
      total: t.total,
    }));
    return formatted;
  },
};