import { Router } from "express";
import { CategoryController } from "../controllers/categories.js"
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.delete('/:id', authenticate, authorize(2), CategoryController.delete)
categoryRouter.patch('/:id/activate', authenticate, authorize(2), CategoryController.activate)
categoryRouter.patch('/:id', authenticate, authorize(2), CategoryController.updateName)
categoryRouter.post('/', authenticate, authorize(2), CategoryController.create)