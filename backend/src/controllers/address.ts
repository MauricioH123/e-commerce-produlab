import { Request, Response, NextFunction } from "express"
import { InvalidError } from "../errors/InvalidError.js"
import { validateUpdateAddress } from "../schemas/address.js"
import { updateAddress } from "../dtos/createAddress.dto.js"
import { UpdateAddress } from "../services/updateAddress.service.js"
import { successResponse } from "../utils/responseHelper.js"

export class AddressController {

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const body = {
            ...req.body,
            id: Number(req.params.id)
        }

        if (Object.keys(body).length === 1) {
            return next(new InvalidError('Datos invalidos', 'No hay campos para actualizar'))
        }

        const validate = validateUpdateAddress(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        const addressDTO = updateAddress(validate.data)

        try {
            const address = await UpdateAddress.execute({ dataAddress: addressDTO, address_id: body.id })

            return successResponse({ res, data: address })
        } catch (e) {
            next(e)
        }

    }


}