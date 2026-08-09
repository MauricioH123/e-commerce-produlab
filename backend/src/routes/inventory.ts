import { Router } from "express";
import { inventoryMovementsController } from "../controllers/inventoryMovements.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";

export const inventoryRouter = Router()

inventoryRouter.post('/', authenticate, authorize(2),inventoryMovementsController.createMovement)