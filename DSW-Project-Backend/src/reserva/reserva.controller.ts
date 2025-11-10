import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Reserva } from "./reserva.entity.js";
import { Filter } from "mongodb";
import { Publicacion } from "../publicacion/publicacion.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { FilterQuery } from "@mikro-orm/core";

const em = orm.em

/* -----Create a new reserva----- */
async function create(req: Request, res: Response) {
  try {
    const body = req.body ?? {};

  const estado = body.estado ?? 'pendiente';
    const precio = typeof body.precio === 'number' ? String(body.precio) : body.precio;
    const notas = body.notas ?? '';

    const clienteId = Number(body.clienteId ?? body.cliente_id);
    const publicacionId = Number(body.publicacionId ?? body.publicacion_id);

    if (!clienteId || !publicacionId) {
      return res.status(400).json({
        message: 'Faltan datos obligatorios',
        missing: {
          clienteId: !clienteId,
          publicacionId: !publicacionId,
        },
      });
    }

    // Validate that the publication exists and is not owned by the same user
    const publicacion = await em.findOne(Publicacion, { id: publicacionId }, { populate: ['usuario'] });
    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    if (publicacion.usuario && Number(publicacion.usuario.id) === clienteId) {
      return res.status(400).json({ message: 'No puedes reservar tu propia publicación' });
    }

    // Set current server date/time for reservation date
    const d = new Date();

    const reserva = em.create(Reserva, {
      fecha_reserva: d,
      estado,
      notas,
      precio,
      publicacion: publicacion,
      cliente: em.getReference(Usuario, clienteId),
    });

    await em.persistAndFlush(reserva);
    return res.status(201).json({ message: 'Reserva creada', data: reserva });
  } catch (e: any) {
    console.error('[POST /reservas] error:', e);
    return res.status(500).json({ message: 'server_error' });
  }
}


/* -----Find all reservas with optional filters----- */
async function findAll(req: Request, res: Response) {
  try {
    const { from, to, clienteId, publicacionId, estado } = req.query;

    const where: FilterQuery<Reserva> = {};

    if (clienteId) where.cliente = { id: Number(clienteId) };
    if (publicacionId) where.publicacion = { id: Number(publicacionId) };
    if (estado) where.estado = String(estado);

    if (from || to) {
      const rango: any = {};
      if(from) {
        const start = new Date(String(from));
        start.setHours(0, 0, 0, 0);
        rango.$gte = start;
      }

      if(to) {
        const end = new Date(String(to));
        end.setHours(23, 59, 59, 999);
        rango.$lte = end;
      } 

      (where as any).fecha_reserva = rango;
    }

    const reservas = await em.find( Reserva, where,
      { orderBy: { fecha_reserva : "DESC" },
      populate: ['cliente', 'publicacion'],
     } 
    );

      return res.status(200).json({ message: "Reservas obtenidas", data: reservas });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener reservas", error: error.message });
  }
}


/* -----Find one reserva by ID----- */
async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reserva = await em.findOneOrFail( Reserva, { id }, { populate: ['cliente', 'publicacion'] } );

    return res.status(200).json({ message: "Reserva obtenida", data: reserva });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener reserva", error: error.message });
  }
}


/* -----Update a new reserva----- */
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const { estado, fecha_reserva, precio} = req.body;

    const reserva = await em.findOneOrFail( Reserva, { id } );

    if (estado !== undefined) reserva.estado = String(estado);
    if (fecha_reserva !== undefined) reserva.fecha_reserva = new Date(fecha_reserva);
    if (precio !== undefined) reserva.precio = String(precio);

    await em.flush();

    return res.status(200).json({ message: "Reserva actualizada", data: reserva });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar reserva", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const reserva = await em.getReference(Reserva, id);
    await em.removeAndFlush(reserva);
    res.status(200).json({ message: "Reserva eliminada", data: reserva });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar reserva", error: error.message });
  }
};

/* -----Find reservas by cliente/usuario----- */
async function findByUsuario(req: Request, res: Response) {
  try {
    const usuarioId = Number.parseInt(req.params.id);

    if (!usuarioId) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const reservas = await em.find(
      Reserva,
      { cliente: usuarioId },
      { 
        orderBy: { fecha_reserva: 'DESC' },
        populate: ['cliente', 'publicacion', 'publicacion.servicio', 'publicacion.usuario']
      }
    );

    return res.status(200).json({ message: 'Reservas del usuario obtenidas', data: reservas });
  } catch (error: any) {
    console.error('[GET /reservas/usuarios/:id] error:', error);
    res.status(500).json({ message: 'Error al obtener reservas del usuario', error: error.message });
  }
}

export { create, findAll, findOne, update, remove, findByUsuario };
    

  
