import { ConflictError } from "../errors/ConflictError.js";
import { Category, type CategoryProps } from "../models/category.js";
import { DatabaseError } from "pg";


export class RegisterCategory {
    static async execute({ name }: { name: string }): Promise<CategoryProps> {
        try {
            const category = await Category.create({ name })

            return category[0]
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