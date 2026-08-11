import cloudinary from "../config/cloudinary.js";

type UploadedImage = {
    secure_url: string;
    public_id: string;
}

export class StorageService {

    static async uploadImage(buffer: Buffer, folder: string = 'products'): Promise<UploadedImage> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto"
                        }
                    ]
                },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    }

                    if (!result) {
                        return reject(new Error('Cloudinary no devolvió información'))
                    }

                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id
                    })
                }
            )

            uploadStream.end(buffer)
        })

    }

    static async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId)
    }
}