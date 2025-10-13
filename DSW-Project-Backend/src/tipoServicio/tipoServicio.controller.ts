import { Request, Response, NextFunction } from "express";
import { TipoServicio } from "./tipoServicio.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

function sanitizeTipoServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
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
    const tiposServicio = await em.find(TipoServicio, {});
    res.status(200).json({ message: "Tipos de Servicio obtenidos", data: tiposServicio });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tipos de servicio", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoServicio = await em.findOneOrFail(TipoServicio, { id }, { populate: ['servicios'] });

    res.status(200).json({ message: "Tipo de Servicio obtenido", data: tipoServicio });
  } catch (error: any) {
    res.status(500).json({ message: "Tipo de Servicio no encontrado", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const tipoServicio = em.create(TipoServicio, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "Tipo de Servicio creado", data: tipoServicio });
  } catch (error) {
    res.status(500).json({ message: "Error al crear tipo de servicio", error });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoServicioToUpdate = await em.findOneOrFail(TipoServicio, { id });
    em.assign(tipoServicioToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Tipo de Servicio actualizado", data: tipoServicioToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar tipo de servicio", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tipoServicioToRemove = await em.findOneOrFail(TipoServicio, { id });
    await em.removeAndFlush(tipoServicioToRemove);
    res.status(200).json({ message: "Tipo de Servicio eliminado" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar tipo de servicio", error: error.message });
  }
}

export { sanitizeTipoServicioInput, findAll, findOne, add, update, remove };