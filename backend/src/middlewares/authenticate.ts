import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: 'Token no proporcionado'})
    }

    try{
        const payload = verifyAccessToken(authHeader.split(' ')[1])
        req.user = payload
        next();
    }catch(e){
        return res.status(401).json({message: 'Token invalido o expirado'})
    }
}