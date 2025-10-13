import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './servicio.controller.js';

export const servicioRouter = Router();

servicioRouter.get("/", findAll);
servicioRouter.get("/:id", findOne);
servicioRouter.post("/", add);
servicioRouter.put("/:id", update);
servicioRouter.patch("/:id", update);
servicioRouter.delete("/:id", remove);