import { Router } from "express";
import { ProductoController } from "../controllers/products.js";
import { idempotency } from "../middlewares/idempotency.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { uploadProductPhotos } from "../middlewares/uploadProductPhotos.js";
import { USERS } from "../dtos/createUser.dto.js";

export const productsRouter = Router()

productsRouter.get('/', ProductoController.getAll)
productsRouter.get('/:id', ProductoController.getById)
productsRouter.post('/', authenticate, authorize(USERS.admin), idempotency, uploadProductPhotos.array('photos', 4), ProductoController.create)
productsRouter.delete('/:id', authenticate, authorize(USERS.admin), ProductoController.delete)
productsRouter.patch('/:id/activate', authenticate, authorize(USERS.admin), ProductoController.activate)
productsRouter.patch('/:id', authenticate, authorize(USERS.admin), ProductoController.update)