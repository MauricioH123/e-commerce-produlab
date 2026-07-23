
import { pool } from "../config/database.js";
import { TProduct } from "../dtos/createProduct.dto.js";

import { Photos } from "../models/photos.js";
import { Product } from "../models/product.js";

export class RegisterProduct {

    static async execute(input: Omit<TProduct, 'id'>) {
        const { photos, ...productWithoutPhotos } = input


        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const product = await Product.create({ input: productWithoutPhotos, client })

            for (const photo of photos) {
                await Photos.create({ input: photo, producto_id: product.id, client })
            }

            await client.query('COMMIT')

            return product
        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }
    }
}