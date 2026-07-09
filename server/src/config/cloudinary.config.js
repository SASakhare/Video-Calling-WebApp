import { v2 as cloudinary } from "cloudinary"
import { env } from "./env.js"



cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});



export default cloudinary;



