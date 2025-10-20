import { prisma } from '@/lib/prisma';

export const UserRepository = {
  findByCedula: (cedula: string) => {
    return prisma.user.findUnique({ where: { cedula } });
  },

  create: (data: { cedula: string; email?: string; name?: string }) => {
    return prisma.user.create({
      data: {
        cedula: data.cedula,
        email: data.email ?? "",
        name: data.name ?? data.cedula,
      },
    });
  },
};