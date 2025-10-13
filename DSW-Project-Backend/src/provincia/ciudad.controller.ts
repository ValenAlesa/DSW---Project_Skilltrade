import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Ciudad } from "./ciudad.entity.js";

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const ciudades = await em.find(Ciudad, {});
    res.status(200).json({ message: "Ciudades obtenidas", data: ciudades });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener ciudades", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ciudad = await em.findOneOrFail( Ciudad, { id } );

    res.status(200).json({ message: "Ciudad obtenida", data: ciudad });
  } catch (error: any) {
    res.status(500).json({ message: "Ciudad no encontrada", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const ciudad = await em.create(Ciudad, req.body);
    await em.flush(); 
    res.status(201).json({ message: "Ciudad creada", data: ciudad });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear ciudad", error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ciudad = await em.getReference( Ciudad, id );
    em.assign(ciudad, req.body);
    await em.flush();
    res.status(200).json({ message: "Ciudad actualizada", data: ciudad });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar ciudad", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ciudad = await em.getReference( Ciudad, id );
    await em.removeAndFlush(ciudad);
    res.status(200).json({ message: "Ciudad eliminada", data: ciudad });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar ciudad", error: error.message });
  }
};

export { findAll, findOne, add, update, remove };
    

  
