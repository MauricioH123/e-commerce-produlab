import { User } from "../models/user.js"
import { Request, Response, NextFunction } from "express"
import { successResponse } from "../utils/responseHelper.js"
import { validatePartialUser } from "../schemas/users.js"
import { InvalidError } from "../errors/InvalidError.js"
import { GetUserProfile } from "../services/getUserProfile.service.js"

export class UserController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        try {
            const profiles = await User.getAll({ page, limit })
            return successResponse({ res, data: profiles })
        } catch (e) {
            next(e)
        }
    }

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.params.id)
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        if (page < 1 || limit < 1 || limit > 100) {
            return next(new InvalidError('Parámetros de paginación inválidos', 'Solo numero positivos'))
        }

        const validate_id = validatePartialUser({ id: user_id })

        if (!validate_id.success) {
            return next(new InvalidError('Datos invalidos', validate_id.error.issues))
        }

        try {
            const user = await GetUserProfile.execute({ user_id, page, limit })

            return successResponse({ res, data: user })
        } catch (e) {
            next(e)
        }
    }
}