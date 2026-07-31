import rateLimit from "express-rate-limit";

export const loginLimiter =  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {message: 'Demasiados intentos de inicio de sesión. Intente mas tarde.'},
    standardHeaders: true,
    legacyHeaders: false
})