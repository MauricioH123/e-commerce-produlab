import { capitalizeWords } from "../utils/stringUtils.js";

type Address={
    ciudad:string,
    barrio:string,
    direccion:string
    codigo_postal:string
}

export function createAddressDTO(objeto:Address){
    
    return {
        ciudad: capitalizeWords(objeto.ciudad),
        barrio: capitalizeWords(objeto.barrio),
        direccion: capitalizeWords(objeto.direccion),
        codigo_postal: capitalizeWords(objeto.codigo_postal)
    }
}