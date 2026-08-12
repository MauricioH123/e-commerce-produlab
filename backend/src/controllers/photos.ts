import { NextFunction, Request, Response } from "express";
import { validateDeletePhoto, validateUpdatePhoto } from "../schemas/photos.js";
import { InvalidError } from "../errors/InvalidError.js";
import { deletedResponse, successResponse } from "../utils/responseHelper.js";
import { DeletePhoto } from "../services/deletePhoto.service.js";
import { UpdatePhoto } from "../services/updatePhoto.service.js";

export class PhotosController {
    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const photo_id = Number(req.params.id)

        const validate = validateDeletePhoto({ id: photo_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', 'El valor debe ser numerico'))
        }

        try {
            const photo = await DeletePhoto.execute(validate.data.id)

            return deletedResponse({ res })
        } catch (e) {
            next(e)
        }
    }

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const photo_id = Number(req.params.id)
        const file = req.file

        if (!file) {
            return next(new InvalidError('Datos invalidos', 'El producto debe tener al menos una foto'))
        }

        const validate = validateUpdatePhoto({ id: photo_id })

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', 'No hay campos para actualizar'))
        }

        try {
            const photo = await UpdatePhoto.execute({ photo_id, file })

            return successResponse({ res, data: photo })
        } catch (e) {
            next(e)
        }
    }
}