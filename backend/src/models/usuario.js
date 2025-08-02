import { pool } from "../config/database.js";


export class Usuario {
    static async getAll() {
        const result = await pool.query('SELECT * FROM usuarios')
        return result.rows
    }

    static async createUser({ input }) {
        const {
            nombre,
            direccion,
            correo,
            numero_identificacion,
            contraseña,
            identificacion_id,
            numero_celular
        } = input

        try {
            const result = await pool.query('INSERT INTO usuarios (nombre, direccion, correo ,numero_identificacion, contraseña, identificacion_id, numero_celular) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nombre, direccion, correo, numero_identificacion, contraseña, identificacion_id, numero_celular])
            return result

        } catch (e) {
            throw new Error('Error al crear el usuario')
        }

    }
}