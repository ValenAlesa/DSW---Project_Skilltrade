import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "./usuario.entity.js";

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: "Usuarios obtenidos", data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(Usuario, { id });
    res.status(200).json({ message: "Usuario obtenido", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: "Usuario no encontrado", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = await em.create(Usuario, req.body);
    await em.flush(); 
    res.status(201).json({ message: "Usuario creado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = await em.getReference(Usuario, id);
    em.assign(usuario, req.body);
    await em.flush();
    res.status(200).json({ message: "Usuario actualizado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = await em.getReference(Usuario, id);
    await em.removeAndFlush(usuario);
    res.status(200).json({ message: "Usuario eliminado", data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

export { findAll, findOne, add, update, remove };
    

  
