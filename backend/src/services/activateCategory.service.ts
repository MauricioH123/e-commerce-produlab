import { ConflictError } from "../errors/ConflictError.js";
import { Category, CategoryProps } from "../models/category.js";

export class ActivateCategory {
    static async execute({ id }: { id: number }):Promise<CategoryProps> {

        const affected = await Category.activate({ id })

        if (affected === null) {
            throw new ConflictError("La categoria esta activada")
        }

        return affected
    }
}