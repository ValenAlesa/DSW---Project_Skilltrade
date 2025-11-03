export interface ReservaCreate {
  fecha_reserva: string;
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
  precio: number;
  publicacion_id: number;
  cliente_id: number;
};

export interface ReservaModel {
  id: number;
  fecha_reserva: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  precio: number;
  publicacion_id: number;
  cliente_id: number;
  createdAt?: string;
  updatedAt?: string;
}