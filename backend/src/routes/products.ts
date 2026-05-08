import { Router } from "express";
import { ProductoController } from "../controllers/products.js";

export const productsRouter = Router()

productsRouter.get('/', ProductoController.getAll)