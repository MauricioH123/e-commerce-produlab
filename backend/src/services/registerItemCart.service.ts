import { pool } from "../config/database.js"
import { InsertItemIntoCart } from "../dtos/createCart.dto.js"
import { InvalidError } from "../errors/InvalidError.js"
import { NotFoundError } from "../errors/NotFoundError.js"
import { Carts } from "../models/carts.js"
import { InventoryMovements } from "../models/inventoryMovements.js"

export class RegisterItemCart {
    static async execute({ user_id, item }: { user_id: string, item: Omit<InsertItemIntoCart, 'cart_id'> }) {
        const queryCart = 'SELECT id FROM public.carts WHERE user_id = $1 AND state = true;'
        const queryProduct = `SELECT id FROM public.products WHERE id = $1 FOR UPDATE;`
        const client = await pool.connect()
        let cart_id

        try {
            await client.query('BEGIN')

            const cart = await client.query(queryCart, [user_id])

            if (cart.rows.length === 0) {
                const newCart = await Carts.createCart(user_id, client)
                cart_id = newCart.id
            } else {
                cart_id = cart.rows[0].id
            }


            const product = await client.query(queryProduct, [item.product_id])

            if (product.rows.length === 0) {
                throw new NotFoundError('Producto')
            }

            const stock = await InventoryMovements.getStock(item.product_id, client)

            if (stock.total_amount < item.amount) {
                throw new InvalidError('Dato invalido', 'La cantidad a eliminar es mayor al total del stock')
            }

            const newItem = await Carts.insertItem({ product_id: item.product_id, amount: item.amount, cart_id }, client)

            await client.query('COMMIT')

            return newItem
        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }

    }
}