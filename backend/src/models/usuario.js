import { pool } from "../config/database.js";
import bcrypt from 'bcrypt'
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { DatabaseError } from "pg";


export class User {

    static async getAll({ page, limit }) {
        const offset = (page - 1) * limit

        const query = 'SELECT id, nombre, numero_identificacion FROM public.usuarios ORDER BY fecha_creacion DESC LIMIT $1 OFFSET $2;'

        const countQuery = 'SELECT COUNT(*) FROM public.usuarios'


        try {
            const [dataResult, countResult] = await Promise.all([
                pool.query(query, [limit, offset]),
                pool.query(countQuery)
            ])

            const total = parseInt(countResult.rows[0].count)

            return {
                users: dataResult.rows,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        } catch (e) {
            throw e
        }
    }

    static async create({ input, client }) {
        const db = client ?? pool

        const {
            nombre,
            correo,
            numero_identificacion,
            contraseña,
            identificacion_id,
            numero_celular
        } = input

        try {

            const hashedPassword = await bcrypt.hash(contraseña, parseInt(process.env.SALT_ROUNDS, 10))

            const result = await db.query('INSERT INTO usuarios (nombre, correo ,numero_identificacion, contraseña, identificacion_id, numero_celular, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE) RETURNING id',
                [nombre, correo, numero_identificacion, hashedPassword, identificacion_id, numero_celular])

            return result.rows[0]

        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictError("El correo o el número de identificación ya están registrados.")
            }

            throw e
        }

    }

    static async delete({ id }) {

        const query = 'UPDATE public.usuarios SET activo = false, fecha_actualizacion = CURRENT_DATE WHERE id = $1 RETURNING nombre;'

        try {
            const result = await pool.query(query, [id])

            if(result.rowCount === 0){
                throw new NotFoundError('Usuario')
            }

            return result.rows[0]
        } catch (e) {
            if(e.isOperational){
                throw e
            }

            if(e.code === '23503'){
                throw new DatabaseError('No se puede eliminar el usuario porque tiene registros relacionados', e)
            }

            throw new DatabaseError('Error al eliminar el usuario', e)
        }
    }

    static async getProfile({ id }) {

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
        try {
            const result = await pool.query(query, [id])
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