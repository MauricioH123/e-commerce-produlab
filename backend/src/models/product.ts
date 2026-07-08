import { PoolClient } from "pg";
import { pool } from "../config/database.js";
import { ProductIndividual, ProductMain, TProduct } from "../dtos/createProduct.dto.js";

type ProductosPage = {
    products: ProductMain[],
    total: number,
    page: number,
    totalPages: number
}

export class Product {

    static async getAll({ page, limit, category_id, brand_id }: { page: number, limit: number, category_id: number, brand_id: number }): Promise<ProductosPage> {
        const offset = (page - 1) * limit

        let query = `
        SELECT 
        p.id, 
        p.name, 
        c.name AS category, 
        p.iva, 
        p.price, 
        m.nombre AS brand, 
        pi.id AS id_image, 
        pi.url, 
        pi.alt_text 
        FROM public.products AS p 
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id AND pi.is_main = TRUE 
        INNER JOIN public.categories AS c ON p.category_id = c.id 
        INNER JOIN public.marcas AS m ON p.brand_id = m.id`

        let queryCountProduct = `
        SELECT COUNT(*)FROM public.products AS p 
        INNER JOIN public.product_images AS pi ON p.id = pi.producto_id AND pi.is_main = TRUE 
        INNER JOIN public.categories AS c ON p.category_id = c.id 
        INNER JOIN public.marcas AS m ON p.brand_id = m.id`

        let where = ' WHERE p.state = TRUE '
        const params = []

        if (category_id) {
            params.push(category_id)
            where += `AND c.id = $${params.length} `
        }

        if (brand_id) {
            params.push(brand_id)
            where += `AND m.id = $${params.length} `
        }

        queryCountProduct += where
        const resultCountProduct = await pool.query(queryCountProduct, params)

        params.push(limit, offset)
        query += where
        query += `ORDER BY p.id LIMIT $${params.length - 1} OFFSET $${params.length}`

        const result = await pool.query(query, params)
        const total = Number(resultCountProduct.rows[0].count)

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

    static async getById({ id }: { id: TProduct["id"] }): Promise<Omit<ProductIndividual, 'photos'> | null> {
        const query = `
        SELECT
        p.id,
        p.name AS name,
        p.description,
        p.price,
        p.iva,
        m.nombre AS brand,
        c.name AS category
        FROM public.products AS p
        INNER JOIN public.marcas AS m ON p.brand_id = m.id
        INNER JOIN public.categories AS c ON p.category_id = c.id
        WHERE p.id = $1;`

        const result = await pool.query(query, [id])

        return result.rows[0] ?? null
    }
}