import { verifyToken } from "../services/jwt.service.js";
import { getUserByUserId } from "../services/user.database.service.js";


export const get_user = async (req, res, next) => {

    try {

        const userId = verifyToken(req.cookies.token);

        await getUserByUserId(userId);

        req.userId = userId;

        next();
    } catch (error) {
        console.log(error.message);

        res.status(403).json({
            success: false,
            message: error.message,
        })
    }
}
































