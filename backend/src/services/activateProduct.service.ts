import { pool } from "../config/database.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Product } from "../models/product.js";

export class ActivateProduct {
    static async execute(product_id: number) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const productState = await Product.productState({ product_id, client })

            if (!productState) {
                throw new NotFoundError()
            }

            if (productState.state === true) {
                return {
                    id: product_id,
                    message: 'El producto ya se encontroba activado'
                }
            }

            const activateProduct = await Product.activate({ product_id, client })

            await client.query('COMMIT')

            return {
                id: activateProduct.id,
                message: 'Producto activado exitosamente'
            }

        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }
}