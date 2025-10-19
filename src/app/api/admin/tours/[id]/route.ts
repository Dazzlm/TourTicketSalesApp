import { TourController } from '@/server/controllers/tour.controller';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return TourController.get(Number(id));
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; 
  return TourController.update(req, Number(id));
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return TourController.remove(Number(id));
}
