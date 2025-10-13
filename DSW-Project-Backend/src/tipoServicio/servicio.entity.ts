import { Entity, ManyToOne, Property, Ref } from '@mikro-orm/core';
import { TipoServicio } from './tipoServicio.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Servicio extends BaseEntity{
  
  @Property({ type: "string", nullable: false })
  descripcion!: string;
  
  @ManyToOne({ entity: () => TipoServicio, nullable: false })
  tipoServicio!: Ref<TipoServicio>;
  
}