import { capitalizeWords } from "../utils/stringUtils.js";

export function createAddressDTO(objeto){
    
    return {
        ciudad: capitalizeWords(objeto.ciudad),
        barrio: capitalizeWords(objeto.barrio),
        direccion: capitalizeWords(objeto.direccion),
        codigo_postal: capitalizeWords(objeto.codigo_postal)
    }
}