import { pool } from "../config/database.js"

export class Invoice {
    static async getByIdUser({ user_id, page, limit }: { user_id: string, page: number, limit: number }) {
        const offset = (page - 1) * limit
        const queryInvoices = `
        SELECT 
        i.id, 
        i.purchase_date, 
        i.total, 
        i.subtotal, 
        i.tax,
        ist.name AS state
        FROM public.invoices AS i
        INNER JOIN public.invoice_status AS ist ON i.invoice_status_id = ist.id
        WHERE user_id = $1
        ORDER BY i.purchase_date DESC
        LIMIT 10
        OFFSET $2;`

        const queyCount = `
        SELECT 
        COUNT(*) 
        FROM public.invoices AS i 
        WHERE i.user_id = $1;
        `
        const invoices = pool.query(queryInvoices, [user_id, offset])
        const count = pool.query(queyCount, [user_id])

        const [resultInvoices, resultCount] = await Promise.all([invoices, count])
        const total = parseInt(resultCount.rows[0].count)

        return {
            invoices: resultInvoices.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

}