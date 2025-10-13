import { Request, Response, NextFunction } from "express";
import { Provincia } from "./provincia.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeProvinciaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    ciudades: req.body.ciudades,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const provincias = await em.find(Provincia, {}, { populate: ['ciudades'] });
  res.status(200).json({ message: "Provincias obtenidas", data: provincias });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener provincias", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provincia = await em.findOneOrFail(Provincia, { id }, { populate: ['ciudades'] });

    res.status(200).json({ message: "Provincia obtenida", data: provincia });
  } catch (error: any) {
    res.status(500).json({ message: "Provincia no encontrada", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const provincia = em.create(Provincia, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "Provincia creada", data: provincia });
  } catch (error) {
    res.status(500).json({ message: "Error al crear provincia", error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provinciaToUpdate = await em.findOneOrFail(Provincia, { id });
    em.assign(provinciaToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Provincia actualizada", data: provinciaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar provincia", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provinciaToRemove = await em.findOneOrFail(Provincia, { id });
    await em.removeAndFlush(provinciaToRemove);
    res.status(200).json({ message: "Provincia eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar provincia", error: error.message });
  }
};

export { sanitizeProvinciaInput, findAll, findOne, add, update, remove };
    

  
