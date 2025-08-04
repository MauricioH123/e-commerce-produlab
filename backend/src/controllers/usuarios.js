import { User } from "../models/usuario.js"
import { validateUser, validatePartialUser } from "../schemas/usuarios.js"

export class UsuarioController {
    
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener lista de usuarios o un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: UUID del usuario a consultar
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     example: Mauricio Hernández
 *                   numero_identificacion:
 *                     type: string
 *                     example: 123456789
 *       400:
 *         description: Error de validación en el parámetro `id`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   example:
 *                     id: "Debe ser un UUID válido"
 *       500:
 *         description: Error interno del servidor al consultar usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener todos los usuarios: <mensaje>"
 */

    static getAll = async (req, res) => {
        const { id } = req.query

        if (id) {
            const validate = validatePartialUser({ id })

            if (validate.error) {
                return res.status(400).json({ error: JSON.parse(validate.error.message) })
            }
        }

        try {
            const result = await User.getAll({ id })
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
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        try {
            const newUser = await User.createUser({ input: body })
            return res.status(201).json(newUser)
        } catch (e) {
            return res.status(500).json(e.message)
        }
    }

    /**
     * @swagger
     * /usuarios/{numero_identificacion}:
     *   delete:
     *     summary: Eliminar un usuario
     *     description: Elimina un usuario de la base de datos mediante su número de identificación.
     *     tags:
     *       - Usuarios
     *     parameters:
     *       - in: path
     *         name: numero_identificacion
     *         required: true
     *         schema:
     *           type: string
     *         description: Número de identificación del usuario a eliminar.
     *     responses:
     *       200:
     *         description: Usuario eliminado correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Usuario eliminado correctamente
     *                 result:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       numero_identificacion:
     *                         type: string
     *                         example: "123456789"
     *       400:
     *         description: Error de validación en los parámetros.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: object
     *                   example:
     *                     numero_identificacion: 'Debe ser un número válido'
     *       404:
     *         description: No se encontró el usuario o error al eliminar.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: No se ingreso un numero de identificacion
     */
    static delete = async (req, res) => {
        const { numero_identificacion } = req.params

        const validation = validatePartialUser({ numero_identificacion })

        if (validation.error) {
            return res.status(400).json({ error: JSON.parse(validation.error.message) })
        }

        try {
            const result = await User.delete({ numero_identificacion })
            return res.status(200).json({ message: 'Usuario eliminado correctamente', result })
        } catch (e) {
            return res.status(404).json(e.message)
        }
    }



    static update = async (req, res) => {
        const body = req.body
        const validate = validatePartialUser(body)

        if (validate.error) {
            return res.status(400).json({ error: JSON.parse(validate.error.message) })
        }

        try {

        } catch (e) {

        }
    }
}