import { Router } from "express";
import { CategoryController } from "../controllers/categories.js"
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { USERS } from "../dtos/createUser.dto.js";

export const categoryRouter = Router()

categoryRouter.get('/', CategoryController.getAll)
categoryRouter.delete('/:id', authenticate, authorize(USERS.admin), CategoryController.delete)
categoryRouter.patch('/:id/activate', authenticate, authorize(USERS.admin), CategoryController.activate)
categoryRouter.patch('/:id', authenticate, authorize(USERS.admin), CategoryController.updateName)
categoryRouter.post('/', authenticate, authorize(USERS.admin), CategoryController.create)