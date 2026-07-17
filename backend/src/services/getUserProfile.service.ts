import { InvoidInvoice } from "../dtos/CreateInvoice.dto.js";
import { UserProfile } from "../dtos/createUser.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Invoice } from "../models/invoice.js";
import { User } from "../models/user.js";

type UserInvoid = {
    user: UserProfile
    dataInvoices: InvoidInvoice
}

export class GetUserProfile {

    static async execute({ user_id, page, limit }: { user_id: string, page: number, limit: number }): Promise<UserInvoid> {

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