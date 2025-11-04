export interface Publicacion {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number;
  servicio_id: number;
  fecha_publicacion?: string;
  estado?: 'Pendiente' | 'Activa' | 'Inactiva';
  usuario_id: number;
};

export interface PublicacionCreate {
  titulo: string;
  descripcion: string;
  precio: number;
  servicio_id: number;
  fecha_publicacion?: string;
  estado?: 'Pendiente' | 'Activa' | 'Inactiva';
}
