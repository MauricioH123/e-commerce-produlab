import { Router } from "express";
import { ProductoController } from "../controllers/productos.js";

export const productosRouter = Router()

productosRouter.get('/', ProductoController.getAll)