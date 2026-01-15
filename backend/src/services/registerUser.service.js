import { pool } from '../config/database.js'
import { User } from '../models/usuario.js'
import { Address } from '../models/address.js'

export class RegisterUserService {

    static async execute({ userData, addressData }) {

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const user = await User.create({
                input: userData,
                client
            })

            const address = await Address.create({
                input: {
                    ...addressData,
                    usuario_id: user.id
                },
                client
            })

            await client.query('COMMIT')

            return user
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }
}