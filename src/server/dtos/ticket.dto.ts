export type CreateTicketDto = {
  tourId: number;
  quantity: number;
  cedula: string;
  email?: string;
  name?: string;
  total?: number;
};