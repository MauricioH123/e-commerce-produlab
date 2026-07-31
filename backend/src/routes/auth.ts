import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

export const authRouter =  Router()

authRouter.post('/register', AuthController.create)
authRouter.post('/login', loginLimiter, AuthController.login)
authRouter.post('/refresh', AuthController.refresh)
authRouter.post('/logout', AuthController.logout)