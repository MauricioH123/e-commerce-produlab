import { DatabaseError } from "pg";
import { CreateBrand } from "../dtos/CreateBrand.dto.js";
import { Brands } from "../models/brands.js";
import { ConflictError } from "../errors/ConflictError.js";

export class RegisterBrand {
    static async execute(body: CreateBrand) {

        try {
            const brand = await Brands.create(body.name)

            return brand
        } catch (e) {
            if (e instanceof DatabaseError) {
                if (e.code === '23505') {
                    throw new ConflictError('Nombre de la marca duplicado')
                }
            }
            throw e
        }


    }
}