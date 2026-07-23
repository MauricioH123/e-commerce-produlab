import { PoolClient } from "pg"
import { CreateUserDTO } from "../dtos/createUser.dto.js"

export class Address {
    static async create({ user, user_id, client }: { user: CreateUserDTO, user_id: string, client: PoolClient }) {
        const values = [
            user.address.neighborhood,
            user.address.address_line,
            user_id,
            user.address.department_id,
            user.address.municipality_id,
            user.address.instructions
        ]
        const query = `
        INSERT INTO public.mailing_address(
        neighborhood, address, is_main, user_id, department_id, municipality_id, instructions)
        VALUES ($1, $2, true, $3, $4, $5, $6);`

        const result = await client.query(query, values)

        return result.rows[0]
    }
}