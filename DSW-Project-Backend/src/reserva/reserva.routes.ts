import { Router } from 'express';
import { create, findAll, findOne, update, remove, findByUsuario } from './reserva.controller.js';
import { auth } from '../auth/auth.js';

export const reservaRouter = Router();

reservaRouter.get('/', auth, findAll);
reservaRouter.get('/usuarios/:id', auth, findByUsuario);
reservaRouter.get('/:id', auth, findOne);
reservaRouter.post('/', auth, create);
reservaRouter.patch('/:id', auth, update);
reservaRouter.delete('/:id', auth, remove);
