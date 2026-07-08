import { ProductIndividual, TProduct } from "../dtos/createProduct.dto.js";
import { Photos } from "../models/photos.js";
import { Product } from "../models/product.js";

export class GetProduct {
    static async execute({ product_id }: { product_id: TProduct["id"] }): Promise<ProductIndividual | null> {
        try {
            const product = await Product.getById({ id: product_id })

            if (!product) return null

            const photos = await Photos.getByIdProduct({ product_id })

            return { ...product, photos }

        } catch (e) {
            throw e
        }

    }
}