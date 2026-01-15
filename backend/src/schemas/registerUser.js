import { z } from "zod"
import { userSchema } from "./usuarios.js"
import { addressSchemas } from "./adddress.js"


const registerUserSchemas = z.object({
    user: userSchema.omit({id: true}),
    address: addressSchemas
})

export function validateRegisterUser(object){
    return registerUserSchemas.safeParse(object)
}