import { Product } from "../models/product.js";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responseHelper.js";


export class ProductoController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const name = typeof req.query.name === "string" ? req.query.name : ''

        try {
            const productos = await Product.getAll({ page, limit, name })

            return successResponse({ res, data: productos })
        } catch (e) {
            next(e)
        }
    }
}