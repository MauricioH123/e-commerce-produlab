import { Router } from "express";
import { CategoryController } from "../controllers/categories.js"

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.delete('/:id', CategoryController.delete)
categoryRouter.patch('/:id/activate', CategoryController.activate)
categoryRouter.patch('/:id', CategoryController.updateName)
categoryRouter.post('/', CategoryController.create)