import { DatabaseError } from "pg";
import { TBrand } from "../dtos/CreateBrand.dto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { Brands } from "../models/brands.js";
import { ConflictError } from "../errors/ConflictError.js";

export class UpdateBrand {
    static async execute(input: TBrand) {
        try {
            const brand = await Brands.update(input)

            if (!brand) {
                throw new NotFoundError('Marca')
            }

            return brand
        } catch (e) {
            if (e instanceof DatabaseError) {
                if (e.code === '23505') {
                    throw new ConflictError('Nombre de marca duplicado')
                }
            }

            throw e
        }
    }
}