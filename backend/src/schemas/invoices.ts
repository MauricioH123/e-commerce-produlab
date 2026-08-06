import z from "zod";

const invoicesSchema = z.object({
    id: z.number().int().positive(),
    user_id: z.uuid(),
    purchase_date: z.iso.date(),
    total: z.number().nonnegative(),
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    invoice_status_id: z.number().int().positive(),
    card_id: z.number().int().positive()
})
