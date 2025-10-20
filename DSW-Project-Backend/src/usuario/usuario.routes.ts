import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './usuario.controller.js';

export const clienteRouter = Router();

clienteRouter.get("/", findAll);
clienteRouter.get("/:id", findOne);
clienteRouter.post("/", add);
clienteRouter.put("/:id", update);
clienteRouter.patch("/:id", update);
clienteRouter.delete("/:id", remove);