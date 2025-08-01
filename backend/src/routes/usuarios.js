import { Router } from "express";
import {UsuarioController} from "../controllers/usuarios.js";

export const usuariosRouter = Router()

usuariosRouter.get('/', UsuarioController.getAll)