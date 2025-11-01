import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET || 'mysecretkey';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  };

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, SECRET) as any;
    (req as any).user = payload ;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}