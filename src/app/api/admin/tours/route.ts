import { TourController } from '@/server/controllers/tour.controller';

export async function GET() {
  return TourController.list();
}

export async function POST(req: Request) {
  return TourController.create(req);
}
