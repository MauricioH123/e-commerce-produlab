import { PoolClient } from "pg"
import { pool } from "../config/database.js"
import { ProductPhoto } from "../dtos/createProduct.dto.js"



export class Photos {
    static async create({ input, producto_id, client }: { input: ProductPhoto, producto_id: number, client: PoolClient }) {
        const { url, order, is_main, alt_text } = input
        const query = `INSERT INTO public.product_images(producto_id, url, "order", is_main, alt_text, created_at) VALUES($1, $2, $3, $4, $5, NOW());`
        const result = await client.query(query, [producto_id, url, order, is_main, alt_text])
        return result.rows[0]
    }
}