import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type Filters = { ticketId?: number; cedula?: string };

export const TicketRepository = {
  findAll: (filters?: Filters) => {

    const where: Prisma.TicketWhereInput = {};

    if (filters?.ticketId) {
      const id = Number(filters.ticketId);
      if (!Number.isNaN(id)) where.id = id;
    }

    if (filters?.cedula) {
      where.user = { cedula: filters.cedula };
    }

    return prisma.ticket.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { user: true, tour: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id: number) => prisma.ticket.findUnique({ where: { id } }),

  create: (data: { userId: number; tourId: number; quantity: number; total: number }) =>
    prisma.ticket.create({ data }),
};