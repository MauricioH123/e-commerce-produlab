import { Usuario } from "../models/usuario.js"
import { validateUser } from "../schemas/usuarios.js" 

export class UsuarioController {

    static getAll = async (req, res) => {
        const result = await Usuario.getAll()
        return res.status(201).json(result)
    }

    static createUser = async (req, res) => {
        const body = {
            nombre: req.body.nombre.toLowerCase(),
            correo: req.body.correo.toLowerCase(),
            numero_identificacion: req.body.numero_identificacion,
            contraseña: req.body.contraseña,
            identificacion_id: req.body.identificacion_id,
            numero_celular: req.body.numero_celular
        }
        const result = validateUser(body)

        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const newUser = await Usuario.createUser({input: body})
        return res.status(201).json(newUser)
    }
}