import { z } from 'zod'
import { CategoryProps } from '../models/category.js'

const categorySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    state: z.boolean()
})

export function validatePartialCategory(object:CategoryProps) {
    return categorySchema.partial().safeParse(object)
}