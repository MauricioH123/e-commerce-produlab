import { ConflictError } from "../errors/ConflictError.js";
import { Category } from "../models/category.js";

export class SoftDeleteCategory {
    static async execute({ id }: { id: number }): Promise<void> {
        const affected = await Category.delete({ id })

        if (affected === 0) {
            throw new ConflictError("No se puede eliminar la categoría")
        }
    }
}