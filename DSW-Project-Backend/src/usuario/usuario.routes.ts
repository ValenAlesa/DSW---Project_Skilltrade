import { Router } from 'express';
import { findAll, findOne, add, update, remove, login, register } from './usuario.controller.js';

export const usuarioRouter = Router();

/* Login route */
usuarioRouter.post("/login", login);

/* Register route */
usuarioRouter.post("/register", register);

/* CRUD routes */
usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/", add);
usuarioRouter.put("/:id", update);
usuarioRouter.patch("/:id", update);
usuarioRouter.delete("/:id", remove);

