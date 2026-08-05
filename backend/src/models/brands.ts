import { pool } from "../config/database.js"
import { TBrand } from "../dtos/CreateBrand.dto.js"

export class Brands {
    static async create(name: string): Promise<TBrand> {
        const query = `INSERT INTO public.brands(name) VALUES ($1) RETURNING id, name;`
        const result = await pool.query(query, [name])

        return result.rows[0]
    }

    static async getAll(): Promise<TBrand[]> {
        const query = `SELECT * FROM public.brands;`
        const result = await pool.query(query)

        return result.rows
    }

    static async update(input: TBrand): Promise<TBrand | null> {
        const query = `UPDATE public.brands SET name = $1 WHERE id = $2 RETURNING id, name;`
        const result = await pool.query(query, [input.name, input.id])

        return result.rows[0] || null
    }
}