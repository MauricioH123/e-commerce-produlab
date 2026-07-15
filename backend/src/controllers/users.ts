import { User } from "../models/user.js"
import { Request, Response, NextFunction } from "express"
import { successResponse } from "../utils/responseHelper.js"

export class UsuarioController {

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

}