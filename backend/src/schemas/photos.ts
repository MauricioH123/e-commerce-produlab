import z, { number, object } from "zod";

const photoSchema = z.object({
    id: z.number().int().positive()
})


export function validateUpdatePhoto(object:{id: number}){
    return photoSchema.safeParse(object)
}

export function validateDeletePhoto(object:{id:number}){
    return photoSchema.safeParse(object)
}