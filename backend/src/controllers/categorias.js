import { Category } from "../models/categoria.js";
import { validatePartialCategory } from "../schemas/categoria.js";

export class CategoryController {

    /**
     * @swagger
     * /categorias:
     *   get:
     *     summary: Obtener todas las categorías
     *     description: Retorna una lista con todas las categorías registradas.
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorías obtenida con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   nombre:
     *                     type: string
     *                     example: Insumos médicos
     *       404:
     *         description: No existen categorías registradas.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No existen categorias
     *       500:
     *         description: Error interno del servidor.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se pudo obtener las categorias
     */
    static getAll = async (req, res) => {
        try {
            const categories = await Category.getAll()

            if (categories.length === 0) {
                return res.status(404).json({ error: 'No existen categorias' })
            }

            return res.status(200).json(categories)
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    /**
     * @swagger
     * /categorias/{id}:
     *   delete:
     *     summary: Eliminar una categoría
     *     description: Elimina una categoría existente por su ID.
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID numérico de la categoría a eliminar.
     *         schema:
     *           type: integer
     *           example: 4
     *     responses:
     *       200:
     *         description: Categoría eliminada correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 4
     *                 nombre:
     *                   type: string
     *                   example: "Insumos médicos"
     *                 activa:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Datos inválidos en la solicitud.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       expected:
     *                         type: string
     *                         example: number
     *                       code:
     *                         type: string
     *                         example: invalid_type
     *                       path:
     *                         type: array
     *                         items:
     *                           type: string
     *                         example: ["id"]
     *                       message:
     *                         type: string
     *                         example: "Invalid input: expected number, received string"
     *       404:
     *         description: No existe la categoría con el ID proporcionado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No existe la categoria
     *       500:
     *         description: Error interno del servidor al eliminar la categoría.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se puedo eliminar la categoria
     */

    static delete = async (req, res) => {
        const id = Number(req.params.id)

        const validate = validatePartialCategory({ id })

        if (validate.error) {
            return res.status(400).json({ error: JSON.parse(validate.error.message) })
        }

        try {
            const categoryDelete = await Category.delete({ id })

            if (categoryDelete.length === 0) {
                return res.status(404).json({ error: 'No existe la categoria' })
            }
            return res.status(200).json(categoryDelete)
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }

    /**
     * @swagger
     * /categorias:
     *   post:
     *     summary: Crear una nueva categoría
     *     description: Crea una nueva categoría en la base de datos y retorna sus datos.
     *     tags: [Categories]
     *     requestBody:
     *       required: true
     *       description: Datos de la nueva categoría.
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nombre
     *             properties:
     *               nombre:
     *                 type: string
     *                 example: Insumos médicos
     *     responses:
     *       201:
     *         description: Categoría creada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 5
     *                   nombre:
     *                     type: string
     *                     example: insumos médicos
     *                   activa:
     *                     type: boolean
     *                     example: true
     *       400:
     *         description: Datos inválidos en la solicitud.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       expected:
     *                         type: string
     *                         example: string
     *                       code:
     *                         type: string
     *                         example: invalid_type
     *                       path:
     *                         type: array
     *                         items:
     *                           type: string
     *                         example: ["nombre"]
     *                       message:
     *                         type: string
     *                         example: "Required"
     *       500:
     *         description: Error interno del servidor al crear la categoría.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se pudo crear la categoria
     */

    static create = async (req, res) => {
        const nombre = req.body.nombre.toLowerCase()
        const validate = validatePartialCategory({ nombre })

        if (validate.error) {
            return res.status(400).json({ error: JSON.parse(validate.error.message) })
        }

        try {
            const result = await Category.create({ nombre })
            return res.status(201).json(result)
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }
}