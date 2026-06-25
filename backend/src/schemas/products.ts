import { z } from 'zod'
import { TProduct } from '../dtos/createProduct.dto.js'

const productSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    photo: z.json(),
    category_id: z.number().int(),
    state: z.boolean(),
    iva: z.boolean(),
    price: z.number(),
    brand_id: z.number().int(),
})


export function validateProduct(object: Omit<TProduct, 'id'>) {
    return productSchema.safeParse(object)
}

export function validatePartialProduct(object: Partial<TProduct>) {
    return productSchema.partial().safeParse(object)
}