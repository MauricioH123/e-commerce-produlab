import { capitalizeWords } from "../utils/stringUtils.js";

export function createUserDTO(objeto){
    return {
        nombre: capitalizeWords(objeto.nombre),
        correo: objeto.correo.trim().toLowerCase(),
        numero_identificacion: objeto.numero_identificacion,
        contraseña: objeto.contraseña,
        identificacion_id: objeto.identificacion_id,
        numero_celular: objeto.numero_celular
    }
}