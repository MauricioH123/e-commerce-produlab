import { User } from "../models/usuario.js"
import { validateUser, validatePartialUser } from "../schemas/usuarios.js"

export class UsuarioController {

    static getAll = async (req, res) => {
        const { numero_identificacion } = req.query

        if (numero_identificacion) {
            const validate = validatePartialUser({ numero_identificacion })

            if (validate.error) {
                return res.status(400).json({ error: JSON.parse(validate.error.message) })
            }
        }

        try {
            const result = await User.getAll({ numero_identificacion })
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.message})
        }

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

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const newUser = await User.createUser({ input: body })
        return res.status(201).json(newUser)
    }
}