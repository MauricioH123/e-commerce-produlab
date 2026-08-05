import { capitalizeWords } from "../utils/stringUtils.js"

export type CreateBrand = {
    name: string
}

export type TBrand = {
    id: number,
    name: string
}

export function createBrandDTO(object: CreateBrand) {
    return {
        name: capitalizeWords(object.name)
    }
}

export function updateBrandDTO(object: TBrand) {
    return {
        id: object.id,
        name: capitalizeWords(object.name)
    }
}