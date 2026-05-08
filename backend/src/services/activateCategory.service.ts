import { ConflictError } from "../errors/ConflictError.js";
import { Category } from "../models/category.js";

export class ActivateCategory {
    static async execute({ id }: { id: number }):Promise<void> {

        const affected = await Category.activate({ id })

        if (affected === 0) {
            throw new ConflictError("La categoria esta activada")
        }
    }
}