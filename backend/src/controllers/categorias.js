import { Category } from "../models/categoria.js";
import { validatePartialCategory } from "../schemas/categoria.js";

export class CategoryController {

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