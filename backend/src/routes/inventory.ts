import { Router } from "express";
import { InventoryMovementsController } from "../controllers/inventoryMovements.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";

export const inventoryRouter = Router()

inventoryRouter.post('/', authenticate, authorize(2), InventoryMovementsController.createMovement)
inventoryRouter.get('/:id', InventoryMovementsController.getStock)