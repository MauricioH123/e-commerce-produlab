import { pool } from "../config/database.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Photos } from "../models/photos.js";
import { StorageService } from "./storage.service.js";

export class UpdatePhoto {
    static async execute({ photo_id, file }: { photo_id: number, file: Express.Multer.File }) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const dataPhoto = await Photos.getByid({ photo_id, client })

            if (!dataPhoto) {
                throw new NotFoundError('Foto')
            }
            const uploaded = await StorageService.uploadImage(file.buffer, "products")

            const newPhoto = await Photos.update({ url: uploaded.secure_url, photo_id, public_id: uploaded.public_id, client })

            await client.query('COMMIT')
            await StorageService.deleteImage(dataPhoto.public_id)

            return newPhoto
        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }
    }
}