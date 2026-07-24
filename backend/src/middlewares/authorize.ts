import { NextFunction, Request, Response } from "express";

export function authorize(...allowedRoles: Array<number>) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: 'No autenticado' })
        if (!allowedRoles.includes(req.user.rol_id)) {
            return res.status(403).json({ message: 'No tiene permisos' })
        }
        next()
    }
}