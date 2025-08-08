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
}