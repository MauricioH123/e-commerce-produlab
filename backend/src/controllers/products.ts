import { Product } from "../models/product.js";
import { Request, Response, NextFunction } from "express";
import { createdResponse, successResponse } from "../utils/responseHelper.js";
import { capitalizeWords } from "../utils/stringUtils.js";
import { validatePartialProduct } from "../schemas/products.js";
import { InvalidError } from "../errors/InvalidError.js";
import { RegisterProduct } from "../services/registerProduct.service.js";
import { createProductDTO } from "../dtos/createProduct.dto.js";


export class ProductoController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        try {
            const productos = await Product.getAll({ page, limit })

            return successResponse({ res, data: productos })
        } catch (e) {
            next(e)
        }
    }

    static create = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body
        const validate = validatePartialProduct(body)

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", validate.error.issues))
        }

        const productDTO = createProductDTO(body)

        try {
            const product = await RegisterProduct.execute(productDTO)

            return createdResponse({ res, data: product })
        } catch (e) {
            next(e)
        }

    }
}