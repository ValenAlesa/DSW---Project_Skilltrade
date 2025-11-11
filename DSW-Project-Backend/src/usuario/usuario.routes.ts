import { Router } from 'express';
import { findAll, findOne, add, update, remove, login, register, findAdministradores } from './usuario.controller.js';

export const usuarioRouter = Router();

/* Login router */
usuarioRouter.post("/login", login);

/* Register router */
usuarioRouter.post("/register", register);

/* Obtener solo administradores */
usuarioRouter.get("/administradores", findAdministradores);

/* CRUD routes */
usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/", add);
usuarioRouter.put("/:id", update);
usuarioRouter.patch("/:id", update);
usuarioRouter.delete("/:id", remove);

