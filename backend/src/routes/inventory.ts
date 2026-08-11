import { Router } from "express";
import { InventoryMovementsController } from "../controllers/inventoryMovements.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { USERS } from "../dtos/createUser.dto.js";

export const inventoryRouter = Router()

inventoryRouter.post('/', authenticate, authorize(USERS.admin), InventoryMovementsController.createMovement)
inventoryRouter.get('/:id', InventoryMovementsController.getStock)