export const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict' as const,
    maxAge: Number(process.env.JWT_REFRESH_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh'
}