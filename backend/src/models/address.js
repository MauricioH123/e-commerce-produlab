import { pool } from "../config/database"

export class Address {
    static async createAddress({ input, client }) {
        const db = client ?? pool

        const input = {
            ciudad,
            barrio,
            direccion,
            codigo_postal,
            usuario_id
        }

        try {
            const result = await db.query('INSERT INTO public.direccion_envios(ciudad, barrio, direccion, codigo_postal, es_pricipal, usuario_id) VALUES (?, ?, ?, ?, true, ?)', [ciudad, barrio, direccion, codigo_postal, usuario_id])
            return result.rows[0]
        }catch(e){
            if(e){
                
            }
        }

    }
}