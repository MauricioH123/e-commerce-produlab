import { capitalizeWords } from "../utils/stringUtils.js";

type Address = {
    ciudad: string,
    barrio: string,
    direccion: string
    codigo_postal: string
}

export type TAddress = {
    id: number,
    neighborhood: string,
    address: string,
    user_id: string,
    department_id: number,
    municipality_id: number,
    instruction: string
}

export type AddressUpdate = {
    id: number,
    neighborhood?: string,
    address?: string,
    user_id?: string,
    department_id?: number,
    municipality_id?: number,
    instructions?: string
}

export function updateAddress(object: Omit<AddressUpdate, 'id'>): Omit<AddressUpdate, 'id' | 'user_id'> {
    return {
        ...(object.neighborhood && { neighborhood: capitalizeWords(object.neighborhood) }),
        ...(object.address && { address: capitalizeWords(object.address) }),
        ...(object.department_id && { department_id: object.department_id }),
        ...(object.municipality_id && { municipality_id: object.municipality_id }),
        ...(object.instructions && { instructions: capitalizeWords(object.instructions) })
    }
}

export function createAddressDTO(objeto: Address) {

    return {
        ciudad: capitalizeWords(objeto.ciudad),
        barrio: capitalizeWords(objeto.barrio),
        direccion: capitalizeWords(objeto.direccion),
        codigo_postal: capitalizeWords(objeto.codigo_postal)
    }
}