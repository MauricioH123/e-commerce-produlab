import z from "zod";
import { createMovementAdmin } from "../dtos/createInventoryMovements.js";

const inventorySchemas = z.object({
    product_id: z.number().int().positive(),
    type: z.literal(0).or(z.literal(1)),
    amount: z.number().int().positive(),
    reason: z.string().optional(),
    invoice_id: z.number().int().positive().optional()
})

const createMovement = z.array(inventorySchemas.omit({invoice_id:true}))

export function validateMovement(object: createMovementAdmin[]) {
    return createMovement.safeParse(object)
}

