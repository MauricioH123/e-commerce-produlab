import { pool } from "../config/database.js";
import { UpdateCartItem } from "../dtos/createCart.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Carts } from "../models/carts.js";

export class UpdateCart {
    static async execute({ user_id, items }: { user_id: string, items: UpdateCartItem[] }) {

        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            const updateItems: UpdateCartItem[] = []

            for (const item of items) {
                const product = await Carts.updateQuantityByUserId({ user_id, item, client })
                if (!product) {
                    throw new NotFoundError('Producto del carrito')
                }
                updateItems.push(product)
            }

            await client.query('COMMIT')

            return updateItems
        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }
    }
}