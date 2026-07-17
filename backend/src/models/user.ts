import { pool } from "../config/database.js";
import { UserProfile, UsersPage } from "../dtos/createUser.dto.js";

export class User {

    static async getAll({ page, limit }: { page: number, limit: number }): Promise<UsersPage> {
        const offset = (page - 1) * limit

        const queryInvoicesByUsers = `
        SELECT 
        u.id,
        u.name,
        r.name AS rol,
        u.state,
        COUNT(i.user_id) AS number_of_orders
        FROM public.users AS u
        LEFT JOIN public.invoices AS i ON u.id = i.user_id AND i.invoice_status_id = 1
        INNER JOIN public.roles AS r ON u.rol_id = r.id
        WHERE u.rol_id = 1
        GROUP BY u.id, u.name, u.rol_id, u.state, r.name 
        ORDER BY number_of_orders DESC
        LIMIT 10
        OFFSET $1;
        `
        const countQuery = `
        SELECT COUNT(*) FROM public.users WHERE rol_id = 1;
        `
        const invoicesByUsers = pool.query(queryInvoicesByUsers, [offset])
        const count = pool.query(countQuery)

        const [resutInvoicesByUsers, resultCount] = await Promise.all([invoicesByUsers, count])
        const total = parseInt(resultCount.rows[0].count)

        return {
            users: resutInvoicesByUsers.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

    static async getById({ user_id }: { user_id: string }):Promise<UserProfile> {
        const query = `
        SELECT 
        u.name, 
        u.email, 
        u.identification_number, 
        r.name AS rol, 
        u.state, 
        i.name AS identification 
        FROM public.users AS u
        INNER JOIN public.roles AS r ON u.rol_id = r.id
        INNER JOIN public.identifications AS i ON u.identification_id = i.id 
        WHERE u.rol_id = 1 AND u.id = $1;`

        const result = await pool.query(query, [user_id])

        return result.rows[0] ?? null
    }

}