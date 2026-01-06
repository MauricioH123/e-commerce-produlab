import { pool } from "../config/database.js";


export class Product {

    static async getAll({ nombre, page, limit }) {
        const offset = (page - 1) * limit
        let query = `SELECT id, nombre, descripcion, foto, categoria_id, activo, iva, precio, marca_id FROM productos`
        const params = []

        if (nombre) {
            query += ` WHERE nombre = $1`
            params.push(nombre)
        }

        query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
        params.push(limit, offset)

        try {
            const result = await pool.query(query, params)

            const data = result.rows

            let totalQuey = 'SELECT COUNT(*) FROM productos'
            const totalParams = []

            if (nombre) {
                totalQuey += ` WHERE nombre = $1`
                totalParams.push(nombre)
            }

            const totalResult = await pool.query(totalQuey, totalParams)
            const total = parseInt(totalResult.rows[0].count)

            return {
                data: data,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }

        } catch (e) {
            throw new Error(`Error al obtener todos los productos: ${e.message}`);
        }
    }
}