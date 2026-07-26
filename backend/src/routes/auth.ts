import { Router } from "express";
import { AuthController } from "../controllers/auth.js";

export const authRouter =  Router()

authRouter.post('/register', AuthController.create)
authRouter.post('/login', AuthController.login)
authRouter.post('/refresh', AuthController.refresh)
authRouter.post('/logout', AuthController.logout)