import { pool } from "../config/database.js";
import { InvalidError } from "../errors/InvalidError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Product } from "../models/product.js";

export class softDeleteProduct {
    static async execute(product_id: number) {

        const client = await pool.connect()

        try {

            await client.query('BEGIN')

            const product = await Product.productState({ product_id, client })

            if (!product) {
                throw new NotFoundError('Producto')
            }

            if (product.state === false) {
                await client.query('COMMIT')
                return {
                    id: product_id,
                    message: "El producto ya se encontroba eliminado"
                }
            }

            const deleteProduct = await Product.delete({ product_id, client })

            await client.query('COMMIT')

            return {
                id: deleteProduct.id,
                message: "Producto eliminado exitosamente"
            }
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }

    }
}