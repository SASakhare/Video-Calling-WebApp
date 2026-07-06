import jwt from "jsonwebtoken"
import { env } from "../utils/env.js"
import { CustomError } from "../utils/customeError.js"



export const createToken = (userId, email = false) => {

    const token = jwt.sign(
        {
            userId
        },
        email ? env.MAIL_SECRET : env.JWT_SECRET,
        {
            expiresIn:email ? "15m" : "1d",// * Expires in 15 minutes
        }
    )

    return token

}

export const verifyToken = (token, email = false) => {

    try {

        const decoded = jwt.verify(
            token,
            email ? env.MAIL_SECRET : env.JWT_SECRET,
        )

        return decoded.userId;

    } catch (error) {

        if (error.name == 'TokenExpiredError') {
            throw new CustomError("Verification link has expired.Please request a new one", 410);
        }

        throw new CustomError("Invalid verification link", 400);
    }

}




























