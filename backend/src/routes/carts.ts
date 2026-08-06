import { Router } from "express";
import { CartsController } from "../controllers/carts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const cartsRouter = Router()

cartsRouter.get('/', authenticate, authorize(1), CartsController.getByIdUser)