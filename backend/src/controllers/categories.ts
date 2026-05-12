import { Category } from "../models/category.js";
import { validatePartialCategory } from "../schemas/category.js";
import { Request, Response, NextFunction } from "express";
import { InvalidError } from "../errors/InvalidError.js";
import { SoftDeleteCategory } from "../services/softDeleteCategory.service.js";
import { RegisterCategory } from "../services/registerCategory.service.js";
import { createdResponse, deletedResponse, successResponse } from "../utils/responseHelper.js";
import { createCategoryDTO } from "../dtos/createCategory.dto.js";
import { ActivateCategory } from "../services/activateCategory.service.js";
import { UpdateCategoryName } from "../services/updateNameCategory.service.js";

// NOTA: PARA ELIMINAR CATEGORIA NO TENER EN CUENTA SI LA CATEGORIA TIENE UN PRODUCTO ASOCIADO, TENER ENCUENTA SI LA CATEGORIA TIENE UN PRODUCTO ACTIVO
//       CAMBIAR LAS RESPUESTA DE LOS CONTROLADORES POR LAS NUEVAS
//       CUANDO SE ACTUALICE UNA CATEGORIA YA SEA PARA ELIMINAR, CAMBIAR NOMBRE, O ACTIVAR SIEMPRE DEVOLVER TODO EL RECURSO COMPLETO 


// NOTA IMPORTANTE: Y SI SE CREA UN METODO QUE SOLO SEA ACTUALIZAR Y QUE DENTRO TENGA TODO LO NECESARIO PARA MODIFICAR 
//                  UNA CATEGORIA YA SEA PARA ELIMINAR, ACTIVAR O MODIFICAR EL NOMBRE Y ASI NOS AHORRAMOS LOS METODOS 
//                  DE ELIMINAR, ACTIVAR Y ACTUALIZAR QUE ESTAN CEPARADOS.
//                                     PIENSALOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

export class CategoryController {

    /**
     * @swagger
     * /categorias:
     *   get:
     *     summary: Obtener todas las categorías
     *     description: Retorna una lista con todas las categorías registradas.
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Lista de categorías obtenida con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   nombre:
     *                     type: string
     *                     example: Insumos médicos
     *       404:
     *         description: No existen categorías registradas.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No existen categorias
     *       500:
     *         description: Error interno del servidor.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se pudo obtener las categorias
     */
    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Category.getAll()

            return successResponse({ res, data: categories })
        } catch (e) {
            next(e)
        }
    }

    /**
     * @swagger
     * /categorias/{id}:
     *   delete:
     *     summary: Eliminar una categoría
     *     description: Elimina una categoría existente por su ID.
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID numérico de la categoría a eliminar.
     *         schema:
     *           type: integer
     *           example: 4
     *     responses:
     *       200:
     *         description: Categoría eliminada correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 4
     *                 nombre:
     *                   type: string
     *                   example: "Insumos médicos"
     *                 activa:
     *                   type: boolean
     *                   example: true
     *       400:
     *         description: Datos inválidos en la solicitud.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       expected:
     *                         type: string
     *                         example: number
     *                       code:
     *                         type: string
     *                         example: invalid_type
     *                       path:
     *                         type: array
     *                         items:
     *                           type: string
     *                         example: ["id"]
     *                       message:
     *                         type: string
     *                         example: "Invalid input: expected number, received string"
     *       404:
     *         description: No existe la categoría con el ID proporcionado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No existe la categoria
     *       500:
     *         description: Error interno del servidor al eliminar la categoría.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se puedo eliminar la categoria
     */

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)

        const validate = validatePartialCategory({ id })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        try {
            const category = await SoftDeleteCategory.execute({ id })

            return successResponse({ res, data: category })
        } catch (e) {
            return next(e)
        }
    }

    /**
     * @swagger
     * /categorias:
     *   post:
     *     summary: Crear una nueva categoría
     *     description: Crea una nueva categoría en la base de datos y retorna sus datos.
     *     tags: [Categories]
     *     requestBody:
     *       required: true
     *       description: Datos de la nueva categoría.
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - nombre
     *             properties:
     *               nombre:
     *                 type: string
     *                 example: Insumos médicos
     *     responses:
     *       201:
     *         description: Categoría creada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     example: 5
     *                   nombre:
     *                     type: string
     *                     example: insumos médicos
     *                   activa:
     *                     type: boolean
     *                     example: true
     *       400:
     *         description: Datos inválidos en la solicitud.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       expected:
     *                         type: string
     *                         example: string
     *                       code:
     *                         type: string
     *                         example: invalid_type
     *                       path:
     *                         type: array
     *                         items:
     *                           type: string
     *                         example: ["nombre"]
     *                       message:
     *                         type: string
     *                         example: "Required"
     *       500:
     *         description: Error interno del servidor al crear la categoría.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: No se pudo crear la categoria
     */

    static create = async (req: Request, res: Response, next: NextFunction) => {
        const name = req.body.name
        const validate = validatePartialCategory({ name })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        const categoryDTO = createCategoryDTO(name)

        try {
            const category = await RegisterCategory.execute({ name: categoryDTO });
            return createdResponse({ res, data: category })
        } catch (e) {
            next(e)
        }
    }

    static activate = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)
        const validate = validatePartialCategory({ id })

        if (validate.error) { return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message))) }

        try {
            const category = await ActivateCategory.execute({ id })

            return successResponse({ res, data: category })
        } catch (e) {
            next(e)
        }
    }

    static updateName = async (req: Request, res: Response, next: NextFunction) => {
        const input = req.body
        const validate = validatePartialCategory({ name: input.name, id: input.id })

        if (validate.error) {
            return next(new InvalidError("Datos invalidos", JSON.parse(validate.error.message)))
        }

        const categoryDTO = createCategoryDTO(input.name)

        try {
            const category = await UpdateCategoryName.execute({ name: categoryDTO, id: input.id })
            return successResponse({ res, data: category, message: "Categoria Actualizada" })
        } catch (e) {
            next(e)
        }
    }
}