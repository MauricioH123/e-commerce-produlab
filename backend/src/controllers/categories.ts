import { Category } from "../models/category.js";
import { validatePartialCategory } from "../schemas/category.js";
import { Request, Response, NextFunction } from "express";
import { InvalidError } from "../errors/InvalidError.js";
import { SoftDeleteCategory } from "../services/softDeleteCategory.service.js";
import { RegisterCategory } from "../services/registerCategory.service.js";
import { createdResponse, successResponse } from "../utils/responseHelper.js";
import { createCategoryDTO } from "../dtos/createCategory.dto.js";
import { ActivateCategory } from "../services/activateCategory.service.js";
import { UpdateCategoryName } from "../services/updateNameCategory.service.js";

export class CategoryController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Category.getAll()

            return successResponse({ res, data: categories })
        } catch (e) {
            next(e)
        }
    }

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)

        const validate = validatePartialCategory({ id })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        try {
            const category = await SoftDeleteCategory.execute({ id })

            return successResponse({ res, data: category })
        } catch (e) {
            return next(e)
        }
    }


    static create = async (req: Request, res: Response, next: NextFunction) => {
        const name = req.body.name
        const validate = validatePartialCategory({ name })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        const categoryDTO = createCategoryDTO(name)

        try {
            const category = await RegisterCategory.execute({ name: categoryDTO });
            return createdResponse({ res, data: category })
        } catch (e) {
            next(e)
        }
    }

    static activate = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)
        const validate = validatePartialCategory({ id })

        if (validate.error) { return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message))) }

        try {
            const category = await ActivateCategory.execute({ id })

            return successResponse({ res, data: category })
        } catch (e) {
            next(e)
        }
    }

    static updateName = async (req: Request, res: Response, next: NextFunction) => {
        const param = Number(req.params.id)
        const input = req.body
        const validate = validatePartialCategory({ name: input.name, id: param })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        const categoryDTO = createCategoryDTO(input.name)

        try {
            const category = await UpdateCategoryName.execute({ name: categoryDTO, id: param })
            return successResponse({ res, data: category, message: "Categoria Actualizada" })
        } catch (e) {
            next(e)
        }
    }
}