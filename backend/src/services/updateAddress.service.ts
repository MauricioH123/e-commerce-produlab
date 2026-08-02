import { pool } from "../config/database.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Address } from "../models/address.js";

export class UpdateAddress {
    static async execute({ dataAddress, address_id }: { dataAddress: Omit<UpdateAddress, 'id'>, address_id: number }) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const address = await Address.addressById({ client, address_id })

            if (!address) {
                throw new NotFoundError('Direccion')
            }

            const updateAddress = await Address.update({ dataAddress, client, address_id })

            await client.query('COMMIT')

            return updateAddress
        } catch (e) {
            await client.query('ROLLBACK')

            throw e
        } finally {
            client.release()
        }
    }
}