
import { pool } from "../config/database.js";
import { TProduct } from "../dtos/createProduct.dto.js";
import { InventoryMovements } from "../models/inventoryMovements.js";
import { Photos } from "../models/photos.js";
import { Product } from "../models/product.js";
import { StorageService } from "./storage.service.js";

export class RegisterProduct {

    static async execute(input: Omit<TProduct, 'id' | 'state'>, user_id: string, files: Express.Multer.File[]) {
        const { amount, ...productWithoutPhotos } = input

        const uploadedImages: string[] = []


        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const product = await Product.create({ input: productWithoutPhotos, client })

            const photos = []

            for (const [index, file] of files.entries()) {
                const uploaded = await StorageService.uploadImage(file.buffer, "products")

                uploadedImages.push(uploaded.public_id)

                const photo = {
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id,
                    order: index + 1,
                    is_main: index === 0,
                }

                const createdPhoto = await Photos.create({ input: photo, producto_id: product.id, client })

                photos.push(createdPhoto)
            }

            const productAmount = await InventoryMovements.increaseMovement({ product_id: product.id, amount, user_id, client })

            await client.query('COMMIT')

            return {
                ...product,
                amount: productAmount.amount,
                photos
            }
        } catch (e) {
            await client.query('ROLLBACK')

            for (const publicId of uploadedImages) {
                try {
                    await StorageService.deleteImage(publicId)

                } catch (deleteE) {
                    throw deleteE
                }
            }

            throw e
        } finally {
            client.release()
        }
    }
}