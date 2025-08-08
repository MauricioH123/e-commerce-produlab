import { z } from 'zod'

const categorySchema = z.object({
    id: z.number().int(),
    nombre: z.string(),
    activa: z.boolean()
})

export function validatePartialCategory(object) {
    return categorySchema.partial().safeParse(object)
}