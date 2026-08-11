import { Router } from "express";
import { CartsController } from "../controllers/carts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { USERS } from "../dtos/createUser.dto.js";

export const cartsRouter = Router()

cartsRouter.get('/', authenticate, authorize(USERS.client), CartsController.getByIdUser)
cartsRouter.patch('/update', authenticate, authorize(USERS.client), CartsController.updateQuantityByUserId)
cartsRouter.post('/', authenticate, authorize(USERS.client), CartsController.insertItem)