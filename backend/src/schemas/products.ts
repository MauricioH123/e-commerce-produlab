import { z } from 'zod'
import { ProductUpate, TProduct } from '../dtos/createProduct.dto.js'

const productSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    description: z.string(),
    category_id: z.coerce.number().int(),
    state: z.boolean(),
    iva: z.coerce.boolean(),
    price: z.coerce.number().positive(),
    brand_id: z.coerce.number().int(),
    amount: z.coerce.number().int().positive()
})

const productUpdateSchema = productSchema.omit({ id: true }).partial().extend({ id: z.coerce.number().int().positive() })

const productIdSchema = productSchema.omit({ name: true, description: true, category_id: true, state: true, iva: true, price: true, brand_id: true }).strict()

const createProductSchema = productSchema.omit({ state: true, id: true }).strict()

export function validateProduct(object: Omit<TProduct, 'id' | 'state'>) {
    return createProductSchema.safeParse(object)
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