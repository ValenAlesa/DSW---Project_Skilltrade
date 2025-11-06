import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './publicacion.controller.js';
import { auth } from '../auth/auth.js';

export const publicacionRouter = Router();

/* Rutas protegidas con auth middleware - usuario solo ve sus publicaciones */
publicacionRouter.get("/", auth, findAll);
publicacionRouter.get("/:id", auth, findOne);
publicacionRouter.post("/", auth, create);
publicacionRouter.put("/:id", auth, update);
publicacionRouter.delete("/:id", auth, remove);