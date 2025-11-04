import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './publicacion.controller.js';
import { auth } from '../auth/auth.js';

export const publicacionRouter = Router();

/* Rutas para Publicacion */
publicacionRouter.get("/", findAll);
publicacionRouter.get("/:id", findOne);

/* Rutas protegidas con auth middleware */
publicacionRouter.post("/", auth, create);
publicacionRouter.put("/:id", auth, update);
publicacionRouter.delete("/:id", auth, remove);