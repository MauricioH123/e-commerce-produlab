import { pool } from "../config/database.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Photos } from "../models/photos.js";
import { StorageService } from "./storage.service.js";

export class DeletePhoto {
    static async execute(photo_id: number) {
        const queryGetPhotos = 'SELECT * FROM public.product_images WHERE product_id = $1 ORDER BY id ASC;'
        const queryUpdatePhoto = 'UPDATE public.product_images SET "order"=$1, is_main=$2 WHERE id = $3;'
        const client = await pool.connect()
        const photosArray = []

        try {
            await client.query('BEGIN')

            const dataPhoto = await Photos.getByid({ client, photo_id })

            if (!dataPhoto) {
                throw new NotFoundError('Foto')
            }

            const photos = await client.query(queryGetPhotos, [dataPhoto.product_id])

            if (photos.rowCount === 1) {
                throw new ConflictError()
            }

            for (const photo of photos.rows) {
                photosArray.push(photo)
            }

            const photoDelete = await Photos.delete({ client, photo_id })

            for (const [index, photo] of photosArray.entries()) {
                if(photoDelete.order >= index + 1){
                    continue
                }

                const data = {
                    order: photo.order - 1,
                    is_main: 1 === photo.order - 1,
                    id: photo.id
                }

                await client.query(queryUpdatePhoto, [data.order, data.is_main, data.id])
            }

            await client.query('COMMIT')

            await StorageService.deleteImage(dataPhoto.public_id)

        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }
}