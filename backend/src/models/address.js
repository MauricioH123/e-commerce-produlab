import { pool } from "../config/database.js"

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
            const result = await db.query('INSERT INTO public.direccion_envios(ciudad, barrio, direccion, codigo_postal, es_pricipal, usuario_id) VALUES ($1, $2, $3, $4, true, $5) RETURNING id', [ciudad, barrio, direccion, codigo_postal, usuario_id])
            return result.rows[0]
        } catch (e) {
                throw e
        }
    }
}