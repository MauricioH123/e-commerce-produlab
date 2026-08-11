import { Product } from "../models/product.js";
import { Request, Response, NextFunction } from "express";
import { createdResponse, successResponse } from "../utils/responseHelper.js";
import { validatePartialProduct, validateProduct, validateUpdateProduct } from "../schemas/products.js";
import { InvalidError } from "../errors/InvalidError.js";
import { RegisterProduct } from "../services/registerProduct.service.js";
import { createProductDTO, updateProductDTO } from "../dtos/createProduct.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { GetProduct } from "../services/getProduct.service.js";
import { SoftDeleteProduct } from "../services/softDeleteProduct.service.js";
import { ActivateProduct } from "../services/activateProduct.service.js";
import { UpdateProduct } from "../services/updateProduct.service.js";


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
        const user_id = String(req.user.sub)
        const body = req.body
        const files = req.files

        if(!files || !Array.isArray(files) || files.length === 0){
            return next(new InvalidError('Datos invalidos', 'El producto debe tener al menos una foto'))
        }
        
        const validate = validateProduct(body)

        if (!validate.success) {
            return next(new InvalidError("Datos invalidos", validate.error.issues))
        }

        const productDTO = createProductDTO(validate.data)

        try {
            const product = await RegisterProduct.execute(productDTO, user_id, files)

            return createdResponse({ res, data: product })
        } catch (e) {
            next(e)
        }
    }

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        const product_id = Number(req.params.id)
        const validate = validatePartialProduct({ id: product_id })

        if (!validate.success) {
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

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const body = {
            ...req.body,
            id: Number(req.params.id)
        }

        if (Object.keys(body).length === 1) {
            return next(new InvalidError('Datos invalidos', 'No hay campos para actualizar'))
        }

        const validate = validateUpdateProduct(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        const productDTO = updateProductDTO(validate.data)

        try {
            const updateProduct = await UpdateProduct.execute({ dataProduct: productDTO, product_id: body.id })
            return successResponse({ res, data: updateProduct })
        } catch (e) {
            next(e)
        }

    }

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const product_id = Number(req.params.id)
        const validate = validatePartialProduct({ id: product_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const result = await SoftDeleteProduct.execute(product_id)
            return successResponse({ res, data: result })
        } catch (e) {
            next(e)
        }

    }

    static activate = async (req: Request, res: Response, next: NextFunction) => {
        const product_id = Number(req.params.id)
        const validate = validatePartialProduct({ id: product_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const product = await ActivateProduct.execute(product_id)

            return successResponse({ res, data: product })
        } catch (e) {
            next(e)
        }
    }



}