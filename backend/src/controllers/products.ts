import { Product } from "../models/product.js";
import { Request, Response, NextFunction } from "express";
import { createdResponse, successResponse } from "../utils/responseHelper.js";
import { validatePartialProduct, validateProduct } from "../schemas/products.js";
import { InvalidError } from "../errors/InvalidError.js";
import { RegisterProduct } from "../services/registerProduct.service.js";
import { createProductDTO } from "../dtos/createProduct.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { GetProduct } from "../services/getProduct.service.js";
import { softDeleteProduct } from "../services/softDeleteProduct.service.js";


export class ProductoController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const category_id = Number(req.query.category)
        const brand_id = Number(req.query.brand)

        try {
            const productos = await Product.getAll({ page, limit, category_id, brand_id })

            return successResponse({ res, data: productos })
        } catch (e) {
            next(e)
        }
    }

    static create = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body
        const validate = validateProduct(body)

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

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        const product_id = Number(req.params.id)
        const validate = validatePartialProduct({ id: product_id })

        if (validate.error) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const product = await GetProduct.execute({ product_id })

            if (product === null) return next(new NotFoundError('Producto'))

            return successResponse({ res, data: product })
        } catch (e) {
            next(e)
        }
    }

    static update = (req: Request, res: Response, next: NextFunction) => {

    }

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const product_id = Number(req.params.id)
        const validate = validatePartialProduct({ id: product_id })

        if (validate.error) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const result = await softDeleteProduct.execute(product_id)
            return successResponse({ res, data: result })
        } catch (e) {
            next(e)
        }

    }

    static activate = (req: Request, res: Response, next: NextFunction) => {

    }



}