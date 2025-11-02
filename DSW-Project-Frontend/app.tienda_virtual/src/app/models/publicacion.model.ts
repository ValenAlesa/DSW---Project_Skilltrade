export interface Publicacion {
  id: number;
  descripcion: string;
  estado: string;
  usuario_id: number;
  servicio_id: number;
  fecha_publicacion: Date;
  precio: number;
  titulo: string;
};
