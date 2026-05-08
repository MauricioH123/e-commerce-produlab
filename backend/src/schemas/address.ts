import { z } from 'zod'

export const addressSchemas = z.object({
    ciudad: z.string().min(1, "La nombre es obligatoria").max(255, "El nombre debe tener maximo 255 caracteres"),
    barrio: z.string().min(1, "El nombre es obligatorio").max(255, "El nombre debe tener maximo 255 caracteres"),
    direccion: z.string().min(1, "La direccion es obligatoria").max(255, "La direccion debe tener maximo 255 caracteres"),
    codigo_postal: z.string().min(1, "El codigo es obligatorio").max(255, "El codigo debe tener maximo 100 caracteres")
})

export function validateAddress(object) {
    return addressSchemas.safeParse(object)
}