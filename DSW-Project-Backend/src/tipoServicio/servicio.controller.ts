import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Servicio } from "./servicio.entity.js";

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const servicios = await em.find(Servicio, {});
    res.status(200).json({ message: "Servicios obtenidos", data: servicios });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const servicio = await em.findOneOrFail( Servicio, { id } );

    res.status(200).json({ message: "Servicio obtenido", data: servicio });
  } catch (error: any) {
    res.status(500).json({ message: "Servicio no encontrado", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const servicio = await em.create( Servicio, req.body );
    await em.flush(); 
    res.status(201).json({ message: "Servicio creado", data: servicio });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear servicio", error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const servicio = await em.getReference( Servicio, id );
    em.assign(servicio, req.body);
    await em.flush();
    res.status(200).json({ message: "Servicio actualizado", data: servicio });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar servicio", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const servicio = await em.getReference( Servicio, id );
    await em.removeAndFlush(servicio);
    res.status(200).json({ message: "Servicio eliminado", data: servicio });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar servicio", error: error.message });
  }
};

export { findAll, findOne, add, update, remove };
    

  
