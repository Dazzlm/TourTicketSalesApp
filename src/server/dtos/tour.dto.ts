export interface CrearTourDTO {
  title: string;
  description: string;
  price: number;
  capacity: number;
  availableSpots: number;
  imageUrl: string;
}

export interface UpdateTourDTO extends Partial<CrearTourDTO> {}
