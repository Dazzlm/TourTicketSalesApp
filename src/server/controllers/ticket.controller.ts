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
    } catch (err: any) {
      if (err instanceof AppError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  },

  list: async (filters?: { ticketId?: number; cedula?: string }) => {
  try {
    const tickets = await TicketService.list(filters);
    return NextResponse.json({data: tickets });
  } catch (err: any) {
    if (err instanceof AppError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Error interno al listar tickets" }, { status: 500 });
  }
},
};