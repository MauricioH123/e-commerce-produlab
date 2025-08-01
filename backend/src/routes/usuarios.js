import { Router } from "express";
import { Usuario } from "../models/usuario.js";

export const usuariosRouter = Router()

usuariosRouter.get('/', async (req, res)=>{
    const result = await Usuario.getAll()
    return res.status(201).json(result)
})