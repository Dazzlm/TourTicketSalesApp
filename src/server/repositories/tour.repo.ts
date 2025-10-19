import { prisma } from '@/lib/prisma';
import { CrearTourDTO, UpdateTourDTO } from '../dtos/tour.dto';

export const TourRepository = {
  findAll: () => prisma.tour.findMany(),
  findById: (id: number) => prisma.tour.findUnique({ where: { id } }),
  create: (data: CrearTourDTO) => prisma.tour.create({ data }),
  update: (id: number, data: UpdateTourDTO) => prisma.tour.update({ where: { id }, data }),
  delete: (id: number) => prisma.tour.delete({ where: { id } }),
};
