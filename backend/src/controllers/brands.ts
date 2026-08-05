import { NextFunction, Request, Response } from "express";
import { validateCreateBrand, validateUpdateBrand } from "../schemas/brands.js";
import { InvalidError } from "../errors/InvalidError.js";
import { createBrandDTO, updateBrandDTO } from "../dtos/CreateBrand.dto.js";
import { RegisterBrand } from "../services/registerBrand.service.js";
import { createdResponse, successResponse } from "../utils/responseHelper.js";
import { Brands } from "../models/brands.js";
import { UpdateBrand } from "../services/updateBrand.service.js";

export class BrandsController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        const validate = validateCreateBrand(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        const brandDTO = createBrandDTO(validate.data)

        try {
            const brand = RegisterBrand.execute(brandDTO)
            return createdResponse({ res, data: brand })
        } catch (e) {
            next(e)
        }
    }

    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const brands = await Brands.getAll()
            return successResponse({ res, data: brands })
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

        const validate = validateUpdateBrand(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        const brandDTO = updateBrandDTO(validate.data)

        try {
            const brand = await UpdateBrand.execute(brandDTO)
            return successResponse({ res, data: brand })
        } catch (e) {
            next(e)
        }


    }
}