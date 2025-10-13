import { Router } from "express";
import { sanitizeTipoServicioInput, findAll, findOne, add, update, remove } from "./tipoServicio.controller.js";

export const tipoServicioRouter = Router();

tipoServicioRouter.get("/", findAll);
tipoServicioRouter.get("/:id", findOne);
tipoServicioRouter.post("/", sanitizeTipoServicioInput, add);
tipoServicioRouter.put("/:id", sanitizeTipoServicioInput, update);
tipoServicioRouter.patch("/:id", sanitizeTipoServicioInput, update);
tipoServicioRouter.delete("/:id", remove);