import { Router } from "express";
import {UsuarioController} from "../controllers/usuarios.js";

export const usuariosRouter = Router()

usuariosRouter.get('/', UsuarioController.getAll)
usuariosRouter.post('/', UsuarioController.createUser)
usuariosRouter.delete('/:id', UsuarioController.delete)
usuariosRouter.get('/:id/profile', UsuarioController.getProfile)