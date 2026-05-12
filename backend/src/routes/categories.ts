import { Router } from "express";
import { CategoryController } from "../controllers/categories.js"

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.patch('/:id/deactivate', CategoryController.delete)
categoryRouter.patch('/:id/activate', CategoryController.activate)
categoryRouter.patch('/', CategoryController.updateName)
categoryRouter.post('/', CategoryController.create)