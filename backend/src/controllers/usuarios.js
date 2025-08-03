import { User } from "../models/usuario.js"
import { validateUser, validatePartialUser } from "../schemas/usuarios.js"

export class UsuarioController {
    /**
     * @swagger
     * /usuarios:
     *   get:
     *     summary: Obtener todos los usuarios
     *     tags: [Usuarios]
     *     parameters:
     *       - in: query
     *         name: numero_identificacion
     *         schema:
     *           type: string
     *         description: Número de identificación para filtrar
     *     responses:
     *       200:
     *         description: Lista de usuarios
     *       400:
     *         description: Error de validación
     */
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
            return res.status(500).json({ error: e.message })
        }

    }

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - numero_identificacion
 *               - contraseña
 *               - identificacion_id
 *               - numero_celular
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: juan perez
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *               numero_identificacion:
 *                 type: string
 *                 example: 123456789
 *               contraseña:
 *                 type: string
 *                 example: pass123
 *               identificacion_id:
 *                 type: string
 *                 example: 1
 *               numero_celular:
 *                 type: string
 *                 example: 3001234567
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */

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
            return res.status(400).json({ error: result.error.details || result.error.message })
        }

        try {
            const newUser = await User.createUser({ input: body })
            return res.status(201).json(newUser)
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }
}