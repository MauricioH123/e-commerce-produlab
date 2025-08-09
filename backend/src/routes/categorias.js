import { Router } from "express";
import { CategoryController } from "../controllers/categorias.js"

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.delete('/:id', CategoryController.delete)
categoryRouter.post('/', CategoryController.create)