import { CreateUserDTO } from '../dtos/createUser.dto.js'
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { pool } from '../config/database.js';
import { Address } from '../models/address.js';
import { DatabaseError } from 'pg';
import { ConflictError } from '../errors/ConflictError.js';
import { generateAccessToken } from '../utils/jwt.js';
import { createRefreshToken } from './token.service.js';


export class RegisterUserService {

    static async execute(input: CreateUserDTO) {
        const hashPassword = await bcrypt.hash(input.password, 12)

        const userToCreate = {
            ...input,
            password: hashPassword
        }

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            const userWithoutAddress = await User.create({ user: userToCreate, client })

            const user = {
                id: userWithoutAddress.id,
                rol_id: userWithoutAddress.rol_id,
                name: userWithoutAddress.name
            }

            const address = await Address.create({ user: userToCreate, user_id: user.id, client })


            const accessToken = generateAccessToken(user)

            const refreshToken = await createRefreshToken(user.id, client)


            await client.query('COMMIT')

            return { user, accessToken, refreshToken }

        } catch (e) {
            await client.query('ROLLBACK')

            if (e instanceof DatabaseError) {
                if (e.code === '23505') {
                    throw new ConflictError("Correo o numero de indentificacion duplicado")
                }
            }

            throw e
        } finally {
            client.release()
        }

    }
}