import { Router } from 'express';
import { create, findAll, findOne, update, remove } from './reserva.controller.js';

export const reservaRouter = Router();

reservaRouter.get('/', findAll);
reservaRouter.get('/:id', findOne);
reservaRouter.post('/', create);
reservaRouter.patch('/:id', update);
reservaRouter.delete('/:id', remove);
