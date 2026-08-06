import z, { number } from "zod";

const userIdSchemas = z.object({
    user_id: z.uuid()
})

const cartItemsSchemas = z.object({
    id: z.number().int().positive(),
    product_id: z.number().int().positive(),
    amount: z.number().int().positive()
})

export function validateIdUser(object: { user_id: string }) {
    return userIdSchemas.safeParse(object)
}