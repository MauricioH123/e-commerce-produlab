import { pool } from "../config/database.js";

export class Category {

    static async getAll() {
        const query = 'SELECT id, nombre FROM public.categorias'

        try {
            const result = await pool.query(query)

            return result.rows
        } catch (e) {
            throw new Error('No se pudo obtener las categorias ' + e.message);
        }
    }

    static async delete({ id }) {
        const query = 'DELETE FROM public.categorias WHERE id = $1 RETURNING id, nombre, activa;'
        const param = []

        param.push(id)

        try {
            const result = await pool.query(query, param)
            return result.rows
        } catch (e) {
            throw new Error('No se puedo eliminar la categoria' + e.message)
        }

    }

    
    static async create({ nombre }) {
        const query = 'INSERT INTO public.categorias(nombre) VALUES($1) RETURNING id, nombre, activa;'
        const param = []
        param.push(nombre)

        try{
            const result = await pool.query(query, param)
            return result.rows
        }catch(e){
            throw new Error('No se pudo crear la categoria ' + e.message)
        }
    }
}