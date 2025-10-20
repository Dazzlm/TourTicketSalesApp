
import { TicketController } from "@/server/controllers/ticket.controller";

export async function POST(req: Request) {
    const body = await req.json();
    return await TicketController.create(body);
}