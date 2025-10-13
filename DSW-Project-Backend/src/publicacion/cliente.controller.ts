import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Cliente } from "./cliente.entity.js";

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const cliente = await em.find( Cliente, {});
    res.status(200).json({ message: "Clientes obtenidos", data: cliente });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener Clientes", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.findOneOrFail( Cliente, { id } );

    res.status(200).json({ message: "Cliente obtenido", data: Cliente });
  } catch (error: any) {
    res.status(500).json({ message: "Cliente no encontrado", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cliente = await em.create(Cliente, req.body);
    await em.flush(); 
    res.status(201).json({ message: "Cliente creado", data: Cliente });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear Cliente", error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.getReference( Cliente, id );
    em.assign(Cliente, req.body);
    await em.flush();
    res.status(200).json({ message: "Cliente actualizado", data: Cliente });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar Cliente", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.getReference( Cliente, id );
    await em.removeAndFlush(Cliente);
    res.status(200).json({ message: "Cliente eliminado", data: Cliente });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar Cliente", error: error.message });
  }
};

export { findAll, findOne, add, update, remove };
    

  
