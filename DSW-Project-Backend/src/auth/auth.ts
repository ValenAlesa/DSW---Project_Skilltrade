import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || 'dev_secret';

export function auth (req: Request, res: Response, next: NextFunction) {
  
  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/);
    const token = match ? match[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET) as any;

    req.user = {
      id: decoded.sub,
      rol: decoded.role
    };

    return next();
  } catch (err) {
    console.error('Error en auth:', err);
    return res.status(401).json({ message: 'Token inválido' });
  }
}