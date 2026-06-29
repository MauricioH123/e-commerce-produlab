// import { normalizePhotos } from "../utils/normalizePhotos.js"
import { capitalizeWords } from "../utils/stringUtils.js"

export type ProductPhoto = {
    url: string,
    order: number,
    is_main: boolean,
    alt_text: string,
}

export type ProductMain = {
    id: number,
    name: string,
    category: string,
    iva: boolean,
    price: number,
    brand: string,
    id_image: number,
    url: string,
    alt_text: string
}

export type TProduct = {
    id: number,
    name: string,
    description: string,
    category_id: number,
    photos: ProductPhoto[]
    state: boolean,
    iva: boolean,
    price: number,
    brand_id: number
}

export function createProductDTO(objet: Omit<TProduct, 'id'>): Omit<TProduct, 'id'> {
    return {
        name: capitalizeWords(objet.name),
        description: capitalizeWords(objet.description),
        category_id: objet.category_id,
        photos: objet.photos,
        state: objet.state,
        iva: objet.iva,
        price: objet.price,
        brand_id: objet.brand_id
    }
}

export function updateProductDTO(object: Partial<TProduct>): Partial<TProduct> {
    return {
        ...(object.name && { name: capitalizeWords(object.name) }),
        ...(object.description && { description: capitalizeWords(object.description) }),
        ...(object.photos && { photos: object.photos }),
        ...(object.category_id && { category_id: object.category_id }),
        ...(object.state !== undefined && { state: object.state }),
        ...(object.iva !== undefined && { iva: object.iva }),
        ...(object.price !== undefined && { price: object.price }),
        ...(object.brand_id && { brand_id: object.brand_id })
    }
}