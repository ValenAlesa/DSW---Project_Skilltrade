import { Entity, Property, ManyToOne, Ref, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Servicio } from '../tipoServicio/servicio.entity.js';
import { Reserva } from '../reserva/reserva.entity.js';

@Entity()
export class Publicacion extends BaseEntity {
  
  @Property({ nullable: false, type: 'string' })
  descripcion!: string;

  @Property({ nullable: false, type: 'string' })
  estado!: string;

  @Property({ nullable: false, type: 'date' })
  fecha_publicacion!: Date;
  
  @Property({ nullable: false, type: 'string' })
  titulo!: string;

  @Property({ nullable: false, type: 'decimal' })
  precio!: number;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Ref<Usuario>;

  @ManyToOne(() => Servicio, { nullable: false })
  servicio!: Ref<Servicio>;

  @OneToMany(() => Reserva, (reserva) => reserva.publicacion)
  reservas = new Collection<Reserva>(this);

}