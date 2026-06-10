import { pool } from "../config/database.js";
import { ProductS } from "../dtos/createProduct.dto.js";

type ProductosPage = {
    data: any,
    total: number,
    page: number,
    totalPages: number
}

export class Product {

    static async getAll({ name, page, limit }: { name: string, page: number, limit: number }): Promise<ProductosPage> {
        const offset = (page - 1) * limit
        let query = `SELECT id, name, description, photo, category_id, state, iva, price, brand_id FROM products`
        const params = []

        if (name) {
            query += ` WHERE name = $1`
            params.push(name)
        }

        query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
        params.push(limit, offset)

        const result = await pool.query(query, params)

        const data = result.rows

        let totalQuery = 'SELECT COUNT(*) FROM products'
        const totalParams = []

        if (name) {
            totalQuery += ` WHERE name = $1`
            totalParams.push(name)
        }

        const totalResult = await pool.query(totalQuery, totalParams)
        const total = parseInt(totalResult.rows[0].count)

        return {
            data: data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    static async create({ input }: { input: ProductS }): Promise<ProductS> {
        const values = [
            input.name,
            input.description,
            input.category_id,
            input.price,
            input.brand_id,
            JSON.stringify(input.photo),
            input.iva
        ]
        const query = 'INSERT INTO public.products (name, description, category_id, price, brand_id, photo, iva, creation_date, activation_date) VALUES($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, CURRENT_DATE) RETURNING id, name, description, category_id, price, brand_id, photo;'
        const result = await pool.query(query, values)
        return result.rows[0]
    }
}