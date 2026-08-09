import { NextFunction, Request, Response } from "express";
import { validateMovement } from "../schemas/inventoryMovement.js";
import { InvalidError } from "../errors/InvalidError.js";
import { RegisterInventory } from "../services/registerInventory.service.js";
import { successResponse } from "../utils/responseHelper.js";

export class inventoryMovementsController {
    static createMovement = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.user.sub)
        const body = req.body

        const validate = validateMovement(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const movements = await RegisterInventory.execute({ user_id, body: validate.data })

            return successResponse({ res })
        } catch (e) {
            next(e)
        }
    }
}