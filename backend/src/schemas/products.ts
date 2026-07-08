import { z } from 'zod'
import { TProduct } from '../dtos/createProduct.dto.js'

const productSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    photo: z.array(z.object({ url: z.string(), order: z.number().int(), is_main: z.boolean, alt_text: z.string() })),
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