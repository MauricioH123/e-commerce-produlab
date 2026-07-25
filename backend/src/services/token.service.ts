import { Pool, PoolClient } from "pg";
import { pool } from "../config/database.js";
import { generateRefreshToken, hashToken } from "../utils/jwt.js";

export async function createRefreshToken(user_id: string, connect: Pool | PoolClient): Promise<string> {
    const token = generateRefreshToken()
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRES_DAYS) * 24 * 60 * 60 * 1000)

    await connect.query(`
        INSERT INTO public.refresh_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, $3)`,
        [user_id, tokenHash, expiresAt]
    )

    return token
}

export async function findValidRefreshToken(token: string) {
    const tokenHash = hashToken(token)
    const { rows } = await pool.query(
        `SELECT * FROM public.refresh_tokens 
        WHERE token_hash = $1 AND revoked = false AND expires_at > now();`,
        [tokenHash]
    )

    return rows[0] || null
}

export async function revokeRefreshToken(token: string) {
    const tokenHash = hashToken(token)
    await pool.query(
        `UPDATE public.refresh_tokens SET revoked = true WHERE token_hash = $1;`,
        [tokenHash]
    )
}