import { pool } from "../config/database.js";

type ProductosPage = {
    data: any,
    total: number,
    page: number,
    totalPages: number
}

export class Product {

    static async getAll({ name, page, limit }: { name: string, page: number, limit: number }): Promise<ProductosPage> {
        const offset = (page - 1) * limit
        let query = `SELECT id, nombre, descripcion, foto, categoria_id, activo, iva, precio, marca_id FROM productos`
        const params = []

        if (name) {
            query += ` WHERE nombre = $1`
            params.push(name)
        }

        query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
        params.push(limit, offset)

        const result = await pool.query(query, params)

        const data = result.rows

        let totalQuery = 'SELECT COUNT(*) FROM productos'
        const totalParams = []

        if (name) {
            totalQuery += ` WHERE nombre = $1`
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
}