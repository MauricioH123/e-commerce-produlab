import z from "zod";

const photoSchema = z.object({
    id: z.number().int().positive()
})


export function deletePhoto(object:{id:number}){
    return photoSchema.safeParse(object)
}