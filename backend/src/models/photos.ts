import { PoolClient } from "pg"
import { pool } from "../config/database.js"
import { ProductIndividual, ProductPhoto } from "../dtos/createProduct.dto.js"



export class Photos {
    static async create({ input, producto_id, client }: { input: ProductPhoto, producto_id: number, client: PoolClient }) {
        const { url, order, is_main, public_id } = input
        const query = `INSERT INTO public.product_images(producto_id, url, "order", is_main, public_id ) VALUES($1, $2, $3, $4, $5) RETURNING id, producto_id, url, public_id, "order", is_main;`
        const result = await client.query(query, [producto_id, url, order, is_main, public_id])
        return result.rows[0]
    }

    static async getByIdProduct({ product_id }: { product_id: number }): Promise<ProductIndividual['photos']> {
        const query = `
        SELECT
        id,
        url,
        is_main,
        alt_text
        FROM public.product_images 
        WHERE producto_id = $1;`

        const result = await pool.query(query, [product_id])

        return result.rows
    }
}