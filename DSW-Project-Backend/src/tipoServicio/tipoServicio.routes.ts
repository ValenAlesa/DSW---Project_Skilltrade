import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./tipoServicio.controller.js";

export const tipoServicioRouter = Router();

tipoServicioRouter.get("/", findAll);
tipoServicioRouter.get("/:id", findOne);
tipoServicioRouter.post("/",  add);
tipoServicioRouter.put("/:id",  update);
tipoServicioRouter.patch("/:id",  update);
tipoServicioRouter.delete("/:id", remove);