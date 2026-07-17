import { NotFoundError } from "../errors/NotFoundError.js";
import { Invoice } from "../models/invoice.js";
import { User } from "../models/user.js";

export class GetUserProfile {

    static async execute({ user_id, page, limit }: { user_id: string, page: number, limit: number }) {

        const user = await User.getById({ user_id })

        if (!user) {
            throw new NotFoundError('User')
        }

        const invoices = await Invoice.getByIdUser({ user_id, page, limit })

        return {
            user,
            dataInvoices: invoices
        }
    }
}