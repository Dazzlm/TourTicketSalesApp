import { CreateTicketDto } from "../dtos/ticket.dto";
import { TicketService } from "../services/ticket.service";
import { AppError } from "../errors/AppError";
import { NextResponse } from "next/server";

export const TicketController = {
  create: async (payload: CreateTicketDto) => {
    try {
      if (payload.quantity <= 0) {
        throw new AppError("La cantidad debe ser mayor a 0", 400);
      }
      const result = await TicketService.createTicket(payload);
      return NextResponse.json(result);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      const message = err instanceof Error ? err.message : "Error interno";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  list: async (filters?: { ticketId?: number; cedula?: string }) => {
    try {
      const tickets = await TicketService.list(filters);
      return NextResponse.json({ data: tickets });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return NextResponse.json({ message: err.message }, { status: err.status });
      }
      const message = err instanceof Error ? err.message : "Error interno al listar tickets";
      return NextResponse.json({ message }, { status: 500 });
    }
  },
};