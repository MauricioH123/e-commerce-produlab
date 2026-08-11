import multer from "multer";

const storage = multer.memoryStorage()

export const uploadProductPhotos = multer({
    storage,
    limits:{
        files: 4,
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if(!file.mimetype.startsWith("image/")){
            return callback(new Error('Solo se permiten imagenes'))
        }

        callback(null, true)
    }
})