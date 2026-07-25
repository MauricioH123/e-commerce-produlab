import { z } from 'zod'
import { addressSchemas, createAddressSchema } from './address.js';

export const userSchema = z.object({
    id: z.uuid(),
    name: z.string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(255, { message: 'El nombre es muy largo' }),
    email: z.email({ message: 'El correo electrónico no es válido' }),
    identification_number: z.string()
        .min(7, { message: 'El número de identificación debe tener al menos 10 dígitos.' })
        .max(20, { message: 'El número de identificación no puede exceder los 20 dígitos.' })
        .regex(/^\d+$/, { message: 'El número de identificación solo puede contener dígitos.' }),
    password: z.string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
        .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minúscula.' })
        .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula.' })
        .regex(/\d/, { message: 'La contraseña debe contener al menos un número.' }),
    identification_id: z.number()
        .int()
        .positive({ message: 'El ID de identificación debe ser un número entero positivo.' }),
    phone_number: z.string()
        .min(10, { message: 'El número de celular debe tener al menos 10 dígitos.' })
        .max(20, { message: 'El número de celular no puede exceder los 20 dígitos.' })
        .regex(/^\d+$/, { message: 'El número de celular solo puede contener dígitos.' }),
});

export const createUserSchema = userSchema.omit({ id: true }).extend({ address: createAddressSchema })

export const loginUserSchema = z.object({
    email: z.email({ message: "El correo electronico no es válido." }),
    password: z.string().min(1, { message: "La contraseña es obligatoria." })
})

export function validateCreateUser(object: unknown) {
    return createUserSchema.safeParse(object)
}

export function validateLoginUser(object: undefined) {
    return loginUserSchema.safeParse(object)
}

export function validatePartialUser(object: unknown) {
    return userSchema.partial().safeParse(object)
}