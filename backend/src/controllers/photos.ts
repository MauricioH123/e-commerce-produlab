import { NextFunction, Request, Response } from "express";
import { deletePhoto } from "../schemas/photos.js";
import { InvalidError } from "../errors/InvalidError.js";
import { deletedResponse } from "../utils/responseHelper.js";
import { DeletePhoto } from "../services/deletePhoto.service.js";

export class PhotosController {
    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const photo_id = Number(req.params.id)

        const validate = deletePhoto({ id: photo_id })

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
}