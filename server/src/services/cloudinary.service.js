import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";



export const uploadImage = async (buffer, folder) => {

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Upload Failed"));
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });

}


export const deleteImage = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
}




















