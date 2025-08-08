import { pool } from "../config/database.js";
import bcrypt from 'bcrypt'


export class User {
    static async getAll({ id }) {
        let query = 'SELECT id, nombre, numero_identificacion FROM public.usuarios'

        const param = []

        if (id) {
            query = 'SELECT id, nombre, numero_identificacion FROM public.usuarios WHERE id = $1'
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

    static async delete({ id }) {
        if (!id) {
            throw new Error('No se ingreso el id del usuario')
        }

        const query = 'DELETE FROM public.usuarios WHERE "id" = $1 RETURNING numero_identificacion;'
        const param = []

        param.push(id)

        try {
            const result = await pool.query(query, param)
            return result.rows
        } catch (e) {
            throw new Error('Error al eliminar el usuario')
        }
    }

    static async getProfile({ id }) {
        if (!id) {
            throw new Error('No se ha asignado un ID de usuario')
        }

        const query = `
        SELECT
            use.nombre,
            use.correo,
            use.numero_identificacion,
            ide.nombre AS tipo_identificacion,
            use.numero_celular,
            dir.ciudad, 
            dir.barrio, 
            dir.direccion, 
            dir.codigo_postal
        FROM public.usuarios AS use
        JOIN public.direccion_envios AS dir ON use.id = dir.usuario_id
        JOIN public.identificaciones AS ide ON use.identificacion_id = ide.id
        WHERE use.id = $1;
        `
        const param = [id]

        try {
            const result = await pool.query(query, param)
            return result.rows[0]
        } catch (e) {
            throw new Error('Error al obtener los datos del usuario: ' + e.message)
        }
    }

    static async update({ id, input }) {
        const {
            correo,
            numero_celular,
            ciudad,
            barrio,
            direccion,
            codigo_postal,
        } = input

        const userQuery = `
        UPDATE public.usuarios
            SET correo= $1, numero_celular= $2
        WHERE id = $3 ;
        `

        const addressQuery = `
        UPDATE public.direccion_envios
            SET ciudad=$1, barrio=$2, direccion=$3, codigo_postal=$4
	    WHERE usuario_id=$5;
        `

        try {
            const userResult = await pool.query(userQuery, [correo, numero_celular, id])
            const addressResult = await pool.query(addressQuery, [ciudad, barrio, direccion, codigo_postal, id])
            return {
                ...userResult.rows[0],
                direccion_info: addressResult.rows[0]
            }
        } catch (e) {
            throw new Error('No FNFN ' + e.message)
        }
    }
}