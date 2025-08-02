import { z } from 'zod'

const userSchema = z.object({
    nombre: z.string({message:'El valor no es valido'}).max(255, {message:'El nombre es muy largo'}),
    direccion: z.string({message:'El valor no es valido'}).max(255, {message:'La direccion es muy larga'}),
    correo: z.email({message:'No es un correo valido'}),
    numero_identificacion: z.string().min(10,{message:'El número de identificación debe tener al menos 10 dígitos.'}).max(20,{message:'El número de identificación no puede exceder los 15 dígitos.'}).regex(/^\d+$/,{message:'El número de identificación solo puede contener dígitos.'}),
    contraseña: z.string().min(10, {message:'Minimo 10 caracteres'}).max(255, {message:'Maximo 255 caracteres'}),
    identificacion_id: z.int().positive(),
    numero_celular: z.string({message: 'El nuemero de celular es obligatorio'}).min(10,{message:'El número de celular debe tener al menos 10 dígitos.'}).max(20,{message:'El número de celular no puede exceder los 15 dígitos.'}).regex(/^\d+$/,{message:'El número de celular solo puede contener dígitos.'})
})

export function validateUser(object){
    return userSchema.safeParse(object)
}