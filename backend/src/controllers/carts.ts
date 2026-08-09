import { NextFunction, Request, Response } from "express";
import { validateCartItems, validateIdUser, validateInsertItem, validateItemId } from "../schemas/carts.js";
import { InvalidError } from "../errors/InvalidError.js";
import { Carts } from "../models/carts.js";
import { deletedResponse, successResponse } from "../utils/responseHelper.js";
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

    static deleteItemById = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.user.sub)
        const product_id = Number(req.params.product_id)

        const validate = validateItemId({ product_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }


        try {
            const item = await Carts.deleteItemById({ user_id, product_id: validate.data.product_id })

            return deletedResponse({ res })
        } catch (e) {
            next(e)
        }
    }

    static insertItem = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.user.sub)
        const body = req.body

        const validate = validateInsertItem(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try{
            const item = []
        }catch(e){

        }
    }
}