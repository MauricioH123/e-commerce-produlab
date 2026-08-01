import { z } from 'zod'
import { ProductUpate, TProduct } from '../dtos/createProduct.dto.js'

const productSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    description: z.string(),
    photo: z.array(z.object({ url: z.string(), order: z.number().int(), is_main: z.boolean, alt_text: z.string() })),
    category_id: z.number().int(),
    state: z.boolean(),
    iva: z.boolean(),
    price: z.number(),
    brand_id: z.number().int(),
})

const productUpdateSchema = productSchema.omit({ photo: true, id: true }).partial().extend({id: z.number().int().positive()})

export function validateProduct(object: Omit<TProduct, 'id'>) {
    return productSchema.safeParse(object)
}

export function validateUpdateProduct(object: ProductUpate) {
    return productUpdateSchema.safeParse(object)
}

export function validatePartialProduct(object: Partial<TProduct>) {
    return productSchema.partial().safeParse(object)
}