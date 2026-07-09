import dotenv from "dotenv"

dotenv.config()



export const env = {
    CLIENT_URL: process.env.CLIENT_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    MAIL_SECRET: process.env.JWT_SECRET_MAIL,
    JWT_SECRET: process.env.JWT_SECRET_USER,
    CLOUDINARY_API: process.env.CLOUDINARY_API,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
}
















