import { z } from 'zod'
import { AddressUpdate } from '../dtos/createAddress.dto.js'

export const addressSchemas = z.object({
    id: z.number().int().positive(),
    neighborhood: z.string().min(1, { message: "El barrio es obligatorio." }).max(255, { message: "El barrio es muy largo" }),
    address_line: z.string().min(1, { message: "La dirección es obligatoria." }).max(255, { message: "La dirección es muy larga." }),
    is_main: z.boolean(),
    user_id: z.uuid(),
    department_id: z.number().int().positive(),
    municipality_id: z.number().int().positive(),
    instructions: z.string().optional()
})

export const createAddressSchema = addressSchemas.omit({ id: true, user_id: true, is_main: true })
const updateAddressSchema = addressSchemas.omit({ id: true, user_id: true, is_main: true, address_line: true }).partial().extend({ id: z.number().int().positive(), address: z.string().min(1, { message: "La dirección es obligatoria." }).max(255, { message: "La dirección es muy larga." }) })

export function validateUpdateAddress(object: AddressUpdate) {
    return updateAddressSchema.safeParse(object)
}