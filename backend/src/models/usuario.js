import { pool } from "../config/database.js";
import bcrypt from 'bcrypt'


export class User {
    static async getAll({ id }) {
        let query = 'SELECT nombre, numero_identificacion FROM public.usuarios'

        const param = []

        if (id) {
            query = 'SELECT nombre, numero_identificacion FROM public.usuarios WHERE id = $1'
            param.push(id)
        }

        try {
            const result = await pool.query(query, param)

            return result.rows
        } catch (e) {
            throw new Error(`Error al obtener todos los usuarios: ${e.message}`);
        }
    }

    static async createUser({ input }) {
        const {
            nombre,
            correo,
            numero_identificacion,
            contraseña,
            identificacion_id,
            numero_celular
        } = input

        try {
            const existingUserQuery = await pool.query('SELECT use.correo, use.numero_identificacion FROM public.usuarios AS use WHERE correo= $1 OR numero_identificacion = $2;', [correo, numero_identificacion])

            if (existingUserQuery.rows.length > 0) {
                throw new Error('El correo o el número de identificación ya están registrados.')
            }

            const hashedPassword = await bcrypt.hash(contraseña, parseInt(process.env.SALT_ROUNDS, 10))

            const result = await pool.query('INSERT INTO usuarios (nombre, correo ,numero_identificacion, contraseña, identificacion_id, numero_celular) VALUES ($1, $2, $3, $4, $5, $6) RETURNING numero_identificacion',
                [nombre, correo, numero_identificacion, hashedPassword, identificacion_id, numero_celular])

            return result.rows[0]

        } catch (e) {
            throw new Error('Error al crear el usuario  ' + e.message);
        }

    }

    static async delete({ numero_identificacion }) {
        const query = 'DELETE FROM public.usuarios WHERE "numero_identificacion" = $1 RETURNING numero_identificacion;'
        const param = []

        if (!numero_identificacion) {
            throw new Error('No se ingreso un numero de identificacion')
        }

        param.push(numero_identificacion)

        try {
            const result = await pool.query(query, param)
            return result.rows
        } catch (e) {
            throw new Error('Error al eliminar el usuario')
        }
    }

    static async update({ id, input }) {

        try {

        } catch (e) {

        }
    }
}