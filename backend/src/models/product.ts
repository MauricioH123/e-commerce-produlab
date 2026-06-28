import { PoolClient } from "pg";
import { pool } from "../config/database.js";
import { ProductMain, TProduct } from "../dtos/createProduct.dto.js";

type ProductosPage = {
    products: ProductMain[],
    total: number,
    page: number,
    totalPages: number
}

export class Product {

    static async getAll({ page, limit }: { page: number, limit: number }): Promise<ProductosPage> {
        const offset = (page - 1) * limit
        let query = `
        SELECT 
        p.id, 
        p.name, 
        p.category_id, 
        c.name AS category, 
        p.iva, 
        p.price, 
        p.brand_id, 
        m.nombre AS brand, 
        pi.id AS id_image, 
        pi.url, 
        pi.alt_text 
        FROM public.products AS p 
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id AND pi.is_main = TRUE 
        INNER JOIN public.categories AS c ON p.category_id = c.id 
        INNER JOIN public.marcas AS m ON p.brand_id = m.id
        WHERE p.state = TRUE
        ORDER BY p.id
        LIMIT 10 
        OFFSET $1;`

        const queryCount = 'SELECT COUNT(*) FROM public.products WHERE TRUE'

        const result = await pool.query(query, [offset])
        const resultCount = await pool.query(queryCount)
        const total = resultCount.rows[0].count

        return {
            products: result.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    static async create({ input, client }: { input: Omit<TProduct, 'photos' | 'id'>, client: PoolClient }): Promise<Omit<TProduct, 'photos'>> {
        const values = [
            input.name,
            input.description,
            input.category_id,
            input.price,
            input.brand_id,
            input.iva
        ]
        const query = 'INSERT INTO public.products (name, description, category_id, price, brand_id, iva, creation_date, activation_date) VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, name, description, category_id, price, brand_id, iva;'
        const result = await client.query(query, values)
        return result.rows[0]
    }
}