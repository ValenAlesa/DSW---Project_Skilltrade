import { Router } from 'express';
import { findAll, findOne, create, update, remove } from './publicacion.controller.js';
import { auth } from '../auth/auth.js';

export const publicacionRouter = Router();

// Listado público: cualquiera puede ver las publicaciones
publicacionRouter.get("/", findAll);
publicacionRouter.get("/:id", findOne);

// Operaciones que modifican datos: requieren autenticación
publicacionRouter.post("/", auth, create);
publicacionRouter.put("/:id", auth, update);
publicacionRouter.delete("/:id", auth, remove);