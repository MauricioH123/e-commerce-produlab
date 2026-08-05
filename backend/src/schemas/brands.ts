import z, { number } from "zod";
import { CreateBrand, TBrand } from "../dtos/CreateBrand.dto.js";

export const brandSchemas = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1, { message: "El barrio es obligatorio." }).max(255, { message: "El barrio es muy largo" })
})

const createBrandSchemas = brandSchemas.omit({ id: true }).strict()


export function validateCreateBrand(object: CreateBrand) {
    return createBrandSchemas.safeParse(object)
}

export function validateUpdateBrand(object: TBrand){
    return brandSchemas.safeParse(object)
}
