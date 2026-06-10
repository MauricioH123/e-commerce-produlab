import { Router } from "express";
import { ProductoController } from "../controllers/products.js";
import { idempotency } from "../middlewares/idempotency.js";

export const productsRouter = Router()

productsRouter.get('/', ProductoController.getAll)
productsRouter.post('/', idempotency, ProductoController.create)