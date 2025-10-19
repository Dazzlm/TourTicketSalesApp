import { NextResponse } from 'next/server';
import { TourService } from '../services/tour.service';
import { ImageService } from '../services/image.service';
import { AppError } from '../errors/AppError';

export const TourController = {
  async list() {
    const tours = await TourService.list();
    return NextResponse.json(tours);
  },

  async get(id: number) {
    try {
      const tour = await TourService.getById(id);
      return NextResponse.json(tour);
    } catch (err) {
      if (err instanceof AppError)
        return NextResponse.json({ error: err.message }, { status: err.status });
      return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
  },

  async create(req: Request) {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const imageUrl = file ? await ImageService.saveImage(file) : '';

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      capacity: Number(formData.get('capacity')),
      availableSpots: Number(formData.get('availableSpots')),
      imageUrl,
    };

    const newTour = await TourService.create(data);
    return NextResponse.json(newTour, { status: 201 });
  },

  async update(req: Request, id: number) {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    let imageUrl = '';
    if (file && file.size > 0) {
      imageUrl = await ImageService.saveImage(file);
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      capacity: Number(formData.get('capacity')),
      availableSpots: Number(formData.get('availableSpots')),
      ...(imageUrl ? { imageUrl } : {}),
    };

    const updated = await TourService.update(id, data);
    return NextResponse.json(updated);
 },

  async remove(id: number) {
    await TourService.delete(id);
    return NextResponse.json({ message: 'Tour eliminado' });
  },
};
