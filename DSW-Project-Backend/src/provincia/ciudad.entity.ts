import { Entity, Property, ManyToOne, Ref } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Provincia } from './provincia.entity.js';

@Entity()
export class Ciudad extends BaseEntity {
  @Property({ nullable: false, type: 'string' })
  nombre!: string;

  @ManyToOne({ entity: () => Provincia, nullable: false })
  provincia!: Ref<Provincia>;
}