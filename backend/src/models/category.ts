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


    static async delete({ id }: { id: number }): Promise<number> {
        const query =
            "UPDATE categories SET state = false WHERE id = $1 AND state = true AND NOT EXISTS ( SELECT 1 FROM productos WHERE productos.categoria_id = categories.id ) RETURNING id, state;"
        const result = await pool.query(query, [id])
        return result.rowCount ?? 0
    }


    static async create({ name }: { name: string }): Promise<Array<CategoryProps>> {
        const query = 'INSERT INTO public.categories(name) VALUES($1) RETURNING id, name, state;'

        const result = await pool.query(query, [name])
        return result.rows
    }

    static async activate({ id }: { id: number }): Promise<number> {
        const query = "UPDATE categories SET state = true WHERE id = $1 AND state = false RETURNING id;"
        const result = await pool.query(query, [id])
        return result.rowCount ?? 0
    }
}