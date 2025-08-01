import { Usuario } from "../models/usuario.js"

export class UsuarioController {
    
    static getAll = async (req, res)=>{
        const result = await Usuario.getAll()
        return res.status(201).json(result)
    }
}