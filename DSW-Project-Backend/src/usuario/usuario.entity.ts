import { Entity, Property, ManyToOne, OneToMany, Ref, Collection, Cascade, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Publicacion } from '../publicacion/publicacion.entity.js';
import { Ciudad } from '../provincia/ciudad.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  ADMINISTRADOR = 'ADMINISTRADOR'
}

@Entity()
export class Usuario extends BaseEntity {

  @Enum({ items: () => RolUsuario, nullable: true })
  rol?: RolUsuario;

  @Property({ nullable: false, type: 'string'})
  username!: string;

  @Property({ nullable: true, type: 'string'})
  email?: string;

  @Property({ nullable: false, type: 'string'})
  password!: string;

  @Property({ nullable: true, type: 'string'})
  telefono?: string;

  @Property({ nullable: true, type: 'string' })
  domicilio?: string;

  @ManyToOne({ entity: () => Ciudad, nullable: true })
  ciudad!: Ref<Ciudad>;

  @OneToMany(() => Publicacion, (publicacion) => publicacion.usuario, 
  { cascade: [Cascade.ALL] })
  publicaciones = new Collection<Publicacion>(this); 

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas = new Collection<Reserva>(this);

}