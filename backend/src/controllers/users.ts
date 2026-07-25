import { User } from "../models/user.js"
import { Request, Response, NextFunction } from "express"
import { createdResponse, successResponse } from "../utils/responseHelper.js"
import { validateCreateUser, validateLoginUser, validatePartialUser } from "../schemas/users.js"
import { InvalidError } from "../errors/InvalidError.js"
import { GetUserProfile } from "../services/getUserProfile.service.js"
import { createUserDTO } from "../dtos/createUser.dto.js"
import { RegisterUserService } from "../services/registerUser.service.js"
import { Auth } from "../services/auth.service.js"
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js"
import { createRefreshToken, findValidRefreshToken, revokeRefreshToken } from "../services/token.service.js"
import { pool } from "../config/database.js"
import { generateAccessToken } from "../utils/jwt.js"
import { refreshCookieOptions } from "../utils/cookieOptions.js"

export class UsuarioController {

    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        try {
            const profiles = await User.getAll({ page, limit })
            return successResponse({ res, data: profiles })
        } catch (e) {
            next(e)
        }
    }

    static getById = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = String(req.params.id)
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        if (page < 1 || limit < 1 || limit > 100) {
            return next(new InvalidError('Parámetros de paginación inválidos', 'Solo numero positivos'))
        }

        const validate_id = validatePartialUser({ id: user_id })

        if (!validate_id.success) {
            return next(new InvalidError('Datos invalidos', validate_id.error.issues))
        }

        try {
            const user = await GetUserProfile.execute({ user_id, page, limit })

            return successResponse({ res, data: user })
        } catch (e) {
            next(e)
        }
    }

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

    static findByEmail = async (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        const validate = validateLoginUser(body)

        if (!validate.success) {
            return next(new InvalidError('Datos invalidos', validate.error.issues))
        }

        try {
            const { user, accessToken, refreshToken } = await Auth.loginUser(body)

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
            const user = await User.findById(stored.user_id)
            const accessToken = generateAccessToken(user)

            res.cookie('refreshToken', newRefreshToken, refreshCookieOptions)

            return successResponse({ res, data: { accessToken } })

        } catch (e) {
            next(e)
        }
    }

}