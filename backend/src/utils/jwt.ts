import jwt, { JwtPayload } from 'jsonwebtoken'
import type { StringValue } from 'ms'
import { createHash, randomBytes } from 'node:crypto';

type User = {
    id: string,
    rol_id: number
}
export function generateAccessToken(user: User) {
    return jwt.sign(
        { sub: user.id, rol_id: user.rol_id },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES as StringValue }
    );
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
}

export function generateRefreshToken() {
    return randomBytes(64).toString('hex');
}

export function hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}