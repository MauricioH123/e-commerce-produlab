import { pool } from "../config/database.js";


export class Usuario {
    static async getAll() {
        const result = await pool.query('SELECT * FROM usuarios')
        return result
    }

    static async createUser({ input }) {
        const {
            nombre,
            direccion,
            correo,
            numero_identificacion,
            contraseña,
            identificacion_id,
            roles_id
        } = input

        try {
            const result = await pool.query('INSERT INTO usuarios (nombre, direccion, correo ,numero_identificacion, contraseña, identificacion_id, roles_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, direccion, correo, numero_identificacion, contraseña, identificacion_id, roles_id])
            return result

        } catch (e) {
            console.log(e.message)
        }

    }
}