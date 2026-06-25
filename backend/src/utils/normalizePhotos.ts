// import { ProductPhoto } from "../dtos/createProduct.dto.js";

// export function normalizePhotos(photos: ProductPhoto[]): ProductPhoto[]{
//     if(!Array.isArray(photos) || photos.length === 0) return []
    
//     return photos.map( (photo, index) => ({
//         url: photo.url.trim(),
//         order: photo.order ?? index,
//         is_main: photo.is_main ?? index === 0
//     }))
// }