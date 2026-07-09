import { Router } from "express";
import {UsuarioController} from "../controllers/users.js";

export const usersRouter = Router()

usersRouter.get('/', UsuarioController.getAll)