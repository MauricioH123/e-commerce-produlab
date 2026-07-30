import { Router } from "express";
import { UserController } from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { verifyResourceOwner } from "../middlewares/verifyResourceOwner.js";

export const usersRouter = Router()

usersRouter.get('/', authenticate, authorize(2), UserController.getAll)
usersRouter.get('/:id', authenticate, verifyResourceOwner, UserController.getById)