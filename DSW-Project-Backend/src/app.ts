import "reflect-metadata";
import express from "express";
import cors from "cors";

/* Routers */
import { provinciaRouter } from "./provincia/provincia.routes.js";
import { ciudadRouter } from "./provincia/ciudad.routes.js";
import { servicioRouter } from "./servicio/servicio.routes.js";
import { publicacionRouter } from "./publicacion/publicacion.routes.js";
import { usuarioRouter } from "./usuario/usuario.routes.js";
import authRouter from "./auth/auth.routes.js";

/* MikroORM */
import { RequestContext } from "@mikro-orm/core";
import { orm, syncSchema } from "./shared/db/orm.js";
import { reservaRouter } from "./reserva/reserva.routes.js";

/* Crear api express */
const app = express();

/* CORS Middleware */
app.use(cors());

app.use(express.json());

/* MikroORM Middleware */
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

/* RUTAS PÚBLICAS (sin JWT) */
app.use("/api/auth", authRouter);

/* RUTAS CRUD */
app.use("/api/ciudades", ciudadRouter);
app.use("/api/servicios", servicioRouter);
app.use("/api/publicaciones", publicacionRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/provincias", provinciaRouter);
app.use("/api/reservas", reservaRouter);

/* 404 Handler */
app.use((_, res) => {
  return res.status(404).send({ message: "Recurso no encontrado" });
});

/* Error Handler */
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  const status = err?.status || 500;
  res.status(status).json({ message: err?.message || "Error interno del servidor" });
});

/* Inicializar el servidor */
await syncSchema();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
