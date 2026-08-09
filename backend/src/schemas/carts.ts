import z from "zod";
import { InsertItemIntoCart, UpdateCartItem } from "../dtos/createCart.dto.js";

const userIdSchemas = z.object({
    user_id: z.uuid()
})

const cartItemsSchemas = z.object({
    id: z.number().int().positive(),
    product_id: z.number().int().positive(),
    amount: z.number().int().positive()
})

const updateCartSchema = z.array(cartItemsSchemas)

const deleteItemSchema = cartItemsSchemas.omit({ id: true, amount: true }).strict()

const insertItemSchema = cartItemsSchemas.omit({ id: true }).strict()

export function validateIdUser(object: { user_id: string }) {
    return userIdSchemas.safeParse(object)
}

export function validateCartItems(object: UpdateCartItem[]) {
    return updateCartSchema.safeParse(object)
}

export function validateItemId(object: { product_id: number }) {
    return deleteItemSchema.safeParse(object)
}

export function validateInsertItem(object: Omit<InsertItemIntoCart, 'cart_id'>) {
    return insertItemSchema.safeParse(object)
}