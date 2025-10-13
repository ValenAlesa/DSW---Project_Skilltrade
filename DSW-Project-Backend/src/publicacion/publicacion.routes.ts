import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './publicacion.controller.js';

export const publicacionRouter = Router();

publicacionRouter.get("/", findAll);
publicacionRouter.get("/:id", findOne);
publicacionRouter.post("/", add);
publicacionRouter.put("/:id", update);
publicacionRouter.patch("/:id", update);
publicacionRouter.delete("/:id", remove);