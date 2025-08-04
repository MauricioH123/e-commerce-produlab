import { z } from 'zod'

const userSchema = z.object({
    id: z.uuid(),
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' }),
    correo: z.email({ message: 'El correo electrónico no es válido' }),
    numero_identificacion: z.string()
        .min(7, { message: 'El número de identificación debe tener al menos 10 dígitos.' })
        .max(20, { message: 'El número de identificación no puede exceder los 20 dígitos.' })
        .regex(/^\d+$/, { message: 'El número de identificación solo puede contener dígitos.' }),
    contraseña: z.string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minúscula.' })
        .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula.' })
        .regex(/\d/, { message: 'La contraseña debe contener al menos un número.' }),
    identificacion_id: z.number()
        .int()
        .positive({ message: 'El ID de identificación debe ser un número entero positivo.' }),
    numero_celular: z.string()
        .min(10, { message: 'El número de celular debe tener al menos 10 dígitos.' })
        .max(20, { message: 'El número de celular no puede exceder los 20 dígitos.' })
        .regex(/^\d+$/, { message: 'El número de celular solo puede contener dígitos.' }),
});

export function validateUser(object){
    return userSchema.safeParse(object)
}

export function validatePartialUser(object){
    return userSchema.partial().safeParse(object)
}