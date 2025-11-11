import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Servicio extends BaseEntity{
  
  @Property({ type: "string", nullable: false })
  nombre!: string;
  
}
