import { pool } from "../config/database.js"
import { NotFoundError } from "../errors/NotFoundError.js"

export class Address {
    static async create({ input, client }) {
        const db = client ?? pool


        const {
            ciudad,
            barrio,
            direccion,
            codigo_postal,
            usuario_id
        } = input

        try {
            const result = await db.query('INSERT INTO public.direccion_envios(ciudad, barrio, direccion, codigo_postal, es_principal, usuario_id) VALUES ($1, $2, $3, $4, true, $5) RETURNING id', [ciudad, barrio, direccion, codigo_postal, usuario_id])
            return result.rows[0]
        } catch (e) {
            throw e
        }
    }

    static async getByUserId({ id }) {
        const query = `
        SELECT ciudad, barrio, direccion, codigo_postal, es_principal
        FROM public.direccion_envios
        WHERE usuario_id = $1;`

        const result = await pool.query(query, [id])

        if(result.rowCount === 0){
            throw new NotFoundError('Direccion')
        }

        return result.rows
    }
}