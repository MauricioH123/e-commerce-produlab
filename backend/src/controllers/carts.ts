import { NextFunction, Request, Response } from "express";
import { validateCartItems, validateIdUser } from "../schemas/carts.js";
import { InvalidError } from "../errors/InvalidError.js";
import { Carts } from "../models/carts.js";
import { successResponse } from "../utils/responseHelper.js";
import { UpdateCart } from "../services/updateCart.service.js";

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

    static updateQuantityByUserId = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body
        const user_id = String(req.user.sub)

        const validate = validateCartItems(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const cartItems = await UpdateCart.execute({ user_id, items: validate.data })

            return successResponse({ res, data: cartItems })
        } catch (e) {
            next(e)
        }
    }
}