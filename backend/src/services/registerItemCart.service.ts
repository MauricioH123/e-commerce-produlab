import { DatabaseError } from "pg"
import { pool } from "../config/database.js"
import { InsertItemIntoCart } from "../dtos/createCart.dto.js"
import { InvalidError } from "../errors/InvalidError.js"
import { NotFoundError } from "../errors/NotFoundError.js"
import { Carts } from "../models/carts.js"
import { InventoryMovements } from "../models/inventoryMovements.js"
import { ConflictError } from "../errors/ConflictError.js"

export class RegisterItemCart {
    static async execute({ user_id, item }: { user_id: string, item: Omit<InsertItemIntoCart, 'cart_id'> }) {
        const queryCart = 'SELECT id FROM public.carts WHERE user_id = $1 AND state = true FOR UPDATE;'
        const queryProduct = `SELECT id FROM public.products WHERE id = $1 FOR UPDATE;`
        const queryProductCart = `
        SELECT
        ci.id AS item_id,
        p.id AS product_id,
        p.name,
        b.name AS brand,
        ci.amount,
        p.price,
        pi.url
        FROM public.products AS p
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id AND pi.is_main = true
        INNER JOIN public.brands AS b ON p.brand_id = b.id
        INNER JOIN public.cart_items AS ci ON p.id = ci.product_id
        WHERE p.id = $1 AND ci.cart_id = $2;`
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
                throw new InvalidError('Dato invalido', 'La cantidad solicitada supera el stock disponible')
            }

            await Carts.insertItem({ product_id: item.product_id, amount: item.amount, cart_id }, client)

            const dataNewItem = await client.query(queryProductCart, [product.rows[0].id, cart_id])

            await client.query('COMMIT')

            return dataNewItem.rows[0]
        } catch (e) {
            await client.query('ROLLBACK')

            if (e instanceof DatabaseError) {
                if (e.code === '23505') {
                    throw new ConflictError('Producto duplicado')
                }
            }

            throw e
        } finally {
            client.release()
        }

    }
}