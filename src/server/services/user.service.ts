import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/user.repo";

export const UserService = {
  findByCedula: async (cedula: string) => {
    const user = await UserRepository.findByCedula(cedula);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  },

  findOrCreate: async (payload: { cedula: string; email?: string; name?: string }) => {
    const existing = await UserRepository.findByCedula(payload.cedula);
    if (existing) return existing;
    return UserRepository.create(payload);
  },
};