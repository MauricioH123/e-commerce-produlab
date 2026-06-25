import { PoolClient } from "pg";
import { pool } from "../config/database.js";
import { TProduct } from "../dtos/createProduct.dto.js";

type ProductosPage = {
    data: any,
    total: number,
    page: number,
    totalPages: number
}

export class Product {

    static async getAll({ name, page, limit }: { name: string, page: number, limit: number }): Promise<ProductosPage> {
        const offset = (page - 1) * limit
        let query = `SELECT id, name, description, category_id, state, iva, price, brand_id FROM products`
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