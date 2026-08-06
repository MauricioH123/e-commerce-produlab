import { NextFunction, Request, Response } from "express";
import { validateIdUser } from "../schemas/carts.js";
import { InvalidError } from "../errors/InvalidError.js";
import { Carts } from "../models/carts.js";
import { successResponse } from "../utils/responseHelper.js";

export class CartsController {
    static getByIdUser = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.user.sub)

        const validate = validateIdUser({ user_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const cart = await Carts.getByIdUser(validate.data.user_id)

            return successResponse({ res, data: cart })
        } catch (e) {
            next(e)
        }
    }
}