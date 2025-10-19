
import { TourController } from '@/server/controllers/tour.controller';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return TourController.get(Number(id));
}