import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Publicacion } from "./publicacion.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Servicio } from "../tipoServicio/servicio.entity.js";

const em = orm.em

function parseDateDMYYorISO(v?: string): Date | undefined {
  if(!v) return undefined;
  if(/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return new Date(v + 'T00:00:00Z');
  }
  const m = v.match (/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if(m) {
    const day = parseInt(m[1]);
    const month = parseInt(m[2]) - 1;
    const year = parseInt(m[3]);
    return new Date(Date.UTC(year, month, day));
  }
  return undefined;
}

function parseLocalDay(v?: string): Date | undefined {
  if (!v) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split('-').map(Number);
    return new Date(y, (m as number) - 1, d as number, 12, 0, 0, 0);
  }
  const m = v.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (m) {
    const day = parseInt(m[1]);
    const month = parseInt(m[2]) - 1;
    const year = parseInt(m[3]);
    return new Date(year, month, day, 12, 0, 0, 0);
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}


async function findAll(req: Request, res: Response) {
  try {

  const rawFrom = req.query.from as string | undefined;
  const rawTo = req.query.to as string | undefined;

  // Parse date-only strings using LOCAL time, to avoid UTC shift issues
  const from = parseLocalDay(rawFrom);
  const to = parseLocalDay(rawTo);

    const em = orm.em.fork();
    
    const where : any = {};

    if(from || to) {
    const rango: any = {};

    if(from) {
      from.setHours(0,0,0,0);
      rango.$gte = from;
    }
    if(to) {
      to.setHours(23,59,59,999);
      rango.$lte = to;
    }
    where.fecha_publicacion = rango;
  }
    const publicaciones = await em.find(
      Publicacion,
      where,
      {
        orderBy: { fecha_publicacion: 'DESC' },
        populate: ['servicio'], // include servicio so frontend has the service name
      }
    );
    res.status(200).json({ message: "Publicaciones obtenidas", data: publicaciones });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener Publicaciones", error: error.message });
  }
} 

async function findOne(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
  const publicacion = await em.findOne( Publicacion, { id }, { populate: ['servicio'] } );
    res.status(200).json({ message: "Publicacion obtenida", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener Publicacion", error: error.message });
  }
}

async function create(req: Request, res: Response) {
  try {
    console.log('[create] user:', req.user);
    console.log('[create] body:', req.body);
    
    const userId = req.user?.id;
    const {
      titulo, 
      descripcion, 
      precio, 
      servicio_id,
      fecha_publicacion,
      estado,
    } = req.body;

    const p = Number(precio);
    const sid = Number(servicio_id);

    const missing = {
      titulo: !titulo?.toString().trim(),
      descripcion: !descripcion?.toString().trim(),
      precio: Number.isNaN(p),
      servicio_id: Number.isNaN(sid),
    };

    if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });
    if (missing.titulo || missing.descripcion || missing.precio || missing.servicio_id) {
      return res.status(400).json({ message: "Faltan datos obligatorios", missing });
    }
    const servicio = await em.findOne( Servicio, { id: sid } );
    if (!servicio) {
      return res.status(400).json({ message: "Servicio no encontrado" });
    }
  
      const pub = em.create(Publicacion, {
        titulo: String(titulo).trim(),
        descripcion: String(descripcion).trim(),
        precio: p,
        servicio: em.getReference(Servicio, sid),
        // Always use server current date-time to avoid client/timezone inconsistencies
        fecha_publicacion: new Date(),
        estado: estado ?? 'Pendiente',
        usuario: em.getReference(Usuario, Number(req.user!.id)),
      });

      await em.persistAndFlush(pub);

      res.status(201).json({ message: "Publicacion creada", data: pub });
  } catch (error: any) {
    console.error('[create] ERROR:', error?.message, error?.stack);
    res.status(500).json({ message: "Error al crear Publicacion", error: error?.message });
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const publicacion = await em.getReference( Publicacion, id );
    em.assign(Publicacion, req.body);
    await em.flush();
    res.status(200).json({ message: "Publicacion actualizada", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar Publicacion", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const publicacion = await em.getReference( Publicacion, id );
    await em.removeAndFlush(Publicacion);
    res.status(200).json({ message: "Publicacion eliminada", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar Publicacion", error: error.message });
  }
};

export { findAll, findOne, create, update, remove };
    

  
