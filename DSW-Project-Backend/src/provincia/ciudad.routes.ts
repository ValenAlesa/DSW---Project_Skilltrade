import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './ciudad.controller.js';

export const ciudadRouter = Router();

ciudadRouter.get("/", findAll);
ciudadRouter.get("/:id", findOne);
ciudadRouter.post("/", add);
ciudadRouter.put("/:id", update);
ciudadRouter.patch("/:id", update);
ciudadRouter.delete("/:id", remove);