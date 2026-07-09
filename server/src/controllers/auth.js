import { v4 as uuidv4 } from "uuid"
import { nanoid } from "nanoid"
import { hashPassword, verifyPassword } from "../utils/password.js"
import { createUser, getUserByEmail, getUserByUserId, updateUser } from "../services/user.database.js"
import { createToken } from "../services/jwt.js"
import { CustomError } from "../utils/customeError.js"


export const login = async (req, res) => {

    // console.log(req.body);

    try {

        const data = req.body;

        const user = await getUserByEmail(data.email);

        const passwordVerify = await verifyPassword(user.passwordHash, data.password);

        if (!passwordVerify) {
            throw new CustomError("Email or Password Wrong", 401)
        }

        const jwtToken = createToken(user.userId);

        res.cookie('token', jwtToken, {
            maxAge: 24 * 60 * 60 * 1000, // Expires after 15 minutes (in milliseconds)
            httpOnly: true, // Prevents client-side JS access (XSS protection)
            secure: false,   // Only sent over HTTPS
            sameSite: 'lax' // CSRF protection
        }
        )
        res.status(200).json({
            success: true,
            message: "login successful",
            user: {
                username: user.username,
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                jobTitle: user.jobTitle,
                avatar: user.avatarUrl,
                cover: user.coverImageUrl,
                bio: user.bio,
                createdAt: user.createdAt,
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


export const register = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);

        const hash_password = await hashPassword(data.password);

        const user = {
            username: `${data.first_name}-${data.last_name}-${nanoid(6)}`,
            firstName: data.first_name,
            lastName: data.last_name,
            userId: uuidv4(),
            email: data.email,
            emailVerified: false,
            passwordHash: hash_password,
            avatarUrl: null,
            coverImageUrl: null,
            bio: null,
            company: data.company,
            jobTitle: data.job_title,
            status: "INACTIVE",
            lastLoginAt: null,
            verificationToken: null,
            verificationExpiresAt: null
        }

        await createUser(user);

        res.status(200).json({
            success: true,
            message: "user register successfully"
        })

    } catch (error) {
        console.log(error.message);

        res.status(403).json({
            success: false,
            message: error.message,
        })
    }
}





export const logout = async (req, res) => {

    // console.log(req.body);

    try {

        console.log(req.cookies.token);

        res.clearCookie("token")

        res.status(200).json({
            success: true,
            message: "logout successful"
        })


    } catch (error) {
        console.log(error.message);

        res.status(403).json({
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
























