import { PoolClient } from "pg"
import { CreateUserDTO, TAddress } from "../dtos/createUser.dto.js"
import { AddressUpdate } from "../dtos/createAddress.dto.js"

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

    static async update({ dataAddress, client, address_id }: { dataAddress: Omit<AddressUpdate, 'id'>, client: PoolClient, address_id: number }) {
        const entries = Object.entries(dataAddress)

        const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(", ")

        const values = entries.map(([, value]) => value)

        values.push(address_id)

        const query = `
        UPDATE public.mailing_address
        SET ${fields}
        WHERE id = $${values.length}
        RETURNING id;
        `

        const result = await client.query(query, values)

        return result.rows[0]
    }

    static async addressById({ address_id, client }: { address_id: number, client: PoolClient }): Promise<TAddress | null> {

        const query = 'SELECT id, neighborhood, address, department_id, municipality_id, instructions FROM public.mailing_address WHERE id = $1;'
        const result = await client.query(query, [address_id])

        return result.rows[0] || null

    }
}