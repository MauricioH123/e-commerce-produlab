import { z } from 'zod'
import { ProductUpate, TProduct } from '../dtos/createProduct.dto.js'

const productSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    description: z.string(),
    photos: z.array(z.object({ url: z.string(), order: z.number().int(), is_main: z.boolean(), alt_text: z.string() })),
    category_id: z.number().int(),
    state: z.boolean(),
    iva: z.boolean(),
    price: z.number(),
    brand_id: z.number().int(),
    amount: z.number().int().positive()
})

const productUpdateSchema = productSchema.omit({ photos: true, id: true }).partial().extend({ id: z.number().int().positive() })

const productIdSchema = productSchema.omit({ name: true, description: true, photos: true, category_id: true, state: true, iva: true, price: true, brand_id: true }).strict()

export function validateProduct(object: Omit<TProduct, 'id'>) {
    return productSchema.omit({ id: true }).safeParse(object)
}

export function validateUpdateProduct(object: ProductUpate) {
    return productUpdateSchema.safeParse(object)
}

export function validatePartialProduct(object: Partial<TProduct>) {
    return productSchema.partial().safeParse(object)
}

export function validateProductId(object: { id: number }) {
    return productIdSchema.safeParse(object)
}