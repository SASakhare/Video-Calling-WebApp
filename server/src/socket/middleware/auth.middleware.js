import cookie from "cookie";
import { verifyToken } from "../../services/jwt.service.js" ;
export const socketAuthMiddleware = (socket, next) => {
    try {
        const cookies = cookie.parse(
            socket.handshake.headers.cookie || ""
        );

        const token = cookies.token;

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const userId = verifyToken(token);

        socket.data.userId = userId;

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};