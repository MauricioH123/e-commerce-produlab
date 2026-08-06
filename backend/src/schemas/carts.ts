import z, { number } from "zod";
import { UpdateCartItem } from "../dtos/createCart.dto.js";

const userIdSchemas = z.object({
    user_id: z.uuid()
})

const cartItemsSchemas = z.object({
    id: z.number().int().positive(),
    product_id: z.number().int().positive(),
    amount: z.number().int().positive()
})

const updateCartSchema = z.array(cartItemsSchemas)

export function validateIdUser(object: { user_id: string }) {
    return userIdSchemas.safeParse(object)
}

export function validateCartItems(object: UpdateCartItem[]) {
    return updateCartSchema.safeParse(object)
}