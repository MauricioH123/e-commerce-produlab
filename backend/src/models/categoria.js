import { pool } from "../config/database.js";

export class Category {

    static async getAll() {
        const query = 'SELECT id, nombre FROM public.categorias'

        try {
            const result = await pool.query(query)

            return result.rows
        } catch (e) {
            throw new Error('No se pudo obtener las categorias ' + e.message);
        }
    }

    static delete() {

    }

    static create() {

    }
}