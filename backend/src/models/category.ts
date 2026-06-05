import { pool } from "../config/database.js";

export type CategoryProps = {
    id?: number,
    name?: string,
    state?: boolean
}

export class Category {

    static async getAll() {
        const query = 'SELECT * FROM public.categories;'

        const result = await pool.query(query)

        return result.rows
    }


    static async delete({ id }: { id: number }): Promise<CategoryProps> {
        const query =
            "UPDATE categories SET state = false, elimination_date = CURRENT_DATE WHERE id = $1 AND state = true AND NOT EXISTS (SELECT 1 FROM productos WHERE productos.categoria_id = categories.id AND productos.activo = true) RETURNING id, name, state;"
        const result = await pool.query(query, [id])
        return result.rows[0] ?? null
    }


    static async create({ name }: { name: string }): Promise<Array<CategoryProps>> {
        const query = 'INSERT INTO public.categories(name, creation_date) VALUES($1, CURRENT_DATE) RETURNING id, name, state;'

        const result = await pool.query(query, [name])
        return result.rows
    }

    static async activate({ id }: { id: number }): Promise<CategoryProps> {
        const query = "UPDATE categories SET state = true, activation_date = CURRENT_DATE WHERE id = $1 AND state = false RETURNING id, name, state;"
        const result = await pool.query(query, [id])
        return result.rows[0] ?? null
    }

    static async updateName({ name, id }: { name: string, id: number }): Promise<CategoryProps> {
        const query = "UPDATE categories SET name = $1, update_date = CURRENT_DATE WHERE id= $2 RETURNING id, name, state"
        const result = await pool.query(query, [name, id])
        return result.rows[0] ?? null
    }
}