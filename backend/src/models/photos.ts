import { PoolClient } from "pg"
import { pool } from "../config/database.js"
import { ProductIndividual, ProductPhoto } from "../dtos/createProduct.dto.js"



export class Photos {
    static async create({ input, producto_id, client }: { input: ProductPhoto, producto_id: number, client: PoolClient }) {
        const { url, order, is_main, public_id } = input
        const query = `INSERT INTO public.product_images(product_id, url, "order", is_main, public_id ) VALUES($1, $2, $3, $4, $5) RETURNING id, product_id, url, public_id, "order", is_main;`
        const result = await client.query(query, [producto_id, url, order, is_main, public_id])
        return result.rows[0]
    }

    static async getByIdProduct({ product_id }: { product_id: number }): Promise<ProductIndividual['photos']> {
        const query = `
        SELECT
        id,
        url,
        is_main,
        order
        FROM public.product_images 
        WHERE producto_id = $1;`

        const result = await pool.query(query, [product_id])

        return result.rows
    }

    static async getByid({ photo_id, client }: { photo_id: number, client: PoolClient }): Promise<{ public_id: string, product_id: number } | null> {
        const query = `SELECT public_id, product_id FROM public.product_images WHERE id = $1;`

        const result = await client.query(query, [photo_id])

        return result.rows[0] || null
    }


    static async delete({ photo_id, client }: { photo_id: number, client: PoolClient }): Promise<{ order: number }> {
        const query = `DELETE FROM public.product_images WHERE id = $1 RETURNING "order";`

        const result = await client.query(query, [photo_id])

        return result.rows[0]
    }

    static async update({ url, photo_id, public_id, client }: { url: string, photo_id: number, public_id: string, client: PoolClient }): Promise<{ url: string, id: number }> {
        const query = `UPDATE public.product_images SET url=$1, public_id=$2 WHERE id = $3 RETURNING url, id;`

        const result = await client.query(query, [url, public_id, photo_id])

        return result.rows[0]
    }
}