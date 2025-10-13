import "reflect-metadata";
import express from "express";
import { provinciaRouter } from "./provincia/provincia.routes.js";
import { ciudadRouter } from "./provincia/ciudad.routes.js";
import { tipoServicioRouter } from "./tipoServicio/tipoServicio.routes.js";
import { servicioRouter } from "./tipoServicio/servicio.routes.js";
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema } from "./shared/db/orm.js";
import { publicacionRouter } from "./publicacion/publicacion.routes.js";
import { clienteRouter } from "./publicacion/cliente.routes.js";

const app = express();
app.use(express.json());

//Luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

//CRUD tipo de servicio
app.use("/api/tiposServicios", tipoServicioRouter);

app.use("/api/ciudades", ciudadRouter);

app.use("/api/servicios", servicioRouter);

app.use("/api/publicaciones", publicacionRouter);

app.use("/api/clientes", clienteRouter);

//CRUD provincia
app.use("/api/provincias", provinciaRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

await syncSchema()

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
