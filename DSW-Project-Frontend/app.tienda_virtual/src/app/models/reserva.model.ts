export interface ReservaCreate {
  estado?: 'pendiente' | 'confirmada' | 'cancelada';
  precio: number;
  publicacion_id: number;
  cliente_id: number;
  notas?: string;
};

export interface ServicioInfo {
  id: number;
  nombre: string;
  emoji?: string;
}

export interface UsuarioInfo {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface PublicacionInfo {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  servicio_id: number;
  servicio?: ServicioInfo;
  fecha_publicacion?: string;
  estado?: string;
  usuario_id: number;
  usuario?: UsuarioInfo;
}

export interface ReservaModel {
  id: number;
  fecha_reserva: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  precio: number;
  publicacion_id: number;
  cliente_id: number;
  createdAt?: string;
  updatedAt?: string;
  // Populated relations
  publicacion?: PublicacionInfo;
  cliente?: UsuarioInfo;
}