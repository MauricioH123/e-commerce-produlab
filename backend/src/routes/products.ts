import { Router } from "express";
import { ProductoController } from "../controllers/products.js";
import { idempotency } from "../middlewares/idempotency.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const productsRouter = Router()

productsRouter.get('/', ProductoController.getAll)
productsRouter.get('/:id', ProductoController.getById)
productsRouter.post('/', authenticate, authorize(2), idempotency, ProductoController.create)
productsRouter.delete('/:id', authenticate, authorize(2), ProductoController.delete)
productsRouter.patch('/:id/activate', authenticate, authorize(2), ProductoController.activate)
productsRouter.patch('/:id', authenticate, authorize(2), ProductoController.update)