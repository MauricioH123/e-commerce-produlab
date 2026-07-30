import { NextFunction, Request, Response } from "express";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import { UnauthorizedUserError } from "../errors/UnauthorizedUserError.js";

export function authorize(...allowedRoles: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return next(new InvalidCredentialsError('No autenticado'))
        if (!allowedRoles.includes(req.user.rol_id)) {
            return next(new UnauthorizedUserError())
        }
        next()
    }
}