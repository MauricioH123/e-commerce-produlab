import { NextFunction, Request, Response } from "express"
import { validateCreateUser, validateLoginUser } from "../schemas/users.js"
import { InvalidError } from "../errors/InvalidError.js"
import { createUserDTO } from "../dtos/createUser.dto.js"
import { RegisterUserService } from "../services/registerUser.service.js"
import { refreshCookieOptions } from "../utils/cookieOptions.js"
import { createdResponse, successResponse } from "../utils/responseHelper.js"
import { AuthServie } from "../services/auth.service.js"
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js"
import { createRefreshToken, findValidRefreshToken, revokeRefreshToken } from "../services/token.service.js"
import { generateAccessToken } from "../utils/jwt.js"
import { pool } from "../config/database.js"
import { Auth } from "../models/auth.js"

export class AuthController {

    static create = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        const validate = validateCreateUser(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        const userDTO = createUserDTO(body)

        try {
            const { user, accessToken, refreshToken } = await RegisterUserService.execute(userDTO)

            const responseData = { user, accessToken }

            res.cookie('refreshToken', refreshToken, refreshCookieOptions)

            return createdResponse({ res, data: responseData })
        } catch (e) {
            next(e)
        }
    }

    static login = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        const validate = validateLoginUser(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const { user, accessToken, refreshToken } = await AuthServie.loginUser(body)

            res.cookie('refreshToken', refreshToken, refreshCookieOptions)
            return successResponse({ res, data: { user, accessToken } })
        } catch (e) {
            next(e)
        }
    }

    static refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.refreshToken
            if (!token) {
                return next(new InvalidCredentialsError('No hay refresh token'))
            }

            const stored = await findValidRefreshToken(token)
            if (!stored) {
                return next(new InvalidCredentialsError('Refresh token invalido'))
            }

            await revokeRefreshToken(token)
            const newRefreshToken = await createRefreshToken(stored.user_id, pool)
            const user = await Auth.findById(stored.user_id)
            const accessToken = generateAccessToken(user)

            res.cookie('refreshToken', newRefreshToken, refreshCookieOptions)

            return successResponse({ res, data: { accessToken } })

        } catch (e) {
            next(e)
        }
    }

    static logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.refreshToken

            if (token) {
                await revokeRefreshToken(token)
            }

            res.clearCookie('refreshToken', { path: '/api/auth/refresh' })

            return successResponse({ res, data: { message: 'Sesion cerrada' } })
        } catch (e) {
            next(e)
        }
    }
}