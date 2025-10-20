import { TicketController } from "@/server/controllers/ticket.controller";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ticketIdParam = url.searchParams.get("ticketId");
  const cedula = url.searchParams.get("cedula") || undefined;

  const filters: { ticketId?: number; cedula?: string } = {};

  if (ticketIdParam) {
    const parsed = Number(ticketIdParam);
    if (!Number.isNaN(parsed)) filters.ticketId = parsed;
  }
  if (cedula) filters.cedula = cedula;

  return await TicketController.list(
    Object.keys(filters).length ? filters : undefined
  );
}