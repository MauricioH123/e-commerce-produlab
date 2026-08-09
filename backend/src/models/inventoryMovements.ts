import { PoolClient } from "pg"
import { pool } from "../config/database.js"
import { MovementType, OPERATIONS } from "../dtos/createInventoryMovements.js"



export class InventoryMovements {
    static async getStock(product_id: number, client: PoolClient): Promise<{ product_id: number, total_amount: number }> {
        const query = `
        SELECT 
        product_id,
        SUM(
            CASE
                WHEN type = ${OPERATIONS.addition} THEN amount
                WHEN type = ${OPERATIONS.subtraction} THEN -amount
            END
        ) AS total_amount
        FROM public.inventory_movements
        WHERE product_id = $1
        GROUP BY product_id;`

        const result = await client.query(query, [product_id])

        return result.rows[0]
    }

    static async createMovement({ product_id, amount, type, user_id, client }: { product_id: number, amount: number, type: MovementType, user_id: string, client: PoolClient }) {
        const query = `
        INSERT INTO public.inventory_movements(
        product_id, type, amount, user_id)
        VALUES ($1, $2, $3, $4) RETURNING id;`

        const result = await client.query(query, [product_id, type, amount, user_id])

        return result.rows[0]
    }
}