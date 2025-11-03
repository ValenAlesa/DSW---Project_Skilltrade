import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Publicacion } from "./publicacion.entity.js";

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


async function findAll(req: Request, res: Response) {
  try {

    const rawFrom = req.query.from as string | undefined;
    const rawTo = req.query.to as string | undefined;

    const from = parseDateDMYYorISO(rawFrom);
    const to = parseDateDMYYorISO(rawTo);

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
    const publicaciones = await em.find( Publicacion, where,
      { orderBy: { fecha_publicacion: 'DESC' } }  );
    res.status(200).json({ message: "Publicaciones obtenidas", data: publicaciones });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener Publicaciones", error: error.message });
  }
} 

async function findOne(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    const publicacion = await em.findOne( Publicacion, { id } );
    res.status(200).json({ message: "Publicacion obtenida", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener Publicacion", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const publicacion = await em.create(Publicacion, req.body);
    await em.flush(); 
    res.status(201).json({ message: "Publicacion creada", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear Publicacion", error: error.message });
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

export { findAll, findOne, add, update, remove };
    

  
