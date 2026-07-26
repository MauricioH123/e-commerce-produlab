import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const usersRouter = Router()

usersRouter.get('/', authenticate, authorize(1), UserController.getAll)
usersRouter.get('/:id', UserController.getById)