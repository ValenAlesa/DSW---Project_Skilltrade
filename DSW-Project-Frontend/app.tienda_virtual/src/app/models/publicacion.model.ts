export interface Publicacion {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number;
  servicio_id: number;
  // Relacion con servicio
  servicio?: { id: number; nombre: string };
  fecha_publicacion?: string;
  estado?: 'Pendiente' | 'Activa' | 'Inactiva';
  usuario_id: number;
  // Relacion con usuario
  usuario?: { id: number; username?: string; email?: string };
};

export interface PublicacionCreate {
  titulo: string;
  descripcion: string;
  precio: number;
  servicio_id: number;
  fecha_publicacion?: string;
  estado?: 'Pendiente' | 'Activa' | 'Inactiva';
}
