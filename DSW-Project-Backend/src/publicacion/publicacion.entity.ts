import { Entity, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../tipoServicio/servicio.entity.js';

@Entity()
export class Publicacion extends BaseEntity {
  
  @Property({ nullable: false, type: 'string' })
  descripcion!: string;

  @Property({ nullable: false, type: 'string' })
  estado!: string;

  @Property({ nullable: false, type: 'date' })
  fechaPublicacion!: Date;
  
  @Property({ nullable: false, type: 'string' })
  titulo!: string;

  @Property({ nullable: false, type: 'decimal' })
  precio!: number;

  @ManyToOne({ entity: () => Usuario, nullable: true })
  usuario?: Ref<Usuario>;

  @ManyToOne({ entity: () => Servicio, nullable: true })
  servicio?: Ref<Servicio>;

}