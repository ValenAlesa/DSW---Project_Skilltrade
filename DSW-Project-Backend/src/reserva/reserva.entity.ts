import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core';

import { Usuario } from '../usuario/usuario.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js'; 

@Entity()
export class Reserva {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'date', nullable: false })
  fecha_reserva!: Date;

  @Property({ type: 'string', length: 20, default: 'pendiente', nullable: false })
  estado!: string;

  @Property({ columnType: 'decimal(10,2)', nullable: false })
  precio!: string;

  @Property({ type: 'text', nullable: true })
  notas?: string;

  @ManyToOne(() => Usuario, { nullable: false })
  cliente!: Rel<Usuario>;

  @ManyToOne(() => Publicacion, { nullable: false })
  publicacion!: Rel<Publicacion>;

  @Property({ onCreate: () => new Date() })
  created_at?: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at?: Date;
}
  
