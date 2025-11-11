import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Usuario, RolUsuario } from "./usuario.entity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequiredEntityData } from "@mikro-orm/core";

const em = orm.em;
const SECRET = "development_secret"; 

const safeUser = (user: Usuario) => {
  const { password, ...safeData } = user;
  return safeData;
}

async function findAll(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: "Usuarios obtenidos", data: usuarios.map(safeUser) });
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
}

async function findAdministradores(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const administradores = await em.find(Usuario, { rol: RolUsuario.ADMINISTRADOR });
    res.status(200).json({ 
      message: "Administradores obtenidos", 
      data: administradores.map(safeUser) 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error al obtener administradores", 
      error: error.message 
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(Usuario, { id });
    res.status(200).json({ message: "Usuario obtenido", data: safeUser(usuario) });
  } catch (error: any) {
    res.status(500).json({ message: "Usuario no encontrado", error: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const body = req.body as Partial<Usuario> & { password: string };

    // Hash the password before saving
    body.password = await bcrypt.hash(body.password, 10);

    const usuario = em.create(Usuario, body as RequiredEntityData<Usuario>);
    await em.flush();
    res.status(201).json({ message: "Usuario creado", data: safeUser(usuario) });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    const usuario = await em.getReference(Usuario, id);

    // Si se proporciona una nueva contraseña, hashearla
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    em.assign(usuario, req.body);
    await em.flush();
    res.status(200).json({ message: "Usuario actualizado", data: safeUser(usuario) });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const id = Number.parseInt(req.params.id)
    const usuario = await em.getReference(Usuario, id);
    await em.removeAndFlush(usuario);
    res.status(200).json({ message: "Usuario eliminado", data: { id } });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

//LOGIN: POST /api/usuario/login

 async function login(req: Request, res: Response) {
  try {
    const em = orm.em.fork(); // buena práctica con MikroORM
    const rawEmail = (req.body.email ?? '').toString();
    const password = (req.body.password ?? '').toString();

    const email = rawEmail.trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const user = await em.findOne(Usuario, { email });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.rol ?? 'CLIENTE' },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          rol: user.rol ?? 'CLIENTE'
        }
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error en login', error: err?.message });
  }
}


//REGISTER : POST /api/usuario/register

async function register(req: Request, res: Response) {
  try {
    const em = orm.em.fork();
    const {username, email, password, telefono, domicilio, rol, ciudad} = req.body || {};

    if (!email && !username) {
      return res.status(400).json({ message: "Se requiere username o email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Se requiere contraseña" });
    }

    //Evitar duplicados
    const existingUser = await em.findOne(Usuario, email ? { email } : { username });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario o email ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = em.create(Usuario, {
      username: username || email,
      email,
      password: hash,
      telefono,
      domicilio,
      rol: rol || RolUsuario.CLIENTE, // Asignar CLIENTE por defecto si no se especifica
      ciudad
    });

    await em.flush();
    const { password: _, ...userData } = usuario as any;
    return res.status(201).json({ message: "Usuario registrado exitosamente", data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
}
    
export { findAll, findOne, add, update, remove, login, register, findAdministradores };

