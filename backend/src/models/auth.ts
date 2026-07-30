import { PoolClient } from "pg"
import { TUser, UserLogin } from "../dtos/createUser.dto.js"
import { pool } from "../config/database.js"

export class Auth {

    static async create({ user, client }: { user: Omit<TUser, 'addresses' | 'state' | 'rol_id' | 'id'>, client: PoolClient }) {
        const values = [
            user.name,
            user.email,
            user.identification_number,
            user.password,
            user.identification_id,
            user.phone_number
        ]

        const query = `
        INSERT INTO public.users(
        name, email, identification_number, password, identification_id, rol_id, state, phone_number, creation_date)
        VALUES($1, $2, $3, $4, $5, 1, true, $6, NOW()) RETURNING id, rol_id, name;`

        const result = await client.query(query, values)

        return result.rows[0]
    }

    static async findByEmail(email: string): Promise<UserLogin | null> {
        const query = `SELECT password, state, id, rol_id FROM public.users WHERE email = $1;`

        const result = await pool.query(query, [email])

        return result.rows[0] ?? null
    }

    static async findById(id: string) {
        const query = `SELECT id, rol_id FROM public.users WHERE id = $1;`

        const result = await pool.query(query, [id])

        return result.rows[0]

    }
}