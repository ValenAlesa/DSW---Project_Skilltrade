import { Entity, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Servicio } from './servicio.entity.js';

@Entity()
export class TipoServicio extends BaseEntity {
    
  @Property({ type: "string", nullable: false })
  descripcion!: string;
  
  @OneToMany(() => Servicio, (servicio) => servicio.tipoServicio, 
  { cascade: [Cascade.ALL] })
  servicios = new Collection<Servicio>(this);
}

  