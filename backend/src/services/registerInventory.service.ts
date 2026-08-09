import { pool } from "../config/database.js";
import { createMovementAdmin, OPERATIONS } from "../dtos/createInventoryMovements.js";
import { InvalidError } from "../errors/InvalidError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { InventoryMovements } from "../models/inventoryMovements.js";

export class RegisterInventory {
    static async execute({ user_id, body }: { user_id: string, body: createMovementAdmin[] }) {
        const client = await pool.connect()
        const queryProduct = `SELECT id FROM public.products WHERE id = $1 FOR UPDATE;`
        try {
            await client.query('BEGIN')

            for (const item of body) {
                const product = await client.query(queryProduct, [item.product_id])

                if (product.rows.length === 0) {
                    throw new NotFoundError('Producto')
                }

                if (item.type === OPERATIONS.subtraction) {
                    const quantityOfProduct = await InventoryMovements.getStock(item.product_id, client)

                    if (quantityOfProduct.total_amount < item.amount) {
                        throw new InvalidError('Dato invalido', 'La cantidad a eliminar es mayor al total del stock')
                    }
                }

                await InventoryMovements.createMovement({ product_id: item.product_id, amount: item.amount, user_id, client, type: item.type })

            }

            await client.query('COMMIT')

            return true

        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }
    }
}