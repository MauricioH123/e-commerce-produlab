import { pool } from "../config/database.js"
import { CartItem } from "../dtos/createCart.dto.js"

export class Carts {
    static async getByIdUser(user_id: string): Promise<CartItem[] | null> {
        const query = `
        SELECT ci.id, p.name, pi.url AS image_url, ci.amount, p.price
        FROM public.carts AS c
        INNER JOIN public.cart_items AS ci ON c.id = ci.cart_id
        INNER JOIN public.products AS p ON ci.product_id = p.id
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id
        WHERE c.state = true AND c.user_id = $1 AND pi.is_main = true;
        `
        const result = await pool.query(query, [user_id])

        return result.rows || null
    }
}