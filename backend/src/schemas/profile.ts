import { z } from 'zod'

const pofileSchema = z.object({
    correo: z.email({ message: 'El correo electrónico no es válido' }),
    ciudad: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' }),
    barrio: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' }),
    direccion: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' }),
    codigo_postal: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' })
})

export function validateProfile(object){
    return pofileSchema.safeParse(object)
}