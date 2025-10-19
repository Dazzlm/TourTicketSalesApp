import { TourRepository } from '../repositories/tour.repo';
import { CrearTourDTO, UpdateTourDTO } from '../dtos/tour.dto';
import { AppError } from '../errors/AppError';

export const TourService = {
  async list() {
    return await TourRepository.findAll();
  },

  async getById(id: number) {
    const tour = await TourRepository.findById(id);
    if (!tour) throw new AppError('Tour no encontrado', 404);
    return tour;
  },

  async create(dto: CrearTourDTO) {
    if (dto.availableSpots > dto.capacity) {
      throw new AppError('Los cupos disponibles no pueden superar la capacidad');
    }
    return await TourRepository.create(dto);
  },

  async update(id: number, dto: UpdateTourDTO) {
    await this.getById(id); 
    return await TourRepository.update(id, dto);
  },

  async delete(id: number) {
    await this.getById(id);
    return await TourRepository.delete(id);
  },
};
