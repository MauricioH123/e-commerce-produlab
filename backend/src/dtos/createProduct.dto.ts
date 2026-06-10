import { normalizePhotos } from "../utils/normalizePhotos.js"
import { capitalizeWords } from "../utils/stringUtils.js"

export type ProductPhoto = {
    url: string,
    order: number,
    is_main: boolean
}

export type ProductS = {
    name: string,
    description: string,
    photo: ProductPhoto[],
    category_id: number,
    state: boolean,
    iva: boolean,
    price: number,
    brand_id: number
}

export function createProduct(objet: ProductS): ProductS {
    return {
        name: capitalizeWords(objet.name),
        description: capitalizeWords(objet.description),
        photo: normalizePhotos(objet.photo),
        category_id: objet.category_id,
        state: objet.state,
        iva: objet.iva,
        price: objet.price,
        brand_id: objet.brand_id
    }
}

export function updateProduct(object: Partial<ProductS>): Partial<ProductS> {
    return {
        ...(object.name && { name: capitalizeWords(object.name) }),
        ...(object.description && { description: capitalizeWords(object.description) }),
        ...(object.photo && { photo: normalizePhotos(object.photo) }),
        ...(object.category_id && { category_id: object.category_id }),
        ...(object.state !== undefined && { state: object.state }),
        ...(object.iva !== undefined && { iva: object.iva }),
        ...(object.price && { price: object.price }),
        ...(object.brand_id && { brand_id: object.brand_id })
    }
}