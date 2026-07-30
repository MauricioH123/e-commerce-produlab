import { NextFunction, Request, Response } from "express";
import { UnauthorizedUserError } from "../errors/UnauthorizedUserError.js";

export function verifyResourceOwner(req: Request, res: Response, next: NextFunction) {
    const user_id = String(req.user.sub)
    const user_rol = Number(req.user.rol_id)
    const resource = String(req.params.id)

    if(user_rol === 2){
        return next()
    }

    if(user_id === resource){
        return next()
    }

    return next(new UnauthorizedUserError())
}