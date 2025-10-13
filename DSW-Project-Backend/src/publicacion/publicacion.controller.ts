import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Publicacion } from "./publicacion.entity.js";

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const publicaciones = await em.find(Publicacion, {});
    res.status(200).json({ message: "Publicaciones obtenidas", data: publicaciones });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const publicacion = await em.findOneOrFail( Publicacion, { id } );

    res.status(200).json({ message: "Publicacion obtenida", data: publicacion });
  } catch (error: any) {
    res.status(500).json({ message: "Publicacion no encontrada", error: error.message });
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
    

  
