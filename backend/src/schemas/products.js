import { z } from 'zod'

const productSchema = z.object({
    id: z.number().int(),
    nombre: z.string(),
    descripcion: z.string(),
    foto: z.string(),
    categoria_id: z.number().int(),
    activo: z.boolean(),
    iva: z.boolean()
})