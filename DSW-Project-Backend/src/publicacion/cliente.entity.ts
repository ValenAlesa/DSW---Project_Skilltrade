import { Entity, Property, ManyToOne, OneToMany, Ref, Collection, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Publicacion } from './publicacion.entity.js';
import { Ciudad } from '../provincia/ciudad.entity.js';


@Entity()
export class Cliente extends BaseEntity {
  
  @Property({ nullable: false, type: 'string' })
  mail!: string;

  @Property({ nullable: false, type: 'string' })
  password!: string;

  @Property({ nullable: false, type: 'string' })
  telefono!: string;

  @Property({ nullable: false, type: 'string' })
  domicilio!: string;

  @ManyToOne({ entity: () => Ciudad, nullable: false })
  ciudad!: Ref<Ciudad>;

  @OneToMany(() => Publicacion, (publicacion) => publicacion.cliente, 
    { cascade: [Cascade.ALL] })
    publicaciones = new Collection<Publicacion>(this); 

}