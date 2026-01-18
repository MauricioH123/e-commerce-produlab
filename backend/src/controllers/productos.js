import { Product } from "../models/producto.js";


export class ProductoController {

    static getAll = async (req, res) => {
        try {

            let {page, limit, nombre} = req.query
            page = parseInt(page) || 1
            limit = parseInt(limit) || 10

            const productos = await Product.getAll({page, limit, nombre})

            if (productos.data.length === 0) {
                return res.status(404).json({ error: 'No existe el producto' })
            }

            return res.status(200).json(productos)
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }
}