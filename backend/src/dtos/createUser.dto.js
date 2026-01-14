import { capitalizeWords } from "../utils/stringUtils.js";

export function createUserDTO(data){
    return {
        nombre: capitalizeWords(data.nombre),
        correo: data.correo.trim().toLowerCase(),
        numero_identificacion: data.numero_identificacion,
        contraseña: data.contraseña,
        identificacion_id: data.identificacion_id,
        numero_celular: data.numero_celular
    }
}