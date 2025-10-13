import { Entity, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Cliente } from './cliente.entity.js';
import { Servicio } from '../tipoServicio/servicio.entity.js';

@Entity()
export class Publicacion extends BaseEntity {
  
  @Property({ nullable: false, type: 'string' })
  descripcion!: string;

  @Property({ nullable: false, type: 'string' })
  estado!: string;

  @ManyToOne({ entity: () => Cliente, nullable: false })
  cliente!: Ref<Cliente>;

  @ManyToOne({ entity: () => Servicio, nullable: false })
  servicio!: Ref<Servicio>;

}