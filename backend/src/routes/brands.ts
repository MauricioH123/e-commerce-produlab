import { Router } from "express";
import { BrandsController } from "../controllers/brands.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";

export const brandsRoute = Router()

brandsRoute.post('/', authenticate, authorize(2), BrandsController.create)
brandsRoute.get('/', BrandsController.getAll)
brandsRoute.patch('/:id', BrandsController.update)