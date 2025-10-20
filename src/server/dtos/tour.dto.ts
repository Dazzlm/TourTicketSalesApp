export interface CrearTourDTO {
  title: string;
  description: string;
  price: number;
  capacity: number;
  availableSpots: number;
  imageUrl: string;
}

export type UpdateTourDTO = Partial<CrearTourDTO>;