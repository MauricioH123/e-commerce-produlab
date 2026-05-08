import { z } from "zod"
import { userSchema } from "./users.js"
import { addressSchemas } from "./address.js"


const registerUserSchemas = z.object({
    user: userSchema.omit({id: true}),
    address: addressSchemas
})

export function validateRegisterUser(object){
    return registerUserSchemas.safeParse(object)
}