import { InactiveUserError } from "../errors/InactiveUserError.js";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import bcrypt from 'bcrypt';
import { generateAccessToken } from "../utils/jwt.js";
import { createRefreshToken } from "./token.service.js";
import { pool } from "../config/database.js";
import { Auth } from "../models/auth.js";

export class AuthServie {
    static async loginUser(body: { email: string, password: string }) {
        const user = await Auth.findByEmail(body.email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const passwordMatches = await bcrypt.compare(body.password, user.password)

        if (!passwordMatches) {
            throw new InvalidCredentialsError()
        }

        if (!user.state) {
            throw new InactiveUserError()
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = await createRefreshToken(user.id, pool)

        const { password: _, ...safeUser } = user

        return { user: safeUser, accessToken, refreshToken }
    }
}