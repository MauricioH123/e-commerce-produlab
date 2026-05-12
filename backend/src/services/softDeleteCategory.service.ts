import { ConflictError } from "../errors/ConflictError.js";
import { Category, CategoryProps } from "../models/category.js";

export class SoftDeleteCategory {
    static async execute({ id }: { id: number }): Promise<CategoryProps> {
        const affected = await Category.delete({ id })

        if (affected === null) {
            throw new ConflictError("No se puede eliminar la categoría")
        }

        return affected
    }
}