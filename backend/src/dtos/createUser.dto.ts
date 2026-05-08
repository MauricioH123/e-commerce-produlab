import { capitalizeWords } from "../utils/stringUtils.js";

type User = {
    nombre: string,
    correo: string,
    numero_identificacion: string,
    contraseña: string,
    identificacion_id: number,
    numero_celular: string
}

export function createUserDTO(objeto:User){
    return {
        nombre: capitalizeWords(objeto.nombre),
        correo: objeto.correo.trim().toLowerCase(),
        numero_identificacion: objeto.numero_identificacion,
        contraseña: objeto.contraseña,
        identificacion_id: objeto.identificacion_id,
        numero_celular: objeto.numero_celular
    }
}