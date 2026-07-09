import { CustomError } from "../utils/customeError.js"
import { uploadImage } from "../services/cloudinary.service.js";
import { updateUser } from "../services/user.database.service.js";

export const updateAvatar = async (req, res) => {

    try {
        if (!req.file) {
            throw new CustomError("File was not Sent", 400)
        }

        // * here file upload

        const upload = await uploadImage(
            req.file.buffer,
            "avatars"
        );


        const updatedUser = await updateUser(req.userId, {
            avatarUrl: upload.url,
        })


        res.status(200).json({
            success: true,
            message: "Avatar Image Updated successfully",
            user: {
                username: updatedUser.username,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                company: updatedUser.company,
                jobTitle: updatedUser.jobTitle,
                avatar: updatedUser.avatarUrl,
                cover: updatedUser.coverImageUrl,
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt,
            }
        })



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export const updateCover = async (req, res) => {

    try {
        if (!req.file) {
            throw new CustomError("File was not Sent", 400)
        }

        // * here file upload

        const upload = await uploadImage(
            req.file.buffer,
            "cover"
        );


        const updatedUser = await updateUser(req.userId, {
            coverImageUrl: upload.url,
        })


        res.status(200).json({
            success: true,
            message: "Avatar Image Updated successfully",
            user: {
                username: updatedUser.username,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                company: updatedUser.company,
                jobTitle: updatedUser.jobTitle,
                avatar: updatedUser.avatarUrl,
                cover: updatedUser.coverImageUrl,
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt,
            }
        })



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


export const updateMe = async (req, res) => {


    try {

        // console.log(req.body);
        // console.log(req.userId);

        const data = {
            username: req.body.name,
            jobTitle: req.body.title,
            bio: req.body.bio
        }
        const updatedUser = await updateUser(req.userId, data)
        console.log("Updated data");

        console.log(updatedUser);


        res.status(200).json({
            success: true,
            message: "update user successful",
            user: {
                username: updatedUser.username,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                company: updatedUser.company,
                jobTitle: updatedUser.jobTitle,
                avatar: updatedUser.avatarUrl,
                cover: updatedUser.coverImageUrl,
                bio: updatedUser.bio,
                createdAt: updatedUser.createdAt,
            }
        })


    } catch (error) {
        console.log(error.message);

        res.status(403).json({
            success: false,
            message: error.message,
        })
    }
}












