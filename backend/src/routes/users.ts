import { Router } from "express";
import {UsuarioController} from "../controllers/users.js";

export const usersRouter = Router()

usersRouter.get('/', UsuarioController.getAll)
usersRouter.post('/', UsuarioController.createUser)
usersRouter.delete('/:id', UsuarioController.delete)
usersRouter.get('/:id/profile', UsuarioController.getProfile)
usersRouter.put('/:id/profile', UsuarioController.update)