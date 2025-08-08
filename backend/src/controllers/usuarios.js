import { User } from "../models/usuario.js"
import { validateUser, validatePartialUser } from "../schemas/usuarios.js"
import { validateProfile } from "../schemas/profile.js"

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
        const result = validatePartialUser(body)

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
     * /api/usuarios/{id}:
     *   delete:
     *     summary: Eliminar un usuario por ID
     *     tags:
     *       - Usuarios
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: UUID del usuario a eliminar
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Usuario eliminado correctamente
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
     *                         example: 123456789
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
     *       404:
     *         description: Usuario no encontrado o error al eliminar
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: "Error al eliminar el usuario"
     */

    static delete = async (req, res) => {
        const { id } = req.params

        const validation = validatePartialUser({ id })

        if (validation.error) {
            return res.status(400).json({ error: JSON.parse(validation.error.message) })
        }

        try {
            const result = await User.delete({ id })
            return res.status(200).json({ message: 'Usuario eliminado correctamente', result })
        } catch (e) {
            return res.status(404).json(e.message)
        }
    }

    /**
     * @swagger
     * /usuarios/{id}/profile:
     *   get:
     *     summary: Obtener perfil completo de un usuario
     *     description: Obtiene información detallada del perfil de un usuario específico, incluyendo datos personales y tipo de identificación
     *     tags:
     *       - Usuarios
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: UUID único del usuario
     *         schema:
     *           type: string
     *           format: uuid
     *         example: "123e4567-e89b-12d3-a456-426614174000"
     *     responses:
     *       200:
     *         description: Perfil del usuario obtenido exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 nombre:
     *                   type: string
     *                   description: Nombre completo del usuario
     *                   example: "mauricio hernández"
     *                 correo:
     *                   type: string
     *                   format: email
     *                   description: Correo electrónico del usuario
     *                   example: "mauricio.hernandez@email.com"
     *                 numero_identificacion:
     *                   type: string
     *                   description: Número de documento de identificación
     *                   example: "1234567890"
     *                 tipo_identificacion:
     *                   type: string
     *                   description: Tipo de documento de identificación
     *                   example: "Cédula de Ciudadanía"
     *                 numero_celular:
     *                   type: string
     *                   description: Número de teléfono celular
     *                   example: "3001234567"
     *                 ciudad:
     *                   type: string
     *                   description: Nombre de la ciudad de envio
     *                   example: "Monteria"
     *                 barrio:
     *                   type: string
     *                   description: Nombre del barrio envio
     *                   example: "Buenavista"
     *                 direccion: 
     *                   type: string
     *                   description: Direccion de envio
     *                   example: "Calle 80 #28-36"
     *                 codigo_postal:
     *                   type: string
     *                   description: Codigo postal de la direccion de envio
     *                   example: "123445"
     *               required:
     *                 - nombre
     *                 - correo
     *                 - numero_identificacion
     *                 - tipo_identificacion
     *                 - numero_celular
     *                 - ciudad
     *                 - barrio
     *                 - direccion
     *                 - codigo_postal
     *             example:
     *               nombre: "mauricio hernández"
     *               correo: "mauricio.hernandez@email.com"
     *               numero_identificacion: "1234567890"
     *               tipo_identificacion: "Cédula de Ciudadanía"
     *               numero_celular: "3001234567"
     *               ciudad: "monteria"
     *               barrio: "buenavista"
     *               direccion: "Calle 80 #28-36"
     *               codigo_postal: "123445"
     *       400:
     *         description: Error de validación en el parámetro ID
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: object
     *                   description: Objeto con los errores de validación
     *                   example:
     *                     id: "Debe ser un UUID válido"
     *             examples:
     *               uuid_invalido:
     *                 summary: UUID inválido
     *                 value:
     *                   error:
     *                     id: "Debe ser un UUID válido"
     *               id_faltante:
     *                 summary: ID faltante
     *                 value:
     *                   error: "ID es requerido"
     *       404:
     *         description: Usuario no encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Usuario no encontrado"
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensaje de error interno
     *                   example: "Error al obtener los datos del usuario: Database connection failed"
     *             examples:
     *               error_base_datos:
     *                 summary: Error de base de datos
     *                 value:
     *                   error: "Error al obtener los datos del usuario: Database connection failed"
     *               error_consulta:
     *                 summary: Error en consulta SQL
     *                 value:
     *                   error: "Error al obtener los datos del usuario: Invalid column name"
     */

    static getProfile = async (req, res) => {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ error: "ID es requerido" })
        }

        const validate = validatePartialUser({ id })

        if (validate.error) {
            return res.status(400).json({ error: JSON.parse(validate.error.message) })
        }

        try {
            const userProfile = await User.getProfile({ id })

            if (!userProfile) {
                return res.status(404).json({ error: "Usuario no encontrado" })
            }

            return res.status(200).json(userProfile)
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }


    /**
     * @swagger
     * /usuarios/{id}/profile:
     *   put:
     *     summary: Actualiza el perfil de un usuario, incluyendo correo y dirección.
     *     tags:
     *       - Usuarios
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID del usuario a actualizar (UUID).
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *               - numero_celular
     *               - ciudad
     *               - barrio
     *               - direccion
     *               - codigo_postal
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *                 example: usuario@example.com
     *               numero_celular:
     *                 type: string
     *                 example: "3012345678"
     *               ciudad:
     *                 type: string
     *                 example: Bogotá
     *               barrio:
     *                 type: string
     *                 example: Chapinero
     *               direccion:
     *                 type: string
     *                 example: Calle 20 #89-66 lote 6 manzana 10
     *               codigo_postal:
     *                 type: string
     *                 example: "110111"
     *     responses:
     *       201:
     *         description: Usuario actualizado correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 correo:
     *                   type: string
     *                 numero_celular:
     *                   type: string
     *                 direccion_info:
     *                   type: object
     *                   properties:
     *                     ciudad:
     *                       type: string
     *                     barrio:
     *                       type: string
     *                     direccion:
     *                       type: string
     *                     codigo_postal:
     *                       type: string
     *       400:
     *         description: Error de validación en los datos de entrada.
     *       500:
     *         description: Error interno del servidor.
     */

    static update = async (req, res) => {
        const body = req.body
        const validate = validateProfile(body)

        if (validate.error) {
            return res.status(400).json({ error: JSON.parse(validate.error.message) })
        }

        const { id } = req.params

        try {
            const result = await User.update({ id, input: body })
            return res.status(201).json({ result, message: "Los datos fueron actualizados de forma exitosa" })
        } catch (e) {
            return res.status(500).json({ error: e.message })
        }
    }
}