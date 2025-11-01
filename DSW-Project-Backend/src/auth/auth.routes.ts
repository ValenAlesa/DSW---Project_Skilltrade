import { Router } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Request, Response } from "express";

const router = Router ();
const SECRET = process.env.JWT_SECRET || 'mysecretkey';

router.post('/login', async (req: Request, res: Response) => {
  try {
  const { email, username, password } = req.body as { email?: string; username?: string; password: string };
  if (!password || !email && !username) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }


  const em = orm.em.fork();
const user = await em.findOne(Usuario, email ? { email } : { username });
if (!user) {
  return res.status(401).json({ message: 'Credenciales inválidas' });
}

const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  return res.status(401).json({ message: 'Credenciales inválidas' });
}

const payload = { id: user.id, username: user.username, rol: user.rol, email: user.email };
const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

return res.json({ token, user: payload });
} catch (error) {
  console.error (error);
  return res.status(500).json({ message: 'Error del servidor' });
}
});

router.get('/profile', async (req: Request, res: Response) => {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) 
    return res.status(401).json({ message: 'Token no proporcionado' });

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, SECRET) as { id: string; username: string; rol: string; email: string };
    return res.json({ user: payload });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token inválido' });
  }
});

export default router;
