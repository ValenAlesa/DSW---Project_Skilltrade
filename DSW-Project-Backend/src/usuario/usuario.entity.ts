import { Entity, Property, ManyToOne, OneToMany, Ref, Collection, Cascade, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';
import { Ciudad } from '../provincia/ciudad.entity.js';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  ADMINISTRADOR = 'ADMINISTRADOR'
}

@Entity()
export class Usuario extends BaseEntity {
  
  @Enum(() => RolUsuario)
  rol: RolUsuario = RolUsuario.CLIENTE;

  @Property({ nullable: false, type: 'string', unique: true })
  username!: string;

  @Property({ nullable: false, type: 'string', unique: true })
  password!: string;

  @Property({ nullable: false, type: 'string' })
  telefono!: string;

  @Property({ nullable: false, type: 'string' })
  domicilio!: string;

  @ManyToOne({ entity: () => Ciudad, nullable: false })
  ciudad!: Ref<Ciudad>;

  @OneToMany(() => Publicacion, (publicacion) => publicacion.usuario, 
    { cascade: [Cascade.ALL] })
    publicaciones = new Collection<Publicacion>(this); 

}