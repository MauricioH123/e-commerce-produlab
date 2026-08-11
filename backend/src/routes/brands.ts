import { Router } from "express";
import { BrandsController } from "../controllers/brands.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/authenticate.js";
import { USERS } from "../dtos/createUser.dto.js";

export const brandsRoute = Router()

brandsRoute.post('/', authenticate, authorize(USERS.admin), BrandsController.create)
brandsRoute.get('/', BrandsController.getAll)
brandsRoute.patch('/:id', BrandsController.update)