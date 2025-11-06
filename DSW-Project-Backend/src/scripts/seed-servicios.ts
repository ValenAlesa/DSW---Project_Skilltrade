import 'reflect-metadata';
import { orm } from '../shared/db/orm.js';
import { Servicio } from '../tipoServicio/servicio.entity.js';

async function main() {
  const em = orm.em.fork();
  const nombres = [
    'Limpieza',
    'Plomería',
    'Electricidad',
    'Jardinería',
    'Pintura',
    'Carpintería',
    'Albañilería',
    'Tecnología'
  ];

  for (const nombre of nombres) {
    const exists = await em.findOne(Servicio, { nombre });
    if (!exists) {
      const s = em.create(Servicio, { nombre });
      em.persist(s);
      console.log(`[seed-servicios] Creado servicio: ${nombre}`);
    } else {
      console.log(`[seed-servicios] Ya existe: ${nombre}`);
    }
  }
  await em.flush();
  console.log('[seed-servicios] Finalizado.');
  process.exit(0);
}

main().catch(err => {
  console.error('[seed-servicios] Error:', err);
  process.exit(1);
});
