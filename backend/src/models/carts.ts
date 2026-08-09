import { PoolClient } from "pg"
import { pool } from "../config/database.js"
import { CartItem, UpdateCartItem } from "../dtos/createCart.dto.js"

export class Carts {
    static async getByIdUser(user_id: string): Promise<CartItem[] | null> {
        const query = `
        SELECT ci.id, p.id AS product_id, p.name, pi.url AS image_url, ci.amount, p.price
        FROM public.carts AS c
        INNER JOIN public.cart_items AS ci ON c.id = ci.cart_id
        INNER JOIN public.products AS p ON ci.product_id = p.id
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id
        WHERE c.state = true AND c.user_id = $1 AND pi.is_main = true;
        `
        const result = await pool.query(query, [user_id])

        return result.rows || null
    }

    static async updateQuantityByUserId({ user_id, item, client }: { user_id: string, item: UpdateCartItem, client: PoolClient }): Promise<UpdateCartItem | null> {
        const { id, product_id, amount } = item
        const query = `
        UPDATE public.cart_items
        SET amount = $1
        WHERE 
        cart_id = (SELECT id FROM public.carts WHERE user_id = $2 AND state = true) 
        AND 
        product_id = $3 RETURNING id, product_id, amount;`

        const result = await client.query(query, [amount, user_id, product_id])

        return result.rows[0] || null
    }

    static async deleteItemById({ user_id, product_id }: { user_id: string, product_id: number }) {
        const query = `
        DELETE FROM public.cart_items
        WHERE cart_id = (SELECT id FROM public.carts WHERE user_id = $1 AND state = true) AND product_id = $2;`

        const result = await pool.query(query, [user_id, product_id])

        return result.rows[0]
    }

    static async insertItem(){
        const query = `INSERT`
    }
}