import { Usuario } from "../models/usuario.js"
import { validateUser } from "../schemas/usuarios.js" 

export class UsuarioController {

    static getAll = async (req, res) => {
        const result = await Usuario.getAll()
        return res.status(201).json(result)
    }

    static createUser = async (req, res) => {
        const result = validateUser(req.body)

        if(input.error){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const newUser = await Usuario.createUser({input: result.data})
        return req.status(201).json(newUser)
    }
}