import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Category, CategoryProps } from "../models/category.js";
import { DatabaseError } from "pg";

export class UpdateCategoryName {
    static async execute({ name, id }: { name: string, id: number }): Promise<CategoryProps> {

        try {
            const categoryAffected = await Category.updateName({ name, id })
            if (categoryAffected === null) {
                throw new NotFoundError("Categoria")
            }

            return categoryAffected
        } catch (e) {
            if (e instanceof DatabaseError) {
                if (e.code === '23505') {
                    throw new ConflictError("Nombre de categoria duplicado")
                }
            }

            throw e
        }

    }
}