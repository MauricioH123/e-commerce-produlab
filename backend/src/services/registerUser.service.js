import { pool } from '../config/database.js'
import { User } from '../models/usuario.js'

export class RegisterUserService {

    static async execute({ userData, addressData }) {

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const user = await User.createUser({
                input: userData,
                client
            })

            await Address.create({
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