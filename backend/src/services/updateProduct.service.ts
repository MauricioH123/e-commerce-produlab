import { pool } from "../config/database.js";
import { ProductUpate } from "../dtos/createProduct.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Product } from "../models/product.js";

export class UpdateProduct {
    static async execute({ dataProduct, product_id }: { dataProduct: Omit<ProductUpate, 'id'| 'state'>, product_id: number }) {

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const productState = await Product.productState({ product_id, client })

            if (!productState) {
                throw new NotFoundError('Producto')
            }

            const product = await Product.update({ dataProduct, client, product_id })

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